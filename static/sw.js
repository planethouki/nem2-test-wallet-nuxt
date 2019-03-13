importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0a86b68ba6c142703c66.js",
    "revision": "4a77dc11a491e447bf7787481639051f"
  },
  {
    "url": "/_nuxt/0dfc6146582be668807f.js",
    "revision": "faab2a92f343877d23852d65d74dd55e"
  },
  {
    "url": "/_nuxt/0f9aa226c51815687558.js",
    "revision": "95157a36613a031e87d4e1058f5753df"
  },
  {
    "url": "/_nuxt/2d6f480b89ea437030d8.js",
    "revision": "3ee8be4e1a996eb4d370e78ad7a77ea1"
  },
  {
    "url": "/_nuxt/38325e334ac21e7ef6c9.js",
    "revision": "a87512fcab4706976edfa784efdc6236"
  },
  {
    "url": "/_nuxt/db57a51c4f838411602b.js",
    "revision": "7aa4cf7ade0dc4715e13e68f811dc185"
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
