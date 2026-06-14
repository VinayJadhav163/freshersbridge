export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  company: string;
  location: string;
  category_id: string | null;
  salary: string | null;
  eligibility: string; // e.g., "BCA", "MCA", "BTech"
  skills: string[]; // text[] in PostgreSQL
  description: string;
  apply_url: string;
  source_name: string;
  source_url: string | null;
  featured_job: boolean;
  views_count: number;
  application_deadline: string | null;
  created_at: string;
  // Relational details populated via Supabase joins
  categories?: Category | null;
}
