import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { ApiClient } from '../../services/api/apiClient';
import { colors, typography, spacing, radii } from '../../theme';

interface StudentTask {
  id: string;
  title: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<StudentTask[]>([
    {
      id: '1',
      title: 'Estudiar Cálculo Multivariable (Capítulo 4)',
      due_date: '2026-09-15',
      priority: 'high',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Revisar pull request del proyecto de Algoritmos',
      due_date: '2026-09-14',
      priority: 'medium',
      status: 'pending',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.get<{ tasks: StudentTask[] }>('/api/v1/tasks');
      if (data && data.tasks) {
        setTasks(data.tasks);
      }
    } catch (_) {
      // Keep mock tasks on connection error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.status.error;
      case 'medium':
        return colors.status.processing;
      case 'low':
      default:
        return colors.cyan.glow;
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Tareas Académicas</Text>
      <Text style={styles.subtitle}>Gestión autónoma sincronizada con JARVIS</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTasks} tintColor={colors.cyan.glow} />
        }
        renderItem={({ item }) => (
          <Card style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(item.priority) }]}>
                <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
              </View>
            </View>
            {item.due_date && <Text style={styles.dueDate}>📅 Fecha: {item.due_date}</Text>}
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.cyan.glow,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  taskCard: {
    marginVertical: spacing.xs,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  taskTitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
    marginRight: spacing.sm,
  },
  priorityTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  priorityText: {
    fontSize: typography.fontSize.xs,
    color: colors.background.darkest,
    fontWeight: typography.fontWeight.bold,
  },
  dueDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
  },
});
