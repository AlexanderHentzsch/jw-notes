import localforage from 'localforage';

const lf = localforage.createInstance({name: 'jw-notes'});

const KEYS = {
  DB: 'DB',
  OPTIONS: 'options',
  META: '_meta',
};

function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultAudioFields() {
  return {
    audioId: null,
    audioDuration: 0,
    lastProcessedSecond: 0,
    transcriptions: [],
  };
}

export function migrateLegacyNote(note) {
  return {
    id: crypto.randomUUID(),
    title: note.title ?? '',
    date: note.date ?? Date.now(),
    notes: Array.isArray(note.notes) ? note.notes : [],
    ...defaultAudioFields(),
    updatedAt: new Date().toISOString(),
    revision: 1,
    syncStatus: 'synced',
  };
}

function ensureNoteFields(note) {
  if (!note.id) {
    return migrateLegacyNote(note);
  }
  return {
    ...note,
    audioId: note.audioId ?? null,
    audioDuration: note.audioDuration ?? 0,
    lastProcessedSecond: note.lastProcessedSecond ?? 0,
    transcriptions: Array.isArray(note.transcriptions) ? note.transcriptions : [],
    updatedAt: note.updatedAt ?? new Date().toISOString(),
    revision: note.revision ?? 1,
    syncStatus: note.syncStatus ?? 'synced',
    notes: Array.isArray(note.notes) ? note.notes : [],
  };
}

function audioKey(audioId) {
  return `audio:${audioId}`;
}

export async function saveAudioBlob(audioId, blob) {
  if (!audioId || !blob) return;
  await lf.setItem(audioKey(audioId), blob);
}

export async function getAudioBlob(audioId) {
  if (!audioId) return null;
  return lf.getItem(audioKey(audioId));
}

export async function deleteAudioBlob(audioId) {
  if (!audioId) return;
  await lf.removeItem(audioKey(audioId));
}

function touchNote(note) {
  return {
    ...note,
    updatedAt: new Date().toISOString(),
    revision: (note.revision ?? 0) + 1,
  };
}

async function migrateFromLocalStorage() {
  const meta = await lf.getItem(KEYS.META);
  if (meta?.migratedFromLocalStorage) {
    return;
  }

  const legacyDb = localStorage.getItem(KEYS.DB);
  if (legacyDb !== null) {
    const parsed = JSON.parse(legacyDb);
    if (Array.isArray(parsed)) {
      const notes = parsed.map(migrateLegacyNote);
      await lf.setItem(KEYS.DB, notes);
    }
    localStorage.removeItem(KEYS.DB);
  }

  const legacyOptions = localStorage.getItem(KEYS.OPTIONS);
  if (legacyOptions !== null) {
    await lf.setItem(KEYS.OPTIONS, JSON.parse(legacyOptions));
    localStorage.removeItem(KEYS.OPTIONS);
  }

  await lf.setItem(KEYS.META, {migratedFromLocalStorage: true});
}

export async function initStorage() {
  await migrateFromLocalStorage();
}

export async function getNotes() {
  const notes = await lf.getItem(KEYS.DB);
  return Array.isArray(notes) ? notes : [];
}

export async function saveNotes(notes) {
  await lf.setItem(KEYS.DB, toPlain(notes));
}

export async function getNoteById(id) {
  const notes = await getNotes();
  return notes.find((n) => n.id === id) ?? null;
}

export async function upsertNote(note) {
  const notes = await getNotes();
  const normalized = ensureNoteFields(toPlain(note));
  const index = notes.findIndex((n) => n.id === normalized.id);

  if (index === -1) {
    const created = touchNote({...normalized, revision: normalized.revision ?? 1});
    notes.push(created);
    await saveNotes(notes);
    return created;
  }

  const updated = touchNote({...notes[index], ...normalized});
  notes[index] = updated;
  await saveNotes(notes);
  return updated;
}

export async function createNote({title, date, notes: lines = []}) {
  const note = migrateLegacyNote({title, date, notes: lines});
  const notes = await getNotes();
  notes.push(note);
  await saveNotes(notes);
  return note;
}

export async function getOptions() {
  const options = await lf.getItem(KEYS.OPTIONS);
  return options ?? {};
}

export async function saveOptions(options) {
  await lf.setItem(KEYS.OPTIONS, toPlain(options));
}

export async function importNotes(rawJson) {
  const parsed = JSON.parse(rawJson);
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid JSON: expected an array of notes');
  }
  const notes = parsed.map(ensureNoteFields);
  await saveNotes(notes);
  return notes;
}

export async function clearNotes() {
  await lf.setItem(KEYS.DB, []);
}
