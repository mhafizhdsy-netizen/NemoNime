'use client';

import website_name from "@/config/website.js";
import Spotlight from "@/components/spotlight/Spotlight.jsx";
import Trending from "@/components/trending/Trending.jsx";
import CategoryCard from "@/components/categorycard/CategoryCard.jsx";
import Genre from "@/components/genres/Genre.jsx";
import Topten from "@/components/topten/Topten.jsx";
import HomeLoader from "@/components/Loader/Home.loader.jsx";
import Error from "@/components/error/Error.jsx";
import { useHomeInfo } from "@/context/HomeInfoContext.jsx";
import ContinueWatching from "@/components/continue/ContinueWatching";
import TabbedAnimeSection from "@/components/tabbed-anime/TabbedAnimeSection";

function Home() {
  const { homeInfo, homeInfoLoading, error } = useHomeInfo();
  
  if (homeInfoLoading) return <HomeLoader />;
  if (error) return <Error />;
  if (!homeInfo) return <Error error="404" />;
  
  try {
    return (
      <>
        <div id="main-content" className="pt-16 w-full">
          <Spotlight spotlights={homeInfo.spotlights} />
          <div className="mt-6">
            <Genre data={homeInfo.genres} />
          </div>
          <ContinueWatching />
          
          <div className="w-full grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex flex-col">
            <div>
              <CategoryCard
                label="Latest Episode"
                data={homeInfo.latest_episode}
                className="mt-[60px]"
                path="recently-updated"
                limit={12}
              />
            

              <TabbedAnimeSection 
                topAiring={homeInfo.top_airing}
                mostFavorite={homeInfo.most_favorite}
                latestCompleted={homeInfo.latest_completed}
                className="mt-8"
              />
            </div>
            <div className="w-full mt-[60px]">
              <Trending trending={homeInfo.trending} />
              <Topten data={homeInfo.topten} className="mt-12" />
            </div>
          </div>
        </div>
      </>
    );
  } catch (err) {
    console.error("Error in Home component:", err);
    return <Error error="500" />;
  }
}

export default Home;