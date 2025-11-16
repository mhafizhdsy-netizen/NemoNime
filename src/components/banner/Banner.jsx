import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
  faCalendar,
  faClock,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import { Play, Info, Star } from "lucide-react";
import "./Banner.css";

function Banner({ item, index }) {
  const { language } = useLanguage();
  return (
    <section className="spotlight-modern w-full h-full relative rounded-2xl overflow-hidden group">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={`${item.poster}`}
          alt={item.title}
          className="spotlight-image w-full h-full object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      {/* Enhanced Gradient Overlay */}
      <div className="spotlight-overlay-modern absolute inset-0 z-[1]"></div>
      
      {/* Animated Glow Effect */}
      <div className="spotlight-glow absolute inset-0 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content Container */}
      <div className="absolute flex flex-col left-0 bottom-0 w-[55%] p-8 z-[2] max-[1390px]:w-[50%] max-[1300px]:w-[600px] max-[1120px]:w-[65%] max-md:w-[90%] max-md:p-6 max-[300px]:w-full">
        {/* Spotlight Badge with Animation */}
        <div className="flex items-center gap-3 mb-4 animate-fade-in">
          <div className="spotlight-badge">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-sm">#{index + 1} SPOTLIGHT</span>
          </div>
          {item.tvInfo?.rating && (
            <div className="px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/40 backdrop-blur-sm">
              <span className="text-brand-primary text-xs font-bold">{item.tvInfo.rating}</span>
            </div>
          )}
        </div>

        {/* Title with Gradient */}
        <h3 className="spotlight-title text-white line-clamp-2 text-5xl font-bold text-left max-[1390px]:text-[45px] max-[1300px]:text-3xl max-md:text-2xl max-[575px]:text-[22px] max-sm:leading-6 max-sm:w-[80%] max-[320px]:w-full">
          {language === "EN" ? item.title : item.japanese_title}
        </h3>
        
        {/* Mobile Buttons */}
        <div className="hidden max-md:flex max-md:mt-4 max-md:gap-x-3 max-md:w-full">
          <Link
            to={`/watch/${item.id}`}
            className="spotlight-btn-primary flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
          >
            <Play className="w-4 h-4" />
            <span>Watch Now</span>
          </Link>
          <Link
            to={`/${item.id}`}
            className="spotlight-btn-secondary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
          >
            <Info className="w-4 h-4" />
          </Link>
        </div>

        {/* Info Tags */}
        <div className="flex h-fit justify-start items-center flex-wrap gap-3 mt-5 max-[1300px]:mt-4 max-md:hidden">
          {item.tvInfo && (
            <>
              {item.tvInfo.showType && (
                <div className="spotlight-info-tag">
                  <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                  <span>{item.tvInfo.showType}</span>
                </div>
              )}

              {item.tvInfo.duration && (
                <div className="spotlight-info-tag">
                  <FontAwesomeIcon icon={faClock} className="text-[12px]" />
                  <span>{item.tvInfo.duration}</span>
                </div>
              )}

              {item.tvInfo.releaseDate && (
                <div className="spotlight-info-tag">
                  <FontAwesomeIcon icon={faCalendar} className="text-[12px]" />
                  <span>{item.tvInfo.releaseDate}</span>
                </div>
              )}

              {item.tvInfo.quality && (
                <div className="spotlight-quality-badge">
                  {item.tvInfo.quality}
                </div>
              )}

              {(item.tvInfo.episodeInfo?.sub || item.tvInfo.episodeInfo?.dub) && (
                <div className="flex gap-1">
                  {item.tvInfo.episodeInfo?.sub && (
                    <div className="spotlight-episode-badge">
                      <FontAwesomeIcon icon={faClosedCaptioning} className="text-[11px]" />
                      <span>{item.tvInfo.episodeInfo.sub}</span>
                    </div>
                  )}
                  {item.tvInfo.episodeInfo?.dub && (
                    <div className="spotlight-episode-badge">
                      <FontAwesomeIcon icon={faMicrophone} className="text-[11px]" />
                      <span>{item.tvInfo.episodeInfo.dub}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Description */}
        <p className="spotlight-description text-white/80 text-base mt-4 text-left line-clamp-3 max-[1200px]:line-clamp-2 max-[1300px]:w-[500px] max-[1120px]:w-[90%] max-md:hidden leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Desktop Action Buttons */}
      <div className="absolute bottom-[50px] right-[40px] flex gap-x-4 z-[2] max-md:hidden">
        <Link
          to={`/watch/${item.id}`}
          className="spotlight-btn-primary flex items-center gap-3 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-2xl"
        >
          <Play className="w-5 h-5" />
          <span>Watch Now</span>
        </Link>
        <Link
          to={`/${item.id}`}
          className="spotlight-btn-secondary flex items-center gap-3 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
        >
          <Info className="w-5 h-5" />
          <span>Details</span>
        </Link>
      </div>
    </section>
  );
}

export default Banner;