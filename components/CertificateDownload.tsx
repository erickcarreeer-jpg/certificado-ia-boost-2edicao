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

      if (!res.ok) throw new Error("Erro ao gerar o certificado")

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
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* Success banner */}
      <div className="mb-8 inline-flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-2xl px-6 py-4">
        <span className="text-3xl">🎉</span>
        <div className="text-left">
          <p className="text-green-400 font-semibold text-lg">Parabéns! Você foi aprovado.</p>
          <p className="text-gray-400 text-sm">Agora é só colocar seu nome e baixar seu certificado.</p>
        </div>
      </div>

      {/* Name input */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-3 text-left">
          Seu nome completo (como aparecerá no certificado)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Maria Silva Santos"
          maxLength={80}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-2"
        />
        {name.trim().length > 0 && (
          <p className="text-gray-500 text-xs text-right">{name.trim().length}/80 caracteres</p>
        )}
        {error && <p className="text-red-400 text-sm mt-2 text-left">{error}</p>}
      </div>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={() => download("png")}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {loading === "png" ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <span>🖼️</span>
          )}
          Baixar como PNG
        </button>

        <button
          onClick={() => download("pdf")}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 disabled:opacity-50 transition-all"
        >
          {loading === "pdf" ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <span>📄</span>
          )}
          Baixar como PDF
        </button>
      </div>

      <button
        onClick={onRetry}
        className="text-gray-500 text-sm hover:text-gray-400 transition-colors underline underline-offset-4"
      >
        Refazer a prova
      </button>
    </div>
  )
}
