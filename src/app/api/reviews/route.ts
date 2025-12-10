import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortValue = searchParams.get('sort') || 'newest';
    const skip = (page - 1) * limit;

    // Database-level sorting for better performance
    let orderBy: { createdAt?: 'asc' | 'desc'; rating?: 'asc' | 'desc' } = { createdAt: 'desc' };
    if (sortValue === 'highest') orderBy = { rating: 'desc' };
    else if (sortValue === 'lowest') orderBy = { rating: 'asc' };
    else if (sortValue === 'oldest') orderBy = { createdAt: 'asc' };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        skip,
        take: limit,
        orderBy,
      }),
      prisma.review.count(),
    ]);

    const transformedReviews = reviews.map(r => ({
      id: r.id,
      tool: r.tool,
      school: r.school,
      subject: r.subject,
      courseNumber: r.courseNumber,
      rating: r.rating,
      review: r.reviewText,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({
      reviews: transformedReviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
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
      school, tool, subject, courseNumber, rating, tags, review, comment,
    } = body;

    if (!school || !tool || typeof rating !== 'number' || (!review && !comment)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create review with text fields
    const created = await prisma.review.create({
      data: {
        school: school.trim(),
        tool: tool.trim(),
        subject: subject || null,
        courseNumber: courseNumber || null,
        rating: parseInt(rating),
        tags: (tags && Array.isArray(tags) ? tags : []).map(String),
        reviewText: review || comment,
        userEmail: token.email,
      },
    });

    // On-demand revalidation: rebuild pages immediately when review is added
    revalidatePath('/reviews', 'page');
    revalidatePath('/reviews/[id]', 'page');

    return NextResponse.json({ success: true, review: created }, { status: 201 });
  } catch (err) {
    console.error('Error creating review', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
