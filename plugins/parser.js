import Vue from 'vue'
import { Mosaic, MosaicId, NamespaceId, UInt64, Address } from 'nem2-sdk'
import convert from '~/lib/convert'
import base32 from '~/lib/base32'

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
  },
  resolveIfNamespace: async function (namespaceHttp, mosaic) {
    const isNamespace = (mosaic.id.id.higher >>> 31) === 1
    if (isNamespace) {
      const mosaicId = await namespaceHttp.getLinkedMosaicId(mosaic.id).toPromise()
      return new Mosaic(mosaicId, mosaic.amount)
    } else {
      return mosaic
    }
  },
  parseAddress: function (str) {
    let address
    if (str.startsWith('@')) {
      address = new NamespaceId(str.substr(1))
    } else {
      address = Address.createFromRawAddress(str)
    }
    return address
  },
  parseAddressSecretLock: function (str) {
    let address
    if (str.startsWith('@')) {
      const namespaceId = new NamespaceId(str.substr(1))
      const uint8ns = convert.hexToUint8(namespaceId.toHex())
      const hexAddress = '91' + convert.uint8ToHex(uint8ns.reverse()) + '00000000000000000000000000000000'
      address = {
        plain: function () {
          return base32.encode(convert.hexToUint8(hexAddress))
        }
      }
    } else {
      address = Address.createFromRawAddress(str)
    }
    return address
  }
}
