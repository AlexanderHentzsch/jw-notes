<template>
    <div id="header">
        <div class="w3-row theme-color" style="height: 100%;">
            <div class="container-btn w3-col w3-left">
                <button @click="goBack(-1)" class="w3-btn w3-hover-none">
                    <i class='fas fa-angle-left'></i>
                </button>
            </div>
            <div class="container-btn w3-col w3-right">
                <router-link to="/options" class="w3-btn w3-hover-none">
                    <i class='fas fa-cog' style="position: relative; top: 9px;"></i>
                </router-link>
            </div>
            <div class="w3-rest" style="height: 55px;">
                <button class="w3-btn w3-hover-none fontRobotoCondensed" style="padding-left: 0;text-align: left;">
                    JW Notes
                </button>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "CompHeader",
        computed: {
            domApp() {
                return document.querySelector("#app");
            }
        },
        methods: {
            goBack() {
                const cROUTE = this.$route.name;
                let nROUTE;
                switch (cROUTE) {
                    case "Options":
                        return this.$router.go(-1);
                    case "OverviewNotes":
                    case "OverviewPrograms":
                        nROUTE = "/";
                        break;
                    case "Program":
                        nROUTE = `/overview/programs/${this.$route.params.idProgram}`;
                        break;
                    case "EditorNotes":
                        nROUTE = "/overview/notes";
                        break;
                    case "OverviewProgramsNotes":
                    case "EditorProgram":
                        nROUTE = "/overview/programs";
                        break;
                    default:
                        nROUTE = "/overview/notes"
                }

                this.$router.push(nROUTE);
            }
        }
    }
</script>

<style scoped>
    #header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 55px;
        background-color: #000;
        z-index: 900;
    }

    .w3-btn {
        width: 100%;
        height: 100%;
    }

    .container-btn {
        width: 55px;
        height: 55px;
    }
</style>