importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/57f607efad547996c8e9.js",
    "revision": "c15a3f4562a969a8e9ffff77867f61ba"
  },
  {
    "url": "/_nuxt/8472124f7c520149321e.js",
    "revision": "553e549a7b577a28e50c7090f0ec9022"
  },
  {
    "url": "/_nuxt/ac634177e69118513e98.js",
    "revision": "a8c9b16620ca8187108651a3baff5470"
  },
  {
    "url": "/_nuxt/b3590af9f6f66c6896e3.js",
    "revision": "fe09d4f8e0600675348bf825392d487f"
  },
  {
    "url": "/_nuxt/b6c69ecab11a998005aa.js",
    "revision": "424da40c5d3871d7239df76af8e55d7a"
  },
  {
    "url": "/_nuxt/b759b02438d0615cba50.js",
    "revision": "ed1e350663b47c5acc8ee9cda27f502e"
  },
  {
    "url": "/_nuxt/c92501c9ce62fec8fc00.js",
    "revision": "e7f42b10c336681b6ed0d4dd07b1279d"
  },
  {
    "url": "/_nuxt/da369eb90ad36df5f9d1.js",
    "revision": "9240c8e4c0b69fc65670d2575b13e712"
  },
  {
    "url": "/_nuxt/e24b8267d20444c4ef1e.js",
    "revision": "0ac38502fb0136be3b4d8ef22e8a39e3"
  }
], {
  "cacheId": "nem2-test-wallet-nuxt",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
