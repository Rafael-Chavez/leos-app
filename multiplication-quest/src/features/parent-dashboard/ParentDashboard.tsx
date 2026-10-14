import { StorageSchema } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getMasteryStatistics, getWeakestFacts } from '../../domain/mastery/masteryEngine';
import { resetData } from '../../services/persistence/storage';

interface ParentDashboardProps {
  data: StorageSchema;
  onUpdateData: (updates: Partial<StorageSchema>) => void;
  onNavigate: (view: string) => void;
}

export default function ParentDashboard({ data, onUpdateData, onNavigate }: ParentDashboardProps) {
  const stats = getMasteryStatistics(data.factProgress);
  const weakestFacts = getWeakestFacts(data.factProgress, 10);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-gray-600">
          View detailed analytics and manage settings
        </p>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{stats.totalAttempts}</div>
            <div className="text-gray-600">Total Questions</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{Math.round(stats.overallAccuracy)}%</div>
            <div className="text-gray-600">Overall Accuracy</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{stats.byStatus.mastered}</div>
            <div className="text-gray-600">Facts Mastered</div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Mastery by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold text-gray-600">{stats.byStatus.new}</div>
            <div className="text-sm text-gray-600">New</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats.byStatus.learning}</div>
            <div className="text-sm text-gray-600">Learning</div>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.byStatus.practicing}</div>
            <div className="text-sm text-gray-600">Practicing</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.byStatus.mastered}</div>
            <div className="text-sm text-gray-600">Mastered</div>
          </div>
        </div>
      </Card>

      {weakestFacts.length > 0 && (
        <Card>
          <h2 className="text-2xl font-bold mb-4">Facts Needing Practice</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {weakestFacts.map((fact) => (
              <div
                key={fact.normalizedKey}
                className="bg-red-50 p-3 rounded text-center border border-red-200"
              >
                <div className="font-bold">{fact.normalizedKey.replace('x', ' × ')}</div>
                <div className="text-sm text-gray-600">
                  {fact.attempts > 0
                    ? `${Math.round((fact.correctAttempts / fact.attempts) * 100)}%`
                    : 'Not practiced'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Student Name</label>
            <input
              type="text"
              value={data.student.displayName}
              onChange={(e) =>
                onUpdateData({
                  student: { ...data.student, displayName: e.target.value },
                })
              }
              className="input-field w-full max-w-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Daily Goal (questions)</label>
            <input
              type="number"
              value={data.student.dailyGoal}
              onChange={(e) =>
                onUpdateData({
                  student: { ...data.student, dailyGoal: parseInt(e.target.value) },
                })
              }
              className="input-field w-32"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.settings.hintsEnabled}
                onChange={(e) =>
                  onUpdateData({
                    settings: { ...data.settings, hintsEnabled: e.target.checked },
                  })
                }
                className="w-5 h-5"
              />
              <span className="font-medium">Enable Hints</span>
            </label>
          </div>
        </div>
      </Card>

      <Card className="bg-red-50 border-2 border-red-200">
        <h2 className="text-2xl font-bold mb-2 text-red-700">Danger Zone</h2>
        <p className="text-gray-700 mb-4">
          Reset all progress and start over. This action cannot be undone.
        </p>
        <Button variant="danger" onClick={handleReset}>
          Reset All Progress
        </Button>
      </Card>
    </div>
  );
}
