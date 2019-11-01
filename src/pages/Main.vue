<template>
    <div id="app" class="w3-content w3-container">
        <div class="w3-center" style="padding-top: 24px">
            <router-link to="/editor/new" class="w3-btn w3-teal">Neue Mitschrift</router-link>
        </div>
        <div>
            <router-link v-for="(el, i) in jsonDBLocal"
                         :to="'/editor/' + (i+1)"
                         class="w3-btn w3-hover-none w3-left-align"
                         style="display: block">
                {{el.title}}
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {},
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
                return jsonDB;
            }
        },
        methods: {
            getSavedDateStringReadable(string) {
                let vals = string.split("-");
                return `${vals[2]}.${vals[1]}.${vals[0]}`
            },
            loadFromLocalStorage() {
                const storage = JSON.parse(localStorage.getItem("DB"));

                if(storage !== undefined && storage !== null) {
                    jsonDB = storage;
                    this.jsonDBLocal = jsonDB;
                }
            }
        }
    }
</script>

<style>
</style>
