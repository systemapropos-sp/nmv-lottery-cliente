import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Wallet } from 'lucide-react';
import type { Client } from '@/types';

interface SimpleHeaderProps {
  client: Client;
  onLogout: () => void;
}

export function SimpleHeader({ client, onLogout }: SimpleHeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('es-DO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="shrink-0 h-12 flex items-center justify-between px-3 z-40 relative"
      style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
      }}
    >
      {/* Left: Brand */}
      <div className="flex items-center gap-1.5">
        <span className="text-lg leading-none">🎰</span>
        <span className="text-sm font-bold uppercase tracking-wider text-white">
          NMV LOTTERY
        </span>
      </div>

      {/* Center: Live Clock */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-xs font-semibold tabular-nums text-white/90">
          {formattedTime}
        </span>
      </div>

      {/* Right: User + Balance + Logout */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 backdrop-blur-sm">
          <User size={12} className="text-white" />
          <span className="text-[11px] font-medium text-white hidden xs:inline">{client.name}</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 backdrop-blur-sm">
          <Wallet size={12} className="text-white" />
          <span className="text-[11px] font-semibold tabular-nums text-white">
            RD$ {client.balance.toFixed(0)}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center justify-center rounded-full bg-white/10 p-1.5 text-white transition-all duration-200 hover:bg-white/20"
          title="Cerrar sesion"
        >
          <LogOut size={14} />
        </button>
      </div>
    </motion.header>
  );
}
