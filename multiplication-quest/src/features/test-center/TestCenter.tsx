import { StorageSchema } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface TestCenterProps {
  data: StorageSchema;
  onUpdateData: (updates: Partial<StorageSchema>) => void;
  onNavigate: (view: string) => void;
}

export default function TestCenter({ data, onUpdateData, onNavigate }: TestCenterProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <h1 className="text-3xl font-bold mb-2">Test Center</h1>
        <p className="text-gray-600">
          Take a formal test to measure your mastery of multiplication facts
        </p>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card hover>
          <div className="text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-bold text-lg mb-2">Quick Test</h3>
            <p className="text-sm text-gray-600 mb-4">10 questions</p>
            <Button size="sm">Start</Button>
          </div>
        </Card>

        <Card hover>
          <div className="text-center">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-bold text-lg mb-2">Standard Test</h3>
            <p className="text-sm text-gray-600 mb-4">25 questions</p>
            <Button size="sm">Start</Button>
          </div>
        </Card>

        <Card hover>
          <div className="text-center">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-bold text-lg mb-2">Full Test</h3>
            <p className="text-sm text-gray-600 mb-4">50 questions</p>
            <Button size="sm">Start</Button>
          </div>
        </Card>
      </div>

      {data.assessments.length > 0 && (
        <Card>
          <h2 className="text-2xl font-bold mb-4">Test History</h2>
          <div className="space-y-3">
            {data.assessments.slice(-5).reverse().map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-bold">{assessment.questionCount} Questions</div>
                  <div className="text-sm text-gray-600">
                    {new Date(assessment.completedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary">{Math.round(assessment.score)}%</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="bg-blue-50">
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            Tests are coming soon! For now, use Practice mode to improve your skills.
          </p>
          <Button onClick={() => onNavigate('practice')}>
            Go to Practice
          </Button>
        </div>
      </Card>
    </div>
  );
}
