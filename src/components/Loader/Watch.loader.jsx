import { Skeleton } from "../ui/Skeleton/Skeleton";
import SidecardLoader from "./Sidecard.loader";

function WatchLoader() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      <div className="w-full max-w-[1920px] mx-auto pt-24 pb-6 px-4 max-[1200px]:pt-20 max-[1200px]:px-3">
        <div className="grid grid-cols-[minmax(0,70%),minmax(0,30%)] gap-6 w-full h-full max-[1200px]:flex max-[1200px]:flex-col">
          {/* Left Column - Player, Controls, Servers */}
          <div className="flex flex-col w-full gap-6">
            {/* Player Skeleton */}
            <div className="w-full bg-gradient-to-br from-black via-[#0a0a0a] to-black flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/5">
              {/* Video Container */}
              <Skeleton className="w-full aspect-video rounded-none" />

              {/* Controls Section */}
              <div className="bg-gradient-to-b from-[#0f0f0f] to-[#121212] border-t border-white/5 p-3">
                {/* Watch Controls */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-2">
                    <Skeleton className="w-24 h-8 rounded-lg" />
                    <Skeleton className="w-24 h-8 rounded-lg" />
                    <Skeleton className="w-24 h-8 rounded-lg" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="w-10 h-8 rounded-lg" />
                    <Skeleton className="w-10 h-8 rounded-lg" />
                  </div>
                </div>

                {/* Watchlist and Download Buttons */}
                <div className="flex gap-3 mb-3">
                  <Skeleton className="w-40 h-10 rounded-xl" />
                  <Skeleton className="w-32 h-10 rounded-xl" />
                </div>

                {/* Server Selection */}
                <div className="space-y-2">
                  <Skeleton className="w-32 h-5 rounded-lg" />
                  <div className="flex gap-2 flex-wrap">
                    {[...Array(6)].map((_, idx) => (
                      <Skeleton key={idx} className="w-20 h-8 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-only Seasons Section */}
            <div className="hidden max-[1200px]:block bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl p-4 border border-white/5">
              <Skeleton className="w-40 h-6 mb-4 rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, idx) => (
                  <Skeleton key={idx} className="w-full aspect-[3/1] rounded-xl" />
                ))}
              </div>
            </div>

            {/* Mobile-only Episodes Section */}
            <div className="hidden max-[1200px]:block bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl p-4 border border-white/5">
              <Skeleton className="w-32 h-6 mb-4 rounded-xl" />
              <div className="space-y-2 max-h-[400px] overflow-hidden">
                {[...Array(8)].map((_, idx) => (
                  <Skeleton key={idx} className="w-full h-12 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Anime Info Section */}
            <div className="bg-gradient-to-br from-[#141414] via-[#1a1a1a] to-[#141414] rounded-xl p-5 border border-white/5">
              <div className="flex gap-6 max-[600px]:gap-4">
                {/* Poster */}
                <Skeleton className="w-[120px] h-[180px] rounded-xl flex-shrink-0 max-[600px]:w-[100px] max-[600px]:h-[150px]" />

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <Skeleton className="w-3/4 h-7 rounded-xl" />
                  <div className="flex gap-2 flex-wrap">
                    {[...Array(4)].map((_, idx) => (
                      <Skeleton key={idx} className="w-16 h-6 rounded-full" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4 rounded-xl" />
                    <Skeleton className="w-full h-4 rounded-xl" />
                    <Skeleton className="w-3/4 h-4 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop-only Seasons Section */}
            <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl p-5 max-[1200px]:hidden border border-white/5">
              <Skeleton className="w-40 h-6 mb-4 rounded-xl" />
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(4)].map((_, idx) => (
                  <Skeleton key={idx} className="w-full aspect-[3/1] rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Episodes and Related (Desktop Only) */}
          <div className="flex flex-col gap-6 h-full max-[1200px]:hidden">
            {/* Episodes Section */}
            <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl overflow-hidden border border-white/5 p-4">
              <Skeleton className="w-32 h-6 mb-4 rounded-xl" />
              <div className="space-y-2 max-h-[600px] overflow-hidden">
                {[...Array(12)].map((_, idx) => (
                  <Skeleton key={idx} className="w-full h-12 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Related Anime Section */}
            <SidecardLoader />
          </div>

          {/* Mobile-only Related Section */}
          <div className="hidden max-[1200px]:block">
            <SidecardLoader />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchLoader;
