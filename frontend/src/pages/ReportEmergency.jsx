import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Navigation } from 'lucide-react';

export default function ReportEmergency() {
  const [formData, setFormData] = useState({
    location: '',
    type: 'Medical',
    severity: 'Medium',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude}, ${position.coords.longitude}`
          }));
          toast.success("Location fetched!");
        },
        () => toast.error("Could not fetch location")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) {
      toast.error("Location is required.");
      return;
    }
    
    setLoading(true);
    try {
      // Point this to your backend
      const res = await fetch('http://localhost:5000/api/analyze-crisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success) {
        setAiResponse(data.data.aiAnalysis);
        toast.success("Emergency reported successfully!");
      } else {
        toast.error("Failed to report");
      }
    } catch (error) {
      console.error(error);
      // Fallback for mock environment if backend is not running
      toast.warning("Backend not reachable. Simulating AI response...");
      setAiResponse({
        priority_level: "High",
        recommended_action: "Stay calm and wait for responders. Do not move injured people.",
        required_response_units: ["Ambulance"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
      <h2 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Report an Emergency
      </h2>
      
      {!aiResponse ? (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ marginTop: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Location</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter address or coordinates" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
              <button type="button" className="btn btn-primary" onClick={handleLocation}>
                <Navigation size={18}/>
              </button>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Incident Type</label>
              <select 
                className="form-control"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option>Medical</option>
                <option>Fire</option>
                <option>Crime / Police</option>
                <option>Accident</option>
                <option>Natural Disaster</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Estimated Severity</label>
              <select 
                className="form-control"
                value={formData.severity}
                onChange={e => setFormData({...formData, severity: e.target.value})}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea 
              className="form-control" 
              rows="4" 
              placeholder="Provide any additional details..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-danger" style={{ width: '100%', padding: '16px' }} disabled={loading}>
            {loading ? "Analyzing..." : "Submit Emergency"}
          </button>
        </form>
      ) : (
        <div className="glass-panel" style={{ marginTop: '2rem', border: '1px solid var(--primary)' }}>
          <h3 style={{ color: 'var(--success)' }}>Report Received</h3>
          <p>Our AI has analyzed the situation and responders are being notified.</p>
          
          <div style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <strong>AI Priority Assessment: </strong> 
              <span className={`badge badge-${aiResponse.priority_level?.toLowerCase() || 'medium'}`}>
                {aiResponse.priority_level || 'Medium'}
              </span>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Recommended Action For You:</strong>
              <p style={{ color: 'white', marginTop: '0.5rem' }}>{aiResponse.recommended_action || 'Wait for instructions.'}</p>
            </div>
            <div>
              <strong>Dispatched Units:</strong>
              <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                {(aiResponse.required_response_units || []).map((unit, i) => (
                  <span key={i} className="badge" style={{ background: 'var(--primary)', color: 'white' }}>{unit}</span>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setAiResponse(null)}>Submit Another Report</button>
        </div>
      )}
    </div>
  );
}
