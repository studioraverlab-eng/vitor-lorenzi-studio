'use client'

import Script from 'next/script'
import { useEffect } from 'react'

import { ADS_ID, trackWhatsAppConversion } from '../lib/googleAds'

export default function GoogleAdsTag() {
  useEffect(() => {
    // Um listener só, no documento: pega todo link de WhatsApp do site,
    // inclusive os que ainda vão ser criados.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!link) return
      const url = new URL(link.href)
      if (!['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) return
      const sameTab = (!link.target || link.target === '_self') && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
      if (sameTab) {
        event.preventDefault()
        trackWhatsAppConversion(() => window.location.assign(link.href))
      } else {
        trackWhatsAppConversion()
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="afterInteractive" />
      <Script id="gads-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ADS_ID}');`}
      </Script>
    </>
  )
}
