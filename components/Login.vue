<template lang="pug">
  v-flex(mb-5 v-if="isShow" v-bind:id="navTargetId")
    v-card
      v-form
        v-card-text
          v-radio-group(label="Select Endpoint" v-model="predefinedEndpoint")
            v-radio(
              v-for="ep in endpoints"
              :key="ep.url"
              :label="ep.label"
              :value="ep.url")
            v-radio(
              label="other"
              value="")
          v-text-field(
            v-show="predefinedEndpoint.length === 0"
            label="Endpoint"
            v-model="userEndpoint"
            name="Endpoint"
            required
            placeholder="ex). http://localhost:3000")
          v-layout(row)
            v-text-field(
              label="Private Key"
              v-model="privateKey"
              :counter="64"
              name="PrivateKey"
              required
              placeholder="ex). 25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E")
            v-btn(
              fab
              small
              flat
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

import { NetworkType } from 'nem2-sdk'
const rp = require('request-promise-native')

export default {
  name: 'Login',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'login'
      }
    }
  },
  data() {
    return {
      predefinedEndpoint: '',
      userEndpoint: '',
      privateKey: '',
      loginDisabled: false,
      endpoints: [
        { url: 'http://54.178.241.129:3000', label: 'cow (54.178.241.129)' },
        { url: 'http://13.114.36.139:3000', label: 'cow with fee (13.114.36.139)' }
      ],
      defaultEndpoint: 'http://54.178.241.129:3000',
      defaultPrivateKey: '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
      defaultNetworkType: NetworkType.MIJIN_TEST
    }
  },
  computed: {
    isShow() {
      return !this.$store.getters['wallet/existsAccount']
    }
  },
  watch: {
  },
  created: function () {
    this.predefinedEndpoint = this.defaultEndpoint
    this.privateKey = this.defaultPrivateKey
  },
  methods: {
    regenPrivateKey: function (event) {
      this.privateKey = this.$crypto.random32()
    },
    createWallet: async function (event) {
      this.loginDisabled = true
      const privateKey = this.privateKey
      let endpoint = this.predefinedEndpoint || this.userEndpoint
      if (endpoint.match(/:\d+$/) === null) {
        endpoint = `${endpoint}:3000`
      }
      if (!endpoint.startsWith('http')) {
        endpoint = `http://${endpoint}`
      }
      let networkType = NetworkType.MIJIN_TEST
      try {
        const nodeInfo = JSON.parse(await rp(`${endpoint}/node/info`))
        networkType = nodeInfo.networkIdentifier
      } catch (e) {
        // eslint-disable-next-line
        console.log("failed to get NetworkType. MIJIN_TEST assumed.")
      }
      this.$store.commit('wallet/login', { privateKey, endpoint, networkType })
      this.loginDisabled = false
    }
  }
}
</script>

<style scoped>

</style>
