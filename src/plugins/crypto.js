import Vue from 'vue'
import { Convert } from 'symbol-sdk'
const secureRandom = require('secure-random')

Vue.prototype.$crypto = {
  random10 () {
    const data = secureRandom(10, { type: 'Uint8Array' })
    return Convert.uint8ToHex(data)
  },
  random32 () {
    const data = secureRandom.randomUint8Array(32)
    return Convert.uint8ToHex(data)
  }
}
