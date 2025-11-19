import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: 'User with that email already exists' }, { status: 409 });
    }

    const hashed = await hash(password, 10);
    await prisma.user.create({ data: { email, password: hashed } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Register error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
