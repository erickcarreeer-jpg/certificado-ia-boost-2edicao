import { NextRequest, NextResponse } from "next/server"
import { questions } from "@/data/questions"

export async function POST(req: NextRequest) {
  const { answers } = await req.json()

  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Respostas inválidas" }, { status: 400 })
  }

  let correct = 0
  for (const q of questions) {
    if (answers[q.id] === q.answer) correct++
  }

  const total = questions.length
  const score = Math.round((correct / total) * 100)
  const passed = score >= 70

  return NextResponse.json({ correct, total, score, passed })
}
