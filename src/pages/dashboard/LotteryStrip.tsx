import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Lottery } from '@/types';

interface LotteryStripProps {
  lotteries: Lottery[];
  selectedLottery: Lottery;
  onSelect: (lottery: Lottery) => void;
}

function useCountdown(closingTime: string): { text: string; isClosingSoon: boolean; isClosed: boolean } {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [hours, minutes] = closingTime.split(':').map(Number);
  const closing = new Date();
  closing.setHours(hours, minutes, 0, 0);

  if (closing < now) {
    closing.setDate(closing.getDate() + 1);
  }

  const diffMs = closing.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffSeconds = Math.floor((diffMs % 60000) / 1000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMs <= 0) {
    return { text: 'CERRADA', isClosingSoon: false, isClosed: true };
  }

  if (diffHours >= 1) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const displayMin = minutes.toString().padStart(2, '0');
    return { text: `Cierra: ${displayHour}:${displayMin} ${ampm}`, isClosingSoon: false, isClosed: false };
  }

  if (diffMinutes < 15) {
    return {
      text: `${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`,
      isClosingSoon: true,
      isClosed: false,
    };
  }

  return {
    text: `${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`,
    isClosingSoon: false,
    isClosed: false,
  };
}

function LotteryCard({
  lottery,
  isSelected,
  onClick,
  index,
}: {
  lottery: Lottery;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const countdown = useCountdown(lottery.closingTime);

  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: countdown.isClosed ? 0.6 : 1 }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
      onClick={countdown.isClosed ? undefined : onClick}
      className="group relative mr-2.5 shrink-0 cursor-pointer scroll-snap-align-start sm:mr-3"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div
        className={`
          relative overflow-hidden rounded-[10px] border p-2.5 sm:p-3
          transition-all duration-200
          w-[140px] h-[82px] sm:w-[160px] sm:h-[90px]
          ${countdown.isClosed
            ? 'bg-gray-50 border-gray-200 pointer-events-none'
            : countdown.isClosingSoon
              ? 'bg-amber-50 border-amber-300'
              : isSelected
                ? 'bg-teal-50 border-2 border-teal-600 shadow-[0_2px_8px_rgba(13,148,136,0.15)]'
                : 'bg-white border-gray-200 hover:border-teal-300 hover:shadow-md'
          }
        `}
      >
        {/* Left accent bar for selected */}
        {isSelected && !countdown.isClosed && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-l-[10px]" />
        )}

        {/* Closing soon pulsing dot */}
        {countdown.isClosingSoon && (
          <div className="absolute top-2 right-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          </div>
        )}

        {/* CERRADA overlay */}
        {countdown.isClosed && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-[11px] font-bold uppercase text-red-500 bg-white/80 px-2 py-0.5 rounded">
              CERRADA
            </span>
          </div>
        )}

        <div className="flex flex-col h-full justify-between">
          <p className={`text-xs font-bold truncate ${countdown.isClosed ? 'text-gray-400' : 'text-gray-800'}`}>
            {lottery.name}
          </p>
          <p className={`text-[10px] ${countdown.isClosed ? 'text-gray-300' : 'text-gray-400'}`}>
            Sorteo
          </p>
          <p className={`
            text-sm font-bold tabular-nums
            ${countdown.isClosed ? 'text-gray-400' : countdown.isClosingSoon ? 'text-amber-600' : isSelected ? 'text-teal-600' : 'text-teal-600'}
          `}>
            {countdown.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function LotteryStrip({ lotteries, selectedLottery, onSelect }: LotteryStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-14 lg:top-16 z-30 bg-white border-b border-gray-200 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <div className="relative max-w-7xl mx-auto">
        {/* Left gradient + button */}
        {canScrollLeft && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          </>
        )}

        {/* Right gradient + button */}
        {canScrollRight && (
          <>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar px-4 py-0.5"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {lotteries.map((lottery, index) => (
            <LotteryCard
              key={lottery.id}
              lottery={lottery}
              isSelected={selectedLottery.id === lottery.id}
              onClick={() => onSelect(lottery)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
