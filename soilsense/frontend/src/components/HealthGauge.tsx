import { motion } from 'framer-motion'
import type { SoilAnalysis } from '../lib/soilAnalysis'

interface HealthGaugeProps {
  analysis: SoilAnalysis
}

const STATUS_COLORS: Record<string, string> = {
  Optimal: '#4ade80',
  Healthy: '#86efac',
  Moderate: '#fbbf24',
  Degraded: '#f97316',
  Critical: '#ef4444',
}

export function HealthGauge({ analysis }: HealthGaugeProps) {
  const color = STATUS_COLORS[analysis.status] ?? '#4ade80'
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (analysis.healthScore / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-sharp rounded-4xl p-8 flex flex-col items-center relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 glow-orb rounded-full"
        style={{ background: color }}
      />

      <p className="text-xs uppercase tracking-widest text-white/40 mb-6">Soil Health Index</p>

      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={analysis.healthScore}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold tabular-nums"
          >
            {analysis.healthScore}
          </motion.span>
          <span className="text-xs text-white/40">/ 100</span>
        </div>
      </div>

      <div
        className="mt-5 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider"
        style={{
          background: `${color}18`,
          color,
          border: `1px solid ${color}40`,
        }}
      >
        {analysis.status}
      </div>

      <div className="mt-6 w-full accent-line" />

      <div className="mt-4 flex items-center gap-2 text-xs text-white/35">
        <span>AI Confidence</span>
        <span className="text-terra-400 font-medium">{analysis.confidence}%</span>
      </div>
    </motion.div>
  )
}
