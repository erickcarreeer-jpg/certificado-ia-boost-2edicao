import { NextRequest, NextResponse } from "next/server"
import { questions } from "@/data/questions"
import { createHmac } from "crypto"
import { sql } from "@/lib/db"

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

  const { answers, email, name } = body as {
    answers?: unknown
    email?: unknown
    name?: unknown
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json({ error: "Respostas inválidas" }, { status: 400 })
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 })
  }

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Nome inválido" }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const trimmedName = name.trim()

  // Confirm the email is still eligible (security: re-check on submit)
  const eligible = await sql`
    SELECT email FROM eligible_students WHERE email = ${normalizedEmail}
  `
  if (eligible.length === 0) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }

  const answersMap = answers as Record<string, unknown>

  let correct = 0
  for (const q of questions) {
    if (answersMap[q.id] === q.answer) correct++
  }

  const total = questions.length
  const score = Math.round((correct / total) * 100)
  const passed = score >= 70

  const secret = process.env.CERT_SECRET
  let token: string | undefined
  if (passed && secret) {
    token = generateToken(secret)
  }

  // Save or update result in DB
  await sql`
    INSERT INTO quiz_results (email, name, score, correct, total, passed, token)
    VALUES (${normalizedEmail}, ${trimmedName}, ${score}, ${correct}, ${total}, ${passed}, ${token ?? null})
    ON CONFLICT (email) DO UPDATE
      SET name    = EXCLUDED.name,
          score   = EXCLUDED.score,
          correct = EXCLUDED.correct,
          total   = EXCLUDED.total,
          passed  = EXCLUDED.passed,
          token   = EXCLUDED.token,
          taken_at = now()
  `

  return NextResponse.json({ correct, total, score, passed, token })
}
