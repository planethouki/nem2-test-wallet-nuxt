<template>
  <section class="container">
    <head-menu/>
    <div>
      <h1 class="title">
        {{ name }}
      </h1>
      <h2 class="subtitle">
        {{ description }}
      </h2>
    </div>
    <div>
      <label>
        <span>Endpoint</span>
        <input v-model="endpoint">
      </label>
    </div>
    <div>
      <label>
        <span>PrivateKey</span>
        <input v-model="privateKey">
      </label>
      <input type="button" value="generate" v-on:click="generatePrivateKeyHandler">
    </div>
    <div>
      <label>
        wallet name
        <input v-model="walletName">
      </label>
    </div>
    <div>
      <label>
        wallet password
        <input v-model="walletPassword">
      </label>
      <input type="button" value="generate" v-on:click="generateWalletPasswordHandler">
    </div>
    <div>
      <input type="button" value="create wallet" v-on:click="createWalletHandler">
      <input type="button" value="remove wallet" v-on:click="removeWalletHandler">
    </div>
    <div>
      <wallet-view v-if="isWalletExists"/>
      <transfer-transaction v-if="isWalletExists"/>
    </div>
  </section>
</template>

<script>
  import HeadMenu from '~/components/HeadMenu.vue'
  import TransferTransaction from '../components/TransferTransaction'
  import WalletView from "../components/WalletView";
  const nem2Sdk = require("nem2-sdk");

  export default {
    asyncData (context) {
      return {
        name: "Simple Wallet",
        description: "",
        endpoint: "http://catapult48gh23s.xyz:3000",
        privateKey: "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
        walletName: "myWallet",
        walletPassword: "cRb3Q$c7Mf5SPGa3PfnTmBKHHFdv3G!#g6wwXktwJm$BC*M^cjtZM!EJ",
        isWalletExists: false
      }
    },
    computed: {},
    methods: {
      generatePrivateKeyHandler: function(event) {
        let account = nem2Sdk.Account.generateNewAccount(nem2Sdk.NetworkType.MIJIN_TEST);
        this.privateKey = account.privateKey;
      },
      generateWalletPasswordHandler(event) {
        let seed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&=~/*-+";
        let str = "";
        for (let i = 0; i < 50; i++) {
          str += seed.charAt(Math.floor(Math.random() * seed.length));
        }
        this.walletPassword = str;
      },
      createWalletHandler: function(event) {
        let password = new nem2Sdk.Password(this.walletPassword);
        let wallet = nem2Sdk.SimpleWallet.createFromPrivateKey(
          this.walletName,
          password,
          this.privateKey,
          nem2Sdk.NetworkType.MIJIN_TEST
        );
        this.$store.commit('wallets/addWallet', wallet, password);
        this.$store.commit('wallets/addEndPoint', this.endpoint);
        this.isWalletExists = true;
      },
      removeWalletHandler: function(event) {
        this.$store.commit('wallets/remove');
        this.isWalletExists = false;
      }
    },
    components: {
      WalletView,
      TransferTransaction,
      HeadMenu
    },
    head () {
      return {
        title: this.name,
        meta: [
          { hid: 'send', name: 'send', content: 'send' }
        ]
      }
    },

  }
</script>

<style scoped>

</style>
