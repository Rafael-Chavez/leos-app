import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-0',
    title: 'Understanding Multiplication',
    description: 'Learn what multiplication means',
    table: -1,
    content: {
      explanation: 'Multiplication is a fast way to add the same number many times. When we say 3 × 4, we mean "3 groups of 4" or "add 4 three times."',
      visualExamples: [
        {
          type: 'groups',
          description: '3 × 4 means 3 groups with 4 items in each group',
        },
      ],
      strategies: [
        'Multiplication is repeated addition',
        'The order doesn\'t matter: 3 × 4 = 4 × 3',
        'Arrays help us see multiplication as rows and columns',
      ],
      workedExamples: [
        {
          problem: '3 × 4',
          steps: ['We have 3 groups of 4', '4 + 4 + 4 = 12'],
          answer: 12,
        },
      ],
    },
    practiceQuestions: [],
    completed: false,
  },
  {
    id: 'lesson-zero',
    title: 'Multiplying by Zero',
    description: 'Learn the zero property',
    table: 0,
    content: {
      explanation: 'When you multiply any number by zero, the answer is always zero. If you have zero groups of something, you have nothing!',
      visualExamples: [],
      strategies: ['Any number × 0 = 0', '0 × any number = 0'],
      workedExamples: [
        { problem: '5 × 0', steps: ['5 groups of nothing = 0'], answer: 0 },
        { problem: '0 × 8', steps: ['0 groups of 8 = 0'], answer: 0 },
      ],
    },
    practiceQuestions: [],
    completed: false,
  },
  {
    id: 'lesson-one',
    title: 'Multiplying by One',
    description: 'The identity property',
    table: 1,
    content: {
      explanation: 'When you multiply any number by 1, you get the same number back!',
      visualExamples: [],
      strategies: ['Any number × 1 = that number', '1 × any number = that number'],
      workedExamples: [
        { problem: '7 × 1', steps: ['7 groups of 1 = 7'], answer: 7 },
        { problem: '1 × 9', steps: ['1 group of 9 = 9'], answer: 9 },
      ],
    },
    practiceQuestions: [],
    completed: false,
  },
  {
    id: 'lesson-two',
    title: 'Multiplying by Two',
    description: 'Doubling numbers',
    table: 2,
    content: {
      explanation: 'Multiplying by 2 means doubling. It\'s the same as adding a number to itself!',
      visualExamples: [],
      strategies: ['Multiplying by 2 is the same as doubling', 'Count by 2s: 2, 4, 6, 8, 10...'],
      workedExamples: [
        { problem: '2 × 5', steps: ['5 + 5 = 10'], answer: 10 },
        { problem: '6 × 2', steps: ['6 + 6 = 12'], answer: 12 },
      ],
    },
    practiceQuestions: [],
    completed: false,
  },
  {
    id: 'lesson-five',
    title: 'Multiplying by Five',
    description: 'The fives pattern',
    table: 5,
    content: {
      explanation: 'When you multiply by 5, the answers always end in 5 or 0. There\'s a pattern!',
      visualExamples: [],
      strategies: ['Count by 5s: 5, 10, 15, 20, 25, 30...', 'Answers end in 5 or 0'],
      workedExamples: [
        { problem: '5 × 3', steps: ['5 + 5 + 5 = 15'], answer: 15 },
        { problem: '5 × 6', steps: ['Count by 5s six times: 5, 10, 15, 20, 25, 30'], answer: 30 },
      ],
    },
    practiceQuestions: [],
    completed: false,
  },
  {
    id: 'lesson-ten',
    title: 'Multiplying by Ten',
    description: 'The power of ten',
    table: 10,
    content: {
      explanation: 'Multiplying by 10 is easy! Just add a zero to the end of the number.',
      visualExamples: [],
      strategies: ['Add a zero to multiply by 10', '3 × 10 = 30', '7 × 10 = 70'],
      workedExamples: [
        { problem: '4 × 10', steps: ['Add a zero to 4 = 40'], answer: 40 },
        { problem: '10 × 8', steps: ['Add a zero to 8 = 80'], answer: 80 },
      ],
    },
    practiceQuestions: [],
    completed: false,
  },
];
