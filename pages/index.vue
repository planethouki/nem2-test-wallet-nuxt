<template>
  <v-container grid-list-xl>

    <v-layout>

      <v-flex sm10 offset-sm1>

        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h3>Create Wallet</h3>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Endpoint"
                v-model="endpoint"
                required
                placeholder="ex). http://catapult48gh23s.xyz:3000"
              ></v-text-field>
              <v-layout>
                <v-flex>
                  <v-text-field
                    label="Private Key"
                    v-model="privateKey"
                    :counter="64"
                    required
                    placeholder="ex). 25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E"
                  ></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-btn
                    fab
                    small
                    flat
                    @click="regenPrivateKey"
                    :loading="isLoading"><v-icon>cached</v-icon></v-btn>
                </v-flex>
              </v-layout>
              <v-text-field
                label="Wallet Name"
                v-model="walletName"
                required
                placeholder="ex). myWallet"
              ></v-text-field>
              <v-layout>
                <v-flex>
                  <v-text-field
                    label="Wallet Password"
                    v-model="walletPassword"
                    required
                    placeholder="ex). cRb3Q$c7Mf5SPGa3PfnTmBKHHFdv3G!#g6wwXktwJm$BC*M^cjtZM!EJ"
                  ></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-btn
                    fab
                    small
                    flat
                    @click="regenWalletPassword"
                    :loading="isLoading"><v-icon>cached</v-icon></v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="createWallet"
                :loading="isLoading"
                :disabled="isLoading">create</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h3>Address</h3>
            </v-card-title>
            <v-card-title>{{ walletAddress }}</v-card-title>
            <!--<v-card flat><qriously v-model="qrJson" :size="qrSize" ></qriously></v-card>-->
            <v-card-title>
              <h3>Mosaics</h3>
              <v-spacer/>
              <v-btn
                fab
                small
                flat
                @click="reloadMosaics"
                :loading="isLoading"><v-icon>cached</v-icon></v-btn>
            </v-card-title>
            <v-card-title v-for="mosaic in mosaics" v-bind:key="mosaic.id.toHex()">
              {{ mosaic.id.toHex()}} {{mosaic.amount.compact()}}
            </v-card-title>
          </v-card>
        </v-flex>

        <v-flex xs12>
          <v-card>
            <!--<div v-for="(item, index) in validation" :key="index" class="errorLabel">-->
            <!--<div v-if="item!==true">{{ item }}</div>-->
            <!--</div>-->
            <v-card-title>
              <h3>Transfer Transaction</h3>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="To address"
                v-model="t_recepient"
                required
                placeholder="ex). SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE"
              ></v-text-field>
              <v-text-field
                label="Mosaics"
                v-model="t_mosaics"
                required
              ></v-text-field>
              <v-text-field
                label="Message"
                v-model="t_message"
                :counter="1024"
                placeholder="ex) Thank you."
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="t_sendHandler"
                :loading="isLoading"
                :disabled="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in t_sendHistory" :key="tx.hash">
                  <v-list-tile-avatar>
                    <!--<v-icon>update</v-icon>-->
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <a v-bind:href="tx.apiStatusUrl" target="_blank">{{ tx.hash }}</a>
                  </v-list-tile-content>

                </v-list-tile>
              </v-list>
            </v-card-text>

          </v-card>
        </v-flex>

      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import {
  Account, AccountHttp, Address, Deadline, UInt64, NetworkType, PlainMessage, TransferTransaction, Mosaic, MosaicId,
  Password, SimpleWallet, TransactionHttp, XEM
} from 'nem2-sdk';
const generator = require('generate-password');

export default {
  layout: "baseline",
  source: "https://www.google.co.jp",
  asyncData (context) {
    return {
      name: 'Catapult Unsafe Wallet',
      description: "Do NOT use on main net",
      endpoint: "http://catapult48gh23s.xyz:3000",
      privateKey: "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
      walletName: "myWallet",
      walletPassword: "cRb3Q$c7Mf5SPGa3PfnTmBKHHFdv3G!#g6wwXktwJm$BC*M^cjt",
      wallet: {},
      mosaics: [],
      resultMessage: "",
      isLoading: false,
      t_recepient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
      t_mosaics: "nem:xem::1000000",
      t_message: "Hello Nem2!",
      t_sendHistory: [],
    }
  },
  methods: {
    regenPrivateKey: function(event) {
      this.isLoading = true
      this.privateKey = Account.generateNewAccount(NetworkType.MIJIN_TEST).privateKey
      this.isLoading = false
    },
    regenWalletPassword: function(event) {
      this.walletPassword = generator.generate({
        length: 50,
        numbers: true,
        symbols: true,
      });
    },
    reloadMosaics: function(event) {
      if (this.wallet.address) {
        let accountHttp = new AccountHttp(this.endpoint);
        accountHttp.getAccountInfo(this.wallet.address).subscribe(
          result => {
            if (result.mosaics.length === 0) {
              this.mosaics = [XEM.createAbsolute(0)]
            } else {
              this.mosaics = result.mosaics
            }
          },
          err => {
            console.error(err)
            this.mosaics = [XEM.createAbsolute(0)]
          }
        );
      }
    },
    createWallet: function(event) {
      this.wallet = SimpleWallet.createFromPrivateKey(
        this.walletName,
        new Password(this.walletPassword),
        this.privateKey,
        NetworkType.MIJIN_TEST
      );
    },
    t_sendHandler: function(event) {
      let mosaics = this.t_mosaics.split(",").map((mosaicRawStr) => {
        let nameAndAmount = mosaicRawStr.split("::");
        return new Mosaic(
          new MosaicId(nameAndAmount[0]),
          UInt64.fromUint(nameAndAmount[1])
        );
      });
      let tx = TransferTransaction.create(
        Deadline.create(23),
        Address.createFromRawAddress(this.t_recepient),
        mosaics,
        PlainMessage.create(this.t_message),
        NetworkType.MIJIN_TEST
      );
      let account = this.wallet.open(new Password(this.walletPassword));
      let signedTx = account.sign(tx);
      let txHttp = new TransactionHttp(this.endpoint);
      txHttp.announce(signedTx).toPromise().then((resolve, reject) => {

      });
      let historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${this.endpoint}/transaction/${signedTx.hash}/status`
      };
      this.t_sendHistory.push(historyData);
    }
  },
  watch: {
    wallet: {
      handler: function(newVal, oldVal) {
        if (this.wallet.address) {
          let accountHttp = new AccountHttp(this.endpoint);
          accountHttp.getAccountInfo(this.wallet.address).subscribe(
            result => {
              if (result.mosaics.length === 0) {
                this.mosaics = [XEM.createAbsolute(0)]
              } else {
                this.mosaics = result.mosaics
              }
            },
            err => {
              console.error(err)
              this.mosaics = [XEM.createAbsolute(0)]
            }
          );
        }
      }
    },
  },
  computed: {
    walletAddress: function() {
      if (this.wallet.address) {
        return this.wallet.address.pretty()
      } else {
        return "none"
      }
    },
  },
  head () {
    return {
      title: this.name,
      meta: [
        { hid: 'top', name: 'top', content: 'top' }
      ]
    }
  },
  components: {

  },
}
</script>

<style>
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }
  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }
  .links {
    padding-top: 15px;
  }
</style>
