import React, { useState, useEffect } from 'react';
import { useNotification } from '@/src/context/NotificationContext';
import { useEpisodeDetection } from '@/src/hooks/useEpisodeDetection';

/**
 * Komponen untuk monitoring dan kontrol episode detection service
 * Hanya muncul di development mode
 */
function EpisodeDetectionMonitor() {
  const { 
    getEpisodeDetectionStatus, 
    forceCheckEpisodes,
    isSupported: backgroundSupported,
    serviceWorkerReady,
    backgroundStatus,
    useBackgroundMode,
    enableBackgroundMode,
    disableBackgroundMode,
    testBackgroundNotification
  } = useNotification();
  const { getServiceStatus } = useEpisodeDetection();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('foreground');

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    // Status will be updated from context
  };

  const handleForceCheck = async () => {
    await forceCheckEpisodes();
    setTimeout(updateStatus, 2000); // Update status after check
  };

  const handleToggleBackground = () => {
    if (useBackgroundMode) {
      disableBackgroundMode();
    } else {
      enableBackgroundMode();
    }
  };

  const handleTestBackground = async () => {
    await testBackgroundNotification();
  };

  const getCurrentStatus = () => {
    if (activeTab === 'background' && backgroundStatus) {
      return backgroundStatus;
    }
    return getEpisodeDetectionStatus();
  };

  const currentStatus = getCurrentStatus();

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs max-w-sm backdrop-blur-sm border border-white/20">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currentStatus?.isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-semibold">Episode Detection</span>
          {backgroundSupported && (
            <div className={`w-2 h-2 rounded-full ${serviceWorkerReady ? 'bg-blue-500' : 'bg-yellow-500'}`} title="Service Worker"></div>
          )}
        </div>
        <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {/* Tab Selection */}
      {isExpanded && backgroundSupported && (
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setActiveTab('foreground')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              activeTab === 'foreground' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Foreground
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              activeTab === 'background' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Background
          </button>
        </div>
      )}

      {/* Basic Status */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">Mode:</span>
          <span className={currentStatus?.isRunning ? 'text-green-400' : 'text-red-400'}>
            {activeTab === 'background' ? 'Background' : 'Foreground'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className={currentStatus?.isRunning ? 'text-green-400' : 'text-red-400'}>
            {currentStatus?.isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Subscribed:</span>
          <span>{currentStatus?.subscribedCount || 0}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Scheduled:</span>
            <span>{currentStatus?.scheduledNotifications || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cached:</span>
            <span>{currentStatus?.cachedEpisodes || 0}</span>
          </div>
          {currentStatus?.lastCheck && (
            <div className="flex justify-between">
              <span className="text-gray-400">Last Check:</span>
              <span>{new Date(currentStatus.lastCheck).toLocaleTimeString()}</span>
            </div>
          )}
          
          {/* Control Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleForceCheck}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
            >
              Force Check
            </button>
            <button
              onClick={updateStatus}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors"
            >
              Refresh
            </button>
          </div>

          {/* Background Mode Controls */}
          {backgroundSupported && (
            <div className="mt-3 pt-2 border-t border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Background Mode:</span>
                <button
                  onClick={handleToggleBackground}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    useBackgroundMode 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {useBackgroundMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {activeTab === 'background' && (
                <button
                  onClick={handleTestBackground}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs transition-colors"
                >
                  Test Background Notification
                </button>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-3 pt-2 border-t border-white/20 text-gray-400 text-xs">
            <div className="mb-1">💡 {activeTab === 'background' ? 'Background' : 'Foreground'} Mode:</div>
            <ul className="space-y-1 ml-2">
              {activeTab === 'background' ? (
                <>
                  <li>• Works even when tab is closed</li>
                  <li>• Uses Service Worker API</li>
                  <li>• Real-time push notifications</li>
                  <li>• Background sync support</li>
                </>
              ) : (
                <>
                  <li>• Works when tab is active</li>
                  <li>• Fallback for unsupported browsers</li>
                  <li>• Lower battery usage</li>
                  <li>• Immediate response</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EpisodeDetectionMonitor;