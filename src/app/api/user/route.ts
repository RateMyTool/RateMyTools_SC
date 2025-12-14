import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = request.nextUrl.searchParams.get('email');
    const targetEmail = email || token.email;

    if (email && email !== token.email) {
      const requester = await prisma.user.findUnique({
        where: { email: token.email },
      });

      if (requester?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
