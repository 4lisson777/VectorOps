import { TvBoard } from "@/components/tv/tv-board"

export const metadata = {
  title: "Painel Ninja — Modo TV | ShinobiOps",
}

// TV Mode — full-screen read-only Ninja Board for office displays.
// Public route — no authentication required.
export default function TvPage() {
  return <TvBoard />
}
