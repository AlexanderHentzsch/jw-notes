<template>
  <v-container>
    <v-dialog v-model="dialog.edit" fullscreen>
      <v-card>
        <v-card-text>
          <div>
            <v-text-field v-model="title" clearable></v-text-field>
          </div>
          <div>
            <v-text-field v-model="speaker" clearable></v-text-field>
          </div>
          <div>
            <v-text-field v-model="date" clearable></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions class="d-flex">
          <v-spacer></v-spacer>
          <v-btn @click="dialog.edit = false">
            Schließen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div @click="dialog.edit = true" class="mb-12">
      <h1>{{ title }}</h1>
      <h2 class="subtitle-2" v-html="getSubtitle"></h2>
    </div>
    <div>
      <div
        v-for="n in notes"
        :key="n.uuid"
      >
        <template v-if="n.type === 'text' && n.uuid !== editUuid">
          <p @click="startEditNote(n.uuid)">{{ n.content }}</p>
        </template>

        <template v-if="n.type === 'bible'">
          <h2>{{ n.content.source }}</h2>
          <p>{{ n.content.content }}</p>
        </template>

        <template v-if="n.uuid === editUuid">
          <v-textarea
            ref="editNoteInline"
            v-model="editNote"
            auto-grow
            clearable
            dense
            flat
            outlined
            rows="1"
            @change="saveNote(n.uuid)"
            @blur="saveNote(n.uuid)"
          ></v-textarea>
        </template>
      </div>
      <v-textarea
        v-if="editUuid === null"
        ref="editNote"
        v-model="editNote"
        auto-grow
        clearable
        dense
        flat
        outlined
        rows="1"
        @change="saveNote()"
      ></v-textarea>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'notes',
  data() {
    return {
      title: 'Vortragstitel',
      speaker: 'Bruder Sprecher',
      date: '30.10.2022',
      lastChange: '31.10.2022 12:56',
      dialog: {
        edit: false,
      },
      editNote: '',
      editUuid: null,
      notes: [
        {
          uuid: '1',
          type: 'text',
          content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
        },
        {
          uuid: '2',
          type: 'text',
          content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
        },
        {
          uuid: 3,
          type: 'bible',
          content: {
            source: '1. Mose 1:1',
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
          },
        },
        {
          uuid: '4',
          type: 'text',
          content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut',
        },
      ],
    };
  },
  computed: {
    getSubtitle() {
      const r = [];
      r.push(this.speaker);
      r.push(this.date);
      r.push(this.lastChange);
      return r.join(' &middot; ');
    },
  },
  methods: {
    saveNote(uuid = null) {
      if (uuid === null) {
        this.notes.push({
          uuid: 5,
          type: 'text',
          content: this.editNote,
        });
        this.editNote = '';
        this.$nextTick(() => {
          this.$refs.editNote.focus();
        });
        return;
      }

      const index = this.notes.findIndex(n => n.uuid === uuid);
      this.notes[index].content = this.editNote;
      this.editUuid = null;
      this.editNote = '';
      if (false) {
        this.$nextTick(() => {
          // TODO evtl. optional, damit man nicht immer weggescrollt wird beim bearbeiten
          //this.$refs.editNote.focus();
        });
      }
    },
    startEditNote(uuid) {
      if (this.editUuid !== null)
        return;
      this.editUuid = uuid;
      this.editNote = this.notes.find(n => n.uuid === uuid).content;
      this.$nextTick(() => {
        this.$refs.editNoteInline[0].focus();
      });
    },
  },
};
</script>

<style scoped>

</style>