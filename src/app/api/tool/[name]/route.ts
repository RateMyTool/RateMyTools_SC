import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = {
  params: {
    name: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: Params,
) {
  try {
    const toolName = decodeURIComponent(params.name);
    const includeAll = request.nextUrl.searchParams.get('includeAll') === 'true';

    // By default, only show approved reviews
    const whereClause = includeAll
      ? { tool: toolName }
      : { tool: toolName, moderationStatus: 'APPROVED' as const };

    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        school: true,
        subject: true,
        courseNumber: true,
        reviewText: true,
        tags: true,
        createdAt: true,
        userEmail: true,
        moderationStatus: true,
        votes: {
          select: {
            voteType: true,
          },
        },
      },
    });

    // Calculate vote counts
    const reviewsWithVotes = reviews.map(review => {
      const upvotes = review.votes.filter(v => v.voteType === 'up').length;
      const downvotes = review.votes.filter(v => v.voteType === 'down').length;
      const { votes: _votes, ...reviewData } = review;
      
      return {
        ...reviewData,
        upvotes,
        downvotes,
        helpfulScore: upvotes - downvotes,
      };
    });

    return NextResponse.json({ reviews: reviewsWithVotes });
  } catch (err) {
    console.error('Error fetching tool reviews:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
