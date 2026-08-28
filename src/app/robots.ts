import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/nandini', '/admin', '/api/admin/'],
    },
    sitemap: 'https://freshersbridge.in/sitemap.xml',
  };
}
