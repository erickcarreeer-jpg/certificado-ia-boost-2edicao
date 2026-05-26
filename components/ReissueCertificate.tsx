"use client"

import { useState, useEffect, useRef } from "react"

type Props = {
  email: string
  initialName: string
  score: number
  correct: number
  total: number
  onRetry: () => void
}

export default function ReissueCertificate({
  email,
  initialName,
  score,
  correct,
  total,
  onRetry,
}: Props) {
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState<"png" | "pdf" | null>(null)
  const [error, setError] = useState("")
  const [nameEditing, setNameEditing] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  async function download(format: "png" | "pdf") {
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError("Digite seu nome completo para emitir o certificado.")
      return
    }
    setError("")
    setLoading(format)

    try {
      const res = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, format, email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Erro ao gerar o certificado.")
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `certificado-ia-boost.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível gerar o certificado. Tente novamente.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto" role="main" aria-label="Tela de reemissão de certificado">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          aria-hidden="true"
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style={{ backgroundColor: "rgba(114,26,231,0.15)", border: "1px solid rgba(114,26,231,0.3)" }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="#721AE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "var(--ds-purple)" }}>
          Aprovado anteriormente
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-black text-white mb-2 tracking-tight outline-none"
        >
          Bem-vindo de volta!
        </h2>
        <p className="text-sm" style={{ color: "var(--ds-text-subtle)" }}>
          Você já passou na prova com{" "}
          <span className="text-white font-semibold">{score}%</span>{" "}
          ({correct}/{total} questões). Baixe seu certificado abaixo.
        </p>
      </div>

      {/* Score card */}
      <div
        className="rounded-2xl p-6 mb-5"
        style={{
          backgroundColor: "rgba(114,26,231,0.06)",
          border: "1px solid rgba(114,26,231,0.15)",
        }}
      >
        <div
          className="text-5xl font-black mb-1 tracking-tight"
          aria-label={`Sua pontuação: ${score}%`}
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          {score}%
        </div>
        <div
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Pontuação: ${score}%`}
          className="w-full h-1 rounded-full my-4 overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${score}%`, backgroundColor: "var(--ds-purple)" }}
          />
        </div>
        <p className="text-sm" style={{ color: "var(--ds-text-subtle)" }} aria-hidden="true">
          {correct} de {total} questões corretas
        </p>
      </div>

      {/* Name field */}
      <div
        className="rounded-2xl p-6 mb-5"
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <label
            htmlFor="reissue-nome"
            className="block text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--ds-text-muted)" }}
          >
            Nome no certificado
          </label>
          {!nameEditing && (
            <button
              onClick={() => setNameEditing(true)}
              aria-label="Alterar nome do certificado"
              className="text-xs font-semibold transition-colors"
              style={{ color: "var(--ds-purple)" }}
            >
              ✏️ Alterar nome
            </button>
          )}
        </div>

        <input
          id="reissue-nome"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameEditing(true) }}
          maxLength={80}
          autoComplete="name"
          aria-required="true"
          aria-describedby={error ? "erro-nome-reissue" : "dica-nome-reissue"}
          aria-invalid={!!error}
          readOnly={!nameEditing}
          className="w-full rounded-xl px-4 py-3.5 text-white text-base transition-all"
          style={{
            backgroundColor: nameEditing ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
            border: error
              ? "1px solid rgba(255,94,64,0.6)"
              : nameEditing
              ? "1px solid rgba(114,26,231,0.6)"
              : "1px solid rgba(255,255,255,0.07)",
            caretColor: "var(--ds-purple)",
            outline: "none",
            cursor: nameEditing ? "text" : "default",
          }}
        />

        {name.trim().length > 0 && nameEditing && (
          <p id="dica-nome-reissue" className="text-right text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
            {name.trim().length}/80 caracteres
          </p>
        )}

        {!nameEditing && (
          <p id="dica-nome-reissue" className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Clique em "Alterar nome" para modificar como aparece no certificado.
          </p>
        )}

        {error && (
          <p
            id="erro-nome-reissue"
            role="alert"
            aria-live="assertive"
            className="text-xs mt-2"
            style={{ color: "rgba(255,94,64,0.9)" }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Download buttons */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-8"
        role="group"
        aria-label="Opções de download do certificado"
      >
        {/* PNG */}
        <button
          onClick={() => download("png")}
          disabled={!!loading}
          aria-disabled={!!loading}
          aria-busy={loading === "png"}
          aria-label={loading === "png" ? "Gerando certificado em PNG, aguarde…" : "Baixar certificado em formato PNG"}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-full font-bold text-sm transition-all disabled:opacity-40"
          style={{
            backgroundColor: "#fff",
            color: "#0D0D0E",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.2)",
          }}
        >
          {loading === "png" ? (
            <span
              aria-hidden="true"
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#0D0D0E", borderTopColor: "transparent" }}
            />
          ) : (
            <span aria-hidden="true" className="flex items-center justify-center w-5 h-5 rounded-full text-white text-xs" style={{ backgroundColor: "var(--ds-purple)" }}>
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
            border: "1px solid rgba(255,255,255,0.12)",
            color: "var(--ds-text-muted)",
            background: "transparent",
          }}
        >
          {loading === "pdf" ? (
            <span
              aria-hidden="true"
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "rgba(255,255,255,0.5)", borderTopColor: "transparent" }}
            />
          ) : (
            <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.4)" }}>↓</span>
          )}
          Baixar PDF
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onRetry}
          aria-label="Voltar para o início"
          className="text-xs transition-colors"
          style={{ color: "var(--ds-text-subtle)" }}
        >
          Voltar para o início
        </button>
      </div>
    </div>
  )
}
