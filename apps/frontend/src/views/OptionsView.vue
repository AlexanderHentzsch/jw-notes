<template>
  <div class="container-content">
    <CompHeader />
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
        <input
          v-model="urlBibleReferenceDownload" @change="saveOptions()"
          style="width: 100%; padding: 8px 4px; background-color: black; color: #fff; font-family: 'Consolas', 'monospace'"
        >
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

        <div style="margin-top: 48px">
          <p style="margin-bottom: 4px">v{{ packageJson.version }}</p>
          <a :href="hrefGitHub" id="a-github" target="_blank">
            Projekt auf <span id="span-github">GitHub <i class="fab fa-github"></i></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompHeader from '@/components/CompHeader.vue';
import packageJson from '../../package.json';
import {clearNotes, getNotes, getOptions, importNotes, saveOptions as saveOptionsToStorage} from '@/lib/storage.js';

export default {
  setup() {
    return {packageJson};
  },
  name: 'Options',
  components: {CompHeader},
  data() {
    return {
      fontSize: 6,
      hrefGitHub: 'https://github.com/AlexanderHentzsch/jw-notes',
      json: '',
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
      return 'data:text/json;charset=utf-8,' + encodeURIComponent(this.json);
    },
  },
  async mounted() {
    await this.loadOptions();
    const notes = await getNotes();
    this.json = JSON.stringify(notes, null, 2);
  },
  methods: {
    async saveOptions() {
      await saveOptionsToStorage({
        fontSize: this.selectedFontSize,
        urlBibleReferenceDownload: this.urlBibleReferenceDownload,
      });
    },
    async loadOptions() {
      const storage = await getOptions();

      if (storage.fontSize !== undefined) {
        this.fontSize = this.possibleTextHeight.indexOf(storage.fontSize);
      }
      if (storage.urlBibleReferenceDownload !== undefined) {
        this.urlBibleReferenceDownload = storage.urlBibleReferenceDownload;
      }
    },
    async saveContent() {
      try {
        const notes = await importNotes(this.json);
        this.json = JSON.stringify(notes, null, 2);
      } catch (e) {
        alert('Ungültiges JSON: ' + e.message);
      }
    },
    async deleteContent() {
      if (confirm('Willst du wirklich alles löschen?')) {
        await clearNotes();
        this.json = '[]';
      }
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 26px;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}
</style>
