import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Use getToken with NextRequest - works better in App Router
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { school, tool, subject, courseNumber, rating, tags, review } = body;

    if (!school || !tool || typeof rating !== 'number' || !review) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await prisma.review.create({
      data: {
        school,
        tool,
        subject: subject || null,
        courseNumber: courseNumber || null,
        rating,
        tags: (tags && Array.isArray(tags) ? tags : []).map(String),
        reviewText: review,
      },
    });

    return NextResponse.json({ success: true, review: created }, { status: 201 });
  } catch (err) {
    console.error('Error creating review', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
