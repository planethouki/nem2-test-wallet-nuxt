importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/21f345e975648c8c97f0.js",
    "revision": "ad3f3b3082e6da682048f480d2f38b8e"
  },
  {
    "url": "/_nuxt/5d1c0607d74efd1025ea.js",
    "revision": "8fdcdd826fa097aeaabd7f1e79c3ddeb"
  },
  {
    "url": "/_nuxt/af0130c128766eb2e3bf.js",
    "revision": "14d92c8b12b673e3d9772f9f3d88fcf1"
  },
  {
    "url": "/_nuxt/b1fe72ea155dd3b17197.js",
    "revision": "5c8819509716a22722f77adc32870065"
  },
  {
    "url": "/_nuxt/bd49d2dddd5aa1dcd42c.js",
    "revision": "ff83c75c08a3f412c529c75cb541d79d"
  },
  {
    "url": "/_nuxt/f20638c17e71437d6996.js",
    "revision": "fd6e903301dda136af622582f3580371"
  },
  {
    "url": "/_nuxt/f49102f667a2610cea10.js",
    "revision": "9936df9ac4d98a097cb9f254d42e315c"
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
