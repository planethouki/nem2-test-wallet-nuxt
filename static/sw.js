importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/3632d154bd5e653c22c6.js",
    "revision": "e63c8d002f8b451aaf1f0dd2ded067d5"
  },
  {
    "url": "/_nuxt/72092a60a2bf7f629b2a.js",
    "revision": "48f0e93fea28e6eb9ee0c585174da7bb"
  },
  {
    "url": "/_nuxt/897b0380aa1d60f23c9c.js",
    "revision": "6207682d9642512d1ae9ea5287a1922f"
  },
  {
    "url": "/_nuxt/a31ca7625d35d8f6990d.js",
    "revision": "36728b27bbd1116cd6d97475fe9f2beb"
  },
  {
    "url": "/_nuxt/a61fcb42330d69a5da71.js",
    "revision": "08bfdda31253078565c5dd6d09a99b14"
  },
  {
    "url": "/_nuxt/ecbbd660738a37a85f01.js",
    "revision": "bad160956d75ad3b4a44337ae197c2c6"
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
