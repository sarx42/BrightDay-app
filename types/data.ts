
export interface DailyEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  status: 'success' | 'slip';
  note?: string;
  gratitude?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastSlipDate: string | null;
}

export interface CheerMessage {
  id: string;
  message: string;
}

export interface Quote {
  id: string;
  text: string;
}
