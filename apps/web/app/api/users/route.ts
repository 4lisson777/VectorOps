import { NextRequest, NextResponse } from "next/server"
import { Role } from "@/generated/prisma/client"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantAuth } from "@/lib/auth"

const DEV_ROLES: Role[] = ["DEVELOPER", "TECH_LEAD"]

const usersFilterSchema = z.object({
  role: z.enum(["TECH_LEAD", "DEVELOPER", "QA", "SUPPORT_LEAD", "SUPPORT_MEMBER"]).optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
})

export async function GET(request: NextRequest): Promise<NextResponse> {
  return requireTenantAuth(async () => {
    const { searchParams } = request.nextUrl
    const rawParams = Object.fromEntries(searchParams.entries())
    const parsed = usersFilterSchema.safeParse(rawParams)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { role, isActive } = parsed.data

    const isDevQuery = role && DEV_ROLES.includes(role as Role)

    const tenantDb = getTenantDb()
    const users = await tenantDb.user.findMany({
      where: {
        ...(role ? { role: role as Role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        role: true,
        avatarUrl: true,
        ninjaAlias: true,
        ...(isDevQuery
          ? {
              devStatus: true,
              currentTask: true,
              assignedTickets: {
                where: { status: { in: ["OPEN", "IN_PROGRESS", "WAITING_FOR_INFO"] } },
                take: 1,
                orderBy: { priorityOrder: "asc" },
                select: {
                  publicId: true,
                  title: true,
                  severity: true,
                  type: true,
                },
              },
            }
          : {}),
      },
    })

    return NextResponse.json({ users })
  })
}
