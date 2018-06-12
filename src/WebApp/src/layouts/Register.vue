<template>
  <section class="section">    
      <div>
        <div>
          <h3>Register</h3>
          <p>Please enter your information</p>
          <div>     
             <!-- @submit handles any form of submission. -->
             <!-- .prevent keeps the event from bubbling around and doing anything else. -->  
            <form @submit.prevent="handleSubmit">
              <div>
                <div>
                  <input type="text" placeholder="First name" v-model="user.firstName" autofocus="">
                </div>
              </div>

              <div>
                <div>
                  <input type="text" placeholder="Last name" v-model="user.lastName">
                </div>
              </div>

              <div>
                <div>
                  <input type="email" placeholder="Email" v-model="user.email">
                </div>
              </div>

              <div>
                <div>
                  <input type="password" placeholder="Password" v-model="user.password">
                </div>
              </div>

              <div>
                <div>
                  <input type="text" placeholder="Location" v-model="user.location">
                </div>
              </div>  
              <Spinner v-bind:show="isBusy" />
              <button type="submit">Submit</button>
              <div v-if="errors">
                 {{errors}}
              </div>
            </form>
          </div>
          <p>
             <router-link to="/login">Login</router-link>
          </p>        
        </div>
      </div>   
  </section>
  </template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import Spinner from '@/components/Spinner.vue'; // @ is an alias to /src
import IUserRegistration from '@/models/user.registration';
import { accountService } from '@/services/account.service';

const namespace: string = 'user';

@Component({
  components: {
    Spinner,
  },
})
export default class LayoutRegister extends Vue {
  private isBusy: boolean = false;
  private errors: string = '';
  private user = {} as IUserRegistration;

  @Action('userRegister', { namespace })
  private userRegister(user: IUserRegistration): Promise<any> {
    return this.userRegister(user);
  }

  private handleSubmit() {
    this.isBusy = true;
    this.userRegister(this.user)
      .then(() => {
        this.$router.push({
          name: 'loginForm',
          query: {
            new: 'tue',
            firstName: this.user.firstName,
            email: this.user.email,
          },
        });
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