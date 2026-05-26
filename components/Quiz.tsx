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
  const progress = ((current + 1) / questions.length) * 100

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
      <div className="mb-8">
        <div className="flex justify-between text-xs mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <span>Questão {current + 1} de {questions.length}</span>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>{Math.round(progress)}%</span>
        </div>
        <div
          className="w-full h-px relative overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="absolute left-0 top-0 h-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: 'var(--ds-purple)' }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        className="rounded-2xl p-8 mb-5"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <p className="text-white text-lg leading-relaxed font-semibold mb-7">
          {q.text}
        </p>

        <div className="flex flex-col gap-2.5">
          {q.options.map((opt) => {
            const isSelected = selected === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => select(opt.key)}
                className="w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all duration-150"
                style={{
                  border: isSelected
                    ? '1px solid var(--ds-purple)'
                    : '1px solid rgba(255,255,255,0.07)',
                  backgroundColor: isSelected
                    ? 'rgba(114,26,231,0.12)'
                    : 'rgba(255,255,255,0.02)',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.18)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'
                  }
                }}
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                  style={{
                    backgroundColor: isSelected ? 'var(--ds-purple)' : 'rgba(255,255,255,0.07)',
                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {opt.key}
                </span>
                <span className="pt-0.5 leading-snug text-sm">{opt.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {current > 0 && (
          <button
            onClick={prev}
            className="px-6 py-3 rounded-full text-sm font-medium transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.5)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'
            }}
          >
            ← Voltar
          </button>
        )}
        <button
          onClick={next}
          disabled={!selected}
          className="flex-1 py-3 rounded-full font-bold text-sm transition-all"
          style={
            selected
              ? {
                  backgroundColor: '#fff',
                  color: '#0D0D0E',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.2)',
                  cursor: 'pointer',
                }
              : {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.2)',
                  cursor: 'not-allowed',
                }
          }
        >
          {isLast ? 'Enviar respostas' : 'Próxima questão'}
        </button>
      </div>
    </div>
  )
}
