<template>
  <div class="container-content">
    <CompHeader />
    <CompTabsOverview />

    <div class="w3-content w3-container">
      <div class="w3-center" style="padding-top: 24px">
        <button @click="createNote" class="w3-block w3-btn theme-background">Neue Mitschrift</button>
      </div>
      <div>
        <router-link
          v-for="note in notesNewestFirst"
          :key="note.id"
          :to="'/editor/notes/' + note.id"
          class="font-note-title w3-large w3-btn w3-hover-none w3-left-align"
          style="display: block"
        >
          {{ note.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import CompHeader from '@/components/CompHeader.vue';
import CompTabsOverview from '@/components/CompTabsOverview.vue';
import {createNote as createNoteInStorage, getNotes} from '@/lib/storage.js';

export default {
  name: 'OverviewNotes',
  components: {CompHeader, CompTabsOverview},
  data() {
    return {
      notes: [],
    };
  },
  computed: {
    notesNewestFirst() {
      return [...this.notes].reverse();
    },
  },
  async mounted() {
    this.notes = await getNotes();
  },
  methods: {
    getDate() {
      const padZero = (num) => num.toString().padStart(2, '0');
      const d = new Date();
      return `${padZero(d.getDate())}.${padZero(d.getMonth() + 1)}.${d.getFullYear()}`;
    },
    async createNote() {
      const note = await createNoteInStorage({
        title: this.getDate(),
        date: Date.now(),
        notes: [],
      });
      this.$router.push(`/editor/notes/${note.id}`);
    },
  },
};
</script>
