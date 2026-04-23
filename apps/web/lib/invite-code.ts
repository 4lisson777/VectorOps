import { randomBytes } from "node:crypto"

// Uppercase alphanumeric characters excluding visually ambiguous characters:
// 0 (zero) / O (letter O), 1 (one) / I (letter I) / L (letter L)
const INVITE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"

/**
 * Generates a cryptographically random 8-character invite code.
 * Uses uppercase alphanumeric characters, excluding 0/O, 1/I, and L
 * to prevent user confusion when reading codes aloud or from a screen.
 */
export function generateInviteCode(): string {
  const bytes = randomBytes(8)
  let code = ""
  for (const byte of bytes) {
    // Use modulo to map each byte to a character in our alphabet.
    // Slight bias is acceptable here — invite codes are not cryptographic keys.
    code += INVITE_ALPHABET[byte % INVITE_ALPHABET.length]
  }
  return code
}

/**
 * Converts an organization name into a URL-safe slug.
 * Example: "Inovar Sistemas Ltda." → "inovar-sistemas-ltda"
 */
export function generateOrgSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")         // spaces → hyphens
    .replace(/[^a-z0-9-]/g, "")  // remove non-alphanumeric-hyphen chars
    .replace(/^-+|-+$/g, "")     // trim leading/trailing hyphens
}
