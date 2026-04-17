import { NextResponse } from 'next/server';
import { verifyTokenAccess } from '@/lib/token';

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ valid: false, error: 'missing_token' }, { status: 400 });
  }

  const valid = await verifyTokenAccess(token);
  return NextResponse.json({ valid });
}
