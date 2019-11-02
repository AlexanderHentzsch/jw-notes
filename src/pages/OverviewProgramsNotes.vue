<template>
    <div class="container-content">
        <comp-header></comp-header>
        <comp-tabs-overview></comp-tabs-overview>

        <h1>Overview_Programms_Notes</h1>
    </div>
</template>

<script>
    import CompHeader from "../components/compHeader";
    import CompTabsOverview from "../components/compTabsOverview";

    export default {
        name: "Overview_Programms_Notes",
        components: {CompTabsOverview, CompHeader}
    }
</script>

<style scoped>

</style>