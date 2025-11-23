import { useEffect, useRef, useCallback } from 'react';
import { useNotification } from '@/src/context/NotificationContext';
import episodeDetectionService from '@/src/services/episodeDetectionService';

/**
 * Hook untuk mengelola episode detection service
 */
export function useEpisodeDetection() {
  const { sendEpisodeNotification, sendCustomNotification } = useNotification();
  const isInitialized = useRef(false);

  /**
   * Initialize the episode detection service
   */
  const initializeService = useCallback(() => {
    if (!isInitialized.current) {
      // Create notification context object for the service
      const notificationContext = {
        sendEpisodeNotification,
        sendCustomNotification
      };
      
      episodeDetectionService.initialize(notificationContext);
      isInitialized.current = true;
    }
  }, [sendEpisodeNotification, sendCustomNotification]);

  /**
   * Start the episode detection service
   */
  const startService = useCallback(() => {
    if (!isInitialized.current) {
      initializeService();
    }
    episodeDetectionService.start();
  }, [initializeService]);

  /**
   * Stop the episode detection service
   */
  const stopService = useCallback(() => {
    episodeDetectionService.stop();
  }, []);

  /**
   * Get service status
   */
  const getServiceStatus = useCallback(() => {
    return episodeDetectionService.getStatus();
  }, []);

  /**
   * Force check all subscribed anime
   */
  const forceCheckAll = useCallback(async () => {
    await episodeDetectionService.forceCheckAll();
  }, []);

  /**
   * Force check specific anime
   */
  const forceCheckAnime = useCallback(async (animeId) => {
    await episodeDetectionService.forceCheckAnime(animeId);
  }, []);

  /**
   * Add anime to monitoring
   */
  const addAnimeToMonitoring = useCallback((anime) => {
    episodeDetectionService.addAnime(anime);
  }, []);

  /**
   * Remove anime from monitoring
   */
  const removeAnimeFromMonitoring = useCallback((animeId) => {
    episodeDetectionService.removeAnime(animeId);
  }, []);

  // Auto-initialize when hook is used
  useEffect(() => {
    initializeService();
    
    // Cleanup on unmount
    return () => {
      // Don't auto-stop on unmount to allow service to continue running
    };
  }, [initializeService]);

  return {
    // Service control
    startService,
    stopService,
    getServiceStatus,
    
    // Manual operations
    forceCheckAll,
    forceCheckAnime,
    addAnimeToMonitoring,
    removeAnimeFromMonitoring,
    
    // Status
    isInitialized: isInitialized.current
  };
}