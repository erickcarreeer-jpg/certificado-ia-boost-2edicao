"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
  token?: string
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro")
  const [shuffled, setShuffled] = useState<Question[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)

  // WCAG 2.4.3 — Scroll respeitando prefers-reduced-motion
  function scrollToTop() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
  }

  // WCAG 2.4.3 — Move foco para o conteúdo ao trocar de stage
  useEffect(() => {
    if (stage !== 'intro') {
      mainContentRef.current?.focus()
    }
  }, [stage])

  function startQuiz() {
    setShuffled(shuffleQuestions(questions))
    setStage("quiz")
    scrollToTop()
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
    scrollToTop()
  }

  return (
    <main
      id="conteudo-principal"
      className="min-h-screen text-white"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(13,13,14,0.85)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* WCAG 4.1.2 — Logo com aria-label descritivo */}
          <button
            onClick={retry}
            aria-label="IA Boost — voltar para a página inicial"
            className="flex items-center gap-3 cursor-pointer"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <Image src="/logo-ia-boost.svg" alt="" width={110} height={19} priority unoptimized aria-hidden="true" />
            <span
              aria-hidden="true"
              className="hidden sm:block text-xs"
              style={{ color: 'rgba(255,255,255,0.25)', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '10px' }}
            >
              Workshop 2ª Edição
            </span>
          </button>
          {/* Identidades + CTA */}
          <div className="flex items-center gap-3">
            {/* Evento por + avatars — WCAG 1.1.1: nomes reais dos instrutores */}
            <div className="hidden sm:flex items-center gap-2.5" aria-label="Evento por Gilberto Prado, Leandro Rezende e Rafael Coronel">
              <span className="text-xs" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.45)' }}>Evento por</span>
              <div className="flex items-center" aria-hidden="true">
                {[
                  { n: 1, nome: 'Gilberto Prado' },
                  { n: 2, nome: 'Leandro Rezende' },
                  { n: 3, nome: 'Rafael Coronel' },
                ].map(({ n, nome }, i) => (
                  <div
                    key={n}
                    className="w-8 h-8 rounded-full overflow-hidden"
                    style={{
                      marginLeft: i === 0 ? 0 : '-8px',
                      border: '2px solid rgba(13,13,14,0.9)',
                      zIndex: 3 - i,
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={`/avatar-${n}.jpg`}
                      alt={nome}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="hidden sm:block w-px h-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

            {/* Botão CTA */}
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
                    desc: '10 questões sobre o conteúdo do Workshop IA Boost 2ª Edição.',
                  },
                  {
                    num: '02',
                    icon: '🎯',
                    title: 'Acerte 70%',
                    desc: 'Você precisa acertar pelo menos 7 das 10 questões para conseguir seu certificado!',
                  },
                  {
                    num: '03',
                    icon: '🏆',
                    title: 'Emita o certificado',
                    desc: 'Após a aprovação seu certificado sai na hora!',
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
        /* WCAG 2.4.3 — tabIndex=-1 permite receber foco via useEffect ao trocar de stage */
        <div ref={mainContentRef} tabIndex={-1} className="max-w-3xl mx-auto px-6 pt-28 pb-16 outline-none">
          {stage === "quiz" && (
            <Quiz questions={shuffled} onComplete={handleComplete} />
          )}

          {stage === "checking" && (
            /* WCAG 4.1.3 — role=status anuncia o carregamento */
            <div className="text-center py-24" role="status" aria-label="Verificando suas respostas, aguarde">
              <div
                aria-hidden="true"
                className="inline-block w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mb-6"
                style={{ borderColor: 'var(--ds-purple)', borderTopColor: 'transparent' }}
              />
              <p style={{ color: 'var(--ds-text-muted)' }}>Verificando suas respostas…</p>
            </div>
          )}

          {stage === "passed" && result && (
            <CertificateDownload token={result.token} onRetry={retry} />
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
