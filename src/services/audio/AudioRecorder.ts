let AudioModule: typeof import('expo-av').Audio | null = null;
try {
  AudioModule = require('expo-av').Audio;
} catch (error) {
  // Silent fallback on initial require to avoid triggering LogBox in development mode
}

export interface RecordingResult {
  uri: string;
  durationMs: number;
}

export class AudioRecorderService {
  private static recording: any = null;

  static isAudioAvailable(): boolean {
    return AudioModule !== null;
  }

  static async requestPermissions(): Promise<boolean> {
    if (!AudioModule) return false;
    try {
      const { status } = await AudioModule.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('[AudioRecorderService] Error requesting audio permissions:', error);
      return false;
    }
  }

  static async startRecording(): Promise<boolean> {
    if (!AudioModule) {
      console.warn('[AudioRecorderService] Cannot start recording: ExponentAV module is not present in runtime.');
      return false;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permisos de micrófono denegados');
      }

      await AudioModule.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await AudioModule.Recording.createAsync(
        AudioModule.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      return true;
    } catch (error) {
      console.error('[AudioRecorderService] Failed to start recording:', error);
      this.recording = null;
      return false;
    }
  }

  static async stopRecording(): Promise<RecordingResult | null> {
    if (!this.recording || !AudioModule) return null;

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();
      this.recording = null;

      await AudioModule.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      if (!uri) return null;

      return {
        uri,
        durationMs: status.durationMillis || 0,
      };
    } catch (error) {
      console.error('[AudioRecorderService] Failed to stop recording:', error);
      this.recording = null;
      return null;
    }
  }
}
