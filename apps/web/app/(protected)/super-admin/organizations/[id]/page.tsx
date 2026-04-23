import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { OrgDetail } from "@/components/super-admin/org-detail"

export const metadata = {
  title: "Detalhes da Organização — Super Admin | VectorOps",
}

interface OrgDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrgDetailPage({ params }: OrgDetailPageProps) {
  const { id } = await params

  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/super-admin/organizations">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Organizações
          </Link>
        </Button>
      </div>

      <OrgDetail organizationId={id} />
    </div>
  )
}
