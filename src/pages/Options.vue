<template>
    <div class="container-content">
        <comp-header></comp-header>
        <div class="w3-content w3-container">
            <h1>Optionen</h1>

            <div>
                <p :style="{fontSize: selectedFontSize + 'px', textAlign: 'right'}">Schriftgröße:
                    {{ selectedFontSize }}px</p>
                <input type="range" v-model="fontSize" @change="saveOptions()" min="0"
                       :max="possibleTextHeight.length - 1" class="slider"
                       id="fontSizeRange">
            </div>

            <div>
                <h2>Download</h2>
                <a class="w3-button w3-teal" :href="downloadJson" :download="fileNameDownload">Download JSON</a>
                <h2 style="margin-top: 64px">Lizenz</h2>
                <p>
                    <a href="https://github.com/BillAlex-BASoftware/jw-notes/blob/master/LICENSE" target="_blank">
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
import CompHeader from "../components/compHeader";

export default {
    name: "Options",
    components: {CompHeader},
    data() {
        return {
            fontSize: 4,
            localStorageKey: "options",
            hrefGitHub: "https://github.com/BillAlex-BASoftware/jw-notes"
        }
    },
    computed: {
        possibleTextHeight() {
            return [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
        },
        selectedFontSize() {
            return this.possibleTextHeight[this.fontSize];
        },
        jsonDB() {
            return window.jsonDB;
        },
        fileNameDownload(){
            const pad = function (v) {
                return v.toString().padStart(2, "0");
            }
            let d = new Date();
            let date = [
                d.getFullYear(),
                pad(d.getMonth() + 1),
                pad(d.getDate()),
                pad(d.getHours()),
                pad(d.getMinutes()),
                pad(d.getSeconds())
            ].join("");
          return "jw-notes-" + date + ".json";
        },
        downloadJson() {
            let db = localStorage.getItem('DB');
            return "data:text/json;charset=utf-8," + encodeURIComponent(db);
        }
    },
    mounted() {
        this.loadOptions();
    },
    methods: {
        saveOptions() {
            let options = {
                fontSize: this.selectedFontSize
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
        },
    }
}
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