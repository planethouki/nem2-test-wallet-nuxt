<template lang="pug">
  v-layout(row)
    v-flex#content.pt-3.px-3
      Login(navTargetId="login")
      WalletInfo(navTargetId="wallet")
      TransactionInfo(navTargetId="transactionInfo")
      Balance(navTargetId="balance")
      NamespaceInfo(navTargetId="namespaceInfo")
      MosaicInfo(navTargetId="mosaicInfo")
      AliasInfo(navTargetId="aliasInfo")
      AccountPropertyInfo(navTargetId="accountPropertyInfo")
      AccountLinkInfo(navTargetId="accountLinkInfo")
    v-flex#sidebar(hidden-sm-and-down style="max-width: 250px; position: sticky; top: 64px; height: calc(100vh - 64px); overflow-y: auto;")
      Sidebar(:nav="nav" :active="navActive")
</template>

<script>
import Login from '~/components/Login.vue'

import WalletInfo from '~/components/WalletInfo.vue'
import Balance from '~/components/Balance.vue'
import NamespaceInfo from '~/components/NamespaceInfo.vue'
import MosaicInfo from '~/components/MosaicInfo.vue'
import AliasInfo from '~/components/AliasInfo.vue'
import AccountPropertyInfo from '~/components/AccountPropertyInfo.vue'
import AccountLinkInfo from '~/components/AccountLinkInfo.vue'
import TransactionInfo from '~/components/TransactionInfo.vue'

import NemFoundation from '~/components/NemFoundation.vue'
import Sidebar from '~/components/Sidebar.vue'

export default {
  components: {
    Sidebar,
    NemFoundation,
    Login,
    WalletInfo,
    Balance,
    NamespaceInfo,
    MosaicInfo,
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
  asyncData(context) {
    return {
      nav: [
        { icon: 'star', title: 'Wallet', target: '#wallet', offset: 48 },
        { icon: 'star', title: 'Transaction', target: '#transactionInfo', offset: 48 },
        { icon: 'star', title: 'Balance', target: '#balance', offset: 48 },
        { icon: 'star', title: 'Namespace', target: '#namespaceInfo', offset: 48 },
        { icon: 'star', title: 'Mosaic', target: '#mosaicInfo', offset: 48 },
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
