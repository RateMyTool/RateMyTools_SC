import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const includeAll = request.nextUrl.searchParams.get('includeAll') === 'true';
    
    // By default, only show approved reviews (unless includeAll is true for admin)
    const whereClause = includeAll ? {} : { moderationStatus: 'APPROVED' as const };

    const reviews = await prisma.review.findMany({
      where: whereClause,
      select: {
        tool: true,
        rating: true,
        reviewText: true,
        tags: true,
      },
    });

    // Group by tool name
    const toolsMap = new Map<string, {
      name: string;
      ratings: number[];
      descriptions: Set<string>;
      tags: Set<string>;
    }>();

    reviews.forEach((review) => {
      if (!toolsMap.has(review.tool)) {
        toolsMap.set(review.tool, {
          name: review.tool,
          ratings: [],
          descriptions: new Set(),
          tags: new Set(),
        });
      }

      const tool = toolsMap.get(review.tool)!;
      tool.ratings.push(review.rating);
      if (review.reviewText) {
        tool.descriptions.add(review.reviewText);
      }
      review.tags.forEach(tag => tool.tags.add(tag));
    });

    // Convert to array with calculated values
    const tools = Array.from(toolsMap.values()).map(tool => {
      const avgRating = tool.ratings.reduce((sum, r) => sum + r, 0) / tool.ratings.length;
      const uniqueTags = Array.from(tool.tags).slice(0, 5);
      const description = Array.from(tool.descriptions)[0] || 'No description available';

      return {
        name: tool.name,
        rating: Number(avgRating.toFixed(1)),
        totalRatings: tool.ratings.length,
        description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
        tags: uniqueTags,
      };
    });

    // Sort by rating descending
    tools.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({
      tools,
      total: tools.length,
    });
  } catch (err) {
    console.error('Error fetching tools:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
