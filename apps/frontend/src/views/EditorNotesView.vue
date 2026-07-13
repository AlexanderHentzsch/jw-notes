<template>
  <div id="Editor" class="container-content fontRaleway">
    <CompHeader />

    <div class="w3-container">
      <input id="title" ref="title" class="font-note-title note-inputs" v-model="title">
      <label id="label-title" for="title">
        <template v-if="title === ''">Titel</template>
        <template v-if="title !== ''">{{ getDate('day&time', date) }}</template>
      </label>
    </div>

    <AudioRecorder
      v-if="note"
      ref="audioRecorder"
      :note="note"
      :transcription-url="options.urlTranscriptionService"
      @update:note="onNoteUpdate"
    />

    <div class="w3-row" style="margin: 24px; margin-bottom: 0">
      <div v-for="(val, i) in notes" :key="i" class="w3-col m12" :style="{fontSize: options.fontSize + 'px'}">
        <div class="w3-col s12" @click="edit(i)">
          <div class="bibelReferenceContainer" v-if="typeof val === 'object'">
            <div class="bibelReferenceChild">
              <a :href="getLinkToWOL(val.val)" target="_blank">{{ getValue(val.val) }}</a>
            </div>
            <template v-for="(c, ci) in val.content" :key="ci">
              <div class="bibelReferenceChild bibelReferenceSource smallerFontSize">
                {{ c.source }}
              </div>
              <div class="bibelReferenceChild smallerFontSize">
                {{ c.content }}
              </div>
            </template>
          </div>
          <span v-if="typeof val === 'string' && val[0] !== '@'">{{ getValue(val) }}</span>
          <span v-if="typeof val === 'string' && val[0] === '@'">
            <a :href="getLinkToWOL(val)" target="_blank">{{ getValue(val) }}</a>
            <button
              @click.stop="getBibleReference(val, i)" class="btnGetBibleRef" :disabled="isLoading"
            > {{ isLoading ? 'Lädt...' : 'Laden' }}</button>
          </span>
        </div>
      </div>
    </div>

    <div>
      <div id="toolbox" class="w3-row">
        <div
          class="w3-left w3-rest container-special-btn"
          :style="{width: widthContainerSpecialBtn + 'px'}"
        >
          <button @click="addEmoji('star')" class="w3-btn w3-hover-none editor-btn">⭐</button>
          <button @click="addEmoji('questionMark')" class="w3-btn w3-hover-none editor-btn">❓</button>
          <button @click="addEmoji('video')" class="w3-btn w3-hover-none editor-btn">🎥</button>
        </div>
        <div class="w3-col w3-right" :style="{width: widthContainerStandardBtn + 'px'}">
          <button v-if="isEditingLine" @click="deleteIndex()" class="w3-btn w3-hover-none editor-btn">
            <i class="far fa-trash-alt"></i>
          </button>
          <button v-if="isEditingLine" @click="abortEdit()" class="w3-btn w3-hover-none editor-btn">
            <i class="far fa-times-circle"></i>
          </button>
          <button @click="textareaToNotes()" class="w3-btn w3-hover-none editor-btn">
            <i class="fas fa-level-up-alt"></i>
          </button>
        </div>
      </div>

      <div class="w3-container" id="container-textarea" style="padding-bottom: 16px">
        <NoteTextarea
          ref="textarea"
          @keyup.ctrl.enter.prevent="textareaToNotes()"
          @keyup.91.enter.exact.prevent="textareaToNotes()"
          @keyup.esc.exact="abortEdit()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {useTemplateRef} from 'vue';
import {store} from '@/stores/default.js';
import {getNoteById, getOptions, upsertNote} from '@/lib/storage.js';
import CompHeader from '@/components/CompHeader.vue';
import NoteTextarea from '@/components/NoteTextarea.vue';
import AudioRecorder from '@/components/AudioRecorder.vue';

export default {
  components: {CompHeader, NoteTextarea, AudioRecorder},
  setup() {
    const textarea = useTemplateRef('textarea');
    function focusTextarea() {
      textarea.value?.focus();
    }
    return {store, focusTextarea};
  },
  name: 'EditorNotes',
  data() {
    return {
      note: null,
      title: '',
      date: '',
      notes: [],
      form: {
        current: {
          text: '',
        },
      },
      options: {
        fontSize: 12,
        urlBibleReferenceDownload: '',
        urlTranscriptionService: '',
      },
      isLoading: false,
      isReady: false,
    };
  },
  computed: {
    noteId() {
      return this.$route.params.id;
    },
    isEditingLine() {
      return store.editingLineIndex !== null;
    },
    editingLineIndex() {
      return store.editingLineIndex;
    },
    documentWidth() {
      return document.getElementsByTagName('html')[0].clientWidth - (8 * 2);
    },
    widthContainerSpecialBtn() {
      let cBtn = (this.isEditingLine) ? 3 : 1;
      let deductWidth = 50 * cBtn;
      return this.documentWidth - deductWidth;
    },
    widthContainerStandardBtn() {
      let cBtn = (this.isEditingLine) ? 3 : 1;
      return 50 * cBtn;
    },
  },
  async mounted() {
    await this.loadNote();
    if (!this.note) {
      return this.$router.push('/overview/notes');
    }

    this.setDefaults();
    await this.loadFontSize();
    this.isReady = true;
    this.focusTextarea();
  },
  watch: {
    editingLineIndex() {
      this.changeTextareaContent();
    },
    async title() {
      if (!this.isReady || !this.note) return;
      this.note.title = (this.title === '') ? this.getDate('day') : this.title;
      await this.persistNote();
    },
    async notes() {
      if (!this.isReady || !this.note) return;
      this.note.notes = this.notes;
      await this.persistNote();
    },
    async date() {
      if (!this.isReady || !this.note) return;
      this.note.date = this.date;
      await this.persistNote();
    },
    async '$route.params.id'() {
      this.isReady = false;
      store.editingLineIndex = null;
      await this.loadNote();
      if (!this.note) {
        return this.$router.push('/overview/notes');
      }
      this.setDefaults();
      this.isReady = true;
      this.focusTextarea();
    },
  },
  beforeUnmount() {
    store.editingLineIndex = null;
  },
  methods: {
    async loadNote() {
      this.note = await getNoteById(this.noteId);
    },
    async persistNote() {
      if (!this.note) return;

      const audioRecorder = this.$refs.audioRecorder;
      if (audioRecorder) {
        const progress = await audioRecorder.syncProgress();
        if (progress) {
          this.note.lastProcessedSecond = progress.lastProcessedSecond;
          this.note.audioDuration = progress.audioDuration;
        }
      }

      this.note = await upsertNote({
        ...this.note,
        title: this.note.title,
        date: this.note.date,
        notes: this.note.notes,
      });
    },
    onNoteUpdate(updatedNote) {
      this.note = updatedNote;
    },
    async loadFontSize() {
      const options = await getOptions();

      if (options.fontSize !== undefined) {
        this.options.fontSize = options.fontSize;
      }
      if (options.urlBibleReferenceDownload !== undefined) {
        this.options.urlBibleReferenceDownload = options.urlBibleReferenceDownload;
      }
      if (options.urlTranscriptionService !== undefined) {
        this.options.urlTranscriptionService = options.urlTranscriptionService;
      }
    },
    getDate(type, d = new Date()) {
      const padZero = (num) => {
        return num.toString().padStart(2, '0');
      };

      if (typeof d !== 'object') {
        d = new Date(d);
      }

      let unix = d.getTime();
      let day = padZero(d.getDate());
      let month = padZero(d.getMonth() + 1);
      let year = d.getFullYear();
      let h = padZero(d.getHours());
      let min = padZero(d.getMinutes());
      let sec = padZero(d.getSeconds());

      switch (type) {
        case 'unix':
          return unix;
        case 'day&time':
          return `${day}.${month}.${year} ${h}:${min}:${sec}`;
        case 'day':
        default:
          return `${day}.${month}.${year}`;
      }
    },
    setDefaults() {
      if (!this.note) return;
      this.title = this.note.title;
      this.date = this.note.date;
      this.notes = this.note.notes;
    },
    changeTextareaContent() {
      const index = store.editingLineIndex;
      if (index === null) return;

      const note = this.notes[index];
      store.currentNode = (typeof note === 'object') ? '@' + note.val : note;
    },
    addEmoji(type) {
      let emoji = '';

      switch (type) {
        case 'star':
          emoji = '⭐';
          break;
        case 'questionMark':
          emoji = '❓';
          break;
        case 'video':
          emoji = '🎥';
          break;
        default:
          emoji = '';
      }

      store.currentNode = emoji + ' ' + store.currentNode;
      this.focusTextarea();
    },
    async textareaToNotes() {
      this.date = this.getDate('unix');

      let val = store.currentNode.trim();
      const index = store.editingLineIndex;
      const note = index !== null ? this.notes[index] : undefined;

      if (typeof note !== 'object' || '@' + note?.val !== val) {
        let regex = /[0-9]:[0-9]/;
        let isBible = val.match(regex) !== null;
        let isSigned = val[0] === '@';

        if (isBible && !isSigned) {
          val = '@' + val;
        }

        if (val !== '') {
          if (index !== null) {
            this.notes[index] = val;
          } else {
            this.notes.push(val);
          }
        } else if (index !== null) {
          this.deleteIndex();
          return;
        }
      }

      store.currentNode = '';
      store.editingLineIndex = null;
      await this.persistNote();
      this.focusTextarea();
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    },
    edit(index) {
      if (index < 0 || index >= this.notes.length || index === store.editingLineIndex)
        return;

      store.editingLineIndex = index;
      this.focusTextarea();
    },
    abortEdit() {
      store.currentNode = '';
      store.editingLineIndex = null;
      this.focusTextarea();
    },
    async deleteIndex() {
      const index = store.editingLineIndex;
      if (index === null) return;
      this.notes.splice(index, 1);
      this.abortEdit();
      await this.persistNote();
    },
    getValue(val) {
      let first = val[0];
      if (first === '@')
        return val.substr(1);

      if (val === '')
        return ' ';

      return val;
    },
    getLinkToWOL(searchStr) {
      searchStr = this.getValue(searchStr);
      return 'https://wol.jw.org/de/wol/l/r10/lp-x?q=' + encodeURIComponent(searchStr);
    },
    async getBibleReference(val, index) {
      val = this.getValue(val);
      try {
        this.isLoading = true;
        const response = await fetch(this.options.urlBibleReferenceDownload + '?bible_reference=' + encodeURIComponent(val));
        const json = {};
        json.val = val;
        json.comment = '';
        json.content = await response.json();
        this.notes[index] = json;
        await this.persistNote();
      } catch (e) {
        alert('Beim Laden trat ein Fehler aus.');
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
#title {
  font-size: 26px;
}

#label-title {
  font-size: 12px;
  margin-left: 8px;
}

.note-inputs {
  background-color: inherit;
  color: inherit;
  border: none;
  border-bottom: 1px solid var(--color-border);
  display: block;
  width: 100%;
  margin: 0;
  padding: 2px 8px;
  overflow: hidden;
}

.editor-btn {
  width: 50px;
  height: 50px;
}

.container-special-btn {
  white-space: nowrap;
  display: inline;
  overflow-x: auto;
  max-width: 100%;
}

.bibelReferenceContainer {
  border: var(--color-surface) 1px solid;
  border-radius: 4px;
  margin-top: 4px;
}

.bibelReferenceSource {
  border-top: var(--color-surface) 1px solid;
  border-bottom: var(--color-surface) 1px solid;
  background-color: var(--color-surface);
}

.bibelReferenceChild {
  padding: 4px 8px;
}

.smallerFontSize {
  font-size: 0.8em;
}

.btnGetBibleRef {
  margin-left: 8px;
  font-size: 0.7em;
}

.btnGetBibleRef:disabled {
  color: var(--color-disabled-text);
}
</style>
