<template>
    <div id="Editor" class="container-content fontRaleway">
        <comp-header></comp-header>

        <div class="w3-container">
            <input id="title" class="font-note-title note-inputs" v-model="title">
            <label id="label-title" for="title">
                <template v-if="title === ''">Titel</template>
                <template v-if="title !== ''">{{getDate("day&time", date)}}</template>
            </label>
        </div>

        <div class="" style="margin: 24px 24px 100%; height: 100%">
            <div>
                <div v-for="(val, i) in notes" class="w3-row" :style="{fontSize: options.fontSize + 'px'}">
                    <div class="val-content w3-col s12" @click="edit(i)">
                        <span v-if="val[0] !== '@'">{{getValue(val)}}</span>
                        <span v-if="val[0] === '@'">
                            <a :href="getLinkToWOL(val)" target="_blank">{{getValue(val)}}</a>
                        </span>
                    </div>
                </div>
            </div>

            <div class="" style="position:fixed; bottom: 0; left:0; padding: 8px; width: 100%; background-color: #000">
                <div id="toolbox" class="w3-row">
                    <div class="w3-left w3-rest container-special-btn"
                         :style="{width: widthContainerSpecialBtn + 'px'}">
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
                <div class="w3-container">
                        <textarea v-model="form.current.text"
                                  @keyup.ctrl.enter="textareaToNotes()"
                                  @keyup.esc.exact="abortEdit()"
                                  class="note-inputs"
                                  style="resize: none"></textarea>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import CompHeader from "../components/compHeader";

    export default {
        name: "Editor",
        components: {CompHeader},
        data() {
            return {
                title: "",
                date: "",
                notes: [],
                form: {
                    current: {
                        text: ""
                    }
                },
                options: {
                    fontSize: 12
                }
            }
        },
        computed: {
            routerHasIndex() {
                return !(this.$route.params.index === undefined);
            },
            currentId() {
                const id = this.$route.params.idNotes;
                return (id === "new") ? "new" : (parseInt(id) - 1);
            },
            jsonDB() {
                return window.jsonDB;
            },
            widthContainerSpecialBtn() {
                let width = this.documentWidth;
                let cBtn = (this.routerHasIndex) ? 3 : 1;
                let deductWidth = 50 * cBtn;
                return width - deductWidth;
            },
            widthContainerStandardBtn() {
                let cBtn = (this.routerHasIndex) ? 3 : 1;
                return 50 * cBtn;
            },
            documentWidth() {
                return document.getElementsByTagName("html")[0].clientWidth - (8 * 2); /* padding */
            }
        },
        mounted: function () {
            let id = this.currentId;

            if (id === "new") {
                this.createNewNotesArray();
                document.querySelector('#title').focus();
            } else if (this.jsonDB[id] === undefined) {
                return this.$router.push('/');
            } else {
                document.querySelector('textarea').focus();
            }

            this.setDefaults();
            this.loadFontSize();
        },
        watch: {
            "$route.params.index": function () {
                this.changeTextareaContent();
            },
            "title": function () {
                this.jsonDB[this.currentId].title = (this.title === "") ? this.getDate("day") : this.title;
                this.saveInLocalStorage();
            },
            "notes": function () {
                this.jsonDB[this.currentId].notes = this.notes;
            },
            "date": function () {
                this.jsonDB[this.currentId].date = this.date;
                this.saveInLocalStorage();
            }
        },
        methods: {
            getDate(type, d = new Date()) {
                const padZero = (num) => {
                    return num.toString().padStart(2, "0");
                };

                if (typeof d !== "object") {
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
                    case "unix":
                        return unix;
                    case "day&time":
                        return `${day}.${month}.${year} ${h}:${min}:${sec}`;
                    case "day":
                    default:
                        return `${day}.${month}.${year}`;
                }
            },
            setDefaults() {
                const cJSON = this.jsonDB[this.currentId];

                this.title = (cJSON.title === undefined) ? this.getDate("day") : cJSON.title;
                this.date = (cJSON.date === undefined) ? this.getDate("unix") : cJSON.date;
                this.notes = (cJSON.notes === undefined) ? [] : cJSON.notes;
            },
            createNewNotesArray() {
                this.jsonDB.push({});
                this.$router.push(`/editor/notes/${this.jsonDB.length}`);
            },
            saveInLocalStorage() {
                localStorage.setItem("DB", JSON.stringify(this.jsonDB));
            },
            changeTextareaContent() {
                let index = this.$route.params.index;
                if (index === undefined)
                    return;

                index = parseInt(index);

                this.form.current.text = this.notes[index];
            },
            textareaToNotes() {
                this.date = this.getDate("unix");

                let val = this.form.current.text;
                let id = this.$route.params.idNotes;
                let index = this.$route.params.index;

                let regex = /[0-9]:[0-9]/;
                let isBible = val.match(regex) !== null;
                let isSingnated = val[0] === "@";

                if (isBible && !isSingnated) {
                    val = "@" + val;
                }

                this.form.current.text = "";

                if (index !== undefined) {
                    index = parseInt(index);
                    this.notes[index] = val;
                    this.$router.push(`/editor/notes/${id}`);
                } else {
                    this.notes.push(val);
                }

                this.saveInLocalStorage();
                document.querySelector('textarea').focus();
            },
            edit(index) {
                if (index < 0 || index >= this.notes.length || index === parseInt(this.$route.params.index))
                    return;

                let id = this.$route.params.idNotes;
                this.$router.push(`/editor/notes/${id}/${index}`);

                document.querySelector('textarea').focus();
            },
            abortEdit() {
                let id = this.$route.params.idNotes;
                let index = this.$route.params.index;

                this.form.current.text = "";
                if (index !== undefined)
                    this.$router.push(`/editor/notes/${id}`);
            },
            getValue(val) {
                let first = val[0];
                if (first === "@")
                    return val.substr(1);

                if (val === "")
                    return ' ';

                return val;
            },
            getLinkToWOL(searchStr) {
                searchStr = this.getValue(searchStr);
                return "https://wol.jw.org/de/wol/l/r10/lp-x?q=" + encodeURIComponent(searchStr);
            },
            loadFontSize() {
                let options = localStorage.getItem("options");

                if (options === undefined)
                    return;

                options = JSON.parse(options);
                this.options.fontSize = options.fontSize;
            },

            deleteIndex() {
                let index = parseInt(this.$route.params.index);
                this.notes.splice(index, 1);
                this.abortEdit();
            },

            addEmoji(type) {
                let emoji = "";

                switch (type) {
                    case "star":
                        emoji = "⭐";
                        break;
                    case "questionMark":
                        emoji = "❓";
                        break;
                    case "video":
                        emoji = "🎥";
                        break;
                    default:
                        emoji = "";
                }

                this.form.current.text = emoji + " " + this.form.current.text;
            }
        }
    }
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
