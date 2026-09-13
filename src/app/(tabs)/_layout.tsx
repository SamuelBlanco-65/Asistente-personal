import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.dark,
          borderTopColor: colors.background.cardBorder,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.cyan.glow,
        tabBarInactiveTintColor: colors.text.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'JARVIS',
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tareas',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
        }}
      />
    </Tabs>
  );
}
