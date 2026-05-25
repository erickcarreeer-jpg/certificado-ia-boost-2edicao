"use client"

import { useState } from "react"
import { Question } from "@/data/questions"

type Props = {
  questions: Question[]
  onComplete: (answers: Record<number, string>) => void
}

export default function Quiz({ questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const q = questions[current]
  const selected = answers[q.id]
  const isLast = current === questions.length - 1

  function select(key: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: key }))
  }

  function next() {
    if (!selected) return
    if (isLast) {
      onComplete({ ...answers, [q.id]: selected })
    } else {
      setCurrent((c) => c + 1)
    }
  }

  function prev() {
    if (current > 0) setCurrent((c) => c - 1)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Questão {current + 1} de {questions.length}</span>
          <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
        <p className="text-white text-lg leading-relaxed font-medium mb-8">
          {q.text}
        </p>

        <div className="space-y-3">
          {q.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => select(opt.key)}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                selected === opt.key
                  ? "border-purple-500 bg-purple-500/20 text-white"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <span
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  selected === opt.key
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {opt.key}
              </span>
              <span className="pt-0.5 leading-snug">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {current > 0 && (
          <button
            onClick={prev}
            className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition-colors"
          >
            Voltar
          </button>
        )}
        <button
          onClick={next}
          disabled={!selected}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            selected
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 cursor-pointer"
              : "bg-white/10 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLast ? "Enviar respostas" : "Próxima questão"}
        </button>
      </div>
    </div>
  )
}
