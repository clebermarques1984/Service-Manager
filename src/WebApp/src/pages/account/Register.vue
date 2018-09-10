<template>
  <v-content>  
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-snackbar :top=true :color="color" :value="errors" >
              {{errors}}
              <v-btn dark flat @click.native="errors = ''">Close</v-btn>
            </v-snackbar>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{ $t('register') }}</v-toolbar-title> <!-- Register | Criar Conta -->
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn
                    slot="activator"
                    to="/login"
                    icon
                    color="accent"
                    large>
                    <v-icon large>person</v-icon>
                  </v-btn>
                  <span>{{ $t('login') }}</span> <!-- Login | Entrar -->
                </v-tooltip>
              </v-toolbar>
              <v-form @submit.prevent="handleSubmit" ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                    <v-text-field
                      name="email"
                      :label="$t('email')"
                      type="text"
                      autocomplete="email"
                      autofocus=""
                      :rules="[v => !!v || $t('rules.required', {field: $t('email')}), v =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      $t('rules.validEmail')]"
                      v-model="user.email"
                    ></v-text-field> <!-- E-mail -->
                    <v-text-field
                      id="password"
                      name="password"
                      :label="$t('password')"
                      type="password"
                      autocomplete
                      :rules="[v => !!v || $t('rules.required', {field: $t('password')})]"
                      v-model="user.password"
                    ></v-text-field> <!-- Password | Senha -->
                    <v-text-field
                      id="confirm"
                      name="confirm"
                      :label="$t('confirmPassword')"
                      type="password"
                      autocomplete
                      :rules="[v => v == user.password || $t('rules.confirmPassword')]"
                      v-model="user.confirmPassword"
                    ></v-text-field>
                </v-card-text> <!-- Confirm Password | Confirmar Senha -->
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="!valid" type="submit" color="primary">
                    {{ $t('register') }}
                  </v-btn> <!-- Register | Criar Conta -->
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
import IUserRegistration from '@/models/user.registration';

const namespace: string = 'user';

@Component
export default class Register extends Vue {
  private errors: string = '';
  private user = {} as IUserRegistration;
  private color: string = 'error';
  private valid: boolean = false;

  @Action('userRegister', { namespace })
  private userRegister(user: IUserRegistration): Promise<any> {
    return this.userRegister(user);
  }

  private async handleSubmit() {
    this.errors = '';
    NProgress.start();
    try {
      const response = await this.userRegister(this.user);
      this.$router.push({
        name: 'Login',
        query: { new: 'true', userName: this.user.email },
      });
    } catch (error) {
      this.errors = error;
    }
    NProgress.done();
  }
}
</script>