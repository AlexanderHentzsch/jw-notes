<template>
    <div id="Editor" class="container-content fontRaleway">
        <comp-header></comp-header>

        <div class="w3-container">
            <input id="title" class="font-note-title note-inputs" v-model="title">
            <label id="label-title" for="title">Titel</label>
        </div>

        <div class="" style="margin: 24px 24px 100%; height: 100%">
            <div>
                <div v-for="(val, i) in notes" class="w3-row">
                    <div class="val-content w3-col s12" @click="edit(i)">
                        <span v-if="val[0] !== '@'">{{getValue(val)}}</span>
                        <span v-if="val[0] === '@'">
                            <a :href="getLinkToWOL(val)" target="_blank">{{getValue(val)}}</a>
                        </span>
                    </div>
                </div>
            </div>

            <div class="" style="position:fixed; bottom: 0; left:0; padding: 8px; width: 100%; background-color: #000">
                <div class="w3-row">
                    <div class="w3-col w3-right w3-center" style="width:50px; padding: 0 8px 0 4px">
                        <button @click="textareaToNotes()"
                                class="w3-btn w3-hover-none w3-round-xxlarge"
                                style="width: 50px; height: 50px">
                            <i class="fas fa-level-up-alt"></i>
                        </button>
                    </div>
                    <div v-if="routerHasIndex" class="w3-col w3-right w3-center" style="width:50px; padding: 0 8px 0 0">
                        <button @click="abortEdit()" class="w3-btn w3-hover-none w3-round-xxlarge"
                                style="width: 50px; height: 50px">
                            <i class="far fa-times-circle"></i>
                        </button>
                    </div>
                    <div class="w3-rest w3-container">
                        <textarea v-model="form.current.text"
                                  @keyup.ctrl.enter="textareaToNotes()"
                                  @keyup.esc.exact="abortEdit()"
                                  class="note-inputs"
                                  style="resize: none"></textarea>
                    </div>
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
                }
            }
        },
        mounted: function () {
            let id = this.currentId;

            if (id === "new") {
                this.createNewNotesArray();
            } else if (jsonDB[id] === undefined) {
                return this.$router.push('/');
            }

            this.setDefaults();
        },
        watch: {
            "$route.params.index": function () {
                this.changeTextareaContent();
            },
            "title": function () {
                jsonDB[this.currentId].title = this.title;
                this.saveInLocalStorage();
            },
            "notes": function () {
                jsonDB[this.currentId].notes = this.notes;
            },
            "date": function () {
                jsonDB[this.currentId].date = this.date;
                this.saveInLocalStorage();
            }
        },
        computed: {
            getCurrentDate() {
                let d = new Date();
                return `${(d.getDate()).toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`;
            },
            routerHasIndex() {
                return !(this.$route.params.index === undefined);
            },
            currentId() {
                const id = this.$route.params.idNotes;
                return (id === "new") ? "new" : (parseInt(id) - 1);
            }
        },
        methods: {
            setDefaults() {
                const cJSON = jsonDB[this.currentId];

                this.title = (cJSON.title === undefined) ? this.getCurrentDate : cJSON.title;
                this.date = (cJSON.date === undefined) ? this.getCurrentDate : cJSON.date;
                this.notes = (cJSON.notes === undefined) ? [] : cJSON.notes;
            },
            createNewNotesArray() {
                jsonDB.push({});
                this.$router.push(`/editor/notes/${jsonDB.length}`);
                document.querySelector('#title').focus();
            },
            saveInLocalStorage() {
                localStorage.setItem("DB", JSON.stringify(jsonDB));
            },
            changeTextareaContent() {
                let index = this.$route.params.index;
                if (index === undefined)
                    return;

                index = parseInt(index);

                this.form.current.text = this.notes[index];
            },
            textareaToNotes() {
                this.date = this.getCurrentDate;

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
                if (index < 0 || index >= this.notes.length)
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
</style>