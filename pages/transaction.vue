<template lang="pug">
  v-layout(row)
    v-flex#content.pt-3.px-3(style="width: calc(100% - 250px);")
      NemFoundation(v-if="isNf")
      Balance(navTargetId="balance")
      Transfer(navTargetId="transfer")
      NamespaceInfo(navTargetId="namespaceInfo")
      Namespace(navTargetId="namespace")
      SubNamespace(navTargetId="subnamespace")
      MosaicInfo(navTargetId="mosaicInfo")
      MosaicDefinition(navTargetId="mosaic")
      SecretLock(navTargetId="secretlock")
      SecretProof(navTargetId="secretproof")
      MultisigInfo(navTargetId="multisigInfo")
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
import { mapGetters } from 'vuex'
import Balance from '~/components/info/Balance.vue'
import Transfer from '~/components/tx/Transfer.vue'
import NamespaceInfo from '~/components/info/NamespaceInfo.vue'
import Namespace from '~/components/tx/Namespace.vue'
import SubNamespace from '~/components/tx/SubNamespace.vue'
import MosaicInfo from '~/components/info/MosaicInfo.vue'
import MosaicDefinition from '~/components/tx/MosaicDefinition.vue'
import SecretLock from '~/components/tx/SecretLock.vue'
import SecretProof from '~/components/tx/SecretProof.vue'
import MultisigInfo from '../components/info/MultisigInfo'
import ConvertMultisig from '~/components/tx/ConvertMultisig.vue'
import ModifyMultisig from '~/components/tx/ModifyMultisig.vue'
import Escrow from '~/components/tx/Escrow.vue'
import Cosignature from '~/components/tx/Cosignature.vue'
import CosignatureMultisig from '~/components/tx/CosignatureMultisig.vue'
import AliasInfo from '~/components/info/AliasInfo.vue'
import MosaicAlias from '~/components/tx/MosaicAlias.vue'
import AddressAlias from '~/components/tx/AddressAlias.vue'
import AccountPropertyInfo from '~/components/info/AccountPropertyInfo.vue'
import AccountPropertyAddress from '~/components/tx/AccountPropertyAddress.vue'
import AccountPropertyMosaic from '~/components/tx/AccountPropertyMosaic.vue'
import AccountPropertyEntityType from '~/components/tx/AccountPropertyEntityType.vue'
import AccountLinkInfo from '~/components/info/AccountLinkInfo.vue'
import AccountLink from '~/components/tx/AccountLink.vue'

import NemFoundation from '~/components/NemFoundation.vue'
import Sidebar from '~/components/Sidebar.vue'

export default {
  components: {
    Sidebar,
    NemFoundation,
    Balance,
    Transfer,
    NamespaceInfo,
    Namespace,
    SubNamespace,
    MosaicInfo,
    MosaicDefinition,
    SecretLock,
    SecretProof,
    MultisigInfo,
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
    ...mapGetters('env', [
      'isNf'
    ]),
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
    breakPoint() {
      return this.$vuetify.breakpoint.name
    }
  },
  watch: {
  },
  asyncData() {
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
        { icon: 'star', title: 'Current Multisig', target: '#multisigInfo', offset: 48 },
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
