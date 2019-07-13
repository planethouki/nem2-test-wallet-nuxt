importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/1ef20731f7f0bfb58c1a.js",
    "revision": "fd61a794a1e4bb17dc525ffa43a151fe"
  },
  {
    "url": "/_nuxt/4bc75e1efbc856458ab2.js",
    "revision": "1d32dd857f835417edc937a8502a6aab"
  },
  {
    "url": "/_nuxt/55902bce000333cb4769.js",
    "revision": "63e70232024d15297d3a6b0215141295"
  },
  {
    "url": "/_nuxt/579c1164be7b51ff0e34.js",
    "revision": "33fac78d94faf270db17c039c6a11ba8"
  },
  {
    "url": "/_nuxt/5cc2eed440f63820d588.js",
    "revision": "5b1ad885710ca2f565c9de54715dbb81"
  },
  {
    "url": "/_nuxt/69a0abd2562536699622.js",
    "revision": "882b342657d7b52cdfa69c71a593f6ea"
  },
  {
    "url": "/_nuxt/857d6e751a62744a1a8f.js",
    "revision": "1f0babd65066d3f5a3721e7640266c8e"
  },
  {
    "url": "/_nuxt/8a3fcc0749f9ec3c183a.js",
    "revision": "3ba367f2e5b5b5be75af198137b50acf"
  },
  {
    "url": "/_nuxt/92db2c5d492e536a2b30.js",
    "revision": "02794ec2fb12800de9ed2cb8302568b4"
  },
  {
    "url": "/_nuxt/963c492001a635fa2dd3.js",
    "revision": "ac8d262f1575428ae4932d3363d2531f"
  },
  {
    "url": "/_nuxt/9f9a7b46093ac99c7fad.js",
    "revision": "0e82eda14f83cbd698505f7c57ec6a61"
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
