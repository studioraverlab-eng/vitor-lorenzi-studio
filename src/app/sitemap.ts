import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
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
