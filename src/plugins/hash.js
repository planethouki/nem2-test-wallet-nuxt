import Vue from 'vue'
// eslint-disable-next-line
import { sha3_256, keccak256 } from 'js-sha3'
import { RIPEMD160, SHA256, enc } from 'crypto-js'

function sha256hex (input) {
  const words = enc.Hex.parse(input)
  const hash = SHA256(words)
  return hash.toString(enc.Hex).toUpperCase()
}

function ripemd160hex (input) {
  const words = enc.Hex.parse(input)
  const hash = RIPEMD160(words)
  return hash.toString(enc.Hex).toUpperCase()
}

Vue.prototype.$hash = {
  sha3 (input) {
    return sha3_256.create().update(Buffer.from(input, 'hex')).hex().toUpperCase()
  },
  keccak (input) {
    return keccak256.create().update(Buffer.from(input, 'hex')).hex().toUpperCase()
  },
  hash256 (input) {
    return sha256hex(sha256hex(input))
  },
  hash160 (input) {
    return ripemd160hex(sha256hex(input))
  }
}
