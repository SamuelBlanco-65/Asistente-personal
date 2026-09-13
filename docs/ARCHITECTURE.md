# ARCHITECTURE

## System Overview

Mobile
↓
Tailscale
↓
FastAPI
↓
Ollama
↓
Tool Registry
↓
Integrations

## Frontend

Expo
├── Router
├── UI
├── Features
├── Services
└── State

## Backend

FastAPI
├── API
├── Application
├── Agents
├── Tools
├── LLM
├── Memory
└── Integrations

## AI

Supervisor
├── Academic Agent
├── Productivity Agent
└── Communication Agent

## Tools

Native Tools
+
Future MCP Tools

## Audio

Mobile microphone
→ upload
→ STT
→ LLM
→ TTS
→ mobile playback

## Security

Biometric
+
Application Auth
+
Tailscale
+
Authorization