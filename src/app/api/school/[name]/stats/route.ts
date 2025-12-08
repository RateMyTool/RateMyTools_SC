import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const schoolName = decodeURIComponent(params.name);

    const reviews = await prisma.review.findMany({
      where: {
        school: {
          equals: schoolName,
          mode: 'insensitive',
        },
      },
      select: {
        tool: true,
        rating: true,
      },
    });

    const totalReviews = reviews.length;
    const uniqueTools = new Set(reviews.map((r) => r.tool)).size;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    return NextResponse.json({
      totalTools: uniqueTools,
      totalReviews,
      avgRating,
    });
  } catch (error) {
    console.error('Error fetching school stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
