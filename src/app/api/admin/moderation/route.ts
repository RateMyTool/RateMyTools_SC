import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { manualModeration, getModerationHistory } from '@/lib/moderation';

// GET - Get pending reviews or moderation history
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const reviewId = request.nextUrl.searchParams.get('reviewId');

    // If reviewId provided, get moderation history for that review
    if (reviewId) {
      const history = await getModerationHistory(Number(reviewId));
      return NextResponse.json({ history });
    }

    // Otherwise get all flagged reviews
    const flaggedReviews = await prisma.review.findMany({
      where: {
        moderationStatus: 'FLAGGED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        tool: true,
        school: true,
        reviewText: true,
        moderationReason: true,
        flaggedCategories: true,
        createdAt: true,
        userEmail: true,
      },
    });

    return NextResponse.json({ flaggedReviews });
  } catch (err) {
    console.error('Error fetching moderation data:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Manually approve or reject a review
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { reviewId, action, reason } = body;

    if (!reviewId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const result = await manualModeration(
      Number(reviewId),
      action as 'approve' | 'reject',
      token.email,
      reason,
    );

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('Error in manual moderation:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
