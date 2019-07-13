<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Balance
      v-card-text
        v-layout.mb-3(column)
          span.mb-3.subheading mosaics
          span.ml-3(v-if="isLoading")
          template(v-else-if="mosaicBalance.length")
            div(v-for="m in mosaicBalance" v-bind:key="m.id")
              span.ml-3 {{ m.id }}::{{ m.absoluteAmount }} ({{ m.relativeAmount }})
          span.ml-3(v-else) None
      v-card-actions
        v-btn(
          :disabled="isLoading"
          @click="reload")
          v-icon cached
        v-progress-circular(indeterminate v-if="isLoading").ml-3

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
      isLoading: null
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAddress',
      'address',
      'endpoint'
    ]),
    ...mapGetters('chain', [
      'blockHeight'
    ]),
    ...mapGetters('mosaicAmountViews', [
      'mosaicAmountViews'
    ]),
    mosaicBalance() {
      return this.allMosaicsBalance.filter((m) => {
        return m.alias !== this.currencyNamespaceName && m.alias !== this.harvestNamespaceName
      })
    },
    allMosaicsBalance() {
      const blockHeight = this.blockHeight
      if (this.isLoading === false && this.mosaicAmountViews.length === 0) {
        return []
      } else if (this.mosaicAmountViews === null) {
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
        ret.id = mosaicAmountView.fullName().toUpperCase()
        return ret
      })
    }
  },
  methods: {
    reload: async function (event) {
      this.isLoading = true
      await this.$store.dispatch('chain/updateBlockHeight', {
        endpoint: this.endpoint
      })
      await this.$store.dispatch('mosaicAmountViews/update')
      this.isLoading = false
    }
  }
}
</script>

<style scoped>

</style>
