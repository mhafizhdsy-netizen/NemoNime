// Enhanced Service Worker with Background Push Notifications
const CACHE_NAME = 'neonime-v2';
const RUNTIME_CACHE = 'neonime-runtime-v1';

// Cache configuration
const CACHE_CONFIG = {
  runtime: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 100
  }
};

// Background sync configuration
const BACKGROUND_SYNC_CONFIG = {
  checkInterval: 30 * 60 * 1000, // 30 minutes
  maxRetries: 3,
  retryDelay: 5 * 60 * 1000 // 5 minutes
};

// Episode detection state
let episodeDetectionState = {
  isRunning: false,
  lastCheck: null,
  subscribedAnime: [],
  episodeCache: new Map(),
  scheduledNotifications: new Map(),
  syncRegistration: null
};

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing enhanced background service...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching core files');
        return cache.addAll([
          '/',
          '/index.html',
          '/logo.png',
          '/favicon.png',
          '/manifest.json'
        ]);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating enhanced background service...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Background sync for episode detection
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'episode-detection') {
    event.waitUntil(performBackgroundEpisodeCheck());
  } else if (event.tag === 'scheduled-notifications') {
    event.waitUntil(checkScheduledNotifications());
  }
});

// Push event handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received');
  
  let notificationData = {
    title: 'NemoNime',
    body: 'New episode available!',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'nemonime-notification',
    requireInteraction: false,
    silent: false,
    data: { url: '/' }
  };

  // Parse push data
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Service Worker: Error parsing push data', error);
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Message handler for client communication
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received from client', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'START_EPISODE_DETECTION':
      startBackgroundEpisodeDetection(data);
      break;
    case 'STOP_EPISODE_DETECTION':
      stopBackgroundEpisodeDetection();
      break;
    case 'UPDATE_SUBSCRIBED_ANIME':
      updateSubscribedAnime(data);
      break;
    case 'FORCE_EPISODE_CHECK':
      event.waitUntil(performBackgroundEpisodeCheck());
      break;
    case 'GET_SERVICE_STATUS':
      event.ports[0].postMessage(getServiceStatus());
      break;
    default:
      console.log('Service Worker: Unknown message type', type);
  }
});

// Fetch event with enhanced caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // API requests with network-first strategy
  if (url.pathname.includes('/episodes/') || url.pathname.includes('/schedule/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Static assets with cache-first strategy
  if (url.pathname.includes('/static/') || url.pathname.includes('/logo.png')) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // Default network-first strategy
  event.respondWith(handleDefaultRequest(request));
});

// Background episode detection functions
async function startBackgroundEpisodeDetection(subscribedAnime) {
  console.log('Service Worker: Starting background episode detection');
  
  episodeDetectionState.subscribedAnime = subscribedAnime || [];
  episodeDetectionState.isRunning = true;
  episodeDetectionState.lastCheck = Date.now();
  
  // Load episode cache
  await loadEpisodeCache();
  
  // Perform initial check
  await performBackgroundEpisodeCheck();
  
  // Schedule periodic checks
  schedulePeriodicChecks();
  
  // Register background sync
  await registerBackgroundSync();
  
  // Notify all clients
  notifyAllClients({
    type: 'DETECTION_STARTED',
    data: { animeCount: episodeDetectionState.subscribedAnime.length }
  });
}

async function stopBackgroundEpisodeDetection() {
  console.log('Service Worker: Stopping background episode detection');
  
  episodeDetectionState.isRunning = false;
  
  // Clear periodic checks
  if (episodeDetectionState.checkInterval) {
    clearInterval(episodeDetectionState.checkInterval);
    episodeDetectionState.checkInterval = null;
  }
  
  // Clear scheduled notifications
  episodeDetectionState.scheduledNotifications.forEach(timeout => {
    clearTimeout(timeout);
  });
  episodeDetectionState.scheduledNotifications.clear();
  
  // Unregister background sync
  if (episodeDetectionState.syncRegistration) {
    episodeDetectionState.syncRegistration.unregister();
    episodeDetectionState.syncRegistration = null;
  }
  
  // Notify all clients
  notifyAllClients({
    type: 'DETECTION_STOPPED'
  });
}

async function performBackgroundEpisodeCheck() {
  if (!episodeDetectionState.isRunning || !episodeDetectionState.subscribedAnime.length) {
    return;
  }
  
  console.log(`Service Worker: Checking ${episodeDetectionState.subscribedAnime.length} anime for new episodes`);
  
  const checkPromises = episodeDetectionState.subscribedAnime.map(anime => 
    checkAnimeForNewEpisodes(anime)
  );
  
  try {
    await Promise.allSettled(checkPromises);
    episodeDetectionState.lastCheck = Date.now();
    await saveEpisodeCache();
    
    // Notify clients about update
    notifyAllClients({
      type: 'EPISODE_CHECK_COMPLETED',
      data: {
        timestamp: episodeDetectionState.lastCheck,
        animeCount: episodeDetectionState.subscribedAnime.length
      }
    });
    
  } catch (error) {
    console.error('Service Worker: Error during episode check', error);
  }
}

async function checkAnimeForNewEpisodes(anime) {
  try {
    // Get episodes from API
    const episodesResponse = await fetchWithCache(
      `${getApiUrl()}/episodes/${anime.id}`,
      { cacheKey: `episodes-${anime.id}`, maxAge: 5 * 60 * 1000 }
    );
    
    if (!episodesResponse.ok) {
      throw new Error(`Failed to fetch episodes: ${episodesResponse.status}`);
    }
    
    const episodesData = await episodesResponse.json();
    const currentEpisodes = episodesData.results?.episodes || [];
    const latestEpisodeNumber = getLatestEpisodeNumber(currentEpisodes);
    const lastKnownEpisode = episodeDetectionState.episodeCache.get(anime.id);
    
    // Check for new episode
    if (lastKnownEpisode && latestEpisodeNumber > lastKnownEpisode) {
      console.log(`Service Worker: New episode detected for ${anime.title}: Episode ${latestEpisodeNumber}`);
      
      // Send notification
      await sendEpisodeNotification(anime, latestEpisodeNumber);
      
      // Update cache
      episodeDetectionState.episodeCache.set(anime.id, latestEpisodeNumber);
    } else if (!lastKnownEpisode) {
      // First time checking this anime
      episodeDetectionState.episodeCache.set(anime.id, latestEpisodeNumber);
    }
    
    // Update scheduled notifications
    await updateScheduledNotification(anime, currentEpisodes);
    
  } catch (error) {
    console.error(`Service Worker: Error checking episodes for ${anime.title}`, error);
  }
}

async function updateScheduledNotification(anime, currentEpisodes) {
  try {
    // Clear existing scheduled notification
    if (episodeDetectionState.scheduledNotifications.has(anime.id)) {
      clearTimeout(episodeDetectionState.scheduledNotifications.get(anime.id));
      episodeDetectionState.scheduledNotifications.delete(anime.id);
    }
    
    // Get next episode schedule
    const scheduleResponse = await fetchWithCache(
      `${getApiUrl()}/schedule/${anime.id}`,
      { cacheKey: `schedule-${anime.id}`, maxAge: 60 * 60 * 1000 }
    );
    
    if (!scheduleResponse.ok) {
      return;
    }
    
    const scheduleData = await scheduleResponse.json();
    const nextEpisodeTime = new Date(scheduleData.results?.nextEpisodeSchedule);
    
    if (isNaN(nextEpisodeTime.getTime())) {
      return;
    }
    
    const now = Date.now();
    
    // If next episode is in the future, schedule notification
    if (nextEpisodeTime.getTime() > now) {
      const notificationTime = nextEpisodeTime.getTime() - (5 * 60 * 1000); // 5 minutes before
      
      if (notificationTime > now) {
        const delay = notificationTime - now;
        
        const timeout = setTimeout(() => {
          sendScheduledNotification(anime, scheduleData.results);
        }, delay);
        
        episodeDetectionState.scheduledNotifications.set(anime.id, timeout);
        
        console.log(`Service Worker: Scheduled notification for ${anime.title} at ${new Date(notificationTime).toLocaleString()}`);
      }
    }
    
  } catch (error) {
    console.error(`Service Worker: Error updating scheduled notification for ${anime.title}`, error);
  }
}

async function sendEpisodeNotification(anime, episodeNumber) {
  try {
    await self.registration.showNotification(`New Episode Available!`, {
      body: `${anime.title} - Episode ${episodeNumber} is now available to watch!`,
      icon: anime.poster || '/logo.png',
      badge: '/logo.png',
      tag: `anime-${anime.id}-ep-${episodeNumber}`,
      requireInteraction: true,
      silent: false,
      data: {
        url: `/watch/${anime.id}?ep=${episodeNumber}`,
        type: 'new-episode',
        animeId: anime.id,
        episodeNumber: episodeNumber
      }
    });
    
    console.log(`Service Worker: Sent notification for ${anime.title} Episode ${episodeNumber}`);
    
  } catch (error) {
    console.error(`Service Worker: Error sending notification for ${anime.title}`, error);
  }
}

async function sendScheduledNotification(anime, scheduleData) {
  try {
    // Get current episodes to determine next episode number
    const episodesResponse = await fetchWithCache(
      `${getApiUrl()}/episodes/${anime.id}`,
      { cacheKey: `episodes-${anime.id}`, maxAge: 5 * 60 * 1000 }
    );
    
    if (!episodesResponse.ok) {
      return;
    }
    
    const episodesData = await episodesResponse.json();
    const currentEpisodes = episodesData.results?.episodes || [];
    const latestEpisode = getLatestEpisodeNumber(currentEpisodes);
    const nextEpisodeNumber = latestEpisode + 1;
    
    await self.registration.showNotification(`Episode ${nextEpisodeNumber} Coming Soon!`, {
      body: `${anime.title} - Episode ${nextEpisodeNumber} will be available soon!`,
      icon: anime.poster || '/logo.png',
      badge: '/logo.png',
      tag: `anime-${anime.id}-scheduled`,
      requireInteraction: false,
      silent: false,
      data: {
        url: `/${anime.id}`,
        type: 'scheduled',
        animeId: anime.id,
        episodeNumber: nextEpisodeNumber
      }
    });
    
    console.log(`Service Worker: Sent scheduled notification for ${anime.title} Episode ${nextEpisodeNumber}`);
    
  } catch (error) {
    console.error(`Service Worker: Error sending scheduled notification for ${anime.title}`, error);
  }
}

// Utility functions
function getLatestEpisodeNumber(episodes) {
  if (!episodes || episodes.length === 0) {
    return 0;
  }
  
  const episodeNumbers = episodes
    .map(ep => {
      const match = ep.id?.match(/ep=(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => num > 0);
  
  return episodeNumbers.length > 0 ? Math.max(...episodeNumbers) : 0;
}

async function fetchWithCache(url, options = {}) {
  const { cacheKey, maxAge = 5 * 60 * 1000 } = options;
  const cache = await caches.open(RUNTIME_CACHE);
  
  // Check cache first
  if (cacheKey) {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      const cacheTime = cachedData.timestamp || 0;
      
      if (Date.now() - cacheTime < maxAge) {
        return new Response(JSON.stringify(cachedData.data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }
  
  // Fetch from network
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    if (cacheKey) {
      await cache.put(cacheKey, new Response(JSON.stringify({
        data,
        timestamp: Date.now()
      }), {
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    // Fallback to cache if available
    if (cacheKey) {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        return new Response(JSON.stringify(cachedData.data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    throw error;
  }
}

function getApiUrl() {
  // This should match your API URL configuration
  return import.meta.env?.VITE_API_URL || 'https://api.nemonime.com';
}

async function loadEpisodeCache() {
  try {
    const cached = await caches.open(RUNTIME_CACHE);
    const cacheResponse = await cached.match('episode-cache');
    if (cacheResponse) {
      const cacheData = await cacheResponse.json();
      episodeDetectionState.episodeCache = new Map(Object.entries(cacheData));
      console.log(`Service Worker: Loaded episode cache for ${episodeDetectionState.episodeCache.size} anime`);
    }
  } catch (error) {
    console.error('Service Worker: Error loading episode cache', error);
  }
}

async function saveEpisodeCache() {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const cacheObject = Object.fromEntries(episodeDetectionState.episodeCache);
    await cache.put('episode-cache', new Response(JSON.stringify(cacheObject), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    console.error('Service Worker: Error saving episode cache', error);
  }
}

function schedulePeriodicChecks() {
  // Clear existing interval
  if (episodeDetectionState.checkInterval) {
    clearInterval(episodeDetectionState.checkInterval);
  }
  
  // Schedule new checks every 30 minutes
  episodeDetectionState.checkInterval = setInterval(() => {
    if (episodeDetectionState.isRunning) {
      performBackgroundEpisodeCheck();
    }
  }, BACKGROUND_SYNC_CONFIG.checkInterval);
}

async function registerBackgroundSync() {
  try {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      episodeDetectionState.syncRegistration = await self.registration.sync.register('episode-detection');
      console.log('Service Worker: Background sync registered');
    }
  } catch (error) {
    console.error('Service Worker: Error registering background sync', error);
  }
}

function updateSubscribedAnime(subscribedAnime) {
  episodeDetectionState.subscribedAnime = subscribedAnime;
  
  // Restart detection if running
  if (episodeDetectionState.isRunning) {
    stopBackgroundEpisodeDetection();
    setTimeout(() => startBackgroundEpisodeDetection(subscribedAnime), 1000);
  }
}

function getServiceStatus() {
  return {
    isRunning: episodeDetectionState.isRunning,
    lastCheck: episodeDetectionState.lastCheck,
    subscribedCount: episodeDetectionState.subscribedAnime.length,
    scheduledNotifications: episodeDetectionState.scheduledNotifications.size,
    cachedEpisodes: episodeDetectionState.episodeCache.size
  };
}

async function notifyAllClients(message) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    if (client.readyState === 'open') {
      client.postMessage(message);
    }
  });
}

// Request handlers
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful API responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      const cacheKey = `api-${request.url}`;
      await cache.put(cacheKey, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(RUNTIME_CACHE);
    const cacheKey = `api-${request.url}`;
    const cachedResponse = await cache.match(cacheKey);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

async function handleStaticAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}