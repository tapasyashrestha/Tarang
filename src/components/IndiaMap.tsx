import React, { useState } from 'react';
import { STATES_LIST } from '../data';
import { Shield, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface IndiaMapProps {
  stateScores: { [state: string]: { delivery: number; seller: number; satisfaction: number } };
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ stateScores }) => {
  const [selectedState, setSelectedState] = useState<string>('IN-MH');
  const [metricTab, setMetricTab] = useState<'delivery' | 'seller' | 'satisfaction'>('delivery');

  // Convert lat/lng to stylized SVG coordinates (India bounding box roughly: Lat 8 to 37, Lng 68 to 97)
  const getCoords = (lat: number, lng: number) => {
    // Map width 500, height 550
    const x = ((lng - 68) / (97 - 68)) * 380 + 60;
    const y = 550 - (((lat - 8) / (37 - 8)) * 480 + 40);
    return { x, y };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  const currentStateData = STATES_LIST.find(s => s.id === selectedState);
  const currentStateScores = stateScores[selectedState] || { delivery: 75, seller: 75, satisfaction: 75 };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} className="text-gradient-cyber" style={{ color: 'var(--color-secondary)' }} />
            Regional Fairness Heatmap
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Identifying geographical disparities and rural latency</p>
        </div>
        
        {/* Metric Toggles */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
          {(['delivery', 'seller', 'satisfaction'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setMetricTab(tab)}
              style={{
                background: metricTab === tab ? 'var(--color-primary)' : 'transparent',
                border: 'none',
                color: metricTab === tab ? '#fff' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600,
                textTransform: 'capitalize',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab === 'delivery' ? 'Delivery Speed' : tab === 'seller' ? 'Seller Distribution' : 'Satisfaction'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, minHeight: '400px' }}>
        {/* Stylized SVG Map */}
        <div style={{ position: 'relative', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Subtle grid lines background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

          <svg width="100%" height="450" viewBox="0 0 500 550" style={{ zIndex: 1 }}>
            {/* Outline connection paths - cyber-network style */}
            {STATES_LIST.map((state, idx) => {
              const from = getCoords(state.lat, state.lng);
              // Connect state nodes together to look like a neural mesh
              const nextState = STATES_LIST[(idx + 1) % STATES_LIST.length];
              const to = getCoords(nextState.lat, nextState.lng);
              return (
                <line
                  key={`line-${state.id}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(99, 102, 241, 0.08)"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Glowing nodes for states */}
            {STATES_LIST.map(state => {
              const { x, y } = getCoords(state.lat, state.lng);
              const score = stateScores[state.id]?.[metricTab] || 70;
              const color = getScoreColor(score);
              const isSelected = state.id === selectedState;

              return (
                <g 
                  key={state.id} 
                  cursor="pointer" 
                  onClick={() => setSelectedState(state.id)}
                >
                  {/* Selection Outer Ring */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      style={{ transformOrigin: `${x}px ${y}px`, animation: 'spin 8s linear infinite' }}
                    />
                  )}
                  
                  {/* Glowing halo */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? '12' : '8'}
                    fill={color}
                    opacity={isSelected ? '0.3' : '0.15'}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Core Node */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? '7' : '5'}
                    fill={color}
                    stroke="#0d1127"
                    strokeWidth="1.5"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  
                  {/* Label */}
                  <text
                    x={x}
                    y={y - 12}
                    fill={isSelected ? '#fff' : 'var(--text-secondary)'}
                    fontSize={isSelected ? '10px' : '8px'}
                    fontWeight={isSelected ? '700' : '500'}
                    textAnchor="middle"
                    style={{ pointerEvents: 'none', transition: 'all 0.3s ease', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    {state.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* State Information Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {currentStateData ? (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{currentStateData.name}</h4>
                <span className="badge badge-risk-low" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary-glow)', border: '1px solid var(--color-primary)' }}>
                  {currentStateData.id}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Delivery SLA Speed:</span>
                    <span style={{ fontWeight: 600, color: getScoreColor(currentStateScores.delivery) }}>{currentStateScores.delivery}/100</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    <div style={{ width: `${currentStateScores.delivery}%`, height: '100%', borderRadius: '3px', background: getScoreColor(currentStateScores.delivery), transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Seller Welfare Score:</span>
                    <span style={{ fontWeight: 600, color: getScoreColor(currentStateScores.seller) }}>{currentStateScores.seller}/100</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    <div style={{ width: `${currentStateScores.seller}%`, height: '100%', borderRadius: '3px', background: getScoreColor(currentStateScores.seller), transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Customer Trust/Satisfaction:</span>
                    <span style={{ fontWeight: 600, color: getScoreColor(currentStateScores.satisfaction) }}>{currentStateScores.satisfaction}/100</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    <div style={{ width: `${currentStateScores.satisfaction}%`, height: '100%', borderRadius: '3px', background: getScoreColor(currentStateScores.satisfaction), transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-success)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Ecosystem Status</h5>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {currentStateScores.delivery < 50 
                      ? '⚠️ Action recommended: Low delivery speeds detected in rural clusters. Consider regional hub batching.'
                      : currentStateScores.seller < 60
                      ? '⚠️ Margin pressure detected. Marketplace discounts are negatively affecting local retailers.'
                      : 'Ecosystem state variables are stable. Balanced commercial and community metrics.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Select a state node on the map to analyze regional variables.
            </div>
          )}
        </div>
      </div>
      
      {/* Dynamic inline spinning animation */}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default IndiaMap;
