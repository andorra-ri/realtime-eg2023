import { createApp } from 'vue';
import App from './App.vue';
import { createI10n } from './composables';
import dictionary from './dictionary.yaml';
import config from './config.yaml';

import 'reset-css';
import './styles/main.scss';

createI10n({
  messages: dictionary,
  dateFormat: config.formats.DATE,
});

const app = createApp(App);
app.mount('#app');
