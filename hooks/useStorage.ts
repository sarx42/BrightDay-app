
import { useState, useEffect, useCallback } from 'react';
import { DailyEntry, StreakData } from '@/types/data';
import { storageUtils } from '@/utils/storage';

export function useStorage() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastSlipDate: null,
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [loadedEntries, loadedStreak] = await Promise.all([
        storageUtils.getEntries(),
        storageUtils.getStreakData(),
      ]);
      setEntries(loadedEntries);
      setStreakData(loadedStreak);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveEntry = useCallback(async (entry: DailyEntry) => {
    try {
      await storageUtils.saveEntry(entry);
      await loadData();
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  }, [loadData]);

  const getTodayEntry = useCallback((): DailyEntry | null => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(e => e.date === today) || null;
  }, [entries]);

  return {
    entries,
    streakData,
    loading,
    saveEntry,
    getTodayEntry,
    refreshData: loadData,
  };
}
