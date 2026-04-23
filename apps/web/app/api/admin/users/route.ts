import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getTenantDb } from "@/lib/tenant-db"
import { requireTenantRole } from "@/lib/auth"

const adminUsersFilterSchema = z.object({
  role: z.enum(["TECH_LEAD", "DEVELOPER", "SUPPORT_LEAD", "SUPPORT_MEMBER"]).optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  search: z.string().optional(),
})

export async function GET(request: NextRequest): Promise<NextResponse> {
  return requireTenantRole("TECH_LEAD")(async () => {
    const { searchParams } = request.nextUrl
    const rawParams = Object.fromEntries(searchParams.entries())
    const parsed = adminUsersFilterSchema.safeParse(rawParams)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { role, isActive, search } = parsed.data

    const tenantDb = getTenantDb()
    const users = await tenantDb.user.findMany({
      where: {
        ...(role ? { role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        ninjaAlias: true,
        isActive: true,
        notifyTickets: true,
        notifyBugs: true,
        soundEnabled: true,
        devStatus: true,
        currentTask: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ users })
  })
}
