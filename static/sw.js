importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/031b70fcaaf3dd5168e6.js",
    "revision": "959842278576cdf5f18fe4f509b4948d"
  },
  {
    "url": "/_nuxt/15b89bfbd855e272eb8b.js",
    "revision": "27178bd2af15a79aa8f9dc38045ad235"
  },
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
