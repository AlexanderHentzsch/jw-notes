<template>
  <v-container fluid>
    <v-alert type="error" v-if="!isSetSyncServer" @click="$router.push('/config#sync-server')">
      <p>Synchronisationsserver konfigurieren</p>
    </v-alert>
    <div>
      <v-sheet @click="$router.push('/notes')">
        <v-icon>
          mdi-account-tie
        </v-icon>
        <v-btn text>
          + Vortrag
        </v-btn>
      </v-sheet>
      <v-sheet @click="$router.push('/program')">
        <v-icon>
          mdi-account-group
        </v-icon>
        <br/>
        <v-btn text>
          + Programm
        </v-btn>
      </v-sheet>
    </div>
    <div>
      <div>
        <v-btn>
          Zuletzt verwendet
        </v-btn>
        <v-btn>
          Vorträge
        </v-btn>
        <v-btn>
          Programme
        </v-btn>
      </div>
      <div v-for="el in list" :key="el.uuid">
        <div @click="$router.push(el.to)">
          <h3>{{ el.title }}</h3>
          <h4 v-html="getInfo(el)"></h4>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'start',
  data() {
    return {
      isSetSyncServer: false,
      list: [
        {
          uuid: '123',
          title: 'Vortragstitel',
          speaker: 'Bruder Redner',
          date: '20.10.2022',
          lastChange: '30.10.2022',
          to: 'notes?uuid=123',
        },
        {
          uuid: '234',
          title: 'Programmtitel',
          date: '30.10.2022',
          to: '/program?uuid=234',
        },
      ],
    };
  },
  methods: {
    getInfo(el) {
      const {speaker, date, lastChange} = el;
      const r = [];
      if (speaker)
        r.push(speaker);
      if (date)
        r.push(date);
      if (lastChange)
        r.push(lastChange);
      return r.join(' &middot; ');
    },
  },
};
</script>

<style scoped>

</style>