<template>
    <div>
        <video ref="player"
               :src="src"
               width="100%"
               controls
               @timeupdate="$emit('timeupdate', $event.target.currentTime)"
               @pause="isPlaying = false"
               @play="isPlaying = true"
        >
            <slot></slot>
        </video>
        <div class="w3-xlarge">
            <button class="w3-button w3-teal" @click="setCurrentTime(-10)">
                <i class="fas fa-fast-backward">-10</i>
            </button>

            <button class="w3-button w3-teal" @click="setCurrentTime(-5)">
                <i class="fas fa-backward">-5</i>
            </button>

            <button class="w3-button w3-teal">
                <i class="fas fa-play" v-if="!isPlaying" @click="$refs.player.play()"></i>
                <i class="fas fa-pause" v-if="isPlaying" @click="$refs.player.pause()"></i>
            </button>

            <button class="w3-button w3-teal" @click="setCurrentTime(+5)">
                <i class="fas fa-forward">+5</i>
            </button>

            <button class="w3-button w3-teal" @click="setCurrentTime(+10)">
                <i class="fas fa-fast-forward">+10</i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "video-player",
    props: {
        src: String,
        vttTime: Number,
    },
    data() {
        return {
            isPlaying: false
        }
    },
    watch: {
        vttTime() {
            this.setCurrentTime(this.$props.vttTime, true);
        }
    },
    methods: {
        setCurrentTime(val, set = false) {
            let ct = this.$refs.player.currentTime;
            this.$refs.player.currentTime = (set) ? val : ct + val;
        }
    }
}
</script>

<style scoped>

</style>