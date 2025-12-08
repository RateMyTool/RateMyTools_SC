import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      schoolId, toolId, subject, courseNumber, rating, tags, review, comment,
    } = body;

    if (!schoolId || !toolId || typeof rating !== 'number' || (!review && !comment)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create review with proper foreign keys
    const created = await prisma.review.create({
      data: {
        userId: user.id,
        schoolId: parseInt(schoolId),
        toolId: parseInt(toolId),
        subject: subject || null,
        courseNumber: courseNumber || null,
        rating: parseInt(rating),
        tags: (tags && Array.isArray(tags) ? tags : []).map(String),
        comment: comment || review,
        reviewText: review,
      },
    });

    // On-demand revalidation: rebuild pages immediately when review is added
    revalidatePath('/reviews', 'page');
    revalidatePath('/reviews/[id]', 'page');

    return NextResponse.json({ success: true, review: created }, { status: 201 });
  } catch (err) {
    console.error('Error creating review', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
