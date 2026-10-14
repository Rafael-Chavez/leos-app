import { Question, QuestionType, AnswerType } from '../../types';
import { getNormalizedKey, getFactsByTables, ALL_FACTS } from '../../data/multiplicationFacts';
import { generateDistractors } from './distractorGenerator';
import { generateWordProblem } from './wordProblemGenerator';

let questionCounter = 0;

/**
 * Generate a unique question ID
 */
function generateQuestionId(): string {
  return `q_${Date.now()}_${questionCounter++}`;
}

/**
 * Shuffle array using Fisher-Yates algorithm
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
 * Generate a direct multiplication question
 */
export function generateDirectQuestion(
  factor1: number,
  factor2: number,
  answerType: AnswerType
): Question {
  const correctAnswer = factor1 * factor2;
  const normalizedKey = getNormalizedKey(factor1, factor2);

  const question: Question = {
    id: generateQuestionId(),
    type: 'direct',
    answerType,
    factor1,
    factor2,
    correctAnswer,
    questionText: `${factor1} × ${factor2} = ?`,
    normalizedKey,
  };

  if (answerType === 'multiple-choice') {
    question.choices = shuffleArray([
      correctAnswer,
      ...generateDistractors(factor1, factor2, correctAnswer, 3)
    ]);
  }

  return question;
}

/**
 * Generate a missing-factor question
 */
export function generateMissingFactorQuestion(
  factor1: number,
  factor2: number,
  answerType: AnswerType
): Question {
  const product = factor1 * factor2;
  const normalizedKey = getNormalizedKey(factor1, factor2);

  // Randomly choose which factor to hide
  const hideFactor1 = Math.random() < 0.5;
  const missingPosition = hideFactor1 ? 'factor1' : 'factor2';
  const correctAnswer = hideFactor1 ? factor1 : factor2;

  const questionText = hideFactor1
    ? `□ × ${factor2} = ${product}`
    : `${factor1} × □ = ${product}`;

  const question: Question = {
    id: generateQuestionId(),
    type: 'missing-factor',
    answerType,
    factor1,
    factor2,
    correctAnswer,
    questionText,
    normalizedKey,
    missingPosition,
  };

  if (answerType === 'multiple-choice') {
    // Generate plausible distractors for the missing factor
    const distractors: number[] = [];
    const correctFactor = correctAnswer;

    // Add nearby numbers
    if (correctFactor > 0) distractors.push(correctFactor - 1);
    if (correctFactor < 10) distractors.push(correctFactor + 1);

    // Add some other factors
    if (correctFactor !== 2) distractors.push(2);
    if (correctFactor !== 5) distractors.push(5);

    // Filter out duplicates and the correct answer
    const uniqueDistractors = [...new Set(distractors)]
      .filter(d => d !== correctAnswer && d >= 0 && d <= 10)
      .slice(0, 3);

    question.choices = shuffleArray([correctAnswer, ...uniqueDistractors]);
  }

  return question;
}

/**
 * Generate questions for specific tables
 */
export function generateQuestionsForTables(
  tables: number[],
  count: number,
  questionTypes: QuestionType[],
  answerType: AnswerType
): Question[] {
  const availableFacts = tables.length === 0 || tables.includes(-1)
    ? ALL_FACTS
    : getFactsByTables(tables);

  if (availableFacts.length === 0) {
    return [];
  }

  const questions: Question[] = [];
  const usedFactKeys = new Set<string>();

  while (questions.length < count) {
    // Select a random fact
    const fact = availableFacts[Math.floor(Math.random() * availableFacts.length)];

    // Create a unique key for this specific question (not normalized)
    const factKey = `${fact.factor1}x${fact.factor2}`;

    // Try not to repeat the exact same question immediately
    if (usedFactKeys.has(factKey) && usedFactKeys.size < availableFacts.length) {
      continue;
    }

    // Select a random question type
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let question: Question;

    switch (questionType) {
      case 'missing-factor':
        question = generateMissingFactorQuestion(fact.factor1, fact.factor2, answerType);
        break;
      case 'word-problem':
        question = generateWordProblem(fact.factor1, fact.factor2, answerType);
        break;
      default:
        question = generateDirectQuestion(fact.factor1, fact.factor2, answerType);
    }

    questions.push(question);
    usedFactKeys.add(factKey);

    // Reset used facts if we've exhausted all available facts
    if (usedFactKeys.size >= availableFacts.length) {
      usedFactKeys.clear();
    }
  }

  return questions;
}

/**
 * Generate a balanced mix of questions
 */
export function generateBalancedQuestions(
  count: number,
  answerType: AnswerType
): Question[] {
  const questions: Question[] = [];

  // Distribute questions across different difficulty levels
  const easyCount = Math.floor(count * 0.3); // 0, 1, 2, 5, 10
  const mediumCount = Math.floor(count * 0.4); // 3, 4, 6
  const hardCount = count - easyCount - mediumCount; // 7, 8, 9

  const easyTables = [0, 1, 2, 5, 10];
  const mediumTables = [3, 4, 6];
  const hardTables = [7, 8, 9];

  questions.push(...generateQuestionsForTables(easyTables, easyCount, ['direct'], answerType));
  questions.push(...generateQuestionsForTables(mediumTables, mediumCount, ['direct'], answerType));
  questions.push(...generateQuestionsForTables(hardTables, hardCount, ['direct', 'missing-factor'], answerType));

  return shuffleArray(questions);
}
