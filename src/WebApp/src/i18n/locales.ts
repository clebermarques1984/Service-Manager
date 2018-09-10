import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './en';
import pt from './pt';

Vue.use(VueI18n);

// Ready translated locale messages
const messages = {
  en,
  pt,
};

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: '',
  messages, // set locale messages
});

export default i18n;
