import { NotificationRouting } from "@/components/admin/notification-routing"

export const metadata = {
  title: "Roteamento de Notificações — ShinobiOps",
}

export default function AdminNotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Notification Routing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure which developers receive ticket and bug notifications
        </p>
      </div>
      <NotificationRouting />
    </div>
  )
}
