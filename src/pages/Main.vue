<template>
    <div id="app" class="w3-content w3-container">
        <div class="w3-center">
            <button class="w3-btn w3-teal" @click="loadFromLocalStorage()">LocalStorage laden</button>
        </div>
        <div class="w3-center" style="padding-top: 24px">
            <router-link to="/editor/new" class="w3-btn w3-teal">Neue Mitschrift</router-link>
        </div>
        <div>
            <router-link v-for="(el, i) in jsonDB"
                         :to="'/editor/' + i"
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
        mounted: function () {
            //this.loadFromLocalStorage();
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
                //jsonDB = JSON.parse(localStorage.getItem("DB"));
            }
        }
    }
</script>

<style>
</style>
