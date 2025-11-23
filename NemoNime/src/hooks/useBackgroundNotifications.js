import { useNotification } from '@/src/context/NotificationContext';
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook untuk mengelola background push notifications
 * Menggunakan Service Worker untuk real-time notifications
 */
export function useBackgroundNotifications() {
  const { sendEpisodeNotification, sendCustomNotification } = useNotification();
  const [isSupported, setIsSupported] = useState(false);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [backgroundStatus, setBackgroundStatus] = useState({
    isRunning: false,
    lastCheck: null,
    subscribedCount: 0,
    scheduledNotifications: 0,
    cachedEpisodes: 0
  });
  
  const messageChannel = useRef(null);
  const serviceWorkerRegistration = useRef(null);

  // Check browser support
  useEffect(() => {
    const checkSupport = () => {
      const supported = !!(
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window &&
        'sync' in window.ServiceWorkerRegistration.prototype
      );
      
      setIsSupported(supported);
      console.log('Background notifications supported:', supported);
      
      if (supported) {
        initializeServiceWorker();
      }
    };

    checkSupport();
  }, []);

  // Initialize service worker
  const initializeServiceWorker = useCallback(async () => {
    try {
      // Register enhanced service worker
      const registration = await navigator.serviceWorker.register('/sw-enhanced.js', {
        scope: '/'
      });

      serviceWorkerRegistration.current = registration;
      
      // Wait for service worker to be ready
      const activeWorker = registration.active || registration.installing;
      
      if (activeWorker) {
        await waitForServiceWorkerReady(activeWorker);
        setServiceWorkerReady(true);
        console.log('Enhanced service worker ready');
      } else {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              waitForServiceWorkerReady(newWorker).then(() => {
                setServiceWorkerReady(true);
                console.log('Enhanced service worker activated');
              });
            }
          });
        });
      }

      // Set up message channel
      setupMessageChannel(registration);

      // Request notification permission
      await requestNotificationPermission();

    } catch (error) {
      console.error('Error initializing enhanced service worker:', error);
      setIsSupported(false);
    }
  }, []);

  // Wait for service worker to be ready
  const waitForServiceWorkerReady = (worker) => {
    return new Promise((resolve) => {
      if (worker.state === 'activated') {
        resolve();
      } else {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated') {
            resolve();
          }
        });
      }
    });
  };

  // Set up message channel with service worker
  const setupMessageChannel = (registration) => {
    // Create message channel for two-way communication
    const channel = new MessageChannel();
    
    channel.port1.onmessage = (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'DETECTION_STARTED':
          console.log('Background episode detection started:', data);
          break;
        case 'DETECTION_STOPPED':
          console.log('Background episode detection stopped');
          break;
        case 'EPISODE_CHECK_COMPLETED':
          console.log('Background episode check completed:', data);
          break;
        case 'SERVICE_STATUS':
          setBackgroundStatus(data);
          break;
        default:
          console.log('Unknown message from service worker:', type, data);
      }
    };

    messageChannel.current = channel;

    // Store port for service worker communication
    if (registration.active) {
      registration.active.postMessage({
        type: 'SETUP_MESSAGE_CHANNEL'
      }, [channel.port2]);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission === 'granted';
    }
    return false;
  };

  // Start background episode detection
  const startBackgroundDetection = useCallback(async (subscribedAnime) => {
    if (!serviceWorkerReady || !serviceWorkerRegistration.current) {
      console.error('Service worker not ready');
      return false;
    }

    try {
      const registration = serviceWorkerRegistration.current;
      
      // Send message to service worker
      registration.active.postMessage({
        type: 'START_EPISODE_DETECTION',
        data: subscribedAnime
      });

      // Register background sync
      if ('sync' in registration) {
        await registration.sync.register('episode-detection');
        console.log('Background sync registered');
      }

      console.log('Background episode detection started');
      return true;

    } catch (error) {
      console.error('Error starting background detection:', error);
      return false;
    }
  }, [serviceWorkerReady]);

  // Stop background episode detection
  const stopBackgroundDetection = useCallback(async () => {
    if (!serviceWorkerReady || !serviceWorkerRegistration.current) {
      return false;
    }

    try {
      const registration = serviceWorkerRegistration.current;
      
      registration.active.postMessage({
        type: 'STOP_EPISODE_DETECTION'
      });

      console.log('Background episode detection stopped');
      return true;

    } catch (error) {
      console.error('Error stopping background detection:', error);
      return false;
    }
  }, [serviceWorkerReady]);

  // Update subscribed anime
  const updateSubscribedAnime = useCallback(async (subscribedAnime) => {
    if (!serviceWorkerReady || !serviceWorkerRegistration.current) {
      return false;
    }

    try {
      const registration = serviceWorkerRegistration.current;
      
      registration.active.postMessage({
        type: 'UPDATE_SUBSCRIBED_ANIME',
        data: subscribedAnime
      });

      console.log('Updated subscribed anime in background service');
      return true;

    } catch (error) {
      console.error('Error updating subscribed anime:', error);
      return false;
    }
  }, [serviceWorkerReady]);

  // Force episode check
  const forceEpisodeCheck = useCallback(async () => {
    if (!serviceWorkerReady || !serviceWorkerRegistration.current) {
      return false;
    }

    try {
      const registration = serviceWorkerRegistration.current;
      
      registration.active.postMessage({
        type: 'FORCE_EPISODE_CHECK'
      });

      console.log('Forced episode check in background service');
      return true;

    } catch (error) {
      console.error('Error forcing episode check:', error);
      return false;
    }
  }, [serviceWorkerReady]);

  // Get service status
  const getServiceStatus = useCallback(async () => {
    if (!serviceWorkerReady || !serviceWorkerRegistration.current) {
      return null;
    }

    try {
      const registration = serviceWorkerRegistration.current;
      
      // Create temporary message channel for status
      const channel = new MessageChannel();
      
      const statusPromise = new Promise((resolve) => {
        channel.port1.onmessage = (event) => {
          resolve(event.data);
        };
      });

      registration.active.postMessage({
        type: 'GET_SERVICE_STATUS'
      }, [channel.port2]);

      const status = await statusPromise;
      setBackgroundStatus(status);
      return status;

    } catch (error) {
      console.error('Error getting service status:', error);
      return null;
    }
  }, [serviceWorkerReady]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!serviceWorkerReady || !serviceWorkerRegistration.current) {
      return null;
    }

    try {
      const registration = serviceWorkerRegistration.current;
      
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: await getVapidPublicKey()
      });

      console.log('Push subscription created:', subscription);
      
      // Send subscription to server (for future backend integration)
      await sendPushSubscriptionToServer(subscription);
      
      return subscription;

    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }, [serviceWorkerReady]);

  // Get VAPID public key (for future backend integration)
  const getVapidPublicKey = async () => {
    // This would typically come from your server
    // For now, return a placeholder
    return 'BMzFTLY6TbVGJtF1s2n5r8m8x5Y9nK7d3vQ2wF6pL1hJ0sR5tG7nV2xC4zA8yE6kP3mQ1wF5sN7tR2jX8vK4bZ6pL9';
  };

  // Send push subscription to server
  const sendPushSubscriptionToServer = async (subscription) => {
    try {
      // This would send the subscription to your server
      // For now, just log it
      console.log('Push subscription to send to server:', subscription);
      
      // Example implementation:
      // await fetch('/api/push-subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscription)
      // });

    } catch (error) {
      console.error('Error sending push subscription to server:', error);
    }
  };

  // Test background notification
  const testBackgroundNotification = useCallback(async () => {
    if (!serviceWorkerReady || !serviceWorkerRegistration.current) {
      return false;
    }

    try {
      const registration = serviceWorkerRegistration.current;
      
      registration.active.postMessage({
        type: 'TEST_NOTIFICATION',
        data: {
          title: 'Test Background Notification',
          body: 'This is a test notification from the background service!',
          icon: '/logo.png',
          tag: 'test-notification'
        }
      });

      console.log('Test background notification sent');
      return true;

    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }, [serviceWorkerReady]);

  // Update status periodically
  useEffect(() => {
    if (!serviceWorkerReady) return;

    const interval = setInterval(() => {
      getServiceStatus();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [serviceWorkerReady, getServiceStatus]);

  return {
    // Support status
    isSupported,
    serviceWorkerReady,
    
    // Service status
    backgroundStatus,
    
    // Control functions
    startBackgroundDetection,
    stopBackgroundDetection,
    updateSubscribedAnime,
    forceEpisodeCheck,
    getServiceStatus,
    
    // Push notifications
    subscribeToPush,
    testBackgroundNotification,
    
    // Legacy compatibility
    requestNotificationPermission
  };
}