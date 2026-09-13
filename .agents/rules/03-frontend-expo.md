---
trigger: glob
globs: src/**/*.ts src/**/*.tsx
---

# FRONTEND — EXPO / REACT NATIVE

Use:
- React Native
- Expo
- Expo Router
- TypeScript

Rules:
- Prefer existing reusable components.
- Do not duplicate UI components.
- Follow the Design System.
- Keep screens focused on presentation and orchestration.
- Keep business logic outside screens.
- Keep API calls inside services.
- Keep native audio logic inside audio services.
- Keep authentication logic inside auth services.
- Use TypeScript strict typing.
- Avoid `any` unless explicitly justified.
- Prefer hooks and reusable abstractions.
- Use SafeArea and responsive layouts.
- Preserve design fidelity.
- Do not introduce dependencies without checking Expo compatibility.
- Use `npx expo install` for Expo dependencies when appropriate.
- Verify whether a native dependency requires Expo Go or a Development Build.


For UI changes:
inspect existing components first → inspect Design System  → implement → validate.