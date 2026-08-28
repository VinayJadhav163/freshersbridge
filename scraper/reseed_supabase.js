const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [k, ...v] = trimmed.split('=');
    env[k.trim()] = v.join('=').trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Simple robust CSV parser that handles multiline quoted values
function parseCSV(text) {
  const cleanText = text.replace(/^\uFEFF/, '');
  const rows = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal);
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentVal);
      if (currentRow.some(c => c.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal.length > 0 || currentRow.length > 0) {
    currentRow.push(currentVal);
    if (currentRow.some(c => c.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  const headers = rows[0].map(h => h.trim());
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = r[idx] !== undefined ? r[idx].trim() : '';
    });
    data.push(obj);
  }
  return data;
}

async function run() {
  console.log('Connecting to Supabase at:', supabaseUrl);

  // 1. Fetch categories to map category_slug -> category_id
  const { data: categories, error: catErr } = await supabase.from('categories').select('id, slug, name');
  if (catErr) {
    console.error('Error fetching categories:', catErr);
    process.exit(1);
  }

  const catMap = new Map();
  categories.forEach(c => {
    catMap.set(c.slug.toLowerCase(), c.id);
  });
  console.log(`Loaded ${categories.length} categories:`, Array.from(catMap.keys()));

  // 2. Delete all existing jobs
  console.log('\nDeleting all existing jobs from Supabase...');
  const { data: existingJobs, error: fetchErr } = await supabase.from('jobs').select('id');
  if (fetchErr) {
    console.error('Error checking existing jobs:', fetchErr);
  } else {
    console.log(`Found ${existingJobs.length} existing jobs to delete.`);
  }

  const { error: delErr } = await supabase
    .from('jobs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (delErr) {
    console.error('Error deleting jobs:', delErr);
    // If RLS blocks full delete, delete by ID in chunks
    if (existingJobs && existingJobs.length > 0) {
      console.log('Attempting chunked ID deletion...');
      for (let i = 0; i < existingJobs.length; i += 50) {
        const chunkIds = existingJobs.slice(i, i + 50).map(j => j.id);
        await supabase.from('jobs').delete().in('id', chunkIds);
      }
    }
  } else {
    console.log('Successfully cleared all existing jobs from database.');
  }

  // 3. Read and parse latest updated clean CSV
  const csvFile = path.join(__dirname, 'output', 'latest_freshersbridge_jobs_updated.csv');
  console.log(`\nReading dataset from: ${csvFile}`);
  const csvRaw = fs.readFileSync(csvFile, 'utf-8');
  const jobsData = parseCSV(csvRaw);
  console.log(`Parsed ${jobsData.length} records from CSV.`);

  // 4. Prepare payload with unique slugs
  const slugCounts = new Map();
  const payloads = [];

  const defaultCatId = categories.length > 0 ? categories[0].id : null;

  for (const job of jobsData) {
    if (!job.title || !job.company) continue;

    const baseSlug = slugify(`${job.title}-${job.company}`);
    let finalSlug = baseSlug;
    if (slugCounts.has(baseSlug)) {
      const count = slugCounts.get(baseSlug) + 1;
      slugCounts.set(baseSlug, count);
      finalSlug = `${baseSlug}-${count}`;
    } else {
      slugCounts.set(baseSlug, 1);
    }

    const catSlug = (job.category_slug || '').toLowerCase();
    const categoryId = catMap.get(catSlug) || defaultCatId;

    const skillsArray = (job.skills || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const isIntern =
      job.title.toLowerCase().includes('intern') ||
      (job.eligibility && job.eligibility.toLowerCase().includes('intern')) ||
      (job.description && job.description.toLowerCase().includes('internship'));

    payloads.push({
      title: job.title.trim(),
      slug: finalSlug,
      company: job.company.trim(),
      location: job.location.trim(),
      category_id: categoryId,
      salary: job.salary && job.salary.trim() ? job.salary.trim() : 'Not Disclosed / As per Industry Standards',
      eligibility: job.eligibility && job.eligibility.trim() ? job.eligibility.trim() : 'B.E / B.Tech / BCA / MCA / Any Graduate',
      skills: skillsArray.length > 0 ? skillsArray : ['Software Engineering', 'Problem Solving'],
      description: job.description.trim(),
      apply_url: job.apply_url.trim(),
      source_name: job.source_name ? job.source_name.trim() : 'Job Portal',
      source_url: job.source_url ? job.source_url.trim() : job.apply_url.trim(),
      featured_job: job.featured_job === 'true' || job.featured_job === true,
      application_deadline: job.application_deadline && job.application_deadline.trim() ? job.application_deadline.trim() : null
    });

  }

  console.log(`\nPrepared ${payloads.length} clean job payloads.`);

  // 5. Insert in chunks of 50
  let insertedTotal = 0;
  for (let i = 0; i < payloads.length; i += 50) {
    const chunk = payloads.slice(i, i + 50);
    const { data: inserted, error: insErr } = await supabase.from('jobs').insert(chunk).select('id');
    if (insErr) {
      console.error(`Error inserting chunk ${i / 50 + 1}:`, insErr);
      // Try inserting item by item in failed chunk
      for (const item of chunk) {
        const { error: singleErr } = await supabase.from('jobs').insert([item]);
        if (singleErr) {
          console.error(`Failed single item (${item.company} | ${item.title}):`, singleErr.message);
        } else {
          insertedTotal++;
        }
      }
    } else {
      insertedTotal += (inserted ? inserted.length : chunk.length);
      console.log(`Inserted chunk ${i / 50 + 1} (${insertedTotal}/${payloads.length} jobs)`);
    }
  }

  console.log(`\n======================================================`);
  console.log(`SUCCESS: Ingested ${insertedTotal} clean, normalized jobs into Supabase!`);
  console.log(`======================================================\n`);
}

run().catch(err => {
  console.error('Fatal error during reseed:', err);
  process.exit(1);
});
