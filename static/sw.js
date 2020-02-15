importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/328fce4df29c8779fa54.js",
    "revision": "9532759be0d9068e47d556a10cf0a35e"
  },
  {
    "url": "/_nuxt/741fd2d9b6d5bad4fd4e.js",
    "revision": "3a1f04248930bca516f7b3d01513c5fc"
  },
  {
    "url": "/_nuxt/749f23c553c0453251aa.js",
    "revision": "8ede11ed1279dada91669b09490c955f"
  },
  {
    "url": "/_nuxt/83c385163aa2baaf45c0.js",
    "revision": "b4ffa3c9e57093a908f8712d2ac72e7e"
  },
  {
    "url": "/_nuxt/858868aabf7794ea1a8a.js",
    "revision": "8a5caaef22b970b70f921cc356a73689"
  },
  {
    "url": "/_nuxt/85f1f209e5ff19fa49e8.js",
    "revision": "75c4802eaeb3dbf21648b0c7958b6753"
  },
  {
    "url": "/_nuxt/8a3506561e204dcea896.js",
    "revision": "d7cf4097844252906ee1e7a516db3778"
  },
  {
    "url": "/_nuxt/9a31671bb53826bc1c2e.js",
    "revision": "908b97023aed98aac58d8f65fd087b34"
  },
  {
    "url": "/_nuxt/d43ceb75ba66f97ac622.js",
    "revision": "204425e1d3c310a120d6deaf8e560c01"
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
