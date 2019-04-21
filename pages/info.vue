<template lang="pug">
  v-content
    v-container.pa-0(fluid fill-height="true")
      v-layout
        v-flex#content.pt-3.px-3(xs12 sm12 md10 lg9 xl8)
          Login(navTargetId="login")
          WalletInfo(navTargetId="wallet")
          TransactionInfo(navTargetId="transactionInfo")
          Balance(navTargetId="balance")
          AliasInfo(navTargetId="aliasInfo")
          AccountPropertyInfo(navTargetId="accountPropertyInfo")
          AccountLinkInfo(navTargetId="accountLinkInfo")
    Footer
</template>

<script>
import Login from '~/components/Login.vue'

import WalletInfo from '~/components/WalletInfo.vue'
import Balance from '~/components/Balance.vue'
import AliasInfo from '~/components/AliasInfo.vue'
import AccountPropertyInfo from '~/components/AccountPropertyInfo.vue'
import AccountLinkInfo from '~/components/AccountLinkInfo.vue'
import TransactionInfo from '~/components/TransactionInfo.vue'

import Jumbo from '~/components/Jumbo.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Footer,
    Jumbo,
    Login,
    WalletInfo,
    Balance,
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
        { icon: 'home', title: 'Home', target: 0, offset: 0, active: true },
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
