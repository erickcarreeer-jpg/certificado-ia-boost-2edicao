"use client"

import { useState, useEffect, useRef } from "react"
import { Question } from "@/data/questions"

type Props = {
  questions: Question[]
  onComplete: (answers: Record<number, string>) => void
}

export default function Quiz({ questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const questionRef = useRef<HTMLParagraphElement>(null)

  const q = questions[current]
  const selected = answers[q.id]
  const isLast = current === questions.length - 1
  const progress = ((current + 1) / questions.length) * 100

  // WCAG 2.4.3 — Gerenciar foco ao trocar de questão
  useEffect(() => {
    questionRef.current?.focus()
  }, [current])

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

      {/* WCAG 4.1.2 — Barra de progresso com ARIA */}
      <div className="mb-8">
        <div
          className="flex justify-between text-xs mb-3"
          aria-hidden="true"
          style={{ color: 'var(--ds-text-subtle)' }}
        >
          <span>Questão {current + 1} de {questions.length}</span>
          <span style={{ color: 'var(--ds-text-muted)' }}>{Math.round(progress)}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={current + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label={`Progresso: questão ${current + 1} de ${questions.length}`}
          className="w-full h-px relative overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="absolute left-0 top-0 h-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: 'var(--ds-purple)' }}
          />
        </div>
      </div>

      {/* Questão */}
      <div
        className="rounded-2xl p-8 mb-5"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* WCAG 2.4.3 — Foco programático ao trocar questão; tabIndex=-1 permite foco via JS */}
        <p
          id="question-text"
          ref={questionRef}
          tabIndex={-1}
          className="text-white text-lg leading-relaxed font-semibold mb-7 outline-none"
        >
          {q.text}
        </p>

        {/* WCAG 4.1.2 — Grupo de opções com role radiogroup */}
        <div
          role="radiogroup"
          aria-labelledby="question-text"
          aria-required="true"
          className="flex flex-col gap-2.5"
        >
          {q.options.map((opt) => {
            const isSelected = selected === opt.key
            return (
              <button
                key={opt.key}
                role="radio"
                aria-checked={isSelected}
                onClick={() => select(opt.key)}
                className="w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all duration-150"
                style={{
                  border: isSelected
                    ? '1px solid var(--ds-purple)'
                    : '1px solid rgba(255,255,255,0.07)',
                  backgroundColor: isSelected
                    ? 'rgba(114,26,231,0.12)'
                    : 'rgba(255,255,255,0.02)',
                  color: isSelected ? '#fff' : 'var(--ds-text-subtle)',
                }}
              >
                <span
                  aria-hidden="true"
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

      {/* Navegação */}
      <div className="flex gap-3">
        {current > 0 && (
          <button
            onClick={prev}
            aria-label={`Voltar para questão ${current}`}
            className="px-6 py-3 rounded-full text-sm font-medium transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--ds-text-muted)',
              background: 'transparent',
            }}
          >
            ← Voltar
          </button>
        )}
        <button
          onClick={next}
          disabled={!selected}
          aria-disabled={!selected}
          aria-label={
            !selected
              ? 'Selecione uma alternativa para continuar'
              : isLast
              ? 'Enviar respostas da prova'
              : `Ir para questão ${current + 2}`
          }
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
                  color: 'rgba(255,255,255,0.3)',
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
