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
            v-bind:defaultNetworkType="defaultNetworkType"
            v-on:walletCreated="walletCreated"
            v-on:deletePassword="deleteWalletPassword"
            navTargetId="login")
            WalletInfo(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" v-bind:faucetUrl="faucetUrl" v-on:logoutWallet="logoutWallet" navTargetId="wallet")
            Balance(v-bind:endpoint="endpoint" v-bind:address="wallet.address" navTargetId="balance")
            Transfer(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="transfer")
            Namespace(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="namespace")
            SubNamespace(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="subnamespace")
            MosaicDefinition(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="mosaic")
            SecretLock(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="secretlock")
            SecretProof(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="secretproof")
            ConvertMultisig(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="multisig")
            ModifyMultisig(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="modifymultisig")
            Escrow(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="escrow")
            Cosignature(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="cosignature")
            CosignatureMultisig(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="cosignaturemultisig")
            AliasInfo(v-bind:endpoint="endpoint" v-bind:address="wallet.address" navTargetId="aliasInfo")
            MosaicAlias(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="mosaicAlias")
            AddressAlias(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="addressAlias")
            AccountPropertyInfo(v-bind:endpoint="endpoint" v-bind:address="wallet.address" navTargetId="accountPropertyInfo")
            AccountPropertyAddress(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="accountPropertyAddress")
            AccountPropertyMosaic(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="accountPropertyMosaic")
            AccountPropertyEntityType(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="accountPropertyEntityType")
            AccountLinkInfo(v-bind:endpoint="endpoint" v-bind:address="wallet.address" navTargetId="accountLinkInfo")
            AccountLink(v-bind:endpoint="endpoint" v-bind:wallet="wallet" v-bind:walletPassword="walletPassword" navTargetId="accountLink")
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

import { NetworkType } from 'nem2-sdk'

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
      endpoints: [
        { url: 'http://54.178.241.129:3000', label: 'cow (54.178.241.129)' },
        { url: 'http://52.197.250.79:3000', label: 'cow with fee (52.197.250.79)' }
      ],
      defaultEndpoint: 'http://54.178.241.129:3000',
      defaultPrivateKey: '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
      defaultNetworkType: NetworkType.MIJIN_TEST,
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
