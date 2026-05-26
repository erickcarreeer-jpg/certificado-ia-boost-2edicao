"use client"

import { useEffect, useRef } from "react"

type Props = {
  score: number
  correct: number
  total: number
  onRetry: () => void
}

export default function ResultFailed({ score, correct, total, onRetry }: Props) {
  const missing = 7 - correct
  const headingRef = useRef<HTMLHeadingElement>(null)

  // WCAG 2.4.3 + 4.1.3 — Foco e anúncio do resultado ao chegar na tela
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    // WCAG 4.1.3 — role=status anuncia o resultado para leitores de tela
    <div
      className="w-full max-w-xl mx-auto text-center"
      role="status"
      aria-label={`Resultado: não aprovado. Você acertou ${correct} de ${total} questões (${score}%). Precisava de 70%.`}
    >
      {/* Ícone decorativo */}
      <div
        aria-hidden="true"
        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
        style={{ backgroundColor: 'rgba(255,94,64,0.1)', border: '1px solid rgba(255,94,64,0.25)' }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false">
          <path d="M11 7v5M11 15h.01" stroke="#FF5E40" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="11" cy="11" r="9" stroke="#FF5E40" strokeWidth="1.8"/>
        </svg>
      </div>

      <p
        className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
        style={{ color: 'rgba(255,94,64,0.8)' }}
        aria-hidden="true"
      >
        Não aprovado
      </p>

      {/* WCAG 2.4.3 — tabIndex=-1 permite foco via useEffect */}
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-3xl font-black text-white mb-2 tracking-tight outline-none"
      >
        Quase lá!
      </h2>
      <p className="text-sm mb-10" style={{ color: 'var(--ds-text-subtle)' }}>
        Faltaram{' '}
        <span className="text-white font-semibold">
          {missing} {missing === 1 ? 'acerto' : 'acertos'}
        </span>{' '}
        para você ser aprovado.
      </p>

      {/* Card de pontuação */}
      <div
        className="rounded-2xl p-8 mb-6"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* WCAG 1.1.1 + contexto semântico para o número de pontuação */}
        <div
          className="text-7xl font-black mb-1 tracking-tight"
          aria-label={`Sua pontuação: ${score}%`}
          style={{ color: 'rgba(255,255,255,0.15)' }}
        >
          {score}%
        </div>

        {/* WCAG 4.1.2 — Barra de pontuação com role progressbar */}
        <div
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Pontuação: ${score}% — mínimo necessário: 70%`}
          className="w-full h-1 rounded-full my-5 overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${score}%`,
              backgroundColor: score >= 70 ? 'var(--ds-purple)' : 'rgba(255,94,64,0.7)',
            }}
          />
        </div>

        <p className="text-sm" style={{ color: 'var(--ds-text-subtle)' }} aria-hidden="true">
          {correct} de {total} questões corretas · mínimo 70%
        </p>
      </div>

      {/* Botão de nova tentativa */}
      <button
        onClick={onRetry}
        aria-label="Tentar novamente — reiniciar a prova"
        className="w-full py-3.5 rounded-full font-bold text-sm transition-all"
        style={{
          backgroundColor: '#fff',
          color: '#0D0D0E',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.15)',
        }}
      >
        Tentar novamente
      </button>
    </div>
  )
}
