import { StorageSchema } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { getMasteryStatistics } from '../../domain/mastery/masteryEngine';
import { getRecommendedTables } from '../../domain/mastery/adaptiveSelection';

interface DashboardProps {
  data: StorageSchema;
  onNavigate: (view: string) => void;
  onUpdateData: (updates: Partial<StorageSchema>) => void;
}

export default function Dashboard({ data, onNavigate, onUpdateData }: DashboardProps) {
  const stats = getMasteryStatistics(data.factProgress);
  const recommendedTables = getRecommendedTables(data.factProgress, 1);
  const masteryPercentage = (stats.byStatus.mastered / stats.totalFacts) * 100;

  // Calculate level progress
  const levelProgress = (data.student.experiencePoints % 100) / 100 * 100;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-primary to-purple-magic text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {data.student.displayName}!
            </h1>
            <p className="text-xl opacity-90">
              You've mastered {stats.byStatus.mastered} of {stats.totalFacts} multiplication facts!
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur">
              <div className="text-3xl font-bold">{data.student.level}</div>
              <div className="text-sm">Level</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur">
              <div className="text-3xl font-bold">{data.student.coins}</div>
              <div className="text-sm">Coins</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur">
              <div className="text-3xl font-bold">{data.student.currentStreak}</div>
              <div className="text-sm">Day Streak</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
          <ProgressBar
            value={masteryPercentage}
            label="Facts Mastered"
            showPercentage
            color="success"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded">
              <div className="text-2xl font-bold text-green-600">{stats.byStatus.mastered}</div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-2xl font-bold text-blue-600">{stats.byStatus.practicing}</div>
              <div className="text-sm text-gray-600">Practicing</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <div className="text-2xl font-bold text-yellow-600">{stats.byStatus.learning}</div>
              <div className="text-sm text-gray-600">Learning</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-2xl font-bold text-gray-600">{stats.byStatus.new}</div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Level Progress</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-primary">Level {data.student.level}</div>
            <div className="text-gray-600">→</div>
            <div className="text-4xl font-bold text-gray-400">Level {data.student.level + 1}</div>
          </div>
          <ProgressBar
            value={levelProgress}
            label={`${data.student.experiencePoints} XP`}
            showPercentage
          />
          <div className="mt-4">
            <h3 className="font-bold mb-2">Daily Goal</h3>
            <ProgressBar
              value={stats.totalAttempts % data.student.dailyGoal}
              max={data.student.dailyGoal}
              label={`${stats.totalAttempts % data.student.dailyGoal} / ${data.student.dailyGoal} questions today`}
              showPercentage
              color="warning"
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">What would you like to do?</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('study')}
            className="card-hover text-left"
          >
            <div className="text-4xl mb-2">📚</div>
            <h3 className="font-bold text-lg">Study Guide</h3>
            <p className="text-sm text-gray-600">Learn multiplication facts step by step</p>
          </button>

          <button
            onClick={() => onNavigate('practice')}
            className="card-hover text-left"
          >
            <div className="text-4xl mb-2">✏️</div>
            <h3 className="font-bold text-lg">Practice Quiz</h3>
            <p className="text-sm text-gray-600">Practice with adaptive questions</p>
          </button>

          <button
            onClick={() => onNavigate('test')}
            className="card-hover text-left"
          >
            <div className="text-4xl mb-2">📝</div>
            <h3 className="font-bold text-lg">Take a Test</h3>
            <p className="text-sm text-gray-600">Measure your mastery</p>
          </button>

          <button
            onClick={() => onNavigate('adventure')}
            className="card-hover text-left bg-gradient-to-br from-golden-light to-golden"
          >
            <div className="text-4xl mb-2">🎮</div>
            <h3 className="font-bold text-lg">Adventure!</h3>
            <p className="text-sm text-gray-600">Play Multiplication Quest</p>
          </button>
        </div>
      </Card>

      {/* Recommendation */}
      {recommendedTables.length > 0 && (
        <Card className="bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Recommended Practice</h3>
              <p className="text-gray-700">
                Try practicing your {recommendedTables[0]}s table today! You're making good progress.
              </p>
              <Button
                variant="primary"
                className="mt-3"
                onClick={() => onNavigate('practice')}
              >
                Start Practice
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      {data.assessments.length > 0 && (
        <Card>
          <h2 className="text-2xl font-bold mb-4">Recent Tests</h2>
          <div className="space-y-3">
            {data.assessments.slice(-3).reverse().map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <div className="font-medium">{assessment.questionCount} Questions</div>
                  <div className="text-sm text-gray-600">
                    {new Date(assessment.completedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">{Math.round(assessment.score)}%</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
