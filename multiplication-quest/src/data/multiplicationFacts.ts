import { MultiplicationFact } from '../types';

/**
 * Generate all 121 multiplication facts from 0x0 through 10x10
 * with normalized keys for commutative grouping
 */
export function generateAllFacts(): MultiplicationFact[] {
  const facts: MultiplicationFact[] = [];

  for (let factor1 = 0; factor1 <= 10; factor1++) {
    for (let factor2 = 0; factor2 <= 10; factor2++) {
      const product = factor1 * factor2;
      const normalizedKey = getNormalizedKey(factor1, factor2);
      const displayKey = `${factor1}x${factor2}`;

      facts.push({
        factor1,
        factor2,
        product,
        normalizedKey,
        displayKey,
      });
    }
  }

  return facts;
}

/**
 * Get normalized key for commutative facts (e.g., 3x4 and 4x3 both map to "3x4")
 */
export function getNormalizedKey(factor1: number, factor2: number): string {
  const min = Math.min(factor1, factor2);
  const max = Math.max(factor1, factor2);
  return `${min}x${max}`;
}

/**
 * Get all unique normalized facts (66 total)
 */
export function getUniqueFacts(): MultiplicationFact[] {
  const allFacts = generateAllFacts();
  const uniqueMap = new Map<string, MultiplicationFact>();

  allFacts.forEach(fact => {
    if (!uniqueMap.has(fact.normalizedKey)) {
      uniqueMap.set(fact.normalizedKey, fact);
    }
  });

  return Array.from(uniqueMap.values());
}

/**
 * Get all facts for a specific table (e.g., table 7 = 7x0, 7x1, ... 7x10)
 */
export function getFactsForTable(table: number): MultiplicationFact[] {
  return generateAllFacts().filter(
    fact => fact.factor1 === table || fact.factor2 === table
  );
}

/**
 * Get fact by specific factors
 */
export function getFact(factor1: number, factor2: number): MultiplicationFact | undefined {
  return generateAllFacts().find(
    fact => fact.factor1 === factor1 && fact.factor2 === factor2
  );
}

/**
 * Validate if an answer is correct for given factors
 */
export function validateAnswer(factor1: number, factor2: number, answer: number): boolean {
  const fact = getFact(factor1, factor2);
  return fact ? fact.product === answer : false;
}

/**
 * Get the correct answer for given factors
 */
export function getCorrectAnswer(factor1: number, factor2: number): number {
  return factor1 * factor2;
}

/**
 * Get facts by table with optional filtering
 */
export function getFactsByTables(tables: number[]): MultiplicationFact[] {
  const allFacts = generateAllFacts();
  return allFacts.filter(
    fact => tables.includes(fact.factor1) || tables.includes(fact.factor2)
  );
}

/**
 * Get all 121 ordered facts
 */
export const ALL_FACTS = generateAllFacts();

/**
 * Get all 66 unique normalized facts
 */
export const UNIQUE_FACTS = getUniqueFacts();

/**
 * Constants
 */
export const TOTAL_ORDERED_FACTS = 121;
export const TOTAL_UNIQUE_FACTS = 66;
export const MIN_FACTOR = 0;
export const MAX_FACTOR = 10;
