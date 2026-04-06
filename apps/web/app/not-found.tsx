import Link from "next/link"

export const metadata = {
  title: "Missão Não Encontrada — ShinobiOps",
}

// 404 page — ninja theme: the mission file has been shredded.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[oklch(0.12_0.03_265)] p-8 text-center">
      {/* Shuriken decoration */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[oklch(0.56_0.22_15)]/20">
        <svg
          className="size-12 text-[oklch(0.56_0.22_15)]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="currentColor"
            opacity="0.7"
          />
          <circle cx="12" cy="12" r="2.5" fill="oklch(0.12 0.03 265)" />
        </svg>
      </div>

      {/* Error code */}
      <div>
        <p className="text-sm font-medium tracking-widest text-[oklch(0.56_0.22_15)] uppercase">
          Arquivo de Missão — 404
        </p>
        <h1 className="mt-2 text-4xl font-bold text-white">Missão Não Encontrada</h1>
        <p className="mt-3 max-w-md text-sm text-white/50">
          O pergaminho que você busca foi destruído ou nunca existiu. As sombras
          não guardam registro deste caminho.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center rounded-md bg-[oklch(0.56_0.22_15)] px-4 text-sm font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_15)]"
        >
          Voltar à Base
        </Link>
        <Link
          href="/support"
          className="inline-flex h-9 items-center justify-center rounded-md border border-white/20 px-4 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          Suporte
        </Link>
      </div>
    </div>
  )
}
