import { NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import sharp from "sharp"
import { PDFDocument } from "pdf-lib"
import satori from "satori"
import { createElement } from "react"

const NAME_X = 290
const NAME_Y = 275
const NAME_FONT_SIZE = 38

const DATE_X = 290
const DATE_Y = 630
const DATE_FONT_SIZE = 22

const CERT_WIDTH = 1280
const CERT_HEIGHT = 904

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

export async function POST(req: NextRequest) {
  const { name, format } = await req.json()

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Nome inválido" }, { status: 400 })
  }

  if (format !== "png" && format !== "pdf") {
    return NextResponse.json({ error: "Formato inválido" }, { status: 400 })
  }

  const trimmedName = name.trim().slice(0, 80)
  const date = formatDate()

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
