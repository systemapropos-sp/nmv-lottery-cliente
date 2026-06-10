import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-1 items-center justify-center p-8"
    >
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Coming Soon</p>
      </div>
    </motion.div>
  );
}
