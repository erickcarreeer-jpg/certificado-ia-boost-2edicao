"use client"

type Props = {
  score: number
  correct: number
  total: number
  onRetry: () => void
}

export default function ResultFailed({ score, correct, total, onRetry }: Props) {
  const missing = 7 - correct

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
        style={{ backgroundColor: 'rgba(255,94,64,0.1)', border: '1px solid rgba(255,94,64,0.25)' }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 7v5M11 15h.01" stroke="#FF5E40" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="11" cy="11" r="9" stroke="#FF5E40" strokeWidth="1.8"/>
        </svg>
      </div>

      <p
        className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
        style={{ color: 'rgba(255,94,64,0.8)' }}
      >
        Não aprovado
      </p>
      <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Quase lá!</h2>
      <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Faltaram <span className="text-white font-semibold">{missing} {missing === 1 ? 'acerto' : 'acertos'}</span> para você ser aprovado.
      </p>

      {/* Score card */}
      <div
        className="rounded-2xl p-8 mb-6"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Score number */}
        <div
          className="text-7xl font-black mb-1 tracking-tight"
          style={{ color: 'rgba(255,255,255,0.12)' }}
        >
          {score}%
        </div>

        {/* Progress bar */}
        <div
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

        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {correct} de {total} questões corretas · mínimo 70%
        </p>
      </div>

      {/* Retry button */}
      <button
        onClick={onRetry}
        className="w-full py-3.5 rounded-full font-bold text-sm transition-all"
        style={{
          backgroundColor: '#fff',
          color: '#0D0D0E',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.15)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 0 0 1px rgba(255,255,255,0.3), 0 12px 40px rgba(114,26,231,0.3)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.15)'
        }}
      >
        Tentar novamente
      </button>
    </div>
  )
}
