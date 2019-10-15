importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0f99a5538f132b6bd3be.js",
    "revision": "d7a9c0ad27fec6d6de210fc9e9e59e50"
  },
  {
    "url": "/_nuxt/2052044cc970bd19d414.js",
    "revision": "0ed553700b415817d53eef53f18be155"
  },
  {
    "url": "/_nuxt/3602dc417f465dcbbf68.js",
    "revision": "c8d2cc463d53af8c8358835378e464f1"
  },
  {
    "url": "/_nuxt/5b97872a72f0318d08bf.js",
    "revision": "7a101234a695ceeeb185ccdb2689874b"
  },
  {
    "url": "/_nuxt/6ef69005e3879ee1c27a.js",
    "revision": "ab115373769a59cc8977bda8c9bf777e"
  },
  {
    "url": "/_nuxt/9587879b3330fb779184.js",
    "revision": "5b55f919bf831b4a7df1517db76c1ec1"
  },
  {
    "url": "/_nuxt/a63b8c19b4c987d8b3a5.js",
    "revision": "e8b37973f74c13fb0ac57a048a5153d3"
  },
  {
    "url": "/_nuxt/d344a9f49dc18114c9c3.js",
    "revision": "a6d61650080ab7b3c5ca91752d70dd7d"
  },
  {
    "url": "/_nuxt/da7dc3afac9b9df187f4.js",
    "revision": "5cb59e087996e20bd3f61dfb58276087"
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
