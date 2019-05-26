<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Current Account Property
      v-card-text
        v-layout(align-baseline)
        v-treeview(:items="propertiesTree")
        span(v-if="propertiesTree.length === 0") None
      v-card-actions
        v-btn(
          @click="reloadAccount")
          v-icon cached
</template>

<script>
import { AccountHttp, PropertyType, Address } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

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
      properties: []
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
    endpoint() {
      return this.$store.getters['wallet/endpoint']
    },
    address() {
      return this.$store.getters['wallet/address']
    },
    walletMutateCount() {
      return this.$store.getters['wallet/mutateCount']
    },
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
  watch: {
    walletMutateCount: {
      handler: function () {
        this.reloadAccount()
      }
    }
  },
  mounted() {
    this.reloadAccount()
  },
  methods: {
    reloadAccount: function (event) {
      if (!this.existsAccount) return
      this.properties = []
      const accountHttp = new AccountHttp(this.endpoint)
      accountHttp.getAccountInfo(this.address).pipe(
        mergeMap((accountInfo) => {
          return accountHttp.getAccountProperty(accountInfo.publicAccount)
        })
      ).subscribe((accountPropertiesInfo) => {
        this.properties = accountPropertiesInfo.accountProperties.properties
      }, () => {
        this.properties = []
      })
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
