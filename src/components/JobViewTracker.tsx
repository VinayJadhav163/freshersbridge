'use client';

import { useEffect } from 'react';

interface JobViewTrackerProps {
  jobId: string;
}

export default function JobViewTracker({ jobId }: JobViewTrackerProps) {
  useEffect(() => {
    if (!jobId) return;

    // Prevent duplicate counts on same page refreshes within session
    const sessionKey = `fb_viewed_${jobId}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }

    // Mark as viewed in session
    sessionStorage.setItem(sessionKey, '1');

    // Fire non-blocking beacon / fetch to increment view
    fetch('/api/jobs/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    }).catch(() => {});
  }, [jobId]);

  return null;
}
