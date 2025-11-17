import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem('animeNotifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }

    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('animeNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return Notification.permission;
  };

  const addNotification = async (anime) => {
    const perm = await requestPermission();
    
    if (perm !== 'granted') {
      alert('Please enable notifications to get alerts for new episodes!');
      return false;
    }

    setNotifications(prev => {
      const exists = prev.find(item => item.id === anime.id);
      if (exists) return prev;
      
      return [...prev, {
        id: anime.id,
        title: anime.title,
        poster: anime.poster,
        addedAt: new Date().toISOString()
      }];
    });

    return true;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const isSubscribed = (id) => {
    return notifications.some(item => item.id === id);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      permission,
      addNotification,
      removeNotification,
      isSubscribed,
      requestPermission
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
