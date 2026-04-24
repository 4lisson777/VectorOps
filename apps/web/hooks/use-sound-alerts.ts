"use client"
import { useRef } from "react"

type Tone = "A" | "B" | "C" | "D" | "E"

interface ToneConfig {
  frequency: number
  type: OscillatorType
  durationMs: number
}

const TONES: Record<Tone, ToneConfig> = {
  A: { frequency: 880, type: "sine", durationMs: 300 },      // New ticket
  B: { frequency: 440, type: "sawtooth", durationMs: 500 },  // New bug
  C: { frequency: 660, type: "triangle", durationMs: 400 },  // Help request
  D: { frequency: 528, type: "sine", durationMs: 250 },      // Checkpoint
  E: { frequency: 1046, type: "sine", durationMs: 200 },     // Done/cancelled
}

export function useSoundAlerts() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  function getOrCreateAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContext()
      } catch {
        return null
      }
    }
    return audioCtxRef.current
  }

  async function playTone(tone: Tone) {
    // Respect the user's mute preference
    if (typeof window !== "undefined" &&
        localStorage.getItem("vectorops:soundEnabled") === "false") {
      return
    }

    const ctx = getOrCreateAudioContext()
    if (!ctx) return

    // Resume if suspended (browser gesture requirement)
    if (ctx.state === "suspended") {
      try {
        await ctx.resume()
      } catch {
        return
      }
    }

    const config = TONES[tone]
    const durationSec = config.durationMs / 1000
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = config.type
    oscillator.frequency.setValueAtTime(config.frequency, now)

    // Gain envelope: ramp up quickly then fade out
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec)

    oscillator.start(now)
    oscillator.stop(now + durationSec)
  }

  return { playTone }
}
