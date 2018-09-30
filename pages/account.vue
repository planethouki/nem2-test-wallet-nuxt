<template>
  <section class="container">
    <div>
      <head-menu/>
      <h1 class="title">
        {{ name }}
      </h1>
      <h2 class="subtitle">
        {{ description }}
      </h2>
    </div>
    <div>
      <label>
        Address
        <input v-bind:value="address">
      </label>
    </div>
    <div>
      <label>
        Network
        <input v-bind:value="network">
      </label>
    </div>
    <div>
      <input type="button" value="get" v-on:click="handleGetClick">
      <input type="button" value="sample" v-on:click="handleSampleClick">
      <input type="button" value="clear" v-on:click="handleClearClick">
    </div>
    <div>
      <span>Address Plain: </span>
      <span>{{ plainAddress }}</span>
    </div>
    <div>
      <span>Address Pretty: </span>
      <span>{{ prettyAddress }}</span>
    </div>
    <div>
      <span>Importance: </span>
      <span>{{ importance }}</span>
    </div>
    <div>
      <span>PublickKey: </span>
      <span>{{ publicKey }}</span>
    </div>
    <div>
      <span>Mosaics: </span>
      <ul>
        <li v-for="mosaic in mosaics" v-bind:key="mosaic.id.toHex()">
          {{ mosaic.id.toHex()}} {{mosaic.amount.compact()}}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import HeadMenu from '~/components/HeadMenu.vue'

  const nem2Sdk = require("nem2-sdk");

  export default {
    methods: {
      handleGetClick: function(event) {
        let rawAddress = this.address;
        let network = this.network;
        let address = nem2Sdk.Address.createFromRawAddress(rawAddress);
        let ac = new nem2Sdk.AccountHttp("http://catapult48gh23s.xyz:3000", nem2Sdk.NetworkType.MIJIN_TEST);
        ac.getAccountInfo(address).toPromise().then((result) => {
          this.importance = result.importance.compact();
          this.publicKey = result.publicKey;
          this.mosaics = result.mosaics;
        });
        this.plainAddress = address.plain();
        this.prettyAddress = address.pretty();
      },
      handleClearClick: function(event) {
        this.address = '';
        this.network = '';
        this.importance = '';
        this.publicKey = '';
        this.mosaics = '';
        this.plainAddress = '';
        this.prettyAddress = '';
      },
      handleSampleClick: function(event) {
        let rawAddress = "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE";
        let network = "http://catapult48gh23s.xyz:3000";
        this.address = rawAddress;
        this.network = network;
        let address = nem2Sdk.Address.createFromRawAddress(rawAddress);
        let ac = new nem2Sdk.AccountHttp(network, nem2Sdk.NetworkType.MIJIN_TEST);
        ac.getAccountInfo(address).toPromise().then((result) => {
          this.importance = result.importance.compact();
          this.publicKey = result.publicKey;
          this.mosaics = result.mosaics;
        });
        this.plainAddress = address.plain();
        this.prettyAddress = address.pretty();
      }
    },
    asyncData (context) {
      return {
        name: 'account',
        description: '',
        importance: '',
        plainAddress: '',
        prettyAddress: '',
        publicKey: '',
        mosaics: [],
        address: '',
        network: ''
      }
    },
    head () {
      return {
        title: this.name,
        meta: [
          { hid: 'description', name: 'description', content: 'My custom description' }
        ]
      }
    },
    components: {
      HeadMenu
    },
  }
</script>

