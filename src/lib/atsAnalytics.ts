import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

export interface ATSDailyRecord {
  date: string; // YYYY-MM-DD
  scans: number;
  tailors: number;
}

export interface ATSAnalyticsData {
  todayDate: string;
  todayScans: number;
  todayTailors: number;
  totalScans: number;
  totalTailors: number;
  dailyLimit: number; // 1500 for Gemini Free Tier
  lastEventAt: string | null;
  history: ATSDailyRecord[];
}

const DATA_FILE_PATH = path.join(process.env.TMPDIR || '/tmp', 'ats-analytics.json');

function getTodayString(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 3600000 * 5.5);
  return ist.toISOString().split('T')[0];
}

function getDefaultAnalytics(): ATSAnalyticsData {
  const today = getTodayString();
  return {
    todayDate: today,
    todayScans: 0,
    todayTailors: 0,
    totalScans: 0,
    totalTailors: 0,
    dailyLimit: 1500,
    lastEventAt: null,
    history: [{ date: today, scans: 0, tailors: 0 }],
  };
}

function readStoredData(): ATSAnalyticsData | null {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // Ignore read errors
  }
  return null;
}

function writeStoredData(data: ATSAnalyticsData) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Silently ignore write failures on read-only environments
  }
}

export async function getATSAnalytics(): Promise<ATSAnalyticsData> {
  const today = getTodayString();
  let data: ATSAnalyticsData = readStoredData() || getDefaultAnalytics();

  // If new day, reset today counters while archiving previous day in history
  if (data.todayDate !== today) {
    const existingEntry = data.history.find((h) => h.date === data.todayDate);
    if (!existingEntry && (data.todayScans > 0 || data.todayTailors > 0)) {
      data.history.unshift({
        date: data.todayDate,
        scans: data.todayScans,
        tailors: data.todayTailors,
      });
    }

    data.todayDate = today;
    data.todayScans = 0;
    data.todayTailors = 0;
    data.history = data.history.slice(0, 14);

    writeStoredData(data);
  }

  // Ensure today is in history list
  if (!data.history.some((h) => h.date === today)) {
    data.history.unshift({ date: today, scans: data.todayScans, tailors: data.todayTailors });
  }

  // Live query Supabase ats_analytics table if created
  try {
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const [todayScansRes, todayTailorsRes, totalScansRes, totalTailorsRes] = await Promise.all([
      supabase.from('ats_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'scan').gte('created_at', todayStart),
      supabase.from('ats_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'tailor').gte('created_at', todayStart),
      supabase.from('ats_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'scan'),
      supabase.from('ats_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'tailor'),
    ]);

    if (!totalScansRes.error && !totalTailorsRes.error) {
      data.todayScans = Math.max(data.todayScans, todayScansRes.count || 0);
      data.todayTailors = Math.max(data.todayTailors, todayTailorsRes.count || 0);
      data.totalScans = Math.max(data.totalScans, totalScansRes.count || 0);
      data.totalTailors = Math.max(data.totalTailors, totalTailorsRes.count || 0);
    }
  } catch {
    // Silently proceed with local counters if table does not exist
  }

  return data;
}

export async function recordATSScan(type: 'scan' | 'tailor'): Promise<ATSAnalyticsData> {
  const data = await getATSAnalytics();
  const today = getTodayString();
  const nowISO = new Date().toISOString();

  if (type === 'scan') {
    data.todayScans += 1;
    data.totalScans += 1;
  } else if (type === 'tailor') {
    data.todayTailors += 1;
    data.totalTailors += 1;
  }

  data.lastEventAt = nowISO;

  // Update today entry in history
  const todayHist = data.history.find((h) => h.date === today);
  if (todayHist) {
    if (type === 'scan') todayHist.scans += 1;
    if (type === 'tailor') todayHist.tailors += 1;
  } else {
    data.history.unshift({
      date: today,
      scans: type === 'scan' ? 1 : 0,
      tailors: type === 'tailor' ? 1 : 0,
    });
  }

  writeStoredData(data);

  // Sync to Supabase if table exists
  try {
    await supabase.from('ats_analytics').insert({
      event_type: type,
      created_at: nowISO,
    });
  } catch {
    // Silently ignore if table does not exist
  }

  return data;
}
