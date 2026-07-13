<script setup>
import {store} from '~/stores/default.js';

function nothing() {
}

const textarea = useTemplateRef('textarea');

function focus() {
  textarea.value.focus();
}

defineExpose({focus});
</script>

<template>
  <v-textarea
    v-model="store.currentNode"
    @keydown.enter.prevent="nothing"
    ref="textarea"
    autofocus
    auto-grow
    clearable
    persistent-clear
    density="compact"
    flat
    hide-details="auto"
    :rows="1"
    :max-rows="4"
    no-resize
    variant="outlined"
  ></v-textarea>
</template>