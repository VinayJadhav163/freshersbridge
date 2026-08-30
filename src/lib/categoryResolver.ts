import { Category } from '@/types';

/**
 * Resolves a category slug or alias (e.g. 'data-science-analytics' -> 'data-analytics')
 * against the live categories list with smart fuzzy matching.
 */
export function resolveCategory(categories: Category[], slugOrAlias: string): Category | undefined {
  if (!slugOrAlias) return undefined;
  const clean = slugOrAlias.toLowerCase().trim();

  // 1. Direct exact slug match
  const direct = categories.find((c) => c.slug.toLowerCase() === clean);
  if (direct) return direct;

  // 2. Comprehensive Aliases
  const aliases: Record<string, string> = {
    'data-science-analytics': 'data-analytics',
    'data-science': 'data-analytics',
    'analytics': 'data-analytics',
    'data': 'data-analytics',
    'software-dev': 'software-development',
    'software-engineer': 'software-development',
    'software': 'software-development',
    'web-dev': 'web-development',
    'web': 'web-development',
    'frontend': 'web-development',
    'fullstack': 'web-development',
    'devops': 'devops-cloud',
    'cloud': 'devops-cloud',
    'qa': 'qa-testing',
    'testing': 'qa-testing',
    'database': 'database-administration',
    'dba': 'database-administration',
    'sql': 'database-administration',
  };

  const mappedSlug = aliases[clean];
  if (mappedSlug) {
    const mapped = categories.find((c) => c.slug.toLowerCase() === mappedSlug);
    if (mapped) return mapped;
  }

  // 3. Name or partial match
  return categories.find(
    (c) =>
      c.name.toLowerCase().includes(clean) ||
      clean.includes(c.slug.toLowerCase()) ||
      clean.includes(c.name.toLowerCase())
  );
}
