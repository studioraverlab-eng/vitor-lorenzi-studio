import type { MetadataRoute } from 'next'
import { nichos } from '../data/nichos'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    ...nichos.map(n => ({
      url: `https://vitor-lorenzi-studio.vercel.app/site-para/${n.slug}`,
      lastModified: new Date('2026-10-08T12:00:00Z'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: 'https://vitor-lorenzi-studio.vercel.app/criar-site',
      lastModified: new Date('2026-10-03T19:00:00Z'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://vitor-lorenzi-studio.vercel.app',
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://vitor-lorenzi-studio.vercel.app/portfolio',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
