import { Lesson } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: () => void;
  onBack: () => void;
}

export default function LessonView({ lesson, onComplete, onBack }: LessonViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          ← Back to Lessons
        </Button>
        <Button onClick={onComplete} variant="success">
          Mark as Complete ✓
        </Button>
      </div>

      <Card>
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-gray-600 text-lg">{lesson.description}</p>
      </Card>

      {/* Explanation */}
      <Card>
        <h2 className="text-2xl font-bold mb-3">📖 Explanation</h2>
        <p className="text-lg leading-relaxed">{lesson.content.explanation}</p>
      </Card>

      {/* Strategies */}
      {lesson.content.strategies.length > 0 && (
        <Card>
          <h2 className="text-2xl font-bold mb-3">💡 Key Strategies</h2>
          <ul className="space-y-2">
            {lesson.content.strategies.map((strategy, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-lg">{strategy}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Worked Examples */}
      {lesson.content.workedExamples.length > 0 && (
        <Card>
          <h2 className="text-2xl font-bold mb-4">📝 Worked Examples</h2>
          <div className="space-y-4">
            {lesson.content.workedExamples.map((example, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <div className="font-bold text-xl text-primary mb-2">
                  Problem: {example.problem}
                </div>
                <div className="space-y-1">
                  {example.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="text-gray-700">
                      Step {stepIndex + 1}: {step}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xl font-bold text-green-600">
                  Answer: {example.answer}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Practice Problems */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50">
        <h2 className="text-2xl font-bold mb-3">✏️ Practice</h2>
        <p className="text-gray-700 mb-4">
          Ready to practice? Head to the Practice Quiz to test what you've learned!
        </p>
        <Button variant="primary">Go to Practice Quiz →</Button>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onComplete} variant="success" size="lg">
          I've completed this lesson! ✓
        </Button>
      </div>
    </div>
  );
}
