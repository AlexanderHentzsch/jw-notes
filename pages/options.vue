<template>
  <div class="container-content">
    <comp-header></comp-header>
    <div class="w3-content w3-container">
      <h1>Optionen</h1>

      <div>
        <p :style="{fontSize: selectedFontSize + 'px', textAlign: 'right'}">Schriftgröße:
          {{ selectedFontSize }}px</p>
        <input
          type="range" v-model="fontSize" @change="saveOptions()" min="0"
          :max="possibleTextHeight.length - 1" class="slider"
          id="fontSizeRange"
        >
      </div>

      <div>
        <p>URL für den Bibeltext-Download</p>
        <input v-model="urlBibleReferenceDownload" @change="saveOptions()" style="width: 100%; padding: 8px 4px; background-color: black; color: #fff; font-family: 'Consolas', 'monospace'">
      </div>

      <div>
        <h2>Download</h2>
        <a class="w3-button w3-teal" :href="downloadJson" :download="fileNameDownload">Download JSON</a>
        <h3 style="margin-top: 32px">Inhalt</h3>
        <div style="margin-top: 12px">
          <textarea
            v-model="json"
            style="width: 100%;
          height: 300px; background-color: black; color: #fff; font-family: 'Consolas', 'monospace'"
          ></textarea>
        </div>
        <span class="w3-button w3-teal" @click="saveContent()">Speichern</span>
        <span class="w3-button w3-red" @click="deleteContent()">Löschen</span>
        <h2 style="margin-top: 64px">Lizenz</h2>
        <p>
          <a href="https://github.com/AlexanderHentzsch/jw-notes/blob/master/LICENSE" target="_blank">
            JW Notes - The MIT License (MIT)
          </a>
        </p>

        <h2 style="margin-top: 48px">Third-party libraries</h2>
        <p>
          <a href="https://github.com/vuejs/vue/blob/dev/LICENSE" target="_blank">
            Vue.js - The MIT License (MIT)
          </a>
        </p>
      </div>
    </div>

    <div id="container-github">
      <a :href="hrefGitHub" id="a-github" target="_blank">
        Projekt auf <span id="span-github">GitHub <i class="fab fa-github"></i></span>
      </a>
    </div>
  </div>
</template>

<script>
import CompHeader from '../components/compHeader';

export default {
  name: 'Options',
  components: {CompHeader},
  data() {
    return {
      fontSize: 6,
      localStorageKey: 'options',
      hrefGitHub: 'https://github.com/AlexanderHentzsch/jw-notes',
      json: '', //dBContent
      urlBibleReferenceDownload: '',
    };
  },
  computed: {
    possibleTextHeight() {
      return [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    },
    selectedFontSize() {
      return this.possibleTextHeight[this.fontSize];
    },
    fileNameDownload() {
      const pad = function (v) {
        return v.toString().padStart(2, '0');
      };
      let d = new Date();
      let date = [
        d.getFullYear(),
        pad(d.getMonth() + 1),
        pad(d.getDate()),
        pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds()),
      ].join('');
      return 'jw-notes-' + date + '.json';
    },
    downloadJson() {
      let db = localStorage.getItem('DB');
      return 'data:text/json;charset=utf-8,' + encodeURIComponent(db);
    },
  },
  mounted() {
    this.loadOptions();
    this.json = localStorage.getItem('DB')
  },
  methods: {
    saveOptions() {
      let options = {
        fontSize: this.selectedFontSize,
        urlBibleReferenceDownload: this.urlBibleReferenceDownload,
      };
      let key = this.localStorageKey;
      localStorage.setItem(key, JSON.stringify(options));
    },
    loadOptions() {
      let storage = localStorage.getItem(this.localStorageKey);

      if (storage === undefined || storage === null)
        return;

      storage = JSON.parse(storage);
      this.fontSize = this.possibleTextHeight.indexOf(storage.fontSize);
      this.urlBibleReferenceDownload = storage.urlBibleReferenceDownload;
    },
    saveContent() {
      localStorage.setItem('DB', this.json);
    },
    deleteContent() {
      if(confirm('Willst du wirklich alles löschen?')){
        localStorage.removeItem('DB');
        this.json = '';
      }
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 26px;
}

#fontSizeRange {
  width: 100%;
}

#container-github {
  position: fixed;
  bottom: 0px;
  padding: 16px;
  text-align: center;
  width: 100%;
}

#a-github {
  text-decoration: none;
}

#span-github {
  background-color: #fff;
  color: #000;
  border-radius: 60px;
  display: inline-block;
  padding: 0 8px;
  margin-left: 2px;
}
</style>