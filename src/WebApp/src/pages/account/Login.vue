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
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn
                    slot="activator"
                    to="/register"
                    icon
                    large>
                    <v-icon large>person_add</v-icon>
                  </v-btn>
                  <span>Register</span>
                </v-tooltip>
              </v-toolbar>
              <v-form @submit.prevent="handleSubmit">
                <v-card-text>
                    <v-text-field
                      prepend-icon="person"
                      name="login"
                      label="Login"
                      type="text"
                      autofocus=""
                      autocomplete="username"
                      v-model="credentials.userName"
                    ></v-text-field>
                    <v-text-field
                      id="password"
                      prepend-icon="lock"
                      name="password"
                      label="Password"
                      type="password"
                      autocomplete="current-password"
                      v-model="credentials.password"
                    ></v-text-field>
                    <Spinner :show="isBusy" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" color="primary">Login</v-btn>
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
import ICredentials from '@/models/credentials';
import Spinner from '@/components/Spinner.vue'; // @ is an alias to /src

const namespace: string = 'auth';

@Component({
  components: {
    Spinner,
  },
})
export default class Login extends Vue {
  private message: string = '';
  private isBusy: boolean = false;
  private redirect: string = '';
  private status: string = 'success';
  private credentials = {} as ICredentials;
  private timeout: number = 6000;

  private created() {
    this.redirect = this.$route.query.redirect || '';
    if (this.$route.query.new) {
      this.credentials.userName = this.$route.query.userName;
      this.message =
        'User registration success! Login with your password to continue';
    }
  }

  @Action('authRequest', { namespace })
  private authRequest(credentials: ICredentials): Promise<any> {
    return this.authRequest(credentials);
  }

  private handleSubmit() {
    this.message = '';
    this.isBusy = true;
    this.authRequest(this.credentials)
      .then(result => {
        if (!this.redirect) {
          this.redirect = '/';
        }
        this.$router.push(this.redirect);
      })
      .catch(err => {
        this.status = 'error';
        this.message = err;
      })
      .then(() => {
        this.isBusy = false;
      });
  }
}
</script>
