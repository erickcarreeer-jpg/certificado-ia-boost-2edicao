import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

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

  const { email } = body as { email?: unknown }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  // Check if email is in the eligible list
  const eligible = await sql`
    SELECT email FROM eligible_students WHERE email = ${normalizedEmail}
  `

  if (eligible.length === 0) {
    return NextResponse.json(
      { eligible: false, message: "E-mail não encontrado na lista de inscritos." },
      { status: 200 }
    )
  }

  // Check if student already completed the quiz
  const existing = await sql`
    SELECT email, name, score, correct, total, passed, token
    FROM quiz_results
    WHERE email = ${normalizedEmail}
  `

  if (existing.length > 0 && existing[0].passed) {
    return NextResponse.json({
      eligible: true,
      alreadyPassed: true,
      result: {
        email: existing[0].email,
        name: existing[0].name,
        score: existing[0].score,
        correct: existing[0].correct,
        total: existing[0].total,
        token: existing[0].token,
      },
    })
  }

  return NextResponse.json({ eligible: true, alreadyPassed: false })
}
