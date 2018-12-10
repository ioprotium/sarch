<template>
  <div id="fire-auth"></div>
</template>

<script>

export default {
  props: {
    ui: {
      type: Object
    }
  },
  mounted() {    
    this.ui.start('#fire-auth', {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          return false;
        }
      },
      signInFlow: 'popup',
      credentialHelper: firebaseui.auth.CredentialHelper.NONE, // disdable chooser to avoid redirects
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
          customParameters: {
            // Forces password re-entry.
            auth_type: 'reauthenticate'
          }
        }
      ]
    });
  }
}
</script>

