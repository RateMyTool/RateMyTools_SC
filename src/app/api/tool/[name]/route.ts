import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Cache reviews for 60 seconds
export const revalidate = 60;

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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Set cache headers for browser
    const response = NextResponse.json({ reviews });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return response;
  } catch (error) {
    console.error('Error fetching tool reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
