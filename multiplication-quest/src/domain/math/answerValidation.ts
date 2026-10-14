import { Question } from '../../types';

/**
 * Validate a typed answer (handles various input formats)
 */
export function validateTypedAnswer(userInput: string, correctAnswer: number): boolean {
  // Handle empty input
  if (!userInput || userInput.trim() === '') {
    return false;
  }

  // Parse the input
  const parsed = parseInt(userInput.trim(), 10);

  // Check if it's a valid number
  if (isNaN(parsed)) {
    return false;
  }

  return parsed === correctAnswer;
}

/**
 * Validate a multiple choice answer
 */
export function validateMultipleChoiceAnswer(selectedChoice: number, correctAnswer: number): boolean {
  return selectedChoice === correctAnswer;
}

/**
 * Validate any question answer
 */
export function validateAnswer(question: Question, userAnswer: number | string): boolean {
  const correctAnswer = question.correctAnswer;

  if (question.answerType === 'multiple-choice') {
    return validateMultipleChoiceAnswer(Number(userAnswer), correctAnswer);
  } else {
    return validateTypedAnswer(String(userAnswer), correctAnswer);
  }
}

/**
 * Get explanation for incorrect answer
 */
export function getExplanation(question: Question): string {
  const { factor1, factor2, correctAnswer, type } = question;

  if (type === 'word-problem') {
    return `The answer is ${correctAnswer}. ${factor1} × ${factor2} = ${correctAnswer}`;
  }

  if (type === 'missing-factor') {
    const explanations = [];

    if (question.missingPosition === 'factor1') {
      explanations.push(`We need to find what times ${factor2} equals ${correctAnswer}.`);
      explanations.push(`${factor1} × ${factor2} = ${correctAnswer}`);
    } else if (question.missingPosition === 'factor2') {
      explanations.push(`We need to find what times ${factor1} equals ${correctAnswer}.`);
      explanations.push(`${factor1} × ${factor2} = ${correctAnswer}`);
    } else {
      explanations.push(`${factor1} × ${factor2} = ${correctAnswer}`);
    }

    // Add visual explanation
    if (factor2 <= 10 && factor2 > 0) {
      const groups = Array(factor2).fill(factor1);
      explanations.push(`Think of it as ${factor2} groups of ${factor1}: ${groups.join(' + ')} = ${correctAnswer}`);
    }

    return explanations.join(' ');
  }

  // Direct multiplication
  const explanations = [
    `${factor1} × ${factor2} = ${correctAnswer}`
  ];

  // Add visual explanation for smaller numbers
  if (factor2 <= 10 && factor2 > 0 && factor1 !== 0) {
    const groups = Array(factor2).fill(factor1);
    explanations.push(`Think of it as ${factor2} groups of ${factor1}: ${groups.join(' + ')} = ${correctAnswer}`);
  }

  // Add special patterns
  if (factor1 === 0 || factor2 === 0) {
    explanations.push('Any number times zero equals zero.');
  } else if (factor1 === 1) {
    explanations.push(`One times any number equals that number.`);
  } else if (factor2 === 1) {
    explanations.push(`Any number times one equals that number.`);
  } else if (factor1 === 10) {
    explanations.push(`To multiply by 10, add a zero to the other number.`);
  } else if (factor2 === 10) {
    explanations.push(`To multiply by 10, add a zero to the other number.`);
  }

  return explanations.join(' ');
}

/**
 * Get a hint for a question
 */
export function getHint(question: Question): string {
  const { factor1, factor2, type } = question;

  if (type === 'word-problem') {
    return `Look for the two numbers being multiplied: ${factor1} × ${factor2}`;
  }

  if (type === 'missing-factor') {
    if (question.missingPosition === 'factor1') {
      return `Think: What number times ${factor2} equals ${question.correctAnswer}?`;
    } else if (question.missingPosition === 'factor2') {
      return `Think: What number times ${factor1} equals ${question.correctAnswer}?`;
    }
  }

  // Direct multiplication hints
  const hints = [];

  if (factor1 === 0 || factor2 === 0) {
    hints.push('Remember: Any number times zero equals zero.');
  } else if (factor1 === 1 || factor2 === 1) {
    hints.push('Remember: Any number times one equals that number.');
  } else if (factor1 === 2) {
    hints.push(`Double ${factor2} (add ${factor2} + ${factor2})`);
  } else if (factor2 === 2) {
    hints.push(`Double ${factor1} (add ${factor1} + ${factor1})`);
  } else if (factor1 === 5) {
    hints.push(`Count by 5s: ${factor2} times`);
  } else if (factor2 === 5) {
    hints.push(`Count by 5s: ${factor1} times`);
  } else if (factor1 === 10) {
    hints.push(`Multiply by 10: add a zero to ${factor2}`);
  } else if (factor2 === 10) {
    hints.push(`Multiply by 10: add a zero to ${factor1}`);
  } else {
    // Generic hint
    hints.push(`Think of ${factor1} groups of ${factor2}`);
  }

  return hints[0];
}
