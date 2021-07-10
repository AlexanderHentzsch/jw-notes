<template>
    <div ref="container"
         style="font-size: 20px; overflow-x: auto; resize: vertical; height: 300px; position: relative"
         :style="style"
    >
        <p v-for="cueBlock in cueBlocks">
                <span v-for="cue in cueBlock"
                      class="cue"
                      :class="{ 'active-cue': isCurrent(cue.startTime, cue.endTime) }"
                      :data-start="cue.startTime"
                      @click="$emit('setTimeToVtt', cue.startTime)">
                    {{ cue.text }}
                </span>
        </p>
    </div>
</template>

<script>
import {WebVTT} from 'vtt.js'

export default {
    name: "vtt-container",
    props: {
        vtt: String,
        currentTime: Number,
        style: String,
    },
    data() {
        return {
            cues: [],
            cueBlocks: [],
        }
    },
    watch: {
        vtt() {
            this.loadVtt();
        },
        currentTime() {
            this.setContainerScroll();
        }
    },
    created() {
        this.loadVtt()
    },
    methods: {
        loadVtt() {
            const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
            let cues = [];
            // parser.onregion = function (region) {
            //     console.log(region)
            // };
            parser.oncue = function (cue) {
                cues.push(cue);
            };
            parser.onflush = () => {
                this.cues = cues.map(({startTime, endTime, text}) => {
                    const r = {
                        startTime,
                        endTime,
                        text: text
                            .replace(/(?:\r\n|\r|\n)/g, ' ')
                            .replace(/ +/gm, ' ')
                    };
                    return r;
                })
                this.setCueBlocks();
            };
            parser.onparsingerror = function (e) {
                console.error(e)
            };
            parser.parse(this.$props.vtt);
            parser.flush();
        },
        setCueBlocks() {
            const cues = this.cues
            let block = [];
            for (let i = 0; i < cues.length; i++) {
                if (block.length === 0) {
                    block.push(cues[i]);
                    continue;
                }

                if ((cues[i].startTime - 2) > block[block.length - 1].endTime) {
                    this.cueBlocks.push(block);
                    block = [];
                }
                block.push(cues[i]);
            }
        },
        isCurrent(start, end) {
            const ct = this.$props.currentTime;
            return start <= ct && end >= ct;
        },
        setContainerScroll() {
            const DOM = document.getElementsByClassName('active-cue');
            if (!DOM.length) return;
            this.$refs.container.scrollTop = DOM[0].offsetTop - 20;
        },
    }
}
</script>

<style scoped>
.active-cue {
    color: #b15220;
}

span.cue:hover {
    color: #00ffff;
}

span.cue {
    cursor: pointer;
}

</style>