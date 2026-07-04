import React from 'react';
import { SimulationInputs, CRISIS_DISRUPTIONS } from '../data';
import { Sliders, Zap, AlertOctagon, HelpCircle } from 'lucide-react';

interface ScenarioControlsProps {
  inputs: SimulationInputs;
  onChange: (inputs: SimulationInputs) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  inputs,
  onChange,
  onRunSimulation,
  isSimulating
}) => {
  const updateInput = (key: keyof SimulationInputs, value: any) => {
    onChange({
      ...inputs,
      [key]: value
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sliders size={18} style={{ color: 'var(--color-primary)' }} />
        Simulation Sandbox
      </h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Tweak variables to analyze downstream marketplace reactions</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
        {/* Sliders */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Price Adjustment <span title="Adjusts the catalog retail prices" style={{ display: 'flex', alignItems: 'center' }}><HelpCircle size={12} style={{ color: 'var(--text-muted)' }} /></span></span>
            <span style={{ color: 'var(--color-primary)' }}>{inputs.priceChange >= 0 ? `+${inputs.priceChange}` : inputs.priceChange}%</span>
          </div>
          <input 
            type="range" 
            min="-20" 
            max="40" 
            value={inputs.priceChange} 
            onChange={(e) => updateInput('priceChange', parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>-20% (Cut)</span>
            <span>0% (Base)</span>
            <span>+40% (Markup)</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <span>Delivery SLA Tier</span>
            <span style={{ color: 'var(--color-secondary)' }}>
              {inputs.deliverySpeed === 1 ? 'Same-Day Delivery' : inputs.deliverySpeed === 2 ? '2-Day Shipping' : 'Standard (5-Day)'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => updateInput('deliverySpeed', speed)}
                style={{
                  flex: 1,
                  background: inputs.deliverySpeed === speed ? 'var(--color-secondary)' : 'rgba(255,255,255,0.03)',
                  border: inputs.deliverySpeed === speed ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: inputs.deliverySpeed === speed ? '#000' : 'var(--text-secondary)',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {speed === 1 ? 'Same-Day' : speed === 2 ? '2-Day' : 'Standard'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <span>Discount Rates</span>
            <span style={{ color: 'var(--color-primary)' }}>{inputs.discountRate}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="50" 
            value={inputs.discountRate} 
            onChange={(e) => updateInput('discountRate', parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>0%</span>
            <span>25%</span>
            <span>50% (Max Cut)</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <span>Marketing Budget</span>
            <span style={{ color: 'var(--color-accent)' }}>{inputs.marketingSpend >= 0 ? `+${inputs.marketingSpend}` : inputs.marketingSpend}%</span>
          </div>
          <input 
            type="range" 
            min="-20" 
            max="50" 
            value={inputs.marketingSpend} 
            onChange={(e) => updateInput('marketingSpend', parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-accent)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>-20%</span>
            <span>0%</span>
            <span>+50% (Saturated)</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <span>Procurement Volume</span>
            <span style={{ color: 'var(--color-primary)' }}>{inputs.procurementVol >= 0 ? `+${inputs.procurementVol}` : inputs.procurementVol}%</span>
          </div>
          <input 
            type="range" 
            min="-20" 
            max="50" 
            value={inputs.procurementVol} 
            onChange={(e) => updateInput('procurementVol', parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>-20%</span>
            <span>0% (Target)</span>
            <span>+50% (Buffer)</span>
          </div>
        </div>

        {/* Crisis Selector */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <AlertOctagon size={14} style={{ color: 'var(--color-warning)' }} />
            Crisis Disruption Injector
          </div>
          <select
            value={inputs.crisis}
            onChange={(e) => updateInput('crisis', e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '10px',
              color: '#fff',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {CRISIS_DISRUPTIONS.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#0a0d1e', color: '#fff' }}>
                {c.label}
              </option>
            ))}
          </select>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '6px', fontStyle: 'italic', lineHeight: '1.3' }}>
            {CRISIS_DISRUPTIONS.find(c => c.id === inputs.crisis)?.desc}
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={onRunSimulation}
          disabled={isSimulating}
          className="btn-primary"
          style={{ width: '100%', marginTop: 'auto', padding: '14px' }}
        >
          <Zap size={16} />
          {isSimulating ? 'Calibrating Ecosystem...' : 'Propagate AI Simulation'}
        </button>
      </div>
    </div>
  );
};
export default ScenarioControls;
