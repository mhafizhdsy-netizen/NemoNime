import { useWatchlist } from '@/src/context/WatchlistContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlay, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import Loader from '@/src/components/Loader/Loader';
import { getLastWatchedEpisode, formatTime } from '@/src/utils/watchProgress';
import '@/src/components/categorycard/CategoryCard.css'; // Re-use CategoryCard styles

function Watchlist() {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const [loading, setLoading] = useState(true);
  const [watchProgress, setWatchProgress] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const progress = {};
    watchlist.forEach((item) => {
      const lastWatched = getLastWatchedEpisode(item.id);
      if (lastWatched) progress[item.id] = lastWatched;
    });
    setWatchProgress(progress);
  }, [watchlist]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) return <Loader type="watchlist" />;

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-2xl p-12 border border-white/5 shadow-2xl text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#e91e63]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#00bcd4]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#e91e63]/20 to-[#00bcd4]/20 flex items-center justify-center border border-white/10 shadow-xl">
                <span className="text-5xl">📌</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Your Watchlist is Empty</h2>
              <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">Start adding anime episodes to watch later and never miss your favorite shows!</p>
              <Link to="/home" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#e91e63] to-[#00bcd4] rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-[#e91e63]/30 transition-all hover:scale-105">
                <FontAwesomeIcon icon={faPlay} />
                Browse Anime
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="w-2 h-12 bg-gradient-to-b from-[#e91e63] to-[#00bcd4] rounded-full block"></span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">My Watchlist</h1>
                  <p className="text-white/50 text-sm">Keep track of episodes you want to watch</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-r from-[#e91e63]/20 to-[#00bcd4]/20 border border-[#e91e63]/30 rounded-xl">
                  <span className="text-white/70 text-sm font-medium">{watchlist.length} {watchlist.length === 1 ? 'Episode' : 'Episodes'}</span>
                </div>
                {watchlist.length > 0 && (
                  <button onClick={() => { if (window.confirm('Are you sure you want to clear all items from your watchlist?')) clearWatchlist(); }} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl text-white font-medium transition-all flex items-center gap-2 group">
                    <FontAwesomeIcon icon={faTrash} className="text-sm group-hover:scale-110 transition-transform" />
                    <span className="max-sm:hidden">Clear All</span>
                  </button>
                )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {watchlist.map((item) => {
            const progress = watchProgress[item.id];
            const progressPercentage = progress && progress.duration > 0 ? (progress.leftAt / progress.duration) * 100 : 0;

            return (
              <div key={item.id} className="category-card-container group">
                  <div className="w-full h-auto pb-[140%] relative inline-block rounded-xl shadow-lg">
                    <Link to={`/watch/${item.id}?ep=${item.episodeId}`} className="inline-block bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] absolute left-0 top-0 w-full h-full">
                      <img src={item.poster} alt={item.title} className="block w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#E91E63]/20 via-transparent to-transparent pointer-events-none" />
                      <div className="card-shine pointer-events-none"></div>
                      <div className="corner-glow pointer-events-none"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <FontAwesomeIcon icon={faPlay} className="text-white text-5xl max-[450px]:text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" />
                      </div>
                    </Link>

                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-[#e91e63] to-[#00bcd4] rounded-xl shadow-lg z-10">
                      <span className="text-white text-xs font-bold">EP {progress?.episodeNum || item.episodeNum}</span>
                    </div>

                    <button onClick={() => removeFromWatchlist(item.id)} className="absolute top-3 right-3 w-9 h-9 bg-black/80 hover:bg-red-500/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10 hover:border-red-500/50 hover:scale-110 z-10" title="Remove from watchlist">
                      <FontAwesomeIcon icon={faTrash} className="text-sm" />
                    </button>

                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#E91E63]/50 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(233,30,99,0.5)] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-transparent group-hover:border-[#E91E63]/60 rounded-tl-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-[#F06292]/60 rounded-tr-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-[#ec4899]/60 rounded-bl-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-[#FF4081]/60 rounded-br-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-b-2xl">
                      <Link to={`/watch/${item.id}?ep=${item.episodeId}`} className="block">
                        <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-[#e91e63] transition-colors leading-tight">{item.title}</h3>
                      </Link>
                      <div className="flex items-center gap-3 text-white/50 text-xs mb-3">
                        <div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faClock} className="text-[10px]" /><span>{progress ? `Watching EP ${progress.episodeNum}`: `Episode ${item.episodeNum}`}</span></div>
                        {item.addedAt && (<><span className="text-white/20">•</span><div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCalendar} className="text-[10px]" /><span>{formatDate(item.addedAt)}</span></div></>)}
                      </div>
                      {progress && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-white/60 mb-2"><span>Last watched:</span><span className="text-[#e91e63] font-semibold">EP {progress.episodeNum}</span></div>
                          {progress.leftAt > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#e91e63] to-[#00bcd4] rounded-full" style={{ width: `${progressPercentage}%` }} title={`Watched: ${formatTime(progress.leftAt)}`}></div></div>
                              <span className="text-[10px] text-white/50 font-medium min-w-[45px] text-right">{formatTime(progress.leftAt)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <Link to={progress ? `/watch/${item.id}?ep=${progress.episodeId}` : `/watch/${item.id}?ep=${item.episodeId}`} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e91e63]/10 to-[#00bcd4]/10 hover:from-[#e91e63]/20 hover:to-[#00bcd4]/20 border border-[#e91e63]/30 hover:border-[#e91e63]/50 rounded-xl text-white text-sm font-semibold transition-all group/btn">
                        <FontAwesomeIcon icon={faPlay} className="text-xs group-hover/btn:scale-110 transition-transform" />
                        <span>{progress ? 'Continue Watching' : 'Start Watching'}</span>
                      </Link>
                  </div>
              </div>
            )}
          )}
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
