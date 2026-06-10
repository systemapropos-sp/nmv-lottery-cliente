import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { Bet, BetType } from '@/types';

interface BetGroup {
  type: BetType;
  label: string;
  headerBg: string;
  badgeBg: string;
  badgeText: string;
  columns: string[];
  showType: boolean;
  bets: Bet[];
}

interface BetTablesProps {
  bets: Bet[];
  onDeleteBet: (id: string) => void;
}

const betGroups: Omit<BetGroup, 'bets'>[] = [
  {
    type: 'directo',
    label: 'DIRECTO',
    headerBg: 'bg-sky-400',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
    columns: ['Num', 'Loteria', 'Monto', ''],
    showType: false,
  },
  {
    type: 'pale',
    label: 'PALE & TRIPLETA',
    headerBg: 'bg-sky-400',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
    columns: ['Tipo', 'Num', 'Loteria', 'Monto', ''],
    showType: true,
  },
  {
    type: 'cash3',
    label: 'CASH 3',
    headerBg: 'bg-sky-400',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-700',
    columns: ['Num', 'Loteria', 'Monto', ''],
    showType: false,
  },
  {
    type: 'play4',
    label: 'PLAY 4 & PICK 5',
    headerBg: 'bg-sky-400',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-700',
    columns: ['Tipo', 'Num', 'Loteria', 'Monto', ''],
    showType: true,
  },
];

function getBetTypeLabel(type: BetType): string {
  switch (type) {
    case 'directo': return 'Directo';
    case 'pale': return 'Pale';
    case 'tripleta': return 'Tripleta';
    case 'cash3': return 'Cash 3';
    case 'play4': return 'Play 4';
    case 'pick5': return 'Pick 5';
    default: return type;
  }
}

function TableSection({ group, onDeleteBet }: { group: BetGroup; onDeleteBet: (id: string) => void }) {
  const total = group.bets.reduce((sum, b) => sum + b.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] mb-3 overflow-hidden"
    >
      {/* Header */}
      <div className={`${group.headerBg} px-4 py-2.5 flex items-center`}>
        <span className="text-white text-[11px] font-bold uppercase tracking-[0.05em]">
          {group.label}
        </span>
      </div>

      {/* Body */}
      {group.bets.length === 0 ? (
        /* Empty state */
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-full mx-4 border-2 border-dashed border-gray-200 rounded-lg py-6 flex flex-col items-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gray-300 mb-2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs text-gray-400">Sin jugadas</span>
          </div>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className={`grid ${group.showType ? 'grid-cols-[80px_1fr_1fr_80px_44px]' : 'grid-cols-[1fr_1fr_80px_44px]'} px-4 py-2 bg-gray-50 border-b border-gray-100`}>
            {group.columns.map((col, i) => (
              <span key={i} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          <AnimatePresence mode="popLayout">
            {group.bets.map((bet, index) => (
              <motion.div
                key={bet.id}
                layout
                initial={{ x: -20, opacity: 0, height: 44 }}
                animate={{ x: 0, opacity: 1, height: 'auto' }}
                exit={{ x: 50, opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`
                  grid items-center px-4 py-2.5 border-b border-gray-50 min-h-[44px]
                  ${group.showType ? 'grid-cols-[80px_1fr_1fr_80px_44px]' : 'grid-cols-[1fr_1fr_80px_44px]'}
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                `}
              >
                {group.showType && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${bet.type === 'directo' || bet.type === 'pale' || bet.type === 'tripleta' ? 'bg-teal-100 text-teal-700' : 'bg-sky-100 text-sky-700'} text-[10px] font-semibold w-fit`}>
                    {getBetTypeLabel(bet.type)}
                  </span>
                )}
                <span className="text-[13px] font-medium text-gray-700 tabular-nums truncate">
                  {bet.numbers}
                </span>
                <span className="text-[13px] text-gray-600 truncate">
                  {bet.lotteryName}
                </span>
                <span className="text-[13px] font-semibold text-gray-700 tabular-nums">
                  RD${bet.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onDeleteBet(bet.id)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Footer */}
          <div className="bg-teal-50 border-t border-teal-100 px-4 py-2.5 flex items-center justify-between">
            <span className="text-[13px] text-gray-600">
              {group.bets.length} {group.bets.length === 1 ? 'jugada' : 'jugadas'}
            </span>
            <span className="text-sm font-bold text-teal-700 tabular-nums">
              RD${total.toFixed(2)}
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}

export function BetTables({ bets, onDeleteBet }: BetTablesProps) {
  const directoBets = bets.filter(b => b.type === 'directo');
  const paleTripletaBets = bets.filter(b => b.type === 'pale' || b.type === 'tripleta');
  const cash3Bets = bets.filter(b => b.type === 'cash3');
  const play4Pick5Bets = bets.filter(b => b.type === 'play4' || b.type === 'pick5');

  const groups: BetGroup[] = [
    { ...betGroups[0], bets: directoBets },
    { ...betGroups[1], bets: paleTripletaBets },
    { ...betGroups[2], bets: cash3Bets },
    { ...betGroups[3], bets: play4Pick5Bets },
  ];

  return (
    <div>
      {groups.map((group) => (
        <TableSection key={group.type} group={group} onDeleteBet={onDeleteBet} />
      ))}
    </div>
  );
}
