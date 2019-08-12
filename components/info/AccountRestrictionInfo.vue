<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Current Account Restriction
      v-card-text
        v-layout(align-baseline)
          span(v-if="restrictions === null")
          span(v-if="restrictionsTree.length === 0") Please wait for update
          v-treeview(v-else :items="restrictionsTree")
      v-card-actions
        v-btn(
          @click="reload"
          :disabled="isLoading")
          v-icon cached
        v-progress-circular(indeterminate v-if="isLoading").ml-3
</template>

<script>
import { mapGetters } from 'vuex'
import { RestrictionType, Address } from 'nem2-sdk'

export default {
  name: 'AccountRestrictionInfo',
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'accountRestrictionInfo'
      }
    }
  },
  data () {
    return {
      isLoading: null
    }
  },
  computed: {
    ...mapGetters('wallet', {
      existsAddress: 'existsAddress'
    }),
    ...mapGetters('accountRestrictions', [
      'restrictions'
    ]),
    restrictionsTree () {
      return this.restrictions.map((restriction) => {
        return {
          id: restriction.restrictionType,
          name: this.restrictionTypeToName(restriction.restrictionType),
          children: restriction.values.map((value) => {
            if (restriction.restrictionType === RestrictionType.BlockAddress || restriction.restrictionType === RestrictionType.AllowAddress) {
              return {
                id: value,
                name: Address.createFromEncoded(this.$convert.base64ToHex(value)).plain()
              }
            } else {
              return {
                id: value,
                name: this.$convert.base64ToHex(value).toUpperCase()
              }
            }
          })
        }
      })
    }
  },
  methods: {
    async reload (event) {
      this.isLoading = true
      await this.$store.dispatch('accountRestrictions/update')
      this.isLoading = false
    },
    restrictionTypeToName (restrictionType) {
      switch (restrictionType) {
        case 0x01: return 'AllowAddress'
        case 0x02: return 'AllowMosaic'
        case 0x04: return 'AllowTransaction'
        case 0x05: return 'Sentinel'
        case (0x80 + 0x01) : return 'BlockAddress'
        case (0x80 + 0x02): return 'BlockMosaic'
        case (0x80 + 0x04): return 'BlockTransaction'
      }
    }
  }
}
</script>

<style scoped>

</style>
