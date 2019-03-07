<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Secret Lock Transaction
      v-card-text
        v-radio-group(label="Hash Type" v-model="l_hashType" row)
          v-radio(
          v-for="ht in l_hashTypes"
          :key="ht.type"
          :label="ht.label"
          :value="ht.type")
        v-text-field(
          label="Secret (Hash for Random)"
          v-model="l_secret")
        v-text-field(
          label="Mosaic for Lock (hexMosaicId::absoluteAmount)"
          v-model="l_mosaic"
          required
          placeholder="ex). 85BBEA6CC462B244::1000000")
        v-text-field(
          label="To Address"
          v-model="l_recipient"
          required
          placeholder="ex). SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE")
        v-text-field(
          label="Duration In Blocks"
          v-model="l_duration"
          required
          type="number"
          placeholder="ex). 240")
        v-text-field(
          label="Max Fee"
          v-model="l_fee"
          required
          type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="l_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="l_history")
</template>

<script>
import {
  Address, Deadline, UInt64, Mosaic, MosaicId, SecretLockTransaction, HashType } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'SecretLock',
  components: {
    TxHistory
  },
  props: [
    'endpoint',
    'wallet',
    'walletPassword',
    'navTargetId'
  ],
  data() {
    return {
      l_hashType: HashType.Op_Sha3_256,
      l_hashTypes: [
        { type: HashType.Op_Sha3_256, label: 'Sha3-256' },
        { type: HashType.Op_Keccak_256, label: 'Keccak256' },
        { type: HashType.Op_Hash_256, label: 'Hash256' },
        { type: HashType.Op_Hash_160, label: 'Hash160' }
      ],
      l_mosaic: '85BBEA6CC462B244::10000000',
      l_recipient: 'SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE',
      l_duration: 240,
      l_history: [],
      l_secret: '2B9DC1E6C02C96E690D4BC2E50BA8E8A0F3C065D98668D545C20E1A97B141B9D',
      l_fee: 0
    }
  },
  methods: {
    l_announceHandler: function (event) {
      const account = this.wallet.open(this.walletPassword)
      const endpoint = this.endpoint
      const duration = this.l_duration
      const secret = this.l_secret
      const recipient = this.l_recipient
      const nameAndAmount = this.l_mosaic.split('::')
      const mosaic = new Mosaic(new MosaicId(nameAndAmount[0]), UInt64.fromUint(nameAndAmount[1]))
      const secretLockTransaction = new SecretLockTransaction(
        this.wallet.network,
        this.$TransactionVersion.SECRET_LOCK,
        Deadline.create(),
        UInt64.fromUint(this.l_fee),
        mosaic,
        UInt64.fromUint(duration),
        this.l_hashType,
        secret,
        Address.createFromRawAddress(recipient)
      )
      const preSignedTx = account.sign(secretLockTransaction)
      const preSignedTxPayload = preSignedTx.payload
      const size = 'CA000000'
      let signedTxPayload
      if (this.l_hashType === HashType.Op_Hash_160) {
        const unsignedPayload = size + preSignedTxPayload.substring(8, 330) +
          '000000000000000000000000' + preSignedTxPayload.substr(330)
        signedTxPayload = this.$crypto.signTx(unsignedPayload, account)
      } else {
        signedTxPayload = size + preSignedTxPayload.substr(8)
      }
      const hash = this.$hash.getSinedTxHash(signedTxPayload)
      const request = require('request')
      request({
        url: `${endpoint}/transaction`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        json: { 'payload': signedTxPayload }
      })
      const historyData = {
        hash: hash,
        apiStatusUrl: `${endpoint}/transaction/${hash}/status`
      }
      this.l_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
