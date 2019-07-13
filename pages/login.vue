<template lang="pug">
  v-layout(row)
    v-flex#content.pt-3.px-3
      v-flex(mb-5)#login
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
  layout: 'login',
  head() {
    return {
      meta: [
        { hid: 'top', name: 'top', content: 'top' }
      ]
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
    ]),
    breakPoint() {
      return this.$vuetify.breakpoint.name
    }
  },
  watch: {
  },
  asyncData({ store, redirect }) {
    if (store.getters['wallet/existsAccount']) {
      redirect('/info')
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
      let endpoint = this.predefinedEndpoint || this.userEndpoint
      if (endpoint.match(/:\d+$/) === null) {
        endpoint = `${endpoint}:3000`
      }
      if (!endpoint.startsWith('http')) {
        endpoint = `http://${endpoint}`
      }
      await this.$store.dispatch('wallet/privateKeyLogin', { privateKey: this.privateKey, endpoint })
      await this.$store.dispatch('chain/init')
      await this.$store.dispatch('mosaicAmountViews/update')
      await this.$store.dispatch('multisigGraph/update')
      await this.$store.dispatch('namespaces/update')
      await this.$store.dispatch('accountProperties/update')
      await this.$store.dispatch('accountLink/update')
      await this.$store.dispatch('transactions/update')
      this.loginDisabled = false
      this.$router.push('/info')
    }
  }
}
</script>

<style>
  .title {
    color: #35495e;
    font-weight: bold;
  }
  .subheading {
    color: #35495e;
    font-weight: bold;
  }
</style>
