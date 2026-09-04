export const COOKIE_CONSENT_COOKIE = "lapitex-cookie-consent";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60;

export type CookieConsent = "allow" | "deny";

export function isCookieConsent(value: string | null | undefined): value is CookieConsent {
  return value === "allow" || value === "deny";
}

export function getCookieConsent(): CookieConsent | null {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_CONSENT_COOKIE}=`));

  if (!cookie) return null;

  try {
    const value = decodeURIComponent(cookie.slice(COOKIE_CONSENT_COOKIE.length + 1));
    return isCookieConsent(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Keeps the UI responsive while the server also sets the authoritative cookie.
 * This preference is not an authentication credential and is intentionally
 * readable by the banner so it can show again after the idle period ends.
 */
export function setClientCookieConsent(status: CookieConsent) {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_CONSENT_COOKIE}=${status}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}
