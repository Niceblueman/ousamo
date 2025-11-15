/**
 * Utility functions for extracting Google Analytics/Advertising IDs from cookies
 */

export interface GoogleAnalyticsData {
  clientId: string | null
  sessionId: string | null
  advertisingId: string | null
  conversionTrackingId: string | null
}

/**
 * Parse a cookie string and return an object of key-value pairs
 */
function parseCookies(): Record<string, string> {
  if (typeof document === "undefined") return {}

  const cookies: Record<string, string> = {}
  document.cookie.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=")
    if (name) {
      cookies[name] = rest.join("=")
    }
  })
  return cookies
}

/**
 * Extract Google Analytics client ID from _ga cookie
 * Format: GA1.2.XXXXXXXXX.XXXXXXXXX or GA1.1.XXXXXXXXX.XXXXXXXXX
 * Returns: XXXXXXXXX.XXXXXXXXX (the client ID)
 */
function extractClientId(gaCookie: string): string | null {
  if (!gaCookie) return null

  const parts = gaCookie.split(".")
  if (parts.length >= 4) {
    // Return the last two parts which form the client ID
    return `${parts[2]}.${parts[3]}`
  }
  return null
}

/**
 * Extract Google Analytics session ID from _gid cookie
 * Format: GA1.2.XXXXXXXXX
 * Returns: XXXXXXXXX (the session ID)
 */
function extractSessionId(gidCookie: string): string | null {
  if (!gidCookie) return null

  const parts = gidCookie.split(".")
  if (parts.length >= 3) {
    return parts[2]
  }
  return null
}

/**
 * Extract Google Ads conversion tracking ID from _gcl_* cookies
 */
function extractConversionTrackingId(cookies: Record<string, string>): string | null {
  // Look for Google Ads conversion tracking cookies
  const gclKeys = Object.keys(cookies).filter((key) => key.startsWith("_gcl_"))
  if (gclKeys.length > 0) {
    // Usually _gcl_au is the main one
    const gclAu = cookies["_gcl_au"]
    if (gclAu) {
      return gclAu
    }
    // Return the first available conversion tracking cookie
    return cookies[gclKeys[0]]
  }
  return null
}

/**
 * Extract all Google Analytics and Advertising IDs from cookies
 */
export function extractGoogleAnalyticsData(): GoogleAnalyticsData {
  const cookies = parseCookies()

  const gaCookie = cookies["_ga"]
  const gidCookie = cookies["_gid"]

  const clientId = gaCookie ? extractClientId(gaCookie) : null
  const sessionId = gidCookie ? extractSessionId(gidCookie) : null
  const conversionTrackingId = extractConversionTrackingId(cookies)

  // The advertising ID is typically the client ID
  // In some cases, it might be in a separate cookie like _gcl_au
  const advertisingId = conversionTrackingId || clientId

  return {
    clientId,
    sessionId,
    advertisingId,
    conversionTrackingId,
  }
}

/**
 * Get a specific cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const cookies = parseCookies()
  return cookies[name] || null
}

/**
 * Check if Google Analytics cookies are present
 */
export function hasGoogleAnalyticsCookies(): boolean {
  const cookies = parseCookies()
  return "_ga" in cookies || "_gid" in cookies
}

/**
 * Get stored Google Advertising ID from localStorage
 * Returns null if not stored or if cookies not accepted
 */
export function getStoredGoogleAdvertisingId(): string | null {
  if (typeof window === "undefined") return null

  try {
    // Check if cookies are accepted
    const consent = localStorage.getItem("ousamo-cookie-consent")
    if (!consent || consent === "declined") {
      return null
    }

    // Try to get stored advertising ID
    const storedId = localStorage.getItem("ousamo-google-adv-id")
    if (storedId) {
      return storedId
    }

    // If not stored but cookies are accepted, try to extract from current cookies
    const googleData = extractGoogleAnalyticsData()
    if (googleData.advertisingId) {
      localStorage.setItem("ousamo-google-adv-id", googleData.advertisingId)
      return googleData.advertisingId
    }

    return null
  } catch (error) {
    console.debug("Failed to get stored Google Advertising ID:", error)
    return null
  }
}

/**
 * Get all stored Google Analytics data
 */
export function getStoredGoogleAnalyticsData(): GoogleAnalyticsData | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("ousamo-google-analytics")
    if (stored) {
      return JSON.parse(stored) as GoogleAnalyticsData
    }
    return null
  } catch (error) {
    console.debug("Failed to get stored Google Analytics data:", error)
    return null
  }
}

