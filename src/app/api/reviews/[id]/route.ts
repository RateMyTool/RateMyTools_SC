import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);

    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        tool: true,
        school: true,
        subject: true,
        courseNumber: true,
        rating: true,
        tags: true,
        reviewText: true,
        userEmail: true,
        createdAt: true,
        moderationStatus: true,
        votes: {
          select: {
            voteType: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Calculate vote counts
    const upvotes = review.votes.filter(v => v.voteType === 'up').length;
    const downvotes = review.votes.filter(v => v.voteType === 'down').length;
    const { votes, ...reviewData } = review;

    return NextResponse.json({
      ...reviewData,
      upvotes,
      downvotes,
      helpfulScore: upvotes - downvotes,
    });
  } catch (err) {
    console.error('Error fetching review:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log('🔍 DELETE request - Token:', token);

    if (!token || !token.email) {
      console.log('❌ No token or email');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number(params.id);
    console.log('🔍 Review ID:', id);

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id },
    });

    console.log('🔍 Review found:', review);

    if (!review) {
      console.log('❌ Review not found');
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    console.log('🔍 User:', user);

    const isAdmin = user?.role === 'ADMIN';
    const isOwner = review.userEmail === token.email;

    console.log('🔍 isAdmin:', isAdmin, 'isOwner:', isOwner);
    console.log('�� review.userEmail:', review.userEmail, 'token.email:', token.email);

    // Allow deletion if user is admin or owner
    if (!isAdmin && !isOwner) {
      console.log('❌ Not authorized - not admin and not owner');
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 },
      );
    }

    console.log('✅ Authorized - deleting review');

    // Delete the review
    await prisma.review.delete({
      where: { id },
    });

    console.log('✅ Review deleted successfully');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('❌ Error deleting review:', err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
