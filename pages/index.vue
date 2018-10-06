<template>
  <section class="container">
    <div>
      <h1 class="title">
        unsafe wallet
      </h1>
      <h2 class="subtitle">
        do NOT use on main net
      </h2>
      <div class="links">
        <router-link to="/wallet" class="button--green">Wallet</router-link>
        <a
          href="https://github.com/planethouki/nem2-unsafe-wallet-nuxt"
          target="_blank"
          class="button--grey">GitHub</a>
      </div>
    </div>
  </section>
</template>

<script>
  import HeadMenu from '~/components/HeadMenu.vue'

export default {
  layout: "baseline",
  source: "https://www.google.co.jp",
  asyncData (context) {
    return {
      name: 'unsafe wallet',
      description: "Do NOT use on main net",
    }
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
