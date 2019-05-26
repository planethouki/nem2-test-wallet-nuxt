<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Balance
          v-spacer
          small resolve only {{ currencyNamespaceName }} and {{ harvestNamespaceName }}
      v-card-text
        v-layout.mb-3(column)
          span.mb-3.subheading {{ currencyNamespaceName }}
          div(v-for="m in currencyBalance" v-bind:key="m.id")
            span.ml-3 {{ m.id }}::{{ m.absoluteAmount }} ({{ m.relativeAmount }})
          span.ml-3(v-if="currencyBalance.length === 0 && isBalanceLoading === false") None
        v-layout.mb-3(column)
          span.mb-3.subheading {{ harvestNamespaceName }}
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
          @click="reloadMosaics")
          v-icon cached
        v-progress-circular(indeterminate v-if="isBalanceLoading").ml-3

</template>

<script>
import { mapGetters } from 'vuex'

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
      isBalanceLoading: null,
      alert: ''
    }
  },
  computed: {
    ...mapGetters('wallet', {
      existsAccount: 'existsAccount',
      address: 'address',
      endpoint: 'endpoint'
    }),
    ...mapGetters('env', [
      'currencyNamespaceName',
      'harvestNamespaceName'
    ]),
    ...mapGetters('chain', [
      'blockHeight',
      'currencyMosaicId',
      'harvestMosaicId',
      'mosaicAmountViews'
    ]),
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
  methods: {
    reloadMosaics: async function (event) {
      this.isBalanceLoading = true
      if (!(this.currencyMosaicId || this.harvestMosaicId)) {
        await this.$store.dispatch('chain/init', {
          endpoint: this.endpoint,
          currencyNamespaceName: this.currencyNamespaceName,
          harvestNamespaceName: this.harvestNamespaceName
        })
      }
      await this.$store.dispatch('chain/updateBlockHeight', {
        endpoint: this.endpoint
      })
      await this.$store.dispatch('chain/updateMosaicAmountVies', {
        endpoint: this.endpoint,
        address: this.address
      })
      this.isBalanceLoading = false
    }
  }
}
</script>

<style scoped>

</style>
