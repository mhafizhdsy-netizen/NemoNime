import { useNotification } from '@/src/context/NotificationContext';
import getEpisodes from '@/src/utils/getEpisodes.utils';
import getNextEpisodeSchedule from '@/src/utils/getNextEpisodeSchedule.utils';
import getAnimeInfo from '@/src/utils/getAnimeInfo.utils';

class EpisodeDetectionService {
  constructor() {
    this.isRunning = false;
    this.checkInterval = null;
    this.scheduledNotifications = new Map(); // animeId -> notificationTimeout
    this.lastEpisodeCache = new Map(); // animeId -> lastEpisodeNumber
    this.subscribedAnime = [];
    this.notificationContext = null;
    
    // Configuration
    this.CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
    this.NOTIFICATION_ADVANCE_TIME = 5 * 60 * 1000; // 5 minutes before scheduled time
  }

  /**
   * Initialize the service with notification context
   */
  initialize(notificationContext) {
    this.notificationContext = notificationContext;
    this.loadSubscribedAnime();
    this.loadEpisodeCache();
    console.log('Episode Detection Service initialized');
  }

  /**
   * Load subscribed anime from localStorage
   */
  loadSubscribedAnime() {
    try {
      const saved = localStorage.getItem('animeNotifications');
      if (saved) {
        this.subscribedAnime = JSON.parse(saved);
        console.log(`Loaded ${this.subscribedAnime.length} subscribed anime`);
      }
    } catch (error) {
      console.error('Error loading subscribed anime:', error);
      this.subscribedAnime = [];
    }
  }

  /**
   * Start the episode detection service
   */
  start() {
    if (this.isRunning) {
      console.log('Episode Detection Service is already running');
      return;
    }

    console.log('Starting Episode Detection Service...');
    this.isRunning = true;
    
    // Initial check
    this.checkAllSubscribedAnime();
    
    // Set up periodic checking
    this.checkInterval = setInterval(() => {
      this.checkAllSubscribedAnime();
    }, this.CHECK_INTERVAL);

    // Set up scheduled notifications
    this.setupScheduledNotifications();
  }

  /**
   * Stop the episode detection service
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    console.log('Stopping Episode Detection Service...');
    this.isRunning = false;
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    // Clear all scheduled notifications
    this.scheduledNotifications.forEach(timeout => {
      clearTimeout(timeout);
    });
    this.scheduledNotifications.clear();
  }

  /**
   * Check all subscribed anime for new episodes
   */
  async checkAllSubscribedAnime() {
    if (!this.isRunning || !this.subscribedAnime.length) {
      return;
    }

    console.log(`Checking ${this.subscribedAnime.length} subscribed anime for new episodes...`);
    
    const promises = this.subscribedAnime.map(anime => 
      this.checkAnimeForNewEpisodes(anime)
    );

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error checking anime episodes:', error);
    }
  }

  /**
   * Check a specific anime for new episodes
   */
  async checkAnimeForNewEpisodes(anime) {
    try {
      // Get current episodes
      const episodesResponse = await getEpisodes(anime.id);
      if (!episodesResponse || !episodesResponse.episodes) {
        console.warn(`No episodes found for anime ${anime.id}`);
        return;
      }

      const currentEpisodes = episodesResponse.episodes;
      const latestEpisodeNumber = this.getLatestEpisodeNumber(currentEpisodes);
      const lastKnownEpisode = this.lastEpisodeCache.get(anime.id);

      // Check if there's a new episode
      if (lastKnownEpisode && latestEpisodeNumber > lastKnownEpisode) {
        console.log(`New episode detected for ${anime.title}: Episode ${latestEpisodeNumber}`);
        
        // Send notification
        if (this.notificationContext) {
          this.notificationContext.sendEpisodeNotification(anime, latestEpisodeNumber);
        }

        // Update cache
        this.lastEpisodeCache.set(anime.id, latestEpisodeNumber);
        this.saveEpisodeCache();
      } else if (!lastKnownEpisode) {
        // First time checking this anime
        this.lastEpisodeCache.set(anime.id, latestEpisodeNumber);
        this.saveEpisodeCache();
      }

      // Update scheduled notification
      await this.updateScheduledNotification(anime, currentEpisodes);

    } catch (error) {
      console.error(`Error checking episodes for ${anime.title}:`, error);
    }
  }

  /**
   * Get the latest episode number from episodes array
   */
  getLatestEpisodeNumber(episodes) {
    if (!episodes || episodes.length === 0) {
      return 0;
    }

    // Extract episode numbers and find the highest
    const episodeNumbers = episodes
      .map(ep => {
        const match = ep.id?.match(/ep=(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);

    return episodeNumbers.length > 0 ? Math.max(...episodeNumbers) : 0;
  }

  /**
   * Setup scheduled notifications based on next episode schedule
   */
  async setupScheduledNotifications() {
    for (const anime of this.subscribedAnime) {
      await this.updateScheduledNotification(anime);
    }
  }

  /**
   * Update scheduled notification for a specific anime
   */
  async updateScheduledNotification(anime, currentEpisodes = null) {
    try {
      // Clear existing scheduled notification
      if (this.scheduledNotifications.has(anime.id)) {
        clearTimeout(this.scheduledNotifications.get(anime.id));
        this.scheduledNotifications.delete(anime.id);
      }

      // Get next episode schedule
      const scheduleResponse = await getNextEpisodeSchedule(anime.id);
      if (!scheduleResponse || !scheduleResponse.nextEpisodeSchedule) {
        return;
      }

      const nextEpisodeTime = new Date(scheduleResponse.nextEpisodeSchedule);
      const now = new Date();
      
      // If next episode is in the future, schedule notification
      if (nextEpisodeTime > now) {
        const notificationTime = new Date(nextEpisodeTime.getTime() - this.NOTIFICATION_ADVANCE_TIME);
        
        if (notificationTime > now) {
          const delay = notificationTime.getTime() - now.getTime();
          
          const timeout = setTimeout(() => {
            this.sendScheduledNotification(anime, scheduleResponse);
          }, delay);

          this.scheduledNotifications.set(anime.id, timeout);
          
          console.log(`Scheduled notification for ${anime.title} at ${notificationTime.toLocaleString()}`);
        }
      }

    } catch (error) {
      console.error(`Error updating scheduled notification for ${anime.title}:`, error);
    }
  }

  /**
   * Send scheduled notification
   */
  sendScheduledNotification(anime, scheduleData) {
    if (!this.notificationContext) {
      return;
    }

    try {
      // Get current episodes to determine next episode number
      getEpisodes(anime.id).then(episodesResponse => {
        if (episodesResponse && episodesResponse.episodes) {
          const latestEpisode = this.getLatestEpisodeNumber(episodesResponse.episodes);
          const nextEpisodeNumber = latestEpisode + 1;

          // Create custom notification
          if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(`Episode ${nextEpisodeNumber} Coming Soon!`, {
              body: `${anime.title} - Episode ${nextEpisodeNumber} will be available soon!`,
              icon: anime.poster || '/logo.png',
              badge: '/logo.png',
              tag: `anime-${anime.id}-scheduled`,
              requireInteraction: false,
              silent: false,
              data: {
                url: `/${anime.id}`,
                type: 'scheduled'
              }
            });

            notification.onclick = () => {
              window.open(notification.data.url, '_blank');
              notification.close();
            };

            // Auto-close after 8 seconds
            setTimeout(() => notification.close(), 8000);
          }
        }
      });

    } catch (error) {
      console.error(`Error sending scheduled notification for ${anime.title}:`, error);
    }
  }

  /**
   * Save episode cache to localStorage
   */
  saveEpisodeCache() {
    try {
      const cacheObject = Object.fromEntries(this.lastEpisodeCache);
      localStorage.setItem('episodeDetectionCache', JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Error saving episode cache:', error);
    }
  }

  /**
   * Load episode cache from localStorage
   */
  loadEpisodeCache() {
    try {
      const saved = localStorage.getItem('episodeDetectionCache');
      if (saved) {
        const cacheObject = JSON.parse(saved);
        this.lastEpisodeCache = new Map(Object.entries(cacheObject));
        console.log(`Loaded episode cache for ${this.lastEpisodeCache.size} anime`);
      }
    } catch (error) {
      console.error('Error loading episode cache:', error);
    }
  }

  /**
   * Add new anime to monitoring
   */
  addAnime(anime) {
    if (!this.subscribedAnime.find(a => a.id === anime.id)) {
      this.subscribedAnime.push(anime);
      this.saveSubscribedAnime();
      
      // Check immediately for new episodes
      this.checkAnimeForNewEpisodes(anime);
    }
  }

  /**
   * Remove anime from monitoring
   */
  removeAnime(animeId) {
    this.subscribedAnime = this.subscribedAnime.filter(a => a.id !== animeId);
    this.saveSubscribedAnime();
    
    // Clear scheduled notification
    if (this.scheduledNotifications.has(animeId)) {
      clearTimeout(this.scheduledNotifications.get(animeId));
      this.scheduledNotifications.delete(animeId);
    }
    
    // Clear from cache
    this.lastEpisodeCache.delete(animeId);
    this.saveEpisodeCache();
  }

  /**
   * Save subscribed anime to localStorage
   */
  saveSubscribedAnime() {
    try {
      localStorage.setItem('animeNotifications', JSON.stringify(this.subscribedAnime));
    } catch (error) {
      console.error('Error saving subscribed anime:', error);
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      subscribedCount: this.subscribedAnime.length,
      scheduledNotifications: this.scheduledNotifications.size,
      cachedEpisodes: this.lastEpisodeCache.size
    };
  }

  /**
   * Force check all anime now
   */
  async forceCheckAll() {
    console.log('Force checking all subscribed anime...');
    await this.checkAllSubscribedAnime();
  }

  /**
   * Force check specific anime
   */
  async forceCheckAnime(animeId) {
    const anime = this.subscribedAnime.find(a => a.id === animeId);
    if (anime) {
      await this.checkAnimeForNewEpisodes(anime);
    }
  }
}

// Create singleton instance
const episodeDetectionService = new EpisodeDetectionService();

export default episodeDetectionService;