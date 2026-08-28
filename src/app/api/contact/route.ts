import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
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
