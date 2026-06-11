import { motion } from 'framer-motion';
import { Delete, Check } from 'lucide-react';

interface NumericKeypadProps {
  onNumber: (num: string) => void;
  onDelete: () => void;
  onOK: () => void;
}

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

export function NumericKeypad({ onNumber, onDelete, onOK }: NumericKeypadProps) {
  return (
    <div className="shrink-0 px-2 pb-1">
      {/* Number rows */}
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 mb-1.5">
          {row.map((num) => (
            <motion.button
              key={num}
              whileTap={{ scale: 0.92, y: 1 }}
              onClick={() => onNumber(num)}
              className="flex-1 h-[52px] bg-white border border-gray-300 rounded-xl text-xl font-bold text-gray-800 shadow-sm active:bg-gray-100 active:shadow-inner transition-colors flex items-center justify-center"
            >
              {num}
            </motion.button>
          ))}
        </div>
      ))}

      {/* Bottom row: Borrar | 0 | OK */}
      <div className="flex gap-1.5">
        {/* Borrar */}
        <motion.button
          whileTap={{ scale: 0.92, y: 1 }}
          onClick={onDelete}
          className="flex-1 h-[52px] bg-red-400 border border-red-500 rounded-xl text-white font-bold shadow-sm active:bg-red-500 active:shadow-inner transition-colors flex items-center justify-center gap-1"
        >
          <Delete size={18} />
          <span className="text-sm">Borrar</span>
        </motion.button>

        {/* 0 */}
        <motion.button
          whileTap={{ scale: 0.92, y: 1 }}
          onClick={() => onNumber('0')}
          className="flex-1 h-[52px] bg-white border border-gray-300 rounded-xl text-xl font-bold text-gray-800 shadow-sm active:bg-gray-100 active:shadow-inner transition-colors flex items-center justify-center"
        >
          0
        </motion.button>

        {/* OK */}
        <motion.button
          whileTap={{ scale: 0.92, y: 1 }}
          onClick={onOK}
          className="flex-1 h-[52px] bg-green-500 border border-green-600 rounded-xl text-white font-bold shadow-sm active:bg-green-600 active:shadow-inner transition-colors flex items-center justify-center gap-1"
        >
          <Check size={18} />
          <span className="text-sm">OK</span>
        </motion.button>
      </div>
    </div>
  );
}
