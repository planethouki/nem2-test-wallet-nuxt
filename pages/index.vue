<template lang="pug">
  v-app
    Header(v-bind:wallet="wallet" v-bind:nav="nav")
    v-content
      v-container
        v-layout
          v-flex(offset-xl3 xl6 offset-lg2 lg8 offset-md1 md10 sm12 xs12)
            Login(
              v-bind:endpoints="endpoints"
              v-bind:defaultEndpoint="defaultEndpoint"
              v-bind:defaultPrivateKey="defaultPrivateKey"
              v-bind:createdWallet="wallet"
              v-bind:createdWalletPassword="walletPassword"
              v-on:walletCreated="walletCreated"
              v-on:deletePassword="deleteWalletPassword"
              navTargetId="login")
            WalletInfo(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" v-bind:faucetUrl="faucetUrl" v-on:logoutWallet="logoutWallet" navTargetId="wallet")
            Transfer(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="transfer")
            Namespace(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="namespace")
            SubNamespace(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="subnamespace")
            MosaicDefinition(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="mosaic")
            <!--SecretLock(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="secretlock")-->
            <!--SecretProof(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="secretproof")-->
            ConvertMultisig(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="multisig")
            ModifyMultisig(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="modifymultisig")
            Escrow(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="escrow")
            Cosignature(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="cosignature")
            CosignatureMultisig(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="cosignaturemultisig")
    Footer
</template>

<script>
  import Login from '~/components/Login.vue'

  import WalletInfo from '~/components/WalletInfo.vue'
  import Transfer from '~/components/Transfer.vue'
  import Namespace from '~/components/Namespace.vue'
  import SubNamespace from '~/components/SubNamespace.vue'
  import MosaicDefinition from '~/components/MosaicDefinition.vue'
  import SecretLock from '~/components/SecretLock.vue'
  import SecretProof from '~/components/SecretProof.vue'
  import ConvertMultisig from '~/components/ConvertMultisig.vue'
  import ModifyMultisig from '~/components/ModifyMultisig.vue'
  import Escrow from '~/components/Escrow.vue'
  import Cosignature from '~/components/Cosignature.vue'
  import CosignatureMultisig from '~/components/CosignatureMultisig.vue'

  import Jumbo from '~/components/Jumbo.vue'
  import Header from '~/components/Header.vue'
  import Footer from '~/components/Footer.vue'

  export default {
    components: {
      Header, Footer, Jumbo,
      Login, WalletInfo,
      Transfer, Namespace, SubNamespace, MosaicDefinition, SecretLock, SecretProof,
      ConvertMultisig, ModifyMultisig, Escrow, Cosignature, CosignatureMultisig,
    },
    asyncData (context) {
      return {
        nav: [
          {icon:"home",title:"Home",target:0,offset:0},
          {icon:"star",title:"Wallet",target:'#wallet',offset:-80},
          {icon:"arrow_forward",title:"Transfer Tx",target:'#transfer',offset:-80},
          {icon:"domain",title:"Namespace",target:'#namespace',offset:-80},
          {icon:"domain",title:"SubNamespace",target:'#subnamespace',offset:-80},
          {icon:"web_asset",title:"Mosaic",target:'#mosaic',offset:-80},
          {icon:"lock",title:"Secret Lock Tx",target:'#secretlock',offset:-80},
          {icon:"lock_open",title:"Secret proof Tx",target:'#secretproof',offset:-80},
          {icon:"menu",title:"Multisig",target:'#multisig',offset:-80},
          {icon:"menu",title:"Modify Multisig",target:'#modifymultisig',offset:-80},
          {icon:"compare_arrows",title:"Escrow with Aggregate",target:'#escrow',offset:-80},
          {icon:"edit",title:"Cosignature",target:'#cosignature',offset:-80},
          {icon:"edit",title:"Cosignature Multisig",target:'#cosignaturemultisig',offset:-80},
        ],
        endpoints: [
          { url: "http://bison.48gh23s.xyz:3000", label: "bison.48gh23s.xyz" },
        ],
        defaultEndpoint: "http://bison.48gh23s.xyz:3000",
        defaultPrivateKey: "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
        walletPassword: {},
        endpoint: "",
        faucetUrl: "",
        wallet: {},
      }
    },
    methods: {
      logoutWallet: function(event) {
        this.wallet = {};
        console.log("wallet deleted");
      },
      deleteWalletPassword: function(event) {
        this.walletPassword = {};
        console.log("wallet password deleted");
      },
      walletCreated: function(event) {
        this.wallet = event.wallet;
        this.walletPassword = event.password;
        this.endpoint = event.endpoint;
        if (this.endpoint.includes("54.238.216.37")) {
          this.faucetUrl = `https://faucet-bison.azurewebsites.net/`;
        }
        console.log("wallet created");
      },
    },
    head () {
      return {
        meta: [
          { hid: 'top', name: 'top', content: 'top' }
        ]
      }
    },
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
