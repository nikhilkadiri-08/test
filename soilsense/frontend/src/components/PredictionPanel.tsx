import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Wheat, Lightbulb } from 'lucide-react'
import type { SoilAnalysis } from '../lib/soilAnalysis'

interface PredictionPanelProps {
  analysis: SoilAnalysis
}

const YIELD_COLORS: Record<string, string> = {
  Excellent: 'text-terra-400',
  Good: 'text-emerald-400',
  Fair: 'text-amber-400',
  Poor: 'text-red-400',
}

export function PredictionPanel({ analysis }: PredictionPanelProps) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-sharp rounded-4xl p-6 md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-terra-400/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-terra-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Expected Outcome</p>
            <p className={`font-display text-2xl font-semibold ${YIELD_COLORS[analysis.yieldOutlook]}`}>
              {analysis.yieldOutlook} Yield
            </p>
            <p className="text-sm text-white/45 mt-2 leading-relaxed">{analysis.aiInsight}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-sharp rounded-4xl p-6 md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/10 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Fertility Window</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-white">
                {analysis.fertilityMonths}
              </span>
              <span className="text-white/40 text-sm">months</span>
              <span className="text-white/20 text-sm mx-1">·</span>
              <span className="text-white/50 text-sm">{analysis.fertilityYears} years</span>
            </div>
            <p className="text-xs text-white/35 mt-2">
              Estimated productive period before significant nutrient depletion
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500/60 to-terra-400"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (analysis.fertilityMonths / 120) * 100)}%` }}
            transition={{ duration: 1, delay: 0.4 }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-sharp rounded-4xl p-6 md:p-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wheat className="w-4 h-4 text-terra-400" />
          <p className="text-xs uppercase tracking-widest text-white/40">Crop Suitability</p>
        </div>
        <div className="space-y-3">
          {analysis.cropSuitability.slice(0, 4).map((crop, i) => (
            <div key={crop.crop} className="flex items-center gap-3">
              <span className="text-sm text-white/60 w-20 shrink-0">{crop.crop}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-terra-400/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${crop.match}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i }}
                />
              </div>
              <span className="text-xs text-white/40 w-8 text-right tabular-nums">{crop.match}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-sharp rounded-4xl p-6 md:p-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <p className="text-xs uppercase tracking-widest text-white/40">AI Recommendations</p>
        </div>
        <ul className="space-y-3">
          {analysis.recommendations.map((rec, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-start gap-3 text-sm text-white/50 leading-relaxed"
            >
              <span className="w-1 h-1 rounded-full bg-terra-400 mt-2 shrink-0" />
              {rec}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
