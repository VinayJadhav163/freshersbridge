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

/**
 * Strictly ordered category sequence requested:
 * 1. Software Development
 * 2. Web Development
 * 3. Data Science & Analytics
 * 4. QA & Testing
 * 5. DevOps & Cloud
 * 6. Database Administration
 */
export function getCategorySortOrder(cat: Category): number {
  const slug = (cat.slug || '').toLowerCase();
  const name = (cat.name || '').toLowerCase();

  if (slug.includes('software') || name.includes('software')) return 1;
  if (slug.includes('web') || name.includes('web') || slug.includes('frontend') || name.includes('frontend')) return 2;
  if (slug.includes('data') || name.includes('data') || slug.includes('analytics') || name.includes('analytics')) return 3;
  if (slug.includes('qa') || slug.includes('test') || name.includes('qa') || name.includes('test')) return 4;
  if (slug.includes('devops') || slug.includes('cloud') || name.includes('devops') || name.includes('cloud')) return 5;
  if (slug.includes('database') || slug.includes('dba') || name.includes('database') || name.includes('admin')) return 6;
  return 99;
}

export function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => {
    const diff = getCategorySortOrder(a) - getCategorySortOrder(b);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name);
  });
}

