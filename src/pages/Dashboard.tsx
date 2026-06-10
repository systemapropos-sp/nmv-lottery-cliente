import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { lotteries } from '@/data/lotteries';
import { LotteryStrip } from './dashboard/LotteryStrip';
import { BetEntryForm } from './dashboard/BetEntryForm';
import { BetTables } from './dashboard/BetTables';
import { SummaryBar } from './dashboard/SummaryBar';
import { TicketModal } from './dashboard/TicketModal';
import { BottomNav } from './dashboard/BottomNav';
import type { Bet, BetType, Lottery } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

let toastIdCounter = 0;

export default function Dashboard() {
  const navigate = useNavigate();
  const { client } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!client) {
      navigate('/login');
    }
  }, [client, navigate]);

  // State
  const [bets, setBets] = useState<Bet[]>([]);
  const [selectedLottery, setSelectedLottery] = useState<Lottery>(lotteries[0]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTab, setActiveTab] = useState<'jugar' | 'jugadas' | 'perfil'>('jugar');

  // Get first open lottery as default
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const openLottery = lotteries.find((l) => {
      const [h, m] = l.closingTime.split(':').map(Number);
      return h * 60 + m > currentHour * 60 + currentMinute;
    });

    if (openLottery) {
      setSelectedLottery(openLottery);
    }
  }, []);

  const totalBets = bets.length;
  const totalAmount = useMemo(() => bets.reduce((sum, b) => sum + b.amount, 0), [bets]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const handleAddBet = useCallback(
    (numbers: string, type: BetType, amount: number) => {
      if (!client) return;

      const newBet: Bet = {
        id: `bet-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        numbers,
        type,
        lotteryId: selectedLottery.id,
        lotteryName: selectedLottery.shortName,
        amount,
        createdAt: new Date(),
      };

      setBets((prev) => [...prev, newBet]);
      addToast('Jugada agregada', 'success');
    },
    [client, selectedLottery, addToast]
  );

  const handleDeleteBet = useCallback((id: string) => {
    setBets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleCreateTicket = useCallback(() => {
    if (bets.length === 0) return;
    setShowTicketModal(true);
  }, [bets.length]);

  const handleSendWhatsApp = useCallback(() => {
    if (!client || bets.length === 0) return;

    const ticketId = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-DO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Group bets by type
    const grouped: Record<string, Bet[]> = {};
    for (const bet of bets) {
      if (!grouped[bet.type]) grouped[bet.type] = [];
      grouped[bet.type].push(bet);
    }

    const typeLabels: Record<string, string> = {
      directo: 'DIRECTO',
      pale: 'PALE',
      tripleta: 'TRIPLETA',
      cash3: 'CASH 3',
      play4: 'PLAY 4',
      pick5: 'PICK 5',
    };

    let message = `*NMV LOTTERY - Ticket #${ticketId}*\n`;
    message += `Cliente: ${client.name}\n`;
    message += `Fecha: ${formattedDate} ${formattedTime}\n\n`;

    for (const [type, typeBets] of Object.entries(grouped)) {
      message += `*${typeLabels[type] || type}:*\n`;
      for (const bet of typeBets) {
        message += `${bet.numbers} - ${bet.lotteryName} - RD$${bet.amount.toFixed(2)}\n`;
      }
      message += '\n';
    }

    message += `*Total: RD$${totalAmount.toFixed(2)}*\n\n`;
    message += `Juegue con responsabilidad. NMV Lottery!`;

    const encodedMessage = encodeURIComponent(message);
    const phone = client.vendorPhone.replace(/\D/g, '');
    const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');

    setShowTicketModal(false);
    setBets([]);
    addToast('Abriendo WhatsApp...', 'success');
  }, [client, bets, totalAmount, addToast]);

  if (!client) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col min-h-[100dvh] bg-emerald-50"
    >
      {/* Lottery Selector Strip */}
      <LotteryStrip
        lotteries={lotteries}
        selectedLottery={selectedLottery}
        onSelect={setSelectedLottery}
      />

      {/* Main Content */}
      <div className="flex-1 px-3 sm:px-4 lg:px-6 py-4 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
        <BetEntryForm
          selectedLottery={selectedLottery}
          onAddBet={handleAddBet}
        />

        <BetTables
          bets={bets}
          onDeleteBet={handleDeleteBet}
        />

        <SummaryBar
          totalBets={totalBets}
          totalAmount={totalAmount}
          onCreateTicket={handleCreateTicket}
        />
      </div>

      {/* Ticket Modal */}
      <TicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        clientName={client.name}
        vendorPhone={client.vendorPhone}
        bets={bets}
        onSendWhatsApp={handleSendWhatsApp}
      />

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 lg:top-4 lg:right-4 left-4 lg:left-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium
                ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
              `}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <XCircle size={18} />
              )}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Mobile Nav */}
      <BottomNav
        activeTab={activeTab}
        betCount={totalBets}
        onTabChange={setActiveTab}
      />
    </motion.div>
  );
}
