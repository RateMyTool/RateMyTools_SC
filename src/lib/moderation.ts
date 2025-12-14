import OpenAI from 'openai';
import prisma from './prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function moderateReview(reviewId: number, content: string) {
  try {
    console.log('🔍 Moderating review ID:', reviewId);
    
    const moderation = await openai.moderations.create({
      model: 'omni-moderation-latest',
      input: content,
    });

    const result = moderation.results[0];
    console.log('📊 Moderation result:', result);

    const flaggedCategories: string[] = [];
    let shouldReject = false;

    // Check each category
    if (result.categories.harassment) flaggedCategories.push('harassment');
    if (result.categories.hate) flaggedCategories.push('hate');
    if (result.categories['hate/threatening']) flaggedCategories.push('hate/threatening');
    if (result.categories.sexual) flaggedCategories.push('sexual');
    if (result.categories['sexual/minors']) flaggedCategories.push('sexual/minors');
    if (result.categories.violence) flaggedCategories.push('violence');
    if (result.categories['violence/graphic']) flaggedCategories.push('violence/graphic');
    if (result.categories['self-harm']) flaggedCategories.push('self-harm');

    // Auto-reject for severe violations
    if (
      result.categories['hate/threatening'] ||
      result.categories['sexual/minors'] ||
      result.categories['violence/graphic'] ||
      result.category_scores.hate > 0.8 ||
      result.category_scores.violence > 0.8
    ) {
      shouldReject = true;
    }

    // Determine moderation status
    let moderationStatus: 'APPROVED' | 'REJECTED' | 'FLAGGED';
    let moderationReason: string | null = null;

    if (shouldReject) {
      moderationStatus = 'REJECTED';
      moderationReason = `Content flagged for: ${flaggedCategories.join(', ')}`;
    } else if (flaggedCategories.length > 0) {
      moderationStatus = 'FLAGGED';
      moderationReason = `Flagged for manual review: ${flaggedCategories.join(', ')}`;
    } else {
      moderationStatus = 'APPROVED';
    }

    // Update review with moderation result
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        moderationStatus,
        moderationReason,
        moderatedAt: new Date(),
        flaggedCategories,
      },
    });

    // Log the moderation action
    await prisma.moderationLog.create({
      data: {
        reviewId,
        action: shouldReject ? 'auto_rejected' : flaggedCategories.length > 0 ? 'auto_flagged' : 'auto_approved',
        reason: moderationReason,
        flaggedCategories,
        moderatorEmail: null,
      },
    });

    console.log('✅ Moderation complete:', moderationStatus);
    return { moderationStatus, flaggedCategories };
  } catch (error: unknown) {
    console.error('❌ Moderation error:', error);
    
    // Flag for manual review on error
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        moderationStatus: 'FLAGGED',
        moderationReason: 'Moderation system error',
        moderatedAt: new Date(),
      },
    });

    await prisma.moderationLog.create({
      data: {
        reviewId,
        action: 'auto_flagged',
        reason: 'Moderation system error',
        flaggedCategories: [],
        moderatorEmail: null,
      },
    });

    throw error;
  }
}

// Helper function to manually approve/reject reviews (for admin use)
export async function manualModeration(
  reviewId: number,
  action: 'approve' | 'reject',
  moderatorEmail: string,
  reason?: string,
) {
  const moderationStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';

  await prisma.review.update({
    where: { id: reviewId },
    data: {
      moderationStatus,
      moderationReason: reason || null,
      moderatedAt: new Date(),
    },
  });

  await prisma.moderationLog.create({
    data: {
      reviewId,
      action: action === 'approve' ? 'manual_approved' : 'manual_rejected',
      reason: reason || null,
      flaggedCategories: [],
      moderatorEmail,
    },
  });

  return { moderationStatus };
}

// Get all flagged reviews (for admin dashboard)
export async function getFlaggedReviews() {
  return prisma.review.findMany({
    where: {
      moderationStatus: 'FLAGGED',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Get moderation history for a review
export async function getModerationHistory(reviewId: number) {
  return prisma.moderationLog.findMany({
    where: {
      reviewId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
