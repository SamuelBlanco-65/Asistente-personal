import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors, radii, spacing, shadows } from '../../theme';

interface VoiceButtonProps {
  isRecording: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ isRecording, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isRecording ? styles.recordingButton : styles.idleButton,
        !disabled && shadows.cyanGlow,
      ]}
    >
      <Text style={styles.buttonText}>{isRecording ? '⏹ Detener' : '🎤 Hablar'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: spacing.md,
  },
  idleButton: {
    backgroundColor: colors.cyan.glow,
  },
  recordingButton: {
    backgroundColor: colors.status.error,
  },
  buttonText: {
    color: colors.background.darkest,
    fontWeight: '700',
    fontSize: 16,
  },
});
