<template lang="pug">
  v-flex(mb-5 v-bind:id="navTargetId")
    v-card
      v-form
        v-card-text
          v-radio-group(label="Select Endpoint" v-model="predefinedEndpoint")
            v-radio(
              v-for="ep in endpointList"
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
import { mapGetters } from 'vuex'

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
      'currencyNamespaceName',
      'harvestNamespaceName'
    ])
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
      let endpoint = this.predefinedEndpoint || this.userEndpoint
      if (endpoint.match(/:\d+$/) === null) {
        endpoint = `${endpoint}:3000`
      }
      if (!endpoint.startsWith('http')) {
        endpoint = `http://${endpoint}`
      }
      await this.$store.dispatch('wallet/privateKeyLogin', { privateKey: this.privateKey, endpoint })
      await this.$store.dispatch('chain/init', {
        endpoint,
        currencyNamespaceName: this.currencyNamespaceName,
        harvestNamespaceName: this.harvestNamespaceName
      })
      await this.$store.dispatch('chain/updateBlockHeight', {
        endpoint: this.endpoint
      })
      await this.$store.dispatch('chain/updateMosaicAmountVies', {
        endpoint: this.endpoint,
        address: this.address
      })
      this.loginDisabled = false
      this.$router.push('/info')
    }
  }
}
</script>

<style scoped>

</style>
