importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/2212f801ae69854fc130.js",
    "revision": "8d22ceb09fb2abe6a778b8d4c15d1631"
  },
  {
    "url": "/_nuxt/293ccaffa8ca5dbed072.js",
    "revision": "621a104cd3ecbe2b480c78cf52be72b7"
  },
  {
    "url": "/_nuxt/49ea71bf73f6978fab35.js",
    "revision": "a564f9da9a32df9877d39c9841f6a19b"
  },
  {
    "url": "/_nuxt/7cfe3b7474f32dc3635c.js",
    "revision": "41ea70acc2ea39de8f26326636ef8edd"
  },
  {
    "url": "/_nuxt/9b92bff473908b1e7873.js",
    "revision": "930409fcf15473fb3592a5289d8431da"
  },
  {
    "url": "/_nuxt/b6a9a1ded12e7d24a8bc.js",
    "revision": "1f7302ea2879a1094b48b8345df0a2f6"
  },
  {
    "url": "/_nuxt/bb35625bb8c45472801e.js",
    "revision": "421d22b68c198f115a4a6a103568bb91"
  },
  {
    "url": "/_nuxt/d3d739f5357b53c29df7.js",
    "revision": "383ed521aaf51fb1806be6609627fba0"
  },
  {
    "url": "/_nuxt/d7779878c04d3d77f16e.js",
    "revision": "7cb403b5804dea8201fec4481bbbdeb5"
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
