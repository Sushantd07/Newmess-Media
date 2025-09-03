import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const trendingData = [
  { name: "Jio", value: "1,234 searches" },
  { name: "ICICI Bank", value: "998 searches" },
  { name: "Amazon", value: "1,560 searches" },
  { name: "Apollo Hospital", value: "1,105 searches" },
  { name: "Airtel", value: "870 searches" },
  { name: "Tata Motors", value: "750 searches" },
  { name: "Zomato", value: "1,320 searches" },
  { name: "Swiggy", value: "1,040 searches" },
];

const TrendingTicker = () => {
  const [isPaused, setIsPaused] = useState(false);
  const infiniteData = [...trendingData, ...trendingData];

  return (
    <div className="relative bg-[#fdf7f1] border-y border-gray-300 overflow-hidden z-40 h-[62px]">
      {/* Top shadow */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-10" />
      {/* Bottom shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-10" />

      <div className="max-w-9xl mx-auto flex items-center px-3 md:px-4 py-2 overflow-hidden relative">
        {/* Label */}
        <div className="hidden md:flex items-center text-orange-700 font-semibold text-sm md:text-base mr-6 whitespace-nowrap shrink-0">
          <TrendingUp className="h-4 w-4 mr-1 text-orange-700" />
          Trending Searches:
        </div>

        {/* Marquee */}
        <div className="flex-1 overflow-hidden">
          <div
            className={`flex w-max space-x-3 md:space-x-4 ${isPaused ? '' : 'animate-marquee'} overflow-visible py-2 transition-opacity duration-300`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              opacity: isPaused ? 0.7 : 1,
            }}
          >
            {infiniteData.map((item, index) => (
              <a
                key={index}
                href="#"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onMouseDown={() => setIsPaused(true)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                className="flex items-center px-3 md:px-4 py-1.5 border border-gray-200 bg-white rounded-full text-xs md:text-sm text-gray-900 font-medium 
                  shadow-sm hover:shadow-lg hover:border-orange-400 hover:scale-105 hover:bg-gradient-to-r hover:from-orange-50 hover:to-white 
                  transition-all duration-300 whitespace-nowrap shrink-0"
              >
                <span className="mr-2 font-semibold hover:text-orange-600 transition-colors">{item.name}</span>
                <span className="text-gray-500 text-[10px] md:text-xs">({item.value})</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingTicker;