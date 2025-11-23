import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import "@/components/categorycard/CategoryCard.css"; // Re-use CategoryCard styles

const ContinueWatching = () => {
  const [watchList, setWatchList] = useState([]);
  const { language } = useLanguage();
  const swiperRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("continueWatching") || "[]");
    setWatchList(data);
  }, []);

  const memoizedWatchList = useMemo(() => watchList, [watchList]);

  const removeFromWatchList = (episodeId) => {
    setWatchList((prevList) => {
      const updatedList = prevList.filter((item) => item.episodeId !== episodeId);
      localStorage.setItem("continueWatching", JSON.stringify(updatedList));
      return updatedList;
    });
  };

  if (memoizedWatchList.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between max-md:pl-4 mb-6">
        <div className="flex items-center gap-x-3 justify-center">
          <FaHistory className="text-gray-200 text-xl" />
          <h1 className="text-gray-200 text-2xl font-bold tracking-tight max-[450px]:text-xl max-[450px]:mb-1 max-[350px]:text-lg">Continue Watching</h1>
        </div>
        <div className="flex gap-x-3 pr-2 max-[350px]:hidden">
          <button className="continue-btn-prev bg-gradient-to-r from-[#e91e63]/20 to-[#00bcd4]/20 border border-[#e91e63]/30 text-white p-3 rounded-xl hover:from-[#e91e63]/30 hover:to-[#00bcd4]/30 hover:border-[#e91e63]/50 transition-all duration-300 shadow-lg hover:shadow-[#e91e63]/20"><FaChevronLeft className="text-sm" /></button>
          <button className="continue-btn-next bg-gradient-to-r from-[#e91e63]/20 to-[#00bcd4]/20 border border-[#e91e63]/30 text-white p-3 rounded-xl hover:from-[#e91e63]/30 hover:to-[#00bcd4]/30 hover:border-[#e91e63]/50 transition-all duration-300 shadow-lg hover:shadow-[#e91e63]/20"><FaChevronRight className="text-sm" /></button>
        </div>
      </div>

      <div className="relative mx-auto z-[1]">
        <Swiper
          ref={swiperRef}
          className="w-full h-full !overflow-visible"
          slidesPerView={3}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 4, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 24 },
            1300: { slidesPerView: 6, spaceBetween: 24 },
            1600: { slidesPerView: 7, spaceBetween: 28 },
          }}
          modules={[Navigation]}
          navigation={{ nextEl: ".continue-btn-next", prevEl: ".continue-btn-prev" }}
        >
          {memoizedWatchList.slice().reverse().map((item, index) => (
            <SwiperSlide key={index} className="text-center flex justify-center items-center">
                <div className="category-card-container group w-full">
                    <div className="w-full h-auto pb-[140%] relative inline-block rounded-xl shadow-lg">
                        <Link to={`/watch/${item?.id}?ep=${item.episodeId}`} className="inline-block bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] absolute left-0 top-0 w-full h-full">
                            <img src={`${item?.poster}`} alt={item?.title} className="block w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110" title={item?.title} loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-brand-primary/20 via-transparent to-transparent pointer-events-none" />
                            <div className="card-shine pointer-events-none"></div>
                            <div className="corner-glow pointer-events-none"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <FontAwesomeIcon icon={faPlay} className="text-white text-5xl max-[450px]:text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" />
                            </div>
                        </Link>
                        <button className="absolute top-3 right-3 bg-black/70 text-gray-300 w-8 h-8 flex items-center justify-center rounded-xl text-sm z-10 font-medium hover:bg-white hover:text-black transition-all duration-300" onClick={() => removeFromWatchList(item.episodeId)}>✖</button>
                        {item?.adultContent === true && (
                            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 backdrop-blur-md rounded-full text-white text-xs font-bold shadow-2xl border border-red-400/50 animate-pulse pointer-events-none">18+</div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-3 pb-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
                            <p className="text-white text-[15px] font-bold text-left truncate mb-1.5 max-[450px]:text-sm drop-shadow-lg">{language === "EN" ? item?.title : item?.japanese_title}</p>
                            <p className="text-gray-200 text-[13px] font-semibold text-left max-[450px]:text-[12px] drop-shadow-md">Episode {item.episodeNum}</p>
                        </div>
                        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-brand-primary/50 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(233,30,99,0.5)] pointer-events-none" />
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-transparent group-hover:border-brand-primary/60 rounded-tl-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-brand-secondary/60 rounded-tr-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-brand-tertiary/60 rounded-bl-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-brand-accent/60 rounded-br-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                    </div>
                </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ContinueWatching;
