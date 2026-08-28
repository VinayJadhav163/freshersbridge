import crypto from 'crypto';

export function getAdminAuthToken(): string {
  const secret = process.env.ADMIN_ACCESS_KEY || 'freshersbridge-default-secret';
  return crypto.createHash('sha256').update(`admin-auth-session-${secret}`).digest('hex');
}

export function verifyAdminKey(key: string): boolean {
  const serverKey = process.env.ADMIN_ACCESS_KEY;
  if (!serverKey) {
    console.error('CRITICAL: ADMIN_ACCESS_KEY is not defined in environment variables.');
    return false;
  }
  return key === serverKey || key === getAdminAuthToken();
}
