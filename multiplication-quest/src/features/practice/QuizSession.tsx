import { useState } from 'react';
import { Question, QuestionAttempt } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { validateAnswer, getExplanation, getHint } from '../../domain/math/answerValidation';

interface QuizSessionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (attempt: QuestionAttempt) => void;
  showHints: boolean;
}

export default function QuizSession({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showHints,
}: QuizSessionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHintText, setShowHintText] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = validateAnswer(question, selectedAnswer);

    const attempt: QuestionAttempt = {
      questionId: question.id,
      question,
      userAnswer: selectedAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
    };

    setSubmitted(true);
    onAnswer(attempt);
  };

  const isCorrect = submitted && selectedAnswer === question.correctAnswer;
  const isIncorrect = submitted && selectedAnswer !== question.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-600">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="h-2 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary mb-2">{question.questionText}</h2>
          {question.type === 'word-problem' && (
            <p className="text-gray-600">Read carefully and find the answer!</p>
          )}
        </div>

        {question.answerType === 'multiple-choice' && question.choices && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {question.choices.map((choice) => (
              <button
                key={choice}
                onClick={() => !submitted && setSelectedAnswer(choice)}
                disabled={submitted}
                className={`p-6 rounded-lg font-bold text-2xl transition-all ${
                  selectedAnswer === choice
                    ? submitted
                      ? choice === question.correctAnswer
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-primary text-white scale-105'
                    : submitted && choice === question.correctAnswer
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        {!submitted && showHints && (
          <div className="mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowHintText(!showHintText)}
            >
              {showHintText ? '🙈 Hide Hint' : '💡 Show Hint'}
            </Button>
            {showHintText && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm">{getHint(question)}</p>
              </div>
            )}
          </div>
        )}

        {submitted && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
              <span className="font-bold text-lg">
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </span>
            </div>
            <p className="text-gray-700">{getExplanation(question)}</p>
          </div>
        )}

        {!submitted && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
