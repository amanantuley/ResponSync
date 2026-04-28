import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, Map } from 'lucide-react';

export default function Home() {
  return (
    <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
        Intelligent Crisis Response System
      </h1>
      <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        Empowering communities and first responders with AI-driven, real-time emergency management. 
        Report crises instantly and let ResponSync coordinate the best action.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
        <Link to="/report" className="btn btn-danger" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
          <AlertTriangle /> Report Emergency
        </Link>
        <Link to="/admin" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
          <ShieldCheck /> Admin Dashboard
        </Link>
      </div>

      <div className="grid-2" style={{ textAlign: 'left' }}>
        <div className="glass-panel">
          <Map size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3>Real-time Tracking</h3>
          <p>Instant localization of incidents and available resources via interactive maps.</p>
        </div>
        <div className="glass-panel">
          <ShieldCheck size={32} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h3>AI Decision Engine</h3>
          <p>Powered by Google Gemini to analyze severity, recommend actions, and deploy the right units instantly.</p>
        </div>
      </div>
    </div>
  );
}
