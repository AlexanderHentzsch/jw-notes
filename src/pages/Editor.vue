<template>
    <div id="Editor">
        <div class="w3-teal">
            <router-link to="/" class="w3-btn w3-hover-none"><i class="fas fa-chevron-left"></i></router-link>
            <input id="title" class="w3-teal w3-border-0" v-model="title" style="width: auto; padding-left: 8px">
        </div>

        <div style="padding: 0 24px">
            <div>
                <input class="w3-input w3-tiny w3-text-gray" style="border: 0" v-model="date">
            </div>

            <div>
                <div v-for="(val, i) in notes" class="w3-row">
                    <div class="val-link w3-col w3-right" style="width:50px"
                         v-if="val[0] === '@'">
                        <a :href="getLinkToWOL(val)"
                           class="w3-btn w3-hover-none">
                            <i class="fas fa-globe"></i>
                        </a>
                    </div>

                    <div class="val-content w3-rest w3-btn w3-hover-none"
                         @click="edit(i)">
                        {{getValue(val)}}
                    </div>
                </div>
            </div>

            <div style="position:absolute; bottom: 0; left:0; padding: 8px; width: 100%">
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
                    <textarea @keyup.ctrl.enter="textareaToNotes()"
                              @keyup.esc.exact="abortEdit()" class="w3-input"
                              v-model="form.current.text"></textarea>
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
            if (this.$route.params.id === "new") {
                let newId = jsonDB.length;
                jsonDB[newId] = {};
                this.$router.push(`/editor/${newId}`);
                $('#title').focus();
            }

            let id = parseInt(this.$route.params.id);
            this.title = (jsonDB[id].title !== undefined) ? jsonDB[id].title : "";
            this.date = (jsonDB[id].date !== undefined) ? jsonDB[id].date : "";
            this.notes = (jsonDB[id].notes !== undefined) ? jsonDB[id].notes : [];
        },
        watch: {
            "$route.params.index": function () {
                this.changeTextareaContent();
            },
            "title": function () {
                let i = parseInt(this.$route.params.id);

                if (jsonDB[i] === undefined) {
                    jsonDB[i] = {};
                }

                jsonDB[i].title = this.title;
            },
            "notes": function(){
                let i = parseInt(this.$route.params.id);
                jsonDB[i].notes = this.notes;
            },
            "date": function(){
                let i = parseInt(this.$route.params.id);

                if (jsonDB[i] === undefined) {
                    jsonDB[i] = {};
                }

                jsonDB[i].date = this.date;
            }
        },
        computed: {
            routerHasIndex() {
                return !(this.$route.params.index === undefined);
            },
            getDate(){
                let d = new Date();
                return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            }
        },
        methods: {
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

                this.form.current.text = "";

                console.log(this)

                if (index !== undefined) {
                    index = parseInt(index);
                    this.notes[index] = val;
                    this.$router.push(`/editor/${id}`);
                } else {
                    this.notes.push(val);
                }
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