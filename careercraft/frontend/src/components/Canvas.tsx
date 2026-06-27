import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Trash2, X, Plus } from 'lucide-react';
import type { CraftElement } from '../recipes';
import { CategoryIcon, getCategoryStyles } from './CategoryIcon';

export interface CanvasCardInstance {
  id: string; // Unique instance id (e.g. elemId_timestamp)
  element: CraftElement;
  x: number; // Position on the infinite canvas
  y: number;
  isCombining?: boolean;
  zIndex: number;
}

interface CanvasProps {
  canvasElements: CanvasCardInstance[];
  activeBlueprint: any;
  onCombineElements: (
    instanceA: CanvasCardInstance,
    instanceB: CanvasCardInstance,
    midpointX: number,
    midpointY: number
  ) => void;
  onRemoveElementFromCanvas: (instanceId: string) => void;
  onDuplicateElement: (instance: CanvasCardInstance) => void;
  onUpdateElementPosition: (instanceId: string, x: number, y: number) => void;
  onClearCanvas: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  canvasElements,
  activeBlueprint,
  onCombineElements,
  onRemoveElementFromCanvas,
  onDuplicateElement,
  onUpdateElementPosition,
  onClearCanvas
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Pan and Zoom State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  
  // Dragging State
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const maxZIndexRef = useRef(10);
  
  // Collision Highlight state
  const [overlapTargetId, setOverlapTargetId] = useState<string | null>(null);

  // Spark particles overlay state
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  // Reset Pan and Zoom
  const handleResetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Zoom Functions
  const handleZoomIn = () => setZoom(z => Math.min(2.0, z + 0.1));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.1));

  // Determine requirement status glow if Dream Job Mode is active
  const getCardStatusStyles = (elementName: string) => {
    if (!activeBlueprint) return '';
    const name = elementName.toLowerCase();
    
    if (activeBlueprint.mandatory.map((n: string) => n.toLowerCase()).includes(name)) {
      return 'glow-mandatory border-red-500/50 bg-red-950/20';
    }
    if (activeBlueprint.recommended.map((n: string) => n.toLowerCase()).includes(name)) {
      return 'glow-recommended border-yellow-500/50 bg-yellow-950/20';
    }
    if (activeBlueprint.bonus.map((n: string) => n.toLowerCase()).includes(name)) {
      return 'glow-bonus border-emerald-500/50 bg-emerald-950/20';
    }
    return '';
  };

  // Pointer Down on background -> Start Panning
  const handleBgPointerDown = (e: React.PointerEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-grid')) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      canvasRef.current?.setPointerCapture(e.pointerId);
    }
  };

  // Pointer Down on a card -> Start Dragging
  const handleCardPointerDown = (e: React.PointerEvent, card: CanvasCardInstance) => {
    e.stopPropagation();
    
    // Increment max z-index to bring dragged card to the top
    maxZIndexRef.current += 1;
    onUpdateElementPosition(card.id, card.x, card.y); // updates position just to update z-index context on root
    
    // Store drag offset relative to card top-left in canvas space
    // e.clientX is screen space. We need to factor in zoom and pan.
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Convert screen pointer position to canvas coordinate space
    const canvasX = (e.clientX - rect.left - pan.x) / zoom;
    const canvasY = (e.clientY - rect.top - pan.y) / zoom;
    
    dragOffsetRef.current = {
      x: canvasX - card.x,
      y: canvasY - card.y
    };
    
    setActiveDragId(card.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Pointer Move -> Update Dragging or Panning
  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      });
      return;
    }

    if (activeDragId) {
      // Find card being dragged
      const draggedCard = canvasElements.find(c => c.id === activeDragId);
      if (!draggedCard) return;

      // Pointer pos in canvas space
      const canvasX = (e.clientX - rect.left - pan.x) / zoom;
      const canvasY = (e.clientY - rect.top - pan.y) / zoom;

      // Calculate new card position
      const newX = canvasX - dragOffsetRef.current.x;
      const newY = canvasY - dragOffsetRef.current.y;

      onUpdateElementPosition(activeDragId, newX, newY);

      // Check collision during drag
      // Cards average width is ~140px, height ~40px. Let's check center overlaps.
      let foundOverlapId: string | null = null;
      for (const card of canvasElements) {
        if (card.id === activeDragId) continue;
        
        const dx = Math.abs(card.x - newX);
        const dy = Math.abs(card.y - newY);
        
        // Simple bounding box overlaps
        if (dx < 150 && dy < 45) {
          foundOverlapId = card.id;
          break;
        }
      }
      setOverlapTargetId(foundOverlapId);
    }
  };

  // Pointer Up -> Drop card & check combine
  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      canvasRef.current?.releasePointerCapture(e.pointerId);
      return;
    }

    if (activeDragId) {
      const draggedCard = canvasElements.find(c => c.id === activeDragId);
      setActiveDragId(null);
      setOverlapTargetId(null);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);

      if (!draggedCard) return;

      // Final collision check
      let targetCombineCard: CanvasCardInstance | null = null;
      for (const card of canvasElements) {
        if (card.id === activeDragId) continue;
        
        const dx = Math.abs(card.x - draggedCard.x);
        const dy = Math.abs(card.y - draggedCard.y);
        
        // Match collision criteria
        if (dx < 130 && dy < 40) {
          targetCombineCard = card;
          break;
        }
      }

      if (targetCombineCard) {
        // Trigger combine at midpoint
        const midX = (draggedCard.x + targetCombineCard.x) / 2;
        const midY = (draggedCard.y + targetCombineCard.y) / 2;
        
        // Particle effect at combine point
        triggerParticles(e.clientX, e.clientY);
        
        onCombineElements(draggedCard, targetCombineCard, midX, midY);
      }
    }
  };

  // Spark particle generator helper
  const triggerParticles = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: ['#3b82f6', '#10b981', '#fbbf24', '#f43f5e', '#a855f7'][Math.floor(Math.random() * 5)]
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Clean up particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 800);
  };

  return (
    <div 
      ref={canvasRef}
      onPointerDown={handleBgPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="flex-1 h-full relative overflow-hidden bg-dark-900 select-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      {/* Grid Pattern with Zoom and Pan Transforms */}
      <div 
        className="absolute inset-0 canvas-grid bg-grid-pattern pointer-events-none transition-all duration-75"
        style={{
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`
        }}
      />

      {/* Cards Space Container */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {canvasElements.map((card) => {
          const catStyles = getCategoryStyles(card.element.category);
          const isOverlapTarget = overlapTargetId === card.id;
          const statusGlow = getCardStatusStyles(card.element.name);
          const isDraggingThis = activeDragId === card.id;

          return (
            <div
              key={card.id}
              onPointerDown={(e) => handleCardPointerDown(e, card)}
              onDoubleClick={() => onDuplicateElement(card)}
              className={`absolute pointer-events-auto rounded-xl px-4 py-2.5 border flex items-center gap-2 text-xs font-semibold shadow-md transition-shadow cursor-move select-none ${
                card.isCombining ? 'animate-combine' : ''
              } ${
                isDraggingThis ? 'opacity-85 scale-102 shadow-2xl rotate-1 z-50 cursor-grabbing' : ''
              } ${
                isOverlapTarget 
                  ? 'border-white bg-white/10 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-40' 
                  : statusGlow || `${catStyles.bg} ${catStyles.border} ${catStyles.text} ${catStyles.glow}`
              }`}
              style={{
                left: card.x,
                top: card.y,
                zIndex: card.zIndex || 10,
                transformOrigin: 'center center'
              }}
            >
              {/* Category Icon */}
              <CategoryIcon category={card.element.category} size={15} className="shrink-0" />
              
              {/* Card Label */}
              <span className="pr-1 whitespace-nowrap text-slate-100">{card.element.name}</span>

              {/* Duplicate indicator on hover */}
              <div className="hidden group-hover:block absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-[9px] px-1 rounded opacity-75">
                Double click to clone
              </div>

              {/* Card Trash/Close button */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onRemoveElementFromCanvas(card.id)}
                className="p-0.5 hover:bg-white/15 text-slate-400 hover:text-slate-200 rounded shrink-0 transition-colors cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Local UI Particles Burst */}
      {particles.map((p) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 80 + 30;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;

        return (
          <div
            key={p.id}
            className="sparkle"
            style={{
              left: p.x,
              top: p.y,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              width: `${Math.random() * 4 + 3}px`,
              height: `${Math.random() * 4 + 3}px`,
              '--x': `${dx}px`,
              '--y': `${dy}px`
            } as React.CSSProperties}
          />
        );
      })}

      {/* Floating Canvas Action Bar */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 p-2 bg-dark-800/90 border border-slate-700/50 rounded-xl backdrop-blur-md shadow-lg z-30 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleResetView}
          title="Reset Zoom & Pan"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all"
        >
          <Maximize2 size={16} />
        </button>
        <div className="w-px h-5 bg-slate-700/50 mx-1" />
        <button
          onClick={onClearCanvas}
          title="Clear Canvas"
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Help / Guide overlay on canvas (hidden unless canvas empty) */}
      {canvasElements.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center p-6 opacity-30">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
            <Plus className="text-slate-400" size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-300">Workspace Empty</h2>
          <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
            Click elements from the sidebar to spawn them, then drag them together to craft new skills, academic paths, or careers.
          </p>
        </div>
      )}
    </div>
  );
};
