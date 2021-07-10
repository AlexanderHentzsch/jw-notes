<template>
    <div>
        <screen-on :screen-on="screenOn"></screen-on>
        <video-player :src="src" :vtt-time="vttTime" @timeupdate="onTimeupdate">
            <track src="co-r21_X_04.vtt" label="Deutsch" srclang="de" kind="subtitles">
        </video-player>
        <button @click="getVtt()" class="w3-button w3-teal">VTT</button>
        <button @click="toggleScreenOn()" class="w3-button w3-teal">Screen On: {{screenOn}}</button>
        <vtt-container v-if="vtt" :vtt="vtt" :current-time="currentTime" @setTimeToVtt="setTimeToVtt" style="padding-top: 12px"></vtt-container>
    </div>
</template>

<script>
import VideoPlayer from "@/components/player/video-player";
import axios from 'axios';
import VttContainer from "@/components/player/vtt-container";
import ScreenOn from "@/components/screen-on";

export default {
    name: "player",
    components: {ScreenOn, VttContainer, VideoPlayer},
    data() {
        return {
            src: "https://d34ji3l0qn3w2t.cloudfront.net/3cf55cdc-b99c-4c1b-9d2c-45767a60a289/2/CO-r21_X_04_r720P.mp4",
            vtt: "",
            currentTime: 0,
            vttTime: 0,
            screenOn: false,
        }
    },
    methods: {
        getVtt() {
            axios.get('co-r21_X_04.vtt')
                .then(r => {
                    this.vtt = r.data
                })
                .catch(e => {
                    console.error(e)
                })
        },
        onTimeupdate(t) {
            this.currentTime = t;
        },
        setTimeToVtt(t) {
            this.vttTime = t;
        },
        toggleScreenOn() {
            this.screenOn = !this.screenOn;
        }
    }
}
</script>

<style scoped>

</style>