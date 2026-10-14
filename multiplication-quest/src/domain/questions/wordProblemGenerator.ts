import { Question, AnswerType } from '../../types';
import { getNormalizedKey } from '../../data/multiplicationFacts';
import { generateDistractors } from './distractorGenerator';

interface WordProblemTemplate {
  template: string;
  item: string;
  itemPlural: string;
}

const templates: WordProblemTemplate[] = [
  { template: 'There are {f1} {container} with {f2} {item} in each {container}. How many {itemPlural} are there in total?', item: 'apple', itemPlural: 'apples', },
  { template: 'A {container} has {f1} rows with {f2} {item} in each row. How many {itemPlural} are there?', item: 'chair', itemPlural: 'chairs' },
  { template: '{f1} {container} each have {f2} {item}. How many {itemPlural} are there altogether?', item: 'cookie', itemPlural: 'cookies' },
  { template: 'There are {f2} {item} in each {container}. If there are {f1} {containerPlural}, how many {itemPlural} are there in total?', item: 'pencil', itemPlural: 'pencils' },
  { template: 'Each {container} contains {f2} {item}. How many {itemPlural} are in {f1} {containerPlural}?', item: 'marble', itemPlural: 'marbles' },
];

const items = [
  { singular: 'apple', plural: 'apples', container: 'bag', containerPlural: 'bags' },
  { singular: 'cookie', plural: 'cookies', container: 'box', containerPlural: 'boxes' },
  { singular: 'pencil', plural: 'pencils', container: 'case', containerPlural: 'cases' },
  { singular: 'marble', plural: 'marbles', container: 'jar', containerPlural: 'jars' },
  { singular: 'toy', plural: 'toys', container: 'chest', containerPlural: 'chests' },
  { singular: 'book', plural: 'books', container: 'shelf', containerPlural: 'shelves' },
  { singular: 'flower', plural: 'flowers', container: 'vase', containerPlural: 'vases' },
  { singular: 'candy', plural: 'candies', container: 'bowl', containerPlural: 'bowls' },
  { singular: 'sticker', plural: 'stickers', container: 'pack', containerPlural: 'packs' },
  { singular: 'crayon', plural: 'crayons', container: 'box', containerPlural: 'boxes' },
  { singular: 'student', plural: 'students', container: 'classroom', containerPlural: 'classrooms' },
  { singular: 'orange', plural: 'oranges', container: 'basket', containerPlural: 'baskets' },
];

let problemCounter = 0;

/**
 * Generate a word problem for multiplication
 */
export function generateWordProblem(
  factor1: number,
  factor2: number,
  answerType: AnswerType
): Question {
  const correctAnswer = factor1 * factor2;
  const normalizedKey = getNormalizedKey(factor1, factor2);

  // Select random item and template
  const item = items[problemCounter % items.length];
  problemCounter++;

  // Create word problem text
  let problemText: string;

  // Special cases
  if (factor1 === 0 || factor2 === 0) {
    problemText = `If there are no ${item.containerPlural}, how many ${item.plural} are there?`;
  } else if (factor1 === 1) {
    problemText = `There is 1 ${item.container} with ${factor2} ${factor2 === 1 ? item.singular : item.plural}. How many ${item.plural} are there?`;
  } else if (factor2 === 1) {
    problemText = `There are ${factor1} ${item.containerPlural}, each with 1 ${item.singular}. How many ${item.plural} are there in total?`;
  } else {
    // Regular case
    problemText = `There are ${factor1} ${item.containerPlural} with ${factor2} ${item.plural} in each ${item.container}. How many ${item.plural} are there altogether?`;
  }

  const question: Question = {
    id: `wp_${Date.now()}_${problemCounter}`,
    type: 'word-problem',
    answerType,
    factor1,
    factor2,
    correctAnswer,
    questionText: problemText,
    normalizedKey,
  };

  if (answerType === 'multiple-choice') {
    const distractors = generateDistractors(factor1, factor2, correctAnswer, 3);
    question.choices = shuffleArray([correctAnswer, ...distractors]);
  }

  return question;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
