
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyEntry, StreakData } from '@/types/data';

const ENTRIES_KEY = '@brightday_entries';
const STREAK_KEY = '@brightday_streak';

export const storageUtils = {
  // Get all entries
  async getEntries(): Promise<DailyEntry[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ENTRIES_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading entries:', e);
      return [];
    }
  },

  // Save entry for a specific date
  async saveEntry(entry: DailyEntry): Promise<void> {
    try {
      const entries = await this.getEntries();
      const existingIndex = entries.findIndex(e => e.date === entry.date);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.push(entry);
      }
      
      // Sort by date descending
      entries.sort((a, b) => b.date.localeCompare(a.date));
      
      const jsonValue = JSON.stringify(entries);
      await AsyncStorage.setItem(ENTRIES_KEY, jsonValue);
      
      // Update streak data
      await this.updateStreakData(entries);
    } catch (e) {
      console.error('Error saving entry:', e);
    }
  },

  // Get entry for a specific date
  async getEntryForDate(date: string): Promise<DailyEntry | null> {
    try {
      const entries = await this.getEntries();
      return entries.find(e => e.date === date) || null;
    } catch (e) {
      console.error('Error getting entry for date:', e);
      return null;
    }
  },

  // Update streak data based on entries
  async updateStreakData(entries: DailyEntry[]): Promise<void> {
    try {
      const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastSlipDate: string | null = null;
      
      // Find last slip date
      const lastSlip = sortedEntries.find(e => e.status === 'slip');
      if (lastSlip) {
        lastSlipDate = lastSlip.date;
      }
      
      // Calculate current streak (from today backwards)
      const today = new Date();
      let checkDate = new Date(today);
      
      for (let i = 0; i < sortedEntries.length; i++) {
        const entry = sortedEntries[i];
        const entryDate = new Date(entry.date);
        
        // Check if this entry is for the date we're checking
        if (entryDate.toISOString().split('T')[0] === checkDate.toISOString().split('T')[0]) {
          if (entry.status === 'success') {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
      // Calculate longest streak
      for (const entry of sortedEntries) {
        if (entry.status === 'success') {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }
      
      const streakData: StreakData = {
        currentStreak,
        longestStreak,
        lastSlipDate,
      };
      
      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
    } catch (e) {
      console.error('Error updating streak data:', e);
    }
  },

  // Get streak data
  async getStreakData(): Promise<StreakData> {
    try {
      const jsonValue = await AsyncStorage.getItem(STREAK_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : {
        currentStreak: 0,
        longestStreak: 0,
        lastSlipDate: null,
      };
    } catch (e) {
      console.error('Error reading streak data:', e);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastSlipDate: null,
      };
    }
  },
};
