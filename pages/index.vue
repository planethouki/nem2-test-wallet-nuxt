<template lang="pug">
  v-app
    Header(v-bind:wallet="wallet" v-bind:nav="nav")
    v-content
      v-container
        v-layout
          v-flex(offset-xl3 xl6 offset-lg2 lg8 offset-md1 md10 sm12 xs12)
            Login(navTargetId="login")
            WalletInfo(navTargetId="wallet")
            Balance(navTargetId="balance")
            Transfer(navTargetId="transfer")
            Namespace(navTargetId="namespace")
            SubNamespace(navTargetId="subnamespace")
            MosaicDefinition(navTargetId="mosaic")
            SecretLock(navTargetId="secretlock")
            SecretProof(navTargetId="secretproof")
            ConvertMultisig(navTargetId="multisig")
            ModifyMultisig(navTargetId="modifymultisig")
            Escrow(navTargetId="escrow")
            Cosignature(navTargetId="cosignature")
            CosignatureMultisig(navTargetId="cosignaturemultisig")
            AliasInfo(navTargetId="aliasInfo")
            <!--MosaicAlias(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="mosaicAlias")-->
            <!--AddressAlias(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="addressAlias")-->
            AccountPropertyInfo(navTargetId="accountPropertyInfo")
            <!--AccountPropertyAddress(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="accountPropertyAddress")-->
            <!--AccountPropertyMosaic(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="accountPropertyMosaic")-->
            <!--AccountPropertyEntityType(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="accountPropertyEntityType")-->
            AccountLinkInfo(navTargetId="accountLinkInfo")
            <!--AccountLink(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="accountLink")-->
    Footer
</template>

<script>
import Login from '~/components/Login.vue'

import WalletInfo from '~/components/WalletInfo.vue'
import Balance from '~/components/Balance.vue'
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
import AliasInfo from '~/components/AliasInfo.vue'
import MosaicAlias from '~/components/MosaicAlias.vue'
import AddressAlias from '~/components/AddressAlias.vue'
import AccountPropertyInfo from '~/components/AccountPropertyInfo.vue'
import AccountPropertyAddress from '~/components/AccountPropertyAddress.vue'
import AccountPropertyMosaic from '~/components/AccountPropertyMosaic.vue'
import AccountPropertyEntityType from '~/components/AccountPropertyEntityType.vue'
import AccountLinkInfo from '~/components/AccountLinkInfo.vue'
import AccountLink from '~/components/AccountLink.vue'

import Jumbo from '~/components/Jumbo.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Header,
    Footer,
    Jumbo,
    Login,
    WalletInfo,
    Balance,
    Transfer,
    Namespace,
    SubNamespace,
    MosaicDefinition,
    SecretLock,
    SecretProof,
    ConvertMultisig,
    ModifyMultisig,
    Escrow,
    Cosignature,
    CosignatureMultisig,
    AliasInfo,
    MosaicAlias,
    AddressAlias,
    AccountPropertyInfo,
    AccountPropertyAddress,
    AccountPropertyMosaic,
    AccountPropertyEntityType,
    AccountLinkInfo,
    AccountLink
  },
  asyncData(context) {
    return {
      nav: [
        { icon: 'home', title: 'Home', target: 0, offset: 0 },
        { icon: 'star', title: 'Wallet', target: '#wallet', offset: -80 },
        { icon: 'arrow_forward', title: 'Transfer Tx', target: '#transfer', offset: -80 },
        { icon: 'domain', title: 'Namespace', target: '#namespace', offset: -80 },
        { icon: 'domain', title: 'SubNamespace', target: '#subnamespace', offset: -80 },
        { icon: 'web_asset', title: 'Mosaic', target: '#mosaic', offset: -80 },
        { icon: 'lock', title: 'Secret Lock Tx', target: '#secretlock', offset: -80 },
        { icon: 'lock_open', title: 'Secret proof Tx', target: '#secretproof', offset: -80 },
        { icon: 'menu', title: 'Multisig', target: '#multisig', offset: -80 },
        { icon: 'menu', title: 'Modify Multisig', target: '#modifymultisig', offset: -80 },
        { icon: 'compare_arrows', title: 'Escrow with Aggregate', target: '#escrow', offset: -80 },
        { icon: 'edit', title: 'Cosignature', target: '#cosignature', offset: -80 },
        { icon: 'edit', title: 'Cosignature Multisig', target: '#cosignaturemultisig', offset: -80 },
        { icon: 'text_rotation_none', title: 'Mosaic Alias', target: '#mosaicAlias', offset: -80 },
        { icon: 'text_rotation_none', title: 'Address Alias', target: '#addressAlias', offset: -80 },
        { icon: 'person_add', title: 'Account Property Address', target: '#accountPropertyAddress', offset: -80 },
        { icon: 'person_add', title: 'Account Property Mosaic', target: '#accountPropertyMosaic', offset: -80 },
        { icon: 'person_add', title: 'Account Property Entity', target: '#accountPropertyEntityType', offset: -80 },
        { icon: 'people', title: 'Account Link', target: '#accountLink', offset: -80 }
      ],
      walletPassword: {},
      endpoint: '',
      faucetUrl: '',
      wallet: {}
    }
  },
  methods: {
    logoutWallet: function (event) {
      this.wallet = {}
    },
    deleteWalletPassword: function (event) {
      this.walletPassword = {}
    },
    walletCreated: function (event) {
      this.wallet = event.wallet
      this.walletPassword = event.password
      this.endpoint = event.endpoint
      if (this.endpoint.includes('54.178.241.129')) {
        this.faucetUrl = `https://faucet-cow.azurewebsites.net`
      } else if (this.endpoint.includes('13.114.36.139')) {
        this.faucetUrl = `https://faucet-cow-fee.azurewebsites.net/`
      }
    }
  },
  head() {
    return {
      meta: [
        { hid: 'top', name: 'top', content: 'top' }
      ]
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
