<template>
  <v-container grid-list-xl>

    <v-layout>

      <v-flex sm10 offset-sm1>

        <v-flex xs12 v-show="!wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Load PrivateKey</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Endpoint"
                v-model="endpoint"
                required
                placeholder="ex). http://catapult48gh23s.xyz:3000"
              ></v-text-field>
            </v-card-text>
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
                v-if="false"
                label="Wallet Name"
                v-model="walletName"
                required
                placeholder="ex). myWallet"
              ></v-text-field>
              <v-layout v-if="false">
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
            <v-card-title>
              <div>
                <span class="title font-weight-bold">Mosaics</span>
                <span class="caption"><a v-bind:href="faucetUrl" target="_blank">Get XEM</a></span>
              </div>
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
            <v-card-title v-if="false">
              <div class="title font-weight-bold">Wallet Info</div>
            </v-card-title>
            <v-responsive v-if="false">
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
              <!--<v-btn-->
                <!--color="blue"-->
                <!--class="white&#45;&#45;text"-->
                <!--@click="logoutWallet"-->
                <!--:loading="isLoading"-->
                <!--:disabled="isLoading">logout</v-btn>-->
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
                label="To Address"
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
                <v-list-tile v-for="tx in t_history" :key="tx.hash">
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
                label="Namespace Name"
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
              <div class="title font-weight-bold">Register Sub Namespace</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Sub Namespace Name"
                v-model="s_name"
                required
                placeholder="ex). sub"
              ></v-text-field>
              <v-text-field
                label="Parent Namespace"
                v-model="s_parentNamespace"
                required
                placeholder="ex). foo"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="s_announceHandler"
                :loading="isLoading"
                :disabled="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in s_history" :key="tx.hash">
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
                label="Mosaic Name"
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
                label="To Address"
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

        <v-flex xs12 v-if="wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Convert to Multisig</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Min Approval"
                v-model="u_minApprovalDelta"
                required
                type="number"
                placeholder="ex). 2"
              ></v-text-field>
              <v-text-field
                label="Min Removal"
                v-model="u_minRemovalDelta"
                required
                type="number"
                placeholder="ex). 2"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <v-flex>
                <v-layout v-for="(u_cosignatory, index) in u_cosignatories" v-bind:key="u_cosignatory" row wrap>
                  <v-flex>
                    <v-layout align-baseline>
                      <v-flex>
                        <v-text-field
                          v-bind:label="'Cosignatory PublicKey: ' + (index + 1)"
                          v-bind:value="u_cosignatory"
                          required
                          :counter="64"
                          disabled
                        ></v-text-field>
                      </v-flex>
                      <v-btn
                        fab
                        small
                        flat
                        v-on:click="u_deleteCosignatory(index)"
                        v-bind:loading="isLoading"><v-icon>delete_forever</v-icon></v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-card-text>
            <v-card-title>
              <v-flex>
                <v-layout align-baseline>
                  <v-flex>
                    <v-text-field
                      label="Add Cosignatory"
                      v-model="u_addedCosignatory"
                      :counter="64"
                      placeholder="ex). C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0"
                    ></v-text-field>
                  </v-flex>
                  <v-btn
                    fab
                    small
                    flat
                    v-on:click="u_addCosignatory"
                    v-bind:loading="isLoading"><v-icon>add_box</v-icon></v-btn>
                </v-layout>
              </v-flex>
            </v-card-title>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="u_announceHandler"
                :loading="isLoading"
                :disabled="u_isMultisig">announce</v-btn>
              <v-flex>
                <div v-if="u_isMultisig">This account is already converted to multisig.</div>
              </v-flex>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in u_history" :key="tx.hash">
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
              <div class="title font-weight-bold">Modify Multisig</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Multisig Account PublicKey"
                v-model="d_multisigPublicKey"
                required
                :counter="64"
                placeholder="ex). AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26"
              ></v-text-field>
              <v-text-field
                label="Approval Change"
                v-model="d_minApprovalDelta"
                required
                type="number"
                placeholder="ex). 2"
              ></v-text-field>
              <v-text-field
                label="Removal Change"
                v-model="d_minRemovalDelta"
                required
                type="number"
                placeholder="ex). 2"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <v-flex>
                <v-layout v-for="(d_cosignatory, index) in d_cosignatories" v-bind:key="d_cosignatory.pubKey" row wrap>
                  <v-flex>
                    <v-layout align-baseline>
                      <v-flex xs1>
                        <v-checkbox
                          hide-details
                          height="1em"
                          off-icon="remove_circle"
                          on-icon="add_circle"
                          disabled
                          v-bind:value="d_cosignatory.isAdd"></v-checkbox>
                      </v-flex>
                      <v-flex>
                        <v-text-field
                          v-bind:label="`${d_cosignatory.isAdd ? 'Add' : 'Remove'}` + ' Cosignatory PublicKey: ' + (index + 1)"
                          v-bind:value="d_cosignatory.pubKey"
                          required
                          :counter="64"
                          disabled
                        ></v-text-field>
                      </v-flex>
                      <v-btn
                        fab
                        small
                        flat
                        v-on:click="d_deleteModification(index)"
                        v-bind:loading="isLoading"><v-icon>delete_forever</v-icon></v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-card-text>
            <v-card-title>
              <v-flex>
                <v-layout align-baseline>
                  <v-flex xs1>
                    <v-checkbox
                      hide-details
                      off-icon="remove_circle"
                      on-icon="add_circle"
                      v-model="d_additionalModificationType"></v-checkbox>
                  </v-flex>
                  <v-flex>
                    <v-text-field
                      v-bind:label="`Modification: ${d_additionalModificationType ? 'Add' : 'Remove'} Cosignatory PublicKey`"
                      v-model="d_additionalModificationPubkey"
                      :counter="64"
                      placeholder="ex). C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0"
                    ></v-text-field>
                  </v-flex>
                  <v-btn
                    fab
                    small
                    flat
                    v-on:click="d_addModification"
                    v-bind:loading="isLoading"><v-icon>add_box</v-icon></v-btn>
                </v-layout>
              </v-flex>
            </v-card-title>
            <v-card-text>
              <v-text-field label="Lock Funds Mosaic" value="nem:xem::10000000"  disabled></v-text-field>
              <v-text-field label="Lock Funds Duration In Blocks" value="480" disabled></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="d_announceHandler"
                :loading="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in d_history" :key="tx.hash">
                  <v-list-tile-avatar>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      Aggregate: <a v-bind:href="tx.agApiStatusUrl" target="_blank">{{ tx.agHash }}</a>
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      LockFunds: <a v-bind:href="tx.lfApiStatusUrl" target="_blank">{{ tx.lfHash }}</a>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 v-if="wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Escrow with Aggregate Transaction</div>
            </v-card-title>
            <v-card-text>
              <v-card>
                <v-card-title>
                  <div class="title">Payment</div>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    label="To Address"
                    v-model="e_recipient1"
                    required
                    placeholder="ex). SAJC2D-OC76EA-TVJF65-KE6U2T-VGIN3F-NQZRJO-EWNZ"
                  ></v-text-field>
                  <v-text-field
                    label="Mosaics (namespace:mosaic::absoluteAmount) (comma separated)"
                    v-model="e_mosaics1"
                    required
                    placeholder="ex). nem:xem::1000000"
                  ></v-text-field>
                  <v-text-field
                    label="Message"
                    v-model="e_message1"
                    :counter="1024"
                    placeholder="ex). escrow payment"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-card-text>
            <v-card-text>
              <v-card>
                <v-card-title>
                  <div class="title">Invoice</div>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    label="Partner PublicKey"
                    v-model="e_pubkey2"
                    required
                    :counter="64"
                    placeholder="ex). CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993"
                  ></v-text-field>
                  <v-text-field
                    label="Mosaics (namespace:mosaic::absoluteAmount) (comma separated)"
                    v-model="e_mosaics2"
                    required
                    placeholder="ex). foo:bar::1"
                  ></v-text-field>
                  <v-text-field
                    label="Message"
                    v-model="e_message2"
                    :counter="1024"
                    placeholder="ex). escrow invoice"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-card-text>
            <v-card-text>
              <v-text-field
                label="Lock Funds Mosaic"
                v-model="e_mosaic3"
                placeholder="ex). nem:xem::10000000"
              ></v-text-field>
              <v-text-field
                label="Lock Funds Duration In Blocks"
                v-model="e_duration3"
                type="number"
                placeholder="ex). 480"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="e_announceHandler"
                :loading="isLoading"
                :disabled="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in e_history" :key="tx.hash">
                  <v-list-tile-avatar>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      Aggregate: <a v-bind:href="tx.agApiStatusUrl" target="_blank">{{ tx.agHash }}</a>
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      LockFunds: <a v-bind:href="tx.lfApiStatusUrl" target="_blank">{{ tx.lfHash }}</a>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 v-if="wallet.address">
          <v-card>
            <v-card-title>
              <div class="title font-weight-bold">Cosignature Transaction</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Aggregate Bonded Transaction Hash"
                v-model="c_hash"
                required
                :counter="64"
                placeholder="ex). 19DFEF268B382252CCAA9FAF282EDDEF846BA57232AAF9875C2209103E51799E"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="c_announceHandler"
                :loading="isLoading"
                :disabled="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in c_history" :key="tx.hash">
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
              <div class="title font-weight-bold">Cosignature Transaction of Multisig</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Multisig Account PublicKey"
                v-model="g_multisigPublicKey"
                required
                :counter="64"
                placeholder="ex). AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26"
              ></v-text-field>
              <v-text-field
                label="Aggregate Bonded Transaction Hash"
                v-model="g_hash"
                required
                :counter="64"
                placeholder="ex). 2EE75F50BCF5384738350AC19A562841450F0B5E2F58B79FF641D1DEAE6B13EB"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue"
                class="white--text"
                @click="g_announceHandler"
                :loading="isLoading"
                :disabled="isLoading">announce</v-btn>
            </v-card-actions>
            <v-card-text>
              <v-list subheader>
                <v-subheader>History</v-subheader>
                <v-list-tile v-for="tx in g_history" :key="tx.hash">
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
    HashType, EncryptedPrivateKey, ModifyMultisigAccountTransaction, MultisigCosignatoryModification,
    MultisigCosignatoryModificationType, PublicAccount, CosignatureTransaction, LockFundsTransaction, Listener
  } from 'nem2-sdk';
  import { throwIfEmpty, flatMap, filter, mergeMap, timeout } from 'rxjs/operators';
  import { LocalDateTime } from 'js-joda';
  import { sha3_512 } from 'js-sha3';
  const generator = require('generate-password');
  const secureRandom = require('secure-random');

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
        passwordRules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 40 || 'Min 40 characters'
        },
        faucetUrl: "",
        wallet: {},
        mosaicAmountViews: [],
        isLoading: false,
        t_recipient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
        t_mosaics: "nem:xem::1000000",
        t_message: "Hello Nem2!",
        t_history: [],
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
        s_name: "sub",
        s_parentNamespace: "foo",
        s_history: [],
        l_proof: "095B4FCD1F88F1785E59",
        l_mosaic: "nem:xem::10000000",
        l_recipient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
        l_duration: 240,
        l_history: [],
        p_proof: "095B4FCD1F88F1785E59",
        p_history: [],
        u_isMultisig: false,
        u_cosignatories: [
          "5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C",
          "3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57"
        ],
        u_addedCosignatory: "C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0",
        u_minApprovalDelta: 2,
        u_minRemovalDelta: 2,
        u_history: [],
        d_multisigPublicKey: "AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26",
        d_cosignatories: [
          {pubKey: "5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C", isAdd: false},
        ],
        d_additionalModificationType: false,
        d_additionalModificationPubkey: "3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57",
        d_minApprovalDelta: -1,
        d_minRemovalDelta: -1,
        d_history: [],
        e_recipient1: "SAJC2D-OC76EA-TVJF65-KE6U2T-VGIN3F-NQZRJO-EWNZ",
        e_mosaics1: "nem:xem::10000000",
        e_message1: "escrow payment",
        e_pubkey2: "CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993",
        e_mosaics2: "foo:bar::1",
        e_message2: "escrow invoice",
        e_mosaic3: "nem:xem::10000000",
        e_duration3: 480,
        e_history: [],
        c_hash: "",
        c_history: [],
        g_multisigPublicKey: "AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26",
        g_hash: "",
        g_history: [],
      }
    },
    methods: {
      regenPrivateKey: function(event) {
        this.isLoading = true
        this.walletPrivateKey = Account.generateNewAccount(NetworkType.MIJIN_TEST).privateKey
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
        this.t_history.push(historyData);
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
      s_announceHandler: function(event) {
        this.isLoading = true
        const namespaceName = this.s_name
        const parentNamespace = this.s_parentNamespace
        const account = this.wallet.open(new Password(this.walletPassword))
        const endpoint = this.endpoint
        let registerNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
          Deadline.create(),
          namespaceName,
          parentNamespace,
          NetworkType.MIJIN_TEST,
        );
        let signedTx = account.sign(registerNamespaceTransaction)
        let txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).subscribe(x => {}, err => console.error)
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.s_history.push(historyData);
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
      u_deleteCosignatory: function(index) {
        this.u_cosignatories.splice(index, 1);
      },
      u_addCosignatory: function(event) {
        this.u_cosignatories.push(this.u_addedCosignatory);
        this.u_addedCosignatory = "";
      },
      u_announceHandler: function(event) {
        this.isLoading = true;
        const account = this.wallet.open(new Password(this.walletPassword));
        const endpoint = this.endpoint;
        const minApprovalDelta = this.u_minApprovalDelta;
        const minRemovalDelta = this.u_minRemovalDelta;
        const cosignatories = this.u_cosignatories;
        let tx = ModifyMultisigAccountTransaction.create(
          Deadline.create(),
          minApprovalDelta,
          minRemovalDelta,
          cosignatories.map((co) => {
            return new MultisigCosignatoryModification(
              MultisigCosignatoryModificationType.Add,
              PublicAccount.createFromPublicKey(co, NetworkType.MIJIN_TEST)
            );
          }),
          NetworkType.MIJIN_TEST
        );
        let signedTx = account.sign(tx);
        let txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).subscribe(x => {}, err => console.error);
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.u_history.push(historyData);
        this.isLoading = false;
      },
      d_deleteModification: function(index) {
        this.d_cosignatories.splice(index, 1);
      },
      d_addModification: function(event) {
        this.d_cosignatories.push({
          pubKey: this.d_additionalModificationPubkey,
          isAdd: this.d_additionalModificationType
        });
        this.d_additionalModificationPubkey = "";
        this.d_additionalModificationType = false;
      },
      d_announceHandler: function (event) {
        this.isLoading = true;
        const multisigPublicaccount = PublicAccount.createFromPublicKey(this.d_multisigPublicKey);
        const account = this.wallet.open(new Password(this.walletPassword));
        const endpoint = this.endpoint;
        const wsEndpoint = endpoint.replace("http", "ws");
        const listener = new Listener(wsEndpoint, WebSocket);
        const minApprovalDelta = this.d_minApprovalDelta;
        const minRemovalDelta = this.d_minRemovalDelta;
        const cosignatories = this.d_cosignatories;
        let modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
          Deadline.create(),
          minApprovalDelta,
          minRemovalDelta,
          cosignatories.map((co) => {
            return new MultisigCosignatoryModification(
              co.isAdd ? MultisigCosignatoryModificationType.Add : MultisigCosignatoryModificationType.Remove,
              PublicAccount.createFromPublicKey(co.pubKey, NetworkType.MIJIN_TEST)
            );
          }),
          NetworkType.MIJIN_TEST
        );
        let aggregateTx = AggregateTransaction.createBonded(
          Deadline.create(23),
          [
            modifyMultisigAccountTx.toAggregate(multisigPublicaccount),
          ],
          NetworkType.MIJIN_TEST
        );
        let signedAggregateTx = account.sign(aggregateTx);
        let lockFundsTx = LockFundsTransaction.create(
          Deadline.create(23),
          XEM.createRelative(10),
          UInt64.fromUint(480),
          signedAggregateTx,
          NetworkType.MIJIN_TEST
        );
        let signedLockFundsTx = account.sign(lockFundsTx);
        let txHttp = new TransactionHttp(endpoint);
        listener.open().then(() => {
          return txHttp.announce(signedLockFundsTx).toPromise();
        }).then(() => {
          return new Promise((resolve, reject) => {
            listener.confirmed(account.address).pipe(
              timeout(90000),
              filter((transaction) => {
                return transaction.transactionInfo !== undefined
                  && transaction.transactionInfo.hash === signedLockFundsTx.hash
              }),
            ).subscribe(
              result => resolve(result),
              error => reject(error)
            );
          });
        }).then(() => {
          return txHttp.announceAggregateBonded(signedAggregateTx).toPromise();
        }).then((result) => {
          console.log(result);
        }).catch((error) => {
          console.error(error);
        }).finally(() => {
          listener.close()
        });
        let historyData = {
          agHash: signedAggregateTx.hash,
          agApiStatusUrl: `${endpoint}/transaction/${signedAggregateTx.hash}/status`,
          lfHash: signedLockFundsTx.hash,
          lfApiStatusUrl: `${endpoint}/transaction/${signedLockFundsTx.hash}/status`,
        };
        this.d_history.push(historyData);
        this.isLoading = false;
      },
      e_announceHandler: function(event) {
        this.isLoading = true
        const endpoint = this.endpoint
        const wsEndpoint = endpoint.replace("http", "ws")
        const listener = new Listener(wsEndpoint, WebSocket)
        const account = this.wallet.open(new Password(this.walletPassword))
        const payRecipient = Address.createFromRawAddress(this.e_recipient1)
        const paySender = account.publicAccount
        const payMessage = this.e_message1
        const invRecipient = account.address
        const invSender = PublicAccount.createFromPublicKey(this.e_pubkey2)
        const invMessage = this.e_message2
        const lockFundsDuration = this.e_duration3
        const payMosaics = this.e_mosaics1.split(",").map((mosaicRawStr) => {
          let nameAndAmount = mosaicRawStr.split("::")
          return new Mosaic(
            new MosaicId(nameAndAmount[0]),
            UInt64.fromUint(nameAndAmount[1])
          )
        })
        const invMosaics = this.e_mosaics2.split(",").map((mosaicRawStr) => {
          let nameAndAmount = mosaicRawStr.split("::")
          return new Mosaic(
            new MosaicId(nameAndAmount[0]),
            UInt64.fromUint(nameAndAmount[1])
          )
        })
        const lockFundsMosaic = (() => {
          let nameAndAmount = this.e_mosaic3.split("::")
          return new Mosaic(
            new MosaicId(nameAndAmount[0]),
            UInt64.fromUint(nameAndAmount[1])
          )
        })()
        let paymentTx = TransferTransaction.create(
          Deadline.create(23),
          payRecipient,
          payMosaics,
          PlainMessage.create(payMessage),
          NetworkType.MIJIN_TEST
        )
        let invoiceTx = TransferTransaction.create(
          Deadline.create(23),
          invRecipient,
          invMosaics,
          PlainMessage.create(invMessage),
          NetworkType.MIJIN_TEST
        )
        let aggregateTx = AggregateTransaction.createBonded(
          Deadline.create(23),
          [
            paymentTx.toAggregate(paySender),
            invoiceTx.toAggregate(invSender),
          ],
          NetworkType.MIJIN_TEST
        )
        let signedAggregateTx = account.sign(aggregateTx)
        let lockFundsTx = LockFundsTransaction.create(
          Deadline.create(23),
          lockFundsMosaic,
          UInt64.fromUint(lockFundsDuration),
          signedAggregateTx,
          NetworkType.MIJIN_TEST
        )
        let signedLockFundsTx = account.sign(lockFundsTx)
        let txHttp = new TransactionHttp(endpoint);
        listener.open().then(() => {
          return txHttp.announce(signedLockFundsTx).toPromise()
        }).then(() => {
          return new Promise((resolve, reject) => {
            listener.confirmed(account.address).pipe(
              timeout(90000),
              filter((transaction) => {
                return transaction.transactionInfo !== undefined
                  && transaction.transactionInfo.hash === signedLockFundsTx.hash
              }),
            ).subscribe(
              result => resolve(result),
              error => reject(error)
            )
          })
        }).then(() => {
          return txHttp.announceAggregateBonded(signedAggregateTx).toPromise()
        }).then((result) => {
          console.log(result)
        }).catch((error) => {
          console.error(error)
        }).finally(() => {
          listener.close()
        })
        let historyData = {
          agHash: signedAggregateTx.hash,
          agApiStatusUrl: `${endpoint}/transaction/${signedAggregateTx.hash}/status`,
          lfHash: signedLockFundsTx.hash,
          lfApiStatusUrl: `${endpoint}/transaction/${signedLockFundsTx.hash}/status`,
        };
        this.e_history.push(historyData);
        this.isLoading = false
      },
      c_announceHandler: function(event) {
        this.isLoading = true
        const account = this.wallet.open(new Password(this.walletPassword))
        const hash = this.c_hash
        const endpoint = this.endpoint
        const txHttp = new TransactionHttp(endpoint)
        const accountHttp = new AccountHttp(endpoint)
        accountHttp.aggregateBondedTransactions(account.publicAccount).pipe(
            mergeMap((_) => _),
            filter((_) => !_.signedByAccount(account.publicAccount)),
            throwIfEmpty(() => new Error('can not find that transaction hash')),
        ).toPromise().then((aggregateTx) => {
          let cosigTx = CosignatureTransaction.create(aggregateTx)
          let signedTx = account.signCosignatureTransaction(cosigTx)
          return txHttp.announceAggregateBondedCosignature(signedTx).toPromise()
        }).then((result) => {
          console.log(result)
        }).catch((error) => {
          console.error(error)
        }).finally(() => {

        })
        let historyData = {
          hash: hash,
          apiStatusUrl: `${endpoint}/transaction/${hash}/status`
        };
        this.c_history.push(historyData);
        this.isLoading = false
      },
      g_announceHandler: function(event) {
        this.isLoading = true
        const multisigPublicaccount = PublicAccount.createFromPublicKey(this.g_multisigPublicKey);
        const account = this.wallet.open(new Password(this.walletPassword))
        const hash = this.g_hash
        const endpoint = this.endpoint
        const txHttp = new TransactionHttp(endpoint)
        const accountHttp = new AccountHttp(endpoint)
        accountHttp.aggregateBondedTransactions(multisigPublicaccount).pipe(
          mergeMap((_) => _),
          filter((_) => !_.signedByAccount(account.publicAccount)),
          throwIfEmpty(() => new Error('can not find that transaction hash')),
        ).toPromise().then((aggregateTx) => {
          let cosigTx = CosignatureTransaction.create(aggregateTx)
          let signedTx = account.signCosignatureTransaction(cosigTx)
          return txHttp.announceAggregateBondedCosignature(signedTx).toPromise()
        }).then((result) => {
          console.log(result)
        }).catch((error) => {
          console.error(error)
        }).finally(() => {

        })
        let historyData = {
          hash: hash,
          apiStatusUrl: `${endpoint}/transaction/${hash}/status`
        };
        this.g_history.push(historyData);
        this.isLoading = false
      },
    },
    watch: {
      wallet: {
        handler: function(newVal, oldVal) {
          if (this.wallet.address) {
            this.mosaicAmountViews = [];
            const endpoint = this.endpoint;
            const address = this.wallet.address;
            const accountHttp = new AccountHttp(endpoint);
            const mosaicHttp = new MosaicHttp(endpoint);
            const nameSpaceHttp = new NamespaceHttp(endpoint);
            const mosaicService = new MosaicService(accountHttp, mosaicHttp, nameSpaceHttp);

            // reload mosaics
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

            // proof randomize of secret proof / lock tx
            const random = secureRandom(10)
            this.l_proof = random.map(x => x.toString(16)).join("").toUpperCase()
            this.p_proof = this.l_proof

            // for convert to multisig tx
            accountHttp.getMultisigAccountInfo(address).subscribe(
                result => { this.u_isMultisig = result.isMultisig() },
                error => { this.u_isMultisig = false }
            )

            // fauceUrl
            if (this.endpoint.includes("44uk")) {
              this.faucetUrl = `http://test-nem2-faucet.44uk.net/?address=${this.wallet.address.plain()}`;
            } else if (this.endpoint.includes("daoka")) {
              this.faucetUrl = `http://catapult-test.daoka.ml:4567/?address=${this.wallet.address.plain()}`;
            } else if (this.endpoint.includes("soralis")) {
              this.faucetUrl = `http://catapult-test.soralis.org:4567/?address=${this.wallet.address.plain()}`;
            } else if (this.endpoint.includes("48gh23s")) {
              this.faucetUrl = `https://faucet48gh23s.azurewebsites.net/?address=${this.wallet.address.plain()}`;
            }

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
