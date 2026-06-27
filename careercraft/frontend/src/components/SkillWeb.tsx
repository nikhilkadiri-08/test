import React, { useRef, useEffect, useState } from 'react';
import { Target, Info, Sparkles, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { CareerBlueprint } from '../recipes';
import { CAREER_BLUEPRINTS } from '../recipes';

interface Node {
  id: string;
  name: string;
  type: 'job' | 'skill';
  classification: 'dream' | 'side' | 'mandatory' | 'recommended' | 'bonus' | 'side-skill';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  fx: number | null;
  fy: number | null;
}

interface Link {
  source: string;
  target: string;
  type: 'primary' | 'secondary';
}

interface SkillWebProps {
  activeBlueprint: CareerBlueprint | null;
  onSelectBlueprint: (bp: CareerBlueprint | null) => void;
}

export const SkillWeb: React.FC<SkillWebProps> = ({ activeBlueprint, onSelectBlueprint }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Graph state
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  // Physics settings
  const chargeForce = 400; // repulsion between nodes
  const linkForce = 0.04;  // attraction along connections
  const gravityForce = 0.02; // gravity towards center
  const friction = 0.85;

  // Active dragging ref
  const dragNodeRef = useRef<Node | null>(null);

  // Initialize nodes and links based on the active career blueprint
  useEffect(() => {
    if (!activeBlueprint) {
      // Clear graph if no blueprint is active
      setNodes([]);
      setLinks([]);
      return;
    }

    const newNodes: Node[] = [];
    const newLinks: Link[] = [];

    const centerX = 350;
    const centerY = 280;

    // 1. Center Dream Job Node
    const dreamJobNode: Node = {
      id: activeBlueprint.id,
      name: activeBlueprint.name,
      type: 'job',
      classification: 'dream',
      x: centerX + (Math.random() * 40 - 20),
      y: centerY + (Math.random() * 40 - 20),
      vx: 0,
      vy: 0,
      radius: 26,
      fx: null,
      fy: null,
    };
    newNodes.push(dreamJobNode);

    // Helper to spawn node with random positioning
    const addSkillNode = (name: string, classification: 'mandatory' | 'recommended' | 'bonus') => {
      const id = `skill_${name.toLowerCase().replace(/\s+/g, '_')}`;
      if (newNodes.some(n => n.id === id)) return id;

      const radius = 16;
      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 50;

      newNodes.push({
        id,
        name,
        type: 'skill',
        classification,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius,
        fx: null,
        fy: null,
      });
      return id;
    };

    // 2. Add Mandatory Skills
    activeBlueprint.mandatory.forEach(skill => {
      const skillId = addSkillNode(skill, 'mandatory');
      newLinks.push({ source: dreamJobNode.id, target: skillId, type: 'primary' });
    });

    // 3. Add Recommended Skills
    activeBlueprint.recommended.forEach(skill => {
      const skillId = addSkillNode(skill, 'recommended');
      newLinks.push({ source: dreamJobNode.id, target: skillId, type: 'primary' });
    });

    // 4. Add Bonus Skills
    activeBlueprint.bonus.forEach(skill => {
      const skillId = addSkillNode(skill, 'bonus');
      newLinks.push({ source: dreamJobNode.id, target: skillId, type: 'primary' });
    });

    // 5. Add Side Jobs and their exclusive side-skills to show branching paths
    // We select 2 blueprints that are most related to demonstrate cross-domain skills
    const relatedBlueprints = CAREER_BLUEPRINTS.filter(bp => bp.id !== activeBlueprint.id).slice(0, 2);

    relatedBlueprints.forEach((sideBp, bpIdx) => {
      const sideJobId = `job_${sideBp.id}`;
      const angle = ((bpIdx === 0 ? 0.75 : 1.25) * Math.PI) + (Math.random() * 0.2 - 0.1);
      const distance = 250;

      const sideJobNode: Node = {
        id: sideJobId,
        name: sideBp.name,
        type: 'job',
        classification: 'side',
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: 20,
        fx: null,
        fy: null,
      };
      newNodes.push(sideJobNode);

      // Connect the side job to any skills it shares with our main job
      const sharedMandatory = sideBp.mandatory.filter(s => 
        activeBlueprint.mandatory.includes(s) || 
        activeBlueprint.recommended.includes(s)
      );

      sharedMandatory.forEach(sharedSkill => {
        const skillId = `skill_${sharedSkill.toLowerCase().replace(/\s+/g, '_')}`;
        // Connect shared skill to side job
        newLinks.push({ source: sideJobId, target: skillId, type: 'secondary' });
      });

      // Add a couple of exclusive side skills for this side job to flesh out its branch
      const exclusiveSkills = sideBp.mandatory.filter(s => 
        !activeBlueprint.mandatory.includes(s) && 
        !activeBlueprint.recommended.includes(s)
      ).slice(0, 2);

      exclusiveSkills.forEach((exSkill, skillIdx) => {
        const skillId = `skill_${exSkill.toLowerCase().replace(/\s+/g, '_')}`;
        if (!newNodes.some(n => n.id === skillId)) {
          const exAngle = angle + (skillIdx === 0 ? -0.3 : 0.3);
          const exDist = 320;

          newNodes.push({
            id: skillId,
            name: exSkill,
            type: 'skill',
            classification: 'side-skill',
            x: centerX + Math.cos(exAngle) * exDist,
            y: centerY + Math.sin(exAngle) * exDist,
            vx: 0,
            vy: 0,
            radius: 14,
            fx: null,
            fy: null,
          });
        }
        newLinks.push({ source: sideJobId, target: skillId, type: 'secondary' });
      });
    });

    setNodes(newNodes);
    setLinks(newLinks);
    setSelectedNodeInfo(dreamJobNode);
  }, [activeBlueprint]);

  // Main simulation and render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const runSimulation = () => {
      if (nodes.length === 0) return;

      // 1. Force calculations
      // Repulsion between all node pairs (charge force)
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);

          // Force drops off with distance
          const force = chargeForce / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (nodeA.fx === null) {
            nodeA.vx -= fx;
            nodeA.vy -= fy;
          }
          if (nodeB.fx === null) {
            nodeB.vx += fx;
            nodeB.vy += fy;
          }
        }

        // Gravity towards target center (350, 280)
        if (nodeA.fx === null) {
          const dx = 350 - nodeA.x;
          const dy = 280 - nodeA.y;
          nodeA.vx += dx * gravityForce;
          nodeA.vy += dy * gravityForce;
        }
      }

      // Attraction along links (spring force)
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);

        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          // Ideal link distance depends on type
          const targetDist = link.type === 'primary' ? 110 : 130;
          const force = (dist - targetDist) * linkForce;

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (sourceNode.fx === null) {
            sourceNode.vx += fx;
            sourceNode.vy += fy;
          }
          if (targetNode.fx === null) {
            targetNode.vx -= fx;
            targetNode.vy -= fy;
          }
        }
      });

      // Update positions
      nodes.forEach(node => {
        if (node.fx !== null) {
          node.x = node.fx;
          node.y = node.fy!;
          node.vx = 0;
          node.vy = 0;
        } else {
          node.vx *= friction;
          node.vy *= friction;
          node.x += node.vx;
          node.y += node.vy;
        }
      });

      // 2. Rendering
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Apply pan & zoom transforms
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw grid in background of canvas
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 35;
      const gridW = canvas.width * 2;
      const gridH = canvas.height * 2;
      for (let x = -gridW; x < gridW; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -gridH);
        ctx.lineTo(x, gridH);
        ctx.stroke();
      }
      for (let y = -gridH; y < gridH; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-gridW, y);
        ctx.lineTo(gridW, y);
        ctx.stroke();
      }

      // Draw Edges (Links)
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);

          // Highlights connections
          const isHighlighted = hoveredNode && 
            (hoveredNode.id === sourceNode.id || hoveredNode.id === targetNode.id);

          if (isHighlighted) {
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 8;
          } else {
            ctx.strokeStyle = link.type === 'primary' ? 'rgba(99, 102, 241, 0.45)' : 'rgba(71, 85, 105, 0.3)';
            ctx.lineWidth = link.type === 'primary' ? 1.5 : 1.0;
            ctx.shadowBlur = 0;
          }
          ctx.stroke();
        }
      });
      ctx.shadowBlur = 0; // reset shadow

      // Draw Nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // Determine styling colors
        let fillColor = '#1e293b';
        let strokeColor = '#475569';
        let shadowColor = '';
        let glowRadius = 0;

        if (node.classification === 'dream') {
          fillColor = '#881337';
          strokeColor = '#f43f5e';
          shadowColor = '#f43f5e';
          glowRadius = 15;
        } else if (node.classification === 'side') {
          fillColor = '#3b0764';
          strokeColor = '#a855f7';
          shadowColor = '#a855f7';
          glowRadius = 10;
        } else if (node.classification === 'mandatory') {
          fillColor = '#ef4444';
          strokeColor = '#f87171';
        } else if (node.classification === 'recommended') {
          fillColor = '#eab308';
          strokeColor = '#facc15';
        } else if (node.classification === 'bonus') {
          fillColor = '#10b981';
          strokeColor = '#34d399';
        } else {
          fillColor = '#334155';
          strokeColor = '#64748b';
        }

        // Apply highlighting override
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        if (isHovered) {
          strokeColor = '#ffffff';
          glowRadius = 18;
          shadowColor = '#ffffff';
        }

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isHovered ? 3.0 : 2.0;

        if (glowRadius > 0 && shadowColor) {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = glowRadius;
        }

        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow

        // Render Text Labels
        ctx.fillStyle = '#f1f5f9';
        ctx.font = node.type === 'job' 
          ? 'bold 11px Inter, sans-serif' 
          : '500 9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Wrap text if too long
        const words = node.name.split(' ');
        if (words.length > 1 && node.radius > 18) {
          ctx.fillText(words[0], node.x, node.y - 5);
          ctx.fillText(words.slice(1).join(' '), node.x, node.y + 6);
        } else {
          ctx.fillText(node.name, node.x, node.y);
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(runSimulation);
    };

    animationFrameId = requestAnimationFrame(runSimulation);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, links, hoveredNode, pan, zoom]);

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Convert absolute screen coords to translated canvas coords
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    // Check hit node
    let hitNode: Node | null = null;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = node.x - x;
      const dy = node.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.radius) {
        hitNode = node;
        break;
      }
    }

    if (hitNode) {
      dragNodeRef.current = hitNode;
      hitNode.fx = x;
      hitNode.fy = y;
      setSelectedNodeInfo(hitNode);
      canvas.setPointerCapture(e.pointerId);
    } else {
      // Pan start
      setIsPanning(true);
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (dragNodeRef.current) {
      const node = dragNodeRef.current;
      node.fx = x;
      node.fy = y;
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y
      });
    } else {
      // Hover detection
      let hitNode: Node | null = null;
      for (const node of nodes) {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < node.radius) {
          hitNode = node;
          break;
        }
      }
      setHoveredNode(hitNode);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (dragNodeRef.current) {
      dragNodeRef.current.fx = null;
      dragNodeRef.current.fy = null;
      dragNodeRef.current = null;
    }
    setIsPanning(false);
    canvas.releasePointerCapture(e.pointerId);
  };

  const handleResetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div ref={containerRef} className="flex-1 h-full flex flex-col bg-dark-950 relative overflow-hidden select-none">
      {/* Top Banner Info / Dream Job selector */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
        <div className="p-3 rounded-xl bg-dark-900/90 border border-slate-800 backdrop-blur-md flex items-center gap-3 pointer-events-auto">
          <Target className="text-rose-500 animate-pulse" size={18} />
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selected Skill Web</div>
            <div className="text-xs font-bold text-slate-100">
              {activeBlueprint ? activeBlueprint.name : 'No Dream Job Selected'}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-3 rounded-xl bg-dark-900/90 border border-slate-800 backdrop-blur-md text-[10px] text-slate-400 flex items-center gap-2 pointer-events-auto max-w-xs">
          <Info className="text-blue-400 shrink-0" size={14} />
          <span>Drag nodes to explore side skills and secondary branching jobs in the spider web.</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      {activeBlueprint ? (
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="flex-1 w-full h-full cursor-grab active:cursor-grabbing bg-dark-950"
          style={{ touchAction: 'none' }}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
            <Target className="text-rose-500 animate-pulse" size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-300">No Career Selected</h2>
          <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed mb-4">
            Select a Dream Job in the right panel checklist to generate its skill spider web.
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {CAREER_BLUEPRINTS.map(bp => (
              <button
                key={bp.id}
                onClick={() => onSelectBlueprint(bp)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                {bp.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Zoom Controls */}
      {activeBlueprint && (
        <div className="absolute bottom-6 right-6 flex items-center gap-2 p-2 bg-dark-800/90 border border-slate-700/50 rounded-xl backdrop-blur-md shadow-lg z-30 pointer-events-auto">
          <button
            onClick={() => setZoom(z => Math.min(2.0, z + 0.1))}
            title="Zoom In"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
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
        </div>
      )}

      {/* Bottom Info Details Drawer */}
      {activeBlueprint && selectedNodeInfo && (
        <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-dark-900/95 border border-slate-800 backdrop-blur-md shadow-2xl z-30 max-w-sm w-[320px] pointer-events-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${
              selectedNodeInfo.classification === 'dream' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
              selectedNodeInfo.classification === 'side' ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' :
              selectedNodeInfo.classification === 'mandatory' ? 'bg-red-500' :
              selectedNodeInfo.classification === 'recommended' ? 'bg-yellow-500' : 'bg-emerald-500'
            }`} />
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              {selectedNodeInfo.type === 'job' ? 'Career Profile' : 'Skill / Requirement'}
            </h4>
          </div>
          <div className="text-sm font-bold text-slate-200">{selectedNodeInfo.name}</div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {selectedNodeInfo.type === 'job' 
              ? `A core profession in this pathway. Connecting skills map directly to this role's requirement blueprints.`
              : `A required competency. This skill is ${selectedNodeInfo.classification} for the target dream job and links into side branches.`
            }
          </p>
          {selectedNodeInfo.classification === 'dream' && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-rose-400 font-semibold bg-rose-500/10 p-1.5 rounded border border-rose-500/10">
              <Sparkles size={12} className="animate-spin-slow" />
              <span>Target Dream Career</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
