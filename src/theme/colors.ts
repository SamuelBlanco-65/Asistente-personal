// JARVIS Student Design System - Color Palette
export const colors = {
  // Brand & Accent Colors
  cyan: {
    50: '#E0F7FA',
    100: '#B2EBF2',
    300: '#4DD0E1',
    500: '#00BCD4',
    600: '#00ACC1',
    400: '#26C6DA',
    glow: '#00F0FF', // JARVIS primary neon cyan
  },
  blue: {
    500: '#2196F3',
    600: '#1E88E5',
     glow: '#0072FF',
  },
  purple: {
    500: '#7C4DFF',
    glow: '#9D50BB',
  },

  // Dark Futuristic Base Backgrounds
  background: {
    darkest: '#080C14',  // Deep space background
    dark: '#0F172A',     // Card / container background
    card: '#1E293B',     // Elevated card background
    cardBorder: '#334155', // Border for cards
    glass: 'rgba(15, 23, 42, 0.8)', // Glassmorphism container
    overlay: 'rgba(8, 12, 20, 0.95)',
  },

  // Status & State Colors
  status: {
    idle: '#64748B',      // Slate grey
    listening: '#00F0FF', // Glowing cyan
    processing: '#F59E0B',// Amber glow
    speaking: '#10B981',  // Emerald green
    error: '#EF4444',     // Crimson red
    success: '#22C55E',   // Green
  },

  // Text Colors
  text: {
    primary: '#F8FAFC',   // Crisp white
    secondary: '#94A3B8', // Soft slate
    muted: '#64748B',     // Muted grey
    accent: '#00F0FF',    // Cyan highlight text
    inverse: '#0F172A',   // Text on bright background
  },

  // Interactive Component State
  button: {
    primaryBg: '#00F0FF',
    primaryText: '#080C14',
    secondaryBg: '#1E293B',
    secondaryText: '#F8FAFC',
    disabledBg: '#334155',
    disabledText: '#64748B',
  }
};
