<template>
  <div id="Editor" class="container-content fontRaleway">
    <comp-header></comp-header>

    <div class="w3-container container-theme">
      <input id="title" ref="title" class="font-note-title note-inputs" v-model="title">
      <label id="label-title" for="title">
        <template v-if="title === ''">Titel</template>
        <template v-if="title !== ''">{{ getDate('day&time', date) }}</template>
      </label>
    </div>

    <div class="container-notes w3-row" style="margin: 24px 24px; height: 100%">
      <div v-for="(val, i) in notes" class="w3-col m12" :style="{fontSize: options.fontSize + 'px'}">
        <div class="val-content w3-col s12" @click="edit(i)">
          <span v-if="val[0] !== '@'">{{ getValue(val) }}</span>
          <span v-if="val[0] === '@'">
            <a :href="getLinkToWOL(val)" target="_blank">{{ getValue(val) }}</a>
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
        <textarea
          v-model="form.current.text"
          ref="textarea"
          @keyup.ctrl.enter.prevent="textareaToNotes()"
          @keyup.91.enter.exact.prevent="textareaToNotes()"
          @keyup.esc.exact="abortEdit()"
          @keyup="setTextareaHeight()"
          class="note-inputs"
          :style="{resize: 'none', height: textareaHeight + 'px'}"
        ></textarea>
      </div>
    </div>

    <div
      id="container-textarea-height"
      ref="textarea-height"
      class="w3-container note-inputs"
      :style="{position: 'fixed', visibility: 'hidden', width: textareaWidth + 'px'}"
    >
      {{ form.current.text }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'Editor',
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
      },
      textareaHeight: 32,
      defaultTextareaHeight: 32,
      jsonDB: [],
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
      return document.getElementsByTagName('html')[0].clientWidth - (8 * 2); /* padding */
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
    textareaWidth() {
      this.$nextTick(() => {
        let DOM = this.$refs.textarea;
        return (DOM === null) ? 300 : DOM.offsetWidth;
      });
    },
  },
  mounted() {
    const saveData = localStorage.getItem('DB');
    if (saveData)
      this.jsonDB = JSON.parse(saveData);

    let id = this.currentId; // currentIndex;

    if (id === 'new') {
      this.createNewNotesArray();
      this.$refs.title.focus();
    } else if (this.jsonDB[id] === undefined) {
      return this.$router.push('/overview/notes');
    } else {
      this.$refs.textarea.focus();
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

      this.form.current.text = this.notes[index];
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

      this.form.current.text = emoji + ' ' + this.form.current.text;
      this.$refs.textarea.focus();
    },
    textareaToNotes() {
      this.date = this.getDate('unix');

      let val = this.form.current.text.trim();
      let id = this.$route.params.idNotes;
      let index = this.$route.query.index;

      let regex = /[0-9]:[0-9]/;
      let isBible = val.match(regex) !== null;
      let isSingnated = val[0] === '@';

      if (isBible && !isSingnated) {
        val = '@' + val;
      }

      this.form.current.text = '';

      if (val !== '') {
        if (index !== undefined) {
          index = parseInt(index);
          this.notes[index] = val;
          this.$router.push(`/editor/notes/${id}`);
        } else {
          this.notes.push(val);
        }
      } else {
        this.deleteIndex();
      }

      this.saveInLocalStorage();
      this.$refs.textarea.focus();
      this.textareaHeight = parseInt(this.defaultTextareaHeight);
      // Direkt zum Ende der Seite springen
      this.$nextTick(()=>{
        window.scrollTo(0, document.body.scrollHeight);
      })
    },
    edit(index) {
      if (index < 0 || index >= this.notes.length || index === parseInt(this.$route.query.index))
        return;

      let id = this.$route.params.idNotes;
      this.$router.push(`/editor/notes/${id}?index=${index}`);

      this.$refs.textarea.focus();
      this.textareaHeight = parseInt(this.defaultTextareaHeight);
    },
    abortEdit() {
      let id = this.$route.params.idNotes;
      let index = this.$route.query.index;

      this.form.current.text = '';
      this.textareaHeight = parseInt(this.defaultTextareaHeight);
      if (index !== undefined)
        this.$router.push(`/editor/notes/${id}`);
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
    setTextareaHeight() {
      let h = this.$refs['textarea-height'].offsetHeight;

      if (h > this.defaultTextareaHeight) {
        this.textareaHeight = h;
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
</style>