import Vue from 'vue'
import { convert, KeyPair } from 'nem2-library'
const secureRandom = require('secure-random')

Vue.prototype.$crypto = {
  signTx: function (payload, account) {
    const payloadSigningBytes = payload.substr(100 * 2)
    const keyPair = KeyPair.createKeyPairFromPrivateKeyString(account.privateKey)
    const signatureBin = KeyPair.sign(keyPair, payloadSigningBytes)
    const signature = convert.uint8ToHex(signatureBin)
    return payload.substr(0, 4 * 2) + signature + payload.substr((4 + 64) * 2)
  },
  random10: function () {
    const data = secureRandom.randomUint8Array(10)
    return convert.uint8ToHex(data)
  },
  random32: function () {
    const data = secureRandom.randomUint8Array(32)
    return convert.uint8ToHex(data)
  }
}
