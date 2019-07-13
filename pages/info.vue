<template lang="pug">
  v-layout(row)
    v-flex#content.pt-3.px-3(style="width: calc(100% - 250px);")
      Balance(navTargetId="balance")
      TransactionInfo(navTargetId="transactionInfo")
      NamespaceInfo(navTargetId="namespaceInfo")
      MosaicInfo(navTargetId="mosaicInfo")
      MultisigInfo(navTargetId="multisigInfo")
      AliasInfo(navTargetId="aliasInfo")
      AccountPropertyInfo(navTargetId="accountPropertyInfo")
      AccountLinkInfo(navTargetId="accountLinkInfo")
    v-flex#sidebar(hidden-sm-and-down style="width: 250px; position: sticky; top: 64px; height: calc(100vh - 64px); overflow-y: auto;")
      Sidebar(:nav="nav" :active="navActive")
</template>

<script>
import Balance from '~/components/info/Balance.vue'
import NamespaceInfo from '~/components/info/NamespaceInfo.vue'
import MosaicInfo from '~/components/info/MosaicInfo.vue'
import MultisigInfo from '../components/info/MultisigInfo'
import AliasInfo from '~/components/info/AliasInfo.vue'
import AccountPropertyInfo from '~/components/info/AccountPropertyInfo.vue'
import AccountLinkInfo from '~/components/info/AccountLinkInfo.vue'
import TransactionInfo from '~/components/info/TransactionInfo.vue'

import NemFoundation from '~/components/NemFoundation.vue'
import Sidebar from '~/components/Sidebar.vue'

export default {
  components: {
    Sidebar,
    NemFoundation,
    Balance,
    NamespaceInfo,
    MosaicInfo,
    MultisigInfo,
    AliasInfo,
    AccountPropertyInfo,
    AccountLinkInfo,
    TransactionInfo
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    }
  },
  asyncData() {
    return {
      nav: [
        { icon: 'star', title: 'Balance', target: '#balance', offset: 48 },
        { icon: 'star', title: 'Transaction', target: '#transactionInfo', offset: 48 },
        { icon: 'star', title: 'Namespace', target: '#namespaceInfo', offset: 48 },
        { icon: 'star', title: 'Mosaic', target: '#mosaicInfo', offset: 48 },
        { icon: 'star', title: 'Multisig', target: '#multisigInfo', offset: 48 },
        { icon: 'star', title: 'Alias', target: '#aliasInfo', offset: 48 },
        { icon: 'star', title: 'Account Property', target: '#accountPropertyInfo', offset: 48 },
        { icon: 'star', title: 'Account Link', target: '#accountLinkInfo', offset: 48 }
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
        if (top < 0 && bottom >= 0) {
          this.navActive = `#${elm.id}`
        }
      })
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
