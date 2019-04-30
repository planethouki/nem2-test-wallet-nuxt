<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Owned Mosaics
      v-card-text
        v-layout(column)
          div(v-for="m in mosaicTexts" v-bind:key="m.text").ml-3
            div {{ m.text }}
              a.ml-2(:href="m.link" target="_blank" style="text-decoration:none;" v-if="m.link")
                v-icon(small) info
      v-card-actions
        v-btn(
          :disabled="isBalanceLoading"
          @click="reload")
          v-icon cached
        v-progress-circular(indeterminate v-if="isBalanceLoading").ml-3
</template>

<script>
import { MosaicId, MosaicService, NamespaceId,
  AccountHttp, MosaicHttp, BlockchainHttp, NamespaceHttp } from 'nem2-sdk'

export default {
  name: 'MosaicInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'mosaicInfo'
      }
    }
  },
  data() {
    return {
      blockHeight: 0,
      isBalanceLoading: true,
      alert: '',
      currencyMosaicId: new MosaicId('0000000000000000'),
      harvestMosaicId: new MosaicId('0000000000000000'),
      currencyNamespaceName: 'cat.currency',
      harvestNamespaceName: 'cat.harvest',
      mosaicAmountViews: []
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
    walletMutateCount() {
      return this.$store.getters['wallet/getMutateCount']
    },
    address() {
      return this.$store.getters['wallet/getAddress']
    },
    endpoint() {
      return this.$store.getters['wallet/getEndpoint']
    },
    mosaicTexts() {
      const blockHeight = this.blockHeight
      const endpoint = this.endpoint
      const address = this.address
      if (this.isBalanceLoading === false && this.mosaicAmountViews.length === 0) {
        return [{ text: 'None', link: '' }]
      }
      return this.mosaicAmountViews.filter(function (mosaicAmountView) {
        return mosaicAmountView.mosaicInfo.owner.address.equals(address)
      }).sort(function (a, b) {
        const nameA = a.mosaicInfo.metaId
        const nameB = b.mosaicInfo.metaId
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      }).map(function (mosaicAmountView) {
        const hexId = mosaicAmountView.fullName().toUpperCase()
        const duration = mosaicAmountView.mosaicInfo.duration.compact()
        const startHeight = mosaicAmountView.mosaicInfo.height.compact()
        const endHeight = startHeight + duration
        const expireWithin = endHeight - blockHeight
        const expireText = expireWithin > 0 ? `expire within ${expireWithin} blocks` : `expired ${-expireWithin} blocks ago`
        return {
          text: hexId + ', ' + expireText,
          link: `${endpoint}/mosaic/${hexId}`
        }
      })
    }
  },
  watch: {
    walletMutateCount: {
      handler: function () {
        this.reload()
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload: function () {
      if (!this.existsAccount) return
      this.reloadMosaics()
    },
    reloadMosaics: async function (event) {
      this.isBalanceLoading = true
      this.blockHeight = 0
      this.mosaicAmountViews = []
      this.currencyMosaicId = new MosaicId('0000000000000000')
      this.harvestMosaicId = new MosaicId('0000000000000000')
      const blockChainHttp = new BlockchainHttp(this.endpoint)
      this.blockHeight = (await blockChainHttp.getBlockchainHeight().toPromise()).compact()
      const namespaceHttp = new NamespaceHttp(this.endpoint)
      this.currencyMosaicId = await namespaceHttp.getLinkedMosaicId(new NamespaceId(this.currencyNamespaceName)).toPromise()
      this.harvestMosaicId = await namespaceHttp.getLinkedMosaicId(new NamespaceId(this.harvestNamespaceName)).toPromise()
      const endpoint = this.endpoint
      const accountHttp = new AccountHttp(endpoint)
      const mosaicHttp = new MosaicHttp(endpoint)
      const mosaicService = new MosaicService(accountHttp, mosaicHttp)
      mosaicService.mosaicsAmountViewFromAddress(this.address).subscribe((mosaicAmountViews) => {
        mosaicAmountViews.map((x) => {
          this.mosaicAmountViews.push(x)
        })
        this.isBalanceLoading = false
      }, () => {
        this.isBalanceLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
