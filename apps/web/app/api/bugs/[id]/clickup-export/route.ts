import { NextRequest, NextResponse } from "next/server"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth } from "@/lib/auth"

type RouteContext = { params: Promise<{ id: string }> }

/**
 * Formats a Date to dd/MM/yyyy (Brazilian date format).
 */
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return requireTenantAuth(async () => {
    const { id } = await context.params

    // Support lookup by publicId (BUG-XXXX) or internal cuid
    const isPublicId = id.startsWith("BUG-")
    const where = isPublicId ? { publicId: id } : { id }

    const tenantDb = getTenantDb()
    const bug = await tenantDb.ticket.findUnique({
      where,
      include: {
        bugReport: true,
        openedBy: { select: { name: true } },
      },
    })

    if (!bug || bug.type !== "BUG") {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    if (!bug.bugReport) {
      return NextResponse.json({ error: "Bug report data not found" }, { status: 404 })
    }

    const report = bug.bugReport
    const deadlineStr = bug.deadline ? formatDate(new Date(bug.deadline)) : "N/A"

    const markdown = [
      `## [${bug.publicId}] ${bug.title}`,
      "",
      `**Severidade:** ${bug.severity}  `,
      `**Ambiente:** ${report.environment}  `,
      `**Módulo Afetado:** ${report.affectedModule}  `,
      `**Cliente:** ${report.customerId ?? "N/A"}  `,
      `**Prazo:** ${deadlineStr}  `,
      `**Reportado por:** ${bug.openedBy.name}  `,
      `**Status:** ${bug.status}`,
      "",
      "### Passos para Reproduzir",
      report.stepsToReproduce,
      "",
      "### Comportamento Esperado",
      report.expectedBehavior,
      "",
      "### Comportamento Atual",
      report.actualBehavior,
    ].join("\n")

    return NextResponse.json({ markdown })
  })
}
