
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useStorage } from '@/hooks/useStorage';

export default function InsightsScreen() {
  const { entries, streakData, loading } = useStorage();

  const calculateStats = () => {
    const totalEntries = entries.length;
    const successCount = entries.filter(e => e.status === 'success').length;
    const slipCount = entries.filter(e => e.status === 'slip').length;
    const successRate = totalEntries > 0 ? Math.round((successCount / totalEntries) * 100) : 0;
    
    // Get entries from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEntries = entries.filter(e => new Date(e.date) >= sevenDaysAgo);
    const recentSuccessCount = recentEntries.filter(e => e.status === 'success').length;
    
    // Get entries from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthEntries = entries.filter(e => new Date(e.date) >= thirtyDaysAgo);
    const monthSuccessCount = monthEntries.filter(e => e.status === 'success').length;
    
    return {
      totalEntries,
      successCount,
      slipCount,
      successRate,
      recentSuccessCount,
      monthSuccessCount,
    };
  };

  const stats = calculateStats();

  const getEncouragementMessage = () => {
    if (stats.successRate >= 80) {
      return '🌟 You&apos;re doing amazing! Keep up the incredible work!';
    } else if (stats.successRate >= 60) {
      return '💪 Great progress! You&apos;re building strong habits!';
    } else if (stats.successRate >= 40) {
      return '🌱 You&apos;re growing! Every step counts!';
    } else if (stats.totalEntries > 0) {
      return '🌈 Keep going! Progress takes time and you&apos;re on the right path!';
    } else {
      return '✨ Start your journey today! Every great story begins with a single step.';
    }
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
          <Text style={commonStyles.title}>📊 Insights</Text>
          <Text style={commonStyles.textSecondary}>Your progress at a glance</Text>
        </View>

        {/* Encouragement Message */}
        <View style={[commonStyles.card, styles.encouragementCard]}>
          <Text style={styles.encouragementText}>{getEncouragementMessage()}</Text>
        </View>

        {/* Overall Stats */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Overall Statistics</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalEntries}</Text>
              <Text style={styles.statLabel}>Total Days Logged</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats.successRate}%
              </Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {stats.successCount}
              </Text>
              <Text style={styles.statLabel}>On Track Days</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.accent }]}>
                {stats.slipCount}
              </Text>
              <Text style={styles.statLabel}>Slip Days</Text>
            </View>
          </View>
        </View>

        {/* Streak Info */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Streak Information</Text>
          
          <View style={styles.streakContainer}>
            <View style={styles.streakBox}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            
            <View style={styles.streakBox}>
              <Text style={styles.streakEmoji}>🏆</Text>
              <Text style={styles.streakNumber}>{streakData.longestStreak}</Text>
              <Text style={styles.streakLabel}>Longest Streak</Text>
            </View>
          </View>

          {streakData.lastSlipDate && (
            <View style={styles.lastSlipContainer}>
              <Text style={styles.lastSlipLabel}>Last slip:</Text>
              <Text style={styles.lastSlipDate}>
                {new Date(streakData.lastSlipDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Recent Activity */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Recent Activity</Text>
          
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>Last 7 days</Text>
            <Text style={styles.activityValue}>
              {stats.recentSuccessCount} / 7 days on track
            </Text>
          </View>
          
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>Last 30 days</Text>
            <Text style={styles.activityValue}>
              {stats.monthSuccessCount} / 30 days on track
            </Text>
          </View>
        </View>

        {/* Motivational Section */}
        <View style={[commonStyles.card, styles.motivationCard]}>
          <Text style={styles.motivationTitle}>💜 Remember</Text>
          <Text style={styles.motivationText}>
            Progress isn&apos;t always linear. Every day you show up is a victory. 
            Be proud of how far you&apos;ve come, and trust the journey ahead.
          </Text>
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
  encouragementCard: {
    backgroundColor: colors.highlight,
    marginBottom: 20,
  },
  encouragementText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.secondary,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  streakBox: {
    alignItems: 'center',
    flex: 1,
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  streakEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  lastSlipContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    alignItems: 'center',
  },
  lastSlipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  lastSlipDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    marginTop: 12,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activityValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  motivationCard: {
    backgroundColor: colors.primary,
    marginBottom: 20,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    textAlign: 'center',
    marginBottom: 12,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.card,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: 40,
  },
});
