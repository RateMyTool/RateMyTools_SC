import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = {
  params: {
    name: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: Params,
) {
  try {
    const schoolName = decodeURIComponent(params.name);
    const includeAll = request.nextUrl.searchParams.get('includeAll') === 'true';

    // By default, only show approved reviews
    const whereClause = includeAll 
      ? { school: schoolName }
      : { school: schoolName, moderationStatus: 'APPROVED' as const };

    const reviews = await prisma.review.findMany({
      where: whereClause,
      select: {
        tool: true,
        rating: true,
        reviewText: true,
        tags: true,
        votes: {
          select: {
            voteType: true,
          },
        },
      },
    });

    if (reviews.length === 0) {
      return NextResponse.json({ tools: [] });
    }

    // Group by tool name
    const toolsMap = new Map<string, {
      name: string;
      ratings: number[];
      descriptions: Set<string>;
      tags: Set<string>;
      upvotes: number;
      downvotes: number;
    }>();

    reviews.forEach((review) => {
      if (!toolsMap.has(review.tool)) {
        toolsMap.set(review.tool, {
          name: review.tool,
          ratings: [],
          descriptions: new Set(),
          tags: new Set(),
          upvotes: 0,
          downvotes: 0,
        });
      }

      const tool = toolsMap.get(review.tool)!;
      tool.ratings.push(review.rating);
      
      if (review.reviewText) {
        tool.descriptions.add(review.reviewText);
      }
      
      review.tags.forEach(tag => tool.tags.add(tag));
      
      // Count votes
      review.votes.forEach(vote => {
        if (vote.voteType === 'up') tool.upvotes++;
        if (vote.voteType === 'down') tool.downvotes++;
      });
    });

    // Convert to array
    const tools = Array.from(toolsMap.values()).map(tool => {
      const avgRating = tool.ratings.reduce((sum, r) => sum + r, 0) / tool.ratings.length;
      const uniqueTags = Array.from(tool.tags).slice(0, 5);
      const description = Array.from(tool.descriptions)[0] || 'No description available';

      return {
        name: tool.name,
        rating: Number(avgRating.toFixed(1)),
        totalRatings: tool.ratings.length,
        description: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
        tags: uniqueTags,
        upvotes: tool.upvotes,
        downvotes: tool.downvotes,
      };
    });

    return NextResponse.json({ tools });
  } catch (err) {
    console.error('Error fetching tools for school:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
