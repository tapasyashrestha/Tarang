import React, { useState } from 'react';
import { SimulationResult } from '../data';
import { 
  ShieldAlert, Activity, Leaf, Users, Trash2, 
  BrainCircuit, Sparkles, CheckCircle, Copy, PlayCircle 
} from 'lucide-react';

interface CommandCenterProps {
  result: SimulationResult;
  onRunNewScenario: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ result, onRunNewScenario }) => {
  const [copied, setCopied] = useState(false);

  const {
    revenueChange, customerTrust, sellerHealth, carbonEmissionChange, workerStress, marketplaceHealth,
    ethicalRisk, inventoryWasteUnits, avgSellerProfit, smallSellerSurvival, sellerChurnProb,
    fairnessIndex, pricingRiskReason, timeline, aiSuggestion
  } = result;

  const handleCopy = () => {
    const text = `Tarang CEO Executive Summary: Ecosystem Health is ${marketplaceHealth}/100. Price Revenue: ${revenueChange >= 0 ? '+' : ''}${revenueChange}%. Seller Survival Rate: ${smallSellerSurvival}%. Carbon: ${carbonEmissionChange >= 0 ? '+' : ''}${carbonEmissionChange}%. Driver Stress: ${workerStress}/100. AI Recommendation: ${aiSuggestion.reason}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = (level: string) => {
    if (level === 'High') return 'var(--color-danger)';
    if (level === 'Medium') return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(13, 17, 39, 0.9) 0%, rgba(22, 28, 61, 0.7) 100%)' }}>
        <div>
          <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-secondary)', border: '1px solid var(--color-secondary)', marginBottom: '8px' }}>
            CEO Control Room
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Impact Command Center</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ecosystem balance and commercial consequence monitoring matrix</p>
        </div>

        <button onClick={onRunNewScenario} className="btn-primary">
          <PlayCircle size={16} />
          Trigger New Sandbox Scenario
        </button>
      </div>

      {/* Grid: 3 columns */}
      <div className="grid-cols-12" style={{ gap: '20px' }}>
        
        {/* Col 1: Major Health Metrics */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Marketplace Health widget */}
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Marketplace Health Score</h4>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: getRiskColor(ethicalRisk === 'High' ? 'Medium' : 'Low') }}>
              {marketplaceHealth}
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}> /100</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', margin: '14px 0' }}>
              <div style={{ width: `${marketplaceHealth}%`, height: '100%', borderRadius: '2px', background: getRiskColor(ethicalRisk === 'High' ? 'Medium' : 'Low') }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Weighted balance of social and revenue metrics</span>
          </div>

          {/* Ethical risk gauge */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={14} style={{ color: getRiskColor(ethicalRisk) }} />
              Ethical Risk Meter
            </h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: getRiskColor(ethicalRisk), marginBottom: '6px' }}>
              {ethicalRisk} Risk Level
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {pricingRiskReason}
            </p>
          </div>

          {/* Carbon Footprint Widget */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Leaf size={14} style={{ color: 'var(--color-success)' }} />
              Carbon Footprint Delta
            </h4>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: carbonEmissionChange > 10 ? 'var(--color-danger)' : 'var(--color-success)', marginBottom: '4px' }}>
              {carbonEmissionChange >= 0 ? '+' : ''}{carbonEmissionChange}%
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>CO₂ emissions generated through logstics fulfillment</span>
          </div>

        </div>

        {/* Col 2: Social Impact Indices */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Seller Welfare Widget */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} style={{ color: 'var(--color-primary)' }} />
              Seller Welfare Index
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Small Seller Survival Rate</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{smallSellerSurvival}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Seller Churn Probability</span>
                <span style={{ fontWeight: 600, color: sellerChurnProb > 25 ? 'var(--color-danger)' : 'var(--color-success)' }}>{sellerChurnProb}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Marketplace Fairness Index</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{fairnessIndex}/100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Monthly Profits</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>${avgSellerProfit}</span>
              </div>
            </div>
          </div>

          {/* Customer Trust Index */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} style={{ color: 'var(--color-secondary)' }} />
              Customer Trust Index
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current trust score:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary)' }}>{customerTrust}/100</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>90-day projected index:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent)' }}>{customerTrust - 8}/100</span>
            </div>
          </div>

          {/* Logistics Worker stress */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} style={{ color: 'var(--color-warning)' }} />
              Logistics Workload Stress
            </h4>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: workerStress > 75 ? 'var(--color-danger)' : 'var(--color-success)', marginBottom: '4px' }}>
              {workerStress}/100
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              {workerStress > 75 
                ? '⚠️ Same-day delivery targets exceed driver capacity thresholds. Accident risks elevated.'
                : 'Fulfillment operations running at safe capacity.'}
            </p>
          </div>

        </div>

        {/* Col 3: AI Engine & Executive Summary */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* AI Recommendation Engine */}
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(6, 182, 212, 0.03)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} style={{ color: 'var(--color-secondary)' }} />
              AI Recommendation
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              {aiSuggestion.reason}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.72rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Health:</span>
                <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>{aiSuggestion.expectedHealth}/100</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Revenue:</span>
                <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>+{aiSuggestion.expectedRevenue}%</div>
              </div>
            </div>
          </div>

          {/* Executive Summary Card */}
          <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BrainCircuit size={14} style={{ color: 'var(--color-accent)' }} />
              CEO Executive Summary
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, flex: 1, overflowY: 'auto', marginBottom: '14px' }}>
              Revenue is projected to change by {revenueChange >= 0 ? '+' : ''}{revenueChange}%, but this strategy is expected to reduce seller profitability by {100 - smallSellerSurvival}%, increase delivery emissions by {carbonEmissionChange}%, and lower customer trust indices within three months.
            </p>
            <button onClick={handleCopy} className="btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '0.75rem' }}>
              {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
              {copied ? 'Summary Copied' : 'Copy Executive Report'}
            </button>
          </div>

        </div>

      </div>

      {/* Risk timeline overview */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
          Risk Timeline Overview
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {timeline.map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: item.impact === 'good' ? 'var(--color-success)' : item.impact === 'bad' ? 'var(--color-danger)' : 'var(--text-secondary)', fontWeight: 700 }}>
                Week {item.week}: {item.title}
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                {item.description.slice(0, 75)}...
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default CommandCenter;
