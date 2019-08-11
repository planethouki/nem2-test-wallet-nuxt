importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/004791488a88c83082c2.js",
    "revision": "d9362b648710b60c1bdfcedb427a013d"
  },
  {
    "url": "/_nuxt/0bd698fe99a021486d6b.js",
    "revision": "7e8e6220fa239e1058d359a477b86261"
  },
  {
    "url": "/_nuxt/135a26c1ce0b9a157170.js",
    "revision": "ffecb6123c1c1562ce23394d5e09a08c"
  },
  {
    "url": "/_nuxt/170850d082620e6278a6.js",
    "revision": "5a217418c43bd34dd3791f3ea88187da"
  },
  {
    "url": "/_nuxt/58c0523d00fb4f5e8135.js",
    "revision": "ba8ead0011ffd5e5a8b9622091950655"
  },
  {
    "url": "/_nuxt/68dbeb90dc4775f7feb3.js",
    "revision": "bddac32cc72c81f400048a6694bbca70"
  },
  {
    "url": "/_nuxt/79b71dcddfd6f3754fc6.js",
    "revision": "f9f4af7131359dcf3bf85200b30dee5b"
  },
  {
    "url": "/_nuxt/83c08d67639f152a92b0.js",
    "revision": "bc76a8a8467aa91eed6552fb4d1aac4c"
  },
  {
    "url": "/_nuxt/c7d800ed0d6a8d54c1dc.js",
    "revision": "5ba05cc5b5719d6ecddf2b54c5a40f88"
  },
  {
    "url": "/_nuxt/e70d31d1bb23ae5fa3c0.js",
    "revision": "2251660eb588c9ce3710b936d61b0ebf"
  },
  {
    "url": "/_nuxt/ef069881ec02e65ba0a3.js",
    "revision": "bd56573afe4ad1decbc64f8a30c041d3"
  },
  {
    "url": "/_nuxt/f8b32fec048cf713050c.js",
    "revision": "af5598dae87d5446094526af6f0164a4"
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
