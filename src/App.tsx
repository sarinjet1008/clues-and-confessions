import React, { useState } from 'react';
import { GameHeader } from './components/GameHeader';
import { GameIntro } from './components/GameIntro';
import { SuspectCard } from './components/SuspectCard';
import { InterrogationModal } from './components/InterrogationModal';
import { ClueBoard } from './components/ClueBoard';
import { DayEndModal } from './components/DayEndModal';
import { FinalAccusationModal } from './components/FinalAccusationModal';
import { GameResults } from './components/GameResults';
import { BackendStatus } from './components/BackendStatus';
import { useGameLogic } from './hooks/useGameLogic';
import { Suspect } from './types/game';
import { Calendar, Users, FileText, AlertCircle } from 'lucide-react';

function App() {
  const {
    gameState,
    gamePhase,
    interviewedToday,
    discoveredClues,
    suspects,
    accusedSuspect,
    startGame,
    askQuestion,
    selectSuspect,
    endDay,
    makeAccusation,
    resetGame,
    getCurrentDayLog,
    setGamePhase
  } = useGameLogic();

  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [showDayEndModal, setShowDayEndModal] = useState(false);
  const [showFinalAccusation, setShowFinalAccusation] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState<boolean>(true);

  const handleSuspectSelect = (suspect: Suspect) => {
    selectSuspect(suspect.name);
    setSelectedSuspect(suspect);
  };

  const handleCloseInterrogation = () => {
    setSelectedSuspect(null);
  };

  const handleEndDay = () => {
    setShowDayEndModal(true);
  };

  const handleSubmitTopSuspects = (topSuspects: string[]) => {
    endDay(topSuspects);
    setShowDayEndModal(false);
  };

  const handleFinalAccusation = () => {
    setShowFinalAccusation(true);
  };

  const handleMakeAccusation = (suspectName: string) => {
    makeAccusation(suspectName);
    setShowFinalAccusation(false);
  };

  if (gamePhase === 'intro') {
    return <GameIntro onStartGame={startGame} />;
  }

  if (gamePhase === 'results') {
    return (
      <GameResults
        accusedSuspect={accusedSuspect}
        gameState={gameState}
        suspects={suspects}
        onPlayAgain={resetGame}
      />
    );
  }

  if (gamePhase === 'game-over') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Case Closed!</h1>
          <p className="text-xl text-blue-200 mb-8">Thank you for playing Yacht Murder: Detective Mode</p>
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <GameHeader day={gameState.day} phase={gamePhase} />
      
      <div className="container mx-auto px-6 py-8">
        {/* Backend Status Warning */}
        {!backendHealthy && (
          <div className="mb-6">
            <BackendStatus onHealthCheck={setBackendHealthy} />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Investigation Area */}
          <div className="lg:col-span-2">
            {/* Day Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Day {gameState.day} Investigation</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Interviewed: {interviewedToday.size}/{suspects.length}</span>
                  </div>
                  {gameState.day === 3 ? (
                    <button
                      onClick={handleFinalAccusation}
                      disabled={!backendHealthy}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Make Final Accusation
                    </button>
                  ) : (
                    <button
                      onClick={handleEndDay}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      End Day {gameState.day}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700">
                  {gameState.day === 1 && "Begin your investigation by questioning the suspects. Look for inconsistencies and motives."}
                  {gameState.day === 2 && "Continue gathering evidence. Use the clues from yesterday to ask more targeted questions."}
                  {gameState.day === 3 && "This is your final day. Use all available evidence to identify the killer."}
                </p>
                {!backendHealthy && (
                  <div className="mt-3 flex items-center space-x-2 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Backend server required for interrogations</span>
                  </div>
                )}
              </div>
            </div>

            {/* Suspects Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {suspects.map((suspect) => (
                <SuspectCard
                  key={suspect.name}
                  suspect={suspect}
                  isInterviewed={interviewedToday.has(suspect.name)}
                  onSelect={handleSuspectSelect}
                  disabled={!backendHealthy}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Backend Status in Sidebar */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <BackendStatus onHealthCheck={setBackendHealthy} />
            </div>

            <ClueBoard clues={discoveredClues} currentDay={gameState.day} />
            
            {/* Investigation Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Investigation Progress</h3>
              </div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((day) => (
                  <div key={day} className={`p-3 rounded-lg ${day === gameState.day ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Day {day}</span>
                      <span className="text-sm text-gray-600">
                        {day < gameState.day ? 'Completed' : day === gameState.day ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>
                    {day < gameState.day && (
                      <div className="mt-2 text-sm text-gray-600">
                        Top suspects: {gameState.daily_top_suspects[day.toString()]?.join(', ') || 'None selected'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedSuspect && (
        <InterrogationModal
          suspect={selectedSuspect}
          onClose={handleCloseInterrogation}
          onAskQuestion={(question) => askQuestion(selectedSuspect.name, question)}
          interrogationLog={getCurrentDayLog()}
        />
      )}

      {showDayEndModal && (
        <DayEndModal
          day={gameState.day}
          suspects={suspects}
          onSubmitSuspects={handleSubmitTopSuspects}
          onClose={() => setShowDayEndModal(false)}
        />
      )}

      {showFinalAccusation && (
        <FinalAccusationModal
          suspects={suspects}
          onAccuse={handleMakeAccusation}
          onClose={() => setShowFinalAccusation(false)}
        />
      )}
    </div>
  );
}

export default App;