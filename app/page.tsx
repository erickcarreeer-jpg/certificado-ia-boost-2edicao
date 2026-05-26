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
    <main className="min-h-screen text-white ds-dot-grid" style={{ backgroundColor: 'var(--ds-bg)' }}>
      {/* Header */}
      <header className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo do Figma */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-ia-boost.svg"
              alt="IA Boost"
              width={120}
              height={21}
              priority
              unoptimized
            />
            {/* Divider + subtitle */}
            <span className="hidden sm:block text-xs" style={{ color: 'rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '10px' }}>
              Workshop 2ª Edição
            </span>
          </div>

          {/* Header CTA */}
          <button
            onClick={startQuiz}
            className="text-xs font-semibold px-4 py-2 rounded-full transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.5)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            Iniciar prova →
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Intro */}
        {stage === "intro" && (
          <div className="text-center max-w-2xl mx-auto">
            {/* Eyebrow */}
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-8"
              style={{ color: 'var(--ds-purple)' }}
            >
              Certificado de Conquista
            </p>

            {/* Heading */}
            <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Emita seu{' '}
              <span
                className="inline rounded-sm px-2 py-0.5 text-white"
                style={{ backgroundColor: 'var(--ds-purple)' }}
              >
                certificado
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg mb-10 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--ds-text-muted)' }}>
              Responda <strong className="text-white">10 questões</strong> sobre o conteúdo do workshop.
              Acerte pelo menos <strong className="text-white">70%</strong> para liberar seu certificado.
            </p>

            {/* Feature tags */}
            <div className="flex items-center justify-center flex-wrap gap-2.5 mb-12">
              {[
                { icon: '📝', label: '10 questões' },
                { icon: '⏱️', label: 'Sem limite de tempo' },
                { icon: '🎯', label: 'Mínimo 70%' },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="flex items-center gap-2 text-xs font-medium rounded-full px-4 py-2"
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    letterSpacing: '0.04em',
                  }}
                >
                  <span>{tag.icon}</span>
                  {tag.label}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={startQuiz}
              className="inline-flex items-center gap-3 px-9 py-3.5 rounded-full font-bold text-sm transition-all"
              style={{
                backgroundColor: '#fff',
                color: '#0D0D0E',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.25)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 0 1px rgba(255,255,255,0.3), 0 12px 40px rgba(114,26,231,0.4)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.25)'
              }}
            >
              Iniciar prova
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full text-white text-xs"
                style={{ backgroundColor: 'var(--ds-purple)' }}
              >
                ↗
              </span>
            </button>

            {/* Certificate preview */}
            <div
              className="mt-20 rounded-2xl overflow-hidden opacity-40 hover:opacity-70 transition-opacity"
              style={{ border: '1px solid var(--ds-border)' }}
            >
              <Image
                src="/certificate-template.svg"
                alt="Preview do certificado"
                width={800}
                height={565}
                className="w-full"
                unoptimized
              />
            </div>
            <p className="text-xs mt-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Preview do certificado
            </p>
          </div>
        )}

        {/* Quiz */}
        {stage === "quiz" && (
          <Quiz questions={shuffled} onComplete={handleComplete} />
        )}

        {/* Checking answers */}
        {stage === "checking" && (
          <div className="text-center py-24">
            <div
              className="inline-block w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mb-6"
              style={{ borderColor: 'var(--ds-purple)', borderTopColor: 'transparent' }}
            />
            <p style={{ color: 'var(--ds-text-muted)' }}>Verificando suas respostas...</p>
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
