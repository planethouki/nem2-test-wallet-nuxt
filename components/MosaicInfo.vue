<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
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
      alert: ''
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
        const expireText = `expire ${endHeight}`
        return {
          text: hexId + ', ' + expireText,
          link: `${endpoint}/mosaic/${hexId}`
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
