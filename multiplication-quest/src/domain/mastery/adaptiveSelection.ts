import { FactProgress, MultiplicationFact } from '../../types';
import { getFactsByTables, getNormalizedKey, UNIQUE_FACTS } from '../../data/multiplicationFacts';

/**
 * Select facts for adaptive practice based on student progress
 */
export function selectAdaptiveFacts(
  allProgress: Record<string, FactProgress>,
  count: number,
  selectedTables: number[] = []
): MultiplicationFact[] {
  // Get available facts based on table selection
  const availableFacts = selectedTables.length > 0
    ? getFactsByTables(selectedTables)
    : UNIQUE_FACTS.map(f => ({ ...f }));

  if (availableFacts.length === 0) {
    return [];
  }

  // Score each fact based on how much it needs practice
  const factsWithScores = availableFacts.map(fact => {
    const progress = allProgress[fact.normalizedKey];
    const needsScore = calculateNeedsScore(progress);

    return {
      fact,
      score: needsScore,
    };
  });

  // Sort by score (higher score = needs more practice)
  factsWithScores.sort((a, b) => b.score - a.score);

  // Use weighted random selection to pick facts
  // Higher scored facts have higher probability, but even mastered facts can appear
  const selected: MultiplicationFact[] = [];
  const usedKeys = new Set<string>();

  // First, ensure we include some high-priority facts
  const highPriority = factsWithScores.slice(0, Math.min(count, factsWithScores.length));
  highPriority.forEach(({ fact }) => {
    if (selected.length < count && !usedKeys.has(fact.normalizedKey)) {
      selected.push(fact);
      usedKeys.add(fact.normalizedKey);
    }
  });

  // Fill remaining with weighted random selection
  while (selected.length < count && selected.length < availableFacts.length) {
    const fact = weightedRandomSelection(factsWithScores);

    // Avoid immediate repetition
    if (!usedKeys.has(fact.normalizedKey)) {
      selected.push(fact);
      usedKeys.add(fact.normalizedKey);
    }
  }

  // Shuffle to avoid predictable ordering
  return shuffleArray(selected);
}

/**
 * Calculate how much a fact needs practice (0-100, higher = needs more)
 */
function calculateNeedsScore(progress: FactProgress | undefined): number {
  if (!progress) {
    return 100; // New facts get highest priority
  }

  let score = 0;

  // Never attempted = high priority
  if (progress.attempts === 0) {
    score += 50;
  }

  // Low accuracy = high priority
  const accuracy = progress.attempts > 0
    ? (progress.correctAttempts / progress.attempts) * 100
    : 0;
  score += (100 - accuracy) * 0.3;

  // Recent errors = high priority
  const recentErrors = progress.recentOutcomes.filter(o => !o).length;
  score += recentErrors * 5;

  // Low consecutive correct = moderate priority
  if (progress.consecutiveCorrect < 3) {
    score += (3 - progress.consecutiveCorrect) * 5;
  }

  // Not practiced recently = moderate priority
  if (progress.lastPracticedAt) {
    const daysSinceLastPractice = getDaysSince(progress.lastPracticedAt);
    if (daysSinceLastPractice > 7) {
      score += 15;
    } else if (daysSinceLastPractice > 3) {
      score += 5;
    }
  }

  // Mastered facts get low but non-zero score (for retention)
  if (progress.masteryStatus === 'mastered') {
    score = Math.max(score, 10); // Minimum score for retention practice
  }

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Weighted random selection from scored facts
 */
function weightedRandomSelection(
  factsWithScores: Array<{ fact: MultiplicationFact; score: number }>
): MultiplicationFact {
  const totalScore = factsWithScores.reduce((sum, item) => sum + item.score, 0);

  if (totalScore === 0) {
    // All facts equally weighted, select randomly
    return factsWithScores[Math.floor(Math.random() * factsWithScores.length)].fact;
  }

  let random = Math.random() * totalScore;

  for (const item of factsWithScores) {
    random -= item.score;
    if (random <= 0) {
      return item.fact;
    }
  }

  // Fallback (shouldn't reach here)
  return factsWithScores[factsWithScores.length - 1].fact;
}

/**
 * Get days since a timestamp
 */
function getDaysSince(timestamp: string): number {
  const now = new Date().getTime();
  const then = new Date(timestamp).getTime();
  return (now - then) / (1000 * 60 * 60 * 24);
}

/**
 * Shuffle array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get recommended tables to practice
 */
export function getRecommendedTables(
  allProgress: Record<string, FactProgress>,
  limit: number = 3
): number[] {
  const tableScores: Record<number, { score: number; count: number }> = {};

  // Initialize scores for tables 0-10
  for (let i = 0; i <= 10; i++) {
    tableScores[i] = { score: 0, count: 0 };
  }

  // Calculate scores for each table
  Object.values(allProgress).forEach(progress => {
    if (progress.masteryStatus === 'mastered') {
      return; // Skip mastered facts
    }

    const needsScore = calculateNeedsScore(progress);
    const [f1, f2] = progress.normalizedKey.split('x').map(Number);

    tableScores[f1].score += needsScore;
    tableScores[f1].count += 1;

    if (f2 !== f1) {
      tableScores[f2].score += needsScore;
      tableScores[f2].count += 1;
    }
  });

  // Get average score per table
  const tables = Object.keys(tableScores).map(Number);
  tables.sort((a, b) => {
    const avgA = tableScores[a].count > 0 ? tableScores[a].score / tableScores[a].count : 0;
    const avgB = tableScores[b].count > 0 ? tableScores[b].score / tableScores[b].count : 0;
    return avgB - avgA;
  });

  return tables.slice(0, limit);
}
