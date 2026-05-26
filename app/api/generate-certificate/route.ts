import { NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import sharp from "sharp"
import { PDFDocument } from "pdf-lib"

const NAME_X = 290
const NAME_Y = 275
const NAME_FONT_SIZE = 38

const DATE_X = 290
const DATE_Y = 630
const DATE_FONT_SIZE = 22

function formatDate(): string {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function loadFontAsBase64(): string {
  const fontPath = join(
    process.cwd(),
    "node_modules/@fontsource/playfair-display/files",
    "playfair-display-latin-600-normal.woff"
  )
  return readFileSync(fontPath).toString("base64")
}

function injectTextIntoSvg(svgContent: string, name: string): string {
  const date = formatDate()
  const fontBase64 = loadFontAsBase64()

  const fontFace = `
  <defs>
    <style>
      @font-face {
        font-family: 'PlayfairDisplay';
        src: url('data:font/woff;base64,${fontBase64}') format('woff');
        font-weight: 600;
      }
    </style>
  </defs>`

  const nameElement = `
  <text
    x="${NAME_X}"
    y="${NAME_Y}"
    font-family="PlayfairDisplay, Georgia, serif"
    font-size="${NAME_FONT_SIZE}"
    font-weight="600"
    fill="#1a1a2e"
    text-anchor="start"
  >${escapeXml(name)}</text>`

  const dateElement = `
  <text
    x="${DATE_X}"
    y="${DATE_Y}"
    font-family="PlayfairDisplay, Georgia, serif"
    font-size="${DATE_FONT_SIZE}"
    fill="#444444"
    text-anchor="start"
  >${escapeXml(date)}</text>`

  return svgContent
    .replace("<svg", `<svg`)
    .replace(/<defs>/, `${fontFace}<defs>`)
    .replace("</svg>", `${nameElement}${dateElement}</svg>`)
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
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

  const templatePath = join(process.cwd(), "public", "certificate-template.svg")
  const svgContent = readFileSync(templatePath, "utf-8")
  const modifiedSvg = injectTextIntoSvg(svgContent, trimmedName)

  const pngBuffer = await sharp(Buffer.from(modifiedSvg))
    .resize({ width: 1280 })
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
