<template>
  <section class="container">
    <div>
      <head-menu/>
      <h1 class="title">
        {{ name }}
      </h1>
      <h2 class="subtitle">
        {{ description }}
      </h2>
    </div>
    <div>
      <span>Accounts: </span>
      <span>{{ numAccounts }}</span>
    </div>
    <div>
      <span>Blocks: </span>
      <span>{{ numBlocks }}</span>
    </div>
    <div>
      <span>Transactions: </span>
      <span>{{ numTransactions }}</span>
    </div>
  </section>
</template>

<script>
  import HeadMenu from '~/components/HeadMenu.vue'
  // import nem2Sdk from 'nem2-sdk'

  const nem2Sdk = require("nem2-sdk");
  const bc = new nem2Sdk.BlockchainHttp("http://catapult48gh23s.xyz:3000");

  export default {
    asyncData (context) {
      return bc.getDiagnosticStorage().toPromise().then((result) => {
        return {
          name: 'statistics',
          description: '',
          numAccounts: result.numAccounts,
          numBlocks: result.numBlocks,
          numTransactions: result.numTransactions
        }
      })
    },
    head () {
      return {
        title: this.name,
        meta: [
          { hid: 'description', name: 'description', content: 'My custom description' }
        ]
      }
    },
    components: {
      HeadMenu
    },
  }
</script>

