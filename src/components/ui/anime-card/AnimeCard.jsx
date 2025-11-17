import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClosedCaptioning,
  faMicrophone,
  faPlay,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/src/context/LanguageContext';
import { cn } from '@/lib/utils';
import './AnimeCard.css';

function AnimeCard({ item, path = '', className }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [ratingClicked, setRatingClicked] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation angles
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    // Apply transform directly to the element
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateZ(20px)`;
    card.style.transition = 'transform 0.1s ease-out';
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)';
    card.style.transition = 'transform 0.4s ease-out';
  };

  const handleClick = () => {
    navigate(
      path === 'top-upcoming' ? `/${item.id}` : `/watch/${item.id}`
    );
  };

  return (
    <>
      <div className={cn('anime-card-wrapper', className)}>
        <div
          ref={cardRef}
          className="anime-card-3d anime-card-glow"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
        <div
          className="relative w-full pb-[140%] rounded-xl overflow-hidden cursor-pointer group"
          onClick={handleClick}
        >
          {/* Image */}
          <img
            src={item.poster}
            alt={item.title}
            className="card-image absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="card-overlay" />

          {/* Rating Badge */}
          {item.rating && (
            <div 
              className={`absolute top-3 right-3 z-10 px-2.5 py-1 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg cursor-pointer overflow-hidden ${
                ratingClicked ? 'animate-rating-click' : ''
              } hover:scale-110 transition-transform duration-200`}
              onClick={(e) => {
                e.stopPropagation();
                setRatingClicked(true);
                setTimeout(() => setRatingClicked(false), 600);
              }}
            >
              {/* Ripple Effect */}
              {ratingClicked && (
                <span className="absolute inset-0 bg-white/30 rounded-xl animate-ripple"></span>
              )}
              <FontAwesomeIcon icon={faStar} className={`text-[10px] relative z-10 ${ratingClicked ? 'animate-star-pulse' : ''}`} />
              <span className="relative z-10">{item.rating}</span>
            </div>
          )}

          {/* 18+ Badge */}
          {(item.tvInfo?.rating === '18+' || item?.adultContent === true) && (
            <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-xl bg-red-600 text-white text-xs font-bold">
              18+
            </div>
          )}

          {/* Play Button */}
          <div className="play-button absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-brand-primary/90 backdrop-blur-sm rounded-full p-4 shadow-2xl">
              <FontAwesomeIcon
                icon={faPlay}
                className="text-white text-2xl"
              />
            </div>
          </div>

          {/* Info Badges */}
          <div className="info-badges card-content absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-start flex-wrap gap-1.5">
              {item.tvInfo?.sub && (
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                  <FontAwesomeIcon
                    icon={faClosedCaptioning}
                    className="text-[10px] text-white"
                  />
                  <span className="text-[10px] font-medium text-white">
                    {item.tvInfo.sub}
                  </span>
                </div>
              )}
              {item.tvInfo?.dub && (
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className="text-[10px] text-white"
                  />
                  <span className="text-[10px] font-medium text-white">
                    {item.tvInfo.dub}
                  </span>
                </div>
              )}
              {item.tvInfo?.showType && (
                <div className="bg-black/60 backdrop-blur-sm text-white rounded-lg px-2 py-1 text-[10px] font-medium">
                  {item.tvInfo.showType.split(' ').shift()}
                </div>
              )}
              {item.releaseDate && (
                <div className="bg-black/60 backdrop-blur-sm text-white rounded-lg px-2 py-1 text-[10px] font-medium">
                  {item.releaseDate}
                </div>
              )}
              {!item.tvInfo?.showType && item.type && (
                <div className="bg-black/60 backdrop-blur-sm text-white rounded-lg px-2 py-1 text-[10px] font-medium">
                  {item.type}
                </div>
              )}
              {(item.tvInfo?.duration || item.duration) && (
                <div className="bg-black/60 backdrop-blur-sm text-white rounded-lg px-2 py-1 text-[10px] font-medium">
                  {item.tvInfo?.duration === 'm' ||
                  item.tvInfo?.duration === '?' ||
                  item.duration === 'm' ||
                  item.duration === '?'
                    ? 'N/A'
                    : item.tvInfo?.duration || item.duration || 'N/A'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title - Hidden on Desktop, shown on Mobile */}
        <Link
          to={`/${item.id}`}
          className="block mt-3 text-white font-semibold hover:text-brand-primary transition-colors line-clamp-1 md:hidden"
        >
          {language === 'EN' ? item.title : item.japanese_title}
        </Link>

        {/* Description - Hidden on Desktop, shown on Mobile */}
        {item.description && (
          <p className="mt-2 text-sm text-gray-400 line-clamp-2 md:hidden">
            {item.description}
          </p>
        )}
        </div>
      </div>

    </>
  );
}

export default AnimeCard;
