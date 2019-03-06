importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0b1b54bbf9a567c0bab1.js",
    "revision": "f8fd83f0f48287aeaf0e8a78aafd61de"
  },
  {
    "url": "/_nuxt/0d610d7e4d4975c912d5.js",
    "revision": "df711046708132c179a34a93cb7d9d1a"
  },
  {
    "url": "/_nuxt/4cc0685d21ba181f0b57.js",
    "revision": "f8b7b4c6ea914777c69dc2febc65c581"
  },
  {
    "url": "/_nuxt/5483a5dc4a4e768848d2.js",
    "revision": "790457b6c145d921264dd0ced806f28b"
  },
  {
    "url": "/_nuxt/8f9f900563269f39149a.js",
    "revision": "8522bb972df0fe99b0ea6022537c04eb"
  },
  {
    "url": "/_nuxt/b9d861a412564f1bb5cf.js",
    "revision": "01973891df573a3b010a8d0cf1fb098e"
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
