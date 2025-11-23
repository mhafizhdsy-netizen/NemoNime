import { createContext, useContext, useState, useEffect } from 'react';
import episodeDetectionService from '@/src/services/episodeDetectionService';
import { useBackgroundNotifications } from '@/src/hooks/useBackgroundNotifications';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');
  const [useBackgroundMode, setUseBackgroundMode] = useState(false);
  
  // Background notifications hook
  const backgroundNotifications = useBackgroundNotifications();

  useEffect(() => {
    const saved = localStorage.getItem('animeNotifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }

    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Initialize episode detection service
    const notificationContext = {
      sendEpisodeNotification,
      sendCustomNotification
    };
    
    episodeDetectionService.initialize(notificationContext);
    
    // Start background detection if supported and there are subscribed anime
    if (saved && backgroundNotifications.isSupported) {
      const subscribedAnime = JSON.parse(saved);
      if (subscribedAnime.length > 0) {
        // Wait for background service to be ready
        const checkBackgroundReady = () => {
          if (backgroundNotifications.serviceWorkerReady) {
            backgroundNotifications.startBackgroundDetection(subscribedAnime);
            console.log('Started background episode detection for subscribed anime');
          } else {
            setTimeout(checkBackgroundReady, 1000);
          }
        };
        checkBackgroundReady();
      }
    }
    
    // Start foreground detection as fallback
    if (saved) {
      const subscribedAnime = JSON.parse(saved);
      if (subscribedAnime.length > 0) {
        episodeDetectionService.start();
        console.log(`Started foreground episode detection for ${subscribedAnime.length} anime`);
      }
    }
  }, [backgroundNotifications.isSupported, backgroundNotifications.serviceWorkerReady]);

  useEffect(() => {
    localStorage.setItem('animeNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  const sendTestNotification = (anime) => {
    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(`Subscribed to ${anime.title}`, {
          body: 'You will be notified when new episodes are released!',
          icon: anime.poster || '/logo.png',
          badge: '/logo.png',
          tag: `anime-${anime.id}`,
          requireInteraction: false,
          silent: false
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        setTimeout(() => notification.close(), 5000);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  };

  const addNotification = async (anime) => {
    const perm = await requestPermission();
    
    if (perm === 'denied') {
      alert('Notifications are blocked. Please enable them in your browser settings to receive episode alerts.');
      return false;
    }

    if (perm !== 'granted') {
      alert('Please allow notifications to get alerts for new episodes!');
      return false;
    }

    const exists = notifications.find(item => item.id === anime.id);
    if (exists) {
      return true;
    }

    setNotifications(prev => [...prev, {
      id: anime.id,
      title: anime.title,
      poster: anime.poster,
      addedAt: new Date().toISOString()
    }]);

    // Send test notification
    sendTestNotification(anime);

    // Add anime to episode detection service (foreground)
    episodeDetectionService.addAnime(anime);

    // Add anime to background detection service if supported
    if (backgroundNotifications.isSupported && backgroundNotifications.serviceWorkerReady) {
      const currentSubscribed = JSON.parse(localStorage.getItem('animeNotifications') || '[]');
      await backgroundNotifications.updateSubscribedAnime(currentSubscribed);
    }

    return true;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
    
    // Remove anime from episode detection service
    episodeDetectionService.removeAnime(id);
    
    // Remove anime from background detection service if supported
    if (backgroundNotifications.isSupported && backgroundNotifications.serviceWorkerReady) {
      const currentSubscribed = JSON.parse(localStorage.getItem('animeNotifications') || '[]');
      backgroundNotifications.updateSubscribedAnime(currentSubscribed);
    }
  };

  const isSubscribed = (id) => {
    return notifications.some(item => item.id === id);
  };

  const sendEpisodeNotification = (anime, episodeNumber) => {
    if (Notification.permission === 'granted' && isSubscribed(anime.id)) {
      try {
        const notification = new Notification(`New Episode Available!`, {
          body: `${anime.title} - Episode ${episodeNumber} is now available to watch!`,
          icon: anime.poster || '/logo.png',
          badge: '/logo.png',
          tag: `anime-${anime.id}-ep-${episodeNumber}`,
          requireInteraction: true,
          silent: false,
          data: {
            url: `/watch/${anime.id}?ep=${episodeNumber}`
          }
        });

        notification.onclick = () => {
          window.open(notification.data.url, '_blank');
          notification.close();
        };
      } catch (error) {
        console.error('Error sending episode notification:', error);
      }
    }
  };

  const sendCustomNotification = (notificationData) => {
    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(notificationData.title, {
          body: notificationData.body,
          icon: notificationData.icon || '/logo.png',
          badge: '/logo.png',
          tag: notificationData.tag || 'custom-notification',
          requireInteraction: notificationData.requireInteraction || false,
          silent: notificationData.silent || false,
          data: notificationData.data || {}
        });

        notification.onclick = () => {
          if (notification.data.url) {
            window.open(notification.data.url, '_blank');
          } else {
            window.focus();
          }
          notification.close();
        };

        // Auto-close after specified time or default 5 seconds
        const autoCloseTime = notificationData.autoCloseTime || 5000;
        setTimeout(() => notification.close(), autoCloseTime);

      } catch (error) {
        console.error('Error sending custom notification:', error);
      }
    }
  };

  // Episode Detection Service Control Functions
  const startEpisodeDetection = () => {
    episodeDetectionService.start();
  };

  const stopEpisodeDetection = () => {
    episodeDetectionService.stop();
  };

  const getEpisodeDetectionStatus = () => {
    return episodeDetectionService.getStatus();
  };

  const forceCheckEpisodes = async () => {
    await episodeDetectionService.forceCheckAll();
    
    // Also force check in background if supported
    if (backgroundNotifications.isSupported && backgroundNotifications.serviceWorkerReady) {
      await backgroundNotifications.forceEpisodeCheck();
    }
  };

  // Background notification controls
  const enableBackgroundMode = () => {
    setUseBackgroundMode(true);
    if (backgroundNotifications.isSupported && backgroundNotifications.serviceWorkerReady) {
      const subscribedAnime = JSON.parse(localStorage.getItem('animeNotifications') || '[]');
      backgroundNotifications.startBackgroundDetection(subscribedAnime);
    }
  };

  const disableBackgroundMode = () => {
    setUseBackgroundMode(false);
    if (backgroundNotifications.isSupported && backgroundNotifications.serviceWorkerReady) {
      backgroundNotifications.stopBackgroundDetection();
    }
  };

  const testBackgroundNotification = async () => {
    if (backgroundNotifications.isSupported && backgroundNotifications.serviceWorkerReady) {
      return await backgroundNotifications.testBackgroundNotification();
    }
    return false;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      permission,
      addNotification,
      removeNotification,
      isSubscribed,
      requestPermission,
      sendEpisodeNotification,
      sendCustomNotification,
      // Episode Detection Service Controls
      startEpisodeDetection,
      stopEpisodeDetection,
      getEpisodeDetectionStatus,
      forceCheckEpisodes,
      // Background Notifications
      isSupported: backgroundNotifications.isSupported,
      serviceWorkerReady: backgroundNotifications.serviceWorkerReady,
      backgroundStatus: backgroundNotifications.backgroundStatus,
      useBackgroundMode,
      enableBackgroundMode,
      disableBackgroundMode,
      testBackgroundNotification,
      subscribeToPush: backgroundNotifications.subscribeToPush
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
