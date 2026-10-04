// Public Google Ads destination for "Clique no WhatsApp (site)".
export const ADS_ID = 'AW-18492864547'
export const WHATSAPP_CONVERSION = `${ADS_ID}/se9MCO6E-Y8dEKPwivJE`

type AdsWindow = Window & { gtag?: (...args: unknown[]) => void }

/** Track an outbound contact action; never send form answers to Google. */
export function trackWhatsAppConversion(onComplete?: () => void) {
  if (typeof window === 'undefined') return
  let completed = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const finish = () => {
    if (completed) return
    completed = true
    if (timer) clearTimeout(timer)
    onComplete?.()
  }
  // Ad blockers or failed requests must never prevent contacting the Studio.
  if (onComplete) timer = setTimeout(finish, 1200)
  const gtag = (window as AdsWindow).gtag
  if (!gtag) { finish(); return }
  try {
    gtag('event', 'conversion', {
      send_to: WHATSAPP_CONVERSION,
      value: 1,
      currency: 'BRL',
      ...(onComplete ? { event_callback: finish, event_timeout: 1000 } : {}),
    })
  } catch {
    finish()
  }
}
