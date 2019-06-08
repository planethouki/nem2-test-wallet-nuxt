importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/06d395d64013de86185e.js",
    "revision": "5448e12d716310af4ef3644e5102d983"
  },
  {
    "url": "/_nuxt/2750ac18a23466b28f24.js",
    "revision": "fe4329f22a4c859f0869638ba5bbc57e"
  },
  {
    "url": "/_nuxt/2b9add63e7594dc352ba.js",
    "revision": "cd8daadae7a85fcb9ca99ee1c5ee253f"
  },
  {
    "url": "/_nuxt/568451a2b8edcd73e954.js",
    "revision": "8e75ecdc6d837886cdec357fe3218843"
  },
  {
    "url": "/_nuxt/6c3f8d16fd789068ba91.js",
    "revision": "ef64485e337bb977fae71b2125738a5c"
  },
  {
    "url": "/_nuxt/a61594f38652ba5be8ca.js",
    "revision": "b30cf1097615096d78891b394cbe8bf8"
  },
  {
    "url": "/_nuxt/a6ad6a157c80fe5ea1dc.js",
    "revision": "56476ba537630aabe3220a07b9f7dcfc"
  },
  {
    "url": "/_nuxt/c6f252cf9d90dd971e2e.js",
    "revision": "2caaf9966c5915c4b4526cd075fe4cf8"
  },
  {
    "url": "/_nuxt/d8a9fc313dd9f5b819f0.js",
    "revision": "f9205b4441e3cedb7410d77fef9898a7"
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
