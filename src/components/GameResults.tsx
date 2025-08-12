import React from 'react';
import { CheckCircle, XCircle, Gavel, Users, FileText, Calendar } from 'lucide-react';
import { Suspect, GameState } from '../types/game';

interface GameResultsProps {
  accusedSuspect: string;
  gameState: GameState;
  suspects: Suspect[];
  onPlayAgain: () => void;
}

const KILLER = 'evelyn'; // Evelyn Stone is the killer

export const GameResults: React.FC<GameResultsProps> = ({
  accusedSuspect,
  gameState,
  suspects,
  onPlayAgain
}) => {
  const isCorrect = accusedSuspect.toLowerCase() === KILLER;
  const killerData = suspects.find(s => s.name === KILLER);
  const accusedData = suspects.find(s => s.name === accusedSuspect.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isCorrect ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {isCorrect ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : (
                <XCircle className="w-12 h-12 text-white" />
              )}
            </div>
            
            <h1 className="text-4xl font-bold font-serif mb-4">
              {isCorrect ? 'Case Solved!' : 'Case Unsolved'}
            </h1>
            
            <p className="text-xl text-blue-200">
              {isCorrect 
                ? 'Congratulations! You correctly identified the killer.'
                : 'The killer has escaped justice... for now.'
              }
            </p>
          </div>

          {/* Accusation Result */}
          <div className="bg-black/20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Gavel className="w-6 h-6 text-blue-300" />
              <h2 className="text-2xl font-bold">Your Accusation</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-blue-200">You Accused:</h3>
                <div className="bg-white/10 rounded-xl p-6">
                  <img
                    src={accusedData?.avatar}
                    alt={accusedData?.displayName}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h4 className="text-xl font-bold">{accusedData?.displayName}</h4>
                  <p className="text-blue-200">{accusedData?.occupation}</p>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-blue-200">The Real Killer:</h3>
                <div className="bg-red-900/30 rounded-xl p-6 border border-red-500/30">
                  <img
                    src={killerData?.avatar}
                    alt={killerData?.displayName}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h4 className="text-xl font-bold">{killerData?.displayName}</h4>
                  <p className="text-red-200">{killerData?.occupation}</p>
                  <p className="text-sm text-red-300 mt-2">{killerData?.relationship}</p>
                </div>
              </div>
            </div>
          </div>

          {/* The Truth Revealed */}
          <div className="bg-black/20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">The Truth Revealed</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed mb-4">
                <strong>Evelyn Stone</strong> orchestrated her son's murder in a twisted act of control and manipulation. 
                As Luca's manager and mother, she had been losing her grip on his career and personal life as he sought independence.
              </p>
              
              <p className="text-lg leading-relaxed mb-4">
                The murder was carefully planned to look like a crime of passion, but Evelyn's fingerprints were all over the setup:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-blue-200 mb-4">
                <li>She manipulated Logan into deleting security footage weeks before the murder</li>
                <li>She orchestrated Nora's livestream to ensure the body would be discovered at the perfect moment</li>
                <li>She planted seeds of suspicion about other guests throughout the evening</li>
                <li>She had access to Luca's location and the murder weapons (camera and strap)</li>
                <li>She stood to benefit from his life insurance policy with an acceleration clause</li>
              </ul>
              
              <p className="text-lg leading-relaxed">
                In the end, Evelyn's need to control her son's narrative extended even to his death. 
                She couldn't bear to lose him to independence, so she ensured he would remain hers forever—as a tragic legend she could manage from beyond the grave.
              </p>
            </div>
          </div>

          {/* Investigation Summary */}
          <div className="bg-black/20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-blue-300" />
              <h2 className="text-2xl font-bold">Your Investigation Summary</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                <h3 className="font-semibold mb-2">Days Investigated</h3>
                <p className="text-2xl font-bold text-blue-200">3</p>
              </div>
              
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                <h3 className="font-semibold mb-2">Suspects Questioned</h3>
                <p className="text-2xl font-bold text-blue-200">
                  {Object.values(gameState.interrogation_log).flat().length > 0 ? '7' : '0'}
                </p>
              </div>
              
              <div className="text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                <h3 className="font-semibold mb-2">Total Questions Asked</h3>
                <p className="text-2xl font-bold text-blue-200">
                  {Object.values(gameState.interrogation_log).flat().length}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Your Top Suspects by Day:</h3>
              <div className="space-y-2">
                {[1, 2, 3].map(day => (
                  <div key={day} className="flex items-center space-x-3">
                    <span className="text-blue-300 font-medium">Day {day}:</span>
                    <span className="text-blue-200">
                      {gameState.daily_top_suspects[day.toString()]?.join(', ') || 'None selected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Play Again Button */}
          <div className="text-center">
            <button
              onClick={onPlayAgain}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};