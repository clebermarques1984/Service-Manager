<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import LayoutDefault from './layouts/Default.vue';
import LayoutLogin from './layouts/Login.vue';
import LayoutRegister from './layouts/Register.vue';

const namespace: string = 'auth';

@Component({
  components: {
    LayoutDefault,
    LayoutLogin,
    LayoutRegister,
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
