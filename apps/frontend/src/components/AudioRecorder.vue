<template>
  <div class="audio-recorder w3-container container-theme">
    <div class="audio-bar">
      <button
        type="button"
        class="audio-btn record-btn"
        :class="{ recording: recordingActive }"
        :disabled="!supported"
        :title="recordButtonTitle"
        @click="toggleRecording"
      >
        <span v-if="recordingActive" class="record-dot"></span>
        <i :class="recordingActive ? 'fas fa-stop' : 'fas fa-microphone'"></i>
      </button>

      <span class="audio-time">{{ formattedTime }}</span>

      <button
        v-if="hasRecording && !recordingActive"
        type="button"
        class="audio-btn play-btn"
        :title="isPlaying ? 'Pause' : 'Abspielen'"
        @click="togglePlayback"
      >
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>

      <button
        v-if="hasRecording && !recordingActive"
        type="button"
        class="audio-btn delete-btn"
        title="Aufnahme löschen"
        @click="deleteRecording"
      >
        <i class="far fa-trash-alt"></i>
      </button>

      <span v-if="recordingActive" class="recording-label">Aufnahme läuft</span>
      <span v-else-if="hasRecording" class="recording-label stopped">Aufnahme bereit</span>

      <button
        type="button"
        class="audio-btn transcribe-btn"
        :disabled="!canTranscribe"
        @click="openWindowDialog"
      >
        Transkribieren
      </button>
    </div>

    <audio
      v-if="playbackUrl"
      ref="player"
      :src="playbackUrl"
      @ended="onPlaybackEnded"
      @pause="onPlaybackPause"
    ></audio>

    <div v-if="showWindowDialog" class="window-dialog">
      <p class="window-dialog-title">Letzten wie viele Sekunden?</p>
      <div class="window-dialog-actions">
        <button
          v-for="sec in windowOptions"
          :key="sec"
          type="button"
          class="window-option"
          @click="startTranscription(sec)"
        >
          {{ sec }} Sek.
        </button>
        <button type="button" class="window-cancel" @click="showWindowDialog = false">Abbrechen</button>
      </div>
    </div>

    <div v-if="transcriptionState !== 'idle'" class="transcription-area">
      <div v-if="transcriptionState === 'loading'" class="skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line skeleton-line-short"></div>
        <div class="skeleton-line skeleton-line-medium"></div>
      </div>
      <div v-else-if="transcriptionState === 'error'" class="transcription-error">
        {{ transcriptionError }}
      </div>
      <div v-else-if="transcriptionState === 'done'" class="transcription-text">
        <span class="transcription-meta">{{ transcriptionMeta }}</span>
        {{ latestTranscript }}
      </div>
    </div>
  </div>
</template>

<script>
import {NoteAudioRecorder, formatRecordingTime, isRecordingSupported} from '@/lib/audio.js';
import {
  createTranscriptionEntry,
  requestTranscription,
  TRANSCRIPTION_WINDOW_OPTIONS,
} from '@/lib/transcription.js';
import {getAudioBlob, saveAudioBlob, deleteAudioBlob, upsertNote} from '@/lib/storage.js';

export default {
  name: 'AudioRecorder',
  props: {
    note: {
      type: Object,
      required: true,
    },
    transcriptionUrl: {
      type: String,
      default: '',
    },
  },
  emits: ['update:note'],
  data() {
    return {
      recorder: null,
      supported: isRecordingSupported(),
      recordingActive: false,
      elapsedSeconds: 0,
      uiTimer: null,
      playbackUrl: null,
      isPlaying: false,
      showWindowDialog: false,
      windowOptions: TRANSCRIPTION_WINDOW_OPTIONS,
      transcriptionState: 'idle',
      transcriptionError: '',
      latestTranscript: '',
      transcriptionMeta: '',
    };
  },
  computed: {
    formattedTime() {
      return formatRecordingTime(this.elapsedSeconds);
    },
    hasRecording() {
      return this.elapsedSeconds > 0 || !!this.playbackUrl;
    },
    canTranscribe() {
      return !!this.transcriptionUrl
        && (this.recordingActive ? this.elapsedSeconds > 0 : this.hasRecording)
        && this.transcriptionState !== 'loading';
    },
    recordButtonTitle() {
      if (!this.supported) return 'Nicht unterstützt';
      return this.recordingActive ? 'Aufnahme stoppen' : (this.hasRecording ? 'Aufnahme fortsetzen' : 'Aufnahme starten');
    },
  },
  async mounted() {
    this.recorder = new NoteAudioRecorder();
    this.elapsedSeconds = this.note.audioDuration ?? 0;

    if (this.note.audioId) {
      const blob = await getAudioBlob(this.note.audioId);
      if (blob) {
        this.recorder.loadBlob(blob, this.note.audioDuration ?? 0);
        this.setPlaybackBlob(blob);
      }
    }

    this.restoreLatestTranscript();
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  },
  beforeUnmount() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.stopUiTimer();
    this.revokePlaybackUrl();
    this.recorder?.dispose();
  },
  methods: {
    restoreLatestTranscript() {
      const entries = this.note.transcriptions ?? [];
      if (!entries.length) return;
      const latest = entries[entries.length - 1];
      this.latestTranscript = latest.text;
      this.transcriptionMeta = this.formatTranscriptionMeta(latest);
      this.transcriptionState = 'done';
    },
    formatTranscriptionMeta(entry) {
      return `[${formatRecordingTime(entry.fromSecond)}–${formatRecordingTime(entry.toSecond)}] `;
    },
    startUiTimer() {
      this.stopUiTimer();
      this.uiTimer = setInterval(() => {
        if (this.recorder) {
          this.elapsedSeconds = this.recorder.recordingSeconds;
        }
      }, 250);
    },
    stopUiTimer() {
      if (this.uiTimer) {
        clearInterval(this.uiTimer);
        this.uiTimer = null;
      }
    },
    setPlaybackBlob(blob) {
      if (!blob) return;
      this.revokePlaybackUrl();
      this.playbackUrl = URL.createObjectURL(blob);
    },
    revokePlaybackUrl() {
      if (this.playbackUrl) {
        URL.revokeObjectURL(this.playbackUrl);
        this.playbackUrl = null;
      }
      this.isPlaying = false;
    },
    async toggleRecording() {
      if (!this.supported) return;

      try {
        if (this.recordingActive) {
          await this.stopRecording();
        } else {
          await this.startRecording();
        }
      } catch (e) {
        this.recordingActive = false;
        this.stopUiTimer();
        alert(e.message || 'Aufnahmefehler.');
      }
    },
    async startRecording() {
      this.stopPlayback();

      let audioId = this.note.audioId;
      if (!audioId) {
        audioId = crypto.randomUUID();
        await this.emitNoteUpdate({audioId});
      }

      await this.recorder.start();
      this.recordingActive = true;
      this.startUiTimer();
    },
    async stopRecording() {
      const blob = await this.recorder.stop();
      this.recordingActive = false;
      this.stopUiTimer();

      const duration = this.recorder.recordingSeconds;
      this.elapsedSeconds = duration;

      if (blob && this.note.audioId) {
        await saveAudioBlob(this.note.audioId, blob);
        this.setPlaybackBlob(blob);
      }

      await this.emitNoteUpdate({
        audioDuration: duration,
        lastProcessedSecond: duration,
      });
    },
    stopPlayback() {
      const player = this.$refs.player;
      if (player && !player.paused) {
        player.pause();
      }
      this.isPlaying = false;
    },
    togglePlayback() {
      const player = this.$refs.player;
      if (!player) return;

      if (player.paused) {
        player.play().then(() => {
          this.isPlaying = true;
        }).catch(() => {
          alert('Wiedergabe fehlgeschlagen.');
        });
      } else {
        player.pause();
      }
    },
    onPlaybackEnded() {
      this.isPlaying = false;
    },
    onPlaybackPause() {
      this.isPlaying = false;
    },
    async deleteRecording() {
      if (this.recordingActive) return;
      if (!confirm('Aufnahme wirklich löschen?')) return;

      this.stopPlayback();
      this.revokePlaybackUrl();

      if (this.note.audioId) {
        await deleteAudioBlob(this.note.audioId);
      }

      this.recorder.loadBlob(null, 0);
      this.elapsedSeconds = 0;
      this.transcriptionState = 'idle';
      this.transcriptionError = '';
      this.latestTranscript = '';
      this.transcriptionMeta = '';
      this.showWindowDialog = false;

      await this.emitNoteUpdate({
        audioId: null,
        audioDuration: 0,
        lastProcessedSecond: 0,
        transcriptions: [],
      });
    },
    openWindowDialog() {
      if (!this.canTranscribe) return;
      this.showWindowDialog = true;
    },
    async startTranscription(windowSeconds) {
      this.showWindowDialog = false;
      this.transcriptionState = 'loading';
      this.transcriptionError = '';

      try {
        const {blob, fromSecond, toSecond} = await this.recorder.extractLastSeconds(windowSeconds);
        const text = await requestTranscription({
          serviceUrl: this.transcriptionUrl,
          audioBlob: blob,
          fromSecond,
          toSecond,
          windowSeconds,
          noteId: this.note.id,
        });

        const entry = createTranscriptionEntry({
          text,
          windowSeconds,
          fromSecond,
          toSecond,
        });

        const transcriptions = [...(this.note.transcriptions ?? []), entry];
        await this.emitNoteUpdate({transcriptions});

        this.latestTranscript = text;
        this.transcriptionMeta = this.formatTranscriptionMeta(entry);
        this.transcriptionState = 'done';
      } catch (e) {
        this.transcriptionError = e.message || 'Transkription fehlgeschlagen.';
        this.transcriptionState = 'error';
      }
    },
    async syncProgress() {
      if (!this.recorder || !this.recordingActive) {
        return null;
      }

      const seconds = this.recorder.recordingSeconds;
      this.elapsedSeconds = seconds;

      const blob = await this.recorder.getCombinedBlob();
      if (blob && this.note.audioId) {
        await saveAudioBlob(this.note.audioId, blob);
      }

      return {
        lastProcessedSecond: seconds,
        audioDuration: seconds,
      };
    },
    async emitNoteUpdate(partial) {
      const updated = await upsertNote({...this.note, ...partial});
      this.$emit('update:note', updated);
    },
    onVisibilityChange() {
      if (document.visibilityState === 'hidden' && this.recordingActive) {
        this.syncProgress().then((progress) => {
          if (progress) {
            this.emitNoteUpdate(progress);
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.audio-recorder {
  padding-top: 8px;
  padding-bottom: 8px;
}

.audio-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.audio-btn {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: inherit;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 14px;
}

.audio-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.record-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.record-btn.recording {
  border-color: #e53935;
}

.play-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.delete-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-color: #e53935;
}

.record-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e53935;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.audio-time {
  font-variant-numeric: tabular-nums;
  font-size: 18px;
  min-width: 48px;
}

.recording-label {
  font-size: 12px;
  color: #e53935;
}

.recording-label.stopped {
  color: var(--color-text-muted);
}

.transcribe-btn {
  margin-left: auto;
}

.window-dialog {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
}

.window-dialog-title {
  margin: 0 0 8px;
  font-size: 14px;
}

.window-dialog-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.window-option,
.window-cancel {
  border: 1px solid var(--color-border);
  background: inherit;
  color: inherit;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
}

.transcription-area {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  min-height: 48px;
  font-family: Consolas, 'Courier New', monospace;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  margin-bottom: 8px;
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-border) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

.skeleton-line-short {
  width: 60%;
}

.skeleton-line-medium {
  width: 85%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.transcription-text {
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
  color: var(--color-text);
}

.transcription-meta {
  color: var(--color-accent);
  font-size: 0.85em;
}

.transcription-error {
  color: #e53935;
  font-size: 14px;
}
</style>
