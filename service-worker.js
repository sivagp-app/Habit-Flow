// Service Worker for Habit Flow - PHASE 1: Versioning & Cache Management

// VERSION CONTROL - Update this with each release
const VERSION = '5.2.1';
const CACHE_NAME = `habit-flow-v${VERSION}`;

const urlsToCache = [
  '/Habit-Flow/',
  '/Habit-Flow/index.html',
  '/Habit-Flow/styles.css',
  '/Habit-Flow/app.js',
  '/Habit-Flow/manifest.json',
  'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log(`[SW ${VERSION}] Installing...`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`[SW ${VERSION}] Caching app shell`);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log(`[SW ${VERSION}] Skip waiting`);
        return self.skipWaiting(); // Activate immediately
      })
      .catch(error => {
        console.error(`[SW ${VERSION}] Install failed:`, error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log(`[SW ${VERSION}] Activating...`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => {
            // Delete old habit-flow caches
            return name.startsWith('habit-flow-') && name !== CACHE_NAME;
          })
          .map(name => {
            console.log(`[SW ${VERSION}] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log(`[SW ${VERSION}] Claiming clients`);
      return self.clients.claim(); // Take control immediately
    }).catch(error => {
      console.error(`[SW ${VERSION}] Activation failed:`, error);
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          // Cache the fetched response
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            })
            .catch(error => {
              console.error(`[SW ${VERSION}] Cache put failed:`, error);
            });
          
          return response;
        }).catch(error => {
          console.error(`[SW ${VERSION}] Fetch failed:`, error);
          // Could return offline page here
          return new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Listen for messages from app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log(`[SW ${VERSION}] Received SKIP_WAITING message`);
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    console.log(`[SW ${VERSION}] Sending version info`);
    event.ports[0].postMessage({ version: VERSION });
  }
});

console.log(`[SW ${VERSION}] Service Worker loaded`);
