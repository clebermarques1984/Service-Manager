<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import LayoutDefault from './layouts/Default.vue';
import LayoutEmpty from './layouts/Empty.vue';

const namespace: string = 'auth';

@Component({
  components: {
    LayoutDefault,
    LayoutEmpty,
  },
})
export default class App extends Vue {
  @Getter('layout') private layout: string;
  @Action('tryAutoLogin', { namespace })
  private tryAutoLogin: any;

  private created() {
    this.tryAutoLogin();
  }
}
</script>
