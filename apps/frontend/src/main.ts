import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import {initStorage} from './lib/storage.js';
import {initTheme} from './lib/theme.js';

import './assets/w3.css';
import './assets/default.css';

initStorage()
  .then(async () => {
    await initTheme();
    createApp(App).use(router).mount('#app');
  })
  .catch((err) => {
    document.body.innerHTML = `<p style="padding:16px">Speicher konnte nicht initialisiert werden: ${err.message}</p>`;
  });
