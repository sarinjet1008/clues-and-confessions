import React from 'react';
import { Anchor, Calendar, Clock } from 'lucide-react';

interface GameHeaderProps {
  day: number;
  phase: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ day, phase }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Anchor className="w-8 h-8 text-blue-300" />
            <div>
              <h1 className="text-2xl font-bold font-serif">Yacht Murder</h1>
              <p className="text-blue-200 text-sm">Detective Mode</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-blue-800/30 px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-300" />
              <span className="font-medium">Day {day}</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-slate-300" />
              <span className="text-sm capitalize">{phase.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};