import Vue from 'vue'
import { Convert } from 'symbol-sdk'
const secureRandom = require('secure-random')

Vue.prototype.$crypto = {
  random20 () {
    const data = secureRandom(20, { type: 'Uint8Array' })
    return Convert.uint8ToHex(data)
  },
  random32 () {
    const data = secureRandom(32, { type: 'Uint8Array' })
    return Convert.uint8ToHex(data)
  }
}
