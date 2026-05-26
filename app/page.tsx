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
    window.scrollTo({ top: 0, behavior: "smooth" })
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
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: 'var(--ds-bg)' }}>

      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(13,13,14,0.85)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-ia-boost.svg" alt="IA Boost" width={110} height={19} priority unoptimized />
            <span
              className="hidden sm:block text-xs"
              style={{ color: 'rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '10px' }}
            >
              Workshop 2ª Edição
            </span>
          </div>
          <button
            onClick={startQuiz}
            className="text-xs font-semibold px-4 py-2 rounded-full transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.65)', background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)' }}
          >
            Iniciar prova →
          </button>
        </div>
      </header>

      {/* ─── LANDING PAGE (intro) ────────────────────────────────── */}
      {stage === "intro" && (
        <>
          {/* HERO ─────────────────────────────────────────────── */}
          <section className="relative overflow-hidden pt-32 pb-0">
            {/* Purple glow top-center */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center top, rgba(114,26,231,0.35) 0%, transparent 70%)' }}
            />
            {/* Dot grid */}
            <div className="absolute inset-0 ds-dot-grid opacity-40 pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-8">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(114,26,231,0.15)', border: '1px solid rgba(114,26,231,0.4)', color: '#A87FF0' }}
                >
                  16 e 17 de Maio · 2ª Edição
                </span>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                >
                  Workshop IA Boost
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-6xl sm:text-8xl font-black leading-[0.95] tracking-tight mb-6">
                Prove que<br />
                <span
                  className="relative inline-block px-3 rounded-sm"
                  style={{ backgroundColor: 'var(--ds-purple)', color: '#fff' }}
                >
                  você foi.
                </span>
              </h1>

              {/* Subheading */}
              <p
                className="text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-10"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                Responda <strong className="text-white">10 questões</strong> sobre o conteúdo do workshop e conquiste seu certificado oficial do IA Boost.
              </p>

              {/* CTA */}
              <button
                onClick={startQuiz}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm transition-all mb-20"
                style={{
                  backgroundColor: '#fff',
                  color: '#0D0D0E',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 8px 40px rgba(114,26,231,0.3)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 1px rgba(255,255,255,0.4), 0 12px 48px rgba(114,26,231,0.45)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 1px rgba(255,255,255,0.2), 0 8px 40px rgba(114,26,231,0.3)' }}
              >
                Iniciar prova
                <span className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs" style={{ backgroundColor: 'var(--ds-purple)' }}>
                  ↗
                </span>
              </button>

              {/* Hero image — full width */}
              <div
                className="relative rounded-t-2xl overflow-hidden mx-auto"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderBottom: 'none',
                  boxShadow: '0 -20px 80px rgba(114,26,231,0.15), 0 0 0 1px rgba(255,255,255,0.04)',
                  maxWidth: '1100px',
                }}
              >
                {/* Top glow line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(114,26,231,0.7) 50%, transparent 95%)' }}
                />
                <Image
                  src="/hero-preview.png"
                  alt="IA Boost Workshop — Design System"
                  width={1420}
                  height={954}
                  className="w-full"
                  quality={90}
                  priority
                />
              </div>
            </div>
          </section>

          {/* HOW IT WORKS ──────────────────────────────────────── */}
          <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
            <div className="max-w-6xl mx-auto px-6 py-20">
              {/* Label */}
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-center" style={{ color: 'var(--ds-purple)' }}>
                Como funciona
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-16">
                Três passos para o<br />
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>seu certificado</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
                {[
                  {
                    num: '01',
                    icon: '📝',
                    title: 'Responda a prova',
                    desc: '10 questões sobre o conteúdo do Workshop IA Boost 2ª Edição, em ordem aleatória.',
                  },
                  {
                    num: '02',
                    icon: '🎯',
                    title: 'Acerte 70%',
                    desc: 'Você precisa acertar pelo menos 7 das 10 questões para liberar o certificado.',
                  },
                  {
                    num: '03',
                    icon: '🏆',
                    title: 'Emita o certificado',
                    desc: 'Baixe na hora em PNG ou PDF com seu nome. Sem cadastro, sem banco de dados.',
                  },
                ].map((step, i) => (
                  <div
                    key={step.num}
                    className="p-8 flex flex-col gap-4"
                    style={{
                      backgroundColor: i === 1 ? 'rgba(114,26,231,0.06)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{step.icon}</span>
                      <span className="text-xs font-mono font-bold" style={{ color: 'rgba(255,255,255,0.15)' }}>
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CERTIFICATE PREVIEW ────────────────────────────────── */}
          <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="max-w-6xl mx-auto px-6 py-20">
              <div className="flex flex-col sm:flex-row items-center gap-12">
                {/* Text */}
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--ds-purple)' }}>
                    Certificado oficial
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-5">
                    Seu nome no<br />certificado.
                  </h2>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    O certificado é gerado na hora com seu nome e data de conclusão. Disponível em <strong className="text-white">PNG</strong> e <strong className="text-white">PDF</strong>, pronto para colocar no LinkedIn.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {['PNG', 'PDF', 'Gerado na hora', 'Sem cadastro'].map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1.5 rounded-full"
                        style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.03)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={startQuiz}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--ds-purple)',
                      color: '#fff',
                      boxShadow: '0 8px 32px rgba(114,26,231,0.35)',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
                  >
                    Quero meu certificado →
                  </button>
                </div>
                {/* Certificate image */}
                <div
                  className="flex-1 rounded-xl overflow-hidden w-full"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                  }}
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
              </div>
            </div>
          </section>

          {/* FINAL CTA ──────────────────────────────────────────── */}
          <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="max-w-6xl mx-auto px-6 py-24 text-center">
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Pronto para começar?
              </p>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-10">
                Inicie a prova<br />
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>agora mesmo.</span>
              </h2>
              <button
                onClick={startQuiz}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base transition-all"
                style={{
                  backgroundColor: '#fff',
                  color: '#0D0D0E',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 8px 40px rgba(114,26,231,0.3)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 1px rgba(255,255,255,0.4), 0 12px 48px rgba(114,26,231,0.45)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 1px rgba(255,255,255,0.2), 0 8px 40px rgba(114,26,231,0.3)' }}
              >
                Iniciar prova
                <span className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs" style={{ backgroundColor: 'var(--ds-purple)' }}>
                  ↗
                </span>
              </button>
            </div>
          </section>

          {/* FOOTER ─────────────────────────────────────────────── */}
          <footer className="px-6 py-8">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <Image src="/logo-ia-boost.svg" alt="IA Boost" width={90} height={16} unoptimized style={{ opacity: 0.3 }} />
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                © 2026 Design Boost · Workshop IA Boost 2ª Edição
              </p>
            </div>
          </footer>
        </>
      )}

      {/* ─── QUIZ / RESULT STAGES ────────────────────────────────── */}
      {stage !== "intro" && (
        <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
          {stage === "quiz" && (
            <Quiz questions={shuffled} onComplete={handleComplete} />
          )}

          {stage === "checking" && (
            <div className="text-center py-24">
              <div
                className="inline-block w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mb-6"
                style={{ borderColor: 'var(--ds-purple)', borderTopColor: 'transparent' }}
              />
              <p style={{ color: 'var(--ds-text-muted)' }}>Verificando suas respostas...</p>
            </div>
          )}

          {stage === "passed" && result && (
            <CertificateDownload onRetry={retry} />
          )}

          {stage === "failed" && result && (
            <ResultFailed
              score={result.score}
              correct={result.correct}
              total={result.total}
              onRetry={retry}
            />
          )}
        </div>
      )}
    </main>
  )
}
