<template>
  <v-card v-if="existsAccount" style="max-width: 600px;">
    <v-card-title>
      <div class="title">
        REST
      </div>
    </v-card-title>
    <v-card-text>
      <h3>Account</h3>
      <div>
        <v-btn :href="`${endpoint}/account/${publicAccount.publicKey}`" target="_blank" small>
          account
        </v-btn>
        <v-btn :href="`${endpoint}/account/${publicAccount.publicKey}/transactions`" target="_blank" small>
          transactions
        </v-btn>
        <v-btn :href="`${endpoint}/account/${publicAccount.publicKey}/transactions/incoming`" target="_blank" small>
          incoming
        </v-btn>
        <v-btn :href="`${endpoint}/account/${publicAccount.publicKey}/transactions/outgoing`" target="_blank" small>
          outgoing
        </v-btn>
        <v-btn :href="`${endpoint}/account/${publicAccount.publicKey}/transactions/unconfirmed`" target="_blank" small>
          unconfirmed
        </v-btn>
        <v-btn :href="`${endpoint}/account/${publicAccount.publicKey}/transactions/partial`" target="_blank" small>
          partial
        </v-btn>
        <v-btn :href="`${endpoint}/restrictions/account/${publicAccount.publicKey}`" target="_blank" small>
          restrictions
        </v-btn>
        <v-btn :href="`${endpoint}/account/${publicAccount.publicKey}/multisig`" target="_blank" small>
          multisig
        </v-btn>
        <v-btn :href="`${endpoint}/account/${publicAccount.publicKey}/namespaces`" target="_blank" small>
          namespaces
        </v-btn>
        <v-btn :href="`${endpoint}/account/${publicAccount.publicKey}/metadata`" target="_blank" small>
          metadata
        </v-btn>
      </div>
      <h3 class="mt-2">
        Others
      </h3>
      <div>
        <v-btn :href="`${endpoint}/chain/height`" target="_blank" small>
          height
        </v-btn>
        <v-btn :href="`${endpoint}/chain/score`" target="_blank" small>
          score
        </v-btn>
        <v-btn :href="`${endpoint}/diagnostic/storage`" target="_blank" small>
          storage
        </v-btn>
        <v-btn :href="`${endpoint}/diagnostic/server`" target="_blank" small>
          server
        </v-btn>
        <v-btn :href="`${endpoint}/network`" target="_blank" small>
          network
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TheRestLink',
  computed: {
    ...mapGetters('wallet', [
      'publicAccount',
      'existsAccount',
      'endpoint'
    ])
  }
}
</script>

<style scoped>
.v-btn {
  margin: .3rem .1rem;
}
</style>
