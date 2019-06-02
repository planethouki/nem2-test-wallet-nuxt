<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Owned Mosaics
      v-card-text
        v-data-table(
          :headers="headers"
          :items="mosaicTexts")
          template(v-slot:items="props")
            td
              a(:href="props.item.mosaicLink" target="_blank" style="text-decoration:none;" v-if="props.item.mosaicLink")
                span {{ props.item.hexId }}
            td
              a(:href="props.item.blockLink" target="_blank" style="text-decoration:none;" v-if="props.item.blockLink")
                span {{ props.item.height }}
            td {{ props.item.duration }}
            td {{ props.item.supply }}
            td {{ props.item.isTransferable }}
            td {{ props.item.isSupplyMutable}}
      v-card-actions
        v-btn(
          :disabled="isLoading"
          @click="reloadMosaics")
          v-icon cached
        v-progress-circular(indeterminate v-if="isLoading").ml-3
</template>

<script>
import { mapGetters } from 'vuex'

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
      isLoading: null,
      headers: [
        { text: 'ID', value: 'hexId' },
        { text: 'CreateHeight', value: 'height' },
        { text: 'Duration', value: 'duration' },
        { text: 'Supply', value: 'supply' },
        { text: 'Transferable', value: 'isTransferable' },
        { text: 'SupplyMutable', value: 'isSupplyMutable' }
      ]
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAddress',
      'address',
      'endpoint'
    ]),
    ...mapGetters('mosaicAmountViews', [
      'mosaicAmountViews'
    ]),
    mosaicTexts() {
      const endpoint = this.endpoint
      const address = this.address
      if (!this.isLoading && this.mosaicAmountViews.length === 0) {
        return []
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
        return {
          hexId: hexId,
          expire: endHeight,
          mosaicLink: `${endpoint}/mosaic/${hexId}`,
          blockLink: `${endpoint}/block/${startHeight}`,
          height: startHeight,
          duration: duration,
          supply: mosaicAmountView.mosaicInfo.supply.compact(),
          divisibility: mosaicAmountView.mosaicInfo.divisibility,
          isSupplyMutable: mosaicAmountView.mosaicInfo.isSupplyMutable(),
          isTransferable: mosaicAmountView.mosaicInfo.isTransferable()
        }
      })
    }
  },
  methods: {
    reloadMosaics: async function (event) {
      this.isLoading = true
      await this.$store.dispatch('mosaicAmountViews/update')
      this.isLoading = false
    }
  }
}
</script>

<style scoped>

</style>
