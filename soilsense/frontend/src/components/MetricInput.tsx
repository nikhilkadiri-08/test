import { motion } from 'framer-motion'
import type { SoilMetrics } from '../lib/soilAnalysis'
import { METRIC_CONFIG } from '../lib/soilAnalysis'

interface MetricInputProps {
  metrics: SoilMetrics
  onChange: (key: keyof SoilMetrics, value: number) => void
}

export function MetricInput({ metrics, onChange }: MetricInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-sharp rounded-4xl p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-sm font-medium text-white/70 uppercase tracking-widest">
          Sensor Data
        </h2>
        <div className="w-8 h-[2px] bg-terra-400 rounded-full" />
      </div>

      <div className="space-y-5">
        {METRIC_CONFIG.map((config, i) => (
          <motion.div
            key={config.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className="glass-input rounded-2xl px-4 py-3"
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/60">{config.label}</label>
              <span className="font-display text-sm font-medium tabular-nums">
                {metrics[config.key].toFixed(config.step < 1 ? 1 : 0)}
                {config.unit && (
                  <span className="text-white/30 ml-1 text-xs">{config.unit}</span>
                )}
              </span>
            </div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step}
              value={metrics[config.key]}
              onChange={(e) => onChange(config.key, parseFloat(e.target.value))}
              className="w-full"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
