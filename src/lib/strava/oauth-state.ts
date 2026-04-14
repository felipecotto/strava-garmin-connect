import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

import { getStravaOAuthConfig } from "@/lib/strava/env"

const TTL_MS = 15 * 60 * 1000

function signingKey(): string {
  const { clientSecret } = getStravaOAuthConfig()
  return clientSecret
}

/**
 * State OAuth assinado (sem cookie). Resolve preview vs produção: o cookie ficava
 * no host A e o callback no host B (redirect_uri), gerando invalid_state.
 * Usa o mesmo segredo do app Strava em todos os ambientes (Preview/Production).
 */
export function createStravaOAuthState(): string {
  const nonce = randomBytes(24).toString("hex")
  const t = Date.now()
  const sig = createHmac("sha256", signingKey())
    .update(`${nonce}|${t}`)
    .digest("hex")
  const raw = `${nonce}.${t}.${sig}`
  return Buffer.from(raw, "utf8").toString("base64url")
}

export function verifyStravaOAuthState(stateParam: string | null): boolean {
  if (!stateParam) {
    return false
  }
  try {
    const raw = Buffer.from(stateParam, "base64url").toString("utf8")
    const parts = raw.split(".")
    if (parts.length !== 3) {
      return false
    }
    const [nonce, tStr, sig] = parts
    const t = Number(tStr)
    const now = Date.now()
    if (!Number.isFinite(t) || now - t > TTL_MS || t > now + 60_000) {
      return false
    }
    const expected = createHmac("sha256", signingKey())
      .update(`${nonce}|${t}`)
      .digest("hex")
    if (sig.length !== expected.length) {
      return false
    }
    return timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"))
  } catch {
    return false
  }
}
