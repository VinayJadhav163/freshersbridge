import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

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
  ];

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

      return [...staticRoutes, ...dynamicRoutes];
    }
  } catch (err) {
    console.error('Failed to generate sitemap dynamic routes:', err);
  }

  return staticRoutes;
}
