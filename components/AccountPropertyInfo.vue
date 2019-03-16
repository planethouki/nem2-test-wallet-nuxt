<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Current Account Property
          v-btn(
          fab
          small
          flat
          @click="reloadAccount")
            v-icon cached
      v-card-text
        v-treeview(:items="propertiesTree")
</template>

<script>
import { AccountHttp, PropertyType, Address } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export default {
  name: 'AccountPropertyInfo',
  props: [
    'endpoint',
    'wallet',
    'walletPassword',
    'navTargetId'
  ],
  data() {
    return {
      properties: []
    }
  },
  computed: {
    propertiesTree: function () {
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
    wallet: {
      handler: function () {
        if (this.wallet.address) {
          this.reloadAccount()
        }
      }
    }
  },
  methods: {
    reloadAccount: function (event) {
      const accountHttp = new AccountHttp(this.endpoint)
      accountHttp.getAccountInfo(this.wallet.address).pipe(
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
