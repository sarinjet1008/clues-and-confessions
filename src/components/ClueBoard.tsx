import React from 'react';
import { FileText, Calendar, User } from 'lucide-react';

interface Clue {
  id: string;
  suspect: string;
  day: number;
  content: string;
  discovered: boolean;
}

interface ClueBoardProps {
  clues: Clue[];
  currentDay: number;
}

export const ClueBoard: React.FC<ClueBoardProps> = ({ clues, currentDay }) => {
  const discoveredClues = clues.filter(clue => clue.discovered);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-bold text-gray-900">Evidence Board</h2>
      </div>

      {discoveredClues.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No clues discovered yet</p>
          <p className="text-sm">Select your top suspects at the end of each day to unlock clues</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discoveredClues.map((clue) => (
            <div key={clue.id} className="border border-amber-200 rounded-lg p-4 bg-amber-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-800 capitalize">{clue.suspect}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-amber-600">
                  <Calendar className="w-4 h-4" />
                  <span>Day {clue.day}</span>
                </div>
              </div>
              <p className="text-gray-700">{clue.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};