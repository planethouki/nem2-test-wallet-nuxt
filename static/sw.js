importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0e577ee3ee41eab312f8.js",
    "revision": "402c4c498183756cd6215680b96d1c10"
  },
  {
    "url": "/_nuxt/1acdb263991b4b8fcedd.js",
    "revision": "b7a236a9dec52ae8d2b849a5a95ef433"
  },
  {
    "url": "/_nuxt/7368c2bb26bd3b760c53.js",
    "revision": "5c6291d1d1f1f24751f8d4fde085096e"
  },
  {
    "url": "/_nuxt/88b324919d1bd4c49f81.js",
    "revision": "41238b100fff313d5506c067163714d6"
  },
  {
    "url": "/_nuxt/8f9aa7f49272a62e529e.js",
    "revision": "10909e085959326c69f890825454f934"
  },
  {
    "url": "/_nuxt/a2239fd6224b68cfcd48.js",
    "revision": "29ee29b83108ac95b6fd4d171a9d7fc8"
  },
  {
    "url": "/_nuxt/c5764331d43bd3efeafc.js",
    "revision": "3a6ec442755b9a3529c8694185818d99"
  },
  {
    "url": "/_nuxt/d3aea8791b67578051af.js",
    "revision": "51cdc1240d37a6088d90e67de97e6aaa"
  },
  {
    "url": "/_nuxt/dbce6b53894f6b3a46d6.js",
    "revision": "0f37bfa64deb8d29bfdae2f785045e7a"
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
