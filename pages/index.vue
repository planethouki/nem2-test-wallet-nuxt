<template>
  <v-container grid-list-xl>

    <v-layout>

      <v-flex sm10 offset-sm1>


        <v-flex xs12>
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Endpoint</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Endpoint"
                v-model="endpoint"
                required
                placeholder="ex). http://catapult48gh23s.xyz:3000"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 v-show="!wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Load Wallet</div>
            </v-card-title>
            <v-card-title>
              <v-select
                :items="listWallet"
                v-model="selectedCreationDate"
                menu-props="auto"
                label="Select"
                hide-details
                single-line
              ></v-select>
            </v-card-title>
            <v-card-title>
              <v-text-field
                v-model="password"
                :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                :rules="[passwordRules.required, passwordRules.min]"
                :type="passwordShow ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                hint="At least 8 characters"
                counter
                required
                @click:append="passwordShow = !passwordShow"
              ></v-text-field>
            </v-card-title>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="loadWallet"
                :loading="isLoading"
                :disabled="isLoading">load</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 v-show="!wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Create Wallet</div>
            </v-card-title>
            <v-card-text>
              <v-layout>
                <v-flex>
                  <v-text-field
                    label="Private Key"
                    v-model="walletPrivateKey"
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
                    :rules="[passwordRules.required, passwordRules.min]"
                    required
                    counter
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

        <v-flex xs12 v-if="wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Address</div>
              <v-spacer/>
              <v-btn
                fab
                small
                flat
                @click="copyWalletAddressHandler"
                :loading="isLoading"><v-icon>filter_none</v-icon></v-btn>
            </v-card-title>
            <v-responsive><span ref="address">{{ wallet.address.pretty() }}</span></v-responsive>
            <!--<v-card flat><qriously v-model="qrJson" :size="qrSize" ></qriously></v-card>-->
            <v-card-title>
              <div class="title font-weight-bold">Mosaics</div>
              <v-spacer/>
              <v-btn
                fab
                small
                flat
                @click="reloadMosaics"
                :loading="isLoading"><v-icon>cached</v-icon></v-btn>
            </v-card-title>
            <v-responsive>
              <v-list-tile v-for="mosaicAmountView in mosaicAmountViews" v-bind:key="mosaicAmountView.mosaicInfo.mosaicId.toHex()">
                <v-list-tile-content>
                  <v-list-tile-title>{{ mosaicAmountView.namespaceName }}:{{ mosaicAmountView.mosaicName }}::{{ mosaicAmountView.amount.compact() }} (divisibility={{ mosaicAmountView.mosaicInfo.divisibility }})</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-responsive>
            <v-card-title>
              <div class="title font-weight-bold">Wallet Info</div>
            </v-card-title>
            <v-responsive>
              <v-list>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>name</v-list-tile-title>
                    <v-list-tile-sub-title>{{ wallet.name }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>creationDate</v-list-tile-title>
                    <v-list-tile-sub-title>{{ wallet.creationDate }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>encryptedPrivateKey encrypted key</v-list-tile-title>
                    <v-list-tile-sub-title>{{ wallet.encryptedPrivateKey.encryptedKey }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>encryptedPrivateKey initial vector</v-list-tile-title>
                    <v-list-tile-sub-title>{{ wallet.encryptedPrivateKey.iv }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-responsive>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="logoutWallet"
                :loading="isLoading"
                :disabled="isLoading">logout</v-btn>
              <!--<v-btn-->
                <!--color="blue"-->
                <!--class="white&#45;&#45;text"-->
                <!--@click="viewPrivateKey"-->
                <!--:loading="isLoading"-->
                <!--:disabled="isLoading">view privatekey</v-btn>-->
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 v-if="wallet.address">
          <v-card>
            <!--<div v-for="(item, index) in validation" :key="index" class="errorLabel">-->
            <!--<div v-if="item!==true">{{ item }}</div>-->
            <!--</div>-->
            <v-card-title>
              <div class="title font-weight-bold">Transfer Transaction</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="To"
                v-model="t_recipient"
                required
                placeholder="ex). SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE"
              ></v-text-field>
              <v-text-field
                label="Mosaics (namespace:mosaic::absoluteAmount) (comma separated)"
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
                @click="t_announceHandler"
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

        <v-flex xs12 v-if="wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Register Namespace</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Name"
                v-model="n_name"
                required
                placeholder="ex). foo"
              ></v-text-field>
              <v-text-field
                label="Duration In Blocks"
                v-model="n_duration"
                required
                type="number"
                placeholder="ex). 10"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="n_announceHandler"
                :loading="isLoading"
                :disabled="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in n_history" :key="tx.hash">
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

        <v-flex xs12 v-if="wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Create Mosaic</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Namespace"
                v-model="m_namespace"
                required
                placeholder="ex). foo"
              ></v-text-field>
              <v-text-field
                label="Name"
                v-model="m_name"
                required
                placeholder="ex). bar"
              ></v-text-field>
              <v-text-field
                label="Supply Amount"
                v-model="m_delta"
                required
                type="number"
                placeholder="ex). 100"
              ></v-text-field>
              <v-text-field
                label="Divisibility"
                v-model="m_divisibility"
                required
                type="number"
                placeholder="ex). 0"
              ></v-text-field>
              <v-text-field
                label="Duration In Blocks"
                v-model="m_duration"
                required
                type="number"
                placeholder="ex). 10"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="m_announceHandler"
                :loading="isLoading"
                :disabled="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in m_history" :key="tx.hash">
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

        <v-flex xs12 v-if="wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Secret Lock Transaction</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Proof (Hex secret value for lock)"
                v-model="l_proof"
                required
                placeholder="ex). 095B4FCD1F88F1785E59"
              ></v-text-field>
              <v-text-field
                label="Secret (SHA3_512 for Proof)"
                v-model="l_secret"
                disabled
              ></v-text-field>
              <v-text-field
                label="Mosaic for Lock (namespace:mosaic::absoluteAmount) (Single Mosaic)"
                v-model="l_mosaic"
                required
                placeholder="ex). 100"
              ></v-text-field>
              <v-text-field
                label="To"
                v-model="l_recipient"
                required
                placeholder="ex). SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE"
              ></v-text-field>
              <v-text-field
                label="Duration In Blocks"
                v-model="l_duration"
                required
                type="number"
                placeholder="ex). 240"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="l_announceHandler"
                :loading="isLoading"
                :disabled="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in l_history" :key="tx.hash">
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

        <v-flex xs12 v-if="wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Secret Proof Transaction</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Proof (Hex value for unlock)"
                v-model="p_proof"
                required
                placeholder="ex). 095B4FCD1F88F1785E59"
              ></v-text-field>
              <v-text-field
                label="Secret (SHA3_512 for Proof)"
                v-model="p_secret"
                disabled
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="p_announceHandler"
                :loading="isLoading"
                :disabled="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in p_history" :key="tx.hash">
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
    Password, SimpleWallet, TransactionHttp, XEM, MosaicHttp, NamespaceHttp, MosaicService, MosaicAmountView, MosaicInfo,
    MosaicDefinitionTransaction, MosaicSupplyChangeTransaction, MosaicProperties, MosaicSupplyType,
    RegisterNamespaceTransaction, AggregateTransaction, SecretLockTransaction, SecretProofTransaction,
    HashType, EncryptedPrivateKey
  } from 'nem2-sdk';
  import { of } from 'rxjs';
  import { catchError, defaultIfEmpty, flatMap } from 'rxjs/operators';
  import { LocalDateTime } from 'js-joda';
  import { sha3_512 } from 'js-sha3';
  const generator = require('generate-password');

  export default {
    layout: "baseline",
    source: "https://www.google.co.jp",
    asyncData (context) {
      return {
        name: 'Catapult Unsafe Wallet',
        description: "Do NOT use on main net",
        endpoint: "http://catapult48gh23s.xyz:3000",
        walletPrivateKey: "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
        walletName: "myWallet",
        walletPassword: "cRb3Q$c7Mf5SPGa3PfnTmBKHHFdv3G!#g6wwXktwJm$BC*M^cjt",
        password: "cRb3Q$c7Mf5SPGa3PfnTmBKHHFdv3G!#g6wwXktwJm$BC*M^cjt",
        selectedCreationDate: "",
        passwordRules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters'
        },
        passwordShow: false,
        wallet: {},
        mosaicAmountViews: [],
        isLoading: false,
        t_recipient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
        t_mosaics: "nem:xem::1000000",
        t_message: "Hello Nem2!",
        t_sendHistory: [],
        n_name: "foo",
        n_duration: 60,
        n_history: [],
        m_name: "bar",
        m_namespace: "foo",
        m_supplyMutable: true,
        m_transferable: true,
        m_levyMutable: false,
        m_divisibility: 0,
        m_duration: 10,
        m_delta: 100,
        m_history: [],
        l_proof: "095B4FCD1F88F1785E59",
        l_mosaic: "nem:xem::1000000",
        l_recipient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
        l_duration: 240,
        l_history: [],
        p_proof: "095B4FCD1F88F1785E59",
        p_history: [],
      }
    },
    methods: {
      regenPrivateKey: function(event) {
        this.isLoading = true
        this.privateKey = Account.generateNewAccount(NetworkType.MIJIN_TEST).walletPrivateKey
        this.isLoading = false
      },
      regenWalletPassword: function(event) {
        this.isLoading = true
        this.walletPassword = generator.generate({
          length: 50,
          numbers: true,
          symbols: true,
        });
        this.isLoading = false
      },
      createWallet: function(event) {
        this.wallet = SimpleWallet.createFromPrivateKey(
          this.walletName,
          new Password(this.walletPassword),
          this.walletPrivateKey,
          NetworkType.MIJIN_TEST
        );
        this.$store.commit('wallets/addWallet', this.wallet)
      },
      loadWallet: function(event) {
        let targetCreationDate = this.selectedCreationDate;
        let password = this.password;
        if (targetCreationDate !== "") {
          this.$store.commit('wallets/setSelectedCreationDate', targetCreationDate);
          let walletData = this.$store.getters['wallets/getSelectedWallet'];
          let name = walletData.name;
          let address = Address.createFromRawAddress(walletData.address);
          let encryptedPrivateKey = new EncryptedPrivateKey(
            walletData.encryptedPrivateKey.encryptedKey, walletData.encryptedPrivateKey.iv);
          let creationDate = LocalDateTime.parse(walletData.creationDate);
          let wallet = new SimpleWallet(name, NetworkType.MIJIN_TEST, address, creationDate, encryptedPrivateKey);
          try {
            wallet.open(new Password(password));
            this.wallet = wallet;
          } catch (e) {
            console.error(e);
          }
        }
      },
      reloadMosaics: function(event) {
        this.isLoading = true
        if (this.wallet.address) {
          this.mosaicAmountViews = [];
          let endpoint = this.endpoint;
          let address = this.wallet.address;
          let accountHttp = new AccountHttp(endpoint);
          let mosaicHttp = new MosaicHttp(endpoint);
          let nameSpaceHttp = new NamespaceHttp(endpoint);
          let mosaicService = new MosaicService(accountHttp, mosaicHttp, nameSpaceHttp);
          accountHttp.getAccountInfo(address).subscribe(
            accountInfo => {
              let mosaics = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : [XEM.createAbsolute(0)]
              mosaicService.mosaicsAmountView(mosaics)
                .pipe(flatMap((_) => _))
                .subscribe(mosaicAmountView => { this.mosaicAmountViews.push(mosaicAmountView) })
            },
            error => {
              console.error(error)
              mosaicService.mosaicsAmountView([XEM.createAbsolute(0)])
                .pipe(flatMap((_) => _))
                .subscribe(mosaicAmountView => { this.mosaicAmountViews.push(mosaicAmountView) })
            }
          );
        }
        this.isLoading = false
      },
      logoutWallet: function(event) {
        this.wallet = {}
      },
      viewPrivateKey: function() {
        // todo
      },
      copyWalletAddressHandler: function(event) {
        let target = this.$refs.address;
        let range = document.createRange();
        range.selectNode(target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
      },
      t_announceHandler: function(event) {
        this.isLoading = true
        const account = this.wallet.open(new Password(this.walletPassword));
        const recipient = this.t_recipient
        const message = this.t_message
        const endpoint = this.endpoint
        const mosaics = this.t_mosaics.split(",").map((mosaicRawStr) => {
          let nameAndAmount = mosaicRawStr.split("::");
          return new Mosaic(
            new MosaicId(nameAndAmount[0]),
            UInt64.fromUint(nameAndAmount[1])
          );
        });
        let tx = TransferTransaction.create(
          Deadline.create(23),
          Address.createFromRawAddress(recipient),
          mosaics,
          PlainMessage.create(message),
          NetworkType.MIJIN_TEST
        );
        let signedTx = account.sign(tx);
        let txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).toPromise().then((resolve, reject) => {
        });
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.t_sendHistory.push(historyData);
        this.isLoading = false
      },
      n_announceHandler: function(event) {
        this.isLoading = true
        const namespace = this.n_name
        const duration = this.n_duration
        const account = this.wallet.open(new Password(this.walletPassword))
        const endpoint = this.endpoint
        let registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
          Deadline.create(),
          namespace,
          UInt64.fromUint(duration),
          NetworkType.MIJIN_TEST,
        );
        let signedTx = account.sign(registerNamespaceTransaction)
        let txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).subscribe(x => {}, err => console.error)
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.n_history.push(historyData);
        this.isLoading = false
      },
      m_announceHandler: function(event) {
        this.isLoading = true
        const namespace = this.m_namespace
        const mosaic = this.m_name
        const duration = this.m_duration
        const divisibility = this.m_divisibility
        const supplyMutable = this.m_supplyMutable
        const transferable = this.m_transferable
        const levyMutable = this.levyMutable
        const delta = this.m_delta
        const account = this.wallet.open(new Password(this.walletPassword))
        const endpoint = this.endpoint
        let mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
          Deadline.create(),
          mosaic,
          namespace,
          MosaicProperties.create({
            supplyMutable: supplyMutable,
            transferable: transferable,
            levyMutable: levyMutable,
            divisibility: divisibility,
            duration: UInt64.fromUint(duration),
          }),
          NetworkType.MIJIN_TEST,
        );
        let mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
          Deadline.create(),
          mosaicDefinitionTransaction.mosaicId,
          MosaicSupplyType.Increase,
          UInt64.fromUint(delta),
          NetworkType.MIJIN_TEST,
        );
        let aggregateTransaction = AggregateTransaction.createComplete(
          Deadline.create(),
          [
            mosaicDefinitionTransaction.toAggregate(account.publicAccount),
            mosaicSupplyChangeTransaction.toAggregate(account.publicAccount),
          ],
          NetworkType.MIJIN_TEST,
          []
        );
        let signedTx = account.sign(aggregateTransaction)
        let txHttp = new TransactionHttp(endpoint)
        txHttp.announce(signedTx).subscribe(x => {}, err => console.error)
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.m_history.push(historyData);
        this.isLoading = false
      },
      l_announceHandler: function(event) {
        this.isLoading = true
        const account = this.wallet.open(new Password(this.walletPassword))
        const endpoint = this.endpoint
        const duration = this.l_duration
        const secret = this.l_secret
        const recipient = this.l_recipient
        const nameAndAmount = this.l_mosaic.split("::");
        const mosaic =  new Mosaic(new MosaicId(nameAndAmount[0]), UInt64.fromUint(nameAndAmount[1]));
        let secretLockTransaction = SecretLockTransaction.create(
          Deadline.create(),
          mosaic,
          UInt64.fromUint(duration),
          HashType.SHA3_512,
          secret,
          Address.createFromRawAddress(recipient),
          NetworkType.MIJIN_TEST
        );
        let signedTx = account.sign(secretLockTransaction)
        let txHttp = new TransactionHttp(endpoint)
        txHttp.announce(signedTx).subscribe(x => {}, err => console.error)
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.l_history.push(historyData);
        this.isLoading = false
      },
      p_announceHandler: function(event) {
        this.isLoading = true
        const account = this.wallet.open(new Password(this.walletPassword))
        const endpoint = this.endpoint
        const secret = this.p_secret
        const proof = this.p_proof
        let secretProofTransaction = SecretProofTransaction.create(
          Deadline.create(),
          HashType.SHA3_512,
          secret,
          proof,
          NetworkType.MIJIN_TEST
        );
        let signedTx = account.sign(secretProofTransaction)
        let txHttp = new TransactionHttp(endpoint)
        txHttp.announce(signedTx).subscribe(x => {}, err => console.error)
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.p_history.push(historyData);
        this.isLoading = false
      },
    },
    watch: {
      endpoint: {
        handler: function(newVal, oldVal) {
          if (this.wallet.address) {
            this.mosaicAmountViews = [];
            let endpoint = this.endpoint;
            let address = this.wallet.address;
            let accountHttp = new AccountHttp(endpoint);
            let mosaicHttp = new MosaicHttp(endpoint);
            let nameSpaceHttp = new NamespaceHttp(endpoint);
            let mosaicService = new MosaicService(accountHttp, mosaicHttp, nameSpaceHttp);
            accountHttp.getAccountInfo(address).subscribe(
              accountInfo => {
                let mosaics = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : [XEM.createAbsolute(0)]
                mosaicService.mosaicsAmountView(mosaics)
                  .pipe(flatMap((_) => _))
                  .subscribe(mosaicAmountView => { this.mosaicAmountViews.push(mosaicAmountView) })
              },
              error => {
                console.error(error)
                mosaicService.mosaicsAmountView([XEM.createAbsolute(0)])
                  .pipe(flatMap((_) => _))
                  .subscribe(mosaicAmountView => { this.mosaicAmountViews.push(mosaicAmountView) })
              }
            );
          }
        }
      },
      wallet: {
        handler: function(newVal, oldVal) {
          if (this.wallet.address) {
            this.mosaicAmountViews = [];
            let endpoint = this.endpoint;
            let address = this.wallet.address;
            let accountHttp = new AccountHttp(endpoint);
            let mosaicHttp = new MosaicHttp(endpoint);
            let nameSpaceHttp = new NamespaceHttp(endpoint);
            let mosaicService = new MosaicService(accountHttp, mosaicHttp, nameSpaceHttp);
            accountHttp.getAccountInfo(address).subscribe(
              accountInfo => {
                let mosaics = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : [XEM.createAbsolute(0)]
                mosaicService.mosaicsAmountView(mosaics)
                  .pipe(flatMap((_) => _))
                  .subscribe(mosaicAmountView => { this.mosaicAmountViews.push(mosaicAmountView) })
              },
              error => {
                console.error(error)
                mosaicService.mosaicsAmountView([XEM.createAbsolute(0)])
                  .pipe(flatMap((_) => _))
                  .subscribe(mosaicAmountView => { this.mosaicAmountViews.push(mosaicAmountView) })
              }
            );
            const random =
              Math.floor(Math.random() * Math.floor(2**32)).toString(16)
              + Math.floor(Math.random() * Math.floor(2**32)).toString(16)
              + Math.floor(Math.random() * Math.floor(2**32)).toString(16)
            this.l_proof = random.toUpperCase()
            this.p_proof = random.toUpperCase()
          }
        }
      },
    },
    computed: {
      l_secret: function() {
        const proof = this.l_proof
        const hash = sha3_512.create();
        try {
          return hash.update(Buffer.from(proof, 'hex')).hex().toUpperCase();
        } catch(e) {
          return e.message
        }
      },
      p_secret: function() {
        const proof = this.p_proof
        const hash = sha3_512.create();
        try {
          return hash.update(Buffer.from(proof, 'hex')).hex().toUpperCase();
        } catch(e) {
          return e.message
        }
      },
      listWallet: function() {
        return this.$store.state.wallets.list.map((item) => item.creationDate)
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
