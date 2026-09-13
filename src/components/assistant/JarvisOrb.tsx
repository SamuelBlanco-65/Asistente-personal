import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme';

export type AssistantVisualState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

interface JarvisOrbProps {
  state: AssistantVisualState;
  size?: number;
}

export const JarvisOrb: React.FC<JarvisOrbProps> = ({ state, size = 180 }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (state === 'LISTENING' || state === 'SPEAKING') {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else if (state === 'PROCESSING') {
      animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      Animated.spring(pulseAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [state]);

  const getOrbColor = () => {
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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const color = getOrbColor();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer Pulse Glow Ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: (size * 1.3) / 2,
            borderColor: color,
            transform: [{ scale: pulseAnim }],
            opacity: state === 'IDLE' ? 0.3 : 0.7,
          },
        ]}
      />

      {/* Middle Rotating Ring */}
      <Animated.View
        style={[
          styles.middleRing,
          {
            width: size * 1.1,
            height: size * 1.1,
            borderRadius: (size * 1.1) / 2,
            borderColor: color,
            transform: [{ rotate: spin }],
          },
        ]}
      />

      {/* Core Glowing Orb */}
      <Animated.View
        style={[
          styles.coreOrb,
          {
            width: size * 0.75,
            height: size * 0.75,
            borderRadius: (size * 0.75) / 2,
            backgroundColor: color,
            shadowColor: color,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  middleRing: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  coreOrb: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 15,
  },
});
