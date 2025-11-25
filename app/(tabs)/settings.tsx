
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your entries and start fresh? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been cleared.');
              router.replace('/(tabs)/(home)/');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>⚙️ Settings</Text>
          <Text style={commonStyles.textSecondary}>Manage your BrightDay experience</Text>
        </View>

        {/* About Section */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>About BrightDay</Text>
          <Text style={styles.aboutText}>
            BrightDay is your daily companion for breaking habits and building emotional resilience. 
            Track your progress, celebrate your wins, and be gentle with yourself on tough days.
          </Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Features</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📝</Text>
            <Text style={styles.featureText}>Daily habit tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔥</Text>
            <Text style={styles.featureText}>Streak monitoring</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📅</Text>
            <Text style={styles.featureText}>Calendar view</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>💫</Text>
            <Text style={styles.featureText}>Daily encouragement</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📊</Text>
            <Text style={styles.featureText}>Progress insights</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🙏</Text>
            <Text style={styles.featureText}>Gratitude journal</Text>
          </View>
        </View>

        {/* Tips Section */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Tips for Success</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>1.</Text>
            <Text style={styles.tipText}>
              Log your status every day, even on difficult days
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>2.</Text>
            <Text style={styles.tipText}>
              Use the gratitude journal to focus on positive moments
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>3.</Text>
            <Text style={styles.tipText}>
              Don&apos;t be discouraged by slips - they&apos;re part of growth
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>4.</Text>
            <Text style={styles.tipText}>
              Celebrate your streaks, no matter how small
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>5.</Text>
            <Text style={styles.tipText}>
              Use the &quot;Make me feel better&quot; button whenever you need support
            </Text>
          </View>
        </View>

        {/* Data Management */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Data Management</Text>
          <Text style={styles.dataText}>
            All your data is stored locally on your device. No information is sent to external servers.
          </Text>
          <TouchableOpacity
            style={[buttonStyles.accentButton, styles.clearButton]}
            onPress={handleClearData}
          >
            <Text style={buttonStyles.buttonText}>🗑️ Clear All Data</Text>
          </TouchableOpacity>
        </View>

        {/* Affirmation */}
        <View style={[commonStyles.card, styles.affirmationCard]}>
          <Text style={styles.affirmationText}>
            💜 You&apos;re doing better than you think. Keep going!
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginTop: 12,
  },
  versionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  tipItem: {
    flexDirection: 'row',
    marginTop: 12,
    paddingVertical: 8,
  },
  tipNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 12,
    width: 24,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    flex: 1,
  },
  dataText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 16,
  },
  clearButton: {
    width: '100%',
  },
  affirmationCard: {
    backgroundColor: colors.highlight,
    marginBottom: 20,
  },
  affirmationText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomPadding: {
    height: 40,
  },
});
