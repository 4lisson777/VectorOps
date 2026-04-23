import { TvBoard } from "@/components/tv/tv-board"

export const metadata = {
  title: "Painel — Modo TV | VectorOps",
}

interface TvPageProps {
  searchParams: Promise<{ org?: string }>
}

// TV Mode — full-screen read-only Ninja Board for office displays.
// Public route — no authentication required.
// Accepts ?org=SLUG to scope the board to a specific organization.
export default async function TvPage({ searchParams }: TvPageProps) {
  const params = await searchParams
  const orgSlug = params.org ?? undefined

  return <TvBoard orgSlug={orgSlug} />
}
