import { StorageSchema } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ADVENTURE_AREAS } from '../../data/adventureWorld';

interface AdventureProps {
  data: StorageSchema;
  onUpdateData: (updates: Partial<StorageSchema>) => void;
  onNavigate: (view: string) => void;
}

export default function Adventure({ data, onUpdateData, onNavigate }: AdventureProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🎮 Multiplication Quest</h1>
          <p className="text-xl opacity-90">
            Embark on an adventure through the Kingdom of Numbers!
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
            <div className="text-3xl font-bold">{data.gameProgress.totalStars}</div>
            <div className="text-sm">Stars</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
            <div className="text-3xl font-bold">{data.gameProgress.completedChallenges.length}</div>
            <div className="text-sm">Challenges</div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADVENTURE_AREAS.map((area) => {
          const isUnlocked = data.gameProgress.unlockedAreas.includes(area.id);

          return (
            <Card
              key={area.id}
              className={!isUnlocked ? 'opacity-50' : ''}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xl mb-1">{area.name}</h3>
                    <p className="text-sm text-gray-600">{area.description}</p>
                  </div>
                  {isUnlocked ? <div className="text-2xl">🔓</div> : <div className="text-2xl">🔒</div>}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(area.maxStars)].map((_, i) => (
                      <span key={i} className={i < area.stars ? 'text-yellow-400' : 'text-gray-300'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {area.stars}/{area.maxStars}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={isUnlocked ? 'primary' : 'outline'}
                  disabled={!isUnlocked}
                  className="w-full"
                >
                  {isUnlocked ? 'Enter Area' : 'Locked'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-golden-light to-golden">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">🎯 Quick Quest</h2>
          <p className="text-gray-700 mb-4">
            Answer 10 questions to earn coins and experience!
          </p>
          <Button onClick={() => onNavigate('practice')}>
            Start Quick Quest
          </Button>
        </div>
      </Card>

      <Card className="bg-blue-50">
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            Full adventure mode coming soon! Practice your multiplication to prepare for epic quests.
          </p>
          <Button onClick={() => onNavigate('practice')}>
            Practice Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
