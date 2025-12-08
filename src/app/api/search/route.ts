import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // 'school' or 'tool'

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    if (type === 'school') {
      // Get unique schools from reviews
      const schools = await prisma.review.findMany({
        where: {
          school: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          school: true,
        },
        distinct: ['school'],
        take: 10,
      });

      const results = schools.map((s) => s.school);
      return NextResponse.json({ results });
    }

    if (type === 'tool') {
      // Get unique tools from reviews
      const tools = await prisma.review.findMany({
        where: {
          tool: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          tool: true,
        },
        distinct: ['tool'],
        take: 10,
      });

      const results = tools.map((t) => t.tool);
      return NextResponse.json({ results });
    }

    return NextResponse.json({ results: [] });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
