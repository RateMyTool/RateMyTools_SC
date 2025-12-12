import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const schoolName = decodeURIComponent(params.name);
    const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get('limit') || '5')));
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          school: {
            equals: schoolName,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          tool: true,
          school: true,
          subject: true,
          courseNumber: true,
          rating: true,
          reviewText: true,
          tags: true,
          createdAt: true,
          votes: {
            select: {
              voteType: true,
            },
          },
        },
      }),
      prisma.review.count({
        where: {
          school: {
            equals: schoolName,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    // Calculate vote counts for each review
    const reviewsWithVotes = reviews.map(review => {
      const upvotes = review.votes.filter(v => v.voteType === 'up').length;
      const downvotes = review.votes.filter(v => v.voteType === 'down').length;
      const { votes, ...reviewData } = review;
      return {
        ...reviewData,
        upvotes,
        downvotes,
        helpfulScore: upvotes - downvotes,
      };
    });

    const totalPages = Math.ceil(total / limit);
    
    const response = NextResponse.json({
      reviews: reviewsWithVotes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });

    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    response.headers.set('CDN-Cache-Control', 'max-age=60');

    return response;
  } catch (err) {
    console.error('Error fetching school reviews', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
