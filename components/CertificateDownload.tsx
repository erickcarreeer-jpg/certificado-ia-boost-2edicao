"use client"

import { useState } from "react"

type Props = {
  onRetry: () => void
}

export default function CertificateDownload({ onRetry }: Props) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState<"png" | "pdf" | null>(null)
  const [error, setError] = useState("")

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
        body: JSON.stringify({ name: name.trim(), format }),
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
    <div className="w-full max-w-xl mx-auto">
      {/* Success state */}
      <div className="text-center mb-10">
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style={{ backgroundColor: 'rgba(114,26,231,0.15)', border: '1px solid rgba(114,26,231,0.3)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#721AE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
          style={{ color: 'var(--ds-purple)' }}
        >
          Aprovado
        </p>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
          Parabéns!
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Coloque seu nome exatamente como quer que apareça no certificado.
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-6 mb-5"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Seu nome completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Maria Silva Santos"
          maxLength={80}
          className="w-full rounded-xl px-4 py-3.5 text-white text-base placeholder-transparent transition-all outline-none"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: error
              ? '1px solid rgba(255,94,64,0.6)'
              : '1px solid rgba(255,255,255,0.1)',
            caretColor: 'var(--ds-purple)',
          }}
          onFocus={e => {
            if (!error) e.currentTarget.style.borderColor = 'rgba(114,26,231,0.6)'
          }}
          onBlur={e => {
            if (!error) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
        />
        {name.trim().length > 0 && (
          <p className="text-right text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {name.trim().length}/80
          </p>
        )}
        {error && (
          <p className="text-xs mt-2" style={{ color: 'rgba(255,94,64,0.9)' }}>{error}</p>
        )}
      </div>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Primary — PNG */}
        <button
          onClick={() => download("png")}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-full font-bold text-sm transition-all disabled:opacity-40"
          style={{
            backgroundColor: '#fff',
            color: '#0D0D0E',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.2)',
          }}
        >
          {loading === "png" ? (
            <span
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#0D0D0E', borderTopColor: 'transparent' }}
            />
          ) : (
            <span
              className="flex items-center justify-center w-5 h-5 rounded-full text-white text-xs"
              style={{ backgroundColor: 'var(--ds-purple)' }}
            >
              ↓
            </span>
          )}
          Baixar PNG
        </button>

        {/* Secondary — PDF */}
        <button
          onClick={() => download("pdf")}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-full font-semibold text-sm transition-all disabled:opacity-40"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.7)',
            background: 'transparent',
          }}
          onMouseEnter={e => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
          }}
        >
          {loading === "pdf" ? (
            <span
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'rgba(255,255,255,0.5)', borderTopColor: 'transparent' }}
            />
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>↓</span>
          )}
          Baixar PDF
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onRetry}
          className="text-xs transition-colors"
          style={{ color: 'rgba(255,255,255,0.2)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
        >
          Refazer a prova
        </button>
      </div>
    </div>
  )
}
