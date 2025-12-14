import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'tool';

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    if (type === 'school') {
      const schools = await prisma.review.findMany({
        where: {
          school: {
            contains: query,
            mode: 'insensitive',
          },
          moderationStatus: 'APPROVED',
        },
        select: {
          school: true,
        },
        distinct: ['school'],
        take: 10,
      });

      const results = schools.map((r) => r.school);
      return NextResponse.json({ results });
    }

    const tools = await prisma.review.findMany({
      where: {
        tool: {
          contains: query,
          mode: 'insensitive',
        },
        moderationStatus: 'APPROVED',
      },
      select: {
        tool: true,
      },
      distinct: ['tool'],
      take: 10,
    });

    const results = tools.map((r) => r.tool);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ results: [] });
  }
}
