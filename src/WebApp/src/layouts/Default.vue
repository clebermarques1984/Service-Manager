<template>
  <v-app>
    <v-navigation-drawer v-if="isAuthenticated" v-model="drawer" fixed app >
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/customer">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('customer') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark color="primary" app dense>
      <v-toolbar-side-icon v-if="isAuthenticated" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>CRMLite</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat v-if="isAuthenticated">{{UserName}}</v-btn>
      </v-toolbar-items>
      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator">
          <span>{{ $i18n.locale.toUpperCase() }}</span>
          <v-icon dark>arrow_drop_down</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile
            v-for="item in Locales"
            :key="item"
            @click="setLocale(item)"
            >
            <v-list-tile-title v-text="item.toUpperCase()"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-content>
    <v-footer dark color="primary" app></v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import { profileService } from '@/services/profile.service';
import IProfile from '@/models/profile';

const namespace: string = 'auth';

@Component
export default class LayoutDefault extends Vue {
  private drawer: boolean | null = null;

  @Getter('isLoggedIn', { namespace })
  private isAuthenticated: boolean;

  @Getter('profile', { namespace: 'user' })
  private profile: IProfile;

  private goToAbout() {
    this.$router.push('/about');
  }

  private setLocale(locale: string) {
    this.$i18n.locale = locale;
  }

  get Locales(): string[] {
    return Object.keys(this.$i18n.messages);
  }

  get UserName() {
    return this.profile && this.profile.userName;
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
