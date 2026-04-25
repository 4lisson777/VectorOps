import { requireAuth } from "@/lib/auth"
import { sseEmitter, type ShinobiEvent } from "@/lib/sse-emitter"

export async function GET(): Promise<Response> {
  const { session, error } = await requireAuth()
  if (error) return error

  const userId = session.userId
  const role = session.role
  const organizationId = session.organizationId

  // Capture cleanup reference so the cancel handler can call it
  let cleanup: (() => void) | null = null

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Send a heartbeat comment every 25 seconds to keep the connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"))
        } catch {
          // Controller already closed — stop the interval
          clearInterval(heartbeat)
        }
      }, 25_000)

      function onEvent(event: ShinobiEvent) {
        // Filter by organizationId when the event carries one.
        // Events without organizationId are considered global (e.g., legacy emitters).
        if (
          event.payload.organizationId !== undefined &&
          event.payload.organizationId !== organizationId
        ) {
          return
        }

        // notification:new / notification:acknowledged → only forward to the intended recipient
        if (
          (event.type === "notification:new" ||
            event.type === "notification:acknowledged") &&
          event.payload.userId !== userId
        ) {
          return
        }

        // developer:status_changed → only relevant to DEV / TECH_LEAD roles
        if (
          event.type === "developer:status_changed" &&
          role !== "DEVELOPER" &&
          role !== "TECH_LEAD"
        ) {
          return
        }

        // war_room events → only relevant to DEV / TECH_LEAD roles
        if (
          (event.type === "war_room:started" || event.type === "war_room:ended") &&
          role !== "DEVELOPER" &&
          role !== "TECH_LEAD"
        ) {
          return
        }

        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          )
        } catch {
          // Controller already closed — unregister listener to prevent leaks
          sseEmitter.off("shinobi_event", onEvent)
        }
      }

      sseEmitter.on("shinobi_event", onEvent)

      cleanup = () => {
        clearInterval(heartbeat)
        sseEmitter.off("shinobi_event", onEvent)
      }
    },
    cancel() {
      cleanup?.()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Prevent nginx from buffering the SSE stream
      "X-Accel-Buffering": "no",
    },
  })
}
