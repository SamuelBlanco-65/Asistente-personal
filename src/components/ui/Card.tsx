import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing, shadows } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowing?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, glowing = false }) => {
  return (
    <View
      style={[
        styles.card,
        glowing && shadows.cyanGlow,
        glowing && { borderColor: colors.cyan.glow },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    marginVertical: spacing.xs,
  },
});
