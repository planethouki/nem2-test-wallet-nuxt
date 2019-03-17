<template lang="pug">
  v-flex(mb-5 v-if="address" v-bind:id="navTargetId")
    v-card
      v-card-text.pb-0
        v-layout(align-baseline)
          span.title Balance
          v-btn(
          fab
          small
          flat
          @click="reload")
            v-icon cached
          v-progress-circular(indeterminate v-if="isBalanceLoading").ml-3
          v-spacer
          small resolve only cat.currency and cat.harvest
        v-layout(column)
          v-list-tile(v-for="m in mosaicAmountTexts" v-bind:key="m")
            v-list-tile-content
              v-list-tile-title
                span {{ m }}
      v-card-text.pb-0
        v-layout(align-baseline)
          span.title Owned Namespaces
          v-btn(
          fab
          small
          flat
          @click="reload")
            v-icon cached
          v-progress-circular(indeterminate v-if="isNamespaceLoading").ml-3
        v-layout(column)
          div(v-for="m in namespaceTexts" v-bind:key="m.link").ml-3
            div {{ m.text }}
              a(:href="m.link" target="_blank" style="text-decoration:none;" v-if="m.link")
                v-icon(small) arrow_right
      v-card-text
        v-layout(align-baseline)
          span.title Owned Mosaics
          v-btn(
          fab
          small
          flat
          @click="reload")
            v-icon cached
          v-progress-circular(indeterminate v-if="isBalanceLoading").ml-3
          v-spacer
          small show only with balance
        v-layout(column)
          div(v-for="m in mosaicTexts" v-bind:key="m.link").ml-3
            div {{ m.text }}
              a(:href="m.link" target="_blank" style="text-decoration:none;" v-if="m.link")
                v-icon(small) arrow_right
</template>

<script>
import { MosaicId, MosaicService, NetworkCurrencyMosaic, NamespaceId,
  AccountHttp, MosaicHttp, BlockchainHttp, NamespaceHttp } from 'nem2-sdk'
import { flatMap, mergeMap } from 'rxjs/operators'

export default {
  name: 'AliasInfo',
  props: [
    'endpoint',
    'address',
    'navTargetId'
  ],
  data() {
    return {
      mosaicAmountViews: [],
      blockHeight: 0,
      isBalanceLoading: true,
      isNamespaceLoading: true,
      alert: '',
      currencyMosaicId: new MosaicId('0000000000000000'),
      harvestMosaicId: new MosaicId('0000000000000000'),
      currencyNamespaceName: 'cat.currency',
      harvestNamespaceName: 'cat.harvest',
      namespaces: [],
      mosaics: []
    }
  },
  computed: {
    mosaicAmountTexts: function () {
      const blockHeight = this.blockHeight
      const currencyMosaicId = this.currencyMosaicId
      const harvestMosaicId = this.harvestMosaicId
      const currencyNamespaceName = this.currencyNamespaceName
      const harvestNamespaceName = this.harvestNamespaceName
      if (this.isBalanceLoading === false && this.mosaicAmountViews.length === 0) {
        return ['none']
      }
      return this.mosaicAmountViews.filter(function (mosaicAmountView) {
        if (blockHeight === 0) {
          return true
        } else if (mosaicAmountView.mosaicInfo.duration.compact() === 0) {
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
        const divisibility = mosaicAmountView.mosaicInfo.properties.divisibility
        const amount = mosaicAmountView.amount.compact()
        const relAmount = amount / (10 ** divisibility)
        let mosaicName
        if (mosaicAmountView.mosaicInfo.mosaicId.equals(currencyMosaicId)) {
          mosaicName = currencyNamespaceName
        } else if (mosaicAmountView.mosaicInfo.mosaicId.equals(harvestMosaicId)) {
          mosaicName = harvestNamespaceName
        } else {
          mosaicName = mosaicAmountView.fullName().toUpperCase()
        }
        return mosaicName +
          '::' +
          amount.toString(10) +
          ' (' +
          relAmount.toString(10) +
          ') '
      })
    },
    namespaceTexts: function () {
      const blockHeight = this.blockHeight
      const endpoint = this.endpoint
      if (this.isNamespaceLoading === false && this.namespaces.length === 0) {
        return [{ text: 'none', link: '' }]
      }
      return this.namespaces.filter((ns, index, namespaces) => {
        for (let i = 0; i < index; i++) {
          if (ns === namespaces[i]) return false
        }
        return true
      }).sort(function (a, b) {
        const nameA = a.namespaceInfo.metaId
        const nameB = b.namespaceInfo.metaId
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      }).map((ns) => {
        const name = ns.namespaceName.name
        const hexId = ns.namespaceInfo.id.toHex().toUpperCase()
        const expireWithin = ns.namespaceInfo.endHeight.compact() - blockHeight
        const expireText = expireWithin > 0 ? `expire within ${expireWithin} blocks` : `expired after ${-expireWithin} blocks`
        let parentText
        if (ns.namespaceInfo.depth > 1) {
          parentText = 'parent: ' + ns.namespaceInfo.levels[ns.namespaceInfo.depth - 2].toHex().toUpperCase()
        } else {
          parentText = 'top level'
        }
        return {
          text: name + ', ' + hexId + ', ' + expireText + ', ' + parentText,
          link: `${endpoint}/namespace/${hexId}`
        }
      })
    },
    mosaicTexts: function () {
      const blockHeight = this.blockHeight
      const endpoint = this.endpoint
      const address = this.address
      if (this.isBalanceLoading === false && this.mosaicAmountViews.length === 0) {
        return [{ text: 'none', link: '' }]
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
        const expireText = expireWithin > 0 ? `expire within ${expireWithin} blocks` : `expired after ${-expireWithin} blocks`
        return {
          text: hexId + ', ' + expireText,
          link: `${endpoint}/mosaic/${hexId}`
        }
      })
    }
  },
  watch: {
    address: {
      handler: function () {
        if (this.address) {
          this.reloadBalance()
          this.reloadNamespaces()
        }
      }
    }
  },
  methods: {
    reload: function () {
      this.reloadBalance()
      this.reloadNamespaces()
    },
    reloadBalance: async function (event) {
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
        }),
        flatMap(_ => _)
      ).subscribe((mosaicAmountView) => {
        this.mosaicAmountViews.push(mosaicAmountView)
        this.isBalanceLoading = false
      }, () => {
        this.isBalanceLoading = false
      })
    },
    reloadNamespaces: function (event) {
      this.isNamespaceLoading = true
      this.namespaces = []
      const namespaces = {}
      const namespaceHttp = new NamespaceHttp(this.endpoint)
      namespaceHttp.getNamespacesFromAccount(this.address).pipe(
        flatMap(_ => _),
        mergeMap((x) => {
          namespaces[x.id.toHex().toUpperCase()] = { namespaceInfo: x }
          return namespaceHttp.getNamespacesName([x.id])
        }),
        flatMap(_ => _)
      ).subscribe((namespaceName) => {
        const namespace = namespaces[namespaceName.namespaceId.toHex().toUpperCase()]
        namespace.namespaceName = namespaceName
        this.namespaces.push(namespace)
      })
      // actually, loading is not complete
      this.isNamespaceLoading = false
    }
  }
}
</script>

<style scoped>

</style>
