import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface PracticeSettingsProps {
  onStart: (questionCount: number, tables: number[]) => void;
}

export default function PracticeSettings({ onStart }: PracticeSettingsProps) {
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);

  const toggleTable = (table: number) => {
    if (selectedTables.includes(table)) {
      setSelectedTables(selectedTables.filter((t) => t !== table));
    } else {
      setSelectedTables([...selectedTables, table]);
    }
  };

  const selectAll = () => {
    setSelectedTables([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  };

  const clearAll = () => {
    setSelectedTables([]);
  };

  const handleStart = () => {
    const tables = selectedTables.length > 0 ? selectedTables : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    onStart(questionCount, tables);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <h1 className="text-3xl font-bold mb-2">Practice Quiz</h1>
        <p className="text-gray-600">
          Choose your settings and start practicing!
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Number of Questions</h2>
        <div className="flex gap-3">
          {[5, 10, 20].map((count) => (
            <button
              key={count}
              onClick={() => setQuestionCount(count)}
              className={`flex-1 py-4 rounded-lg font-bold text-lg transition-all ${
                questionCount === count
                  ? 'bg-primary text-white scale-105'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {count} Questions
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Select Tables</h2>
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={selectAll}>
              Select All
            </Button>
            <Button size="sm" variant="outline" onClick={clearAll}>
              Clear
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((table) => (
            <button
              key={table}
              onClick={() => toggleTable(table)}
              className={`aspect-square rounded-lg font-bold text-2xl transition-all ${
                selectedTables.includes(table)
                  ? 'bg-primary text-white scale-105'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {table}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3">
          {selectedTables.length === 0
            ? 'No tables selected (all tables will be used)'
            : `Selected: ${selectedTables.sort((a, b) => a - b).join(', ')}`}
        </p>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" onClick={handleStart}>
          Start Practice! 🚀
        </Button>
      </div>
    </div>
  );
}
