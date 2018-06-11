<template>
  <div class="home">
    <h1>Home Page</h1> 
    <div v-show="profile">{{ profile }}</div>   
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import { profileService } from '@/services/profile.service';

const namespace: string = 'user';

@Component
export default class Home extends Vue {
  @Getter('profile', { namespace })
  private profile: any;

  @Action('userRequest', { namespace })
  private userRequest: any;

  private created() {
    console.log('home created');
    if (!this.profile) {
      this.userRequest();
    }
  }
}
</script>