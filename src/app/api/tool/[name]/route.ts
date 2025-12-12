import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const toolName = decodeURIComponent(params.name);

    const reviews = await prisma.review.findMany({
      where: {
        tool: {
          equals: toolName,
          mode: 'insensitive',
        },
      },
      include: {
        votes: {
          select: {
            voteType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate vote counts for each review
    const reviewsWithVotes = reviews.map((review) => {
      const upvotes = review.votes.filter((v) => v.voteType === 'up').length;
      const downvotes = review.votes.filter((v) => v.voteType === 'down').length;
      const helpfulScore = upvotes - downvotes;
      
      return {
        id: review.id,
        rating: review.rating,
        school: review.school,
        subject: review.subject,
        courseNumber: review.courseNumber,
        createdAt: review.createdAt,
        reviewText: review.reviewText,
        tags: review.tags,
        userEmail: review.userEmail,
        tool: review.tool,
        upvotes,
        downvotes,
        helpfulScore,
      };
    });

    return NextResponse.json({ reviews: reviewsWithVotes });
  } catch (error) {
    console.error('Error fetching tool reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
