'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Category, Job, Subscriber } from '@/types';
import { 
  saveJob, 
  deleteJob, 
  addCategory, 
  deleteCategory,
  addSubscriberAdmin,
  deleteSubscriberAdmin,
  sendDigestBroadcastAction,
  logoutAdminAction,
  resetAllJobViewsAction,
  deleteAllJobsAction,
  deleteSelectedJobsAction,
  deleteJobsByDateAction,
  bulkUploadJobsAction
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
  ExternalLink,
  Copy,
  Upload,
  Download,
  Search,
  Mail,
  Send,
  UserPlus,
  LogOut,
  ShieldCheck,
  RotateCcw,
  Calendar,
  CheckSquare,
  Filter,
  MessageSquare,
  Share2,
  SendHorizontal
} from 'lucide-react';

interface AdminDashboardProps {
  initialJobs: Job[];
  initialCategories: Category[];
  initialSubscribers?: Subscriber[];
}

export default function AdminDashboard({ initialJobs, initialCategories, initialSubscribers = [] }: AdminDashboardProps) {
  const router = useRouter();
  
  // Lists state
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);

  // Sync state with props when they change
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setSubscribers(initialSubscribers);
  }, [initialSubscribers]);

  // Admin key auth state
  const [adminKey, setAdminKey] = useState<string>('');
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);

  // Tabs & Forms UI state
  const [activeTab, setActiveTab] = useState<'jobs' | 'categories' | 'subscribers' | 'broadcasts'>('jobs');
  const [showJobForm, setShowJobForm] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Community Broadcasts State
  const [broadcastPlatform, setBroadcastPlatform] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [pabblyWebhookInput, setPabblyWebhookInput] = useState<string>('');
  const [telegramBotToken, setTelegramBotToken] = useState<string>('');
  const [telegramChannelId, setTelegramChannelId] = useState<string>('');
  const [copiedBatchIndex, setCopiedBatchIndex] = useState<number | null>(null);
  const [isDispatchingPabbly, setIsDispatchingPabbly] = useState<boolean>(false);
  const [isDispatchingTelegram, setIsDispatchingTelegram] = useState<boolean>(false);
  const [pabblyBatchStatus, setPabblyBatchStatus] = useState<{ [key: number]: 'idle' | 'sending' | 'success' | 'error' }>({});
  const [telegramBatchStatus, setTelegramBatchStatus] = useState<{ [key: number]: 'idle' | 'sending' | 'success' | 'error' }>({});
  const [pabblyStatusMessage, setPabblyStatusMessage] = useState<string>('');
  const [telegramStatusMessage, setTelegramStatusMessage] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWebhook = localStorage.getItem('fb_pabbly_webhook');
      if (savedWebhook) setPabblyWebhookInput(savedWebhook);
      const savedTgToken = localStorage.getItem('fb_tg_token');
      if (savedTgToken) setTelegramBotToken(savedTgToken);
      const savedTgChannel = localStorage.getItem('fb_tg_channel');
      if (savedTgChannel) setTelegramChannelId(savedTgChannel);
    }
  }, []);
  
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
    company_logo: '',
    job_type: 'full-time',
    featured_job: false,
    application_deadline: '',
  });

  // Action loading/notification states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Filter & Sort state for admin table
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>('');
  const [adminTypeFilter, setAdminTypeFilter] = useState<'all' | 'job' | 'internship'>('all');
  const [adminSortBy, setAdminSortBy] = useState<'newest' | 'oldest' | 'most-views' | 'title-asc' | 'deadline'>('newest');

  // Multi-select & Batch Delete States
  const [selectedJobRowIds, setSelectedJobRowIds] = useState<string[]>([]);
  const [showDeleteByDateModal, setShowDeleteByDateModal] = useState<boolean>(false);
  const [deleteDateTarget, setDeleteDateTarget] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deleteDateMode, setDeleteDateMode] = useState<'exact' | 'before'>('exact');
  const [deleteDateJobType, setDeleteDateJobType] = useState<'all' | 'job' | 'internship'>('all');

  // Subscriber UI state
  const [adminSubscriberSearch, setAdminSubscriberSearch] = useState<string>('');
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState<boolean>(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [newSubEmail, setNewSubEmail] = useState<string>('');
  const [newSubName, setNewSubName] = useState<string>('');

  // Multi-Job Digest Broadcast State
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [customDigestSubject, setCustomDigestSubject] = useState<string>('');
  const [isSendingDigest, setIsSendingDigest] = useState<boolean>(false);

  const downloadSubscribersCSV = () => {
    if (subscribers.length === 0) {
      showNotification('error', 'No subscribers available to export.');
      return;
    }
    const headers = ['Email', 'Name', 'Source', 'Status', 'Subscribed At'];
    const rows = subscribers.map((sub) => [
      `"${sub.email.replace(/"/g, '""')}"`,
      `"${(sub.name || '').replace(/"/g, '""')}"`,
      `"${(sub.source || 'footer').replace(/"/g, '""')}"`,
      `"${(sub.status || 'active').replace(/"/g, '""')}"`,
      `"${new Date(sub.created_at).toLocaleString()}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freshersbridge_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showNotification('success', `Exported ${subscribers.length} subscribers to CSV!`);
  };

  const copyAllEmailsToClipboard = () => {
    if (subscribers.length === 0) {
      showNotification('error', 'No subscriber emails to copy.');
      return;
    }
    const emailList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    showNotification('success', `Copied ${subscribers.length} subscriber emails to clipboard!`);
  };

  const handleAddSubscriberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }
    if (!newSubEmail || !newSubEmail.includes('@')) {
      showNotification('error', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await addSubscriberAdmin(newSubEmail, newSubName, adminKey);
    setIsSubmitting(false);

    if (res.success && res.subscriber) {
      setSubscribers((prev) => [res.subscriber, ...prev]);
      setNewSubEmail('');
      setNewSubName('');
      setShowAddSubscriberModal(false);
      showNotification('success', 'Subscriber added successfully.');
    } else {
      showNotification('error', res.error || 'Failed to add subscriber.');
    }
  };

  const handleDeleteSubscriberClick = async (id: string) => {
    if (!adminKey) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }
    if (!confirm('Are you sure you want to remove this subscriber?')) return;

    const res = await deleteSubscriberAdmin(id, adminKey);
    if (res.success) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      showNotification('success', 'Subscriber removed.');
    } else {
      showNotification('error', res.error || 'Failed to remove subscriber.');
    }
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const query = adminSubscriberSearch.toLowerCase();
    return sub.email.toLowerCase().includes(query) || (sub.name && sub.name.toLowerCase().includes(query));
  });

  const toggleSelectJobForDigest = (jobId: string) => {
    setSelectedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleSelectAllTopJobs = () => {
    const topIds = jobs.slice(0, 10).map((j) => j.id);
    setSelectedJobIds(topIds);
  };

  const handleSendDigestBroadcast = async () => {
    if (!adminKey) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }
    if (subscribers.length === 0) {
      showNotification('error', 'No active subscribers to send broadcast to.');
      return;
    }

    setIsSendingDigest(true);
    const targetIds = selectedJobIds.length > 0 ? selectedJobIds : jobs.slice(0, 10).map((j) => j.id);

    const result = await sendDigestBroadcastAction(
      targetIds,
      customDigestSubject,
      adminKey
    );
    setIsSendingDigest(false);

    if (result.success) {
      showNotification('success', `Multi-Job Digest sent successfully to ${result.count ?? subscribers.length} subscribers!`);
      setShowBroadcastModal(false);
      setSelectedJobIds([]);
      setCustomDigestSubject('');
    } else {
      showNotification('error', result.error || 'Failed to send digest broadcast.');
    }
  };

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

  const handleLogout = async () => {
    try {
      localStorage.removeItem('freshersbridge_admin_key');
      await logoutAdminAction();
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleResetViews = async () => {
    if (!confirm('Are you sure you want to reset all job views to 0 for a fresh launch start?')) {
      return;
    }
    const key = adminKey || localStorage.getItem('freshersbridge_admin_key') || '';
    const res = await resetAllJobViewsAction(key);
    if (res.success) {
      setJobs((prev) => prev.map((j) => ({ ...j, views_count: 0 })));
      showNotification('success', 'All job views have been reset to 0.');
    } else {
      showNotification('error', res.error || 'Failed to reset views.');
    }
  };

  const handleDeleteAllJobs = async () => {
    const confirm1 = confirm(`⚠️ WARNING: Are you sure you want to permanently delete ALL ${jobs.length} jobs from the database?`);
    if (!confirm1) return;

    const confirm2 = prompt('Please type "DELETE ALL" to confirm clearing the entire jobs database:');
    if (confirm2?.trim() !== 'DELETE ALL') {
      showNotification('error', 'Action cancelled. Jobs were not deleted.');
      return;
    }

    setIsSubmitting(true);
    const key = adminKey || localStorage.getItem('freshersbridge_admin_key') || '';
    const res = await deleteAllJobsAction(key);
    setIsSubmitting(false);

    if (res.success) {
      setJobs([]);
      setSelectedJobRowIds([]);
      showNotification('success', 'All jobs have been permanently removed. Ready for new CSV upload.');
      router.refresh();
    } else {
      showNotification('error', res.error || 'Failed to delete all jobs.');
    }
  };

  const toggleSelectJobRow = (id: string) => {
    setSelectedJobRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = (filteredIds: string[]) => {
    const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedJobRowIds.includes(id));
    if (allSelected) {
      setSelectedJobRowIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedJobRowIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleDeleteSelectedJobs = async () => {
    if (selectedJobRowIds.length === 0) return;
    const key = adminKey || localStorage.getItem('freshersbridge_admin_key') || '';
    if (!key) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedJobRowIds.length} selected postings? This action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteSelectedJobsAction(selectedJobRowIds, key);
    setIsSubmitting(false);

    if (result.success) {
      setJobs((prev) => prev.filter((j) => !selectedJobRowIds.includes(j.id)));
      showNotification('success', `Deleted ${selectedJobRowIds.length} selected postings successfully.`);
      setSelectedJobRowIds([]);
      router.refresh();
    } else {
      showNotification('error', result.error || 'Failed to delete selected jobs.');
    }
  };

  const handleDeleteByDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = adminKey || localStorage.getItem('freshersbridge_admin_key') || '';
    if (!key) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }
    if (!deleteDateTarget) {
      showNotification('error', 'Please select a date.');
      return;
    }

    const modeText = deleteDateMode === 'exact' ? `posted exactly on ${deleteDateTarget}` : `posted on or before ${deleteDateTarget}`;
    const typeText = deleteDateJobType === 'all' ? 'All Jobs & Internships' : deleteDateJobType === 'internship' ? 'Only Internships' : 'Only Full-Time Jobs';

    if (!confirm(`⚠️ Are you sure you want to delete ${typeText} ${modeText}? This action cannot be reversed.`)) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteJobsByDateAction(
      { targetDate: deleteDateTarget, mode: deleteDateMode, jobType: deleteDateJobType },
      key
    );
    setIsSubmitting(false);

    if (result.success) {
      showNotification('success', `Successfully cleaned up postings by date criteria.`);
      setShowDeleteByDateModal(false);
      setSelectedJobRowIds([]);
      router.refresh();
    } else {
      showNotification('error', result.error || 'Failed to delete postings by date.');
    }
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
      eligibility: 'Any Graduate / Freshers',
      skills: '',
      description: '',
      apply_url: '',
      source_name: 'Company Website',
      source_url: '',
      company_logo: '',
      job_type: 'full-time',
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
      company_logo: job.company_logo || '',
      job_type: job.job_type || (job.title.toLowerCase().includes('intern') ? 'internship' : 'full-time'),
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
        title: jobForm.title,
        slug: jobForm.slug,
        company: jobForm.company,
        location: jobForm.location,
        category_id: jobForm.category_id,
        salary: jobForm.salary,
        eligibility: jobForm.eligibility,
        skills: jobForm.skills,
        description: jobForm.description,
        apply_url: jobForm.apply_url,
        source_name: jobForm.source_name,
        source_url: jobForm.source_url,
        company_logo: jobForm.company_logo,
        job_type: jobForm.job_type,
        featured_job: jobForm.featured_job,
        application_deadline: jobForm.application_deadline,
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

  // Clone/Duplicate Job handler
  const handleCloneJobClick = (job: Job) => {
    setEditingJob(null); // Cloning creates a new job
    setJobForm({
      title: `${job.title} (Copy)`,
      slug: '', // Allow dynamic slug auto-generation
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
      company_logo: job.company_logo || '',
      job_type: job.job_type || (job.title.toLowerCase().includes('intern') ? 'internship' : 'full-time'),
      featured_job: false, // Don't default clone to featured
      application_deadline: job.application_deadline ? job.application_deadline.split('T')[0] : '',
    });
    setShowJobForm(true);
    showNotification('success', 'Job details cloned. Modify and save to publish.');
  };

  // Robust CSV Parser supporting multi-line strings, quoted newlines, and escaped quotes
  const parseCSV = (text: string) => {
    const cleanText = text.replace(/^\uFEFF/, '');
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentVal = '';
    let inQuotes = false;

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n in CRLF
        }
        currentRow.push(currentVal.trim());
        currentVal = '';
        if (currentRow.some(val => val.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        currentVal += char;
      }
    }

    if (currentVal.length > 0 || currentRow.length > 0) {
      currentRow.push(currentVal.trim());
      if (currentRow.some(val => val.length > 0)) {
        rows.push(currentRow);
      }
    }

    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.toLowerCase().replace(/^["']|["']$/g, '').trim());
    const result: any[] = [];

    for (let i = 1; i < rows.length; i++) {
      const rowValues = rows[i];
      const rowObj: any = {};
      headers.forEach((header, idx) => {
        rowObj[header] = rowValues[idx] || '';
      });
      result.push(rowObj);
    }

    return result;
  };

  // Download Job CSV Template
  const downloadCSVTemplate = () => {
    const headers = ['title', 'company', 'location', 'eligibility', 'skills', 'description', 'apply_url', 'salary', 'category_slug'];
    const sampleData = [
      ['Software Engineer Intern', 'Microsoft', 'Bangalore', 'BTech, MCA', 'React, TypeScript, Node.js', 'We are looking for developer interns...', 'https://careers.microsoft.com', '₹50,000/month', 'software-development'],
      ['Associate Web Developer', 'FreshersBridge', 'Remote', 'BCA, BSc CS', 'HTML, CSS, JavaScript', 'Build premium user interfaces...', 'https://freshersbridge.in/apply', '3.6 LPA', 'web-development']
    ];
    
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'freshersbridge_jobs_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import File handler
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = adminKey || localStorage.getItem('freshersbridge_admin_key') || '';
    if (!key) {
      showNotification('error', 'Please enter your Admin Access Key.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const rows = parseCSV(text);
        if (rows.length === 0) {
          showNotification('error', 'No valid rows found in the CSV. Please check formatting.');
          return;
        }

        setIsSubmitting(true);
        showNotification('success', `Parsing ${rows.length} jobs. Uploading to database...`);

        const res = await bulkUploadJobsAction(rows, key);
        setIsSubmitting(false);

        if (res.success) {
          showNotification(
            'success',
            `🎉 Successfully uploaded and published ${res.count} jobs out of ${rows.length} rows!`
          );
          router.refresh();
        } else {
          showNotification('error', res.error || 'Failed to bulk upload jobs.');
        }
      } catch (err: any) {
        setIsSubmitting(false);
        showNotification('error', 'Failed to parse CSV file: ' + (err?.message || 'Invalid format'));
      }
    };
    reader.readAsText(file);
    // Reset file input so user can re-upload if needed
    e.target.value = '';
  };

  // Helper to generate 8-job structured WhatsApp & Telegram broadcast message chunks
  const generateBroadcastChunks = (platform: 'whatsapp' | 'telegram' = broadcastPlatform) => {
    if (!jobs || jobs.length === 0) return [];
    // Sort newest created jobs first
    const sortedJobs = [...jobs].sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
    const chunkSize = 8;
    const chunks: { index: number; text: string; jobCount: number; jobs: Job[] }[] = [];

    const commonHeader = `📢 FRESHERSBRIDGE | DAILY FRESHER JOB ALERTS
📢 Entry-Level Jobs & Internships
❌ Applying everywhere but not getting shortlisted?
📄 Your resume might not be ATS-friendly.
🎯 Tailor your resume. Improve your chances.
👉 Check your resume with our ATS Resume Scanner:
https://freshersbridge.in/career-tools

🔥 Today's Fresh Opportunities:`;

    const whatsappFooter = `━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 BROWSE ALL 50+ FRESH JOBS & INTERNSHIPS TODAY:
https://freshersbridge.in

🧮 HR Email Scripts + In-Hand Salary Calculator:
https://freshersbridge.in/career-tools

📸 Follow FreshersBridge on Instagram:
https://www.instagram.com/freshersbridge?igsi=MTVsbm50enlhNGYybg==

📢 Get daily job alerts on Telegram:
https://t.me/freshersbridge

📩 Want job alerts directly in your inbox?
Subscribe to the FreshersBridge Newsletter and get new job & internship updates directly by email:
👉 https://freshersbridge.in

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 New jobs & internships added regularly.
👉 Visit FreshersBridge and apply before opportunities close.

📤 Share with your friends, batchmates & college groups!

FreshersBridge 🚀 | Jobs • Internships • Career Tools`;

    const telegramFooter = `━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 BROWSE ALL 50+ FRESH JOBS & INTERNSHIPS TODAY:
https://freshersbridge.in

🧮 HR Email Scripts + In-Hand Salary Calculator:
https://freshersbridge.in/career-tools

📸 Follow FreshersBridge on Instagram:
https://www.instagram.com/freshersbridge?igsi=MTVsbm50enlhNGYybg==

💬 Join our WhatsApp Community:
https://chat.whatsapp.com/JmP90QfUMs7Jj7gYALUj75?s=cl&p=a&ilr=1

📩 Want job alerts directly in your inbox?
Subscribe to the FreshersBridge Newsletter and get new job & internship updates directly by email:
👉 https://freshersbridge.in

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 New jobs & internships added regularly.
👉 Visit FreshersBridge and apply before opportunities close.

📤 Share with your batchmates & college groups!

FreshersBridge 🚀 | Jobs • Internships • Career Tools`;

    const footer = platform === 'telegram' ? telegramFooter : whatsappFooter;

    for (let i = 0; i < sortedJobs.length; i += chunkSize) {
      const batchJobs = sortedJobs.slice(i, i + chunkSize);
      const batchNum = Math.floor(i / chunkSize) + 1;
      
      const jobCards = batchJobs.map((j) => {
        const company = j.company || 'Top Tech Company';
        const title = j.title || 'Software Engineer';
        const eligibility = j.eligibility || 'B.E / B.Tech / BCA / MCA / Any Graduate';
        const location = j.location || 'Pan-India / Remote';
        const salary = j.salary || 'Competitive / Best in Industry';
        const link = `https://freshersbridge.in/jobs/${j.slug}`;

        let passingYear = '2026 | 2025 | 2024';
        const years = ['2028', '2027', '2026', '2025', '2024'].filter(y => eligibility.includes(y));
        if (years.length > 0) passingYear = years.join(' | ');

        return `🔗 Company : ${company}\nRole : ${title}\nQualification : ${eligibility}\nPassing Year : ${passingYear}\nLocation : ${location}\nSalary : ${salary}\n📌 Apply Link : ${link}`;
      }).join('\n\n');

      const fullMessage = `${commonHeader}\n\n${jobCards}\n\n${footer}`;
      chunks.push({
        index: batchNum,
        text: fullMessage,
        jobCount: batchJobs.length,
        jobs: batchJobs
      });
    }

    return chunks;
  };

  const handleCopyBatch = (text: string, batchIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBatchIndex(batchIndex);
    setTimeout(() => setCopiedBatchIndex(null), 2500);
  };

  const handleOpenWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleOpenTelegram = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://freshersbridge.in')}&text=${encoded}`, '_blank');
  };

  const handleSavePabblyWebhook = (url: string) => {
    setPabblyWebhookInput(url.trim());
    localStorage.setItem('fb_pabbly_webhook', url.trim());
  };

  const handleSaveTelegramConfig = (token: string, channel: string) => {
    setTelegramBotToken(token.trim());
    setTelegramChannelId(channel.trim());
    localStorage.setItem('fb_tg_token', token.trim());
    localStorage.setItem('fb_tg_channel', channel.trim());
  };

  const handleSendSingleBatchToPabbly = async (chunk: { index: number; text: string; jobCount: number }) => {
    const targetUrl = pabblyWebhookInput.trim();
    if (!targetUrl) {
      alert('Please enter your Pabbly Webhook URL first!');
      return;
    }

    setPabblyBatchStatus(prev => ({ ...prev, [chunk.index]: 'sending' }));
    try {
      const tgText = generateBroadcastChunks('telegram').find(c => c.index === chunk.index)?.text || chunk.text;
      const payload = {
        batch_index: chunk.index,
        job_count: chunk.jobCount,
        message_title: `FreshersBridge Batch #${chunk.index} (${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })})`,
        message_text: chunk.text,
        whatsapp_message: chunk.text,
        telegram_message: tgText,
        timestamp: new Date().toISOString()
      };

      await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Allows Pabbly webhooks without CORS blocking
      });

      setPabblyBatchStatus(prev => ({ ...prev, [chunk.index]: 'success' }));
    } catch (err: any) {
      setPabblyBatchStatus(prev => ({ ...prev, [chunk.index]: 'error' }));
    }
  };

  const handleSendAllBatchesToPabbly = async () => {
    const targetUrl = pabblyWebhookInput.trim();
    if (!targetUrl) {
      alert('Please enter your Pabbly Webhook URL first!');
      return;
    }

    const chunks = generateBroadcastChunks(broadcastPlatform);
    if (chunks.length === 0) {
      alert('No jobs available to broadcast.');
      return;
    }

    setIsDispatchingPabbly(true);
    setPabblyStatusMessage(`Dispatching ${chunks.length} batches to Pabbly...`);

    let sent = 0;
    for (const chunk of chunks) {
      setPabblyBatchStatus(prev => ({ ...prev, [chunk.index]: 'sending' }));
      try {
        const tgText = generateBroadcastChunks('telegram').find(c => c.index === chunk.index)?.text || chunk.text;
        const payload = {
          batch_index: chunk.index,
          total_batches: chunks.length,
          job_count: chunk.jobCount,
          message_title: `FreshersBridge Batch #${chunk.index} of ${chunks.length} (${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })})`,
          message_text: chunk.text,
          whatsapp_message: chunk.text,
          telegram_message: tgText,
          timestamp: new Date().toISOString()
        };

        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors'
        });

        setPabblyBatchStatus(prev => ({ ...prev, [chunk.index]: 'success' }));
        sent++;
      } catch {
        setPabblyBatchStatus(prev => ({ ...prev, [chunk.index]: 'error' }));
      }
    }

    setIsDispatchingPabbly(false);
    setPabblyStatusMessage(`🎉 Successfully sent ${sent}/${chunks.length} batches to Pabbly!`);
    setTimeout(() => setPabblyStatusMessage(''), 5000);
  };

  const handleSendSingleBatchToTelegram = async (chunk: { index: number; text: string; jobCount: number }) => {
    const token = telegramBotToken.trim();
    const channel = telegramChannelId.trim();
    if (!token || !channel) {
      alert('Please enter your Telegram Bot Token and Channel ID first!');
      return;
    }

    setTelegramBatchStatus(prev => ({ ...prev, [chunk.index]: 'sending' }));
    try {
      const tgText = generateBroadcastChunks('telegram').find(c => c.index === chunk.index)?.text || chunk.text;
      const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: channel,
          text: tgText,
          disable_web_page_preview: false
        })
      });

      if (resp.ok) {
        setTelegramBatchStatus(prev => ({ ...prev, [chunk.index]: 'success' }));
      } else {
        setTelegramBatchStatus(prev => ({ ...prev, [chunk.index]: 'error' }));
      }
    } catch {
      setTelegramBatchStatus(prev => ({ ...prev, [chunk.index]: 'error' }));
    }
  };

  const handleSendAllBatchesToTelegram = async () => {
    const token = telegramBotToken.trim();
    const channel = telegramChannelId.trim();
    if (!token || !channel) {
      alert('Please enter your Telegram Bot Token and Channel ID first!');
      return;
    }

    const chunks = generateBroadcastChunks('telegram');
    if (chunks.length === 0) {
      alert('No jobs available to broadcast.');
      return;
    }

    setIsDispatchingTelegram(true);
    setTelegramStatusMessage(`Dispatching ${chunks.length} batches to Telegram Channel...`);

    let sent = 0;
    for (const chunk of chunks) {
      setTelegramBatchStatus(prev => ({ ...prev, [chunk.index]: 'sending' }));
      try {
        const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: channel,
            text: chunk.text,
            disable_web_page_preview: false
          })
        });

        if (resp.ok) {
          setTelegramBatchStatus(prev => ({ ...prev, [chunk.index]: 'success' }));
          sent++;
        } else {
          setTelegramBatchStatus(prev => ({ ...prev, [chunk.index]: 'error' }));
        }
      } catch {
        setTelegramBatchStatus(prev => ({ ...prev, [chunk.index]: 'error' }));
      }
      // Small pause to prevent TG rate limits
      await new Promise(r => setTimeout(r, 1500));
    }

    setIsDispatchingTelegram(false);
    setTelegramStatusMessage(`🎉 Successfully sent ${sent}/${chunks.length} batches to Telegram!`);
    setTimeout(() => setTelegramStatusMessage(''), 5000);
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

        {/* Authenticated Admin Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 shadow-2xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Authenticated</span>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 px-4 py-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Premium Floating Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-card/90 backdrop-blur-md p-4 shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-5 max-w-sm ${
            notification.type === 'success'
              ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/5'
              : 'border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-rose-500/5'
          }`}
        >
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            notification.type === 'success' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 text-sm font-semibold text-foreground pr-2 leading-snug">
            {notification.message}
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="rounded-lg p-1 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-500 shrink-0">
              <BarChart4 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Views</p>
              <p className="text-2xl font-black text-foreground">{totalViews}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetViews}
            title="Reset all job views to 0 for a clean launch start"
            className="p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
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

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600/10 text-teal-500">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subscribers</p>
            <p className="text-2xl font-black text-foreground">{subscribers.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex items-center border-b border-border gap-2 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('jobs');
            setShowJobForm(false);
          }}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'jobs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Manage Jobs</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('categories');
            setShowJobForm(false);
          }}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FolderPlus className="h-4 w-4" />
          <span>Manage Categories</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('subscribers');
            setShowJobForm(false);
          }}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'subscribers'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mail className="h-4 w-4" />
          <span>Subscribers ({subscribers.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('broadcasts');
            setShowJobForm(false);
          }}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'broadcasts'
              ? 'border-emerald-500 text-emerald-500'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>📢 WhatsApp & Telegram Broadcasts</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {!showJobForm ? (
            <div className="space-y-4">
              {/* Header and Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">Active Postings</h2>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                    {jobs.length} total
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* Delete by Date Button */}
                  {jobs.length > 0 && (
                    <button
                      onClick={() => setShowDeleteByDateModal(true)}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer disabled:opacity-50"
                      title="Clean up jobs or internships by specific date"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Delete by Date</span>
                    </button>
                  )}

                  {/* Delete All Jobs Button */}
                  {jobs.length > 0 && (
                    <button
                      onClick={handleDeleteAllJobs}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all cursor-pointer disabled:opacity-50"
                      title="Clear and delete all jobs in the database"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete All</span>
                    </button>
                  )}

                  {/* Download Template Button */}
                  <button
                    onClick={downloadCSVTemplate}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
                    title="Download Sample CSV Template"
                  >
                    <Download className="h-4 w-4" />
                    CSV Template
                  </button>

                  {/* CSV File Upload Trigger */}
                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-all">
                    <Upload className="h-4 w-4" />
                    Upload CSV
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>

                  {/* Add New Job */}
                  <button
                    onClick={handleAddJobClick}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    Add New Job
                  </button>
                </div>
              </div>

              {/* Table search, category filter, job type filter & date sorting bars */}
              <div className="flex flex-col lg:flex-row gap-3 items-center border border-border bg-card p-3 rounded-xl">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by title, company..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full lg:w-auto">
                  {/* Job Type Selector */}
                  <select
                    value={adminTypeFilter}
                    onChange={(e) => setAdminTypeFilter(e.target.value as any)}
                    className="w-full sm:w-36 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="job">💼 Jobs Only</option>
                    <option value="internship">🎓 Internships</option>
                  </select>

                  {/* Category Selector */}
                  <select
                    value={adminCategoryFilter}
                    onChange={(e) => setAdminCategoryFilter(e.target.value)}
                    className="w-full sm:w-40 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {/* Sort Selector */}
                  <select
                    value={adminSortBy}
                    onChange={(e) => setAdminSortBy(e.target.value as any)}
                    className="w-full sm:w-44 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="newest">📅 Newest First ↓</option>
                    <option value="oldest">📅 Oldest First ↑</option>
                    <option value="most-views">🔥 Most Viewed ↓</option>
                    <option value="title-asc">🔤 Title (A to Z)</option>
                    <option value="deadline">⏰ Deadline</option>
                  </select>
                </div>
              </div>

              {/* Multi-Selection Batch Action Bar */}
              {selectedJobRowIds.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                    <CheckSquare className="h-4 w-4 shrink-0" />
                    <span>
                      {selectedJobRowIds.length} item{selectedJobRowIds.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJobRowIds([])}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg border border-border bg-card cursor-pointer"
                    >
                      Deselect All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSelectedJobs}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Selected ({selectedJobRowIds.length})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Jobs Table */}
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-muted-foreground font-semibold">
                      <th className="p-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={(() => {
                            const filtered = jobs.filter((job) => {
                              const matchesSearch =
                                job.title.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                                job.company.toLowerCase().includes(adminSearchQuery.toLowerCase());
                              const matchesCategory = adminCategoryFilter ? job.category_id === adminCategoryFilter : true;
                              const isIntern = job.title.toLowerCase().includes('intern') || job.job_type === 'internship';
                              const matchesType =
                                adminTypeFilter === 'all'
                                  ? true
                                  : adminTypeFilter === 'internship'
                                  ? isIntern
                                  : !isIntern;
                              return matchesSearch && matchesCategory && matchesType;
                            });
                            return filtered.length > 0 && filtered.every((j) => selectedJobRowIds.includes(j.id));
                          })()}
                          onChange={() => {
                            const filtered = jobs.filter((job) => {
                              const matchesSearch =
                                job.title.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                                job.company.toLowerCase().includes(adminSearchQuery.toLowerCase());
                              const matchesCategory = adminCategoryFilter ? job.category_id === adminCategoryFilter : true;
                              const isIntern = job.title.toLowerCase().includes('intern') || job.job_type === 'internship';
                              const matchesType =
                                adminTypeFilter === 'all'
                                  ? true
                                  : adminTypeFilter === 'internship'
                                  ? isIntern
                                  : !isIntern;
                              return matchesSearch && matchesCategory && matchesType;
                            });
                            handleSelectAllFiltered(filtered.map((j) => j.id));
                          }}
                          className="rounded border-border text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                          title="Select all visible postings"
                        />
                      </th>
                      <th className="p-4">Job Title</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Posted Date</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-center">Type</th>
                      <th className="p-4 text-center">Views</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(() => {
                      const filteredJobs = jobs
                        .filter((job) => {
                          const matchesSearch =
                            job.title.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                            job.company.toLowerCase().includes(adminSearchQuery.toLowerCase());
                          const matchesCategory = adminCategoryFilter ? job.category_id === adminCategoryFilter : true;
                          const isIntern = job.title.toLowerCase().includes('intern') || job.job_type === 'internship';
                          const matchesType =
                            adminTypeFilter === 'all'
                              ? true
                              : adminTypeFilter === 'internship'
                              ? isIntern
                              : !isIntern;
                          return matchesSearch && matchesCategory && matchesType;
                        })
                        .sort((a, b) => {
                          if (adminSortBy === 'newest') {
                            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                          }
                          if (adminSortBy === 'oldest') {
                            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                          }
                          if (adminSortBy === 'most-views') {
                            return (b.views_count || 0) - (a.views_count || 0);
                          }
                          if (adminSortBy === 'title-asc') {
                            return a.title.localeCompare(b.title);
                          }
                          if (adminSortBy === 'deadline') {
                            if (!a.application_deadline) return 1;
                            if (!b.application_deadline) return -1;
                            return new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime();
                          }
                          return 0;
                        });

                      return filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => {
                          const isSelected = selectedJobRowIds.includes(job.id);
                          const isIntern = job.title.toLowerCase().includes('intern') || job.job_type === 'internship';

                          return (
                            <tr
                              key={job.id}
                              className={`transition-colors ${
                                isSelected ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : 'hover:bg-secondary/25'
                              }`}
                            >
                              <td className="p-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectJobRow(job.id)}
                                  className="rounded border-border text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                                />
                              </td>
                              <td className="p-4 font-semibold text-foreground">
                                <Link
                                  href={`/jobs/${job.slug}`}
                                  target="_blank"
                                  className="hover:underline hover:text-indigo-600 inline-flex items-center gap-1"
                                >
                                  {job.title} <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                </Link>
                              </td>
                              <td className="p-4 text-muted-foreground">{job.company}</td>
                              <td className="p-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                {new Date(job.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground border border-border">
                                  {job.categories?.name || 'Uncategorized'}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                {isIntern ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    Internship
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                    Full-Time
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-center font-medium text-foreground/80">
                                <span className="inline-flex items-center gap-1">
                                  <Eye className="h-3.5 w-3.5 text-muted-foreground" /> {job.views_count}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => handleCloneJobClick(job)}
                                  className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-secondary hover:text-indigo-600 transition-colors"
                                  title="Duplicate/Clone Job"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
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
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-12 text-center text-muted-foreground">
                            No matching postings found. Try adjusting your filters.
                          </td>
                        </tr>
                      );
                    })()}
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

                  {/* Job / Internship Type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Opportunity Type *</label>
                    <select
                      required
                      value={jobForm.job_type}
                      onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-indigo-600 font-medium text-foreground"
                    >
                      <option value="full-time">Full-Time Job</option>
                      <option value="internship">Internship</option>
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

                  {/* Company Logo URL */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                      <span>Company Logo Image URL (Optional)</span>
                      <span className="text-xs text-muted-foreground font-normal">Displays custom logo on job card</span>
                    </label>
                    <input
                      type="text"
                      value={jobForm.company_logo}
                      onChange={(e) => setJobForm({ ...jobForm, company_logo: e.target.value.trim() })}
                      placeholder="https://devguide.payu.in/website-assets/uploads/2021/12/new-payu-logo.svg"
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

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-500" />
                <span>Newsletter Subscribers ({subscribers.length})</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage, export, or send job updates to all registered email subscribers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Export CSV */}
              <button
                onClick={downloadSubscribersCSV}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-all shadow-sm"
              >
                <Download className="h-4 w-4 text-emerald-500" />
                <span>Export CSV</span>
              </button>

              {/* Copy Email List */}
              <button
                onClick={copyAllEmailsToClipboard}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-all shadow-sm"
              >
                <Copy className="h-4 w-4 text-indigo-500" />
                <span>Copy All Emails</span>
              </button>

              {/* Broadcast Modal Trigger */}
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>Send Job Update</span>
              </button>

              {/* Add Subscriber */}
              <button
                onClick={() => setShowAddSubscriberModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Subscriber</span>
              </button>
            </div>
          </div>

          {/* Search Filter */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subscribers by email or name..."
              value={adminSubscriberSearch}
              onChange={(e) => setAdminSubscriberSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-xs font-medium outline-none focus:border-emerald-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-muted-foreground font-semibold">
                    <th className="p-3.5">#</th>
                    <th className="p-3.5">Subscriber Email</th>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Source</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Subscribed Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((sub, index) => (
                      <tr key={sub.id || index} className="hover:bg-secondary/25 transition-colors">
                        <td className="p-3.5 text-muted-foreground font-mono">{index + 1}</td>
                        <td className="p-3.5 font-bold text-foreground">{sub.email}</td>
                        <td className="p-3.5 text-muted-foreground">{sub.name || '—'}</td>
                        <td className="p-3.5">
                          <span className="inline-block rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                            {sub.source || 'Footer'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3.5 text-muted-foreground">
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteSubscriberClick(sub.id)}
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-200 transition-colors"
                            title="Remove Subscriber"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mx-auto text-muted-foreground">
                          <Mail className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">No subscribers found</p>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          {adminSubscriberSearch
                            ? 'No subscriber email matches your search query.'
                            : 'Subscribers will appear here once visitors subscribe on your site. If your database table is not created yet, make sure to execute the SQL snippet in Supabase SQL Editor!'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {showAddSubscriberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                <span>Add Subscriber Manually</span>
              </h3>
              <button
                onClick={() => setShowAddSubscriberModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriberSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="subscriber@example.com"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Subscriber Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Rahul Sharma"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubscriberModal(false)}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Subscriber'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Community Broadcasts Tab */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-6">
          {/* Header & Automation Config */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                  <MessageSquare className="h-6 w-6 text-emerald-500" />
                  <span>WhatsApp & Telegram Community Broadcasts</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  8-job curated digest blocks tailored for WhatsApp & Telegram (Morning, Afternoon & Evening drops). 1-click share, automated Telegram Channel posting, or Pabbly Connect Webhook.
                </p>
              </div>

              {/* Platform Selector Tabs */}
              <div className="inline-flex rounded-xl border border-border bg-secondary/50 p-1">
                <button
                  type="button"
                  onClick={() => setBroadcastPlatform('whatsapp')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    broadcastPlatform === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>WhatsApp Format</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastPlatform('telegram')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    broadcastPlatform === 'telegram'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Telegram Format</span>
                </button>
              </div>
            </div>

            {/* Automation Tools: Pabbly & Telegram Bot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Telegram Bot Automation Box */}
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Send className="h-4 w-4 text-sky-500" />
                    <span>✈️ Telegram Channel Bot Automation</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground">Official Bot API</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Telegram Bot Token (e.g., 789123456:AAH...)"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono outline-none focus:border-sky-500"
                  />
                  <input
                    type="text"
                    placeholder="Channel ID / Username (e.g., @freshersbridge or -100123456)"
                    value={telegramChannelId}
                    onChange={(e) => setTelegramChannelId(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono outline-none focus:border-sky-500"
                  />
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveTelegramConfig(telegramBotToken, telegramChannelId);
                        alert('Telegram configuration saved in browser!');
                      }}
                      className="rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 text-xs font-semibold"
                    >
                      Save Credentials
                    </button>
                    <button
                      type="button"
                      onClick={handleSendAllBatchesToTelegram}
                      disabled={isDispatchingTelegram || !telegramBotToken || !telegramChannelId}
                      className="rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 text-xs font-bold disabled:opacity-50 flex items-center gap-1"
                    >
                      <Send className="h-3 w-3" />
                      <span>{isDispatchingTelegram ? 'Posting...' : '✈️ Post All to Telegram'}</span>
                    </button>
                  </div>
                </div>
                {telegramStatusMessage && (
                  <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    {telegramStatusMessage}
                  </p>
                )}
              </div>

              {/* Pabbly Webhook Box */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Share2 className="h-4 w-4 text-emerald-500" />
                    <span>🟢 Pabbly Connect Webhook (WhatsApp / Multi-Channel)</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground">Automated Flow</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://connect.pabbly.com/workflow/sendwebhookdata/XXXXXXXXXXXX"
                    value={pabblyWebhookInput}
                    onChange={(e) => handleSavePabblyWebhook(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => alert('Pabbly Webhook URL saved successfully!')}
                      className="rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 text-xs font-semibold"
                    >
                      Save Webhook
                    </button>
                    <button
                      type="button"
                      onClick={handleSendAllBatchesToPabbly}
                      disabled={isDispatchingPabbly || !pabblyWebhookInput}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold disabled:opacity-50 flex items-center gap-1"
                    >
                      <SendHorizontal className="h-3 w-3" />
                      <span>{isDispatchingPabbly ? 'Sending...' : '🚀 Send All to Pabbly'}</span>
                    </button>
                  </div>
                </div>
                {pabblyStatusMessage && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {pabblyStatusMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Batches List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span>Generated {broadcastPlatform === 'telegram' ? 'Telegram' : 'WhatsApp'} Batches</span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground border border-border">
                  {generateBroadcastChunks(broadcastPlatform).length} Batches • {jobs.length} Jobs
                </span>
              </h3>
            </div>

            {generateBroadcastChunks(broadcastPlatform).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {generateBroadcastChunks(broadcastPlatform).map((chunk) => (
                  <div
                    key={chunk.index}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                            broadcastPlatform === 'telegram'
                              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            Batch #{chunk.index} ({broadcastPlatform === 'telegram' ? 'Telegram' : 'WhatsApp'})
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {chunk.jobCount} Opportunities
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold">
                          {telegramBatchStatus[chunk.index] === 'success' && (
                            <span className="text-sky-500 flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" /> Telegram
                            </span>
                          )}
                          {pabblyBatchStatus[chunk.index] === 'success' && (
                            <span className="text-emerald-500 flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" /> Pabbly
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Message Preview */}
                      <pre className="w-full max-h-72 overflow-y-auto rounded-xl border border-border bg-secondary/30 p-4 text-xs font-mono text-foreground whitespace-pre-wrap leading-6 select-all">
                        {chunk.text}
                      </pre>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                      {/* Copy Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyBatch(chunk.text, chunk.index)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                          copiedBatchIndex === chunk.index
                            ? 'bg-emerald-600 text-white'
                            : 'border border-border bg-card text-foreground hover:bg-secondary'
                        }`}
                      >
                        {copiedBatchIndex === chunk.index ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Copy Message</span>
                          </>
                        )}
                      </button>

                      {/* WhatsApp Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(chunk.text)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 text-xs font-bold transition-all shadow-sm"
                        title="Open pre-filled in WhatsApp"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      {/* Telegram Share Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenTelegram(chunk.text)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 text-xs font-bold transition-all shadow-sm"
                        title="Share on Telegram"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Telegram</span>
                      </button>

                      {/* Direct Telegram Bot Button */}
                      {telegramBotToken && telegramChannelId && (
                        <button
                          type="button"
                          onClick={() => handleSendSingleBatchToTelegram(chunk)}
                          disabled={telegramBatchStatus[chunk.index] === 'sending'}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 px-3 py-2 text-xs font-bold transition-all disabled:opacity-50"
                          title="Post to Telegram Channel via Bot"
                        >
                          <span>Bot Post</span>
                        </button>
                      )}

                      {/* Send to Pabbly Button */}
                      <button
                        type="button"
                        onClick={() => handleSendSingleBatchToPabbly(chunk)}
                        disabled={pabblyBatchStatus[chunk.index] === 'sending'}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground px-3 py-2 text-xs font-semibold transition-all disabled:opacity-50"
                        title="Send this single batch to Pabbly webhook"
                      >
                        <span>Pabbly</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground space-y-2">
                <Briefcase className="h-8 w-8 mx-auto opacity-50" />
                <p className="text-sm font-semibold">No active jobs available for broadcasting.</p>
                <p className="text-xs">Jobs added manually or scraped automatically will appear here grouped into 10-job message blocks.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Broadcast / Send Job Updates Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Send className="h-5 w-5 text-emerald-500" />
                  <span>Send Multi-Job Digest Email</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Curated Unstop-style email broadcast for your subscribers.
                </p>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-3.5 text-xs text-foreground space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                  Broadcast Information
                </p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  This will dispatch a beautifully formatted <strong>Recommended Opportunities Digest</strong> email directly to all <strong>{subscribers.length} active subscribers</strong> via Resend API.
                </p>
              </div>

              {/* Custom Subject Line */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Subject Line (Optional)</label>
                <input
                  type="text"
                  placeholder={`🔥 ${selectedJobIds.length || Math.min(jobs.length, 10)} New Opportunities Curated for You | FreshersBridge`}
                  value={customDigestSubject}
                  onChange={(e) => setCustomDigestSubject(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {/* Job Selection Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    Select Jobs for Digest ({selectedJobIds.length > 0 ? selectedJobIds.length : Math.min(jobs.length, 10)} selected)
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllTopJobs}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Select Top 10
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl border border-border bg-secondary/20 p-2.5">
                  {jobs.map((job) => {
                    const isSelected = selectedJobIds.includes(job.id);
                    return (
                      <div
                        key={job.id}
                        onClick={() => toggleSelectJobForDigest(job.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-foreground'
                            : 'bg-card border-border hover:border-border/80 text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-border text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                          />
                          <div>
                            <p className="font-bold text-foreground">{job.title}</p>
                            <p className="text-[11px] text-muted-foreground">{job.company} • {job.location}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-secondary border border-border px-2 py-0.5 rounded-full font-bold text-foreground">
                          {job.salary || 'Best in Industry'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={handleSendDigestBroadcast}
                  disabled={isSendingDigest}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white py-3 text-xs font-extrabold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {isSendingDigest
                      ? `Sending Multi-Job Digest to ${subscribers.length} subscribers...`
                      : `🚀 Send Multi-Job Digest to ${subscribers.length} Subscribers`}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={downloadSubscribersCSV}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-semibold hover:bg-secondary text-foreground"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-500" />
                    Download CSV
                  </button>
                  <button
                    onClick={copyAllEmailsToClipboard}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-semibold hover:bg-secondary text-foreground"
                  >
                    <Copy className="h-3.5 w-3.5 text-indigo-500" />
                    Copy Emails
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete by Date Modal */}
      {showDeleteByDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Delete Postings by Date</h3>
                  <p className="text-xs text-muted-foreground">Clean up jobs or internships matching date criteria.</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteByDateModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDeleteByDateSubmit} className="space-y-4">
              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Select Target Date</label>
                <input
                  type="date"
                  required
                  value={deleteDateTarget}
                  onChange={(e) => setDeleteDateTarget(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-indigo-600 cursor-pointer"
                />
              </div>

              {/* Date Scope / Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Date Criteria Scope</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteDateMode('exact')}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition-all text-left cursor-pointer ${
                      deleteDateMode === 'exact'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    <p className="font-bold">Exact Date</p>
                    <p className="text-[10px] opacity-80">Only posted on this date</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteDateMode('before')}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition-all text-left cursor-pointer ${
                      deleteDateMode === 'before'
                        ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    <p className="font-bold">On or Before</p>
                    <p className="text-[10px] opacity-80">All entries up to this date</p>
                  </button>
                </div>
              </div>

              {/* Type Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Posting Type</label>
                <select
                  value={deleteDateJobType}
                  onChange={(e) => setDeleteDateJobType(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="all">🌟 All (Jobs & Internships)</option>
                  <option value="job">💼 Only Full-Time Jobs</option>
                  <option value="internship">🎓 Only Internships</option>
                </select>
              </div>

              <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 p-3 text-[11px] text-muted-foreground leading-relaxed">
                ⚠️ This will permanently remove matched entries from the database and refresh all public search pages.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowDeleteByDateModal(false)}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white px-4 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Deleting...' : 'Delete Matching Postings'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
