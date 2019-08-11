import Vue from 'vue'
// eslint-disable-next-line
import { sha3_256, keccak256 } from 'js-sha3'
import { RIPEMD160, SHA256, enc } from 'crypto-js'
import convert from '~/lib/convert'

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

// eslint-disable-next-line
function endian(hex) {
  const uint8arr = convert.hexToUint8(hex)
  return convert.uint8ToHex(uint8arr.reverse())
}

Vue.prototype.$hash = {
  sha3 (input) {
    return sha3_256.create().update(Buffer.from(input, 'hex')).hex().toUpperCase()
  },
  keccac (input) {
    return keccak256.create().update(Buffer.from(input, 'hex')).hex().toUpperCase()
  },
  hash256 (input) {
    return sha256hex(sha256hex(input))
  },
  hash160 (input) {
    return ripemd160hex(sha256hex(input))
  },
  getSinedTxHash (payload) {
    const hashInputPayload =
      payload.substr(4 * 2, 32 * 2) +
      payload.substr((4 + 64) * 2, 32 * 2) +
      payload.substr((4 + 64 + 32) * 2)
    return sha3_256.create().update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase()
  }
}
