import React, { useState } from 'react';
import { SimulationResult, SimulationInputs } from '../data';
import { 
  TrendingUp, TrendingDown, Leaf, ShieldAlert, Users, 
  Trash2, RefreshCw, AlertTriangle, ArrowRight, CheckCircle, 
  HelpCircle, Copy, Share2, ClipboardList, Sparkles, BrainCircuit, BarChart3
} from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ResultsDashboardProps {
  result: SimulationResult;
  inputs: SimulationInputs;
  onReset: () => void;
  onApplyRecommendation: (recInputs: Partial<SimulationInputs>) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  inputs,
  onReset,
  onApplyRecommendation
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'recommendations' | 'scenarios'>('metrics');

  const {
    revenueChange, customerTrust, sellerHealth, carbonEmissionChange, workerStress, marketplaceHealth,
    ethicalRisk, inventoryWasteUnits, inventoryWasteCost, trustProjected90Days, avgSellerProfit,
    smallSellerSurvival, sellerChurnProb, fairnessIndex, greenDeliveryPct, sustainableShippingScore,
    warehouseLoad, driverWorkload, deliveryUtil, pricingRiskReason, wasteRecommendation, timeline,
    aiSuggestion
  } = result;

  // Generate Executive Summary Text
  const generateSummary = () => {
    return `Tarang AI Executive Report: Revenue is projected to change by ${revenueChange >= 0 ? '+' : ''}${revenueChange}%, but this strategy carries a ${ethicalRisk} ethical risk level. Overall ecosystem health is forecasted at ${marketplaceHealth}/100. Seller profitability is estimated at $${avgSellerProfit}/mo with a ${sellerChurnProb}% churn probability. Logistics emissions show a ${carbonEmissionChange >= 0 ? '+' : ''}${carbonEmissionChange}% change. Customer trust index is projected to settle at ${trustProjected90Days}/100 after 90 days. Logistics workers stress is ${workerStress > 75 ? 'HIGH' : 'STABLE'} (${workerStress}/100). Tarang recommends: ${aiSuggestion.reason}`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ChartJS Data setup for Radar Comparison
  const radarData = {
    labels: ['Revenue Potential', 'Customer Trust', 'Seller Health', 'Eco Footprint (Inverse)', 'Worker Welfare', 'Fairness Index'],
    datasets: [
      {
        label: 'Current Plan',
        data: [
          Math.min(100, Math.max(10, 50 + revenueChange * 2)),
          customerTrust,
          sellerHealth,
          Math.min(100, Math.max(10, 100 - Math.max(0, carbonEmissionChange))),
          Math.max(10, 100 - workerStress),
          fairnessIndex
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
      },
      {
        label: 'AI Recommendation',
        data: [
          Math.min(100, Math.max(10, 50 + aiSuggestion.expectedRevenue * 2)),
          aiSuggestion.expectedTrust,
          aiSuggestion.expectedSellerHealth,
          Math.min(100, Math.max(10, 100 - Math.max(0, aiSuggestion.expectedCarbon))),
          Math.max(10, 100 - aiSuggestion.expectedWorkerStress),
          85 // AI baseline fairness
        ],
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderColor: 'rgba(6, 182, 212, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(6, 182, 212, 1)',
      }
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: { color: 'var(--text-secondary)', font: { size: 10 } },
        ticks: { display: false },
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: { labels: { color: '#fff' } }
    }
  };

  // Helper for scoring coloring
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Summary Bar */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-risk-medium" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', marginBottom: '8px' }}>
            Simulation Complete
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Ecosystem Consequence Forecast</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Config: Price: {inputs.priceChange >= 0 ? '+' : ''}{inputs.priceChange}%, Speed: {inputs.deliverySpeed === 1 ? 'Same Day' : inputs.deliverySpeed === 2 ? '2 Day' : '5 Day'}, Crisis: <span style={{ textTransform: 'capitalize', color: 'var(--color-warning)' }}>{inputs.crisis}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onReset} className="btn-secondary">
            <RefreshCw size={14} />
            Modify Scenario
          </button>
          <button onClick={handleCopySummary} className="btn-primary">
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copied ? 'Summary Copied' : 'Export Executive Report'}
          </button>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '20px' }}>
        <button 
          onClick={() => setActiveTab('metrics')}
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'metrics' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'metrics' ? '#fff' : 'var(--text-secondary)', padding: '10px 16px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ClipboardList size={16} /> Dashboard Metrics
        </button>
        <button 
          onClick={() => setActiveTab('recommendations')}
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'recommendations' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'recommendations' ? '#fff' : 'var(--text-secondary)', padding: '10px 16px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={16} /> AI Recommendations
        </button>
        <button 
          onClick={() => setActiveTab('scenarios')}
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'scenarios' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'scenarios' ? '#fff' : 'var(--text-secondary)', padding: '10px 16px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <BarChart3 size={16} /> Counterfactual Radar
        </button>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Key Metrics Grid */}
          <div className="grid-cols-12" style={{ gap: '20px' }}>
            
            {/* Marketplace Health Dial */}
            <div className="glass-panel" style={{ gridColumn: 'span 3', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Ecosystem Health</h4>
              
              <div className="score-dial">
                <svg width="140" height="140" viewBox="0 0 100 100">
                  <circle className="score-bg" cx="50" cy="50" r="40" />
                  <circle 
                    className="score-fill" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke={getProgressColor(marketplaceHealth)}
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * marketplaceHealth) / 100}
                  />
                </svg>
                <div className="score-value">
                  {marketplaceHealth}
                  <span>/ 100</span>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Trend:</span>
                <span style={{ fontWeight: 700, color: marketplaceHealth > 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                  {marketplaceHealth > 80 ? 'Robust' : marketplaceHealth > 65 ? 'Vulnerable' : 'Critical Risk'}
                </span>
              </div>
            </div>

            {/* Metrics cards grid (spans 9) */}
            <div style={{ gridColumn: 'span 9', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              
              {/* Financial card */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Financial Projection</span>
                  <TrendingUp size={16} style={{ color: revenueChange >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>
                  {revenueChange >= 0 ? '+' : ''}{revenueChange}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Projected Platform Revenue Growth</div>
              </div>

              {/* Carbon Emission card */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Carbon Impact</span>
                  <Leaf size={16} style={{ color: carbonEmissionChange <= 8 ? 'var(--color-success)' : 'var(--color-danger)' }} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>
                  {carbonEmissionChange >= 0 ? '+' : ''}{carbonEmissionChange}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estimated CO₂ Footprint Delta</div>
              </div>

              {/* Worker Stress card */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Logistics Driver Stress</span>
                  <Users size={16} style={{ color: workerStress < 75 ? 'var(--color-success)' : 'var(--color-danger)' }} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>
                  {workerStress}/100
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Workforce workload stress ratio</div>
              </div>

              {/* Customer Trust card */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Customer Trust</span>
                  <span style={{ fontSize: '0.75rem', color: getProgressColor(customerTrust), fontWeight: 700 }}>{customerTrust}/100</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>
                  {trustProjected90Days}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Projected Index After 90 Days</div>
              </div>

              {/* Seller Health card */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Seller Health</span>
                  <span style={{ fontSize: '0.75rem', color: getProgressColor(sellerHealth), fontWeight: 700 }}>{sellerHealth}/100</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>
                  {smallSellerSurvival}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Small Seller Survival Rate</div>
              </div>

              {/* Waste prediction card */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Inventory Waste</span>
                  <Trash2 size={16} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>
                  {inventoryWasteUnits.toLocaleString()} u
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estimated write-off: ${Math.round(inventoryWasteCost / 1000)}k</div>
              </div>

            </div>

          </div>

          {/* Warning Panels & Detail Breakdowns */}
          <div className="grid-cols-12" style={{ gap: '20px' }}>
            
            {/* Left side details */}
            <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Seller Health Deep Dive & Warning Card */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} style={{ color: 'var(--color-primary)' }} />
                  Seller Welfare & Health Analysis
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Avg Seller Profit Margin</span>
                    <h5 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>${avgSellerProfit.toLocaleString()}/mo</h5>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7erom', color: 'var(--text-secondary)', display: 'block' }}>Fairness Index</span>
                    <h5 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{fairnessIndex}/100</h5>
                  </div>
                </div>

                {sellerChurnProb > 25 && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', padding: '12px', display: 'flex', gap: '10px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--color-danger)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ff8a8a', marginBottom: '2px' }}>Critical Seller Churn Alert</h5>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        ⚠️ {sellerChurnProb}% of small marketplace sellers may become unprofitable. Increased commission fees or steep discounting is causing severe margin compression.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Carbon Impact Meter */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Leaf size={16} style={{ color: 'var(--color-success)' }} />
                  Carbon & Logistics Meter
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Green Delivery Rate</span>
                    <h5 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '2px' }}>{greenDeliveryPct}%</h5>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sustainable Shipping Score</span>
                    <h5 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-secondary)', marginTop: '2px' }}>{sustainableShippingScore}/100</h5>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Ecosystem Suggestion:</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {inputs.deliverySpeed === 1 
                      ? 'Batch deliveries for metro cities and convert local transport fleets to EVs to save 8.5% CO2.' 
                      : 'Emissions are optimized. Standard 5-day shipping lowers air freight costs and split-deliveries.'}
                  </span>
                </div>
              </div>

            </div>

            {/* Right side details */}
            <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Ethical Decision Badge */}
              <div className="glass-panel" style={{ padding: '20px', background: ethicalRisk === 'High' ? 'rgba(239, 68, 68, 0.04)' : ethicalRisk === 'Medium' ? 'rgba(245, 158, 11, 0.03)' : 'rgba(16, 185, 129, 0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={16} style={{ color: ethicalRisk === 'High' ? 'var(--color-danger)' : ethicalRisk === 'Medium' ? 'var(--color-warning)' : 'var(--color-success)' }} />
                    Ethical Checker
                  </h4>
                  <span className={`badge ${
                    ethicalRisk === 'High' ? 'badge-risk-high' : ethicalRisk === 'Medium' ? 'badge-risk-medium' : 'badge-risk-low'
                  }`}>
                    {ethicalRisk} Risk
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {pricingRiskReason}
                </p>
              </div>

              {/* Workforce Stress Breakdown */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} style={{ color: 'var(--color-secondary)' }} />
                  Fulfillment Agent stress
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Warehouse Loading Index</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{warehouseLoad}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Delivery Fleet Utilization</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{deliveryUtil}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Driver Overwork Level</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{driverWorkload}%</span>
                  </div>
                </div>

                {workerStress > 78 && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.08)', borderRadius: '6px', padding: '10px', fontSize: '0.72rem', color: '#ffb63f', border: '1px solid rgba(245,158,11,0.15)' }}>
                    ⚠️ same-day shipping exceeds driver capacity by {Math.round(workerStress - 78)}%. Safety risk elevated.
                  </div>
                )}
              </div>

              {/* Waste Meter */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trash2 size={16} style={{ color: 'var(--color-accent)' }} />
                  Overstock Waste Prediction
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {wasteRecommendation}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total cost footprint: <span style={{ color: '#fff', fontWeight: 600 }}>${inventoryWasteCost.toLocaleString()}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Ripple Timeline */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BrainCircuit size={18} style={{ color: 'var(--color-primary)' }} />
              Ripple Timeline (Temporal Impact Projection)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Cascading effects of decisions tracking over 18 weeks</p>

            <div style={{ display: 'flex', position: 'relative', marginTop: '10px', paddingBottom: '10px' }}>
              {/* Connecting line */}
              <div style={{
                position: 'absolute',
                top: '24px',
                left: '20px',
                right: '20px',
                height: '2px',
                background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary), var(--color-accent))',
                zIndex: 0
              }} />

              {timeline.map((event, idx) => (
                <div 
                  key={idx} 
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '0 10px',
                    zIndex: 1
                  }}
                >
                  {/* Timeline dot */}
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: event.impact === 'good' ? 'var(--color-success)' : event.impact === 'bad' ? 'var(--color-danger)' : 'rgba(255,255,255,0.1)',
                    border: '4px solid #060814',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: '#fff',
                    boxShadow: '0 0 10px rgba(255,255,255,0.05)',
                    marginBottom: '12px'
                  }}>
                    W{event.week}
                  </div>

                  <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{event.title}</h5>
                  <span className="badge" style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', marginBottom: '8px' }}>{event.metric}</span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Explainable AI Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BrainCircuit size={18} style={{ color: 'var(--color-accent)' }} />
              Explainable AI Panel
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>What factors are contributing to changes in your scores?</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Why is Seller Health decreasing?</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { factor: 'Discount pressure from promotions', weight: 41 },
                    { factor: 'Shipping cost increases', weight: 26 },
                    { factor: 'Pricing inflation compression', weight: 19 },
                    { factor: 'Inventory holding imbalance', weight: 14 }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>• {item.factor}</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{item.weight}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <div style={{ width: `${item.weight}%`, height: '100%', borderRadius: '2px', background: 'var(--color-accent)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Why is Worker Stress increasing?</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { factor: 'Same-day SLA shipping targets', weight: 48 },
                    { factor: 'Campaign marketing order spikes', weight: 22 },
                    { factor: 'Procurement volume warehouse load', weight: 18 },
                    { factor: 'Fulfillment layout logistics friction', weight: 12 }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>• {item.factor}</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{item.weight}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <div style={{ width: `${item.weight}%`, height: '100%', borderRadius: '2px', background: 'var(--color-secondary)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} className="text-gradient-cyber" style={{ color: 'var(--color-secondary)' }} />
                AI Consequence Recommendation Engine
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Optimal balancing of business gains against environmental and societal footprints</p>
            </div>
            
            <span className="badge badge-risk-low">
              {aiSuggestion.confidence}% Confidence
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Strategy comparison */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Current Strategy Settings</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Price Adjustment:</span>
                  <span style={{ fontWeight: 600 }}>{inputs.priceChange}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Marketing Budget:</span>
                  <span style={{ fontWeight: 600 }}>{inputs.marketingSpend}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Delivery Target SLA:</span>
                  <span style={{ fontWeight: 600 }}>{inputs.deliverySpeed === 1 ? 'Same-Day' : inputs.deliverySpeed === 2 ? '2-Day' : '5-Day'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Discount Rates:</span>
                  <span style={{ fontWeight: 600 }}>{inputs.discountRate}%</span>
                </div>
              </div>
            </div>

            {/* AI suggestion settings */}
            <div style={{ background: 'rgba(6, 182, 212, 0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '16px' }}>Recommended Alternative Strategy</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Price Adjustment:</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{aiSuggestion.priceChange}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Marketing Budget:</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{aiSuggestion.marketingSpend}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Delivery Target SLA:</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{aiSuggestion.deliverySpeed === 1 ? 'Same-Day' : aiSuggestion.deliverySpeed === 2 ? '2-Day' : '5-Day'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Discount Rates:</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{aiSuggestion.discountRate}%</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', marginBottom: '24px', fontSize: '0.85rem', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>AI Recommendation Rationale:</span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
              {aiSuggestion.reason}
            </p>
          </div>

          {/* Core comparison scores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Ecosystem Health', current: `${marketplaceHealth}/100`, rec: `${aiSuggestion.expectedHealth}/100` },
              { label: 'Revenue Delta', current: `${revenueChange}%`, rec: `${aiSuggestion.expectedRevenue}%` },
              { label: 'Customer Trust', current: `${customerTrust}/100`, rec: `${aiSuggestion.expectedTrust}/100` },
              { label: 'Seller Survival', current: `${smallSellerSurvival}%`, rec: `${aiSuggestion.expectedSellerHealth}%` },
              { label: 'Carbon footprint', current: `${carbonEmissionChange}%`, rec: `${aiSuggestion.expectedCarbon}%` }
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'line-through', marginTop: '4px' }}>{item.current}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-success)' }}>{item.rec}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onApplyRecommendation({
              priceChange: aiSuggestion.priceChange,
              marketingSpend: aiSuggestion.marketingSpend,
              deliverySpeed: aiSuggestion.deliverySpeed,
              discountRate: aiSuggestion.discountRate
            })}
            className="btn-primary"
            style={{ width: '100%', padding: '14px' }}
          >
            Apply Suggested AI Adjustments
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Ecosystem Counterfactual Comparison</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Compare current configuration tradeoffs against recommended AI strategies</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
            <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Radar Metrics Summary</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                The radar chart maps the tradeoffs of the current plan against the AI recommended strategy. 
                A larger covered area reflects a healthier operational ecosystem.
              </p>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>• <strong style={{ color: '#fff' }}>Revenue Potential:</strong> Focuses on cash-in profits.</li>
                <li>• <strong style={{ color: '#fff' }}>Customer Trust Index:</strong> High repeat rate and loyalty metrics.</li>
                <li>• <strong style={{ color: '#fff' }}>Seller Health Score:</strong> Protects local merchants from discount compression.</li>
                <li>• <strong style={{ color: '#fff' }}>Carbon Footprint:</strong> Evaluates split shipping fuel consumption.</li>
                <li>• <strong style={{ color: '#fff' }}>Worker Welfare:</strong> Avoid fulfillment agent overwork capacity spikes.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default ResultsDashboard;
