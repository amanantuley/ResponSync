const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { analyzeCrisis } = require('./gemini');
const { db } = require('./firebase');

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  res.send('ResponSync API is running');
});

// Endpoint for analyzing a crisis report
app.post('/api/analyze-crisis', async (req, res) => {
  const { location, type, severity, description, userId } = req.body;

  if (!location || !type) {
    return res.status(400).json({ error: 'Location and type are required' });
  }

  try {
    // Call Gemini AI for analysis
    const aiAnalysis = await analyzeCrisis(location, type, severity, description);

    // If Firebase DB is connected, save the incident
    let incidentData = {
      location,
      type,
      severity: aiAnalysis.priority_level || severity,
      description,
      aiAnalysis,
      status: 'Active',
      reportedAt: new Date().toISOString(),
      userId: userId || 'anonymous'
    };

    if (db) {
      const docRef = await db.collection('incidents').add(incidentData);
      incidentData.id = docRef.id;
    } else {
      console.warn("Database not initialized, returning without saving.");
      incidentData.id = "mock_id_" + Date.now();
    }

    res.json({ success: true, data: incidentData });
  } catch (error) {
    console.error("Error analyzing crisis:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch active incidents
app.get('/api/incidents', async (req, res) => {
    try {
        if (!db) {
            return res.json({ success: true, data: [] });
        }
        const snapshot = await db.collection('incidents').orderBy('reportedAt', 'desc').get();
        const incidents = [];
        snapshot.forEach(doc => {
            incidents.push({ id: doc.id, ...doc.data() });
        });
        res.json({ success: true, data: incidents });
    } catch(error) {
        console.error("Error fetching incidents:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
