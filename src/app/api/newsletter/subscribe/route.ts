import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name ? name.trim() : '';

    const listmonkUrl = process.env.LISTMONK_URL || process.env.NEXT_PUBLIC_LISTMONK_URL;
    const listmonkListUuid = process.env.LISTMONK_LIST_UUID || process.env.NEXT_PUBLIC_LISTMONK_LIST_UUID;
    const listmonkUser = process.env.LISTMONK_USER;
    const listmonkPass = process.env.LISTMONK_PASS;

    let listmonkSuccess = false;

    // 1. Try subscribing directly to Listmonk if configured
    if (listmonkUrl) {
      try {
        const cleanUrl = listmonkUrl.replace(/\/+$/, '');
        
        // Option A: Admin API with auth if credentials provided
        if (listmonkUser && listmonkPass) {
          const authBuffer = Buffer.from(`${listmonkUser}:${listmonkPass}`).toString('base64');
          const listId = process.env.LISTMONK_LIST_ID ? parseInt(process.env.LISTMONK_LIST_ID, 10) : 1;

          const res = await fetch(`${cleanUrl}/api/subscribers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${authBuffer}`,
            },
            body: JSON.stringify({
              email: trimmedEmail,
              name: trimmedName,
              status: 'enabled',
              list_ids: [listId],
              preconfirm_subscriptions: true,
            }),
          });

          if (res.ok) {
            listmonkSuccess = true;
          }
        } 
        
        // Option B: Public subscribe API/form endpoint if Listmonk UUID present
        if (!listmonkSuccess) {
          const params = new URLSearchParams();
          params.append('email', trimmedEmail);
          if (trimmedName) params.append('name', trimmedName);
          if (listmonkListUuid) params.append('l', listmonkListUuid);

          const res = await fetch(`${cleanUrl}/subscription/form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          });

          if (res.ok) {
            listmonkSuccess = true;
          }
        }
      } catch (listmonkErr) {
        console.error('Listmonk subscribe fetch failed:', listmonkErr);
      }
    }

    let dbSuccess = false;

    // 2. Store subscriber in Supabase table
    try {
      const { data: dbData, error: dbErr } = await supabase
        .from('subscribers')
        .insert([{ email: trimmedEmail, name: trimmedName, source: 'footer_newsletter', status: 'active' }])
        .select()
        .single();

      if (!dbErr && dbData) {
        dbSuccess = true;
      } else if (dbErr) {
        // Check for duplicate key violation (already subscribed)
        if (dbErr.code === '23505' || dbErr.message?.includes('duplicate key') || dbErr.message?.includes('already exists')) {
          return NextResponse.json({
            success: true,
            message: 'You are already subscribed to FreshersBridge job updates!',
          });
        }
        console.warn('Supabase subscribers insert warning:', dbErr.message);
      }
    } catch (dbErr) {
      console.error('Supabase exception:', dbErr);
    }

    // 3. Fallback Web3Forms notification if enabled
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: process.env.WEB3FORMS_ACCESS_KEY,
            subject: `New Newsletter Subscriber: ${trimmedEmail}`,
            email: trimmedEmail,
            name: trimmedName || 'FreshersBridge Subscriber',
            message: `New subscriber added to FreshersBridge newsletter: ${trimmedEmail}`,
            from_name: 'FreshersBridge Newsletter',
          }),
        });
      } catch (err) {
        // Non-blocking fallback catch
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You are now subscribed to FreshersBridge job updates.',
    });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
