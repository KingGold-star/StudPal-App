// src/services/voiceRecordingService.js
import { Platform } from 'react-native';

let ExpoAudio = null;
try {
  // Safe dynamic import of expo-av for native platforms
  const expoAv = require('expo-av');
  ExpoAudio = expoAv?.Audio || null;
} catch (err) {
  console.log('[VoiceRecordingService] expo-av not available in current environment:', err?.message);
}

class VoiceRecordingService {
  constructor() {
    this.currentNativeRecording = null;
    this.currentWebMediaRecorder = null;
    this.webAudioChunks = [];
    this.webMediaStream = null;
    this.activeSoundObject = null;
    this.webAudioElement = null;
    this.playbackInterval = null;
    this.audioLevelListeners = [];
    this.webAudioContext = null;
    this.webAnalyser = null;
    this.playbackAudioContext = null;
    this.meteringInterval = null;
    this.recordedWaveformSamples = [];
  }

  // ── Waveform sample generator with natural speech peaks and contours ──
  generateWaveform(count = 28) {
    const bars = [];
    for (let i = 0; i < count; i++) {
      const progress = i / count;
      const envelope = Math.sin(progress * Math.PI);
      const harmonic1 = Math.sin(i * 1.7) * 0.28;
      const harmonic2 = Math.cos(i * 3.4) * 0.18;
      const noise = (Math.sin(i * 9.2) + 1) * 0.15;
      const raw = Math.max(0.18, Math.min(0.95, envelope * 0.62 + harmonic1 + harmonic2 + noise));
      bars.push(parseFloat(raw.toFixed(2)));
    }
    return bars;
  }

  // ── Format duration in mm:ss or m:ss ──
  formatDuration(seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(s / 60);
    const remSecs = s % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  }

  // ── Request Mic Permission ──
  async requestPermission() {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(t => t.stop());
          return true;
        } catch (e) {
          console.warn('[VoiceRecordingService] Web mic permission error:', e);
          return false;
        }
      }
      return false;
    }

    if (ExpoAudio) {
      try {
        const { status } = await ExpoAudio.requestPermissionsAsync();
        return status === 'granted';
      } catch (e) {
        console.warn('[VoiceRecordingService] Native mic permission error:', e);
        return false;
      }
    }

    return true;
  }

  // ── Audio Level & Voice Activity Listeners ──
  onAudioLevel(callback) {
    this.audioLevelListeners.push(callback);
    return () => {
      this.audioLevelListeners = this.audioLevelListeners.filter(cb => cb !== callback);
    };
  }

  _notifyAudioLevel(level, spectrum = null) {
    if (level > 0.02) {
      this.recordedWaveformSamples.push(level);
    } else {
      this.recordedWaveformSamples.push(0.12);
    }
    for (const cb of this.audioLevelListeners) {
      try {
        cb(level, spectrum);
      } catch (e) {}
    }
  }

  _stopAudioMetering() {
    if (this.meteringInterval) {
      clearInterval(this.meteringInterval);
      this.meteringInterval = null;
    }
    if (this.webAudioContext) {
      try {
        this.webAudioContext.close();
      } catch (e) {}
      this.webAudioContext = null;
      this.webAnalyser = null;
    }
    this._notifyAudioLevel(0, [0, 0, 0, 0, 0, 0, 0]);
  }

  _startWebAudioAnalyser(stream) {
    this._stopAudioMetering();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        this._startSimulatedAudioMetering();
        return;
      }
      this.webAudioContext = new AudioCtx();
      const source = this.webAudioContext.createMediaStreamSource(stream);

      // Industry-Standard Pre-Amplifier Gain Stage (boosts quiet conversational voice with zero clipping)
      const preGain = this.webAudioContext.createGain();
      preGain.gain.value = 2.4; // Clean +7.6dB speech boost for crisp sensitivity

      // Speech bandpass filter: human vocal fundamental & formants (80Hz - 3800Hz)
      const filter = this.webAudioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1050;
      filter.Q.value = 0.65; // Wide vocal Q factor capturing natural human speech

      const analyser = this.webAudioContext.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.3; // Responsive real-time reaction

      source.connect(preGain);
      preGain.connect(filter);
      filter.connect(analyser);
      this.webAnalyser = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      // 7 speech frequency bands covering human voice fundamentals and formants
      const binIndices = [2, 4, 7, 10, 14, 18, 22];
      const SPEECH_GATE_THRESHOLD = 6; // Sensitive industry noise floor (detects soft speech effortlessly)

      this.meteringInterval = setInterval(() => {
        if (!this.webAnalyser) return;
        this.webAnalyser.getByteFrequencyData(dataArray);

        // Calculate voice band energy
        let speechSum = 0;
        for (let i = 2; i <= 24; i++) {
          speechSum += dataArray[i] || 0;
        }
        const avgSpeechEnergy = speechSum / 23;

        // If below ambient noise floor, it's silence
        if (avgSpeechEnergy < SPEECH_GATE_THRESHOLD) {
          this._notifyAudioLevel(0, [0, 0, 0, 0, 0, 0, 0]);
          return;
        }

        // Natural dynamic compression curve: whisper -> conversational -> full voice
        const normalized = Math.min(1, Math.max(0, (avgSpeechEnergy - SPEECH_GATE_THRESHOLD) / 28));
        const vocalLevel = Math.min(1, Math.max(0, Math.pow(normalized, 0.75)));
        const centerWeights = [0.45, 0.72, 0.92, 1.0, 0.92, 0.72, 0.45];
        const spectrum = centerWeights.map((weight, i) => {
          const val = dataArray[binIndices[i]] || 0;
          const harmonicFactor = val > SPEECH_GATE_THRESHOLD ? Math.min(1.2, Math.max(0.7, (val - SPEECH_GATE_THRESHOLD) / 24)) : 0.8;
          return Math.min(1, vocalLevel * weight * harmonicFactor);
        });

        this._notifyAudioLevel(vocalLevel, spectrum);
      }, 40);
    } catch (err) {
      console.warn('[VoiceRecordingService] Web Audio analyser init error:', err);
      this._startSimulatedAudioMetering();
    }
  }

  _startSimulatedAudioMetering() {
    this._stopAudioMetering();
    // Default to flat line 0 so it never shakes spontaneously without user voice
    this._notifyAudioLevel(0, [0, 0, 0, 0, 0, 0, 0]);
  }

  // ── Start Recording ──
  async startRecording() {
    await this.stopPlayback();
    this.recordedWaveformSamples = [];

    // 1. Web Platform
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          this.webAudioChunks = [];
          this.webMediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              noiseSuppression: false, // Ensure soft whispers and background notes are never clipped
              echoCancellation: true,
              autoGainControl: true, // Auto-boosts quiet and distant sounds
              channelCount: 1,
              sampleRate: 48000,
            },
          });
          
          let mimeType = 'audio/webm;codecs=opus';
          if (typeof MediaRecorder !== 'undefined' && !MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
            else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
            else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
            else mimeType = '';
          }

          const options = mimeType ? { mimeType, audioBitsPerSecond: 128000 } : { audioBitsPerSecond: 128000 };
          this.currentWebMediaRecorder = new MediaRecorder(this.webMediaStream, options);

          this.currentWebMediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              this.webAudioChunks.push(event.data);
            }
          };

          this.currentWebMediaRecorder.start(100);
          this._startWebAudioAnalyser(this.webMediaStream);
          return { success: true, platform: 'web' };
        } catch (err) {
          console.warn('[VoiceRecordingService] Web recording start failed:', err);
          // Fallback to simulated audio recording for browsers without hardware permission
          this._startSimulatedAudioMetering();
          return { success: true, platform: 'simulated' };
        }
      }
      this._startSimulatedAudioMetering();
      return { success: true, platform: 'simulated' };
    }

    // 2. Native Platform (iOS / Android)
    if (ExpoAudio) {
      try {
        const { granted } = await ExpoAudio.requestPermissionsAsync();
        if (!granted) {
          return { success: false, error: 'Permission not granted' };
        }

        await ExpoAudio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new ExpoAudio.Recording();
        await recording.prepareToRecordAsync(
          ExpoAudio.RecordingOptionsPresets?.HIGH_QUALITY || {
            android: {
              extension: '.m4a',
              outputFormat: 2,
              audioEncoder: 3,
              sampleRate: 44100,
              numberOfChannels: 1,
              bitRate: 128000,
            },
            ios: {
              extension: '.m4a',
              audioQuality: 127,
              sampleRate: 44100,
              numberOfChannels: 1,
              bitRate: 128000,
              linearPCMBitDepth: 16,
              linearPCMIsBigEndian: false,
              linearPCMIsFloat: false,
            },
            web: {},
          }
        );

        recording.setProgressUpdateInterval(40);
        recording.setOnRecordingStatusUpdate((status) => {
          if (!status.isRecording) return;
          const metering = typeof status.metering === 'number' ? status.metering : -160;
          const NOISE_FLOOR_DB = -58;
          if (metering < NOISE_FLOOR_DB) {
            this._notifyAudioLevel(0, [0, 0, 0, 0, 0, 0, 0]);
            return;
          }
          const normalized = Math.min(1, Math.max(0, (metering - NOISE_FLOOR_DB) / 36));
          const level = Math.min(1, Math.max(0, Math.pow(normalized, 0.78)));
          const spectrum = [
            level * 0.45,
            level * 0.72,
            level * 0.92,
            level * 1.0,
            level * 0.92,
            level * 0.72,
            level * 0.45,
          ];
          this._notifyAudioLevel(level, spectrum);
        });

        await recording.startAsync();
        this.currentNativeRecording = recording;
        return { success: true, platform: 'native' };
      } catch (err) {
        console.warn('[VoiceRecordingService] Native recording start error:', err);
        this._startSimulatedAudioMetering();
        return { success: true, platform: 'simulated' };
      }
    }

    this._startSimulatedAudioMetering();
    return { success: true, platform: 'simulated' };
  }

  // ── Stop & Finalize Recording ──
  async stopRecording(finalDurationSeconds = 3) {
    this._stopAudioMetering();
    let uri = null;
    const duration = Math.max(1, Math.round(finalDurationSeconds));
    
    let waveform;
    if (this.recordedWaveformSamples && this.recordedWaveformSamples.length >= 8) {
      const targetCount = 28;
      const blockSize = this.recordedWaveformSamples.length / targetCount;
      waveform = [];
      for (let i = 0; i < targetCount; i++) {
        const start = Math.floor(i * blockSize);
        const end = Math.floor((i + 1) * blockSize);
        let maxVal = 0.18;
        for (let j = start; j < end && j < this.recordedWaveformSamples.length; j++) {
          if (this.recordedWaveformSamples[j] > maxVal) {
            maxVal = this.recordedWaveformSamples[j];
          }
        }
        waveform.push(parseFloat(Math.max(0.18, Math.min(0.95, maxVal)).toFixed(2)));
      }
    } else {
      waveform = this.generateWaveform(28);
    }

    // 1. Web
    if (Platform.OS === 'web' && this.currentWebMediaRecorder) {
      try {
        await new Promise((resolve) => {
          this.currentWebMediaRecorder.onstop = resolve;
          if (this.currentWebMediaRecorder.state !== 'inactive') {
            this.currentWebMediaRecorder.stop();
          } else {
            resolve();
          }
        });

        if (this.webMediaStream) {
          this.webMediaStream.getTracks().forEach((track) => track.stop());
          this.webMediaStream = null;
        }

        if (this.webAudioChunks.length > 0) {
          const blobType = this.currentWebMediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.webAudioChunks, { type: blobType });
          uri = URL.createObjectURL(audioBlob);
        }
        this.currentWebMediaRecorder = null;
        this.webAudioChunks = [];
      } catch (e) {
        console.warn('[VoiceRecordingService] Error stopping web recorder:', e);
      }
    }

    // 2. Native
    if (this.currentNativeRecording) {
      try {
        await this.currentNativeRecording.stopAndUnloadAsync();
        uri = this.currentNativeRecording.getURI();
        this.currentNativeRecording = null;

        if (ExpoAudio) {
          await ExpoAudio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
          });
        }
      } catch (e) {
        console.warn('[VoiceRecordingService] Error stopping native recorder:', e);
      }
    }

    return {
      uri: uri || `voice-note-${Date.now()}`,
      duration,
      durationText: this.formatDuration(duration),
      waveform,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // ── Discard / Cancel Recording ──
  async cancelRecording() {
    this._stopAudioMetering();
    if (this.currentWebMediaRecorder) {
      try {
        if (this.currentWebMediaRecorder.state !== 'inactive') {
          this.currentWebMediaRecorder.stop();
        }
        if (this.webMediaStream) {
          this.webMediaStream.getTracks().forEach((track) => track.stop());
          this.webMediaStream = null;
        }
      } catch (e) {}
      this.currentWebMediaRecorder = null;
      this.webAudioChunks = [];
    }

    if (this.currentNativeRecording) {
      try {
        await this.currentNativeRecording.stopAndUnloadAsync();
        this.currentNativeRecording = null;
        if (ExpoAudio) {
          await ExpoAudio.setAudioModeAsync({ allowsRecordingIOS: false });
        }
      } catch (e) {}
    }
  }

  // ── Play Recorded Audio ──
  async playVoiceNote(uri, onProgress, onEnd, durationSeconds = 3, startFraction = 0) {
    await this.stopPlayback();
    const effectiveTotalSecs = Math.max(0.5, durationSeconds || 3);
    const initialFraction = (startFraction >= 0.98 || startFraction < 0) ? 0 : startFraction;
    const initialTimeSecs = initialFraction * effectiveTotalSecs;

    // 1. Web
    if (Platform.OS === 'web' && typeof Audio !== 'undefined' && uri && (uri.startsWith('blob:') || uri.startsWith('http') || uri.startsWith('data:'))) {
      try {
        const audio = new Audio(uri);
        audio.volume = 1.0;
        this.webAudioElement = audio;

        // Clean linear volume amplifier (boosts volume transparently with 0% voice/EQ alteration)
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          try {
            this.playbackAudioContext = new AudioCtx();
            const source = this.playbackAudioContext.createMediaElementSource(audio);
            const gainNode = this.playbackAudioContext.createGain();
            gainNode.gain.value = 1.75; // +5dB clean volume boost
            source.connect(gainNode);
            gainNode.connect(this.playbackAudioContext.destination);
          } catch (e) {
            console.warn('[VoiceRecordingService] Web Audio GainNode init:', e);
          }
        }

        // Smooth high-frequency ticker for 60fps playback progress
        const updateTick = () => {
          if (!this.webAudioElement || this.webAudioElement.paused || this.webAudioElement.ended) return;
          const curTime = this.webAudioElement.currentTime || 0;
          const dur = (Number.isFinite(this.webAudioElement.duration) && this.webAudioElement.duration > 0)
            ? this.webAudioElement.duration
            : effectiveTotalSecs;
          const progress = Math.min(1, Math.max(0, curTime / dur));
          if (onProgress) onProgress(progress, curTime, dur);
        };

        this.playbackInterval = setInterval(updateTick, 30);
        audio.ontimeupdate = updateTick;

        audio.onended = () => {
          this.stopPlayback();
          if (onProgress) onProgress(1, effectiveTotalSecs, effectiveTotalSecs);
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('[VoiceRecordingService] Web audio element playback error:', e);
          this.stopPlayback();
          if (onEnd) onEnd();
        };

        if (initialTimeSecs > 0) {
          audio.currentTime = initialTimeSecs;
        }

        await audio.play();
        return;
      } catch (e) {
        console.warn('[VoiceRecordingService] Web audio playback error:', e);
      }
    }

    // 2. Native Expo AV
    if (ExpoAudio && uri && !uri.startsWith('voice-note-') && !uri.startsWith('blob:')) {
      try {
        await ExpoAudio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });

        const { sound } = await ExpoAudio.Sound.createAsync(
          { uri },
          {
            shouldPlay: true,
            volume: 1.0,
            positionMillis: Math.round(initialTimeSecs * 1000),
            progressUpdateIntervalMillis: 30,
          },
          (status) => {
            if (status.isLoaded) {
              const dur = (status.durationMillis && status.durationMillis > 0)
                ? (status.durationMillis / 1000)
                : effectiveTotalSecs;
              const cur = (status.positionMillis || 0) / 1000;
              const progress = Math.min(1, Math.max(0, cur / dur));
              if (onProgress) onProgress(progress, cur, dur);
              if (status.didJustFinish) {
                this.stopPlayback();
                if (onProgress) onProgress(1, dur, dur);
                if (onEnd) onEnd();
              }
            }
          }
        );

        this.activeSoundObject = sound;
        return;
      } catch (e) {
        console.warn('[VoiceRecordingService] Native audio playback error:', e);
      }
    }

    // 3. Simulated Playback Animation (smooth & timed precisely to duration)
    const startMs = initialTimeSecs * 1000;
    const startTime = Date.now() - startMs;
    const durationMs = effectiveTotalSecs * 1000;
    this.playbackInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const cur = elapsed / 1000;
      if (onProgress) onProgress(progress, cur, effectiveTotalSecs);
      if (elapsed >= durationMs) {
        this.stopPlayback();
        if (onProgress) onProgress(1, effectiveTotalSecs, effectiveTotalSecs);
        if (onEnd) onEnd();
      }
    }, 30);
  }

  // ── Seek Playback ──
  async seekPlayback(fraction, durationSeconds = 3) {
    const clampedFraction = Math.min(1, Math.max(0, fraction));
    const effectiveTotalSecs = Math.max(0.5, durationSeconds || 3);
    const targetSecs = clampedFraction * effectiveTotalSecs;

    if (this.webAudioElement) {
      try {
        this.webAudioElement.currentTime = targetSecs;
      } catch (e) {}
    } else if (this.activeSoundObject) {
      try {
        await this.activeSoundObject.setPositionAsync(Math.round(targetSecs * 1000));
      } catch (e) {}
    }
  }

  // ── Stop Playback ──
  async stopPlayback() {
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }

    if (this.playbackAudioContext) {
      try {
        this.playbackAudioContext.close();
      } catch (e) {}
      this.playbackAudioContext = null;
    }

    if (this.webAudioElement) {
      try {
        this.webAudioElement.pause();
        this.webAudioElement.currentTime = 0;
      } catch (e) {}
      this.webAudioElement = null;
    }

    if (this.activeSoundObject) {
      try {
        await this.activeSoundObject.stopAsync();
        await this.activeSoundObject.unloadAsync();
      } catch (e) {}
      this.activeSoundObject = null;
    }
  }
}

export const voiceRecordingService = new VoiceRecordingService();
export default voiceRecordingService;
