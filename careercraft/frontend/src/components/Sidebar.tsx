import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  RotateCcw, 
  Star, 
  Layers, 
  Lightbulb
} from 'lucide-react';
import type { CraftElement, ElementCategory } from '../recipes';
import { CategoryIcon, getCategoryStyles } from './CategoryIcon';

interface SidebarProps {
  unlockedElements: CraftElement[];
  favorites: string[]; // Set of element ids
  onAddElementToCanvas: (element: CraftElement) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClearCanvas: () => void;
  onResetCollection: () => void;
  activeBlueprint: any;
}

export const Sidebar: React.FC<SidebarProps> = ({
  unlockedElements,
  favorites,
  onAddElementToCanvas,
  onToggleFavorite,
  onClearCanvas,
  onResetCollection,
  activeBlueprint
}) => {
  const [activeTab, setActiveTab] = useState<'collection' | 'favorites'>('collection');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'all'>('all');

  const categories: { value: ElementCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'subject', label: 'Subjects' },
    { value: 'skill', label: 'Skills' },
    { value: 'degree', label: 'Degrees' },
    { value: 'experience', label: 'Experiences' },
    { value: 'certification', label: 'Certs' },
    { value: 'career', label: 'Careers' }
  ];

  // Filtering elements
  const displayedElements = unlockedElements.filter((element) => {
    // Tab match
    if (activeTab === 'favorites' && !favorites.includes(element.id)) return false;
    
    // Category match
    if (selectedCategory !== 'all' && element.category !== selectedCategory) return false;
    
    // Search match
    return element.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Check if element is a requirement of the active career blueprint
  const getRequirementBorderClass = (elementName: string) => {
    if (!activeBlueprint) return '';
    const name = elementName.toLowerCase();
    if (activeBlueprint.mandatory.map((n: string) => n.toLowerCase()).includes(name)) {
      return 'border-red-500/50 hover:border-red-500 bg-red-500/5';
    }
    if (activeBlueprint.recommended.map((n: string) => n.toLowerCase()).includes(name)) {
      return 'border-yellow-500/50 hover:border-yellow-500 bg-yellow-500/5';
    }
    if (activeBlueprint.bonus.map((n: string) => n.toLowerCase()).includes(name)) {
      return 'border-emerald-500/50 hover:border-emerald-500 bg-emerald-500/5';
    }
    return '';
  };

  return (
    <div className="w-[300px] h-full border-r border-slate-800/60 glass-panel flex flex-col z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/60 flex flex-col gap-1 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Layers className="text-white" size={18} />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-wider flex items-center gap-1 font-sans">
              CAREER<span className="text-blue-500">CRAFT</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">Craft your dream career pathway</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/60 text-xs">
        <button
          onClick={() => setActiveTab('collection')}
          className={`flex-1 py-3 font-semibold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'collection'
              ? 'text-blue-400 border-blue-500 bg-blue-500/5'
              : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.01]'
          }`}
        >
          <Layers size={13} />
          Collection ({unlockedElements.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-3 font-semibold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'favorites'
              ? 'text-amber-400 border-amber-500 bg-amber-500/5'
              : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.01]'
          }`}
        >
          <Star size={13} />
          Favorites ({favorites.length})
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="p-3 border-b border-slate-800/60 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600 text-slate-200"
          />
        </div>
        
        {/* Categories Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold snap-start shrink-0 transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-white/[0.02] text-slate-500 border border-transparent hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Elements Grid List */}
      <div className="flex-1 overflow-y-auto p-3">
        {displayedElements.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {displayedElements.map((elem) => {
              const catStyles = getCategoryStyles(elem.category);
              const isFav = favorites.includes(elem.id);
              const blueprintBorder = getRequirementBorderClass(elem.name);

              return (
                <div
                  key={elem.id}
                  onClick={() => onAddElementToCanvas(elem)}
                  className={`group relative flex items-center justify-between p-2 rounded-lg border text-left cursor-pointer transition-all select-none ${
                    blueprintBorder || `${catStyles.bg} ${catStyles.border}`
                  }`}
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <CategoryIcon category={elem.category} size={14} className="shrink-0" />
                    <span className="text-[11px] font-medium text-slate-200 truncate pr-1">
                      {elem.name}
                    </span>
                  </div>

                  {/* Favorite / Star Button */}
                  <button
                    onClick={(e) => onToggleFavorite(elem.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-white/10 rounded"
                  >
                    <Star 
                      size={12} 
                      className={isFav ? 'text-amber-400 fill-amber-400' : 'text-slate-500 hover:text-slate-300'} 
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Lightbulb size={24} className="text-slate-600 mb-2" />
            <p className="text-xs text-slate-500">
              {searchQuery ? 'No matching items found.' : 'Discover and craft elements to grow your collection.'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Panel Actions */}
      <div className="p-3 border-t border-slate-800/60 bg-dark-900/40 grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={onClearCanvas}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/[0.02] hover:bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-slate-800/60 rounded-lg font-medium transition-all"
        >
          <Trash2 size={13} />
          Clear Canvas
        </button>
        <button
          onClick={onResetCollection}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-red-900/20 rounded-lg font-medium transition-all"
        >
          <RotateCcw size={13} />
          Reset Game
        </button>
      </div>
    </div>
  );
};
