import { prisma } from '../src/lib/prisma';

async function cleanupReviews() {
  try {
    // Delete all reviews
    const deleted = await prisma.review.deleteMany({});
    console.log(`✅ Deleted ${deleted.count} old reviews`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error deleting reviews:', error);
    process.exit(1);
  }
}

cleanupReviews();
