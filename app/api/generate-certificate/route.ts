import { NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import sharp from "sharp"
import { PDFDocument } from "pdf-lib"
import satori from "satori"
import { createElement } from "react"
import { createHmac, timingSafeEqual } from "crypto"
import { sql } from "@/lib/db"

// ── Certificate layout constants ────────────────────────────────────────────
const NAME_X = 290
const NAME_Y = 275
const NAME_FONT_SIZE = 38

const DATE_X = 290
const DATE_Y = 630
const DATE_FONT_SIZE = 22

const CERT_WIDTH = 1280
const CERT_HEIGHT = 904

// ── Token verification ───────────────────────────────────────────────────────
const TOKEN_TTL_MS = 30 * 60 * 1000 // 30 minutes

function verifyToken(token: string, secret: string): boolean {
  const parts = token.split(".")
  if (parts.length !== 2) return false

  const [timestamp, hmac] = parts
  const ts = parseInt(timestamp, 10)
  if (!Number.isFinite(ts)) return false

  // Reject expired tokens
  if (Date.now() - ts > TOKEN_TTL_MS) return false

  const payload = `pass:${timestamp}`
  const expected = createHmac("sha256", secret).update(payload).digest("hex")

  // Constant-time comparison to prevent timing attacks
  try {
    return timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expected, "hex"))
  } catch {
    return false
  }
}

// ── Input sanitization ──────────────────────────────────────────────────────
// Allow Unicode letters/marks, spaces, hyphens, apostrophes, dots — strip everything else
function sanitizeName(raw: string): string {
  return raw
    .trim()
    .replace(/[^\p{L}\p{M}\s\-'.]/gu, "")
    .replace(/\s+/g, " ")
    .slice(0, 80)
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(): string {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

async function createTextOverlayPng(name: string, date: string): Promise<Buffer> {
  const fontPath = join(
    process.cwd(),
    "node_modules/@fontsource/playfair-display/files",
    "playfair-display-latin-600-normal.woff"
  )
  const fontData = readFileSync(fontPath)

  const element = createElement(
    "div",
    { style: { width: `${CERT_WIDTH}px`, height: `${CERT_HEIGHT}px`, position: "relative", display: "flex" } },
    createElement("span", {
      style: {
        position: "absolute",
        left: `${NAME_X}px`,
        top: `${NAME_Y - NAME_FONT_SIZE}px`,
        fontSize: `${NAME_FONT_SIZE}px`,
        fontWeight: 600,
        fontFamily: "Playfair Display",
        color: "#1a1a2e",
        whiteSpace: "nowrap",
      },
    }, name),
    createElement("span", {
      style: {
        position: "absolute",
        left: `${DATE_X}px`,
        top: `${DATE_Y - DATE_FONT_SIZE}px`,
        fontSize: `${DATE_FONT_SIZE}px`,
        fontFamily: "Playfair Display",
        color: "#444444",
        whiteSpace: "nowrap",
      },
    }, date)
  )

  const textSvg = await satori(element, {
    width: CERT_WIDTH,
    height: CERT_HEIGHT,
    fonts: [{ name: "Playfair Display", data: fontData, weight: 600, style: "normal" }],
  })

  return sharp(Buffer.from(textSvg)).png().toBuffer()
}

// ── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })
  }

  const { name, format, token, email } = body as {
    name?: unknown
    format?: unknown
    token?: unknown
    email?: unknown
  }

  // ── Authorization: token (fresh pass) OR email with passed=true in DB ──────
  const secret = process.env.CERT_SECRET
  let authorizedByDb = false

  if (email && typeof email === "string") {
    const normalizedEmail = email.trim().toLowerCase()
    const rows = await sql`
      SELECT passed FROM quiz_results WHERE email = ${normalizedEmail} AND passed = true
    `
    if (rows.length > 0) authorizedByDb = true
  }

  if (!authorizedByDb && secret) {
    if (
      !token ||
      typeof token !== "string" ||
      !verifyToken(token, secret)
    ) {
      return NextResponse.json(
        { error: "Não autorizado. Complete a prova para emitir o certificado." },
        { status: 403 }
      )
    }
  }

  // ── Input validation ───────────────────────────────────────────────────────
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Nome inválido" }, { status: 400 })
  }

  if (format !== "png" && format !== "pdf") {
    return NextResponse.json({ error: "Formato inválido" }, { status: 400 })
  }

  const trimmedName = sanitizeName(name)
  if (trimmedName.length < 2) {
    return NextResponse.json({ error: "Nome inválido" }, { status: 400 })
  }

  // If authorized via DB (reissue), update the stored name
  if (authorizedByDb && email && typeof email === "string") {
    const normalizedEmail = email.trim().toLowerCase()
    await sql`
      UPDATE quiz_results SET name = ${trimmedName} WHERE email = ${normalizedEmail}
    `
  }

  const date = formatDate()

  // ── Certificate generation ─────────────────────────────────────────────────
  const templatePath = join(process.cwd(), "public", "certificate-template.svg")
  const svgContent = readFileSync(templatePath, "utf-8")

  const basePng = await sharp(Buffer.from(svgContent))
    .resize({ width: CERT_WIDTH })
    .png()
    .toBuffer()

  const textPng = await createTextOverlayPng(trimmedName, date)

  const pngBuffer = await sharp(basePng)
    .composite([{ input: textPng, blend: "over" }])
    .png()
    .toBuffer()

  if (format === "png") {
    return new NextResponse(pngBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="certificado-ia-boost.png"`,
      },
    })
  }

  // PDF
  const pdfDoc = await PDFDocument.create()
  const pngImage = await pdfDoc.embedPng(pngBuffer)
  const { width, height } = pngImage.scale(1)
  const page = pdfDoc.addPage([width, height])
  page.drawImage(pngImage, { x: 0, y: 0, width, height })
  const pdfBytes = await pdfDoc.save()

  return new NextResponse(pdfBytes.buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-ia-boost.pdf"`,
    },
  })
}
