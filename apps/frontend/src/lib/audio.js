const TIMESLICE_MS = 1000;

function pickMimeType() {
  if (typeof MediaRecorder === 'undefined') return null;
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    return 'audio/webm;codecs=opus';
  }
  if (MediaRecorder.isTypeSupported('audio/webm')) {
    return 'audio/webm';
  }
  if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
    return 'audio/ogg;codecs=opus';
  }
  return '';
}

export function isRecordingSupported() {
  return typeof navigator !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia
    && typeof MediaRecorder !== 'undefined';
}

export function formatRecordingTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export class NoteAudioRecorder {
  constructor() {
    this.savedBlob = null;
    this.sessionChunks = [];
    this.mediaRecorder = null;
    this.stream = null;
    this.mimeType = pickMimeType();
    this.accumulatedSeconds = 0;
    this.sessionStartedAt = null;
    this.recordingSeconds = 0;
    this._timer = null;
  }

  get isRecording() {
    return this.mediaRecorder?.state === 'recording';
  }

  async start() {
    if (!isRecordingSupported()) {
      throw new Error('Audioaufnahme wird in diesem Browser nicht unterstützt.');
    }
    if (this.isRecording) return;

    this.sessionChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: this.mimeType || undefined});
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.sessionChunks.push(event.data);
      }
    };
    this.mediaRecorder.start(TIMESLICE_MS);
    this.sessionStartedAt = Date.now();
    this._startTimer();
  }

  async stop() {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
      return this.savedBlob;
    }

    const sessionBlob = await this._stopMediaRecorder();
    this._finalizeSessionElapsed();

    if (sessionBlob?.size > 0) {
      this.savedBlob = await mergeAudioBlobs(this.savedBlob, sessionBlob);
      const duration = await getBlobDurationSeconds(this.savedBlob);
      if (duration > 0) {
        this.accumulatedSeconds = duration;
        this.recordingSeconds = duration;
      }
    }

    this.sessionChunks = [];
    this.sessionStartedAt = null;
    return this.savedBlob;
  }

  async _stopMediaRecorder() {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
      return null;
    }

    return new Promise((resolve) => {
      const recorder = this.mediaRecorder;
      recorder.onstop = () => {
        const sessionBlob = this.sessionChunks.length
          ? new Blob(this.sessionChunks, {type: this.mimeType || 'audio/webm'})
          : null;
        this._cleanupStream();
        this.mediaRecorder = null;
        resolve(sessionBlob);
      };
      try {
        if (recorder.state === 'recording' || recorder.state === 'paused') {
          if (typeof recorder.requestData === 'function') {
            recorder.requestData();
          }
          recorder.stop();
        }
      } catch {
        this.mediaRecorder = null;
        resolve(null);
      }
      this._stopTimer();
    });
  }

  _finalizeSessionElapsed() {
    if (this.sessionStartedAt !== null) {
      const sessionSec = Math.floor((Date.now() - this.sessionStartedAt) / 1000);
      this.recordingSeconds = this.accumulatedSeconds + sessionSec;
      this.sessionStartedAt = null;
    }
  }

  _cleanupStream() {
    if (this.stream) {
      for (const track of this.stream.getTracks()) {
        track.stop();
      }
      this.stream = null;
    }
  }

  _startTimer() {
    this._stopTimer(false);
    this._timer = setInterval(() => {
      this._updateRecordingSeconds();
    }, 250);
  }

  _stopTimer(finalize = true) {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    if (finalize) {
      this._updateRecordingSeconds();
    }
  }

  _updateRecordingSeconds() {
    if (this.sessionStartedAt !== null) {
      const sessionSec = Math.floor((Date.now() - this.sessionStartedAt) / 1000);
      this.recordingSeconds = this.accumulatedSeconds + sessionSec;
    } else {
      this.recordingSeconds = this.accumulatedSeconds;
    }
  }

  async getCombinedBlob() {
    if (!this.isRecording) {
      return this.savedBlob;
    }

    const sessionBlob = this.sessionChunks.length
      ? new Blob(this.sessionChunks, {type: this.mimeType || 'audio/webm'})
      : null;

    if (!sessionBlob?.size) {
      return this.savedBlob;
    }

    try {
      return await mergeAudioBlobs(this.savedBlob, sessionBlob);
    } catch {
      return this.savedBlob;
    }
  }

  loadBlob(blob, durationSeconds = 0) {
    this.savedBlob = blob;
    this.accumulatedSeconds = durationSeconds;
    this.recordingSeconds = durationSeconds;
    this.sessionChunks = [];
    this.sessionStartedAt = null;
  }

  async extractLastSeconds(seconds) {
    const windowSeconds = Math.max(1, Math.floor(seconds));
    const totalSeconds = this.recordingSeconds;

    if (totalSeconds <= 0) {
      throw new Error('Keine Aufnahme vorhanden.');
    }

    const fromSecond = Math.max(0, totalSeconds - windowSeconds);
    const effectiveWindow = totalSeconds - fromSecond;
    const blob = await this.getCombinedBlob();

    if (!blob) {
      throw new Error('Keine Aufnahme vorhanden.');
    }

    try {
      const trimmed = await trimBlobToLastSeconds(blob, effectiveWindow);
      return {
        blob: trimmed,
        fromSecond,
        toSecond: totalSeconds,
        windowSeconds: effectiveWindow,
      };
    } catch {
      return {
        blob,
        fromSecond,
        toSecond: totalSeconds,
        windowSeconds: effectiveWindow,
      };
    }
  }

  dispose() {
    this._stopTimer();
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this._cleanupStream();
    this.mediaRecorder = null;
  }
}

async function decodeBlob(audioContext, blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer.slice(0));
}

function concatAudioBuffers(audioContext, first, second) {
  const channels = Math.max(first.numberOfChannels, second.numberOfChannels);
  const sampleRate = first.sampleRate;
  const length = first.length + second.length;
  const merged = audioContext.createBuffer(channels, length, sampleRate);

  for (let channel = 0; channel < channels; channel++) {
    const output = merged.getChannelData(channel);
    const firstData = first.getChannelData(Math.min(channel, first.numberOfChannels - 1));
    const secondData = second.getChannelData(Math.min(channel, second.numberOfChannels - 1));
    output.set(firstData, 0);
    output.set(secondData, first.length);
  }

  return merged;
}

async function mergeAudioBlobs(priorBlob, sessionBlob) {
  if (!priorBlob?.size) {
    return sessionBlob;
  }
  if (!sessionBlob?.size) {
    return priorBlob;
  }

  const audioContext = new AudioContext();
  try {
    const [priorBuffer, sessionBuffer] = await Promise.all([
      decodeBlob(audioContext, priorBlob),
      decodeBlob(audioContext, sessionBlob),
    ]);
    const merged = concatAudioBuffers(audioContext, priorBuffer, sessionBuffer);
    return audioBufferToWavBlob(merged);
  } finally {
    await audioContext.close();
  }
}

async function getBlobDurationSeconds(blob) {
  if (!blob?.size) return 0;
  const audioContext = new AudioContext();
  try {
    const audioBuffer = await decodeBlob(audioContext, blob);
    return Math.floor(audioBuffer.duration);
  } catch {
    return 0;
  } finally {
    await audioContext.close();
  }
}

async function trimBlobToLastSeconds(blob, seconds) {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContext();
  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    const sampleRate = audioBuffer.sampleRate;
    const startTime = Math.max(0, audioBuffer.duration - seconds);
    const frameCount = Math.floor(Math.min(seconds, audioBuffer.duration) * sampleRate);
    const offline = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      frameCount,
      sampleRate,
    );
    const source = offline.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offline.destination);
    source.start(0, startTime);
    const rendered = await offline.startRendering();
    return audioBufferToWavBlob(rendered);
  } finally {
    await audioContext.close();
  }
}

function audioBufferToWavBlob(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const samples = audioBuffer.length;
  const blockAlign = (numChannels * bitDepth) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = audioBuffer.getChannelData(channel)[i];
      const clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([buffer], {type: 'audio/wav'});
}

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
