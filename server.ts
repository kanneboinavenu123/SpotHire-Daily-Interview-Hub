import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API Endpoints
// Recruiter Authentication Routes
app.post('/api/auth/recruiter-login', (req, res) => {
  try {
    const { email, password } = req.body;
    const session = db.loginRecruiter(email, password);
    res.json(session);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/auth/recruiter-register', (req, res) => {
  try {
    const session = db.registerRecruiter(req.body);
    res.status(201).json(session);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/drives', (_req, res) => {
  try {
    const drives = db.getDrives();
    res.json(drives);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/drives', (req, res) => {
  try {
    const newDrive = db.createDrive(req.body);
    res.status(201).json(newDrive);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/passes', (_req, res) => {
  try {
    const passes = db.getPasses();
    res.json(passes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/passes', (req, res) => {
  try {
    const newPass = db.createPass(req.body);
    res.status(201).json(newPass);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/passes/:id/stage', (req, res) => {
  try {
    const { stage_index, recruiter_note } = req.body;
    const updated = db.updatePassStage(req.params.id, stage_index, recruiter_note);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/api/passes/:id/checkin', (req, res) => {
  try {
    const verified = db.checkInPass(req.params.id);
    res.json(verified);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Fix #1.3: Cancel pass and release slot back to drive pool
app.post('/api/passes/:id/cancel', (req, res) => {
  try {
    const result = db.cancelPass(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Fix #2.1: Gate reception token validator for HR / gate security
app.post('/api/passes/verify-gate-token', (req, res) => {
  try {
    const { token, gate_note } = req.body;
    const verified = db.verifyGateToken(token, gate_note);
    res.json(verified);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/referrals', (_req, res) => {
  try {
    const data = db.getReferralData();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/referrals/share', (_req, res) => {
  try {
    const updated = db.recordReferralShare();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// MySQL Database Studio & Schema Inspect APIs
app.get('/api/sql/schema', (_req, res) => {
  try {
    const schemaSql = db.getRawSchemaSql();
    res.json({
      database: 'spothire_db',
      schemaSql,
      tables: ['drives', 'interview_passes', 'referrals'],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sql/query', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'SQL query string is required' });
    }
    const result = db.executeSql(query);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Full-stack Vite development integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SpotHire server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
