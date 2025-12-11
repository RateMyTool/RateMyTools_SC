import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const schoolName = decodeURIComponent(params.name);

    // Get all unique subjects for reviews at this school
    const reviews = await prisma.review.findMany({
      where: {
        school: {
          equals: schoolName,
          mode: 'insensitive',
        },
      },
      select: {
        subject: true,
      },
      distinct: ['subject'],
    });

    // Filter out null/undefined subjects and create unique list
    const subjects = reviews
      .map(r => r.subject)
      .filter((subject): subject is string => !!subject)
      .sort();

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}
