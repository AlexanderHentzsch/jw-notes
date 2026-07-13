/**
 * Sends an audio slice to the configured transcription service.
 *
 * Expected API:
 * POST {urlTranscriptionService}
 * Content-Type: multipart/form-data
 *   - audio: Blob
 *   - from_second: number
 *   - to_second: number
 *   - window_seconds: number
 *   - note_id: string
 *
 * Response JSON: { "text": "..." }
 */
export async function requestTranscription({
  serviceUrl,
  audioBlob,
  fromSecond,
  toSecond,
  windowSeconds,
  noteId,
}) {
  if (!serviceUrl) {
    throw new Error('Keine Transkriptions-URL in den Optionen hinterlegt.');
  }
  if (!audioBlob) {
    throw new Error('Kein Audio für die Transkription vorhanden.');
  }

  const formData = new FormData();
  formData.append('audio', audioBlob, 'segment.webm');
  formData.append('from_second', String(fromSecond));
  formData.append('to_second', String(toSecond));
  formData.append('window_seconds', String(windowSeconds));
  formData.append('note_id', noteId);

  const response = await fetch(serviceUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transkription fehlgeschlagen (${response.status}).`);
  }

  const json = await response.json();
  if (typeof json.text !== 'string') {
    throw new Error('Ungültige Antwort vom Transkriptions-Dienst.');
  }

  return json.text;
}

export function createTranscriptionEntry({text, windowSeconds, fromSecond, toSecond}) {
  return {
    id: crypto.randomUUID(),
    text,
    windowSeconds,
    fromSecond,
    toSecond,
    createdAt: new Date().toISOString(),
  };
}

export const TRANSCRIPTION_WINDOW_OPTIONS = [10, 15, 30];
