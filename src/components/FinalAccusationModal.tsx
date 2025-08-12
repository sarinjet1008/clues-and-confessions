import React, { useState } from 'react';
import { Gavel, AlertTriangle } from 'lucide-react';
import { Suspect } from '../types/game';

interface FinalAccusationModalProps {
  suspects: Suspect[];
  onAccuse: (suspectName: string) => void;
  onClose: () => void;
}

export const FinalAccusationModal: React.FC<FinalAccusationModalProps> = ({
  suspects,
  onAccuse,
  onClose
}) => {
  const [selectedSuspect, setSelectedSuspect] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAccuse = () => {
    if (selectedSuspect) {
      onAccuse(selectedSuspect);
      onClose();
    }
  };

  const selectedSuspectData = suspects.find(s => s.name === selectedSuspect);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center space-x-3">
            <Gavel className="w-8 h-8 text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Final Accusation</h2>
              <p className="text-gray-600">Choose who you believe committed the murder</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!showConfirmation ? (
            <>
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">This decision is final!</span>
                </div>
                <p className="text-gray-600">
                  Based on your investigation over the past 3 days, select the person you believe is guilty of the murder.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {suspects.map((suspect) => (
                  <div
                    key={suspect.name}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all duration-200
                      ${selectedSuspect === suspect.name
                        ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setSelectedSuspect(suspect.name)}
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
                        <p className="text-xs text-gray-500">{suspect.relationship}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  disabled={!selectedSuspect}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Make Accusation
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={selectedSuspectData?.avatar}
                    alt={selectedSuspectData?.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Are you sure you want to accuse {selectedSuspectData?.displayName}?
                </h3>
                <p className="text-gray-600">
                  This will end the game and reveal whether your accusation was correct.
                </p>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleAccuse}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirm Accusation
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};