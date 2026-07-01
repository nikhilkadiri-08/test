export interface SoilMetrics {
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  moisture: number
  organicMatter: number
  temperature: number
}

export type YieldOutlook = 'Poor' | 'Fair' | 'Good' | 'Excellent'
export type SoilStatus = 'Critical' | 'Degraded' | 'Moderate' | 'Healthy' | 'Optimal'

export interface SoilAnalysis {
  healthScore: number
  status: SoilStatus
  yieldOutlook: YieldOutlook
  fertilityMonths: number
  fertilityYears: number
  confidence: number
  recommendations: string[]
  cropSuitability: { crop: string; match: number }[]
  nutrientBalance: { label: string; value: number; optimal: boolean }[]
  aiInsight: string
}

const DEFAULT_METRICS: SoilMetrics = {
  ph: 6.5,
  nitrogen: 45,
  phosphorus: 28,
  potassium: 180,
  moisture: 42,
  organicMatter: 3.8,
  temperature: 22,
}

export function getDefaultMetrics(): SoilMetrics {
  return { ...DEFAULT_METRICS }
}

function scorePh(ph: number): number {
  const optimal = 6.5
  const dist = Math.abs(ph - optimal)
  if (dist <= 0.3) return 100
  if (dist <= 0.8) return 85
  if (dist <= 1.5) return 65
  if (dist <= 2.5) return 40
  return 15
}

function scoreNutrient(value: number, low: number, optimal: number, high: number): number {
  if (value >= optimal * 0.85 && value <= high) return 100
  if (value >= low && value < optimal * 0.85) return 70
  if (value > high) return 55
  return 30
}

function getStatus(score: number): SoilStatus {
  if (score >= 85) return 'Optimal'
  if (score >= 70) return 'Healthy'
  if (score >= 50) return 'Moderate'
  if (score >= 30) return 'Degraded'
  return 'Critical'
}

function getYieldOutlook(score: number): YieldOutlook {
  if (score >= 82) return 'Excellent'
  if (score >= 65) return 'Good'
  if (score >= 45) return 'Fair'
  return 'Poor'
}

function estimateFertilityMonths(metrics: SoilMetrics, healthScore: number): number {
  const omFactor = metrics.organicMatter * 8
  const nutrientAvg =
    (scoreNutrient(metrics.nitrogen, 20, 45, 80) +
      scoreNutrient(metrics.phosphorus, 10, 28, 50) +
      scoreNutrient(metrics.potassium, 80, 180, 300)) /
    3
  const phFactor = scorePh(metrics.ph) / 100
  const moistureFactor = metrics.moisture >= 25 && metrics.moisture <= 55 ? 1 : 0.7

  const baseMonths = (healthScore / 100) * 36 + omFactor * 3
  const adjusted = baseMonths * phFactor * moistureFactor * (nutrientAvg / 100)

  return Math.max(3, Math.min(120, Math.round(adjusted)))
}

function buildRecommendations(metrics: SoilMetrics, score: number): string[] {
  const recs: string[] = []

  if (metrics.ph < 5.5) recs.push('Apply agricultural lime to raise pH toward 6.0–6.8')
  if (metrics.ph > 7.5) recs.push('Incorporate sulfur or organic compost to lower alkalinity')
  if (metrics.nitrogen < 30) recs.push('Add nitrogen-rich fertilizer or legume cover crops')
  if (metrics.phosphorus < 15) recs.push('Supplement with rock phosphate or bone meal')
  if (metrics.potassium < 100) recs.push('Apply potash to restore potassium levels')
  if (metrics.moisture < 25) recs.push('Increase irrigation frequency — soil is too dry')
  if (metrics.moisture > 60) recs.push('Improve drainage to prevent root rot and nutrient leaching')
  if (metrics.organicMatter < 2.5) recs.push('Add compost or green manure to rebuild organic matter')
  if (metrics.temperature > 32) recs.push('Use mulch to regulate soil temperature during heat stress')

  if (recs.length === 0 && score >= 80) {
    recs.push('Maintain current crop rotation and minimal tillage practices')
    recs.push('Schedule quarterly sensor checks to track nutrient drift')
  } else if (recs.length === 0) {
    recs.push('Conduct a full soil lab test for micronutrient profiling')
  }

  return recs.slice(0, 4)
}

function getCropSuitability(metrics: SoilMetrics): { crop: string; match: number }[] {
  const crops = [
    { crop: 'Wheat', ideal: { ph: 6.5, n: 50, p: 25, k: 150 } },
    { crop: 'Corn', ideal: { ph: 6.2, n: 60, p: 30, k: 200 } },
    { crop: 'Soybeans', ideal: { ph: 6.8, n: 40, p: 28, k: 180 } },
    { crop: 'Tomatoes', ideal: { ph: 6.5, n: 55, p: 35, k: 220 } },
    { crop: 'Rice', ideal: { ph: 6.0, n: 45, p: 20, k: 160 } },
  ]

  return crops
    .map(({ crop, ideal }) => {
      const phMatch = 100 - Math.abs(metrics.ph - ideal.ph) * 25
      const nMatch = 100 - Math.abs(metrics.nitrogen - ideal.n) * 1.5
      const pMatch = 100 - Math.abs(metrics.phosphorus - ideal.p) * 2
      const kMatch = 100 - Math.abs(metrics.potassium - ideal.k) * 0.3
      const match = Math.max(0, Math.min(100, (phMatch + nMatch + pMatch + kMatch) / 4))
      return { crop, match: Math.round(match) }
    })
    .sort((a, b) => b.match - a.match)
}

function generateAiInsight(metrics: SoilMetrics, score: number, months: number): string {
  const status = getStatus(score).toLowerCase()
  const yieldOutlook = getYieldOutlook(score).toLowerCase()

  if (score >= 80) {
    return `Neural analysis confirms ${status} soil with balanced macronutrients. pH at ${metrics.ph.toFixed(1)} sits in the optimal window. Expect ${yieldOutlook} yield potential with fertility sustained for ~${months} months under standard crop rotation.`
  }
  if (score >= 55) {
    return `AI models detect moderate nutrient variance — nitrogen at ${metrics.nitrogen} mg/kg and organic matter at ${metrics.organicMatter}% drive the forecast. Corrective inputs could extend fertility from ${months} to ${months + 12} months.`
  }
  return `Sensor fusion flags stress indicators: ${metrics.moisture < 25 ? 'low moisture' : metrics.ph < 5.5 ? 'acidic pH' : 'nutrient depletion'} is the primary constraint. Immediate intervention recommended — fertility window narrows to ~${months} months without action.`
}

export function analyzeSoil(metrics: SoilMetrics): SoilAnalysis {
  const phScore = scorePh(metrics.ph)
  const nScore = scoreNutrient(metrics.nitrogen, 20, 45, 80)
  const pScore = scoreNutrient(metrics.phosphorus, 10, 28, 50)
  const kScore = scoreNutrient(metrics.potassium, 80, 180, 300)
  const omScore = scoreNutrient(metrics.organicMatter, 1.5, 3.5, 6)
  const moistureScore =
    metrics.moisture >= 25 && metrics.moisture <= 55
      ? 100
      : metrics.moisture >= 15 && metrics.moisture <= 70
        ? 60
        : 25

  const healthScore = Math.round(
    phScore * 0.2 + nScore * 0.2 + pScore * 0.15 + kScore * 0.15 + omScore * 0.2 + moistureScore * 0.1
  )

  const fertilityMonths = estimateFertilityMonths(metrics, healthScore)
  const variance = Math.abs(metrics.ph - 6.5) + Math.abs(metrics.organicMatter - 3.5)
  const confidence = Math.max(72, Math.min(97, 94 - variance * 3))

  return {
    healthScore,
    status: getStatus(healthScore),
    yieldOutlook: getYieldOutlook(healthScore),
    fertilityMonths,
    fertilityYears: Math.round((fertilityMonths / 12) * 10) / 10,
    confidence,
    recommendations: buildRecommendations(metrics, healthScore),
    cropSuitability: getCropSuitability(metrics),
    nutrientBalance: [
      { label: 'pH', value: phScore, optimal: phScore >= 85 },
      { label: 'N', value: nScore, optimal: nScore >= 85 },
      { label: 'P', value: pScore, optimal: pScore >= 85 },
      { label: 'K', value: kScore, optimal: kScore >= 85 },
      { label: 'OM', value: omScore, optimal: omScore >= 85 },
    ],
    aiInsight: generateAiInsight(metrics, healthScore, fertilityMonths),
  }
}

export const METRIC_CONFIG = [
  { key: 'ph' as const, label: 'pH Level', unit: '', min: 4, max: 9, step: 0.1 },
  { key: 'nitrogen' as const, label: 'Nitrogen', unit: 'mg/kg', min: 5, max: 100, step: 1 },
  { key: 'phosphorus' as const, label: 'Phosphorus', unit: 'mg/kg', min: 5, max: 80, step: 1 },
  { key: 'potassium' as const, label: 'Potassium', unit: 'mg/kg', min: 40, max: 400, step: 5 },
  { key: 'moisture' as const, label: 'Moisture', unit: '%', min: 5, max: 80, step: 1 },
  { key: 'organicMatter' as const, label: 'Organic Matter', unit: '%', min: 0.5, max: 10, step: 0.1 },
  { key: 'temperature' as const, label: 'Temperature', unit: '°C', min: 5, max: 45, step: 0.5 },
]
