import React from 'react';
import { Play, Anchor, Users, Search, FileText } from 'lucide-react';

interface GameIntroProps {
  onStartGame: () => void;
}

export const GameIntro: React.FC<GameIntroProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <Anchor className="w-16 h-16 mx-auto mb-6 text-blue-300" />
            <h1 className="text-5xl font-bold font-serif mb-4">Yacht Murder</h1>
            <p className="text-xl text-blue-200">Detective Mode</p>
          </div>

          {/* Story */}
          <div className="bg-black/20 rounded-2xl p-8 mb-12 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">The Case</h2>
            <p className="text-lg leading-relaxed text-gray-200">
              The body of Luca Stone, a 26-year-old celebrity influencer, was discovered shortly after midnight aboard a luxury yacht anchored in open waters during a high-profile celebration. He was found slumped in a lifeboat on the sun deck, with visible bruising to the head and ligature marks around his neck. Preliminary forensic analysis indicates he was drugged, then bludgeoned with a camera, and finally strangled with a camera strap—suggesting a staged overdose followed by a deliberate, personal killing. Time of death is estimated between 11:55 PM and 12:05 AM. The yacht had 7 other guests aboard, all now suspects.
            </p>
          </div>

          {/* How to Play */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <h3 className="text-xl font-bold mb-3">Interrogate Suspects</h3>
              <p className="text-gray-300">
                Question each of the 7 suspects. Each has unique personalities and will respond 
                based on their backstory and relationship to the victim.
              </p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <Search className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <h3 className="text-xl font-bold mb-3">Gather Evidence</h3>
              <p className="text-gray-300">
                At the end of each day, select your top 3 suspects to unlock new clues 
                that will help guide your investigation.
              </p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <FileText className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <h3 className="text-xl font-bold mb-3">Solve the Case</h3>
              <p className="text-gray-300">
                After 3 days of investigation, make your final accusation. 
                Choose wisely - you only get one chance to name the killer.
              </p>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStartGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto"
          >
            <Play className="w-6 h-6" />
            <span>Begin Investigation</span>
          </button>
        </div>
      </div>
    </div>
  );
};