import React, { useState } from 'react';
import { DEPENDENCY_NODES, VariableNode } from '../data';
import { Network, Activity, Search, AlertCircle, HelpCircle } from 'lucide-react';

interface DependencyMapProps {
  onSelectVariable?: (variableId: string) => void;
}

export const DependencyMap: React.FC<DependencyMapProps> = ({ onSelectVariable }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('price');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedNode = DEPENDENCY_NODES.find(n => n.id === selectedNodeId) || DEPENDENCY_NODES[0];

  // Filter nodes by search query
  const filteredNodes = DEPENDENCY_NODES.filter(node => 
    node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isConnected = (nodeAId: string, nodeBId: string) => {
    const nodeA = DEPENDENCY_NODES.find(n => n.id === nodeAId);
    const nodeB = DEPENDENCY_NODES.find(n => n.id === nodeBId);
    if (!nodeA || !nodeB) return false;
    return nodeA.connectedIds.includes(nodeBId) || nodeB.connectedIds.includes(nodeAId);
  };

  const getStrokeColor = (fromId: string, toId: string) => {
    const activeId = hoveredNodeId || selectedNodeId;
    if (activeId === fromId || activeId === toId) {
      return 'var(--color-primary)';
    }
    return 'rgba(255, 255, 255, 0.08)';
  };

  const getStrokeWidth = (fromId: string, toId: string) => {
    const activeId = hoveredNodeId || selectedNodeId;
    if (activeId === fromId || activeId === toId) return '3';
    return '1.5';
  };

  const getNodeColor = (type: string, isSelected: boolean, isHighlighted: boolean) => {
    if (isSelected) {
      if (type === 'input') return 'var(--color-primary)';
      if (type === 'output') return 'var(--color-secondary)';
      return 'var(--color-accent)';
    }
    if (isHighlighted) {
      if (type === 'input') return 'rgba(99, 102, 241, 0.6)';
      if (type === 'output') return 'rgba(6, 182, 212, 0.6)';
      return 'rgba(168, 85, 247, 0.6)';
    }
    if (type === 'input') return '#2b3252';
    if (type === 'output') return '#1b3e47';
    return '#34264d';
  };

  const getNodeBorder = (type: string, isSelected: boolean) => {
    if (isSelected) return '#ffffff';
    if (type === 'input') return 'var(--color-primary)';
    if (type === 'output') return 'var(--color-secondary)';
    return 'var(--color-accent)';
  };

  return (
    <div className="grid-cols-12" style={{ gap: '20px', minHeight: '520px' }}>
      
      {/* Visual Dependency Diagram */}
      <div className="glass-panel" style={{ gridColumn: 'span 8', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={18} className="text-gradient-cyber" style={{ color: 'var(--color-primary)' }} />
              Ecosystem Variables Mesh
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click nodes to explore propagation pathways & relationships</p>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search variables..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '6px 10px 6px 30px',
                fontSize: '0.75rem',
                color: '#fff',
                width: '180px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--color-primary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Business Sliders (Inputs)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--color-accent)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Societal Variables (Ripple metrics)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--color-secondary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Platform Health (Outputs)</span>
          </div>
        </div>

        {/* Main SVG Graph */}
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', overflow: 'hidden', minHeight: '380px', position: 'relative' }}>
          
          {/* Subtle grid lines background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />

          <svg width="100%" height="100%" viewBox="0 0 950 720" style={{ minHeight: '380px' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.2)" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-primary)" />
              </marker>
            </defs>

            {/* Connecting Edges */}
            {DEPENDENCY_NODES.map((node) => 
              node.connectedIds.map(targetId => {
                const targetNode = DEPENDENCY_NODES.find(n => n.id === targetId);
                if (!targetNode) return null;

                const strokeColor = getStrokeColor(node.id, targetId);
                const strokeWidth = getStrokeWidth(node.id, targetId);
                const isActive = strokeColor !== 'rgba(255, 255, 255, 0.08)';

                return (
                  <g key={`edge-${node.id}-${targetId}`}>
                    {/* Background line */}
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    
                    {/* Ripple/Flow animation when active */}
                    {isActive && (
                      <circle r="3" fill="#fff" style={{
                        offsetPath: `path('M ${node.x} ${node.y} L ${targetNode.x} ${targetNode.y}')`,
                        animation: 'flow-dot 2.5s linear infinite'
                      }} />
                    )}
                  </g>
                );
              })
            )}

            {/* Nodes */}
            {DEPENDENCY_NODES.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isSearched = searchQuery === '' || filteredNodes.some(fn => fn.id === node.id);
              
              // Node is highlighted if selected, hovered, or connected to active node
              const activeId = hoveredNodeId || selectedNodeId;
              const isHighlighted = isConnected(node.id, activeId);

              const fill = getNodeColor(node.type, isSelected, isHighlighted);
              const stroke = getNodeBorder(node.type, isSelected || isHovered);

              return (
                <g 
                  key={node.id} 
                  cursor="pointer" 
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    if (onSelectVariable) onSelectVariable(node.id);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  opacity={isSearched ? 1 : 0.25}
                  style={{ transition: 'opacity 0.3s ease' }}
                >
                  {/* Outer selection ring */}
                  {(isSelected || isHovered) && (
                    <rect
                      x={node.x - 72}
                      y={node.y - 28}
                      width="144"
                      height="56"
                      rx="8"
                      fill="none"
                      stroke={stroke}
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      style={{ animation: 'spin 12s linear infinite', transformOrigin: `${node.x}px ${node.y}px` }}
                    />
                  )}

                  {/* Core Card */}
                  <rect
                    x={node.x - 65}
                    y={node.y - 22}
                    width="130"
                    height="44"
                    rx="6"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? '2' : '1'}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Icon indicator dot */}
                  <circle
                    cx={node.x - 48}
                    cy={node.y}
                    r="4"
                    fill={node.type === 'input' ? 'var(--color-primary)' : node.type === 'output' ? 'var(--color-secondary)' : 'var(--color-accent)'}
                  />

                  {/* Text Label */}
                  <text
                    x={node.x - 38}
                    y={node.y + 4}
                    fill="#ffffff"
                    fontSize="11px"
                    fontWeight="600"
                    textAnchor="start"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Side Variable Details Panel */}
      <div className="glass-panel" style={{ gridColumn: 'span 4', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} style={{ color: 'var(--color-primary)' }} />
          Variable Detail
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Ecosystem relationship configuration details</p>

        {selectedNode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            {/* Header info */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{selectedNode.label}</h4>
                <span className={`badge ${
                  selectedNode.type === 'input' ? 'badge-risk-low' : selectedNode.type === 'output' ? 'badge-risk-medium' : 'badge-risk-high'
                }`} style={{
                  color: selectedNode.type === 'input' ? 'var(--color-primary)' : selectedNode.type === 'output' ? 'var(--color-secondary)' : 'var(--color-accent)',
                  borderColor: selectedNode.type === 'input' ? 'var(--color-primary)' : selectedNode.type === 'output' ? 'var(--color-secondary)' : 'var(--color-accent)',
                  background: 'rgba(255,255,255,0.03)'
                }}>
                  {selectedNode.type === 'input' ? 'Slider input' : selectedNode.type === 'output' ? 'Outcome score' : 'Social Metric'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedNode.description}
              </p>
            </div>

            {/* Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Influence Index</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary)' }}>{selectedNode.influenceScore}%</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Connectivity</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent)' }}>{selectedNode.connectedIds.length} Nodes</div>
              </div>
            </div>

            {/* Historical trend miniature visualization */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '10px' }}>Historical Benchmark Trend</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {selectedNode.historicalTrend.map((val, idx) => {
                  const max = Math.max(...selectedNode.historicalTrend);
                  const min = Math.min(...selectedNode.historicalTrend);
                  const pct = max === min ? 50 : ((val - min) / (max - min)) * 80 + 20;

                  return (
                    <div 
                      key={idx} 
                      style={{
                        flex: 1,
                        height: `${pct}%`,
                        background: 'linear-gradient(to top, var(--color-primary), var(--color-secondary))',
                        borderRadius: '2px 2px 0 0',
                        position: 'relative'
                      }}
                      title={`Value: ${val}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Connected node list */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>Direct Linkages</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedNode.connectedIds.map(cid => {
                  const cnode = DEPENDENCY_NODES.find(n => n.id === cid);
                  return (
                    <span 
                      key={cid} 
                      onClick={() => setSelectedNodeId(cid)}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {cnode?.label || cid}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-secondary)', textAlign: 'center' }}>
            <HelpCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
            Select a network node to display variables data.
          </div>
        )}
      </div>

      <style>{`
        @keyframes flow-dot {
          to {
            offset-distance: 100%;
          }
        }
      `}</style>
    </div>
  );
};
export default DependencyMap;
