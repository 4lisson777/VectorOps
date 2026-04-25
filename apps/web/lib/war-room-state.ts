export interface WarRoomData {
  organizationId: string
  title: string
  message: string | null
  startedAt: string // ISO 8601
  startedById: string
  startedByName: string
}

declare global {
  // eslint-disable-next-line no-var
  var __warRoomStore: Map<string, WarRoomData> | undefined
}

const warRoomStore: Map<string, WarRoomData> =
  globalThis.__warRoomStore ?? new Map()

if (process.env.NODE_ENV !== "production") {
  globalThis.__warRoomStore = warRoomStore
}

export function getWarRoom(organizationId: string): WarRoomData | null {
  return warRoomStore.get(organizationId) ?? null
}

export function setWarRoom(data: WarRoomData): void {
  warRoomStore.set(data.organizationId, data)
}

export function clearWarRoom(organizationId: string): void {
  warRoomStore.delete(organizationId)
}
