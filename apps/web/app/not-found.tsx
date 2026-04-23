import Link from "next/link"

export const metadata = {
  title: "Página Não Encontrada — VectorOps",
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[oklch(0.17_0.02_250)] p-8 text-center">
      {/* Vector mark decoration */}
      <div className="flex h-20 w-20 items-center justify-center rounded-[6px] bg-[oklch(0.68_0.22_320)]/20">
        <svg
          className="size-10 text-[oklch(0.68_0.22_320)]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line x1="4" y1="17" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <polyline points="14,5 20,7 18,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="11" y1="13" x2="13" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div>
        <p className="font-mono text-sm font-medium uppercase tracking-widest text-[oklch(0.68_0.22_320)]">
          404
        </p>
        <h1 className="mt-2 text-4xl font-bold text-white">Página Não Encontrada</h1>
        <p className="mt-3 max-w-md text-sm text-white/50">
          O caminho que você buscou não existe ou foi removido.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center rounded bg-[oklch(0.68_0.22_320)] px-4 text-sm font-medium text-white transition-colors hover:bg-[oklch(0.74_0.22_320)]"
        >
          Voltar ao Início
        </Link>
        <Link
          href="/support"
          className="inline-flex h-9 items-center justify-center rounded border border-white/20 px-4 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          Suporte
        </Link>
      </div>
    </div>
  )
}
