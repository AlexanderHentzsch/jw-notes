<template>
    <div class="container-content">
        <comp-header></comp-header>
        <div class="w3-content w3-container">
            <h1>Optionen</h1>

            <p :style="{fontSize: selectedFontSize + 'px', textAlign: 'right'}">Schriftgröße: {{selectedFontSize}}px</p>
            <div class="slidecontainer">
                <input type="range" v-model="fontSize" @change="saveOptions()" min="0"
                       :max="possibleTextHeight.length - 1" class="slider"
                       id="fontSizeRange">
            </div>


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
                localStorageKey: "options"
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
            }
        }
    }
</script>

<style scoped>
    h1 {
        font-size: 26px;
    }

    #fontSizeRange{
        width: 100%;
    }
</style>