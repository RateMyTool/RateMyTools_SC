import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { manualModerateReview, getModerationHistory } from '@/lib/moderation';

// GET - Get pending reviews or moderation history
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Role is stored in randomKey in this app's auth setup
    if (!token || token.randomKey !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = request.nextUrl.searchParams.get('reviewId');
    const status = request.nextUrl.searchParams.get('status') || 'PENDING';

    // If reviewId is provided, get moderation history for that review
    if (reviewId) {
      const history = await getModerationHistory(parseInt(reviewId, 10));
      return NextResponse.json({ history });
    }

    // Otherwise, get reviews by status
    const reviews = await prisma.review.findMany({
      where: { moderationStatus: status as any },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        tool: true,
        school: true,
        subject: true,
        courseNumber: true,
        rating: true,
        reviewText: true,
        tags: true,
        userEmail: true,
        createdAt: true,
        moderationStatus: true,
        moderationReason: true,
        flaggedCategories: true,
      },
    });

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error('Error fetching moderation data:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Manually moderate a review
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Role is stored in randomKey in this app's auth setup
    if (!token || token.randomKey !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reviewId, approved, reason } = body;

    if (typeof reviewId !== 'number' || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await manualModerateReview(
      reviewId,
      approved,
      reason || null,
      token.email as string,
    );

    return NextResponse.json({ 
      success: true, 
      message: `Review ${approved ? 'approved' : 'rejected'} successfully`,
    });
  } catch (err) {
    console.error('Error moderating review:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
