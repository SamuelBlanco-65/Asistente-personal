import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors, typography, spacing, radii } from '../../theme';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis' | 'system';
  text: string;
  timestamp: string;
  toolCall?: string;
}

interface TranscriptViewProps {
  messages: ChatMessage[];
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ messages }) => {
  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    const isSystem = item.sender === 'system';

    if (isSystem) {
      return (
        <View style={styles.systemContainer}>
          <Text style={styles.systemText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.jarvisBubble]}>
        <Text style={styles.senderLabel}>{isUser ? 'Tú' : 'JARVIS'}</Text>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.jarvisText]}>
          {item.text}
        </Text>
        {item.toolCall && (
          <View style={styles.toolCallBadge}>
            <Text style={styles.toolCallText}>⚡ Tool Execution: {item.toolCall}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: spacing.sm,
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: radii.md,
    marginVertical: spacing.xs,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
  },
  jarvisBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.dark,
    borderLeftWidth: 3,
    borderLeftColor: colors.cyan.glow,
  },
  senderLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
    marginBottom: 2,
    fontWeight: '600',
  },
  messageText: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  userText: {
    color: colors.text.primary,
  },
  jarvisText: {
    color: colors.cyan[50],
  },
  systemContainer: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginVertical: spacing.xs,
  },
  systemText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  toolCallBadge: {
    marginTop: spacing.xs,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    padding: 4,
    borderRadius: radii.xs,
  },
  toolCallText: {
    fontSize: typography.fontSize.xs,
    color: colors.cyan.glow,
    fontFamily: typography.fontFamily.mono,
  },
});
