<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      >
    </v-navigation-drawer>
    <v-toolbar dark color="primary" app clipped-left dense>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat v-if="isAuthenticated">Dashboard</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer dark color="primary" app></v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

const namespace: string = 'auth';

@Component
export default class LayoutDefault extends Vue {
  @Getter('isLoggedIn', { namespace })
  private isAuthenticated: boolean;

  private drawer: boolean = false;
}
</script>
