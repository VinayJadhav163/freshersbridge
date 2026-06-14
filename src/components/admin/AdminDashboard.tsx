'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Category, Job } from '@/types';
import { 
  saveJob, 
  deleteJob, 
  addCategory, 
  deleteCategory 
} from '@/app/admin/actions';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Eye, 
  Briefcase, 
  FolderPlus, 
  BarChart4, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  initialJobs: Job[];
  initialCategories: Category[];
}

export default function AdminDashboard({ initialJobs, initialCategories }: AdminDashboardProps) {
  const router = useRouter();
  
  // Lists state
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Sync state with props when they change
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // Admin key auth state
  const [adminKey, setAdminKey] = useState<string>('');
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);

  // Tabs & Forms UI state
  const [activeTab, setActiveTab] = useState<'jobs' | 'categories'>('jobs');
  const [showJobForm, setShowJobForm] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Category Form State
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatSlug, setNewCatSlug] = useState<string>('');

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    slug: '',
    company: '',
    location: '',
    category_id: '',
    salary: '',
    eligibility: '',
    skills: '',
    description: '',
    apply_url: '',
    source_name: 'Company Website',
    source_url: '',
    featured_job: false,
    application_deadline: '',
  });

  // Action loading/notification states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load admin key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('freshersbridge_admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim()) {
      localStorage.setItem('freshersbridge_admin_key', adminKey.trim());
      setIsKeySaved(true);
      showNotification('success', 'Admin key saved locally.');
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('freshersbridge_admin_key');
    setAdminKey('');
    setIsKeySaved(false);
    showNotification('success', 'Admin key removed.');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Open Job form for creation
  const handleAddJobClick = () => {
    setEditingJob(null);
    setJobForm({
      title: '',
      slug: '',
      company: '',
      location: '',
      category_id: categories[0]?.id || '',
      salary: '',
      eligibility: 'BCA, MCA, BTech',
      skills: '',
      description: '',
      apply_url: '',
      source_name: 'Company Website',
      source_url: '',
      featured_job: false,
      application_deadline: '',
    });
    setShowJobForm(true);
  };

  // Open Job form for editing
  const handleEditJobClick = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      slug: job.slug,
      company: job.company,
      location: job.location,
      category_id: job.category_id || '',
      salary: job.salary || '',
      eligibility: job.eligibility,
      skills: job.skills.join(', '),
      description: job.description,
      apply_url: job.apply_url,
      source_name: job.source_name || 'Company Website',
      source_url: job.source_url || '',
      featured_job: job.featured_job,
      application_deadline: job.application_deadline ? job.application_deadline.split('T')[0] : '',
    });
    setShowJobForm(true);
  };

  // Handle Job Form Submission
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }

    setIsSubmitting(true);
    const result = await saveJob(
      {
        id: editingJob?.id,
        ...jobForm,
      },
      adminKey
    );
    setIsSubmitting(false);

    if (result.success) {
      showNotification('success', `Job successfully ${editingJob ? 'updated' : 'created'}.`);
      setShowJobForm(false);
      router.refresh(); // Sync server props
    } else {
      showNotification('error', result.error || 'Failed to save job.');
    }
  };

  // Handle Job Deletion
  const handleDeleteJob = async (id: string) => {
    if (!adminKey) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }

    if (confirm('Are you sure you want to delete this job posting?')) {
      const result = await deleteJob(id, adminKey);
      if (result.success) {
        showNotification('success', 'Job posting deleted.');
        router.refresh();
      } else {
        showNotification('error', result.error || 'Failed to delete job.');
      }
    }
  };

  // Handle Category Submission
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (!adminKey) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }

    setIsSubmitting(true);
    const result = await addCategory(newCatName, newCatSlug, adminKey);
    setIsSubmitting(false);

    if (result.success) {
      showNotification('success', 'Category created successfully.');
      setNewCatName('');
      setNewCatSlug('');
      router.refresh();
    } else {
      showNotification('error', result.error || 'Failed to add category.');
    }
  };

  // Handle Category Deletion
  const handleDeleteCategory = async (id: string) => {
    if (!adminKey) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }

    if (confirm('Are you sure you want to delete this category? Jobs referencing this category will have category set to null.')) {
      const result = await deleteCategory(id, adminKey);
      if (result.success) {
        showNotification('success', 'Category deleted.');
        router.refresh();
      } else {
        showNotification('error', result.error || 'Failed to delete category.');
      }
    }
  };

  // Calculate statistics
  const totalViews = jobs.reduce((sum, job) => sum + (job.views_count || 0), 0);
  const featuredCount = jobs.filter((job) => job.featured_job).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage job postings, categories, and view analytics.</p>
        </div>

        {/* Admin Key authentication checker */}
        <form onSubmit={handleSaveKey} className="flex items-center gap-2">
          <div className="relative">
            <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Enter Admin Access Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              disabled={isKeySaved}
              className="rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-600 disabled:opacity-75"
            />
          </div>
          {isKeySaved ? (
            <button
              type="button"
              onClick={handleClearKey}
              className="rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-xs font-semibold text-rose-500 transition-colors"
            >
              Clear Key
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
            >
              Save Key
            </button>
          )}
        </form>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`flex items-center gap-2.5 rounded-lg border p-4 text-sm animate-pulse-glow ${
            notification.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-550/10 text-emerald-600 dark:text-emerald-400'
              : 'border-rose-500/20 bg-rose-550/10 text-rose-600 dark:text-rose-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Jobs</p>
            <p className="text-2xl font-black text-foreground">{jobs.length}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/10 text-amber-500">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Featured</p>
            <p className="text-2xl font-black text-foreground">{featuredCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-500">
            <BarChart4 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Views</p>
            <p className="text-2xl font-black text-foreground">{totalViews}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/10 text-purple-500">
            <FolderPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
            <p className="text-2xl font-black text-foreground">{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex items-center border-b border-border">
        <button
          onClick={() => {
            setActiveTab('jobs');
            setShowJobForm(false);
          }}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
            activeTab === 'jobs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Manage Jobs
        </button>
        <button
          onClick={() => {
            setActiveTab('categories');
            setShowJobForm(false);
          }}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
            activeTab === 'categories'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Manage Categories
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {!showJobForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Active Job Postings</h2>
                <button
                  onClick={handleAddJobClick}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Add New Job
                </button>
              </div>

              {/* Jobs Table */}
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-muted-foreground font-semibold">
                      <th className="p-4">Job Title</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-center">Featured?</th>
                      <th className="p-4 text-center">Views</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {jobs.length > 0 ? (
                      jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-secondary/25 transition-colors">
                          <td className="p-4 font-semibold text-foreground">
                            <Link href={`/jobs/${job.slug}`} target="_blank" className="hover:underline hover:text-indigo-600 inline-flex items-center gap-1">
                              {job.title} <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </Link>
                          </td>
                          <td className="p-4 text-muted-foreground">{job.company}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground border border-border">
                              {job.categories?.name || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {job.featured_job ? (
                              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600">
                                Yes
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">No</span>
                            )}
                          </td>
                          <td className="p-4 text-center font-medium text-foreground/80 flex items-center justify-center gap-1 py-5">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" /> {job.views_count}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditJobClick(job)}
                              className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-secondary hover:text-indigo-600 transition-colors"
                              title="Edit Job"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-secondary hover:text-rose-500 transition-colors"
                              title="Delete Job"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-muted-foreground">
                          No jobs posted yet. Click &quot;Add New Job&quot; to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Add/Edit Job Form
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-lg font-bold text-foreground">
                  {editingJob ? 'Edit Job Posting' : 'Post New Job Opportunity'}
                </h2>
                <button
                  onClick={() => setShowJobForm(false)}
                  className="rounded-lg p-2 hover:bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleJobSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      placeholder="e.g., Software Engineer Intern"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Slug */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Slug (Optional, auto-generated)</label>
                    <input
                      type="text"
                      value={jobForm.slug}
                      onChange={(e) => setJobForm({ ...jobForm, slug: e.target.value })}
                      placeholder="e.g., software-engineer-intern-microsoft"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Company */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      placeholder="e.g., Microsoft"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Location *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="e.g., Bangalore, India (Hybrid) or Remote"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Category *</label>
                    <select
                      required
                      value={jobForm.category_id}
                      onChange={(e) => setJobForm({ ...jobForm, category_id: e.target.value })}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Salary */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Salary / Stipend</label>
                    <input
                      type="text"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      placeholder="e.g., 6 - 8 LPA or ₹25,000/month"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Eligibility */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Eligibility Criteria *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.eligibility}
                      onChange={(e) => setJobForm({ ...jobForm, eligibility: e.target.value })}
                      placeholder="e.g., BCA, MCA, BTech or 2025/2026 Batch"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Deadline */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Application Deadline</label>
                    <input
                      type="date"
                      value={jobForm.application_deadline}
                      onChange={(e) => setJobForm({ ...jobForm, application_deadline: e.target.value })}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Apply URL */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-foreground">Apply Link (External URL) *</label>
                    <input
                      type="url"
                      required
                      value={jobForm.apply_url}
                      onChange={(e) => setJobForm({ ...jobForm, apply_url: e.target.value })}
                      placeholder="https://careers.company.com/job-apply-page"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Source Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Source Website Name</label>
                    <input
                      type="text"
                      value={jobForm.source_name}
                      onChange={(e) => setJobForm({ ...jobForm, source_name: e.target.value })}
                      placeholder="e.g., Company Website, LinkedIn"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Source URL */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Source Original Link (Optional)</label>
                    <input
                      type="url"
                      value={jobForm.source_url}
                      onChange={(e) => setJobForm({ ...jobForm, source_url: e.target.value })}
                      placeholder="https://linkedin.com/jobs/view/..."
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Skills */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-foreground">Skills Required (Comma separated) *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.skills}
                      onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                      placeholder="React, TypeScript, Node.js, Git"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-foreground">Full Job Description *</label>
                    <textarea
                      required
                      rows={8}
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      placeholder="Provide job outline, responsibilities, eligibility details..."
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600 font-sans resize-y"
                    />
                  </div>
                </div>

                {/* Featured Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobForm.featured_job}
                      onChange={(e) => setJobForm({ ...jobForm, featured_job: e.target.checked })}
                      className="rounded border-border text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm font-semibold text-foreground">🔥 Highlight this as a Featured Job</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Job Posting'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Add Category Form */}
          <div className="md:col-span-1 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 h-fit">
            <h2 className="text-base font-bold text-foreground">Add New Category</h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g., QA & Testing"
                  className="rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Slug (Optional)</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="e.g., qa-testing"
                  className="rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Category'}
              </button>
            </form>
          </div>

          {/* Categories list */}
          <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground">Existing Categories</h2>
            
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-muted-foreground font-semibold">
                    <th className="p-3">Category Name</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-secondary/25 transition-colors">
                        <td className="p-3 font-semibold text-foreground">{cat.name}</td>
                        <td className="p-3 text-muted-foreground">{cat.slug}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:bg-secondary hover:text-rose-500 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-muted-foreground">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
