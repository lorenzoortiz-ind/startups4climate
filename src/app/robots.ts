import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.startups4climate.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/superadmin/',
          '/api/',
          '/auth/',
          '/invite/',
          '/tools/',
          '/demo/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
