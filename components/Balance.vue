<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Balance
          v-spacer
          small resolve only cat.currency and cat.harvest
      v-card-text
        v-layout.mb-3(column)
          span.mb-3.subheading cat.currency
          div(v-for="m in currencyBalance" v-bind:key="m.id")
            span.ml-3 {{ m.id }}::{{ m.absoluteAmount }} ({{ m.relativeAmount }})
          span.ml-3(v-if="currencyBalance.length === 0 && isBalanceLoading === false") None
        v-layout.mb-3(column)
          span.mb-3.subheading cat.harvest
          div(v-for="m in harvestBalance" v-bind:key="m.id")
            span.ml-3 {{ m.id }}::{{ m.absoluteAmount }} ({{ m.relativeAmount }})
          span.ml-3(v-if="harvestBalance.length === 0 && isBalanceLoading === false") None
        v-layout.mb-3(column)
          span.mb-3.subheading mosaics
          div(v-for="m in mosaicBalance" v-bind:key="m.id")
            span.ml-3 {{ m.id }}::{{ m.absoluteAmount }} ({{ m.relativeAmount }})
          span.ml-3(v-if="mosaicBalance.length === 0 && isBalanceLoading === false") None
      v-card-actions
        v-btn(
          :disabled="isBalanceLoading"
          @click="reload")
          v-icon cached
        v-progress-circular(indeterminate v-if="isBalanceLoading").ml-3

</template>

<script>
import { MosaicId, MosaicService, NetworkCurrencyMosaic, NamespaceId,
  AccountHttp, MosaicHttp, BlockchainHttp, NamespaceHttp } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export default {
  name: 'Balance',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'balance'
      }
    }
  },
  data() {
    return {
      mosaicAmountViews: [],
      blockHeight: 0,
      isBalanceLoading: true,
      alert: '',
      currencyMosaicId: new MosaicId('0000000000000000'),
      harvestMosaicId: new MosaicId('0000000000000000'),
      currencyNamespaceName: 'cat.currency',
      harvestNamespaceName: 'cat.harvest'
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
    currencyBalance() {
      return this.allMosaicsBalance.filter((m) => {
        return m.alias === this.currencyNamespaceName
      })
    },
    harvestBalance() {
      return this.allMosaicsBalance.filter((m) => {
        return m.alias === this.harvestNamespaceName
      })
    },
    mosaicBalance() {
      return this.allMosaicsBalance.filter((m) => {
        return m.alias !== this.currencyNamespaceName && m.alias !== this.harvestNamespaceName
      })
    },
    allMosaicsBalance() {
      const blockHeight = this.blockHeight
      const currencyMosaicId = this.currencyMosaicId
      const harvestMosaicId = this.harvestMosaicId
      const currencyNamespaceName = this.currencyNamespaceName
      const harvestNamespaceName = this.harvestNamespaceName
      if (this.isBalanceLoading === false && this.mosaicAmountViews.length === 0) {
        return []
      }
      return this.mosaicAmountViews.filter(function (mosaicAmountView) {
        if (mosaicAmountView.mosaicInfo.duration.compact() === 0) {
          return true
        } else {
          const endHeight = mosaicAmountView.mosaicInfo.height.compact() + mosaicAmountView.mosaicInfo.duration.compact()
          return blockHeight < endHeight
        }
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
        const amount = mosaicAmountView.amount.compact()
        const relAmount = mosaicAmountView.relativeAmount()
        const ret = {
          absoluteAmount: amount.toString(10),
          relativeAmount: relAmount.toString(10)
        }
        if (mosaicAmountView.mosaicInfo.mosaicId.equals(currencyMosaicId)) {
          ret.id = `${mosaicAmountView.fullName().toUpperCase()}`
          ret.alias = `${currencyNamespaceName}`
        } else if (mosaicAmountView.mosaicInfo.mosaicId.equals(harvestMosaicId)) {
          ret.id = `${mosaicAmountView.fullName().toUpperCase()}`
          ret.alias = `${harvestNamespaceName}`
        } else {
          ret.id = mosaicAmountView.fullName().toUpperCase()
        }
        return ret
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
      accountHttp.getAccountInfo(this.address).pipe(
        mergeMap((accountInfo) => {
          const mosaics = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : [NetworkCurrencyMosaic.createAbsolute(0)]
          return mosaicService.mosaicsAmountView(mosaics)
        })
      ).subscribe((mosaicAmountViews) => {
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
