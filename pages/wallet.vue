<template>
  <div>
    <section class="section">
      <div class="container">
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
            <input v-model="walletPrivateKey">
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
        </div>
        <div>
          <input type="button" value="create wallet" v-on:click="createWalletHandler">
        </div>

        <div v-show="isPrivateKeyExists">
          <div>
            <span>Mosaics: </span>
            <input type="button" value="reload" v-on:click="mosaicReloadHandler">
            <ul>
              <li v-for="mosaic in mosaics" v-bind:key="mosaic.id.toHex()">
                {{ mosaic.id.toHex()}} {{mosaic.amount.compact()}}
              </li>
            </ul>
          </div>
          <div>
            <span>Wallet: </span>
            <ul>
              <li>name: {{ walletName }}</li>
              <li>network type: {{ walletNetwork }}</li>
              <li>
                <span>address: </span>
                <span ref="address">{{ walletAddress }}</span>
                <input type="button" value="copy" v-on:click="copyWalletAddressHandler">
              </li>
              <li>creation date: {{ walletCreationDate }}</li>
              <li>encrypted private key: </li>
              <ul>
                <li>data: {{ walletEncryptedPrivateKey }}</li>
                <li>initial vector: {{ walletEncryptedPrivateKeyIV }}</li>
              </ul>
            </ul>
          </div>
          <div>
            <span>Get XEM: </span>
            <a v-bind:href="faucetUrl" target="_blank">faucet</a>
          </div>

          <div>
            <span>Transfer Transaction: </span>
            <div class="_offset50">
              <label>
                Recepient:
                <input v-model="t_recipient">
              </label>
              <label>
                Mosaic:
                <input v-model="t_mosaics">
              </label>
              <label>
                Message:
                <input v-model="t_message">
              </label>
              <input type="button" value="send" v-on:click="t_sendHandler">
              <ul>
                <li v-for="tx in t_sendHistory" v-bind:key="tx.hash">
                  <a v-bind:href="tx.apiStatusUrl" target="_blank">{{ tx.hash }}</a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div>
          <h3>stored wallet</h3>
          <li v-for="w in wallets">
            <input type="button" v-bind:value="w.name" v-on:click="loadWalletHandler">
          </li>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
  // import {LocalDateTime} from 'js-joda/src/LocalDateTime.js'
  import {LocalDateTime} from 'js-joda'
  // import {DateTimeFormatter} from 'js-joda/src/format/DateTimeFormatter.js'
  // const LocalDateTime = require('js-joda').LocalDateTime;
  const nem2Sdk = require("nem2-sdk");

  export default {
    layout: 'baseline',
    asyncData (context) {
      return {
        name: "Simple Wallet",
        description: "",
        endpoint: "http://catapult48gh23s.xyz:3000",
        walletPrivateKey: "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
        isPrivateKeyExists: false,
        prettyAddress: "",
        mosaics: [],
        wallet: {},
        walletName: "myWallet",
        walletPassword: "cRb3Q$c7Mf5SPGa3PfnTmBKHHFdv3G!#g6wwXktwJm$BC*M^cjtZM!EJ",
        walletNetwork: "",
        walletAddress: "",
        walletCreationDate: "",
        walletEncryptedPrivateKey: "",
        walletEncryptedPrivateKeyIV: "",
        faucetUrl: "",
        t_recipient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
        t_mosaics: "nem:xem::1000000",
        t_message: "Hello Nem2!",
        t_sendHistory: []
      }
    },
    components: {

    },
    computed: {
      wallets () { return this.$store.state.wallets.list }
    },
    methods: {
      generatePrivateKeyHandler: function(event) {
        let account = nem2Sdk.Account.generateNewAccount(nem2Sdk.NetworkType.MIJIN_TEST);
        this.privateKey = account.walletPrivateKey;
      },
      createWalletHandler: function(event) {
        this.isPrivateKeyExists = true;
        let wallet = nem2Sdk.SimpleWallet.createFromPrivateKey(
          this.walletName,
          new nem2Sdk.Password(this.walletPassword),
          this.walletPrivateKey,
          nem2Sdk.NetworkType.MIJIN_TEST
        );
        this.wallet = wallet;
        this.walletName = wallet.name;
        this.walletNetwork = wallet.network;
        this.walletAddress = wallet.address.pretty();
        this.walletCreationDate = wallet.creationDate;
        this.walletEncryptedPrivateKey = wallet.encryptedPrivateKey.encryptedKey;
        this.walletEncryptedPrivateKeyIV = wallet.encryptedPrivateKey.iv;
        if (this.endpoint.includes("44uk")) {
          this.faucetUrl = `http://test-nem2-faucet.44uk.net/?address=${this.walletAddress}`;
        } else if (this.endpoint.includes("daoka")) {
          this.faucetUrl = `http://catapult-test.daoka.ml:4567/?address=${this.walletAddress}`;
        } else if (this.endpoint.includes("soralis")) {
          this.faucetUrl = `http://catapult-test.soralis.org:4567/?address=${this.walletAddress}`;
        } else if (this.endpoint.includes("48gh23s")) {
          this.faucetUrl = `https://faucet48gh23s.azurewebsites.net/?address=${this.walletAddress}`;
        }
        let ac = new nem2Sdk.AccountHttp(this.endpoint, nem2Sdk.NetworkType.MIJIN_TEST);
        ac.getAccountInfo(wallet.address).toPromise().then((result) => {
          this.importance = result.importance.compact();
          this.publicKey = result.publicKey;
          this.mosaics = result.mosaics;
        }).catch((error) => {

        });
        this.$store.commit('wallets/addWallet', wallet)
      },
      mosaicReloadHandler: function(event) {
        let ac = new nem2Sdk.AccountHttp(this.endpoint, nem2Sdk.NetworkType.MIJIN_TEST);
        ac.getAccountInfo(this.wallet.address).toPromise().then((result) => {
          this.importance = result.importance.compact();
          this.publicKey = result.publicKey;
          this.mosaics = result.mosaics;
        }).catch((error) => {

        });
      },
      copyWalletAddressHandler: function(event) {
        let target = this.$refs.address;
        let range = document.createRange();
        range.selectNode(target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
      },
      t_sendHandler: function(event) {
        let mosaics = this.t_mosaics.split(",").map((mosaicRawStr) => {
          let nameAndAmount = mosaicRawStr.split("::");
          return new nem2Sdk.Mosaic(
            new nem2Sdk.MosaicId(nameAndAmount[0]),
            nem2Sdk.UInt64.fromUint(nameAndAmount[1])
          );
        });
        let tx = nem2Sdk.TransferTransaction.create(
          nem2Sdk.Deadline.create(23),
          nem2Sdk.Address.createFromRawAddress(this.t_recipient),
          mosaics,
          nem2Sdk.PlainMessage.create(this.t_message),
          nem2Sdk.NetworkType.MIJIN_TEST
        );
        let account = this.wallet.open(new nem2Sdk.Password(this.walletPassword));
        let signedTx = account.sign(tx);
        let txHttp = new nem2Sdk.TransactionHttp(this.endpoint);
        txHttp.announce(signedTx).toPromise().then((resolve, reject) => {

        });
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${this.endpoint}/transaction/${signedTx.hash}/status`
        };
        this.t_sendHistory.push(historyData);
      },
      loadWalletHandler: function(event) {
        let walletDataArr = this.$store.state.wallets.list.filter((elm) => {
          if (elm.name === event.target.value) {
            return true
          } else {
            return false
          }
        });
        let walletData = walletDataArr[0]
        let name = walletData.name
        let address = nem2Sdk.Address.createFromRawAddress(walletData.address)
        let encryptedPrivateKey = new nem2Sdk.EncryptedPrivateKey(
          walletData.encryptedPrivateKey.encryptedKey, walletData.encryptedPrivateKey.iv)
        let creationDate = LocalDateTime.parse(walletData.creationDate);
        let recoveredWallet = new nem2Sdk.SimpleWallet(name, nem2Sdk.NetworkType.MIJIN_TEST, address, creationDate, encryptedPrivateKey)

        this.wallet = recoveredWallet;
        this.walletName = recoveredWallet.name;
        this.walletNetwork = recoveredWallet.network;
        this.walletAddress = recoveredWallet.address.pretty();
        this.walletCreationDate = recoveredWallet.creationDate;
        this.walletEncryptedPrivateKey = recoveredWallet.encryptedPrivateKey.encryptedKey;
        this.walletEncryptedPrivateKeyIV = recoveredWallet.encryptedPrivateKey.iv;
        if (this.endpoint.includes("44uk")) {
          this.faucetUrl = `http://test-nem2-faucet.44uk.net/?address=${this.walletAddress}`;
        } else if (this.endpoint.includes("daoka")) {
          this.faucetUrl = `http://catapult-test.daoka.ml:4567/?address=${this.walletAddress}`;
        } else if (this.endpoint.includes("soralis")) {
          this.faucetUrl = `http://catapult-test.soralis.org:4567/?address=${this.walletAddress}`;
        } else if (this.endpoint.includes("48gh23s")) {
          this.faucetUrl = `https://faucet48gh23s.azurewebsites.net/?address=${this.walletAddress}`;
        }
        let ac = new nem2Sdk.AccountHttp(this.endpoint, nem2Sdk.NetworkType.MIJIN_TEST);
        ac.getAccountInfo(recoveredWallet.address).toPromise().then((result) => {
          this.importance = result.importance.compact();
          this.publicKey = result.publicKey;
          this.mosaics = result.mosaics;
        }).catch((error) => {

        });

        this.isPrivateKeyExists = true;
      }
    },
    head () {
      return {
        title: this.name,
        meta: [
          { hid: 'recoveredWallet', name: 'recoveredWallet', content: 'recoveredWallet' }
        ]
      }
    },

  }
</script>

<style scoped>
._offset50 {
  margin-left: 50px;
}
</style>
