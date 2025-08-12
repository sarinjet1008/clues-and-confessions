import { useState, useCallback } from 'react';
import { GameState, InterrogationEntry, GamePhase } from '../types/game';
import { suspects } from '../data/suspects';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API functions to communicate with Node.js backend
const askLLM = async (suspect: string, question: string): Promise<string> => {
  try {
    console.log(`Asking question to ${suspect}: ${question}`);
    
    const response = await fetch(`${API_BASE_URL}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        suspect: suspect,
        question: question
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.response || 'No response received';
  } catch (error) {
    console.error('Error communicating with backend:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Make sure the backend is running on port 5000.');
    }
    
    throw new Error(`Failed to get response: ${error.message}`);
  }
};

const loadClueFromAPI = async (day: number, suspect: string): Promise<string> => {
  try {
    console.log(`Loading clue for day ${day}, suspect: ${suspect}`);
    
    const response = await fetch(`${API_BASE_URL}/api/clue?day=${day}&suspect=${suspect}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.clue || `No clue found for ${suspect} on day ${day}`;
  } catch (error) {
    console.error('Error loading clue:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return `Cannot connect to backend server to load clue for ${suspect} on day ${day}`;
    }
    
    return `Error loading clue for ${suspect} on day ${day}: ${error.message}`;
  }
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    daily_top_suspects: { "1": [], "2": [], "3": [] },
    clues_unlocked: { "1": [], "2": [], "3": [] },
    interrogation_log: { "1": [], "2": [], "3": [] }
  });

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [interviewedToday, setInterviewedToday] = useState<Set<string>>(new Set());
  const [discoveredClues, setDiscoveredClues] = useState<Array<{
    id: string;
    suspect: string;
    day: number;
    content: string;
    discovered: boolean;
  }>>([]);
  const [accusedSuspect, setAccusedSuspect] = useState<string>('');

  const startGame = useCallback(() => {
    setGamePhase('investigation');
  }, []);

  const askQuestion = useCallback(async (suspect: string, question: string): Promise<string> => {
    try {
      const response = await askLLM(suspect, question);

      const entry: InterrogationEntry = {
        suspect,
        question,
        response,
        timestamp: new Date().toISOString()
      };

      setGameState(prev => ({
        ...prev,
        interrogation_log: {
          ...prev.interrogation_log,
          [prev.day.toString()]: [...(prev.interrogation_log[prev.day.toString()] || []), entry]
        }
      }));

      return response;
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    }
  }, []);

  const selectSuspect = useCallback((suspect: string) => {
    setInterviewedToday(prev => new Set([...prev, suspect]));
  }, []);

  const endDay = useCallback(async (topSuspects: string[]) => {
    const currentDay = gameState.day;

    // Update game state with top suspects
    setGameState(prev => ({
      ...prev,
      daily_top_suspects: {
        ...prev.daily_top_suspects,
        [currentDay.toString()]: topSuspects
      }
    }));

    // Load clues for selected suspects
    const newClues = await Promise.all(
      topSuspects.map(async (suspect) => {
        const clueContent = await loadClueFromAPI(currentDay, suspect);
        return {
          id: `${currentDay}-${suspect}`,
          suspect,
          day: currentDay,
          content: clueContent,
          discovered: true
        };
      })
    );

    setDiscoveredClues(prev => [...prev, ...newClues]);

    // Progress to next day or final accusation
    if (currentDay < 3) {
      setGameState(prev => ({ ...prev, day: currentDay + 1 }));
      setInterviewedToday(new Set());
      setGamePhase('investigation');
    } else {
      setGamePhase('final-accusation');
    }
  }, [gameState.day]);

  const makeAccusation = useCallback((suspectName: string) => {
    console.log(`Final accusation: ${suspectName}`);
    setAccusedSuspect(suspectName);
    setGamePhase('results');
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      day: 1,
      daily_top_suspects: { "1": [], "2": [], "3": [] },
      clues_unlocked: { "1": [], "2": [], "3": [] },
      interrogation_log: { "1": [], "2": [], "3": [] }
    });
    setGamePhase('intro');
    setInterviewedToday(new Set());
    setDiscoveredClues([]);
    setAccusedSuspect('');
  }, []);

  const getCurrentDayLog = useCallback(() => {
    return gameState.interrogation_log[gameState.day.toString()] || [];
  }, [gameState.day, gameState.interrogation_log]);

  return {
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
  };
};