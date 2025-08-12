export interface GameState {
  day: number;
  daily_top_suspects: {
    [key: string]: string[];
  };
  clues_unlocked: {
    [key: string]: string[];
  };
  interrogation_log: {
    [key: string]: InterrogationEntry[];
  };
}

export interface InterrogationEntry {
  suspect: string;
  question: string;
  response: string;
  timestamp: string;
}

export interface Suspect {
  name: string;
  displayName: string;
  occupation: string;
  relationship: string;
  avatar: string;
}

export interface Clue {
  id: string;
  suspect: string;
  day: number;
  content: string;
  discovered: boolean;
}

export type GamePhase = 'intro' | 'investigation' | 'day-end' | 'final-accusation' | 'results' | 'game-over';