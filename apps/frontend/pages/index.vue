<template>
  <div @click="clickDisplay()" style="height: 100%">

    <div class="w3-display-container" style="height: 100%">

      <div class="w3-display-middle">
        <div class="w3-center">
          <div id="container-logo" class="theme-background fontRobotoCondensed">
            <span id="logo">JW</span>
            <br/>
            <span id="logo-sub">Notes</span>
          </div>
          <div id="container-hint">
            Tippen um die Anwendung im Vollbildmodus zu starten.
          </div>
        </div>
      </div>

      <div class="w3-display-bottomright">
        <div class="w3-right-align fontRaleway" style="margin-right: 12px">
          <p id="copyright">
            <span class="w3-tiny">made by</span>
            <br>
            <span class="w3-small">Alexander Hentzsch</span>
            <br>
            <span class="w3-tiny">MIT License</span>
          </p>
        </div>
      </div>
      <!-- END w3-display-container -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  methods: {
    clickDisplay() {
      this.goToOverview();
    },
    goToOverview() {
      this.$router.push('/overview/notes/');
    }
  }
}
</script>

<style scoped>
#container-logo {
  width: 128px;
  height: 128px;
  margin: auto;
}

#logo {
  font-size: 64px;
}

#logo-sub {
  position: relative;
  top: -25px;
  font-size: 24px;
  letter-spacing: 4px;
  font-style: italic;
}

#container-hint {
  text-align: center;
  margin-top: 64px;
  font-style: italic;
}

#copyright {
  font-size: 10px;
  color: #555;
  line-height: 1.25em;
}
</style>