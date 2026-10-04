export const STUDIO_WHATSAPP = '5515991375380'
export const ACQUISITION_PATH = '/criar-site'

const clean = (value: string | null, fallback = '') =>
  (value || fallback).replace(/[^a-zA-Z0-9_./-]/g, '').slice(0, 70)

/** Keep only campaign labels, never arbitrary URLs, click IDs or personal data. */
export function sourceLabel(search: string, referrer = '') {
  const params = new URLSearchParams(search)
  let source = clean(params.get('utm_source'))
  if (!source && params.has('gclid')) source = 'google'
  if (!source && params.has('fbclid')) source = 'meta'
  if (!source && referrer) {
    try {
      const host = new URL(referrer).hostname
      if (/(^|\.)google\.[a-z.]+$/.test(host)) source = 'google-organico'
      else if (/(^|\.)(instagram|facebook|linkedin|youtube|tiktok)\.com$/.test(host)) source = host.replace(/^(www|m)\./, '')
    } catch { /* A malformed referrer is simply ignored. */ }
  }
  return [source || 'site-direto', clean(params.get('utm_campaign')), clean(params.get('utm_content'))].filter(Boolean).join(' / ')
}

export function whatsappUrl(message: string, source: string) {
  return `https://wa.me/${STUDIO_WHATSAPP}?text=${encodeURIComponent(`${message}\n\nOrigem: ${source}`)}`
}
