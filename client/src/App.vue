<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">sarch</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="user !== null"
        flat
        @click="logout"
      >
        <span class="mr-2">logout</span>
      </v-btn>
      <v-btn
        flat
        :href="docsUrl"
        target="_blank"
      >
        <span class="mr-2">API DOCS</span>
      </v-btn>
      <v-btn
        flat
        href="https://github.com/ioprotium/sarch"
        target="_blank"
      >
        <span class="mr-2">github</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container>
        <v-layout
          align-center
          justify-center
        >
          <h1 v-if="loading">LOADING</h1>
          <Login
            v-else-if="user === null"
            :ui="ui"
          />
          <Accounts
            v-else
            :userToken="userToken"
          />
        </v-layout>
      </v-container>

    </v-content>
  </v-app>
</template>

<script>
import Accounts from './components/Accounts'
import Login from './components/Login'

export default {
  name: 'App',
  components: {
    Accounts,
    Login
  },
  data() {
    return {
      user: null,
      userToken: null,
      ui: null,
      loading: true,
      docsUrl: process.env.VUE_APP_ROOT_API + '/docs'
    }
  },
  created() {
    const config = {
      apiKey: 'AIzaSyC80_duW4Uapsz-o0CWiyp8lJKtc0yQHOc',
      authDomain: 'sarch-io.firebaseapp.com',
      databaseURL: 'https://sarch-io.firebaseio.com',
      projectId: 'sarch-io',
      storageBucket: 'sarch-io.appspot.com',
      messagingSenderId: '433056708021'
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        firebase.auth().currentUser.getIdToken(false).then(idToken => {
          this.user = firebaseUser
          this.userToken = idToken        
          this.loading = false
        }).catch(error => {
          console.log('Filed to get Firebase Auth Token', error)
        });
      } else {
        this.loading = false
      }      
    })
    this.ui = new firebaseui.auth.AuthUI(firebase.auth())
  },
  methods: {
    logout() {
      firebase.auth().signOut()
      this.user = null
    }
  }
}
</script>

<style>
html, body {
	overflow: hidden;
}
</style>
