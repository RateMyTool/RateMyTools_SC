import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
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
          createdAt: true,
          votes: {
            select: {
              voteType: true,
            },
          },
        },
      }),
      prisma.review.count(),
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

    // Cache for 60 seconds; revalidate after that
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    response.headers.set('CDN-Cache-Control', 'max-age=60');

    return response;
  } catch (err) {
    console.error('Error fetching reviews', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

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
      school, tool, subject, courseNumber, rating, tags, review,
    } = body;

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
        userEmail: token.email, // Add this line
      },
    });

    return NextResponse.json({ success: true, review: created }, { status: 201 });
  } catch (err) {
    console.error('Error creating review', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
