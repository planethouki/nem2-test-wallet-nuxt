importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/1edf615260a3f068a402.js",
    "revision": "8801b2a0d421e123d5988c895a4e6c7c"
  },
  {
    "url": "/_nuxt/5567222343dfccbb88ee.js",
    "revision": "73cbdf4c1064501d62424ba8397e219f"
  },
  {
    "url": "/_nuxt/69805e477e38bd43fbe5.js",
    "revision": "b2b4a89dcfb89aa0cc07cd99c41263b3"
  },
  {
    "url": "/_nuxt/973c9b393ff0f0c013cb.js",
    "revision": "fd3d890deb9d97cda2dcb14fb0288f02"
  },
  {
    "url": "/_nuxt/d8a97d1c5f111b0396b5.js",
    "revision": "2865e3d77f715df5f26d6bb73eed27fa"
  },
  {
    "url": "/_nuxt/f12b949adada0ddf5ed9.js",
    "revision": "efbf5fbd058f68b95f9a12a104742b38"
  }
], {
  "cacheId": "nem2-unsafe-wallet-nuxt",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
