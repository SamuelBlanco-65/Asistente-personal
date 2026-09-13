import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../../theme';
import { AssistantVisualState } from './JarvisOrb';

interface AssistantStatusProps {
  state: AssistantVisualState;
  customMessage?: string;
}

export const AssistantStatus: React.FC<AssistantStatusProps> = ({ state, customMessage }) => {
  const getStatusText = () => {
    if (customMessage) return customMessage;
    switch (state) {
      case 'LISTENING':
        return 'Escuchando... Di tu consulta';
      case 'PROCESSING':
        return 'Procesando consulta y herramientas...';
      case 'SPEAKING':
        return 'JARVIS respondiendo...';
      case 'ERROR':
        return 'Ocurrió un problema de conexión';
      case 'IDLE':
      default:
        return 'JARVIS Sistema Listo';
    }
  };

  const getBadgeColor = () => {
    switch (state) {
      case 'LISTENING':
        return colors.status.listening;
      case 'PROCESSING':
        return colors.status.processing;
      case 'SPEAKING':
        return colors.status.speaking;
      case 'ERROR':
        return colors.status.error;
      case 'IDLE':
      default:
        return colors.cyan.glow;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.badgeIndicator, { backgroundColor: getBadgeColor() }]} />
      <Text style={styles.statusText}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    alignSelf: 'center',
    marginVertical: spacing.sm,
  },
  badgeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
