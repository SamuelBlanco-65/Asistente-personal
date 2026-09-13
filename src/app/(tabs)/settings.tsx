import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ApiClient } from '../../services/api/apiClient';
import { useAuthStore } from '../../state/authStore';
import { colors, typography, spacing, radii } from '../../theme';

export default function SettingsScreen() {
  const [backendUrl, setBackendUrl] = useState(ApiClient.getBaseUrl());
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const { lock } = useAuthStore();

  const handleSaveUrl = () => {
    ApiClient.setBaseUrl(backendUrl);
    Alert.alert('Configuración guardada', `URL del Backend actualizada a: ${backendUrl}`);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setHealthStatus(null);
    try {
      ApiClient.setBaseUrl(backendUrl);
      const res = await ApiClient.get<{ status: string; ollama: string; database: string }>('/health');
      setHealthStatus(`✅ Conectado | Backend: ${res.status} | Ollama: ${res.ollama} | DB: ${res.database}`);
    } catch (err: any) {
      setHealthStatus(`❌ Error de conexión: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Ajustes del Sistema</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>🌐 Conexión Backend (Tailscale IP / Host)</Text>
        <Text style={styles.cardDesc}>
          Ingresa la IP de tu nodo Tailscale (ej: http://100.x.y.z:8000) o localhost.
        </Text>
        <TextInput
          style={styles.input}
          value={backendUrl}
          onChangeText={setBackendUrl}
          placeholder="http://100.x.y.z:8000"
          placeholderTextColor={colors.text.muted}
          autoCapitalize="none"
        />

        <View style={styles.row}>
          <Button title="Guardar URL" onPress={handleSaveUrl} style={styles.halfBtn} />
          <Button title="Probar Health" onPress={handleTestConnection} loading={testing} variant="secondary" style={styles.halfBtn} />
        </View>

        {healthStatus && (
          <View style={styles.healthBox}>
            <Text style={styles.healthText}>{healthStatus}</Text>
          </View>
        )}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>🔒 Seguridad Biométrica</Text>
        <Text style={styles.cardDesc}>
          Puedes bloquear manualmente el asistente JARVIS en cualquier momento.
        </Text>
        <Button title="🔒 Bloquear Aplicación" onPress={lock} variant="danger" />
      </Card>
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
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background.dark,
    color: colors.text.primary,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfBtn: {
    flex: 0.48,
  },
  healthBox: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background.dark,
    borderRadius: radii.xs,
  },
  healthText: {
    fontSize: typography.fontSize.xs,
    color: colors.cyan[50],
  },
});
