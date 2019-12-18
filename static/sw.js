importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/2ba06ebc4ff8511c8840.js",
    "revision": "50708ae006b679e8883242d6e4134dac"
  },
  {
    "url": "/_nuxt/47b0f9a6ec053baf7b3b.js",
    "revision": "2a93522e2d6ea72d8d2b9b9054648bcf"
  },
  {
    "url": "/_nuxt/7fb4bb670b86ace7e073.js",
    "revision": "36890a96c894bd41788d1072d7aa7278"
  },
  {
    "url": "/_nuxt/a120ddd3f577c0a6153b.js",
    "revision": "d5e1df17476c107b7250878986c0bbaa"
  },
  {
    "url": "/_nuxt/b86e4175e8359078026f.js",
    "revision": "58cdd24cf31a5dea18da1222addfe74d"
  },
  {
    "url": "/_nuxt/cdb5af471d74466e9ba6.js",
    "revision": "e1fa2cf5e493da1ece382cb7926a227b"
  },
  {
    "url": "/_nuxt/eb23462648857bc5aa79.js",
    "revision": "743bc7e6839c996b066de7aadb112a10"
  },
  {
    "url": "/_nuxt/fbb13b1fe941b747930d.js",
    "revision": "36ac7715747db9c9efbd726b51119ac2"
  },
  {
    "url": "/_nuxt/fd58e014f27fa3db901d.js",
    "revision": "5f07e408302eea8c8b723ae23fdb72ef"
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
