'use client';

import { useEffect } from 'react';

interface JobViewTrackerProps {
  jobId: string;
}

export default function JobViewTracker({ jobId }: JobViewTrackerProps) {
  useEffect(() => {
    if (!jobId) return;

    // Short 10-second cooldown per job to prevent rapid click spam while allowing real visits to increment
    const sessionKey = `fb_viewed_${jobId}`;
    const lastViewTime = Number(sessionStorage.getItem(sessionKey) || 0);
    const now = Date.now();

    if (now - lastViewTime < 10000) {
      return;
    }

    sessionStorage.setItem(sessionKey, String(now));

    // Fire non-blocking fetch to increment view in Supabase
    fetch('/api/jobs/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    }).catch(() => {});
  }, [jobId]);

  return null;
}
