// src/services/liveVoiceChatService.js
import { Platform } from 'react-native';
import { getLocalizedAiResponse } from './i18n/aiCoachTranslations';

class LiveVoiceChatService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.isMuted = false;
    this.isStopped = true;
    this.sessionHistory = [];
    this.onStateChange = null;
    this.onUserTranscript = null;
    this.onAiTranscript = null;
    this.onUserFinal = null;
    this.onAudioLevel = null;
    this.audioContext = null;
    this.mediaStream = null;
    this.analyser = null;
    this.meteringInterval = null;
    this.speakWaveInterval = null;
    this.silenceTimer = null;
    this.fallbackTtsTimeout = null;
    this.userTranscriptThrottle = null;
    this.lastUserTranscript = '';
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
  }

  // ── Start Live Voice Session ──
  async startLiveSession({
    lang = 'en',
    persona = 'friendly',
    depth = 'standard',
    onStateChange,
    onUserTranscript,
    onUserFinal,
    onAiTranscript,
    onAudioLevel,
  }) {
    // Stop any existing active session first
    this.stopLiveSession();

    this.isStopped = false;
    this.sessionHistory = [];
    this.isMuted = false;
    this.onStateChange = onStateChange;
    this.onUserTranscript = onUserTranscript;
    this.onUserFinal = onUserFinal;
    this.onAiTranscript = onAiTranscript;
    this.onAudioLevel = onAudioLevel;

    this._notifyState('listening');

    // 1. Initialize Speech Recognition immediately for zero startup latency
    if (!this.isStopped) {
      this._initSpeechRecognition(lang, persona, depth);
    }

    // 2. Initialize Microphone Audio Analyser concurrently in background
    this._initMicStream();
  }

  async _initMicStream() {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            noiseSuppression: true,
            echoCancellation: true,
            autoGainControl: true,
          },
        });

        if (this.isStopped) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        this.mediaStream = stream;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
          if (this.isStopped) {
            try { this.audioContext.close(); } catch (e) {}
            this.audioContext = null;
            return;
          }

          const source = this.audioContext.createMediaStreamSource(this.mediaStream);
          const preGain = this.audioContext.createGain();
          preGain.gain.value = 2.4; // Clean +7.6dB speech boost for crisp sensitivity

          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 128;
          this.analyser.smoothingTimeConstant = 0.35;
          source.connect(preGain);
          preGain.connect(this.analyser);

          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          const NOISE_FLOOR = 5;
          this.meteringInterval = setInterval(() => {
            if (this.isStopped || !this.analyser || this.isMuted) return;
            this.analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            let peak = 0;
            for (let i = 1; i <= 28; i++) {
              const val = dataArray[i] || 0;
              sum += val;
              if (val > peak) peak = val;
            }
            const avg = sum / 28;
            const combinedEnergy = avg * 0.65 + peak * 0.35;

            if (combinedEnergy < NOISE_FLOOR) {
              if (this.onAudioLevel && !this.isStopped) {
                this.onAudioLevel(0, [0, 0, 0, 0, 0, 0, 0]);
              }
              return;
            }

            // Clean volume normalization with wide dynamic range
            const normalized = Math.min(1, Math.max(0, (combinedEnergy - NOISE_FLOOR) / 44));
            const level = Math.min(1, Math.max(0, Math.pow(normalized, 0.72)));
            const weights = [0.45, 0.75, 0.95, 1.0, 0.95, 0.75, 0.45];
            const spectrum = weights.map(w => Math.min(1, level * w * (0.85 + Math.random() * 0.3)));

            if (this.onAudioLevel && !this.isStopped) {
              this.onAudioLevel(level, spectrum);
            }
          }, 35);
        }
      } catch (err) {
        console.warn('[LiveVoiceChatService] Mic stream error:', err);
      }
    }
  }

  _initSpeechRecognition(lang, persona, depth) {
    if (typeof window === 'undefined' || this.isStopped) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (this.recognition) {
          try { this.recognition.abort(); } catch (e) {}
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
        this.recognition.lang = lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : 'en-US';

        let sessionFinal = '';

        this.recognition.onresult = (event) => {
          if (this.isStopped || this.isMuted || this.isSpeaking) return;

          let interim = '';
          let newlyFinalized = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0]?.transcript || '';
            if (event.results[i].isFinal) {
              newlyFinalized += transcript;
            } else {
              interim += transcript;
            }
          }

          if (newlyFinalized) {
            sessionFinal = (sessionFinal + ' ' + newlyFinalized).trim();
          }

          const currentText = (sessionFinal + ' ' + interim).trim();
          if (currentText && this.onUserTranscript && !this.isStopped) {
            this.lastUserTranscript = currentText;
            this.onUserTranscript(currentText);
          }

          // Fast, responsive turn-taking when user finishes speaking
          if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = null;
          }
          if (currentText.length > 0 && !this.isStopped) {
            const delay = currentText.length > 25 || /[.?!]$/.test(currentText) ? 450 : 600;
            this.silenceTimer = setTimeout(() => {
              if (this.isStopped || this.isSpeaking) return;
              const queryToSend = currentText;
              sessionFinal = '';
              this._processUserQuestion(queryToSend, lang, persona, depth);
            }, delay);
          }
        };

        this.recognition.onerror = (e) => {
          if (this.isStopped) return;
          if (e?.error === 'no-speech' || e?.error === 'audio-capture' || e?.error === 'network' || e?.error === 'aborted') {
            this._safeRestartRecognition();
          }
        };

        this.recognition.onend = () => {
          if (!this.isStopped && !this.isSpeaking && !this.isMuted) {
            this._safeRestartRecognition();
          }
        };

        this.isListening = true;
        this.recognition.start();
      } catch (err) {
        console.warn('[LiveVoiceChatService] Speech recognition init warning:', err);
      }
    }
  }

  _safeRestartRecognition() {
    if (this.isStopped || this.isSpeaking || this.isMuted) return;
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    this.restartTimeout = setTimeout(() => {
      if (this.isStopped || this.isSpeaking || this.isMuted) return;
      if (this.recognition) {
        try {
          this.recognition.start();
        } catch (e) {
          // Already running or starting
        }
      }
    }, 80);
  }

  async _processUserQuestion(query, lang, persona, depth) {
    if (this.isStopped || !query || query.trim().length === 0) return;
    this._notifyState('thinking');

    if (this.onUserFinal && !this.isStopped) {
      this.onUserFinal(query);
    }

    // Generate response from Branco
    const aiResponse = getLocalizedAiResponse({
      query,
      mode: 'explain',
      lang,
      persona,
      depth,
    });

    if (this.isStopped) return;

    const aiAnswerText = aiResponse.text || "I'm right here. How can I help you with your studies today?";

    this.sessionHistory.push({
      userText: query,
      aiText: aiAnswerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Speak Branco's response out loud
    await this.speakBrancoResponse(aiAnswerText, lang);
  }

  // ── Speak Branco's Response with Animated Voice Waveform ──
  speakBrancoResponse(text, lang = 'en') {
    return new Promise((resolve) => {
      if (this.isStopped) {
        resolve();
        return;
      }

      const cleanText = text.replace(/[*_#`$]/g, '').trim();
      this._notifyState('speaking');
      this.isSpeaking = true;

      // Pause speech recognition while AI is speaking so it doesn't transcribe itself
      if (this.recognition) {
        try { this.recognition.abort(); } catch (e) {}
      }

      // Immediately display what Branco is saying
      if (this.onAiTranscript && !this.isStopped) {
        this.onAiTranscript(cleanText);
      }

      // Clear any existing wave interval
      if (this.speakWaveInterval) {
        clearInterval(this.speakWaveInterval);
        this.speakWaveInterval = null;
      }

      // Simulate sound-reactive orb waves during speech
      this.speakWaveInterval = setInterval(() => {
        if (this.isStopped || !this.isSpeaking) {
          if (this.speakWaveInterval) {
            clearInterval(this.speakWaveInterval);
            this.speakWaveInterval = null;
          }
          return;
        }
        const level = 0.6 + Math.random() * 0.4;
        const weights = [0.5, 0.8, 1.0, 0.95, 0.85, 0.7, 0.5];
        const spectrum = weights.map(w => Math.min(1, level * w * (0.85 + Math.random() * 0.3)));
        if (this.onAudioLevel && !this.isStopped) this.onAudioLevel(level, spectrum);
      }, 60);

      const finishSpeaking = () => {
        if (this.speakWaveInterval) {
          clearInterval(this.speakWaveInterval);
          this.speakWaveInterval = null;
        }
        this.isSpeaking = false;
        if (!this.isStopped) {
          this._notifyState('listening');
          this._safeRestartRecognition();
        }
        resolve();
      };

      if (this.synth) {
        try {
          this.synth.cancel();
          const cleanText = text.replace(/[*_#`$]/g, '').trim();
          const utterance = new SpeechSynthesisUtterance(cleanText);
          this.currentUtterance = utterance;
          utterance.lang = lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : 'en-US';
          utterance.rate = 1.05;
          utterance.pitch = 1.02;

          utterance.onend = finishSpeaking;
          utterance.onerror = finishSpeaking;

          this.synth.speak(utterance);
          return;
        } catch (e) {
          console.warn('[LiveVoiceChatService] TTS warning:', e);
        }
      }

      // Fallback timer if speech synthesis is unavailable
      const durationMs = Math.min(8000, Math.max(2500, text.length * 50));
      if (this.fallbackTtsTimeout) clearTimeout(this.fallbackTtsTimeout);
      this.fallbackTtsTimeout = setTimeout(finishSpeaking, durationMs);
    });
  }

  // ── User asks simulated/sample question by tap ──
  askQuestionManually(query, lang = 'en', persona = 'friendly', depth = 'standard') {
    if (this.isStopped) return;
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) {}
    }
    if (this.onUserTranscript) this.onUserTranscript(query);
    this._processUserQuestion(query, lang, persona, depth);
  }

  // ── Interrupt Branco ──
  interrupt() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    if (this.speakWaveInterval) {
      clearInterval(this.speakWaveInterval);
      this.speakWaveInterval = null;
    }
    this.isSpeaking = false;
    if (!this.isStopped) {
      this._notifyState('listening');
    }
  }

  // ── Toggle Mute ──
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (!this.isStopped) {
      this._notifyState(this.isMuted ? 'muted' : 'listening');
    }
    return this.isMuted;
  }

  _notifyState(state) {
    if (!this.isStopped && this.onStateChange) {
      this.onStateChange(state);
    }
  }

  // ── Stop Live Session Completely ──
  stopLiveSession() {
    this.isStopped = true;
    this.isListening = false;
    this.isSpeaking = false;
    this.isMuted = false;

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.userTranscriptThrottle) {
      clearTimeout(this.userTranscriptThrottle);
      this.userTranscriptThrottle = null;
    }

    if (this.speakWaveInterval) {
      clearInterval(this.speakWaveInterval);
      this.speakWaveInterval = null;
    }

    if (this.fallbackTtsTimeout) {
      clearTimeout(this.fallbackTtsTimeout);
      this.fallbackTtsTimeout = null;
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }

    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        if (typeof this.recognition.abort === 'function') {
          this.recognition.abort();
        }
      } catch (e) {}
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }

    if (this.meteringInterval) {
      clearInterval(this.meteringInterval);
      this.meteringInterval = null;
    }

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(t => {
          t.enabled = false;
          t.stop();
        });
      } catch (e) {}
      this.mediaStream = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }

    this.onAudioLevel = null;
    this.onUserTranscript = null;
    this.onAiTranscript = null;
    this.onUserFinal = null;
    this.onStateChange = null;

    const history = [...this.sessionHistory];
    this.sessionHistory = [];
    return history;
  }
}

export const liveVoiceChatService = new LiveVoiceChatService();
export default liveVoiceChatService;
