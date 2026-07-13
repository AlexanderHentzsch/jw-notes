<script setup>
import {useTemplateRef} from 'vue';
import {store} from '@/stores/default.js';

const MAX_ROWS = 4;

const textarea = useTemplateRef('textarea');

function autoGrow(event) {
  const el = event.target;
  el.rows = 1;
  const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 20;
  const rows = Math.min(MAX_ROWS, Math.ceil(el.scrollHeight / lineHeight));
  el.rows = rows;
}

function focus() {
  textarea.value?.focus();
}

defineExpose({focus});
</script>

<template>
  <textarea
    v-model="store.currentNode"
    ref="textarea"
    class="note-textarea"
    autofocus
    rows="1"
    @keydown.enter.prevent
    @input="autoGrow"
  />
</template>

<style scoped>
.note-textarea {
  width: 100%;
  resize: none;
  background-color: transparent;
  color: inherit;
  border: 1px solid #616161;
  border-radius: 4px;
  padding: 8px;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  box-sizing: border-box;
}
</style>
