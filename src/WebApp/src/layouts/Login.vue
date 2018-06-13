<template>
    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-snackbar
              :top=true
              :color="color"
              :value="errors"
            >
              {{errors}}
              <v-btn dark flat @click.native="errors = ''">Close</v-btn>
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
              <v-card-text>
                <v-form @submit.prevent="handleSubmit">
                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                    v-model="credentials.userName"
                    required>
                  </v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="credentials.password"
                    required>
                  </v-text-field>
                </v-form>
                <Spinner v-bind:show="isBusy" />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="handleSubmit" color="primary">Login</v-btn>
              </v-card-actions>
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
export default class LayoutLogin extends Vue {
  private isBusy: boolean = false;
  private errors: string = '';
  private credentials = {} as ICredentials;
  private color: string = 'error';
  private timeout: number = 6000;

  private created() {
    if (this.$route.query.new) {
      this.credentials.userName = this.$route.query.email;
    }
  }

  @Action('authRequest', { namespace })
  private authRequest(credentials: ICredentials): Promise<any> {
    return this.authRequest(credentials);
  }

  private handleSubmit() {
    this.errors = '';
    this.isBusy = true;
    this.authRequest(this.credentials)
      .then(result => {
        this.$router.push('/');
      })
      .catch(err => {
        this.errors = err;
      })
      .then(() => {
        this.isBusy = false;
      });
  }
}
</script>
