<template>
  <div id="Editor" class="container-content fontRaleway">
    <CompHeader />

    <div class="w3-container container-theme">
      <input id="title" ref="title" class="font-note-title note-inputs" v-model="title">
      <label id="label-title" for="title">
        <template v-if="title === ''">Titel</template>
        <template v-if="title !== ''">{{ getDate('day&time', date) }}</template>
      </label>
    </div>

    <div class="container-notes w3-row" style="margin: 24px; margin-bottom: 0">
      <div v-for="(val, i) in notes" :key="i" class="w3-col m12" :style="{fontSize: options.fontSize + 'px'}">
        <div class="val-content w3-col s12" @click="edit(i)">
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

    <div class="container-input">
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
          <button v-if="routerHasIndex" @click="deleteIndex()" class="w3-btn w3-hover-none editor-btn">
            <i class="far fa-trash-alt"></i>
          </button>
          <button v-if="routerHasIndex" @click="abortEdit()" class="w3-btn w3-hover-none editor-btn">
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
import CompHeader from '@/components/CompHeader.vue';
import NoteTextarea from '@/components/NoteTextarea.vue';

export default {
  components: {CompHeader, NoteTextarea},
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
      },
      textareaHeight: 32,
      defaultTextareaHeight: 32,
      jsonDB: [],
      isLoading: false,
    };
  },
  computed: {
    styleMarginBottom() {
      const h = window.innerHeight;
      return {height: ((h < 300) ? 300 : h - 200) + 'px'};
    },
    currentId() {
      const id = this.$route.params.idNotes;
      return (id === 'new') ? 'new' : (parseInt(id) - 1);
    },
    routerHasIndex() {
      return !(this.$route.query.index === undefined);
    },
    documentWidth() {
      return document.getElementsByTagName('html')[0].clientWidth - (8 * 2);
    },
    widthContainerSpecialBtn() {
      let cBtn = (this.routerHasIndex) ? 3 : 1;
      let deductWidth = 50 * cBtn;
      return this.documentWidth - deductWidth;
    },
    widthContainerStandardBtn() {
      let cBtn = (this.routerHasIndex) ? 3 : 1;
      return 50 * cBtn;
    },
  },
  mounted() {
    const saveData = localStorage.getItem('DB');
    if (saveData)
      this.jsonDB = JSON.parse(saveData);

    let id = this.currentId;

    if (id === 'new') {
      this.createNewNotesArray();
      this.$refs.title.focus();
    } else if (this.jsonDB[id] === undefined) {
      return this.$router.push('/overview/notes');
    } else {
      this.focusTextarea();
    }

    this.setDefaults();
    this.loadFontSize();
  },
  watch: {
    '$route.query.index'() {
      this.changeTextareaContent();
    },
    'title'() {
      this.jsonDB[this.currentId].title = (this.title === '') ? this.getDate('day') : this.title;
      this.saveInLocalStorage();
    },
    'notes'() {
      this.jsonDB[this.currentId].notes = this.notes;
    },
    'date'() {
      this.jsonDB[this.currentId].date = this.date;
      this.saveInLocalStorage();
    },
  },
  methods: {
    loadFontSize() {
      let options = localStorage.getItem('options');

      if (options === undefined || options === null)
        return;

      options = JSON.parse(options);
      if (options.hasOwnProperty('fontSize')) {
        this.options.fontSize = options.fontSize;
      }
      this.options.urlBibleReferenceDownload = options.urlBibleReferenceDownload;
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
      const cJSON = this.jsonDB[this.currentId];
      if (cJSON === undefined) {
        this.title = this.getDate('day');
        this.date = this.getDate('unix');
        this.notes = [];
      } else {
        this.title = cJSON.title;
        this.date = cJSON.date;
        this.notes = cJSON.notes;
      }
    },
    createNewNotesArray() {
      const title = this.getDate('day');
      const date = this.getDate('unix');
      const notes = [];
      this.jsonDB.push({title, date, notes});
      this.saveInLocalStorage();
      this.$router.push(`/editor/notes/${this.jsonDB.length}`);
    },
    saveInLocalStorage() {
      localStorage.setItem('DB', JSON.stringify(this.jsonDB));
    },
    changeTextareaContent() {
      let index = this.$route.query.index;
      if (index === undefined)
        return;

      index = parseInt(index);

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
    textareaToNotes() {
      this.date = this.getDate('unix');

      let val = store.currentNode.trim();
      let id = this.$route.params.idNotes;
      let index = this.$route.query.index;
      const note = this.notes[index];

      if (typeof note !== 'object' || '@' + note?.val !== val) {
        let regex = /[0-9]:[0-9]/;
        let isBible = val.match(regex) !== null;
        let isSigned = val[0] === '@';

        if (isBible && !isSigned) {
          val = '@' + val;
        }

        if (val !== '') {
          if (index !== undefined) {
            index = parseInt(index);
            this.notes[index] = val;
          } else {
            this.notes.push(val);
          }
        } else if (!!index) {
          this.deleteIndex();
        }
      }

      store.currentNode = '';
      this.saveInLocalStorage();
      this.focusTextarea();
      this.$router.push(`/editor/notes/${id}`);
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    },
    edit(index) {
      if (index < 0 || index >= this.notes.length || index === parseInt(this.$route.query.index))
        return;

      let id = this.$route.params.idNotes;
      this.$router.push(`/editor/notes/${id}?index=${index}`);

      this.focusTextarea();
      this.textareaHeight = parseInt(this.defaultTextareaHeight);
    },
    abortEdit() {
      let id = this.$route.params.idNotes;
      let index = this.$route.query.index;

      store.currentNode = '';
      this.textareaHeight = parseInt(this.defaultTextareaHeight);
      if (index !== undefined)
        this.$router.push(`/editor/notes/${id}`);
      this.focusTextarea();
    },
    deleteIndex() {
      let index = parseInt(this.$route.query.index);
      this.notes.splice(index, 1);
      this.abortEdit();
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
        this.saveInLocalStorage();
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
  border-bottom: 1px solid rgb(97, 97, 97);
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
  border: #37474F 1px solid;
  border-radius: 4px;
  margin-top: 4px;
}

.bibelReferenceSource {
  border-top: #37474F 1px solid;
  border-bottom: #37474F 1px solid;
  background-color: #37474F;
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
  color: #000;
}
</style>
