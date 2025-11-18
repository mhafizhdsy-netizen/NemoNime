import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronRight } from "react-icons/fa";
import "./CategoryCard.css";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";

const CategoryCard = React.memo(
  ({
    label,
    data,
    showViewMore = true,
    className,
    categoryPage = false,
    cardStyle,
    path,
    limit,
  }) => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    
    if (limit) {
      data = data.slice(0, limit);
    }

    const [itemsToRender, setItemsToRender] = useState({
      firstRow: [],
      remainingItems: [],
    });

    const getItemsToRender = useCallback(() => {
      if (categoryPage) {
        const firstRow =
          window.innerWidth > 758 && data.length > 4 ? data.slice(0, 4) : [];
        const remainingItems =
          window.innerWidth > 758 && data.length > 4
            ? data.slice(4)
            : data.slice(0);
        return { firstRow, remainingItems };
      }
      return { firstRow: [], remainingItems: data.slice(0) };
    }, [categoryPage, data]);

    useEffect(() => {
      const handleResize = () => {
        setItemsToRender(getItemsToRender());
      };
      const newItems = getItemsToRender();
      setItemsToRender((prev) => {
        if (
          JSON.stringify(prev.firstRow) !== JSON.stringify(newItems.firstRow) ||
          JSON.stringify(prev.remainingItems) !==
            JSON.stringify(newItems.remainingItems)
        ) {
          return newItems;
        }
        return prev;
      });

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [getItemsToRender]);

    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-semibold text-2xl text-white max-[478px]:text-[18px] capitalize tracking-wide">
            {label}
          </h1>
          {showViewMore && (
            <Link
              to={`/${path}`}
              className="flex items-center gap-x-1 py-1 px-2 -mr-2 rounded-md
                text-[13px] font-medium text-[#ffffff80] hover:text-white
                transition-all duration-300 group"
            >
              View all
              <FaChevronRight className="text-[10px] transform transition-transform duration-300 
                group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        <>
          {categoryPage && (
            <div
              className={`grid grid-cols-4 gap-x-3 gap-y-8 transition-all duration-300 ease-in-out ${
                categoryPage && itemsToRender.firstRow.length > 0
                  ? "mt-8 max-[758px]:hidden"
                  : ""
              }`}
            >
              {itemsToRender.firstRow.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02]"
                  style={{ height: "fit-content" }}
                >
                  <div className="w-full h-auto pb-[140%] relative inline-block overflow-hidden rounded-2xl shadow-lg group">
                    <div
                      className="inline-block bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] absolute left-0 top-0 w-full h-full group hover:cursor-pointer"
                      onClick={() =>
                        navigate(
                          `${
                            path === "top-upcoming"
                              ? `/${item.id}`
                              : `/watch/${item.id}`
                          }`
                        )
                      }
                    >
                      <img
                        src={`${item.poster}`}
                        alt={item.title}
                        className="block w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                      
                      {/* Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-brand-primary/20 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Shimmer Effect */}
                      <div className="card-shine pointer-events-none"></div>
                      
                      {/* Radial Glow */}
                      <div className="corner-glow pointer-events-none"></div>
                      
                      {/* Enhanced Play Button with Glow */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100 pointer-events-none">
                        <div className="relative">
                          {/* Outer Glow Ring */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63] via-[#F06292] to-[#ec4899] rounded-full blur-xl opacity-75 animate-pulse pointer-events-none"></div>
                          {/* Play Button */}
                          <div className="relative bg-gradient-to-br from-[#E91E63] to-[#F06292] rounded-full p-5 shadow-2xl shadow-[#E91E63]/50 backdrop-blur-sm border-2 border-white/30 hover:scale-110 transition-transform duration-300 pointer-events-none">
                            <FontAwesomeIcon
                              icon={faPlay}
                              className="text-white text-3xl max-[450px]:text-2xl drop-shadow-2xl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 18+ Badge with Enhanced Styling */}
                    {(item.tvInfo?.rating === "18+" || item?.adultContent === true) && (
                      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 backdrop-blur-md rounded-full text-white text-xs font-bold shadow-2xl border border-red-400/50 animate-pulse">
                        18+
                      </div>
                    )}
                    
                    {/* Info Badges - Slide Up on Hover with Stagger */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-600 z-10">
                      <div className="flex items-center justify-start w-full gap-2 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-600 delay-150">
                        {item.tvInfo?.sub && (
                          <div className="flex items-center gap-1.5 h-7 px-3 bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-xl rounded-full border border-emerald-300/50 shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform duration-300">
                            <FontAwesomeIcon icon={faClosedCaptioning} className="text-[10px] text-white drop-shadow-lg" />
                            <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.tvInfo.sub}</span>
                          </div>
                        )}
                        {item.tvInfo?.dub && (
                          <div className="flex items-center gap-1.5 h-7 px-3 bg-gradient-to-r from-orange-500/90 to-amber-500/90 backdrop-blur-xl rounded-full border border-orange-300/50 shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform duration-300">
                            <FontAwesomeIcon icon={faMicrophone} className="text-[10px] text-white drop-shadow-lg" />
                            <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.tvInfo.dub}</span>
                          </div>
                        )}
                        {item.tvInfo?.showType && (
                          <div className="h-7 px-3 flex items-center bg-gradient-to-r from-[#E91E63]/20 to-[#F06292]/20 backdrop-blur-xl rounded-full border border-[#E91E63]/40 shadow-md hover:scale-105 transition-transform duration-300 max-[478px]:hidden">
                            <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.tvInfo.showType.split(" ").shift()}</span>
                          </div>
                        )}
                        {item.releaseDate && (
                          <div className="h-7 px-3 flex items-center bg-gradient-to-r from-[#F06292]/20 to-[#ec4899]/20 backdrop-blur-xl rounded-full border border-[#F06292]/40 shadow-md hover:scale-105 transition-transform duration-300">
                            <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.releaseDate}</span>
                          </div>
                        )}
                        {!item.tvInfo?.showType && item.type && (
                          <div className="h-7 px-3 flex items-center bg-gradient-to-r from-[#FF4081]/20 to-[#E91E63]/20 backdrop-blur-xl rounded-full border border-[#FF4081]/40 shadow-md hover:scale-105 transition-transform duration-300">
                            <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.type}</span>
                          </div>
                        )}
                        {(item.tvInfo?.duration || item.duration) && (
                          <div className="h-7 px-3 flex items-center bg-gradient-to-r from-[#F48FB1]/20 to-[#F06292]/20 backdrop-blur-xl rounded-full border border-[#F48FB1]/40 shadow-md hover:scale-105 transition-transform duration-300 max-[478px]:hidden">
                            <span className="text-[10px] font-bold text-white drop-shadow-lg">
                              {item.tvInfo?.duration === "m" || item.tvInfo?.duration === "?" || item.duration === "m" || item.duration === "?" ? "N/A" : item.tvInfo?.duration || item.duration || "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Animated Border Glow */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#E91E63]/50 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(233,30,99,0.5)] pointer-events-none" />
                    
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-transparent group-hover:border-[#E91E63]/60 rounded-tl-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-[#F06292]/60 rounded-tr-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-[#ec4899]/60 rounded-bl-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-[#FF4081]/60 rounded-br-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                  </div>
                  
                  {/* Title Outside Card */}
                  <div
                    onClick={() =>
                      navigate(
                        `${
                          path === "top-upcoming"
                            ? `/${item.id}`
                            : `/watch/${item.id}`
                        }`
                      )
                    }
                    className="text-white font-semibold mt-4 line-clamp-2 text-sm tracking-wide cursor-pointer hover:text-[#E91E63] transition-colors duration-300"
                  >
                    {language === "EN" ? item.title : item.japanese_title}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={`grid ${cardStyle || 'grid-cols-6 max-[1400px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-3'} gap-x-3 gap-y-8 mt-6 transition-all duration-300 ease-in-out max-[478px]:gap-x-2`}>
            {itemsToRender.remainingItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02]"
                style={{ height: "fit-content" }}
              >
                <div className="w-full h-auto pb-[140%] relative inline-block overflow-hidden rounded-2xl shadow-lg group">
                  <div
                    className="inline-block bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] absolute left-0 top-0 w-full h-full group hover:cursor-pointer"
                    onClick={() =>
                      navigate(
                        `${
                          path === "top-upcoming"
                            ? `/${item.id}`
                            : `/watch/${item.id}`
                        }`
                      )
                    }
                  >
                    <img
                      src={`${item.poster}`}
                      alt={item.title}
                      className="block w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-brand-primary/20 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Shimmer Effect */}
                    <div className="card-shine pointer-events-none"></div>
                    
                    {/* Radial Glow */}
                    <div className="corner-glow pointer-events-none"></div>
                    
                    {/* Enhanced Play Button with Glow */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100 pointer-events-none">
                      <div className="relative">
                        {/* Outer Glow Ring */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63] via-[#F06292] to-[#ec4899] rounded-full blur-xl opacity-75 animate-pulse pointer-events-none"></div>
                        {/* Play Button */}
                        <div className="relative bg-gradient-to-br from-[#E91E63] to-[#F06292] rounded-full p-5 shadow-2xl shadow-[#E91E63]/50 backdrop-blur-sm border-2 border-white/30 hover:scale-110 transition-transform duration-300 pointer-events-none">
                          <FontAwesomeIcon
                            icon={faPlay}
                            className="text-white text-3xl max-[450px]:text-2xl drop-shadow-2xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 18+ Badge with Enhanced Styling */}
                  {(item.tvInfo?.rating === "18+" || item?.adultContent === true) && (
                    <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 backdrop-blur-md rounded-full text-white text-xs font-bold shadow-2xl border border-red-400/50 animate-pulse">
                      18+
                    </div>
                  )}
                  
                  {/* Info Badges - Slide Up on Hover with Stagger */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-600 z-10">
                    <div className="flex items-center justify-start w-full gap-2 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-600 delay-150">
                      {item.tvInfo?.sub && (
                        <div className="flex items-center gap-1.5 h-7 px-3 bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-xl rounded-full border border-emerald-300/50 shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform duration-300">
                          <FontAwesomeIcon icon={faClosedCaptioning} className="text-[10px] text-white drop-shadow-lg" />
                          <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.tvInfo.sub}</span>
                        </div>
                      )}
                      {item.tvInfo?.dub && (
                        <div className="flex items-center gap-1.5 h-7 px-3 bg-gradient-to-r from-orange-500/90 to-amber-500/90 backdrop-blur-xl rounded-full border border-orange-300/50 shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform duration-300">
                          <FontAwesomeIcon icon={faMicrophone} className="text-[10px] text-white drop-shadow-lg" />
                          <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.tvInfo.dub}</span>
                        </div>
                      )}
                      {item.tvInfo?.showType && (
                        <div className="h-7 px-3 flex items-center bg-gradient-to-r from-[#E91E63]/20 to-[#F06292]/20 backdrop-blur-xl rounded-full border border-[#E91E63]/40 shadow-md hover:scale-105 transition-transform duration-300 max-[478px]:hidden">
                          <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.tvInfo.showType.split(" ").shift()}</span>
                        </div>
                      )}
                      {item.releaseDate && (
                        <div className="h-7 px-3 flex items-center bg-gradient-to-r from-[#F06292]/20 to-[#ec4899]/20 backdrop-blur-xl rounded-full border border-[#F06292]/40 shadow-md hover:scale-105 transition-transform duration-300">
                          <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.releaseDate}</span>
                        </div>
                      )}
                      {!item.tvInfo?.showType && item.type && (
                        <div className="h-7 px-3 flex items-center bg-gradient-to-r from-[#FF4081]/20 to-[#E91E63]/20 backdrop-blur-xl rounded-full border border-[#FF4081]/40 shadow-md hover:scale-105 transition-transform duration-300">
                          <span className="text-[10px] font-bold text-white drop-shadow-lg">{item.type}</span>
                        </div>
                      )}
                      {(item.tvInfo?.duration || item.duration) && (
                        <div className="h-7 px-3 flex items-center bg-gradient-to-r from-[#F48FB1]/20 to-[#F06292]/20 backdrop-blur-xl rounded-full border border-[#F48FB1]/40 shadow-md hover:scale-105 transition-transform duration-300 max-[478px]:hidden">
                          <span className="text-[10px] font-bold text-white drop-shadow-lg">
                            {item.tvInfo?.duration === "m" || item.tvInfo?.duration === "?" || item.duration === "m" || item.duration === "?" ? "N/A" : item.tvInfo?.duration || item.duration || "N/A"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#E91E63]/50 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(233,30,99,0.5)] pointer-events-none" />
                  
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-transparent group-hover:border-[#E91E63]/60 rounded-tl-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-[#F06292]/60 rounded-tr-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-[#ec4899]/60 rounded-bl-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-[#FF4081]/60 rounded-br-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                </div>
                
                {/* Title Outside Card */}
                <div
                  onClick={() =>
                    navigate(
                      `${
                        path === "top-upcoming"
                          ? `/${item.id}`
                          : `/watch/${item.id}`
                      }`
                    )
                  }
                  className="text-white font-semibold mt-4 line-clamp-2 text-sm tracking-wide cursor-pointer hover:text-[#E91E63] transition-colors duration-300"
                >
                  {language === "EN" ? item.title : item.japanese_title}
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
    );
  }
);

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;


