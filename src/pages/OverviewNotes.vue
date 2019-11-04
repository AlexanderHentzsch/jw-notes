<template>
    <div class="container-content">
        <comp-header></comp-header>
        <comp-tabs-overview></comp-tabs-overview>

        <div class="w3-content w3-container">
            <div class="w3-center" style="padding-top: 24px">
                <router-link to="/editor/notes/new" class="w3-block w3-btn theme-background">Neue Mitschrift</router-link>
            </div>
            <div>
                <router-link v-for="(el, i) in jsonDBLocalReverse"
                             :to="'/editor/notes/' + (i+1)"
                             class="font-note-title w3-large w3-btn w3-hover-none w3-left-align"
                             style="display: block">
                    {{el.title}}
                </router-link>
            </div>
        </div>

    </div>
</template>

<script>
    import CompHeader from "../components/compHeader";
    import CompTabsOverview from "../components/compTabsOverview";

    export default {
        name: 'Overview_Notes',
        components: {CompTabsOverview, CompHeader},
        data() {
            return {
                jsonDBLocal: []
            }
        },
        mounted() {
            this.loadFromLocalStorage();
        },
        computed: {
            jsonDB() {
                return window.jsonDB;
            },
            jsonDBLocalReverse() {
                let a = JSON.parse(JSON.stringify(this.jsonDBLocal));
                return a.reverse();
            }
        },
        methods: {
            getSavedDateStringReadable(string) {
                let vals = string.split("-");
                return `${vals[2]}.${vals[1]}.${vals[0]}`
            },
            loadFromLocalStorage() {
                const storage = JSON.parse(localStorage.getItem("DB"));

                if (storage !== undefined && storage !== null) {
                    jsonDB = storage;
                    this.jsonDBLocal = jsonDB;
                }
            }
        }
    }
</script>

<style>
</style>
