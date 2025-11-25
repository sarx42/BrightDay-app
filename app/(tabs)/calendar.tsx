
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useStorage } from '@/hooks/useStorage';
import { DailyEntry } from '@/types/data';

export default function CalendarScreen() {
  const { entries, loading } = useStorage();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Array<{
    date: Date;
    entry: DailyEntry | null;
    isCurrentMonth: boolean;
  }>>([]);

  useEffect(() => {
    generateCalendar();
  }, [selectedMonth, entries]);

  const generateCalendar = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Array<{
      date: Date;
      entry: DailyEntry | null;
      isCurrentMonth: boolean;
    }> = [];
    
    const currentDate = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const entry = entries.find(e => e.date === dateStr) || null;
      
      days.push({
        date: new Date(currentDate),
        entry,
        isCurrentMonth: currentDate.getMonth() === month,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  const getDayStyle = (day: typeof calendarDays[0]) => {
    if (!day.isCurrentMonth) {
      return styles.dayInactive;
    }
    if (day.entry?.status === 'success') {
      return styles.daySuccess;
    }
    if (day.entry?.status === 'slip') {
      return styles.daySlip;
    }
    return styles.dayEmpty;
  };

  const getDayTextStyle = (day: typeof calendarDays[0]) => {
    if (!day.isCurrentMonth) {
      return styles.dayTextInactive;
    }
    if (day.entry) {
      return styles.dayTextWithEntry;
    }
    return styles.dayText;
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>📅 Calendar</Text>
          <Text style={commonStyles.textSecondary}>Track your journey</Text>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => changeMonth('prev')}
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.monthText}>
            {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => changeMonth('next')}
          >
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={commonStyles.card}>
          {/* Day headers */}
          <View style={styles.weekRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <View key={day} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar days */}
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                <View key={dayIndex} style={styles.dayCell}>
                  <View style={[styles.dayCircle, getDayStyle(day)]}>
                    <Text style={getDayTextStyle(day)}>
                      {day.date.getDate()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={[commonStyles.cardSmall, styles.legend]}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendCircle, styles.daySuccess]} />
              <Text style={styles.legendText}>On track</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendCircle, styles.daySlip]} />
              <Text style={styles.legendText}>Slip</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendCircle, styles.dayEmpty]} />
              <Text style={styles.legendText}>No entry</Text>
            </View>
          </View>
        </View>

        {/* Recent Entries */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Recent Entries</Text>
          {entries.slice(0, 5).map((entry, index) => (
            <View key={index} style={styles.entryItem}>
              <View style={styles.entryDate}>
                <Text style={styles.entryDateText}>
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.entryContent}>
                <Text style={styles.entryStatus}>
                  {entry.status === 'success' ? '✅ On track' : '💭 Slip'}
                </Text>
                {entry.gratitude && (
                  <Text style={styles.entryGratitude} numberOfLines={2}>
                    {entry.gratitude}
                  </Text>
                )}
              </View>
            </View>
          ))}
          {entries.length === 0 && (
            <Text style={styles.noEntriesText}>No entries yet. Start logging today!</Text>
          )}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    color: colors.card,
    fontWeight: '600',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeader: {
    width: 40,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dayCell: {
    width: 40,
    alignItems: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayEmpty: {
    backgroundColor: colors.background,
  },
  daySuccess: {
    backgroundColor: colors.success,
  },
  daySlip: {
    backgroundColor: colors.accent,
  },
  dayInactive: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  dayTextWithEntry: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  dayTextInactive: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    opacity: 0.4,
  },
  legend: {
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  entryItem: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.secondary,
    borderRadius: 12,
  },
  entryDate: {
    marginRight: 12,
    justifyContent: 'center',
  },
  entryDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  entryContent: {
    flex: 1,
  },
  entryStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  entryGratitude: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  noEntriesText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 40,
  },
});
