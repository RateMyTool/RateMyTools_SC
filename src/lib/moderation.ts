import OpenAI from 'openai';
import prisma from './prisma';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ModerationResult {
  approved: boolean;
  flagged: boolean;
  categories: string[];
  reason: string | null;
}

/**
 * Moderate content using OpenAI's Moderation API
 * @param content - The text content to moderate
 * @returns ModerationResult with approval status and flagged categories
 */
export async function moderateContent(content: string): Promise<ModerationResult> {
  console.log('🔍 Starting moderation for content:', content.substring(0, 50) + '...');
  
  // Retry logic for rate limits
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`📡 Calling OpenAI Moderation API (attempt ${attempt + 1}/${maxRetries})...`);
      const response = await openai.moderations.create({
        model: 'omni-moderation-latest',
        input: content,
      });

      console.log('✅ OpenAI API response received:', response.results[0].flagged ? 'FLAGGED' : 'CLEAN');
      const result = response.results[0];
      const flaggedCategories: string[] = [];

      // Check which categories were flagged
      if (result.categories.hate) flaggedCategories.push('hate');
      if (result.categories.harassment) flaggedCategories.push('harassment');
      if (result.categories['hate/threatening']) flaggedCategories.push('hate/threatening');
      if (result.categories['harassment/threatening']) flaggedCategories.push('harassment/threatening');
      if (result.categories['self-harm']) flaggedCategories.push('self-harm');
      if (result.categories['self-harm/intent']) flaggedCategories.push('self-harm/intent');
      if (result.categories['self-harm/instructions']) flaggedCategories.push('self-harm/instructions');
      if (result.categories.sexual) flaggedCategories.push('sexual');
      if (result.categories['sexual/minors']) flaggedCategories.push('sexual/minors');
      if (result.categories.violence) flaggedCategories.push('violence');
      if (result.categories['violence/graphic']) flaggedCategories.push('violence/graphic');

      const isFlagged = result.flagged;

      return {
        approved: !isFlagged,
        flagged: isFlagged,
        categories: flaggedCategories,
        reason: isFlagged ? `Content flagged for: ${flaggedCategories.join(', ')}` : null,
      };
    } catch (error: any) {
      lastError = error;
      
      // If rate limited (429), wait and retry
      if (error?.status === 429 && attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Rate limited, retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // For other errors or final retry, break out
      break;
    }
  }

  console.error('OpenAI Moderation API error:', lastError);
  // On API error, mark as pending for manual review
  return {
    approved: false,
    flagged: false,
    categories: [],
    reason: 'Moderation API unavailable - pending manual review',
  };
}

/**
 * Moderate a review and update its status in the database
 * @param reviewId - The ID of the review to moderate
 * @param reviewText - The review text content
 * @returns Updated moderation status
 */
export async function moderateReview(reviewId: number, reviewText: string): Promise<ModerationResult> {
  const moderationResult = await moderateContent(reviewText);

  let status: 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'PENDING';
  if (moderationResult.approved) {
    status = 'APPROVED';
  } else if (moderationResult.flagged) {
    status = 'REJECTED';
  } else {
    status = 'PENDING'; // API error case
  }

  // Update the review with moderation results
  await prisma.review.update({
    where: { id: reviewId },
    data: {
      moderationStatus: status,
      moderationReason: moderationResult.reason,
      moderatedAt: new Date(),
      flaggedCategories: moderationResult.categories,
    },
  });

  // Log the moderation action
  await prisma.moderationLog.create({
    data: {
      reviewId,
      action: moderationResult.approved ? 'auto_approved' : 'auto_rejected',
      reason: moderationResult.reason,
      flaggedCategories: moderationResult.categories,
      moderatorEmail: null, // null indicates auto-moderation
    },
  });

  return moderationResult;
}

/**
 * Manually moderate a review (for admin use)
 * @param reviewId - The ID of the review
 * @param approved - Whether to approve or reject
 * @param reason - Reason for the decision
 * @param moderatorEmail - Email of the moderator
 */
export async function manualModerateReview(
  reviewId: number,
  approved: boolean,
  reason: string | null,
  moderatorEmail: string,
): Promise<void> {
  const status = approved ? 'APPROVED' : 'REJECTED';

  await prisma.review.update({
    where: { id: reviewId },
    data: {
      moderationStatus: status,
      moderationReason: reason,
      moderatedAt: new Date(),
    },
  });

  await prisma.moderationLog.create({
    data: {
      reviewId,
      action: approved ? 'manual_approved' : 'manual_rejected',
      reason,
      flaggedCategories: [],
      moderatorEmail,
    },
  });
}

/**
 * Get reviews pending moderation
 */
export async function getPendingReviews() {
  return prisma.review.findMany({
    where: { moderationStatus: 'PENDING' },
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Get moderation history for a review
 */
export async function getModerationHistory(reviewId: number) {
  return prisma.moderationLog.findMany({
    where: { reviewId },
    orderBy: { createdAt: 'desc' },
  });
}
