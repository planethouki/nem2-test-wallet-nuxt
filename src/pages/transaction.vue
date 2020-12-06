<template lang="pug">
  v-layout(row)
    v-flex#content.pt-3.px-3(style="width: calc(100% - 250px);")
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
      MosaicAlias(navTargetId="mosaicAlias")
      AddressAlias(navTargetId="addressAlias")
      AccountRestrictionAddress(navTargetId="accountRestrictionAddress")
      AccountRestrictionMosaic(navTargetId="accountRestrictionMosaic")
      AccountRestrictionOperation(navTargetId="accountRestrictionOperation")
      LinkAccountKey(navTargetId="accountLink")
      LinkNodeKey(navTargetId="nodeLink")
      LinkVrfKey(navTargetId="vrfLink")
      LinkVotingKey(navTargetId="votingLink")
      PersistentDelegationRequest(navTargetId="persistentDelegationRequest")
      AccountMetadata(navTargetId="accountMetadata")
      NamespaceMetadata(navTargetId="namespaceMetadata")
      MosaicMetadata(navTargetId="mosaicMetadata")
      MosaicGlobalRestriction(navTargetId="mosaicGlobalRestriction")
      MosaicAddressRestriction(navTargetId="mosaicAddressRestriction")
    v-flex#sidebar(hidden-sm-and-down style="width: 250px; position: sticky; top: 64px; height: calc(100vh - 64px); overflow-y: auto;")
      Sidebar(:nav="nav" :active="navActive")
</template>

<script>
import Transfer from '~/components/tx/Transfer.vue'
import Namespace from '~/components/tx/Namespace.vue'
import SubNamespace from '~/components/tx/SubNamespace.vue'
import MosaicDefinition from '~/components/tx/MosaicDefinition.vue'
import SecretLock from '~/components/tx/SecretLock.vue'
import SecretProof from '~/components/tx/SecretProof.vue'
import ConvertMultisig from '~/components/tx/ConvertMultisig.vue'
import ModifyMultisig from '~/components/tx/ModifyMultisig.vue'
import Escrow from '~/components/tx/Escrow.vue'
import Cosignature from '~/components/tx/Cosignature.vue'
import MosaicAlias from '~/components/tx/MosaicAlias.vue'
import AddressAlias from '~/components/tx/AddressAlias.vue'
import AccountRestrictionAddress from '~/components/tx/AccountRestrictionAddress.vue'
import AccountRestrictionMosaic from '~/components/tx/AccountRestrictionMosaic.vue'
import AccountRestrictionOperation from '~/components/tx/AccountRestrictionOperation.vue'
import LinkAccountKey from '~/components/tx/LinkAccountKey.vue'
import LinkNodeKey from '~/components/tx/LinkNodeKey.vue'
import LinkVrfKey from '~/components/tx/LinkVrfKey.vue'
import LinkVotingKey from '~/components/tx/LinkVotingKey.vue'
import PersistentDelegationRequest from '~/components/tx/PersistentDelegationRequest.vue'
import AccountMetadata from '~/components/tx/AccountMetadata.vue'
import NamespaceMetadata from '~/components/tx/NamespaceMetadata.vue'
import MosaicMetadata from '~/components/tx/MosaicMetadata.vue'
import MosaicGlobalRestriction from '~/components/tx/MosaicGlobalRestriction.vue'
import MosaicAddressRestriction from '~/components/tx/MosaicAddressRestriction.vue'

import Sidebar from '~/components/Sidebar.vue'

export default {
  components: {
    Sidebar,
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
    MosaicAlias,
    AddressAlias,
    AccountRestrictionAddress,
    AccountRestrictionMosaic,
    AccountRestrictionOperation,
    LinkAccountKey,
    LinkNodeKey,
    LinkVrfKey,
    LinkVotingKey,
    PersistentDelegationRequest,
    AccountMetadata,
    NamespaceMetadata,
    MosaicMetadata,
    MosaicGlobalRestriction,
    MosaicAddressRestriction
  },
  asyncData () {
    return {
      nav: [
        { icon: 'arrow_forward', title: 'Transfer Tx', target: '#transfer', offset: 20 },
        { icon: 'domain', title: 'Namespace', target: '#namespace', offset: 20 },
        { icon: 'domain', title: 'SubNamespace', target: '#subnamespace', offset: 20 },
        { icon: 'web_asset', title: 'Mosaic', target: '#mosaic', offset: 20 },
        { icon: 'lock', title: 'Secret Lock Tx', target: '#secretlock', offset: 20 },
        { icon: 'lock_open', title: 'Secret proof Tx', target: '#secretproof', offset: 20 },
        { icon: 'menu', title: 'Multisig', target: '#multisig', offset: 20 },
        { icon: 'menu', title: 'Modify Multisig', target: '#modifymultisig', offset: 20 },
        { icon: 'compare_arrows', title: 'Escrow with Aggregate', target: '#escrow', offset: 20 },
        { icon: 'edit', title: 'Cosignature', target: '#cosignature', offset: 20 },
        { icon: 'text_rotation_none', title: 'Mosaic Alias', target: '#mosaicAlias', offset: 20 },
        { icon: 'text_rotation_none', title: 'Address Alias', target: '#addressAlias', offset: 20 },
        { icon: 'person_add', title: 'Account Restriction Address', target: '#accountRestrictionAddress', offset: 20 },
        { icon: 'person_add', title: 'Account Restriction Mosaic', target: '#accountRestrictionMosaic', offset: 20 },
        { icon: 'person_add', title: 'Account Restriction Operation', target: '#accountRestrictionOperation', offset: 20 },
        { icon: 'people', title: 'Account Link', target: '#accountLink', offset: 20 },
        { icon: 'people', title: 'Node Link', target: '#nodeLink', offset: 20 },
        { icon: 'people', title: 'VRF Link', target: '#vrfLink', offset: 20 },
        { icon: 'people', title: 'Voting Link', target: '#votingLink', offset: 20 },
        { icon: 'people', title: 'Persistent Delegation Request', target: '#persistentDelegationRequest', offset: 20 },
        { icon: 'comment', title: 'Account Metadata', target: '#accountMetadata', offset: 20 },
        { icon: 'comment', title: 'Namespace Metadata', target: '#namespaceMetadata', offset: 20 },
        { icon: 'comment', title: 'Mosaic Metadata', target: '#mosaicMetadata', offset: 20 },
        { icon: 'web', title: 'Mosaic Global Restriction', target: '#mosaicGlobalRestriction', offset: 20 },
        { icon: 'web', title: 'Mosaic Address Restriction', target: '#mosaicAddressRestriction', offset: 20 }
      ],
      navActive: ''
    }
  },
  head () {
    return {
      meta: [
        { hid: 'transaction', name: 'transaction', content: 'transaction' }
      ]
    }
  },
  computed: {
    existsAccount () {
      return this.$store.getters['wallet/existsAccount']
    },
    breakPoint () {
      return this.$vuetify.breakpoint.name
    }
  },
  watch: {
  },
  created () {
    this.addOnScroll()
  },
  destroyed () {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    addOnScroll () {
      window.addEventListener('scroll', this.onScroll)
    },
    onScroll () {
      const elements = document.querySelectorAll('#content > div')
      elements.forEach((elm) => {
        const top = elm.getBoundingClientRect().top
        const bottom = elm.getBoundingClientRect().bottom
        if (top < 100 && bottom >= 100) {
          this.navActive = `#${elm.id}`
        }
      })
    }
  }
}
</script>
