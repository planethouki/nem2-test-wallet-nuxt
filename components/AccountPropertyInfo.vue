<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Current Account Property
      v-card-text
        v-layout(align-baseline)
          span(v-if="properties === null")
          span(v-if="propertiesTree.length === 0") None
          v-treeview(v-else :items="propertiesTree")
      v-card-actions
        v-btn(
          @click="reload"
          :disabled="isLoading")
          v-icon cached
        v-progress-circular(indeterminate v-if="isLoading").ml-3
</template>

<script>
import { mapGetters } from 'vuex'
import { PropertyType, Address } from 'nem2-sdk'

export default {
  name: 'AccountPropertyInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'accountPropertyInfo'
      }
    }
  },
  data() {
    return {
      isLoading: null
    }
  },
  computed: {
    ...mapGetters('wallet', {
      existsAddress: 'existsAddress'
    }),
    ...mapGetters('accountProperties', [
      'properties'
    ]),
    propertiesTree() {
      return this.properties.map((property) => {
        return {
          id: property.propertyType,
          name: this.propertyTypeToName(property.propertyType),
          children: property.values.map((value) => {
            if (property.propertyType === PropertyType.BlockAddress || property.propertyType === PropertyType.AllowAddress) {
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
    reload: async function (event) {
      this.isLoading = true
      await this.$store.dispatch('accountProperties/update')
      this.isLoading = false
    },
    propertyTypeToName: function (propertyType) {
      switch (propertyType) {
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
