# Deployment Guide for Vercel (FreshersBridge.in)

This guide walks you through deploying your FreshersBridge web application to Vercel and linking your custom domain `FreshersBridge.in`.

## Step 1: Push Project to GitHub / GitLab / Bitbucket
1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "feat: freshersbridge mvp v1 release"
   ```
2. Create a repository on GitHub (e.g., `freshersbridge-portal`).
3. Link the remote and push the code:
   ```bash
   git remote add origin https://github.com/your-username/freshersbridge-portal.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your git repository from the list.
4. Under **Environment Variables**, expand the section and add the keys from your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Your Supabase public anon key)
   - `ADMIN_ACCESS_KEY` = (Your custom Admin dashboard password, e.g., `freshersbridgeadmin2026`)
5. Click **Deploy**. Vercel will install the dependencies, execute the Next.js compilation, build static files, and launch your site.

## Step 3: Link Custom Domain (FreshersBridge.in)
1. In your Vercel project dashboard, go to **Settings** -> **Domains**.
2. Type `FreshersBridge.in` and click **Add**.
3. Select the recommended setting (redirecting the `www` subdomain to the root domain or vice versa).
4. Vercel will show the DNS configurations you need to add to your Domain Registrar (e.g., GoDaddy, Namecheap, Google Domains):
   - **For Root Domain (`freshersbridge.in`)**: Add an `A` record pointing to `76.76.21.21`.
   - **For Subdomain (`www.freshersbridge.in`)**: Add a `CNAME` record pointing to `cname.vercel-dns.com`.
5. Once added, Vercel will automatically verify the DNS changes and generate a free Let's Encrypt SSL certificate for your site.

## Future Optimization & Production checklist:
- **Build Verification:** Run `npm run build` locally prior to committing files to detect compile errors or TypeScript warnings early.
- **Cache Invalidation:** If you add or modify a job on the admin dashboard, Next.js Server Actions automatically revalidate cache for `/`, `/jobs`, and the job details pages, ensuring instantaneous updates for users.
