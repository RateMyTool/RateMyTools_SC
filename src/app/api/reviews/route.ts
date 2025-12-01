import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
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
        // Prisma model field is `reviewText` (DB column mapped from `review`)
        reviewText: review,
      },
    });

    return NextResponse.json({ success: true, review: created }, { status: 201 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error creating review', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
