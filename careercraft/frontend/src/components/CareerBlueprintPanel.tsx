import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Lock, 
  Compass
} from 'lucide-react';
import { CAREER_BLUEPRINTS } from '../recipes';
import type { CareerBlueprint, CraftElement } from '../recipes';

interface CareerBlueprintPanelProps {
  unlockedElements: CraftElement[];
  activeBlueprint: CareerBlueprint | null;
  onSelectBlueprint: (blueprint: CareerBlueprint | null) => void;
  onAddElementToCanvasByName: (name: string) => void;
}

export const CareerBlueprintPanel: React.FC<CareerBlueprintPanelProps> = ({
  unlockedElements,
  activeBlueprint,
  onSelectBlueprint,
  onAddElementToCanvasByName
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const unlockedNames = new Set(unlockedElements.map(e => e.name.toLowerCase()));

  const isRequirementUnlocked = (reqName: string) => {
    return unlockedNames.has(reqName.toLowerCase());
  };

  const filteredBlueprints = CAREER_BLUEPRINTS.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate unlock percentage
  const getProgress = (bp: CareerBlueprint) => {
    const total = bp.mandatory.length + bp.recommended.length + bp.bonus.length;
    if (total === 0) return 0;
    
    const unlockedCount = [
      ...bp.mandatory, 
      ...bp.recommended, 
      ...bp.bonus
    ].filter(isRequirementUnlocked).length;
    
    return Math.round((unlockedCount / total) * 100);
  };

  return (
    <div className="relative h-full flex z-20 pointer-events-none">
      {/* Toggle Tab */}
      <div className="self-center pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-dark-800/90 text-slate-400 hover:text-slate-200 border-y border-l border-slate-700/50 rounded-l-xl backdrop-blur shadow-lg transition-all"
        >
          {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Main Panel Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="w-[340px] h-full border-l border-slate-800/60 glass-panel flex flex-col pointer-events-auto overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="text-rose-500 animate-pulse" size={20} />
                <h2 className="font-bold text-slate-100 tracking-wide text-sm">DREAM JOB MODE</h2>
              </div>
              {activeBlueprint && (
                <button
                  onClick={() => onSelectBlueprint(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
                >
                  Clear Job
                </button>
              )}
            </div>

            {/* List of Career Blueprints / Selection Mode */}
            {!activeBlueprint ? (
              <div className="flex-1 flex flex-col overflow-hidden p-4">
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Choose Your Dream Career
                  </label>
                  <input
                    type="text"
                    placeholder="Search professions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-dark-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600 text-slate-200"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {filteredBlueprints.length > 0 ? (
                    filteredBlueprints.map((bp) => {
                      const progress = getProgress(bp);
                      return (
                        <div
                          key={bp.id}
                          onClick={() => onSelectBlueprint(bp)}
                          className="p-4 rounded-xl border border-slate-800/80 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-200 group-hover:text-rose-400 transition-colors text-sm">
                              {bp.name}
                            </span>
                            <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                              {progress}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {bp.description}
                          </p>
                          <div className="w-full bg-slate-800/40 h-1.5 rounded-full overflow-hidden mt-1">
                            <div 
                              className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-xs text-slate-500 mt-8">
                      No matching dream careers found.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Active Blueprint Tracking Mode */
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 leading-tight">
                    {activeBlueprint.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {activeBlueprint.description}
                  </p>
                  
                  {/* Progress Ring / Bar */}
                  <div className="mt-4 bg-rose-500/5 border border-rose-500/15 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-rose-400">Blueprint Completion</span>
                      <span className="text-rose-300 font-bold">{getProgress(activeBlueprint)}%</span>
                    </div>
                    <div className="w-full bg-slate-800/40 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-rose-500 to-orange-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${getProgress(activeBlueprint)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="space-y-4">
                  {/* Mandatory (Red) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,110,110,0.8)]" />
                      Mandatory Requirements
                    </div>
                    <div className="space-y-1.5">
                      {activeBlueprint.mandatory.map((req) => (
                        <RequirementRow 
                          key={req} 
                          name={req} 
                          isUnlocked={isRequirementUnlocked(req)} 
                          onAdd={() => onAddElementToCanvasByName(req)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Recommended (Yellow) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                      Recommended Skills
                    </div>
                    <div className="space-y-1.5">
                      {activeBlueprint.recommended.map((req) => (
                        <RequirementRow 
                          key={req} 
                          name={req} 
                          isUnlocked={isRequirementUnlocked(req)} 
                          onAdd={() => onAddElementToCanvasByName(req)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bonus (Green) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      Bonus / Advantages
                    </div>
                    <div className="space-y-1.5">
                      {activeBlueprint.bonus.map((req) => (
                        <RequirementRow 
                          key={req} 
                          name={req} 
                          isUnlocked={isRequirementUnlocked(req)} 
                          onAdd={() => onAddElementToCanvasByName(req)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Crafting Pathways Guide */}
                <div className="border-t border-slate-800/80 pt-4">
                  <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider mb-3">
                    <Compass size={14} className="text-indigo-400" />
                    Recommended Pathways
                  </div>
                  <div className="space-y-2.5">
                    {activeBlueprint.pathways.map((path, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white/[0.01] border border-slate-800/50 flex flex-col gap-1 text-xs">
                        {path.map((step, stepIdx) => (
                          <div key={stepIdx} className="text-slate-400 flex items-center gap-1 font-mono">
                            <span className="text-slate-300">{step}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component for individual requirement list items
interface RequirementRowProps {
  name: string;
  isUnlocked: boolean;
  onAdd: () => void;
}

const RequirementRow: React.FC<RequirementRowProps> = ({ name, isUnlocked, onAdd }) => {
  return (
    <div 
      onClick={() => isUnlocked && onAdd()}
      className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all ${
        isUnlocked 
          ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200 cursor-pointer hover:bg-emerald-500/10' 
          : 'bg-dark-900/50 border-slate-800/50 text-slate-500 select-none'
      }`}
    >
      <div className="flex items-center gap-2">
        {isUnlocked ? (
          <CheckCircle size={14} className="text-emerald-400 shrink-0" />
        ) : (
          <Lock size={14} className="text-slate-600 shrink-0" />
        )}
        <span className={isUnlocked ? 'font-medium' : ''}>{name}</span>
      </div>
      {isUnlocked && (
        <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium opacity-0 group-hover:opacity-100 hover:bg-emerald-500/20">
          + Add to Canvas
        </span>
      )}
    </div>
  );
};
