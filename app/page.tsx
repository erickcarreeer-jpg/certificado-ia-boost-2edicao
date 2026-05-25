"use client"

import { useState, useCallback } from "react"
import { questions, shuffleQuestions, Question } from "@/data/questions"
import Quiz from "@/components/Quiz"
import CertificateDownload from "@/components/CertificateDownload"
import ResultFailed from "@/components/ResultFailed"
import Image from "next/image"

type Stage = "intro" | "quiz" | "checking" | "passed" | "failed"

type Result = {
  correct: number
  total: number
  score: number
  passed: boolean
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro")
  const [shuffled, setShuffled] = useState<Question[]>([])
  const [result, setResult] = useState<Result | null>(null)

  function startQuiz() {
    setShuffled(shuffleQuestions(questions))
    setStage("quiz")
  }

  const handleComplete = useCallback(async (answers: Record<number, string>) => {
    setStage("checking")
    try {
      const res = await fetch("/api/check-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })
      const data: Result = await res.json()
      setResult(data)
      setStage(data.passed ? "passed" : "failed")
    } catch {
      setStage("intro")
    }
  }, [])

  function retry() {
    setResult(null)
    setShuffled(shuffleQuestions(questions))
    setStage("intro")
  }

  return (
    <main className="min-h-screen bg-[#0a0a14] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
              ia
            </div>
            <span className="font-semibold text-sm text-gray-300">IA Boost · Workshop 2ª Edição</span>
          </div>
          <span className="text-xs text-gray-500">designboost.com.br</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Intro */}
        {stage === "intro" && (
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 text-purple-300 text-sm mb-8">
              ✦ Certificado de Conquista
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Emita seu<br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                certificado
              </span>
            </h1>

            <p className="text-gray-400 text-lg mb-4 leading-relaxed">
              Responda <strong className="text-white">10 questões</strong> sobre o conteúdo do workshop.
              Acerte pelo menos <strong className="text-white">70%</strong> para liberar seu certificado.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-10">
              <span>📝 10 questões</span>
              <span>·</span>
              <span>⏱️ Sem limite de tempo</span>
              <span>·</span>
              <span>🎯 Mínimo 70%</span>
            </div>

            <button
              onClick={startQuiz}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
            >
              Iniciar prova
              <span>→</span>
            </button>

            {/* Certificate preview */}
            <div className="mt-16 rounded-2xl overflow-hidden border border-white/10 opacity-60 hover:opacity-100 transition-opacity">
              <Image
                src="/certificate-template.svg"
                alt="Preview do certificado"
                width={800}
                height={565}
                className="w-full"
                unoptimized
              />
            </div>
            <p className="text-gray-600 text-xs mt-3">Preview do certificado</p>
          </div>
        )}

        {/* Quiz */}
        {stage === "quiz" && (
          <Quiz questions={shuffled} onComplete={handleComplete} />
        )}

        {/* Checking answers */}
        {stage === "checking" && (
          <div className="text-center py-24">
            <div className="inline-block w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-gray-400">Verificando suas respostas...</p>
          </div>
        )}

        {/* Passed */}
        {stage === "passed" && result && (
          <CertificateDownload onRetry={retry} />
        )}

        {/* Failed */}
        {stage === "failed" && result && (
          <ResultFailed
            score={result.score}
            correct={result.correct}
            total={result.total}
            onRetry={retry}
          />
        )}
      </div>
    </main>
  )
}
