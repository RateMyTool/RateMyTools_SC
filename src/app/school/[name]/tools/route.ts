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
    });

    // Group by tool
    const toolsMap = new Map<string, {
      ratings: number[];
      tags: Set<string>;
      reviews: string[];
    }>();

    reviews.forEach((review) => {
      if (!toolsMap.has(review.tool)) {
        toolsMap.set(review.tool, {
          ratings: [],
          tags: new Set(),
          reviews: [],
        });
      }
      const toolData = toolsMap.get(review.tool)!;
      toolData.ratings.push(review.rating);
      review.tags.forEach((tag) => toolData.tags.add(tag));
      toolData.reviews.push(review.reviewText);
    });

    // Convert to array and calculate stats
    const tools = Array.from(toolsMap.entries()).map(([name, data]) => {
      const avgRating = data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length;
      const description = data.reviews[0].substring(0, 150) + (data.reviews[0].length > 150 ? '...' : '');

      return {
        name,
        rating: avgRating,
        totalRatings: data.ratings.length,
        description,
        tags: Array.from(data.tags).slice(0, 3),
      };
    });

    // Sort by rating descending
    tools.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}
