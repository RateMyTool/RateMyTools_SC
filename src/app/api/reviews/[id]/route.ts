import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number(params.id);

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    const isAdmin = user?.role === 'ADMIN';
    const isOwner = review.userEmail === token.email;

    // Allow deletion if user is admin or owner
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 },
      );
    }

    // Delete the review
    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Error deleting review:', err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
