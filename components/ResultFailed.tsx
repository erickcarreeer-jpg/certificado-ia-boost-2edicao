"use client"

type Props = {
  score: number
  correct: number
  total: number
  onRetry: () => void
}

export default function ResultFailed({ score, correct, total, onRetry }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8 inline-flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-6 py-4">
        <span className="text-3xl">😔</span>
        <div className="text-left">
          <p className="text-red-400 font-semibold text-lg">Quase lá!</p>
          <p className="text-gray-400 text-sm">
            Você acertou {correct} de {total} questões ({score}%). Precisa de 70% para passar.
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
        <div className="text-6xl font-bold text-white/20 mb-2">{score}%</div>
        <p className="text-gray-400">
          Faltaram apenas <span className="text-white font-semibold">{7 - correct} {7 - correct === 1 ? "acerto" : "acertos"}</span> para você ser aprovado.
        </p>
      </div>

      <button
        onClick={onRetry}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all"
      >
        Tentar novamente
      </button>
    </div>
  )
}
