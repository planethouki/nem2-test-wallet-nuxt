import Vue from 'vue'
import { Mosaic, MosaicId, UInt64 } from 'nem2-sdk'

Vue.prototype.$parser = {
  parseMosaics: function (str) {
    const mosaics = str.split(',').map((mosaicRawStr) => {
      const idAndAmount = mosaicRawStr.trim().split('::')
      return new Mosaic(
        new MosaicId(idAndAmount[0]),
        UInt64.fromUint(Number(idAndAmount[1]))
      )
    })
    return mosaics
  }
}
