import { NextResponse } from 'next/server';

// In-memory rate limiting map: IP -> array of timestamps
const ipRequestLog = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 3; // Maximum 3 messages per 15 minutes per IP

  const history = (ipRequestLog.get(ip) || []).filter((timestamp) => now - timestamp < windowMs);
  if (history.length >= maxRequests) {
    ipRequestLog.set(ip, history);
    return false; // Rate limit exceeded
  }
  history.push(now);
  ipRequestLog.set(ip, history);
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, bot_field } = body;

    // Silent drop if bot honeypot filled
    if (bot_field) {
      return NextResponse.json({ success: true, message: 'Message sent successfully.' });
    }

    // IP-based rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = (forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip')) || 'unknown';
    
    if (clientIp !== 'unknown' && !checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Too many messages sent. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    if (accessKey) {
      const origin = request.headers.get('origin') || 'http://localhost:3000';
      const referer = request.headers.get('referer') || 'http://localhost:3000/contact';

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': origin,
          'Referer': referer,
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: name,
          email: email,
          message: message,
          subject: `New Contact Message from ${name} on FreshersBridge`,
          from_name: 'FreshersBridge Contact Form',
        }),
      });

      const rawText = await response.text();
      let data: any = null;

      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.warn('Web3Forms returned non-JSON output:', rawText.substring(0, 150));
      }

      if (response.ok && data?.success) {
        return NextResponse.json({ success: true, message: 'Message delivered to email!' });
      }
    }

    // Fallback if no Web3Forms API key configured yet
    const mailtoUrl = `mailto:freshersbridge@gmail.com?subject=${encodeURIComponent(
      `New Message from ${name} via FreshersBridge`
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    return NextResponse.json({
      success: true,
      requiresMailto: true,
      mailtoUrl,
    });
  } catch (err: any) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to process request.' }, { status: 500 });
  }
}
