# 🚀 Episode Detection System - Documentation

## 📋 Overview

Sistem episode detection yang telah dibuat untuk NemoNime adalah sistem frontend yang secara otomatis mendeteksi episode baru dari anime yang telah disubscribe oleh user. Sistem ini bekerja dengan:

1. **Real-time Detection** - Mengecek episode baru setiap 5 menit
2. **Scheduled Notifications** - Mengirim notifikasi berdasarkan jadwal rilis
3. **Smart Caching** - Mencegah notifikasi duplikat
4. **Local Storage** - Semua data tersimpan secara lokal

## 🏗️ Architecture

### Core Components

#### 1. **EpisodeDetectionService** (`/src/services/episodeDetectionService.js`)
- **Singleton Pattern** - Hanya satu instance yang berjalan
- **Auto-initialization** - Otomatis start saat ada subscribed anime
- **Background Processing** - Berjalan di background tanpa mengganggu UI
- **Memory Efficient** - Menggunakan Map untuk caching yang efisien

#### 2. **NotificationContext** (Updated)
- **Integration** - Terintegrasi dengan episode detection service
- **Auto Management** - Otomatis add/remove anime dari monitoring
- **Permission Handling** - Mengelola browser notification permission

#### 3. **useEpisodeDetection Hook** (`/src/hooks/useEpisodeDetection.js`)
- **React Integration** - Hook untuk kemudahan penggunaan di React
- **Status Monitoring** - Real-time status service
- **Manual Control** - Fungsi untuk manual check dan kontrol

#### 4. **EpisodeDetectionMonitor** (Development Only)
- **Visual Status** - Monitor status service di development
- **Debug Tools** - Force check dan refresh status
- **Performance Metrics** - Jumlah subscribed, scheduled, cached

## 🔧 How It Works

### 1. **Initialization**
```javascript
// Otomatis dijalankan saat NotificationContext mount
useEffect(() => {
  // Load subscribed anime dari localStorage
  const subscribedAnime = JSON.parse(localStorage.getItem('animeNotifications'));
  
  // Initialize service dengan notification context
  episodeDetectionService.initialize(notificationContext);
  
  // Start service jika ada subscribed anime
  if (subscribedAnime.length > 0) {
    episodeDetectionService.start();
  }
}, []);
```

### 2. **Episode Detection Process**
```javascript
// Berjalan setiap 5 menit
const checkAnimeForNewEpisodes = async (anime) => {
  // 1. Get current episodes dari API
  const episodesResponse = await getEpisodes(anime.id);
  
  // 2. Extract latest episode number
  const latestEpisodeNumber = getLatestEpisodeNumber(episodesResponse.episodes);
  
  // 3. Compare dengan cache
  const lastKnownEpisode = lastEpisodeCache.get(anime.id);
  
  // 4. Jika ada episode baru, kirim notifikasi
  if (latestEpisodeNumber > lastKnownEpisode) {
    sendEpisodeNotification(anime, latestEpisodeNumber);
    lastEpisodeCache.set(anime.id, latestEpisodeNumber);
  }
};
```

### 3. **Scheduled Notifications**
```javascript
// Setup notifikasi berdasarkan jadwal rilis
const updateScheduledNotification = async (anime) => {
  // 1. Get next episode schedule
  const scheduleResponse = await getNextEpisodeSchedule(anime.id);
  
  // 2. Calculate notification time (5 menit sebelum rilis)
  const notificationTime = new Date(nextEpisodeTime - 5 * 60 * 1000);
  
  // 3. Schedule notification
  const timeout = setTimeout(() => {
    sendScheduledNotification(anime, scheduleData);
  }, delay);
  
  scheduledNotifications.set(anime.id, timeout);
};
```

## 📊 Data Flow

```
User Subscribe Anime
        ↓
NotificationContext.addNotification()
        ↓
episodeDetectionService.addAnime()
        ↓
Start Periodic Checking (5 menit)
        ↓
For Each Subscribed Anime:
  ├── getEpisodes() → API Call
  ├── Compare with Cache
  ├── If New Episode → sendEpisodeNotification()
  └── updateScheduledNotification() → Schedule Next
        ↓
User Receives Notification
```

## 🗂️ Data Storage

### Local Storage Keys

#### 1. **animeNotifications**
```json
[
  {
    "id": "anime-id",
    "title": "Anime Title",
    "poster": "poster-url",
    "addedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 2. **episodeDetectionCache**
```json
{
  "anime-id-1": 12,
  "anime-id-2": 8,
  "anime-id-3": 24
}
```

## ⚙️ Configuration

### Service Configuration
```javascript
const CONFIG = {
  CHECK_INTERVAL: 5 * 60 * 1000,        // 5 minutes
  NOTIFICATION_ADVANCE_TIME: 5 * 60 * 1000, // 5 minutes before schedule
  AUTO_CLOSE_TIME: 5000,                 // 5 seconds
  MAX_RETRY_ATTEMPTS: 3,                 // API retry limit
  CACHE_EXPIRY: 24 * 60 * 60 * 1000     // 24 hours
};
```

### Notification Types

#### 1. **New Episode Notification**
```javascript
{
  title: "New Episode Available!",
  body: "Anime Title - Episode 13 is now available to watch!",
  icon: "anime-poster.jpg",
  tag: "anime-id-ep-13",
  requireInteraction: true,
  data: { url: "/watch/anime-id?ep=13" }
}
```

#### 2. **Scheduled Notification**
```javascript
{
  title: "Episode 14 Coming Soon!",
  body: "Anime Title - Episode 14 will be available soon!",
  icon: "anime-poster.jpg",
  tag: "anime-id-scheduled",
  requireInteraction: false,
  autoCloseTime: 8000
}
```

## 🎯 API Endpoints Used

### 1. **Episodes Endpoint**
- **URL**: `${API_URL}/episodes/${animeId}`
- **Purpose**: Get all episodes for an anime
- **Response**: `{ episodes: [{ id: "ep=1", ... }, ...] }`

### 2. **Schedule Endpoint**
- **URL**: `${API_URL}/schedule/${animeId}`
- **Purpose**: Get next episode release schedule
- **Response**: `{ nextEpisodeSchedule: "2024-01-01T20:00:00.000Z" }`

### 3. **Anime Info Endpoint**
- **URL**: `${API_URL}/info?id=${animeId}`
- **Purpose**: Get anime information (fallback)
- **Response**: `{ results: { title, poster, ... } }`

## 🔍 Monitoring & Debugging

### Development Monitor
Komponen `EpisodeDetectionMonitor` hanya muncul di development mode:

```javascript
// Status Display
{
  isRunning: true,           // Service status
  subscribedCount: 5,        // Jumlah anime disubscribe
  scheduledNotifications: 3,   // Jumlah notifikasi terjadwal
  cachedEpisodes: 5          // Jumlah episode di cache
}
```

### Console Logs
```javascript
// Service initialization
console.log('Episode Detection Service initialized');

// Service start
console.log('Starting Episode Detection Service...');
console.log(`Started episode detection for ${count} anime`);

// New episode detected
console.log(`New episode detected for ${title}: Episode ${episodeNumber}`);

// Scheduled notification
console.log(`Scheduled notification for ${title} at ${time}`);
```

## 🚨 Error Handling

### API Error Handling
```javascript
try {
  const episodesResponse = await getEpisodes(anime.id);
  // Process response...
} catch (error) {
  console.error(`Error checking episodes for ${anime.title}:`, error);
  // Continue with other anime, don't stop the service
}
```

### Notification Error Handling
```javascript
try {
  const notification = new Notification(title, options);
  // Setup notification...
} catch (error) {
  console.error('Error sending notification:', error);
  // Fallback to toast or ignore
}
```

## 🔧 Usage Examples

### Basic Usage (Automatic)
```javascript
// Otomatis berjalan saat user subscribe anime
const { addNotification } = useNotification();

await addNotification({
  id: 'anime-id',
  title: 'Anime Title',
  poster: 'poster-url'
});
// Service otomatis mulai monitoring anime ini
```

### Manual Control
```javascript
import { useEpisodeDetection } from '@/src/hooks/useEpisodeDetection';

function MyComponent() {
  const { 
    startService, 
    stopService, 
    forceCheckAll,
    getServiceStatus 
  } = useEpisodeDetection();

  const handleForceCheck = async () => {
    await forceCheckAll();
  };

  const status = getServiceStatus();
  console.log('Service status:', status);
}
```

### Custom Notifications
```javascript
const { sendCustomNotification } = useNotification();

sendCustomNotification({
  title: 'Custom Notification',
  body: 'This is a custom notification',
  icon: '/custom-icon.png',
  autoCloseTime: 10000,
  data: { url: '/custom-page' }
});
```

## 🔮 Future Enhancements

### 1. **Backend Integration**
- Real-time WebSocket connections
- Server-side episode detection
- Push API integration

### 2. **Advanced Features**
- Batch notifications
- Custom notification sounds
- Notification scheduling preferences
- Analytics and engagement tracking

### 3. **Performance Optimizations**
- Web Workers for background processing
- IndexedDB for larger cache storage
- Adaptive checking intervals

### 4. **User Experience**
- Notification settings page
- Quiet hours
- Notification history
- Subscribe to genres

## 🧪 Testing

### Manual Testing
1. Subscribe to anime with known schedule
2. Monitor console logs
3. Check notification permissions
4. Verify scheduled notifications

### Automated Testing
```javascript
// Mock API responses
jest.mock('@/src/utils/getEpisodes.utils');
jest.mock('@/src/utils/getNextEpisodeSchedule.utils');

// Test service initialization
test('should initialize service with notification context', () => {
  const mockContext = { sendEpisodeNotification: jest.fn() };
  episodeDetectionService.initialize(mockContext);
  expect(episodeDetectionService.notificationContext).toBe(mockContext);
});
```

## 📝 Notes

### Browser Compatibility
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)  
- ✅ Safari (Desktop & Mobile iOS 16.4+)
- ❌ Internet Explorer

### Limitations
- **Frontend Only** - Tidak bisa mendeteksi episode saat tab tertutup
- **Battery Impact** - Periodic checking bisa mempengaruhi battery
- **Network Dependency** - Memerlukan koneksi internet yang stabil

### Best Practices
1. **Subscribe Wisely** - Hanya subscribe anime yang benar-benar diikuti
2. **Monitor Performance** - Gunakan development monitor untuk tracking
3. **Handle Permissions** - Pastikan user memberikan notification permission
4. **Test Thoroughly** - Test di berbagai browser dan devices

---

## 🎉 Summary

Sistem episode detection ini telah berhasil dibuat dengan:

✅ **Real-time Detection** - Otomatis mendeteksi episode baru  
✅ **Scheduled Notifications** - Notifikasi berdasarkan jadwal rilis  
✅ **Smart Caching** - Mencegah notifikasi duplikat  
✅ **Local Storage** - Data tersimpan secara lokal  
✅ **Development Tools** - Monitor dan debug tools  
✅ **Error Handling** - Robust error handling  
✅ **Performance Optimized** - Efficient resource usage  

Sistem ini siap digunakan dan dapat dengan mudah diintegrasikan dengan backend di masa depan untuk kemampuan real-time yang lebih baik.