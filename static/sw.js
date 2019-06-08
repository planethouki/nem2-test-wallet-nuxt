importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/14100a4e39cbb8490cd1.js",
    "revision": "34104d6a8e68938d26f7cce91ba31f03"
  },
  {
    "url": "/_nuxt/25ff55f4ba6c80a78336.js",
    "revision": "7c6d9422ea91ed8f0cfe7ffdbc2818b2"
  },
  {
    "url": "/_nuxt/2cab27fc8a6c54c31d11.js",
    "revision": "d371cb04b5d34d386408aedb2cd63db1"
  },
  {
    "url": "/_nuxt/2f479ea64b241f15ae80.js",
    "revision": "b1ee469c0fd759df8f810e549b3bf291"
  },
  {
    "url": "/_nuxt/44904b07d2dd2fb6ef8a.js",
    "revision": "6d45aac59e50f9f97d833cbf2f9b517c"
  },
  {
    "url": "/_nuxt/816802b58a84de80c50f.js",
    "revision": "94e1170c86a20869fba0bc665eeb0dc9"
  },
  {
    "url": "/_nuxt/9e94dd95a66619a59e6e.js",
    "revision": "ff1b67d3580736d40760281c02a22edf"
  },
  {
    "url": "/_nuxt/d1101006950ed43c91b6.js",
    "revision": "a480002482ea11493473965ec9d74123"
  },
  {
    "url": "/_nuxt/ec964828eb292b0499f8.js",
    "revision": "d3ee79511cabf91fc85a1d7be068da0d"
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
