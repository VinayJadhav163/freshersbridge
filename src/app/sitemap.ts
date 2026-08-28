import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { GUIDE_ARTICLES } from '@/lib/guidesData';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://freshersbridge.in';

  // Base static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/internships`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/career-tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/affiliate-disclosure`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Career guide static routes from editorial data
  const guideRoutes: MetadataRoute.Sitemap = GUIDE_ARTICLES.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic job details routes fetched from the database
  try {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('slug, created_at')
      .order('created_at', { ascending: false });

    if (jobs && jobs.length > 0) {
      const dynamicRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: new Date(job.created_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

      return [...staticRoutes, ...guideRoutes, ...dynamicRoutes];
    }
  } catch (err) {
    console.error('Failed to generate sitemap dynamic routes:', err);
  }

  return [...staticRoutes, ...guideRoutes];
}
