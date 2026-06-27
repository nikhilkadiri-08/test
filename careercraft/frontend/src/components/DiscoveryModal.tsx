import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Globe, X } from 'lucide-react';
import type { CraftElement } from '../recipes';
import { CategoryIcon, getCategoryStyles } from './CategoryIcon';

interface DiscoveryModalProps {
  element: CraftElement | null;
  isFirstWorldwide: boolean;
  onClose: () => void;
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({ element, isFirstWorldwide, onClose }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  useEffect(() => {
    if (!element) return;

    // Generate burst particles
    const newParticles = Array.from({ length: 40 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 200 + 100;
      return {
        id: i,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        color: isFirstWorldwide 
          ? ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff'][Math.floor(Math.random() * 4)]
          : ['#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#ffffff'][Math.floor(Math.random() * 5)],
        size: Math.random() * 6 + 3
      };
    });
    setParticles(newParticles);
  }, [element, isFirstWorldwide]);

  if (!element) return null;

  const catStyles = getCategoryStyles(element.category);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
        {/* Backdrop Glow */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className={`relative max-w-md w-full p-8 rounded-2xl border glass-panel text-center overflow-hidden z-10 ${
            isFirstWorldwide ? 'border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.25)]' : 'border-slate-800 shadow-2xl'
          }`}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>

          {/* Background Lights */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] ${
              isFirstWorldwide ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
          </div>

          {/* Sparkles / Particles Burst */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                }}
              />
            ))}
          </div>

          {/* Discovery Title Header */}
          <div className="flex flex-col items-center mb-6">
            <motion.div
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`p-3 rounded-full mb-3 ${
                isFirstWorldwide ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {isFirstWorldwide ? <Globe size={32} className="animate-spin-slow" /> : <Trophy size={32} />}
            </motion.div>

            {isFirstWorldwide ? (
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 neon-text-glow"
              >
                First Discovery!
              </motion.h2>
            ) : (
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold uppercase tracking-wider text-slate-200"
              >
                New Discovery!
              </motion.h2>
            )}

            <p className="text-xs text-slate-400 mt-1">
              {isFirstWorldwide ? 'You are the first person in the world to craft this!' : 'Added to your professional skill graph'}
            </p>
          </div>

          {/* The Discovered Element Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl border glass-card text-lg font-semibold mb-6 shadow-lg ${catStyles.border} ${catStyles.glow}`}
          >
            <CategoryIcon category={element.category} size={22} />
            <span className={catStyles.text}>{element.name}</span>
          </motion.div>

          {/* Rarity & Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8 text-sm"
          >
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="text-xs text-slate-400">Rarity</div>
              <div className="font-semibold text-slate-200 mt-0.5">{element.rarity}%</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="text-xs text-slate-400">Category</div>
              <div className="font-semibold capitalize text-slate-200 mt-0.5">{element.category}</div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={onClose}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all shadow-md active:scale-95 ${
                isFirstWorldwide 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-dark-900 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
              }`}
            >
              Continue Crafting
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
