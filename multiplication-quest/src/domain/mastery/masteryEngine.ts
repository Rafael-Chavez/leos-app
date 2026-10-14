import { FactProgress, MasteryStatus, QuestionAttempt } from '../../types';
import { UNIQUE_FACTS, getNormalizedKey } from '../../data/multiplicationFacts';

/**
 * Default mastery thresholds
 */
export const DEFAULT_MASTERY_THRESHOLDS = {
  consecutiveCorrect: 5,
  minimumSessions: 2,
  accuracyPercentage: 90,
};

/**
 * Initialize fact progress for all unique facts
 */
export function initializeFactProgress(): Record<string, FactProgress> {
  const progress: Record<string, FactProgress> = {};

  UNIQUE_FACTS.forEach(fact => {
    progress[fact.normalizedKey] = {
      normalizedKey: fact.normalizedKey,
      attempts: 0,
      correctAttempts: 0,
      recentOutcomes: [],
      consecutiveCorrect: 0,
      lastPracticedAt: null,
      lastMasteredAt: null,
      masteryStatus: 'new',
    };
  });

  return progress;
}

/**
 * Update fact progress based on a question attempt
 */
export function updateFactProgress(
  currentProgress: FactProgress,
  isCorrect: boolean,
  timestamp: string = new Date().toISOString()
): FactProgress {
  const updated = { ...currentProgress };

  // Update attempts
  updated.attempts += 1;
  if (isCorrect) {
    updated.correctAttempts += 1;
    updated.consecutiveCorrect += 1;
  } else {
    updated.consecutiveCorrect = 0;
  }

  // Update recent outcomes (keep last 10)
  updated.recentOutcomes = [...updated.recentOutcomes, isCorrect].slice(-10);

  // Update timestamp
  updated.lastPracticedAt = timestamp;

  // Recalculate mastery status
  updated.masteryStatus = calculateMasteryStatus(updated);

  // Update last mastered timestamp if appropriate
  if (updated.masteryStatus === 'mastered' && !currentProgress.lastMasteredAt) {
    updated.lastMasteredAt = timestamp;
  }

  return updated;
}

/**
 * Calculate mastery status based on progress
 */
export function calculateMasteryStatus(
  progress: FactProgress,
  thresholds = DEFAULT_MASTERY_THRESHOLDS
): MasteryStatus {
  // Check if never attempted
  if (progress.attempts === 0) {
    return 'new';
  }

  // Calculate recent accuracy
  const recentAccuracy = progress.recentOutcomes.length > 0
    ? (progress.recentOutcomes.filter(Boolean).length / progress.recentOutcomes.length) * 100
    : 0;

  // Check for mastery
  const hasEnoughAttempts = progress.attempts >= thresholds.minimumSessions * 2;
  const hasHighAccuracy = recentAccuracy >= thresholds.accuracyPercentage;
  const hasConsecutiveCorrect = progress.consecutiveCorrect >= thresholds.consecutiveCorrect;

  if (hasEnoughAttempts && hasHighAccuracy && hasConsecutiveCorrect) {
    return 'mastered';
  }

  // Check if practicing (good progress but not mastered)
  if (recentAccuracy >= 70 && progress.attempts >= 3) {
    return 'practicing';
  }

  // Otherwise learning
  return 'learning';
}

/**
 * Get facts by mastery status
 */
export function getFactsByStatus(
  allProgress: Record<string, FactProgress>,
  status: MasteryStatus
): FactProgress[] {
  return Object.values(allProgress).filter(p => p.masteryStatus === status);
}

/**
 * Get statistics summary
 */
export function getMasteryStatistics(allProgress: Record<string, FactProgress>) {
  const facts = Object.values(allProgress);

  const byStatus = {
    new: facts.filter(f => f.masteryStatus === 'new').length,
    learning: facts.filter(f => f.masteryStatus === 'learning').length,
    practicing: facts.filter(f => f.masteryStatus === 'practicing').length,
    mastered: facts.filter(f => f.masteryStatus === 'mastered').length,
  };

  const totalAttempts = facts.reduce((sum, f) => sum + f.attempts, 0);
  const totalCorrect = facts.reduce((sum, f) => sum + f.correctAttempts, 0);
  const overallAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

  // Calculate recent accuracy (last 50 attempts across all facts)
  const recentAttempts = facts
    .flatMap(f => f.recentOutcomes)
    .slice(-50);
  const recentAccuracy = recentAttempts.length > 0
    ? (recentAttempts.filter(Boolean).length / recentAttempts.length) * 100
    : 0;

  return {
    byStatus,
    totalAttempts,
    totalCorrect,
    overallAccuracy,
    recentAccuracy,
    totalFacts: facts.length,
  };
}

/**
 * Get weakest facts (needing most practice)
 */
export function getWeakestFacts(
  allProgress: Record<string, FactProgress>,
  limit: number = 10
): FactProgress[] {
  return Object.values(allProgress)
    .filter(f => f.masteryStatus !== 'mastered')
    .sort((a, b) => {
      // Sort by accuracy (lower first), then by attempts (fewer first)
      const aAccuracy = a.attempts > 0 ? a.correctAttempts / a.attempts : 0;
      const bAccuracy = b.attempts > 0 ? b.correctAttempts / b.attempts : 0;

      if (aAccuracy !== bAccuracy) {
        return aAccuracy - bAccuracy;
      }

      return a.attempts - b.attempts;
    })
    .slice(0, limit);
}

/**
 * Get facts needing review (mastered but not practiced recently)
 */
export function getFactsNeedingReview(
  allProgress: Record<string, FactProgress>,
  daysSinceLastPractice: number = 7
): FactProgress[] {
  const now = new Date().getTime();
  const reviewThreshold = daysSinceLastPractice * 24 * 60 * 60 * 1000;

  return Object.values(allProgress)
    .filter(f => {
      if (f.masteryStatus !== 'mastered' || !f.lastPracticedAt) {
        return false;
      }

      const lastPracticed = new Date(f.lastPracticedAt).getTime();
      return (now - lastPracticed) > reviewThreshold;
    });
}
