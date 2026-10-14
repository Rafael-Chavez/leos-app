import { useState } from 'react';
import { StorageSchema, Question, QuestionAttempt } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PracticeSettings from './PracticeSettings';
import QuizSession from './QuizSession';
import { generateQuestionsForTables } from '../../domain/questions/questionGenerator';
import { updateFactProgress } from '../../domain/mastery/masteryEngine';

interface PracticeProps {
  data: StorageSchema;
  onUpdateData: (updates: Partial<StorageSchema>) => void;
  onNavigate: (view: string) => void;
}

export default function Practice({ data, onUpdateData, onNavigate }: PracticeProps) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);

  const startPractice = (questionCount: number, tables: number[]) => {
    const newQuestions = generateQuestionsForTables(
      tables,
      questionCount,
      ['direct', 'missing-factor'],
      'multiple-choice'
    );
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setAttempts([]);
  };

  const handleAnswer = (attempt: QuestionAttempt) => {
    setAttempts([...attempts, attempt]);

    // Update fact progress
    const question = attempt.question;
    const factProgress = data.factProgress[question.normalizedKey];

    if (factProgress) {
      const updated = updateFactProgress(factProgress, attempt.isCorrect);

      onUpdateData({
        factProgress: {
          ...data.factProgress,
          [question.normalizedKey]: updated,
        },
        student: {
          ...data.student,
          experiencePoints: data.student.experiencePoints + (attempt.isCorrect ? 10 : 2),
          coins: data.student.coins + (attempt.isCorrect ? 5 : 1),
        },
      });
    }

    // Move to next question
    if (currentQuestionIndex < questions!.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1500);
    }
  };

  const finishPractice = () => {
    setQuestions(null);
    setCurrentQuestionIndex(0);
    setAttempts([]);
  };

  if (!questions) {
    return <PracticeSettings onStart={startPractice} />;
  }

  if (currentQuestionIndex >= questions.length) {
    const correct = attempts.filter((a) => a.isCorrect).length;
    const percentage = (correct / attempts.length) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h1 className="text-4xl font-bold">Practice Complete!</h1>
            <div className="text-6xl font-bold text-primary">{Math.round(percentage)}%</div>
            <p className="text-xl text-gray-600">
              You got {correct} out of {attempts.length} questions correct!
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {attempts.map((attempt, index) => (
              <div
                key={index}
                className={`p-3 rounded ${
                  attempt.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{attempt.question.questionText}</span>
                  <span className="font-bold">
                    {attempt.isCorrect ? '✓' : '✗'} {attempt.question.correctAnswer}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <Button onClick={finishPractice} variant="primary">
              Practice Again
            </Button>
            <Button onClick={() => onNavigate('dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <QuizSession
      question={questions[currentQuestionIndex]}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      onAnswer={handleAnswer}
      showHints={data.settings.hintsEnabled}
    />
  );
}
