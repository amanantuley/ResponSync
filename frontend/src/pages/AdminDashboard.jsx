import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import MapComponent from '../components/MapComponent';
import { Activity, Clock, Users, AlertOctagon } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to connect to Firestore
    if (!db) {
      toast.error("Firebase not configured. Loading mock data.");
      setIncidents([
        { id: '1', location: '37.7749, -122.4194', type: 'Medical', severity: 'High', status: 'Active', description: 'Car crash', reportedAt: new Date().toISOString() },
        { id: '2', location: '37.7849, -122.4094', type: 'Fire', severity: 'Critical', status: 'Active', description: 'Building fire', reportedAt: new Date(Date.now() - 3600000).toISOString() }
      ]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'incidents'), orderBy('reportedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setIncidents(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      toast.error("Failed to fetch live incidents.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeCount = incidents.filter(i => i.status === 'Active').length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical' && i.status === 'Active').length;

  return (
    <div className="container animate-fade-in">
      <h2>Admin Command Center</h2>
      
      {/* Top Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Activity size={32} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Active Incidents</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeCount}</div>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertOctagon size={32} color="var(--danger)" />
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Critical Priority</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{criticalCount}</div>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Clock size={32} color="var(--success)" />
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Avg Response Time</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>4.2 min</div>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Users size={32} color="var(--warning)" />
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Units Deployed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Incident List */}
        <div className="glass-panel" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <h3>Live Incident Feed</h3>
          {loading ? <p>Loading...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {incidents.map(inc => (
                <div key={inc.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${inc.severity === 'Critical' ? 'var(--danger)' : 'var(--warning)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>{inc.type}</span>
                    <span className={`badge badge-${inc.severity?.toLowerCase() || 'medium'}`}>{inc.severity}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>📍 {inc.location}</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '8px' }}>{inc.description || 'No description provided.'}</div>
                  
                  {inc.aiAnalysis && (
                    <div style={{ marginTop: '12px', fontSize: '0.875rem', color: 'var(--primary)' }}>
                      <strong>AI Rec:</strong> {inc.aiAnalysis.required_response_units?.join(', ')}
                    </div>
                  )}
                  
                  <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Reported: {new Date(inc.reportedAt).toLocaleString()}
                  </div>
                </div>
              ))}
              {incidents.length === 0 && <p>No active incidents.</p>}
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="glass-panel">
          <h3>Incident Map</h3>
          <MapComponent incidents={incidents.filter(i => i.status === 'Active')} />
        </div>
      </div>
    </div>
  );
}
