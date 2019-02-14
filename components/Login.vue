<template lang="pug">
  v-flex(mb-5 v-if="!createdWallet.address" v-bind:id="navTargetId")
    v-card
      v-form
        v-card-text
          v-radio-group(label="Select Endpoint" v-model="endpoint")
            v-radio(
            v-for="ep in endpoints"
            :key="ep.url"
            :label="ep.label"
            :value="ep.url")
            v-radio(
            label="other"
            value="")
          v-text-field(
          label="Endpoint"
          v-model="userEndpoint"
          name="Endpoint"
          required
          placeholder="ex). http://catapult48gh23s.xyz:3000"
          :disabled="!canEndpointEditable")
          v-layout
            v-flex
              v-text-field(
              label="Private Key"
              v-model="privateKey"
              :counter="64"
              name="PrivateKey"
              required
              placeholder="ex). 25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E")
            v-flex(xs2)
              v-btn(
              fab
              small
              flat
              @click="regenPrivateKey")
                v-icon cached
        v-card-actions
          v-btn(
          color="blue"
          class="white--text"
          @click="createWallet") login
</template>

<script>

  import {Account, NetworkType, Password, SimpleWallet} from 'nem2-sdk';
  const generator = require('generate-password');

  export default {
    name: "Login",
    props: [
      "navTargetId",
      "endpoints",
      "defaultEndpoint",
      "defaultPrivateKey",
      "createdWallet",
      "createdWalletPassword",
    ],
    created: function() {
      this.endpoint = this.defaultEndpoint;
      this.privateKey = this.defaultPrivateKey;
      this.password = new Password("cRb3Q$c7Mf5SPGa3PfnTmBKHHFdv3G!#g6wwXktwJm$BC*M^cjt");
    },
    data() {
      return {
        endpoint: "",
        userEndpoint: "",
        privateKey: "",
        canEndpointEditable: false,
      }
    },
    watch: {
      createdWallet: {
        handler: function(newVal, oldVal) {
          if (oldVal.address && !newVal.address) {
            this.privateKey = oldVal.open(this.createdWalletPassword).privateKey;
            this.$emit("deletePassword");
          }
        }
      },
      endpoint: {
        handler: function(newVal, oldVal) {
          this.canEndpointEditable = !this.endpoints.map(endpoint => endpoint.url).includes(newVal);
        }
      },
    },
    methods: {
      regenPrivateKey: function(event) {
        this.privateKey = Account.generateNewAccount(NetworkType.MIJIN_TEST).privateKey;
      },
      createWallet: function(event) {
        const password = new Password(
          generator.generate({
            length: 50,
            numbers: true,
            symbols: true,
          })
        );
        const name = "myWallet";
        const wallet = SimpleWallet.createFromPrivateKey(
          name,
          password,
          this.privateKey,
          NetworkType.MIJIN_TEST
        );
        this.privateKey = "";
        const endpoint = this.endpoint || this.userEndpoint;
        this.$emit("walletCreated", {wallet, password, endpoint});
      },
    }
  }
</script>

<style scoped>

</style>
