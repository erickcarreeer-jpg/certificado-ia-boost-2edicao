"use client"

import { useState, useEffect, useRef } from "react"

type Props = {
  token?: string
  onRetry: () => void
}

export default function CertificateDownload({ token, onRetry }: Props) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState<"png" | "pdf" | null>(null)
  const [error, setError] = useState("")
  const headingRef = useRef<HTMLHeadingElement>(null)

  // WCAG 2.4.3 — Foco no heading ao chegar na tela de aprovação
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  async function download(format: "png" | "pdf") {
    if (name.trim().length < 2) {
      setError("Digite seu nome completo para emitir o certificado.")
      return
    }
    setError("")
    setLoading(format)

    try {
      const res = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), format, token }),
      })

      if (!res.ok) throw new Error()

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `certificado-ia-boost.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError("Não foi possível gerar o certificado. Tente novamente.")
    } finally {
      setLoading(null)
    }
  }

  return (
    // WCAG 4.1.3 — Região com role status anuncia aprovação ao chegar
    <div className="w-full max-w-xl mx-auto" role="main" aria-label="Tela de aprovação e emissão de certificado">

      {/* Cabeçalho de aprovação */}
      <div className="text-center mb-10">
        <div
          aria-hidden="true"
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style={{ backgroundColor: 'rgba(114,26,231,0.15)', border: '1px solid rgba(114,26,231,0.3)' }}
        >
          {/* Ícone decorativo */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M5 13l4 4L19 7" stroke="#721AE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
          style={{ color: 'var(--ds-purple)' }}
        >
          Aprovado
        </p>

        {/* WCAG 2.4.3 — tabIndex=-1 permite foco via useEffect */}
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-black text-white mb-2 tracking-tight outline-none"
        >
          Parabéns! Você foi aprovado.
        </h2>
        <p className="text-sm" style={{ color: 'var(--ds-text-subtle)' }}>
          Coloque seu nome exatamente como quer que apareça no certificado.
        </p>
      </div>

      {/* Formulário */}
      <div
        className="rounded-2xl p-6 mb-5"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* WCAG 1.3.1 — Label associada via htmlFor/id */}
        <label
          htmlFor="nome-completo"
          className="block text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--ds-text-muted)' }}
        >
          Seu nome completo
        </label>
        <input
          id="nome-completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Maria Silva Santos"
          maxLength={80}
          // WCAG 1.3.5 — Finalidade do campo
          autoComplete="name"
          aria-required="true"
          aria-describedby={error ? "erro-nome" : "dica-nome"}
          aria-invalid={!!error}
          className="w-full rounded-xl px-4 py-3.5 text-white text-base transition-all"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: error
              ? '1px solid rgba(255,94,64,0.6)'
              : '1px solid rgba(255,255,255,0.1)',
            caretColor: 'var(--ds-purple)',
            outline: 'none',
          }}
          onFocus={e => {
            if (!error) e.currentTarget.style.borderColor = 'rgba(114,26,231,0.6)'
          }}
          onBlur={e => {
            if (!error) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
        />

        {/* Contador de caracteres — só informativo */}
        {name.trim().length > 0 && (
          <p id="dica-nome" className="text-right text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {name.trim().length}/80 caracteres
          </p>
        )}

        {/* WCAG 3.3.1 — Erro identificado e descrito; role=alert anuncia imediatamente */}
        {error && (
          <p
            id="erro-nome"
            role="alert"
            aria-live="assertive"
            className="text-xs mt-2"
            style={{ color: 'rgba(255,94,64,0.9)' }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Botões de download */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8" role="group" aria-label="Opções de download do certificado">

        {/* PNG */}
        <button
          onClick={() => download("png")}
          disabled={!!loading}
          aria-disabled={!!loading}
          aria-busy={loading === "png"}
          aria-label={loading === "png" ? "Gerando certificado em PNG, aguarde…" : "Baixar certificado em formato PNG"}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-full font-bold text-sm transition-all disabled:opacity-40"
          style={{
            backgroundColor: '#fff',
            color: '#0D0D0E',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.2)',
          }}
        >
          {loading === "png" ? (
            <span
              aria-hidden="true"
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#0D0D0E', borderTopColor: 'transparent' }}
            />
          ) : (
            <span aria-hidden="true" className="flex items-center justify-center w-5 h-5 rounded-full text-white text-xs" style={{ backgroundColor: 'var(--ds-purple)' }}>
              ↓
            </span>
          )}
          Baixar PNG
        </button>

        {/* PDF */}
        <button
          onClick={() => download("pdf")}
          disabled={!!loading}
          aria-disabled={!!loading}
          aria-busy={loading === "pdf"}
          aria-label={loading === "pdf" ? "Gerando certificado em PDF, aguarde…" : "Baixar certificado em formato PDF"}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-full font-semibold text-sm transition-all disabled:opacity-40"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--ds-text-muted)',
            background: 'transparent',
          }}
        >
          {loading === "pdf" ? (
            <span
              aria-hidden="true"
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'rgba(255,255,255,0.5)', borderTopColor: 'transparent' }}
            />
          ) : (
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)' }}>↓</span>
          )}
          Baixar PDF
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onRetry}
          aria-label="Refazer a prova desde o início"
          className="text-xs transition-colors"
          style={{ color: 'var(--ds-text-subtle)' }}
        >
          Refazer a prova
        </button>
      </div>
    </div>
  )
}
