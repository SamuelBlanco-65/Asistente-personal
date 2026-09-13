# PROJECT STATUS

Last updated:
2026-09-13

## CURRENT PHASE

Phase 4 — Voice Pipeline & Device Security Validation

## COMPLETED

- [x] Expo project setup
- [x] Expo Router setup
- [x] Lock screen UI
- [x] Biometric authentication pipeline (Android + iOS)
- [x] Emergency passcode / PIN fallback (PIN 1234 / 0000)
- [x] Concurrency protection on authentication store
- [x] FastAPI skeleton
- [x] Tailscale connectivity
- [x] Ollama local integration
- [x] Academic tools registry (courses, tasks, schedule)

## IN PROGRESS

- [ ] AudioRecorder & microphone flow (Expo Go compatibility vs Dev Build)
- [ ] STT (Speech-to-Text) pipeline
- [ ] TTS (Text-to-Speech) pipeline

## NEXT

1. Validate biometric unlock on physical device (test fingerprint and fallback PIN)
2. Resolve AudioRecorder runtime issue (`expo-av` native module in Expo Go vs Development Build)
3. Implement audio recording upload and STT service
4. Connect spoken query to Ollama agent supervisor

## RECENT FIXES & RESOLVED ISSUES

### Biometric Lock Screen Deadlock (Resolved 2026-09-13)
- **Problem**: Fingerprint was accepted by Android, but button remained loading indefinitely and view did not transition.
- **Root Causes**:
  1. AndroidX Biometric default `requireConfirmation: true` hung waiting for confirmation and weak security level caused callback loss with credential fallback.
  2. Expo Router target in `_layout.tsx` was `/(tabs)` (an organizational group, not a valid route path), causing React Navigation to abort navigation.
  3. Concurrent `authenticate()` calls without concurrency guards resulted in native bridge collisions.
- **Resolution**:
  1. Configured `requireConfirmation: false` and `biometricsSecurityLevel: 'strong'` in `BiometricAuthService`.
  2. Routed to canonical `'/'` path in `_layout.tsx` and added immediate direct transition in `lock.tsx`.
  3. Added concurrency check in `authStore.ts` and 350ms settle delay on initial mount.
  4. Added student emergency PIN fallback input (`1234`).

## CURRENT ERRORS

### AudioRecorder

Error:
expo-av native module ExponentAV is not available in current runtime.

File:
src/services/audio/AudioRecorder.ts

Runtime:
Expo Go / Android

Status:
Investigating (Requires Expo Development Build or migration to expo-audio)

## RECENT CHANGES

2026-09-13
- Fixed Android biometric freeze and Expo Router redirect issue in `lock.tsx`, `biometricAuth.ts`, `authStore.ts`, and `_layout.tsx`.
- Added AudioRecorder service with fallback alert in `src/services/audio/AudioRecorder.ts`.
- Connected Assistant screen to FastAPI backend (`ApiClient`).

## KNOWN TECHNICAL DEBT

- Expo Go runtime limitations for native audio recording (requires development build per ADR-006).