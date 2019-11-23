import Vue from 'vue'
import { Mosaic, MosaicId, NamespaceId, UInt64, Address } from 'nem2-sdk'

Vue.prototype.$parser = {
  parseMosaic (str) {
    const idAndAmount = str.trim().split('::')
    let mosaicId
    if (idAndAmount[0].startsWith('@')) {
      mosaicId = new NamespaceId(idAndAmount[0].substr(1))
    } else {
      mosaicId = new MosaicId(idAndAmount[0])
    }
    return new Mosaic(
      mosaicId,
      UInt64.fromUint(Number(idAndAmount[1]))
    )
  },
  parseAddress (str) {
    let address
    if (str.startsWith('@')) {
      address = new NamespaceId(str.substr(1))
    } else {
      address = Address.createFromRawAddress(str)
    }
    return address
  }
}
