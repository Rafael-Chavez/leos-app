/**
 * Generate plausible incorrect answers for multiple choice questions
 */
export function generateDistractors(
  factor1: number,
  factor2: number,
  correctAnswer: number,
  count: number = 3
): number[] {
  const distractors = new Set<number>();

  // Strategy 1: Off-by-one in factors
  if (factor1 > 0) {
    distractors.add((factor1 - 1) * factor2);
  }
  if (factor1 < 10) {
    distractors.add((factor1 + 1) * factor2);
  }
  if (factor2 > 0) {
    distractors.add(factor1 * (factor2 - 1));
  }
  if (factor2 < 10) {
    distractors.add(factor1 * (factor2 + 1));
  }

  // Strategy 2: Common addition/subtraction errors
  distractors.add(factor1 + factor2);
  distractors.add(Math.abs(factor1 - factor2));

  // Strategy 3: Off-by-table errors (using adjacent tables)
  const nearbyFactors = [factor1 - 1, factor1 + 1, factor2 - 1, factor2 + 1].filter(
    f => f >= 0 && f <= 10
  );
  nearbyFactors.forEach(f => {
    distractors.add(f * factor2);
    distractors.add(factor1 * f);
  });

  // Strategy 4: Doubled or halved answers
  distractors.add(correctAnswer * 2);
  distractors.add(Math.floor(correctAnswer / 2));

  // Strategy 5: Square if not already
  if (factor1 === factor2) {
    distractors.add(factor1 * (factor1 + 1));
    distractors.add(factor1 * (factor1 - 1));
  }

  // Remove the correct answer and negative numbers
  distractors.delete(correctAnswer);
  const validDistractors = Array.from(distractors).filter(d => d >= 0 && d !== correctAnswer);

  // If we don't have enough, add some random nearby numbers
  while (validDistractors.length < count) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const candidate = correctAnswer + offset;
    if (candidate >= 0 && candidate !== correctAnswer && !validDistractors.includes(candidate)) {
      validDistractors.push(candidate);
    }
  }

  // Return the requested number of distractors
  return validDistractors.slice(0, count);
}
