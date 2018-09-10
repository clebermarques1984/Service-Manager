<template>
    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-snackbar :top=true :color="status" :value="message" >
              {{message}}
              <v-btn dark flat @click.native="message = ''">Close</v-btn>
            </v-snackbar>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{ $t('login') }}</v-toolbar-title> <!-- Login | Entrar -->
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn
                    slot="activator"
                    to="/register"
                    icon
                    color="accent"
                    large>
                    <v-icon large>person_add</v-icon>
                  </v-btn>
                  <span>{{ $t('register') }}</span> <!-- Register | Criar Conta -->
                </v-tooltip>
              </v-toolbar>
              <v-form @submit.prevent="handleSubmit" ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                    <v-text-field
                      prepend-icon="person"
                      name="email"
                      :label="$t('email')"
                      type="text"
                      autofocus=""
                      autocomplete="username"
                      :rules="[v => !!v || $t('rules.required', {field: $t('email')}), v =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      $t('rules.validEmail')]"
                      v-model="credentials.userName"
                    ></v-text-field> <!-- E-mail -->
                    <v-text-field
                      id="password"
                      prepend-icon="lock"
                      name="password"
                      :label="$t('password')"
                      type="password"
                      autocomplete="current-password"
                      :rules="[v => !!v || $t('rules.required', {field: $t('password')})]"
                      v-model="credentials.password"
                    ></v-text-field> <!-- Password | Senha -->
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="!valid" type="submit" color="primary">
                    {{ $t('login') }}
                  </v-btn> <!-- Login | Entrar -->
                </v-card-actions>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>  
      </v-container> 
    </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import NProgress from 'nprogress';
import ICredentials from '@/models/credentials';

const namespace: string = 'auth';

@Component
export default class Login extends Vue {
  private message: string = '';
  private redirect: string = '';
  private status: string = 'success';
  private valid: boolean = false;
  private credentials = {} as ICredentials;

  private created() {
    this.redirect = this.$route.query.redirect || '';
    if (this.$route.query.new) {
      this.credentials.userName = this.$route.query.userName;
      this.message = this.$t('userRegistrationMsg') as string;
    }
  }

  @Action('authRequest', { namespace })
  private authRequest(credentials: ICredentials): Promise<any> {
    return this.authRequest(credentials);
  }

  private async handleSubmit() {
    this.message = '';
    NProgress.start();
    try {
      const response = await this.authRequest(this.credentials);
      if (!this.redirect) {
        this.redirect = '/';
      }
      this.$router.push(this.redirect);
    } catch (error) {
      this.status = 'error';
      this.message = error;
    }
    NProgress.done();
  }
}
</script>
