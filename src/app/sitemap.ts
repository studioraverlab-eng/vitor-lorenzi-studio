import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
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
