"use client"

import { useState, useEffect, useRef } from "react"

type VerifyResult =
  | { eligible: false; message: string }
  | { eligible: true; alreadyPassed: false }
  | {
      eligible: true
      alreadyPassed: true
      result: {
        email: string
        name: string
        score: number
        correct: number
        total: number
        token?: string
      }
    }

type Props = {
  onVerified: (name: string, email: string) => void
  onAlreadyPassed: (result: {
    email: string
    name: string
    score: number
    correct: number
    total: number
    token?: string
  }) => void
}

export default function VerifyStudent({ onVerified, onAlreadyPassed }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [popup, setPopup] = useState<"success" | "error" | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({})
  const headingRef = useRef<HTMLHeadingElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // WCAG 2.4.3 — Focus on heading on mount
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  // Focus popup when it opens
  useEffect(() => {
    if (popup) popupRef.current?.focus()
  }, [popup])

  function validate() {
    const errors: { name?: string; email?: string } = {}
    if (name.trim().length < 2) errors.name = "Digite seu nome completo."
    if (!email.trim().includes("@")) errors.email = "Digite um e-mail válido."
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setFieldErrors({})

    try {
      const res = await fetch("/api/verify-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data: VerifyResult = await res.json()

      if (!data.eligible) {
        setErrorMsg(data.message ?? "E-mail não encontrado na lista de inscritos.")
        setPopup("error")
        return
      }

      if (data.alreadyPassed) {
        setPopup("success")
        // Brief pause so the user sees the success popup, then navigate
        setTimeout(() => {
          onAlreadyPassed(data.result)
        }, 1800)
        return
      }

      // Eligible, not yet passed
      setPopup("success")
      setTimeout(() => {
        onVerified(name.trim(), email.trim().toLowerCase())
      }, 1800)
    } catch {
      setErrorMsg("Erro ao verificar. Tente novamente.")
      setPopup("error")
    } finally {
      setLoading(false)
    }
  }

  const inputBase: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    caretColor: "var(--ds-purple)",
    outline: "none",
    color: "#fff",
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ── Popup overlay ─────────────────────────────────────── */}
      {popup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          role="dialog"
          aria-modal="true"
          aria-label={popup === "success" ? "Verificação aprovada" : "Verificação negada"}
        >
          <div
            ref={popupRef}
            tabIndex={-1}
            className="w-full max-w-sm rounded-2xl p-8 text-center outline-none"
            style={{
              backgroundColor: "#18181b",
              border:
                popup === "success"
                  ? "1px solid rgba(114,26,231,0.4)"
                  : "1px solid rgba(255,94,64,0.4)",
              boxShadow:
                popup === "success"
                  ? "0 0 60px rgba(114,26,231,0.25)"
                  : "0 0 60px rgba(255,94,64,0.2)",
            }}
          >
            {popup === "success" ? (
              <>
                <div
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                  style={{ backgroundColor: "rgba(114,26,231,0.15)", border: "1px solid rgba(114,26,231,0.3)" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="#721AE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "var(--ds-purple)" }}>
                  Verificado
                </p>
                <h3 className="text-xl font-black text-white mb-2">E-mail confirmado!</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Preparando sua prova…
                </p>
              </>
            ) : (
              <>
                <div
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                  style={{ backgroundColor: "rgba(255,94,64,0.1)", border: "1px solid rgba(255,94,64,0.3)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <path d="M11 7v5M11 15h.01" stroke="#FF5E40" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="11" cy="11" r="9" stroke="#FF5E40" strokeWidth="1.8" />
                  </svg>
                </div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,94,64,0.8)" }}>
                  Não encontrado
                </p>
                <h3 className="text-xl font-black text-white mb-2">E-mail não cadastrado</h3>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {errorMsg}
                </p>
                <button
                  onClick={() => setPopup(null)}
                  aria-label="Fechar e tentar outro e-mail"
                  className="w-full py-3 rounded-full font-bold text-sm"
                  style={{ backgroundColor: "#fff", color: "#0D0D0E" }}
                >
                  Tentar novamente
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Form ──────────────────────────────────────────────── */}
      <div className="text-center mb-10">
        <div
          aria-hidden="true"
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style={{ backgroundColor: "rgba(114,26,231,0.12)", border: "1px solid rgba(114,26,231,0.25)" }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="8" r="3.5" stroke="#721AE7" strokeWidth="1.8" />
            <path d="M3.5 18.5c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" stroke="#721AE7" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "var(--ds-purple)" }}>
          Verificação de inscrição
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-black text-white mb-2 tracking-tight outline-none"
        >
          Confirme sua participação
        </h2>
        <p className="text-sm" style={{ color: "var(--ds-text-subtle)" }}>
          Só participantes do Workshop IA Boost podem emitir o certificado.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div
          className="rounded-2xl p-6 mb-5 flex flex-col gap-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Nome */}
          <div>
            <label
              htmlFor="verify-nome"
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--ds-text-muted)" }}
            >
              Seu nome completo
            </label>
            <input
              id="verify-nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maria Silva Santos"
              maxLength={80}
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "erro-nome-verify" : undefined}
              className="w-full rounded-xl px-4 py-3.5 text-base transition-all"
              style={{
                ...inputBase,
                border: fieldErrors.name
                  ? "1px solid rgba(255,94,64,0.6)"
                  : "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => {
                if (!fieldErrors.name) e.currentTarget.style.borderColor = "rgba(114,26,231,0.6)"
              }}
              onBlur={(e) => {
                if (!fieldErrors.name) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
              }}
            />
            {fieldErrors.name && (
              <p id="erro-nome-verify" role="alert" className="text-xs mt-1.5" style={{ color: "rgba(255,94,64,0.9)" }}>
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="verify-email"
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--ds-text-muted)" }}
            >
              Seu e-mail de inscrição
            </label>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: maria@email.com"
              maxLength={120}
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "erro-email-verify" : undefined}
              className="w-full rounded-xl px-4 py-3.5 text-base transition-all"
              style={{
                ...inputBase,
                border: fieldErrors.email
                  ? "1px solid rgba(255,94,64,0.6)"
                  : "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => {
                if (!fieldErrors.email) e.currentTarget.style.borderColor = "rgba(114,26,231,0.6)"
              }}
              onBlur={(e) => {
                if (!fieldErrors.email) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
              }}
            />
            {fieldErrors.email && (
              <p id="erro-email-verify" role="alert" className="text-xs mt-1.5" style={{ color: "rgba(255,94,64,0.9)" }}>
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          aria-busy={loading}
          aria-label={loading ? "Verificando participação, aguarde…" : "Verificar participação no workshop"}
          className="w-full py-3.5 rounded-full font-bold text-sm transition-all disabled:opacity-50"
          style={{
            backgroundColor: "#fff",
            color: "#0D0D0E",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(114,26,231,0.15)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span
                aria-hidden="true"
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#0D0D0E", borderTopColor: "transparent" }}
              />
              Verificando…
            </span>
          ) : (
            "Verificar participação →"
          )}
        </button>
      </form>
    </div>
  )
}
