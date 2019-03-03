importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/1006e98c531567569dea.js",
    "revision": "9c5b7f47e5fbcc6cb8a0192491eef85d"
  },
  {
    "url": "/_nuxt/147a4691ee33665d4c85.js",
    "revision": "6011cb4179d2d6226c177f598e867f75"
  },
  {
    "url": "/_nuxt/408b6923883ed53de5f1.js",
    "revision": "36bb426016ef91497f443b7042a3eb72"
  },
  {
    "url": "/_nuxt/66cf98b0dbf8f1b29de7.js",
    "revision": "240e70b81da019a4e8a2d8ce973d33dc"
  },
  {
    "url": "/_nuxt/738077079ae834e7860c.js",
    "revision": "9b2163c4d2cf1c7450d2bc481d5e087f"
  },
  {
    "url": "/_nuxt/892e387b36ca9797492e.js",
    "revision": "e89d60059a9d075abde0e53dfb85a5b2"
  }
], {
  "cacheId": "myNuxt",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
