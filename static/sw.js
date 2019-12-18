importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/1e38c854f4bb4e0d1775.js",
    "revision": "8c55cc6223df0f652dead6d6172c07c1"
  },
  {
    "url": "/_nuxt/25957238dec2f7ec2013.js",
    "revision": "1512006d34859d2f55cd873115131523"
  },
  {
    "url": "/_nuxt/62a72eff85b14da016ea.js",
    "revision": "92e0c08435d8c0efd8dd01405795ba51"
  },
  {
    "url": "/_nuxt/877e3d2018c400c56f24.js",
    "revision": "2003079f42488a20cefb2c947b567868"
  },
  {
    "url": "/_nuxt/8df02823d028fce439ad.js",
    "revision": "8c05bda485bd0bd8e4a8e793b8a9001b"
  },
  {
    "url": "/_nuxt/a0d623cf3342b8cd8606.js",
    "revision": "b9e17b114a8a151489ab45cedfd6f6b7"
  },
  {
    "url": "/_nuxt/bda6fe36848f17cb4cba.js",
    "revision": "4aef9da20c4cb120e95d3a6f4b792669"
  },
  {
    "url": "/_nuxt/c444ebfbd0f477a54fb1.js",
    "revision": "9d25a1c356ea8de0f2a39c048048ca25"
  },
  {
    "url": "/_nuxt/ddb736c4c5da13bb93c5.js",
    "revision": "3ac8bf0ef45bb64b9a8e945286a37fc5"
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
