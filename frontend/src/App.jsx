import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import ReportEmergency from './pages/ReportEmergency';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav style={{ padding: '1rem 2rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>ResponSync AI</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/report" style={{ color: 'white', textDecoration: 'none' }}>Report Crisis</Link>
            <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin Dashboard</Link>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportEmergency />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        <ToastContainer theme="dark" position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
