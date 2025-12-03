import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to submit a review' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { school, tool, subject, courseNumber, rating, tags, review } = body;

    // Validation
    if (!school || !tool || !rating || !review) {
      return NextResponse.json(
        { error: 'Missing required fields: school, tool, rating, and review are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (review.trim().length < 10) {
      return NextResponse.json(
        { error: 'Review must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Create review in database
    const newReview = await prisma.review.create({
      data: {
        school,
        tool,
        subject: subject || null,
        courseNumber: courseNumber || null,
        rating,
        tags: tags || [],
        reviewText: review,
        userEmail: session.user.email,
      },
    });

    return NextResponse.json(
      { success: true, review: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review. Please try again.' },
      { status: 500 }
    );
  }
}
