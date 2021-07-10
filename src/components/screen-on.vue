<template>
    <video src="clip.mp4"
           ref="player"
           style="position:fixed; top: -100px; width: 10px; height: 10px"
           autoplay
           loop
           controls></video>
</template>

<script>
export default {
    name: "screen-on",
    props: {
        screenOn: Number
    },
    watch: {
        screenOn(_new) {
            if (_new)
                this.$refs.player.play();
            else
                this.$refs.player.pause();
        }
    }
}
</script>

<style scoped>

</style>