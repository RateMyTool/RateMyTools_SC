import { prisma } from '../src/lib/prisma';

async function seedData() {
  try {
    // Create schools
    const utexas = await prisma.school.upsert({
      where: { domain: 'utexas.edu' },
      update: {},
      create: {
        name: 'University of Texas at Austin',
        domain: 'utexas.edu',
        location: 'Austin, TX',
      },
    });

    const mit = await prisma.school.upsert({
      where: { domain: 'mit.edu' },
      update: {},
      create: {
        name: 'Massachusetts Institute of Technology',
        domain: 'mit.edu',
        location: 'Cambridge, MA',
      },
    });

    // Create tools
    const canvas = await prisma.tool.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Canvas',
        category: 'LMS',
        logoUrl: null,
      },
    });

    const brightspace = await prisma.tool.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Brightspace',
        category: 'LMS',
        logoUrl: null,
      },
    });

    const googleClassroom = await prisma.tool.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Google Classroom',
        category: 'LMS',
        logoUrl: null,
      },
    });

    console.log('✅ Schools seeded:', { utexas, mit });
    console.log('✅ Tools seeded:', { canvas, brightspace, googleClassroom });

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
