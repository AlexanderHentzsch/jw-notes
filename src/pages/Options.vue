<template>
    <div class="container-content">
        <comp-header></comp-header>
        <div class="w3-content w3-container">
            <h1>Optionen</h1>

            <div class="slidecontainer">
                <input type="range" min="8" max="68" value="50" class="slider" id="myRange">
            </div>
        </div>
    </div>
</template>

<script>
    import CompHeader from "../components/compHeader";

    export default {
        name: "Options",
        components: {CompHeader}
    }
</script>

<style scoped>
    h1 {
        font-size: 26px;
    }
</style>