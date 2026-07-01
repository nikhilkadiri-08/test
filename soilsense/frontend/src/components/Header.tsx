import { motion } from 'framer-motion'
import { Sprout, Zap } from 'lucide-react'

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-10"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl glass-sharp flex items-center justify-center">
            <Sprout className="w-5 h-5 text-terra-400" strokeWidth={2} />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-terra-400 animate-pulse" />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight">TerraSense</h1>
          <p className="text-xs text-white/40 tracking-wide uppercase">AI Soil Intelligence</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-white/50">
        <Zap className="w-3.5 h-3.5 text-terra-400" />
        <span>Live Analysis</span>
      </div>
    </motion.header>
  )
}
