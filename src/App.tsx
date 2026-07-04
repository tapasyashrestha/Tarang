import React, { useState, useEffect } from 'react';
import { runSimulation, SimulationInputs, SimulationResult } from './data';
import { DependencyMap } from './components/DependencyMap';
import { ScenarioControls } from './components/ScenarioControls';
import { ResultsDashboard } from './components/ResultsDashboard';
import { IndiaMap } from './components/IndiaMap';
import { CommandCenter } from './components/CommandCenter';
import { 
  Network, LayoutDashboard, Map, Eye, Zap, 
  HelpCircle, AlertTriangle, ShieldCheck, Cpu 
} from 'lucide-react';

const SIMULATION_LOGS = [
  'Loading ecosystem parameters...',
  'Constructing transaction dependency layers...',
  'Evaluating seller marginal profit distributions...',
  'Estimating fulfillment center driver utilization thresholds...',
  'Simulating logistics CO₂ emissions footprint...',
  'Detecting pricing manipulation & discount perception flags...',
  'Calibrating customer 90-day churn likelihood model...',
  'Ecosystem equilibrium computed successfully.'
];

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'network' | 'sandbox' | 'results' | 'map' | 'command_center'>('network');
  
  const [inputs, setInputs] = useState<SimulationInputs>({
    priceChange: 15,
    deliverySpeed: 2,
    discountRate: 25,
    marketingSpend: 15,
    procurementVol: 10,
    crisis: 'none'
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogIndex, setSimulationLogIndex] = useState(0);
  const [result, setResult] = useState<SimulationResult>(runSimulation(inputs));

  // Handle fake simulation log steps
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      setSimulationLogIndex(0);
      interval = setInterval(() => {
        setSimulationLogIndex(prev => {
          if (prev >= SIMULATION_LOGS.length - 1) {
            clearInterval(interval);
            setIsSimulating(false);
            setResult(runSimulation(inputs));
            setScreen('results');
            return prev;
          }
          return prev + 1;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
  };

  const handleApplyRecommendation = (recInputs: Partial<SimulationInputs>) => {
    const updated = { ...inputs, ...recInputs };
    setInputs(updated);
    setResult(runSimulation(updated));
    setScreen('results');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      
      {/* Background cyber grid effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(99, 102, 241, 0.4), transparent)',
        zIndex: 10
      }} />

      {/* Header bar */}
      <header style={{
        background: 'rgba(6, 8, 20, 0.65)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.3)'
          }}>
            <Cpu size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tarang</h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>See every ripple before you make the wave.</span>
          </div>
        </div>

        {/* Global Navigation links */}
        <nav style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { id: 'network', label: 'Ecosystem Network', icon: Network },
            { id: 'sandbox', label: 'Sandbox Simulation', icon: Zap },
            { id: 'map', label: 'Regional Fairness', icon: Map },
            { id: 'command_center', label: 'CEO Command Center', icon: LayoutDashboard }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = screen === item.id || (item.id === 'sandbox' && screen === 'results');
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id as any)}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  border: 'none',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={14} style={{ color: isActive ? 'var(--color-primary)' : 'inherit' }} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Body */}
      <main style={{ flex: 1, padding: '40px', maxWidth: '1440px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* Render screens */}
        {screen === 'network' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(13, 17, 39, 0.7) 0%, rgba(22, 28, 61, 0.4) 100%)' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Ecosystem Dependency Architecture</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.5 }}>
                Tarang maps decisions (sliders) to direct and indirect consequences. Business actions ripple through operational costs, supplier livelihoods, environmental outcomes, and customer retention. Select nodes below to explore influence pathways.
              </p>
            </div>
            <DependencyMap onSelectVariable={(id) => console.log(`Selected: ${id}`)} />
          </div>
        )}

        {screen === 'sandbox' && (
          <div className="grid-cols-12" style={{ gap: '24px' }}>
            <div style={{ gridColumn: 'span 4' }}>
              <ScenarioControls 
                inputs={inputs} 
                onChange={setInputs} 
                onRunSimulation={handleRunSimulation} 
                isSimulating={isSimulating}
              />
            </div>
            
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Configure Scenario</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Adjust parameters on the left pane and hit **Propagate AI Simulation**. Tarang's network model will calculate the consequence vectors across small seller survival indices, carbon footprint estimates, driver stress limits, and ethical compliance scores.
                </p>
                <div style={{ display: 'flex', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <HelpCircle size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>How calculations propagate</h5>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      A 25% price increase will boost short term margins (+8%) but will lower Customer Trust (-16%), increase state-wise shipping delays, and trigger potential regulatory pricing compliance warnings. Same-day delivery will heavily increase CO₂ (+18.5%) and driver overwork fatigue (+24%).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'results' && (
          <ResultsDashboard 
            result={result} 
            inputs={inputs} 
            onReset={() => setScreen('sandbox')} 
            onApplyRecommendation={handleApplyRecommendation}
          />
        )}

        {screen === 'map' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Geographical Distribution Heatmap</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '850px', lineHeight: 1.5 }}>
                Marketplace decisions have state-specific impacts. Shorter shipping SLAs benefit metropolitan clusters (e.g., Delhi, Maharashtra) but create supply gaps and high delivery times in rural regions. Analyze geographical disparities below.
              </p>
            </div>
            <IndiaMap stateScores={result.stateScores} />
          </div>
        )}

        {screen === 'command_center' && (
          <CommandCenter result={result} onRunNewScenario={() => setScreen('sandbox')} />
        )}

      </main>

      {/* Simulator Processing Overlay */}
      {isSimulating && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(6, 8, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
              animation: 'pulse-glow 1.5s infinite ease-in-out'
            }}>
              <Cpu size={36} style={{ color: '#fff' }} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>AI Consequence Modeling</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Propagating changes across supply chain variables...</p>
            </div>

            {/* Logs tracker */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '16px',
              height: '180px',
              overflowY: 'hidden',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {SIMULATION_LOGS.slice(0, simulationLogIndex + 1).map((log, idx) => (
                <div 
                  key={idx} 
                  style={{
                    fontSize: '0.75rem',
                    color: idx === simulationLogIndex ? 'var(--color-secondary)' : 'var(--text-muted)',
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ color: idx === simulationLogIndex ? 'var(--color-secondary)' : 'var(--color-success)' }}>
                    {idx === simulationLogIndex ? '●' : '✓'}
                  </span>
                  {log}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{
              height: '4px',
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${((simulationLogIndex + 1) / SIMULATION_LOGS.length) * 100}%`,
                background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Keyframes for spinner and pulse */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
          }
        }
      `}</style>
    </div>
  );
};
export default App;
