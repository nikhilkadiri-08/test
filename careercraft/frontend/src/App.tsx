import React, { useState, useEffect } from 'react';
import { STARTER_ELEMENTS, combineElements } from './recipes';
import type { CraftElement, CareerBlueprint } from './recipes';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import type { CanvasCardInstance } from './components/Canvas';
import { CareerBlueprintPanel } from './components/CareerBlueprintPanel';
import { DiscoveryModal } from './components/DiscoveryModal';
import { SkillWeb } from './components/SkillWeb';

export const App: React.FC = () => {
  // 1. Unlocked Elements State (Loaded from LocalStorage or Starters)
  const [unlockedElements, setUnlockedElements] = useState<CraftElement[]>(() => {
    const saved = localStorage.getItem('careercraft_unlocked');
    return saved ? JSON.parse(saved) : STARTER_ELEMENTS;
  });

  // 2. Favorites List
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('careercraft_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. Elements currently on the canvas
  const [canvasElements, setCanvasElements] = useState<CanvasCardInstance[]>([]);

  // 4. Active Career Blueprint (Dream Job Mode)
  const [activeBlueprint, setActiveBlueprint] = useState<CareerBlueprint | null>(() => {
    const saved = localStorage.getItem('careercraft_active_blueprint');
    return saved ? JSON.parse(saved) : null;
  });

  // 5. Discovery Modal State
  const [discoveredElement, setDiscoveredElement] = useState<CraftElement | null>(null);
  const [isFirstWorldwide, setIsFirstWorldwide] = useState(false);

  // 6. Active View Mode (Workspace Canvas vs Skill Web Graph)
  const [activeView, setActiveView] = useState<'canvas' | 'web'>('canvas');

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('careercraft_unlocked', JSON.stringify(unlockedElements));
  }, [unlockedElements]);

  useEffect(() => {
    localStorage.setItem('careercraft_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (activeBlueprint) {
      localStorage.setItem('careercraft_active_blueprint', JSON.stringify(activeBlueprint));
    } else {
      localStorage.removeItem('careercraft_active_blueprint');
    }
  }, [activeBlueprint]);

  // Spawn element on the canvas (from sidebar click)
  const handleAddElementToCanvas = (element: CraftElement) => {
    // Generate a random spawn position around the center of the screen
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Canvas dimensions center (approximate, offset by sidebar)
    const centerX = (width - 300 - 340) / 2 + 100 + (Math.random() * 60 - 30);
    const centerY = height / 2 - 50 + (Math.random() * 60 - 30);

    const newInstance: CanvasCardInstance = {
      id: `${element.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      element,
      x: centerX,
      y: centerY,
      zIndex: canvasElements.length + 10
    };

    setCanvasElements(prev => [...prev, newInstance]);
  };

  // Helper: Spawn an element on canvas by name (called from Career Checklist)
  const handleAddElementToCanvasByName = (name: string) => {
    const found = unlockedElements.find(e => e.name.toLowerCase() === name.toLowerCase());
    if (found) {
      handleAddElementToCanvas(found);
    }
  };

  // Remove element from canvas
  const handleRemoveElementFromCanvas = (instanceId: string) => {
    setCanvasElements(prev => prev.filter(c => c.id !== instanceId));
  };

  // Clone / Duplicate element on double click
  const handleDuplicateElement = (instance: CanvasCardInstance) => {
    const newInstance: CanvasCardInstance = {
      id: `${instance.element.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      element: instance.element,
      x: instance.x + 30, // shift slightly
      y: instance.y + 30,
      zIndex: canvasElements.length + 20
    };
    setCanvasElements(prev => [...prev, newInstance]);
  };

  // Update card position on dragging
  const handleUpdateElementPosition = (instanceId: string, x: number, y: number) => {
    setCanvasElements(prev => {
      // Find max zIndex to place the dragged element on top
      const maxZ = Math.max(...prev.map(c => c.zIndex), 10) + 1;
      return prev.map(c => 
        c.id === instanceId 
          ? { ...c, x, y, zIndex: maxZ } 
          : c
      );
    });
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    setCanvasElements([]);
  };

  // Toggle favorite status
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent adding element to canvas when clicking favorite
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Reset entire progress
  const handleResetCollection = () => {
    if (window.confirm('Are you sure you want to reset your CareerCraft collection? This will clear all discovered recipes!')) {
      setUnlockedElements(STARTER_ELEMENTS);
      setFavorites([]);
      setCanvasElements([]);
      setActiveBlueprint(null);
      localStorage.removeItem('careercraft_unlocked');
      localStorage.removeItem('careercraft_favorites');
      localStorage.removeItem('careercraft_active_blueprint');
    }
  };

  // Combine elements handler
  const handleCombineElements = (
    instanceA: CanvasCardInstance,
    instanceB: CanvasCardInstance,
    midpointX: number,
    midpointY: number
  ) => {
    // 1. Play combining animation on the canvas for both elements
    setCanvasElements(prev => 
      prev.map(c => 
        c.id === instanceA.id || c.id === instanceB.id 
          ? { ...c, isCombining: true } 
          : c
      )
    );

    // 2. Perform formula computation
    const { element: resultElement, isFirstWorldwide } = combineElements(
      instanceA.element,
      instanceB.element,
      unlockedElements.length
    );

    // 3. Wait for combining animation to finish, then update board
    setTimeout(() => {
      // Remove the combined components
      setCanvasElements(prev => prev.filter(c => c.id !== instanceA.id && c.id !== instanceB.id));

      // Check if this element is already unlocked (by Name to support varying casing/IDs)
      const alreadyUnlocked = unlockedElements.some(
        e => e.name.toLowerCase() === resultElement.name.toLowerCase()
      );

      let finalElement = resultElement;

      if (!alreadyUnlocked) {
        // Unlock new element
        setUnlockedElements(prev => [...prev, resultElement]);
        
        // Show Discovery Modal
        setDiscoveredElement(resultElement);
        setIsFirstWorldwide(isFirstWorldwide);
      } else {
        // If already unlocked, use the existing unlocked element metadata
        const existing = unlockedElements.find(
          e => e.name.toLowerCase() === resultElement.name.toLowerCase()
        );
        if (existing) {
          finalElement = existing;
        }
      }

      // Add the newly created card at the midpoint
      const newInstance: CanvasCardInstance = {
        id: `${finalElement.id}_${Date.now()}`,
        element: finalElement,
        x: midpointX,
        y: midpointY,
        zIndex: canvasElements.length + 15
      };

      setCanvasElements(prev => [...prev, newInstance]);

    }, 550); // Matches CSS animation timing
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-dark-900 relative">
      {/* 1. Left Sidebar (Collection) */}
      <Sidebar
        unlockedElements={unlockedElements}
        favorites={favorites}
        onAddElementToCanvas={handleAddElementToCanvas}
        onToggleFavorite={handleToggleFavorite}
        onClearCanvas={handleClearCanvas}
        onResetCollection={handleResetCollection}
        activeBlueprint={activeBlueprint}
      />

      {/* 2. Main Workspace Center */}
      <div className="flex-1 h-full flex flex-col relative">
        {/* Toggle tabs for Canvas vs Web */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center p-1 bg-dark-800/80 border border-slate-700/50 rounded-xl backdrop-blur shadow-lg z-30 pointer-events-auto">
          <button
            onClick={() => setActiveView('canvas')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'canvas'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Crafting Canvas
          </button>
          <button
            onClick={() => setActiveView('web')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'web'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Skill Spider Web
          </button>
        </div>

        {activeView === 'canvas' ? (
          <Canvas
            canvasElements={canvasElements}
            activeBlueprint={activeBlueprint}
            onCombineElements={handleCombineElements}
            onRemoveElementFromCanvas={handleRemoveElementFromCanvas}
            onDuplicateElement={handleDuplicateElement}
            onUpdateElementPosition={handleUpdateElementPosition}
            onClearCanvas={handleClearCanvas}
          />
        ) : (
          <SkillWeb
            activeBlueprint={activeBlueprint}
            onSelectBlueprint={setActiveBlueprint}
          />
        )}
      </div>

      {/* 3. Right Sidebar (Career Blueprint - Dream Job Mode) */}
      <CareerBlueprintPanel
        unlockedElements={unlockedElements}
        activeBlueprint={activeBlueprint}
        onSelectBlueprint={setActiveBlueprint}
        onAddElementToCanvasByName={handleAddElementToCanvasByName}
      />

      {/* 4. Discovery Overlay Celebration Modal */}
      <DiscoveryModal
        element={discoveredElement}
        isFirstWorldwide={isFirstWorldwide}
        onClose={() => setDiscoveredElement(null)}
      />
    </div>
  );
};

export default App;
