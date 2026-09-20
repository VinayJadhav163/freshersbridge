import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/nandini',
          '/admin',
          '/api/admin/',
          '/api/og/',
          '/*?*q=',
          '/*?*location=',
          '/*?*eligibility=',
        ],
      },
      // Explicitly allow AI Search Engines & RAG Crawlers for GEO / AEO
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Googlebot',
          'Bingbot',
        ],
        allow: [
          '/',
          '/jobs',
          '/jobs/*',
          '/internships',
          '/internships/*',
          '/companies',
          '/companies/*',
          '/guides',
          '/guides/*',
          '/career-tools',
        ],
        disallow: [
          '/admin',
          '/api/admin/',
        ],
      },
    ],
    sitemap: 'https://freshersbridge.in/sitemap.xml',
  };
}

