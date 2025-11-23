# 🧪 Testing Guide - Episode Detection System

## 📋 Quick Start Testing

### 1. **Subscribe to Anime**
1. Buka halaman anime info
2. Klik tombol bell (🔔) notification
3. Allow browser notifications
4. Verifikasi test notification muncul

### 2. **Monitor Service Status**
1. Buka browser developer tools (F12)
2. Lihat console untuk logs:
   ```
   Episode Detection Service initialized
   Started episode detection for X anime
   Checking X subscribed anime for new episodes...
   ```

3. Lihat development monitor di bottom-right corner (hanya di development)

### 3. **Test New Episode Detection**
1. Subscribe ke anime yang sedang ongoing
2. Tunggu 5 menit untuk periodic check
3. Atau gunakan "Force Check" di development monitor

### 4. **Test Scheduled Notifications**
1. Subscribe ke anime dengan jadwal rilis dekat
2. System akan schedule notification 5 menit sebelum rilis
3. Monitor console untuk scheduled notification logs

## 🔍 Console Logs to Monitor

### Service Initialization
```
Episode Detection Service initialized
Loaded X subscribed anime
Started episode detection for X anime
```

### Periodic Checking
```
Checking X subscribed anime for new episodes...
```

### New Episode Detection
```
New episode detected for Anime Title: Episode 13
```

### Scheduled Notifications
```
Scheduled notification for Anime Title at HH:MM:SS
```

## 🛠️ Manual Testing Functions

### Force Check All Anime
```javascript
// Di browser console
const { forceCheckEpisodes } = useNotification();
await forceCheckEpisodes();
```

### Check Service Status
```javascript
// Di browser console
const { getEpisodeDetectionStatus } = useNotification();
console.log(getEpisodeDetectionStatus());
```

### Add Anime to Monitoring
```javascript
// Di browser console
const { addNotification } = useNotification();
await addNotification({
  id: 'test-anime-id',
  title: 'Test Anime',
  poster: '/test-poster.jpg'
});
```

## 📊 Expected Behavior

### When User Subscribes
1. ✅ Permission request dialog muncul
2. ✅ Test notification terkirim
3. ✅ Anime ditambahkan ke monitoring
4. ✅ Service auto-start (jika belum berjalan)
5. ✅ Episode cache diinisialisasi

### When New Episode Detected
1. ✅ Console log menampilkan episode baru
2. ✅ Browser notification muncul
3. ✅ Cache diperbarui
4. ✅ Scheduled notification di-update

### When Episode Scheduled
1. ✅ Notification di-schedule 5 menit sebelum rilis
2. ✅ Console log menampilkan schedule info
3. ✅ Notification muncul tepat waktu

## 🚨 Troubleshooting

### Notifications Not Appearing
1. **Check Browser Permission**
   - Chrome: Settings → Privacy and security → Site settings → Notifications
   - Firefox: Settings → Privacy & Security → Permissions → Notifications

2. **Check Do Not Disturb**
   - Windows: Focus Assist settings
   - macOS: Do Not Disturb
   - Mobile: Silent mode

3. **Check Console Errors**
   ```javascript
   // Di browser console
   console.log('Notification permission:', Notification.permission);
   ```

### Service Not Running
1. **Check Console Logs**
   ```javascript
   // Harus melihat:
   // "Episode Detection Service initialized"
   // "Started episode detection for X anime"
   ```

2. **Check Subscribed Anime**
   ```javascript
   // Di browser console
   const subscribed = localStorage.getItem('animeNotifications');
   console.log('Subscribed anime:', JSON.parse(subscribed));
   ```

3. **Manual Start Service**
   ```javascript
   // Di browser console
   const { startEpisodeDetection } = useNotification();
   startEpisodeDetection();
   ```

### High CPU/Battery Usage
1. **Reduce Check Frequency**
   ```javascript
   // Di episodeDetectionService.js
   this.CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes
   ```

2. **Stop Service When Not Needed**
   ```javascript
   // Di browser console
   const { stopEpisodeDetection } = useNotification();
   stopEpisodeDetection();
   ```

## 📱 Mobile Testing

### iOS Safari
1. Ensure iOS 16.4+ for notification support
2. Add website to Home Screen for PWA features
3. Check Settings → Notifications for website permission

### Android Chrome
1. Ensure Chrome notifications enabled
2. Check website permission in Chrome settings
3. Test with both foreground and background

## 🔧 Advanced Testing

### Mock API Responses
```javascript
// Di browser console untuk testing
const originalGetEpisodes = window.getEpisodes;
window.getEpisodes = async (id) => {
  if (id === 'test-anime-id') {
    return {
      episodes: [
        { id: 'ep=1' },
        { id: 'ep=2' },
        { id: 'ep=3' } // New episode
      ]
    };
  }
  return originalGetEpisodes(id);
};
```

### Test Schedule Notification
```javascript
// Di browser console
const originalGetNextEpisodeSchedule = window.getNextEpisodeSchedule;
window.getNextEpisodeSchedule = async (id) => {
  if (id === 'test-anime-id') {
    const futureTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
    return {
      nextEpisodeSchedule: futureTime.toISOString()
    };
  }
  return originalGetNextEpisodeSchedule(id);
};
```

## 📈 Performance Monitoring

### Monitor Memory Usage
```javascript
// Di browser console
setInterval(() => {
  const status = getEpisodeDetectionStatus();
  console.log('Service Status:', status);
  console.log('Memory:', performance.memory);
}, 30000); // Every 30 seconds
```

### Monitor Network Requests
```javascript
// Di Network tab di developer tools
// Filter untuk:
// - /episodes/ (API calls)
// - /schedule/ (Schedule API calls)
```

## ✅ Success Criteria

### Basic Functionality
- [ ] User can subscribe to anime
- [ ] Test notification appears
- [ ] Service starts automatically
- [ ] Console logs show initialization

### Episode Detection
- [ ] New episodes detected within 5 minutes
- [ ] Notifications sent for new episodes
- [ ] Cache prevents duplicate notifications
- [ ] Service continues running after page refresh

### Scheduled Notifications
- [ ] Notifications scheduled based on release time
- [ ] Notifications appear 5 minutes before release
- [ ] Scheduled notifications cancelled if unsubscribed

### Error Handling
- [ ] API errors don't crash service
- [ ] Permission denied handled gracefully
- [ ] Network timeouts handled properly
- [ ] Invalid data handled safely

---

## 🎯 Testing Checklist

### Before Release
- [ ] Test in Chrome (Desktop)
- [ ] Test in Firefox (Desktop)
- [ ] Test in Safari (Desktop)
- [ ] Test in Chrome (Mobile)
- [ ] Test in Safari (Mobile)
- [ ] Test notification permissions
- [ ] Test with poor network
- [ ] Test with blocked notifications
- [ ] Test with multiple tabs
- [ ] Test page refresh behavior
- [ ] Test browser restart behavior
- [ ] Test memory usage over time
- [ ] Test battery usage impact

### Performance Targets
- [ ] CPU usage < 5% during idle
- [ ] Memory usage < 50MB for service
- [ ] Network requests < 10 per hour per anime
- [ ] Notification latency < 30 seconds
- [ ] Service startup time < 2 seconds

---

## 📞 Support

If you encounter issues during testing:

1. **Check Console Logs** - Most issues will be logged
2. **Verify Permissions** - Ensure notifications are allowed
3. **Test Network** - Ensure API endpoints are accessible
4. **Clear Cache** - Try clearing localStorage and refreshing
5. **Restart Browser** - Some issues require browser restart

For detailed troubleshooting, see the main documentation: `EPISODE_DETECTION_DOCUMENTATION.md`