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
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn slot="activator" to="/login" icon large>
                    <v-icon large>person</v-icon>
                  </v-btn>
                  <span>Login</span>
                </v-tooltip>
              </v-toolbar>
              <v-form @submit.prevent="handleSubmit">
                <v-card-text>
                    <v-text-field
                      name="email"
                      label="Email"
                      type="text"
                      autocomplete="email"
                      autofocus=""
                      v-model="user.email"
                    ></v-text-field>
                    <v-text-field
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      autocomplete="current-password"
                      v-model="user.password"
                    ></v-text-field>
                    <v-text-field
                      name="lacotion"
                      label="Location"
                      type="text"
                      autocomplete="country-name"
                      v-model="user.location"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" color="primary">Register</v-btn>
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
import { accountService } from '@/services/account.service';

const namespace: string = 'user';

@Component
export default class Register extends Vue {
  private errors: string = '';
  private user = {} as IUserRegistration;
  private color: string = 'error';
  private timeout: number = 6000;

  @Action('userRegister', { namespace })
  private userRegister(user: IUserRegistration): Promise<any> {
    return this.userRegister(user);
  }

  private handleSubmit() {
    this.errors = '';
    NProgress.start();
    this.userRegister(this.user)
      .then(() => {
        this.$router.push({
          name: 'Login',
          query: {
            new: 'tue',
            userName: this.user.email,
          },
        });
      })
      .catch(err => {
        this.errors = err;
      })
      .then(() => {
        NProgress.done();
      });
  }
}
</script>