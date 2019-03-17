import Vue from 'vue'
import { Mosaic, MosaicId, NamespaceId, UInt64 } from 'nem2-sdk'

Vue.prototype.$parser = {
  parseMosaics: function (str) {
    const mosaics = str.split(',').map((mosaicRawStr) => {
      const idAndAmount = mosaicRawStr.trim().split('::')
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
    })
    return mosaics
  },
  parseMosaic: function (str) {
    return this.parseMosaics(str)[0]
  }
}
