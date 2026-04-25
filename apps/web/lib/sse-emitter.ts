import { EventEmitter } from "events"

export type ShinobiEventType =
  | "ticket:created"
  | "ticket:assigned"
  | "ticket:status_changed"
  | "ticket:done"
  | "ticket:cancelled"
  | "developer:status_changed"
  | "notification:new"
  | "notification:acknowledged"
  | "help_request:new"
  | "help_request:responded"
  | "checkpoint:prompt"
  | "war_room:started"
  | "war_room:ended"

export interface ShinobiEvent {
  type: ShinobiEventType
  payload: Record<string, unknown>
}

// Global singleton — prevents multiple EventEmitter instances during
// Next.js hot-module replacement in development.
declare global {
  var __sseEmitter: EventEmitter | undefined
}

export const sseEmitter: EventEmitter =
  globalThis.__sseEmitter ?? new EventEmitter()

if (process.env.NODE_ENV !== "production") {
  globalThis.__sseEmitter = sseEmitter
}

// Support up to 200 concurrent SSE connections before Node.js emits a warning
sseEmitter.setMaxListeners(200)

export function emitShinobiEvent(event: ShinobiEvent): void {
  sseEmitter.emit("shinobi_event", event)
}
