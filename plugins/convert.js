import Vue from 'vue'
import { convert } from 'nem2-library'

Vue.prototype.$convert = {
  numberToUint8_4: function (input) {
    const hex = input.toString(16)
    const hex2 = '0000000'.concat(hex).substr(-8)
    return convert.hexToUint8(hex2).reverse()
  },
  endian: function (hex) {
    const uint8arr = convert.hexToUint8(hex)
    return convert.uint8ToHex(uint8arr.reverse())
  }
}
