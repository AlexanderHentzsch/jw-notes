<template>
  <div class="container-content">
    <CompHeader />
    <CompTabsOverview />

    <div class="w3-content w3-container">
      <div class="w3-center" style="padding-top: 24px">
        <router-link to="/editor/notes/new" class="w3-block w3-btn theme-background">Neue Mitschrift</router-link>
      </div>
      <div>
        <router-link
          v-for="(el, i) in jsonDBLocalReverse"
          :key="i"
          :to="'/editor/notes/' + getReversedPos(i)"
          class="font-note-title w3-large w3-btn w3-hover-none w3-left-align"
          style="display: block"
        >
          {{ el.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import CompHeader from '@/components/CompHeader.vue';
import CompTabsOverview from '@/components/CompTabsOverview.vue';

export default {
  name: 'OverviewNotes',
  components: {CompHeader, CompTabsOverview},
  data() {
    return {
      jsonDBLocal: [],
    };
  },
  mounted() {
    this.loadFromLocalStorage();
  },
  computed: {
    jsonDB() {
      return window.jsonDB;
    },
    jsonDBLocalReverse() {
      let a = JSON.parse(JSON.stringify(this.jsonDBLocal));
      return a.reverse();
    },
  },
  methods: {
    getReversedPos(pos) {
      let l = this.jsonDBLocal.length - 1;
      return (l - pos) + 1;
    },
    getSavedDateStringReadable(string) {
      let vals = string.split('-');
      return `${vals[2]}.${vals[1]}.${vals[0]}`;
    },
    loadFromLocalStorage() {
      const storage = JSON.parse(localStorage.getItem('DB'));

      if (storage !== undefined && storage !== null) {
        window.jsonDB = storage;
        this.jsonDBLocal = window.jsonDB;
      }
    },
  },
};
</script>
