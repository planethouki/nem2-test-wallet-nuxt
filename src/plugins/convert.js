import Vue from 'vue'
import { Convert } from 'symbol-sdk'

Vue.prototype.$convert = {
  numberToUint8_4 (input) {
    const hex = input.toString(16)
    const hex2 = '0000000'.concat(hex).substr(-8)
    return Convert.hexToUint8(hex2).reverse()
  },
  endian (hex) {
    const uint8arr = Convert.hexToUint8(hex)
    return Convert.uint8ToHex(uint8arr.reverse())
  },
  base64ToHex (base64Str) {
    const buffer = Buffer.from(base64Str, 'base64')
    return buffer.toString('hex')
  }
}
