import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { JarvisOrb, AssistantVisualState } from '../../components/assistant/JarvisOrb';
import { AssistantStatus } from '../../components/assistant/AssistantStatus';
import { VoiceButton } from '../../components/assistant/VoiceButton';
import { TranscriptView, ChatMessage } from '../../components/assistant/TranscriptView';
import { Button } from '../../components/ui/Button';
import { AudioRecorderService } from '../../services/audio/AudioRecorder';
import { ApiClient } from '../../services/api/apiClient';
import { colors, typography, spacing, radii } from '../../theme';

export default function AssistantScreen() {
  const [visualState, setVisualState] = useState<AssistantVisualState>('IDLE');
  const [isRecording, setIsRecording] = useState(false);
  const [textQuery, setTextQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'jarvis',
      text: 'Hola Samuel. Soy JARVIS, tu asistente académico personal. ¿En qué te puedo ayudar hoy?',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const handleSendText = async () => {
    if (!textQuery.trim()) return;

    const userText = textQuery.trim();
    setTextQuery('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setVisualState('PROCESSING');

    try {
      const response = await ApiClient.post<{
        response_text: string;
        tool_executed?: string;
        status: string;
      }>('/api/v1/assistant/message', { message: userText });

      const jarvisMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: response.response_text || 'Entendido.',
        timestamp: new Date().toLocaleTimeString(),
        toolCall: response.tool_executed,
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      setVisualState('SPEAKING');

      setTimeout(() => {
        setVisualState('IDLE');
      }, 3000);
    } catch (error: any) {
      setVisualState('ERROR');
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: `Error de JARVIS: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);

      setTimeout(() => {
        setVisualState('IDLE');
      }, 4000);
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      if (!AudioRecorderService.isAudioAvailable()) {
        Alert.alert(
          'Grabación de Voz en Expo Go',
          'El módulo nativo ExponentAV no está presente en la app estándar Expo Go. Puedes comunicarte con JARVIS usando el campo de texto inferior, o compilar una Development Build.'
        );
        return;
      }
      const started = await AudioRecorderService.startRecording();
      if (started) {
        setIsRecording(true);
        setVisualState('LISTENING');
      } else {
        setVisualState('ERROR');
      }
    } else {
      setIsRecording(false);
      setVisualState('PROCESSING');
      const recordingResult = await AudioRecorderService.stopRecording();

      if (recordingResult) {
        // Send simulated recording note to text engine for MVP
        setTextQuery('Agrega tarea estudiar para el examen de cálculo mañana');
      } else {
        setVisualState('IDLE');
      }
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>JARVIS</Text>
          <AssistantStatus state={visualState} />
        </View>

        {/* Central Glowing Interactive Orb */}
        <View style={styles.orbContainer}>
          <JarvisOrb state={visualState} size={150} />
          <VoiceButton isRecording={isRecording} onPress={toggleRecording} />
        </View>

        {/* Transcript & Message History */}
        <View style={styles.transcriptContainer}>
          <TranscriptView messages={messages} />
        </View>

        {/* Text Input Fallback Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe un comando o pregunta..."
            placeholderTextColor={colors.text.muted}
            value={textQuery}
            onChangeText={setTextQuery}
            onSubmitEditing={handleSendText}
          />
          <Button
            title="Enviar"
            onPress={handleSendText}
            variant="primary"
            style={styles.sendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.cyan.glow,
    letterSpacing: 3,
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcriptContainer: {
    flex: 1,
    backgroundColor: colors.background.dark,
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    marginVertical: spacing.xs,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    marginRight: spacing.sm,
  },
  sendButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
