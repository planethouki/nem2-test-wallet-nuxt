importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/098dd7a976a9d641dd1a.js",
    "revision": "58f84f9c8e6f294c2938a7b1530d98ee"
  },
  {
    "url": "/_nuxt/1c549b8a6e06e70973a9.js",
    "revision": "6477c9d7850755ad8eed6241e743e8d4"
  },
  {
    "url": "/_nuxt/2475cde2564d623f7c65.js",
    "revision": "95f179274cd1d0a090e755b98b379b62"
  },
  {
    "url": "/_nuxt/4fac1b2550b690d05df6.js",
    "revision": "c15235a3f163ab1c00e31d79a43b7fe0"
  },
  {
    "url": "/_nuxt/88c9534b509c5378fab1.js",
    "revision": "b3927d9af72b098f020c1d581f2ec7eb"
  },
  {
    "url": "/_nuxt/a357ea6022df0625bea5.js",
    "revision": "4cdb2beeaf0be042e5b3ae1b30865db4"
  },
  {
    "url": "/_nuxt/cdbea674bea12e323c48.js",
    "revision": "93ec4341e8a5f0b8608edc224efe7548"
  },
  {
    "url": "/_nuxt/da4f07498af77b4be3f3.js",
    "revision": "7ae344951e31118c04bcccda79095f8d"
  },
  {
    "url": "/_nuxt/f3dc38ae8b103a0b65d2.js",
    "revision": "d64a747e3df55ce5721f91f02bf434d6"
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
