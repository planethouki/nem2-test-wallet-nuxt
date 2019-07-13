import Vue from 'vue'
import { convert } from '~/lib/convert'
const secureRandom = require('secure-random')

Vue.prototype.$crypto = {
  random10: function () {
    const data = secureRandom.randomUint8Array(10)
    return convert.uint8ToHex(data)
  },
  random32: function () {
    const data = secureRandom.randomUint8Array(32)
    return convert.uint8ToHex(data)
  }
}
