<template lang="pug">
  v-flex(mb-5 v-if="!createdWallet.address" v-bind:id="navTargetId")
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
            v-show="predefinedEndpoint.length == 0"
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

import { Password, SimpleWallet } from 'nem2-sdk'
const generator = require('generate-password')
const rp = require('request-promise-native')

export default {
  name: 'Login',
  props: [
    'navTargetId',
    'endpoints',
    'defaultEndpoint',
    'defaultPrivateKey',
    'createdWallet',
    'createdWalletPassword',
    'defaultNetworkType'
  ],
  data() {
    return {
      predefinedEndpoint: '',
      userEndpoint: '',
      privateKey: '',
      loginDisabled: false
    }
  },
  watch: {
    createdWallet: {
      handler: function (newVal, oldVal) {
        if (oldVal.address && !newVal.address) {
          this.privateKey = oldVal.open(this.createdWalletPassword).privateKey
          this.$emit('deletePassword')
        }
      }
    }
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
      const endpoint = this.predefinedEndpoint || this.userEndpoint
      let network
      try {
        const nodeInfo = JSON.parse(await rp(`${endpoint}/node/info`))
        network = nodeInfo.networkIdentifier
      } catch (e) {
        network = this.defaultNetworkType
      }
      const password = new Password(
        generator.generate({
          length: 50,
          numbers: true,
          symbols: true
        })
      )
      const name = 'myWallet'
      const wallet = SimpleWallet.createFromPrivateKey(
        name,
        password,
        this.privateKey,
        network
      )
      this.privateKey = ''
      this.loginDisabled = false
      this.$emit('walletCreated', { wallet, password, endpoint })
    }
  }
}
</script>

<style scoped>

</style>
