import type { MetadataRoute } from 'next'

const SITE_URL = 'https://noir-demons-landing-page.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}