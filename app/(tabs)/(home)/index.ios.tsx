
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useStorage } from '@/hooks/useStorage';
import { quotes, cheerMessages, successMessages, slipMessages } from '@/data/messages';
import { DailyEntry } from '@/types/data';

export default function HomeScreen() {
  const { streakData, saveEntry, getTodayEntry, loading } = useStorage();
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [gratitudeText, setGratitudeText] = useState('');
  const [dailyQuote, setDailyQuote] = useState('');
  const [showCheerModal, setShowCheerModal] = useState(false);
  const [cheerMessage, setCheerMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const entry = getTodayEntry();
    setTodayEntry(entry);
    if (entry?.gratitude) {
      setGratitudeText(entry.gratitude);
    }
  }, [getTodayEntry]);

  useEffect(() => {
    // Set random daily quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setDailyQuote(randomQuote.text);
  }, []);

  const handleLogStatus = async (status: 'success' | 'slip') => {
    const today = new Date().toISOString().split('T')[0];
    const entry: DailyEntry = {
      date: today,
      status,
      gratitude: gratitudeText || undefined,
    };

    await saveEntry(entry);
    setTodayEntry(entry);

    // Show appropriate message
    if (status === 'success') {
      const message = successMessages[Math.floor(Math.random() * successMessages.length)];
      setStatusMessage(message);
    } else {
      const message = slipMessages[Math.floor(Math.random() * slipMessages.length)];
      setStatusMessage(message);
    }
  };

  const handleCheerMe = () => {
    const randomCheer = cheerMessages[Math.floor(Math.random() * cheerMessages.length)];
    setCheerMessage(randomCheer.message);
    setShowCheerModal(true);
  };

  const handleSaveGratitude = async () => {
    if (!todayEntry) return;
    
    const today = new Date().toISOString().split('T')[0];
    const entry: DailyEntry = {
      ...todayEntry,
      date: today,
      gratitude: gratitudeText || undefined,
    };

    await saveEntry(entry);
    setTodayEntry(entry);
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
          <Text style={commonStyles.title}>🌟 BrightDay</Text>
          <Text style={commonStyles.textSecondary}>Your daily companion for growth</Text>
        </View>

        {/* Daily Quote Bubble */}
        <View style={[commonStyles.card, styles.quoteCard]}>
          <Text style={styles.quoteText}>{dailyQuote}</Text>
        </View>

        {/* Streak Display */}
        <View style={[commonStyles.cardSmall, styles.streakCard]}>
          <View style={styles.streakRow}>
            <View style={styles.streakItem}>
              <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakItem}>
              <Text style={styles.streakNumber}>{streakData.longestStreak}</Text>
              <Text style={styles.streakLabel}>Longest Streak</Text>
            </View>
          </View>
          {streakData.lastSlipDate && (
            <Text style={styles.lastSlipText}>
              Last slip: {new Date(streakData.lastSlipDate).toLocaleDateString()}
            </Text>
          )}
        </View>

        {/* Daily Log Section */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Today&apos;s Check-in</Text>
          
          {!todayEntry ? (
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[buttonStyles.successButton, styles.logButton]}
                onPress={() => handleLogStatus('success')}
              >
                <Text style={buttonStyles.buttonText}>✅ I stayed on track</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[buttonStyles.accentButton, styles.logButton]}
                onPress={() => handleLogStatus('slip')}
              >
                <Text style={buttonStyles.buttonText}>💭 I slipped</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <Text style={styles.statusEmoji}>
                {todayEntry.status === 'success' ? '✅' : '💭'}
              </Text>
              <Text style={styles.statusText}>
                {todayEntry.status === 'success' ? 'You stayed on track today!' : 'You logged a slip today'}
              </Text>
              {statusMessage && (
                <Text style={styles.statusMessage}>{statusMessage}</Text>
              )}
            </View>
          )}
        </View>

        {/* Cheer Button */}
        <TouchableOpacity
          style={[buttonStyles.primaryButton, styles.cheerButton]}
          onPress={handleCheerMe}
        >
          <Text style={[buttonStyles.buttonText, styles.cheerButtonText]}>
            💫 Make me feel better
          </Text>
        </TouchableOpacity>

        {/* Gratitude Journal */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>One good thing today</Text>
          <TextInput
            style={[commonStyles.input, styles.gratitudeInput]}
            placeholder="What made you smile today?"
            placeholderTextColor={colors.textSecondary}
            value={gratitudeText}
            onChangeText={setGratitudeText}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {gratitudeText.length > 0 && (
            <TouchableOpacity
              style={[buttonStyles.secondaryButton, styles.saveButton]}
              onPress={handleSaveGratitude}
            >
              <Text style={buttonStyles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Cheer Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCheerModal}
        onRequestClose={() => setShowCheerModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCheerModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.cheerModalText}>{cheerMessage}</Text>
            <TouchableOpacity
              style={[buttonStyles.primaryButton, styles.modalButton]}
              onPress={() => setShowCheerModal(false)}
            >
              <Text style={buttonStyles.buttonText}>Thanks! 💜</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
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
  quoteCard: {
    backgroundColor: colors.highlight,
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  streakCard: {
    marginBottom: 20,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.secondary,
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
  lastSlipText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  buttonGroup: {
    marginTop: 16,
    gap: 12,
  },
  logButton: {
    width: '100%',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 12,
  },
  statusEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  cheerButton: {
    width: '100%',
    marginBottom: 20,
  },
  cheerButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  gratitudeInput: {
    marginTop: 12,
    minHeight: 80,
  },
  saveButton: {
    marginTop: 12,
    width: '100%',
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
  cheerModalText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
  },
  modalButton: {
    width: '100%',
  },
});
