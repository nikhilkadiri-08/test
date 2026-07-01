import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from './components/Header'
import { MetricInput } from './components/MetricInput'
import { HealthGauge } from './components/HealthGauge'
import { PredictionPanel } from './components/PredictionPanel'
import { analyzeSoil, getDefaultMetrics, type SoilMetrics } from './lib/soilAnalysis'

export default function App() {
  const [metrics, setMetrics] = useState<SoilMetrics>(getDefaultMetrics)

  const analysis = useMemo(() => analyzeSoil(metrics), [metrics])

  const handleChange = (key: keyof SoilMetrics, value: number) => {
    setMetrics((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-terra-700 glow-orb" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-900 glow-orb" />
        <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-terra-500/30 glow-orb" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 py-8 md:py-12">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          <div className="lg:col-span-5">
            <MetricInput metrics={metrics} onChange={handleChange} />
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <HealthGauge analysis={analysis} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-sharp rounded-4xl p-6 flex flex-col justify-center"
              >
                <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Nutrient Balance</p>
                <div className="grid grid-cols-5 gap-2">
                  {analysis.nutrientBalance.map((n) => (
                    <div key={n.label} className="flex flex-col items-center gap-2">
                      <div className="relative w-full aspect-[3/4] rounded-2xl bg-white/5 overflow-hidden">
                        <motion.div
                          className={`absolute bottom-0 left-0 right-0 rounded-2xl ${
                            n.optimal ? 'bg-terra-400/60' : 'bg-amber-500/50'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: `${n.value}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40 uppercase">{n.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <PredictionPanel analysis={analysis} />
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center text-xs text-white/20"
        >
          TerraSense · AI-powered soil monitoring · Adjust sliders to simulate sensor readings
        </motion.footer>
      </div>
    </div>
  )
}
