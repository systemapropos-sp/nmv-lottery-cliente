import { useEffect, useState } from 'react';
import { LogOut, User, Wallet, History } from 'lucide-react';
import type { Client } from '@/types';

interface SimpleHeaderProps {
  client: Client;
  onLogout: () => void;
  ticketCount: number;
  onShowHistory: () => void;
}

export function SimpleHeader({ client, onLogout, ticketCount, onShowHistory }: SimpleHeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('es-DO', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });

  return (
    <header className="shrink-0 h-12 flex items-center justify-between px-3 z-40 relative"
      style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
      <div className="flex items-center gap-1.5">
        <span className="text-lg leading-none">🎰</span>
        <span className="text-sm font-bold uppercase tracking-wider text-white">NMV LOTTERY</span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-xs font-semibold tabular-nums text-white/90">{formattedTime}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* History button */}
        <button onClick={onShowHistory}
          className="relative flex items-center justify-center rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
          title="Historial de tickets">
          <History size={14} />
          {ticketCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-[9px] font-bold text-gray-900 flex items-center justify-center">
              {ticketCount > 9 ? '9+' : ticketCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 backdrop-blur-sm">
          <User size={12} className="text-white" />
          <span className="text-[11px] font-medium text-white hidden xs:inline">{client.name}</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 backdrop-blur-sm">
          <Wallet size={12} className="text-white" />
          <span className="text-[11px] font-semibold tabular-nums text-white">RD$ {client.balance.toFixed(0)}</span>
        </div>
        <button onClick={onLogout}
          className="flex items-center justify-center rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
          title="Cerrar sesion">
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
