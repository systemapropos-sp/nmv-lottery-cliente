import { motion } from 'framer-motion';
import { PlusCircle, Receipt, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'jugar' | 'jugadas' | 'perfil';
  betCount: number;
  onTabChange?: (tab: 'jugar' | 'jugadas' | 'perfil') => void;
}

export function BottomNav({ activeTab, betCount, onTabChange }: BottomNavProps) {
  const tabs: { key: 'jugar' | 'jugadas' | 'perfil'; label: string; icon: typeof PlusCircle }[] = [
    { key: 'jugar', label: 'JUGAR', icon: PlusCircle },
    { key: 'jugadas', label: 'MIS JUGADAS', icon: Receipt },
    { key: 'perfil', label: 'PERFIL', icon: User },
  ];

  return (
    <motion.nav
      initial={{ y: 64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] lg:hidden"
    >
      <div className="flex h-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className="relative flex-1 flex flex-col items-center justify-center gap-1"
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-teal-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon
                  size={22}
                  className={`transition-colors duration-200 ${isActive ? 'text-teal-600' : 'text-gray-400'}`}
                />
                {/* Bet count badge */}
                {tab.key === 'jugadas' && betCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {betCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-teal-600' : 'text-gray-400'}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
