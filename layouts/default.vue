<template>
  <v-app dark>
    <v-main>
      <nuxt></nuxt>
    </v-main>

    <v-bottom-navigation>
      <v-btn icon nuxt to="/start">
        <v-icon>
          mdi-home
        </v-icon>
      </v-btn>
      <v-btn icon nuxt to="/config">
        <v-icon>
          mdi-cog-outline
        </v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
};
</script>

<style>
html, body {
  overflow-y: auto;
}
</style>
