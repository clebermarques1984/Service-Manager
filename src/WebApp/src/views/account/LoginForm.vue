<template>
    <section class="section">
      <div>
        <div>
          <h3>Login</h3>
          <p>Please login to proceed</p>         
          <article v-if="$route.query.new">
          <div>
            <strong>You're all set {{$route.query.firstName}}!</strong> Login with your password to continue.
          </div>
          </article>
          <div>          
            <form @submit.prevent="handleSubmit">
              <div>
                <div>
                  <input type="email" placeholder="Email" autofocus="" v-model="credentials.userName">
                </div>
              </div>
              <div>
                <div>
                  <input type="password" placeholder="Password" v-model="credentials.password">
                </div>
              </div>
              <Spinner v-bind:show="isBusy" />
              <button type="submit">Login</button>
              <div v-if="errors">
                 {{errors}}
              </div>
            </form>
          </div>
          <p>
             <router-link to="/register">Sign Up</router-link>
          </p>
        </div>
      </div>  
  </section> 
</template>

<script lang="ts">
import Spinner from '@/components/Spinner.vue'; // @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator';
import { Credentials } from '../../models/credentials.interface';

@Component({
  components: {
    Spinner,
  },
})
export default class LoginForm extends Vue {

private isBusy: boolean = false;
private errors: string = '';
private credentials = {} as Credentials;

private created() {
  if (this.$route.query.new) {
    this.credentials.userName = this.$route.query.email;
  }
}

private handleSubmit() {
     this.isBusy = true;
     this.$store.dispatch('auth/authRequest', this.credentials).then((result) => {
     this.$router.push('/');
    })
   .catch((err) => {
    this.errors = err;
  })
  .then(() => {
    this.isBusy = false;
  });
 }
}
</script>
