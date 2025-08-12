import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Suspect } from '../types/game';

interface DayEndModalProps {
  day: number;
  suspects: Suspect[];
  onSubmitSuspects: (selectedSuspects: string[]) => void;
  onClose: () => void;
}

export const DayEndModal: React.FC<DayEndModalProps> = ({
  day,
  suspects,
  onSubmitSuspects,
  onClose
}) => {
  const [selectedSuspects, setSelectedSuspects] = useState<string[]>([]);

  const handleSuspectToggle = (suspectName: string) => {
    setSelectedSuspects(prev => {
      if (prev.includes(suspectName)) {
        return prev.filter(name => name !== suspectName);
      } else if (prev.length < 3) {
        return [...prev, suspectName];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (selectedSuspects.length === 3) {
      onSubmitSuspects(selectedSuspects);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">End of Day {day}</h2>
          <p className="text-gray-600 mt-2">
            Select your top 3 suspects based on today's interrogations. This will unlock new clues for tomorrow.
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suspects.map((suspect) => (
              <div
                key={suspect.name}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-all duration-200
                  ${selectedSuspects.includes(suspect.name)
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => handleSuspectToggle(suspect.name)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={suspect.avatar}
                    alt={suspect.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{suspect.displayName}</h3>
                    <p className="text-sm text-gray-600">{suspect.occupation}</p>
                  </div>
                  {selectedSuspects.includes(suspect.name) && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span>Selected: {selectedSuspects.length}/3</span>
            </div>
            
            <div className="space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedSuspects.length !== 3}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue to Day {day + 1}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};