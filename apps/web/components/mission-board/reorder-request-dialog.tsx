"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"

interface TicketInfo {
  id: string
  publicId: string
  priorityOrder: number
}

interface PendingRequest {
  id: string
  requestedPosition: number
  reason: string | null
  requestedBy: { name: string; ninjaAlias: string }
  ticket: { publicId: string; title: string }
}

interface ReorderRequestDialogProps {
  ticket: TicketInfo
  totalTickets: number
  userRole: string
  onClose: () => void
  onSuccess?: () => void
}

export function ReorderRequestDialog({
  ticket,
  totalTickets,
  userRole,
  onClose,
  onSuccess,
}: ReorderRequestDialogProps) {
  const isLead = userRole === "SUPPORT_LEAD" || userRole === "TECH_LEAD"

  const [requestPosition, setRequestPosition] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [directPosition, setDirectPosition] = React.useState("")
  const [pendingRequests, setPendingRequests] = React.useState<PendingRequest[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [actionPending, setActionPending] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)

  // Leads fetch pending requests on open
  React.useEffect(() => {
    if (!isLead) return
    fetch("/api/reorder-requests")
      .then((r) => r.json())
      .then((data: { reorderRequests?: PendingRequest[] }) => {
        setPendingRequests(
          (data.reorderRequests ?? []).filter((r) => r.ticket.publicId === ticket.publicId)
        )
      })
      .catch(() => null)
  }, [isLead, ticket.publicId])

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    const pos = parseInt(requestPosition, 10)
    if (isNaN(pos) || pos < 1) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/reorder-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticket.id, requestedPosition: pos, reason: reason.trim() || undefined }),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? "Failed to submit request.")
        return
      }
      onSuccess?.()
      onClose()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDirectReorder(e: React.FormEvent) {
    e.preventDefault()
    const pos = parseInt(directPosition, 10)
    if (isNaN(pos) || pos < 1) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPosition: pos }),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? "Failed to reorder ticket.")
        return
      }
      onSuccess?.()
      onClose()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleApproveDecline(requestId: string, action: "approve" | "decline") {
    setActionPending(requestId)
    setError(null)
    try {
      const res = await fetch(`/api/reorder-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? "Action failed.")
        return
      }
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId))
      setSuccessMsg(action === "approve" ? "Request approved." : "Request declined.")
      setTimeout(() => setSuccessMsg(null), 3000)
      if (action === "approve") onSuccess?.()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setActionPending(null)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Reordenar — <span className="font-mono">{ticket.publicId}</span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Posição atual: <span className="font-medium text-foreground">{ticket.priorityOrder}</span>
          {" "}de {totalTickets} missões ativas.
        </p>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {successMsg && <p className="text-sm text-green-600 dark:text-green-400">{successMsg}</p>}

        {isLead ? (
          <Tabs defaultValue="direct">
            <TabsList className="w-full">
              <TabsTrigger value="direct" className="flex-1">Reordenar Direto</TabsTrigger>
              <TabsTrigger value="requests" className="flex-1">
                Pedidos Pendentes
                {pendingRequests.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="direct">
              <form onSubmit={(e) => void handleDirectReorder(e)} className="flex flex-col gap-4 pt-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="direct-pos">Mover para a posição</Label>
                  <Input
                    id="direct-pos"
                    type="number"
                    min={1}
                    max={totalTickets}
                    value={directPosition}
                    onChange={(e) => setDirectPosition(e.target.value)}
                    placeholder={`1 – ${totalTickets}`}
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting || !directPosition}>
                    {isSubmitting ? "Movendo…" : "Reordenar Agora"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="requests">
              <div className="flex flex-col gap-3 pt-2">
                {pendingRequests.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">Nenhum pedido pendente para esta missão.</p>
                ) : (
                  pendingRequests.map((req) => (
                    <div key={req.id} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                      <div className="flex flex-col gap-0.5 text-sm">
                        <span className="font-medium">{req.requestedBy.ninjaAlias} → posição {req.requestedPosition}</span>
                        {req.reason && <span className="text-xs text-muted-foreground">{req.reason}</span>}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionPending === req.id}
                          onClick={() => void handleApproveDecline(req.id, "decline")}
                          className="text-xs"
                        >
                          Recusar
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionPending === req.id}
                          onClick={() => void handleApproveDecline(req.id, "approve")}
                          className="text-xs"
                        >
                          Aprovar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <form onSubmit={(e) => void handleRequest(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="req-pos">Posição solicitada</Label>
              <Input
                id="req-pos"
                type="number"
                min={1}
                max={totalTickets}
                value={requestPosition}
                onChange={(e) => setRequestPosition(e.target.value)}
                placeholder={`1 – ${totalTickets}`}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="req-reason">Motivo (opcional)</Label>
              <Textarea
                id="req-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Por que esta missão deve ser movida?"
                rows={3}
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting || !requestPosition}>
                {isSubmitting ? "Enviando…" : "Solicitar Reordenação"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
