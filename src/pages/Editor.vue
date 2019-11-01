<template>
    <div id="Editor">
        <div class="w3-teal w3-card-2" style="position: fixed; top: 0; left: 0;width: 100%">
            <router-link to="/" class="w3-btn w3-hover-none"><i class="fas fa-chevron-left"></i></router-link>
            <input id="title" class="w3-teal w3-border-0" v-model="title" style="width: auto; padding-left: 8px">
        </div>

        <div class="" style="margin: 30px 24px 100%; height: 100%">
            <div>
                <input class="w3-input w3-tiny w3-text-gray" style="border: 0" v-model="date">
            </div>

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

            <div class="w3-teal" style="position:fixed; bottom: 0; left:0; padding: 8px; width: 100%">
                <div class="w3-row">
                    <div class="w3-col w3-right w3-center" style="width:50px; padding: 0 8px 0 4px">
                        <button @click="textareaToNotes()"
                                class="w3-btn w3-hover-none w3-hover-teal w3-teal w3-round-xxlarge"
                                style="width: 50px; height: 50px">
                            <i class="fas fa-level-up-alt"></i>
                        </button>
                    </div>
                    <div v-if="routerHasIndex" class="w3-col w3-right w3-center" style="width:50px; padding: 0 8px 0 0">
                        <button @click="abortEdit()" class="w3-btn w3-hover-none w3-hover-teal w3-teal w3-round-xxlarge"
                                style="width: 50px; height: 50px">
                            <i class="far fa-times-circle"></i>
                        </button>
                    </div>
                    <div class="w3-rest w3-container">
                    <textarea v-model="form.current.text"
                              @keyup.ctrl.enter="textareaToNotes()"
                              @keyup.esc.exact="abortEdit()"
                              class="w3-input w3-round-large"
                              style="resize: none"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "Editor",
        data() {
            return {
                title: "",
                date: "",
                form: {
                    current: {
                        text: ""
                    }
                },
                notes: []
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
            routerHasIndex() {
                return !(this.$route.params.index === undefined);
            },
            getDate() {
                let d = new Date();
                return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            },
            currentId() {
                const id = this.$route.params.id;
                return (id === "new") ? "new" : (parseInt(id) - 1);
            }
        },
        methods: {
            setDefaults() {
                const defaults = ["title", "notes", "date"];
                for (let i in defaults) {
                    let t = defaults[i];
                    let json = jsonDB[this.currentId][t];
                    this[t] = (json !== undefined) ? json : "";
                    if(this.notes === "") {
                        this.notes = [];
                    }
                }
            },
            createNewNotesArray() {
                jsonDB.push({});
                this.$router.push(`/editor/${jsonDB.length}`);
                $('#title').focus();
            },
            saveInLocalStorage() {
                localStorage.setItem("DB", JSON.stringify(jsonDB));
                console.log("gespeichert");
            },
            changeTextareaContent() {
                let index = this.$route.params.index;
                if (index === undefined)
                    return;

                index = parseInt(index);

                this.form.current.text = this.notes[index];
            },
            textareaToNotes() {
                let val = this.form.current.text;
                let id = this.$route.params.id;
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
                    this.$router.push(`/editor/${id}`);
                } else {
                    this.notes.push(val);
                }

                this.saveInLocalStorage();
                $('textarea').focus();
            },
            edit(index) {
                if (index < 0 || index >= this.notes.length)
                    return;

                let id = this.$route.params.id;
                this.$router.push(`/editor/${id}/${index}`);
                $('textarea').focus();
            },
            abortEdit() {
                let id = this.$route.params.id;
                let index = this.$route.params.index;

                this.form.current.text = "";
                if (index !== undefined)
                    this.$router.push(`/editor/${id}`);
            },
            getValue(val) {
                let first = val[0];
                if (first === "@") {
                    return val.substr(1);
                }
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

</style>