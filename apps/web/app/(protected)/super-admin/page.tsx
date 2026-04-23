import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { db } from "@/lib/db"

export const metadata = {
  title: "Super Admin — VectorOps",
}

async function getStats() {
  try {
    const [orgCount, userCount, activeTicketCount] = await Promise.all([
      db.organization.count(),
      db.user.count(),
      db.ticket.count({
        where: { status: { notIn: ["DONE", "CANCELLED"] } },
      }),
    ])
    return { orgCount, userCount, activeTicketCount }
  } catch {
    return { orgCount: 0, userCount: 0, activeTicketCount: 0 }
  }
}

export default async function SuperAdminPage() {
  const stats = await getStats()

  return (
    <div className="min-h-full p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Centro de Controle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral de todas as organizações do sistema.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Organizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{stats.orgCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Usuários totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{stats.userCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Tickets ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">
              {stats.activeTicketCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/super-admin/organizations">
            Gerenciar Organizações
          </Link>
        </Button>
      </div>
    </div>
  )
}
