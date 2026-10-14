import { useState } from 'react';
import { StorageSchema } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { LESSONS } from '../../data/lessons';
import LessonView from './LessonView';
import MultiplicationTable from './MultiplicationTable';

interface StudyGuideProps {
  data: StorageSchema;
  onUpdateData: (updates: Partial<StorageSchema>) => void;
  onNavigate: (view: string) => void;
}

export default function StudyGuide({ data, onUpdateData, onNavigate }: StudyGuideProps) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);

  if (showTable) {
    return (
      <div>
        <Button onClick={() => setShowTable(false)} className="mb-4">
          ← Back to Lessons
        </Button>
        <MultiplicationTable />
      </div>
    );
  }

  if (selectedLesson) {
    const lesson = LESSONS.find((l) => l.id === selectedLesson);
    if (!lesson) {
      setSelectedLesson(null);
      return null;
    }

    return (
      <LessonView
        lesson={lesson}
        onComplete={() => {
          // Mark lesson as completed
          onUpdateData({
            lessons: {
              ...data.lessons,
              [lesson.id]: {
                completed: true,
                lastAccessedAt: new Date().toISOString(),
              },
            },
          });
          setSelectedLesson(null);
        }}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold mb-2">Study Guide</h1>
        <p className="text-gray-600 mb-4">
          Learn multiplication step by step with interactive lessons and examples
        </p>
        <Button onClick={() => setShowTable(true)} variant="outline">
          📊 View Multiplication Table
        </Button>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LESSONS.map((lesson, index) => {
          const isCompleted = data.lessons[lesson.id]?.completed || false;

          return (
            <Card
              key={lesson.id}
              hover
              onClick={() => setSelectedLesson(lesson.id)}
              className={isCompleted ? 'border-2 border-green-400' : ''}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Lesson {index + 1}</div>
                  <h3 className="font-bold text-lg mb-2">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                </div>
                {isCompleted && (
                  <div className="text-2xl">✅</div>
                )}
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant={isCompleted ? 'secondary' : 'primary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLesson(lesson.id);
                  }}
                >
                  {isCompleted ? 'Review' : 'Start Lesson'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
