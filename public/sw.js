// Service Worker for JEE OS
const CACHE_NAME = "jee-os-cache-v3";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
  self.clients.claim();
});

// Let all network requests pass directly through to Next.js
self.addEventListener("fetch", (event) => {
  // Do not intercept - let browser handle network directly to avoid Promise rejection errors
  return;
});
