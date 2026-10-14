import { useState } from 'react';
import Card from '../../components/ui/Card';
import { generateAllFacts } from '../../data/multiplicationFacts';

export default function MultiplicationTable() {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(true);

  const facts = generateAllFacts();

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Multiplication Table (0-10)</h1>
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="btn-outline"
        >
          {showAnswers ? '🙈 Hide Answers' : '👁️ Show Answers'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-2 border-gray-300 p-3 bg-gray-100 font-bold">×</th>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <th key={num} className="border-2 border-gray-300 p-3 bg-primary text-white font-bold">
                  {num}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
              <tr key={row}>
                <th className="border-2 border-gray-300 p-3 bg-primary text-white font-bold">
                  {row}
                </th>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => {
                  const fact = facts.find((f) => f.factor1 === row && f.factor2 === col);
                  const cellKey = `${row}x${col}`;
                  const isSelected = selectedCell === cellKey;

                  return (
                    <td
                      key={col}
                      onClick={() => setSelectedCell(cellKey)}
                      className={`border-2 border-gray-300 p-3 text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-yellow-200 font-bold scale-110'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {showAnswers || isSelected ? fact?.product : '?'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCell && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-center">
            {selectedCell.replace('x', ' × ')} = {
              facts.find((f) => `${f.factor1}x${f.factor2}` === selectedCell)?.product
            }
          </div>
        </div>
      )}
    </Card>
  );
}
