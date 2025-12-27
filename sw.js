const cacheName = 'studyflow-v2';
const assets = [
  '/',
  '/index.html',
  '/test.html',
  '/syllabus.html',
  '/mistakes.html',
  '/assets/icon.png,
  '/css/style.css',
  '/css/syllabus.css',
  '/css/test.css',
  '/css/mistakes.css',
  '/js/test-data.js',
  '/js/syllabus.js',
  '/js/dashboard.js',
  '/js/test-logic.js',
  '/js/mistake-logic.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap'
];

// Install Service Worker
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Warrior Cache Initialized');
      return cache.addAll(assets);
    })
  );
});

// Activate & Cleanup Old Caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch files from cache if offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );

});

