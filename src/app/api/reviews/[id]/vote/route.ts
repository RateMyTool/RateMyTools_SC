import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const reviewId = parseInt(params.id);
    const { voteType } = await request.json();

    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    // Use email if logged in, otherwise use 'anonymous'
    const userEmail = token?.email || 'anonymous';

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        reviewId_userEmail: {
          reviewId,
          userEmail,
        },
      },
    });

    if (existingVote) {
      // If same vote, remove it (toggle off)
      if (existingVote.voteType === voteType) {
        await prisma.vote.delete({
          where: {
            reviewId_userEmail: {
              reviewId,
              userEmail,
            },
          },
        });
      } else {
        // If different vote, update it
        await prisma.vote.update({
          where: {
            reviewId_userEmail: {
              reviewId,
              userEmail,
            },
          },
          data: { voteType },
        });
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          reviewId,
          userEmail,
          voteType,
        },
      });
    }

    // Get updated vote counts
    const [upvotes, downvotes] = await Promise.all([
      prisma.vote.count({ where: { reviewId, voteType: 'up' } }),
      prisma.vote.count({ where: { reviewId, voteType: 'down' } }),
    ]);

    return NextResponse.json({ upvotes, downvotes });
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const reviewId = parseInt(params.id);

    const [upvotes, downvotes] = await Promise.all([
      prisma.vote.count({ where: { reviewId, voteType: 'up' } }),
      prisma.vote.count({ where: { reviewId, voteType: 'down' } }),
    ]);

    return NextResponse.json({ upvotes, downvotes });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
