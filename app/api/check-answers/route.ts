import { NextRequest, NextResponse } from "next/server"
import { questions } from "@/data/questions"
import { createHmac } from "crypto"

function generateToken(secret: string): string {
  const timestamp = Date.now().toString()
  const payload = `pass:${timestamp}`
  const hmac = createHmac("sha256", secret).update(payload).digest("hex")
  return `${timestamp}.${hmac}`
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Respostas inválidas" }, { status: 400 })
  }

  const { answers } = body as { answers?: unknown }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json({ error: "Respostas inválidas" }, { status: 400 })
  }

  const answersMap = answers as Record<string, unknown>

  let correct = 0
  for (const q of questions) {
    if (answersMap[q.id] === q.answer) correct++
  }

  const total = questions.length
  const score = Math.round((correct / total) * 100)
  const passed = score >= 70

  // Issue a short-lived signed token only when the user actually passes.
  // generate-certificate will verify this token before issuing any certificate.
  const secret = process.env.CERT_SECRET
  let token: string | undefined
  if (passed && secret) {
    token = generateToken(secret)
  }

  return NextResponse.json({ correct, total, score, passed, token })
}
