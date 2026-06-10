import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Wallet, LogOut } from 'lucide-react';
import { SlotMachineIcon } from './icons';
import type { Client } from '@/types';

interface NavbarProps {
  client: Client;
  onLogout: () => void;
}

export function Navbar({ client, onLogout }: NavbarProps) {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="fixed top-0 left-0 right-0 z-40 h-14 lg:h-16"
      style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <SlotMachineIcon size={28} className="text-white" />
          <span className="text-[22px] font-bold uppercase tracking-[0.08em] text-white">
            NMV LOTTERY
          </span>
        </div>

        {/* Center: Live Clock */}
        <div className="hidden sm:block">
          <span className="text-sm font-semibold tabular-nums text-white">
            {formattedTime}
          </span>
        </div>

        {/* Right: User + Balance + Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
            <User size={14} className="text-white" />
            <span className="text-xs font-medium text-white">{client.name}</span>
          </div>

          <div className="hidden items-center gap-1 rounded-full bg-white px-3 py-1 sm:flex">
            <Wallet size={14} className="text-teal-700" />
            <span className="text-xs font-semibold tabular-nums text-teal-700">
              RD$ {client.balance.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-full bg-white/10 p-2 text-white transition-all duration-200 hover:bg-white/20 hover:brightness-110"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
