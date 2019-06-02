<template lang="pug">
  v-layout(row)
    v-flex#content.pt-3.px-3(style="width: calc(100% - 250px);")
      Balance(navTargetId="balance")
      Transfer(navTargetId="transfer")
      NamespaceInfo(navTargetId="namespaceInfo")
      Namespace(navTargetId="namespace")
      SubNamespace(navTargetId="subnamespace")
      MosaicInfo(navTargetId="mosaicInfo")
      MosaicDefinition(navTargetId="mosaic")
      SecretLock(navTargetId="secretlock")
      SecretProof(navTargetId="secretproof")
      ConvertMultisig(navTargetId="multisig")
      ModifyMultisig(navTargetId="modifymultisig")
      Escrow(navTargetId="escrow")
      Cosignature(navTargetId="cosignature")
      CosignatureMultisig(navTargetId="cosignaturemultisig")
      AliasInfo(navTargetId="aliasInfo")
      MosaicAlias(navTargetId="mosaicAlias")
      AddressAlias(navTargetId="addressAlias")
      AccountPropertyInfo(navTargetId="accountPropertyInfo")
      AccountPropertyAddress(navTargetId="accountPropertyAddress")
      AccountPropertyMosaic(navTargetId="accountPropertyMosaic")
      AccountPropertyEntityType(navTargetId="accountPropertyEntityType")
      AccountLinkInfo(navTargetId="accountLinkInfo")
      AccountLink(navTargetId="accountLink")
    v-flex#sidebar(hidden-sm-and-down style="width: 250px; position: sticky; top: 64px; height: calc(100vh - 64px); overflow-y: auto;")
      Sidebar(:nav="nav" :active="navActive")
</template>

<script>
import Login from '~/components/Login.vue'

import WalletInfo from '~/components/WalletInfo.vue'
import Balance from '~/components/Balance.vue'
import Transfer from '~/components/Transfer.vue'
import NamespaceInfo from '~/components/NamespaceInfo.vue'
import Namespace from '~/components/Namespace.vue'
import SubNamespace from '~/components/SubNamespace.vue'
import MosaicInfo from '~/components/MosaicInfo.vue'
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

import Sidebar from '~/components/Sidebar.vue'

export default {
  components: {
    Sidebar,
    Login,
    WalletInfo,
    Balance,
    Transfer,
    NamespaceInfo,
    Namespace,
    SubNamespace,
    MosaicInfo,
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
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
    breakPoint() {
      return this.$vuetify.breakpoint.name
    }
  },
  watch: {
  },
  asyncData({ store, redirect }) {
    if (!store.getters['wallet/existsAccount']) {
      redirect('/')
    }
    return {
      nav: [
        { icon: 'star', title: 'Balance', target: '#balance', offset: 48 },
        { icon: 'arrow_forward', title: 'Transfer Tx', target: '#transfer', offset: 48 },
        { icon: 'star', title: 'Current Namespace', target: '#namespaceInfo', offset: 48 },
        { icon: 'domain', title: 'Namespace', target: '#namespace', offset: 48 },
        { icon: 'domain', title: 'SubNamespace', target: '#subnamespace', offset: 48 },
        { icon: 'star', title: 'Current Mosaic', target: '#mosaicInfo', offset: 48 },
        { icon: 'web_asset', title: 'Mosaic', target: '#mosaic', offset: 48 },
        { icon: 'lock', title: 'Secret Lock Tx', target: '#secretlock', offset: 48 },
        { icon: 'lock_open', title: 'Secret proof Tx', target: '#secretproof', offset: 48 },
        { icon: 'menu', title: 'Multisig', target: '#multisig', offset: 48 },
        { icon: 'menu', title: 'Modify Multisig', target: '#modifymultisig', offset: 48 },
        { icon: 'compare_arrows', title: 'Escrow with Aggregate', target: '#escrow', offset: 48 },
        { icon: 'edit', title: 'Cosignature', target: '#cosignature', offset: 48 },
        { icon: 'edit', title: 'Cosignature Multisig', target: '#cosignaturemultisig', offset: 48 },
        { icon: 'star', title: 'Current Alias', target: '#aliasInfo', offset: 48 },
        { icon: 'text_rotation_none', title: 'Mosaic Alias', target: '#mosaicAlias', offset: 48 },
        { icon: 'text_rotation_none', title: 'Address Alias', target: '#addressAlias', offset: 48 },
        { icon: 'star', title: 'Current Account Property', target: '#accountPropertyInfo', offset: 48 },
        { icon: 'person_add', title: 'Account Property Address', target: '#accountPropertyAddress', offset: 48 },
        { icon: 'person_add', title: 'Account Property Mosaic', target: '#accountPropertyMosaic', offset: 48 },
        { icon: 'person_add', title: 'Account Property Entity', target: '#accountPropertyEntityType', offset: 48 },
        { icon: 'star', title: 'Current Account Link', target: '#accountLinkInfo', offset: 48 },
        { icon: 'people', title: 'Account Link', target: '#accountLink', offset: 48 }
      ],
      navActive: ''
    }
  },
  created() {
    window.addEventListener('scroll', this.onScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll(e) {
      const elements = document.querySelectorAll('#content > div')
      elements.forEach((elm) => {
        const top = elm.getBoundingClientRect().top
        const bottom = elm.getBoundingClientRect().bottom
        if (top < 72 && bottom >= 72) {
          this.navActive = `#${elm.id}`
        }
      })
    }
  },
  head() {
    return {
      meta: [
        { hid: 'transaction', name: 'transaction', content: 'transaction' }
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
