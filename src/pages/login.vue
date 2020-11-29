<template lang="pug">
  main
    v-card
      v-card-title Catapult Transaction Interface ({{ mileStone }})
      v-card-text
        v-radio-group(label="Select Endpoint" v-model="predefinedEndpoint")
          v-radio(
            v-for="ep in endpointList"
            :key="ep.url"
            :label="ep.label"
            :value="ep.url")
          v-radio(
            label="other"
            value="other")
        v-text-field(
          v-show="predefinedEndpoint === 'other'"
          label="Endpoint"
          v-model="userEndpoint"
          name="Endpoint"
          required
          placeholder="ex). http://localhost:3000")
        v-text-field(
          label="Private Key"
          v-model="privateKey"
          :counter="64"
          name="PrivateKey"
          required
          placeholder="ex). 25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E")
          template(slot="append-outer")
            v-btn(
              fab
              small
              @click="regenPrivateKey")
              v-icon cached
      v-card-actions
        v-btn(
          :disabled="loginDisabled"
          color="blue"
          class="white--text"
          @click="createWallet") login
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'login',
  asyncData ({ store, redirect }) {
    if (store.getters['wallet/existsAccount']) {
      redirect('/transaction')
    }
  },
  data () {
    return {
      predefinedEndpoint: '',
      userEndpoint: '',
      privateKey: '',
      loginDisabled: false
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAccount',
      'networkType',
      'address',
      'endpoint'
    ]),
    ...mapGetters('env', [
      'endpointList',
      'defaultEndpoint',
      'defaultPrivateKey',
      'defaultNetworkType',
      'mileStone'
    ]),
    head () {
      return {
        meta: [
          { hid: 'top', name: 'top', content: 'top' }
        ]
      }
    },
    endpoint () {
      let endpoint = this.predefinedEndpoint === 'other' ? this.userEndpoint : this.predefinedEndpoint
      if (endpoint.match(/:\d+$/) === null) {
        endpoint = `${endpoint}:3000`
      }
      if (!endpoint.startsWith('http')) {
        endpoint = `http://${endpoint}`
      }
      return endpoint
    }
  },
  created () {
    this.predefinedEndpoint = this.defaultEndpoint
    this.privateKey = this.defaultPrivateKey
  },
  methods: {
    regenPrivateKey (event) {
      this.privateKey = this.$crypto.random32()
    },
    async createWallet (event) {
      this.loginDisabled = true
      await this.$store.dispatch('wallet/privateKeyLogin', { privateKey: this.privateKey, endpoint: this.endpoint })
      await Promise.all([
        this.$store.dispatch('chain/init')
      ])
      this.loginDisabled = false
      this.$router.push('/transaction')
    }
  }
}
</script>

<style scoped>
main {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin-top: 5rem;
  margin-left: auto;
  margin-right: auto;
}
</style>
