<template>
<v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
                <h1>404 page not found</h1>
                <blockquote>How did we get here?</blockquote>
                <router-link to="/">Take me home.</router-link>
          </v-flex>
        </v-layout>  
      </v-container> 
    </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NotFound extends Vue {}
</script>
