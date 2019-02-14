<template lang="pug">
  v-layout
    v-dialog(v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition")
      v-btn(slot="activator" color="indigo lighten-2" dark).white--text View Tutorial
        v-icon play_circle_outline
      v-card
        v-toolbar(dark color="primary")
          v-btn(icon dark @click="dialog = false")
            v-icon close
          v-toolbar-title Tutorial
          v-spacer
          v-toolbar-items
            v-btn(dark flat @click="dialog = false") Close
        v-flex
          v-subheader.headline Endpoint & Private Key
          .px-3.py-1
            img(src="img/ep01.jpg")
            ul
              li Select endpoint
          .px-3.py-1
            img(src="img/ep02.jpg")
            ul
              li If you want another endpoint, select "other".
              li And input your rest-gateway url include "http://" and ":port".
          .px-3.py-1
            img(src="img/ep03.jpg")
            ul
              li Private key selection. Default private key is set.
              li You can generate random by clicking the icon.
              li If all ok, click login button.
        v-divider
        v-flex
          v-subheader.headline Account Info
          .px-3.py-1
            img(src="img/ac01.jpg")
            ul
              li Your address.
              li To copy address, click the icon.
          .px-3.py-1
            img(src="img/ac02.jpg")
            ul
              li Your public key.
              li If you have never sent or received transactions, the public key will not be displayed.
              li If you just received a transaction, zero is displayed.
          .px-3.py-1
            img(src="img/ac03.jpg")
            ul
              li Your balance.
              li Namespace, mosaic, absolute amount are displayed in order.
              li In parentheses, it is relative amount.
              li Click the red frame to get the balance again.
              li Click on the blue frame (if it is displayed) to jump to faucet.
          .px-3.py-1
            img(src="img/ac04.jpg")
            ul
              li Back to select endpoint & private key page.
          .px-3.py-1
            img(src="img/ac05.jpg")
            ul
              li If it can not connect to the endpoint, an error will be displayed. (maybe after 60 seconds)
        v-divider
        v-flex
          v-subheader.headline Transfer Transaction
          .px-3.py-1
            img(src="img/tr01.jpg")
            ul
              li Recipient address.
              li It does not matter whether or not there is "-".
          .px-3.py-1
            img(src="img/tr02.jpg")
            ul
              li Mosaic to send.
              li The format is namespace:mosaic::absoluteAmount.
          .px-3.py-1
            img(src="img/tr03.jpg")
            ul
              li When multiple mosaics, they are separated by commas.
          .px-3.py-1
            img(src="img/tr04.jpg")
            ul
              li Message of 1023 bytes.
          .px-3.py-1
            img(src="img/tr05.jpg")
            ul
              li Click the announce button to send.
              li The history is displayed, you can check the status by clicking.
</template>

<script>
  export default {
    data () {
      return {
        dialog: false
      }
    }
  }
</script>

<style scoped>
  img {
    border: 1px solid gray;
    width: 100%;
    max-width: 600px;
  }
</style>
