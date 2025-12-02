const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const review = await prisma.review.create({
    data: {
      school: 'Local Test School',
      tool: 'Local Test Tool',
      subject: 'Test Subject',
      courseNumber: 'CS101',
      rating: 5,
      tags: ['test', 'automation'],
      reviewText: 'Automated test review created by scripts/testReview.js',
    },
  });
  console.log('Created review:', review);
}

main()
  .catch((e) => {
    console.error('Error creating review:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
