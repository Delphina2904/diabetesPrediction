// server.js

// ─── 1) IMPORTS & DB CONNECTION ─────────────────────────────────────────
const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const { spawn } = require('child_process');

mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost:27017/diabetes',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));


// ─── 2) APP SETUP ───────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());


// ─── 3) USER MODEL ─────────────────────────────────────────────────────
const User = require('./models/User');  // Make sure models/User.js exports the schema


// ─── 4) SIGNUP ROUTE ───────────────────────────────────────────────────
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    // a) Check existing
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    // b) Hash & create
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash, name, email });
    return res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});


// ─── 5) LOGIN ROUTE ────────────────────────────────────────────────────
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // a) Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // b) Verify password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // c) Success → return dummy token
    return res.json({ token: 'dummy-token' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});


// ─── 6) BLOOD-REPORT PREDICTION ─────────────────────────────────────────
app.post('/api/predict', (req, res) => {
  const data = req.body;
  // Validate required fields
  const required = [
    'pregnancies','bloodPressure','insulinLevel',
    'diabetesPedigree','glucoseLevel','skinThickness',
    'bmi','age'
  ];
  if (!required.every(f => data[f] !== undefined && !isNaN(parseFloat(data[f])))) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const py = spawn('python', [
    'predict_diabetes.py',
    data.pregnancies,
    data.bloodPressure,
    data.insulinLevel,
    data.diabetesPedigree,
    data.glucoseLevel,
    data.skinThickness,
    data.bmi,
    data.age
  ]);

  let out = '', errData = '';
  py.stdout.on ('data', chunk => out += chunk.toString());
  py.stderr.on ('data', chunk => errData += chunk.toString());

  py.on('close', code => {
    if (code !== 0) {
      console.error('predict_diabetes.py error:', errData);
      return res.status(500).json({ error: 'Prediction failed', details: errData });
    }
    try {
      const result = JSON.parse(out);
      return res.json({ prediction: Number(result.prediction) });
    } catch (e) {
      console.error('Parse error:', e, out);
      return res.status(500).json({ error: 'Invalid response', details: out });
    }
  });

  py.on('error', e => {
    console.error('Spawn error:', e);
    return res.status(500).json({ error: 'Server error', details: e.message });
  });
});


// ─── 7) NO-BLOOD-REPORT PREDICTION ──────────────────────────────────────
app.post('/api/predict_no_blood', (req, res) => {
  const d = req.body;
  const fields = [
    'gender','age','heart_disease','smoking_habit',
    'hba1c_level','glucose_level','bmi','heart_rate'
  ];
  if (!fields.every(f => d[f] !== undefined && !isNaN(parseFloat(d[f])))) {
    return res.status(400).json({ error: 'Missing or invalid input' });
  }

  const py = spawn('python', [
    'no_blood_cmd.py',
    d.gender,
    d.age,
    d.heart_disease,
    d.smoking_habit,
    d.hba1c_level,
    d.glucose_level,
    d.bmi,
    d.heart_rate
  ]);

  let out = '', errData = '';
  py.stdout.on ('data', chunk => out += chunk.toString());
  py.stderr.on ('data', chunk => errData += chunk.toString());

  py.on('close', code => {
    if (code !== 0) {
      console.error('no_blood_cmd.py error:', errData);
      return res.status(500).json({ error: 'Prediction failed', details: errData });
    }
    try {
      const result = JSON.parse(out);
      return res.json({ prediction: Number(result.prediction) });
    } catch (e) {
      console.error('Parse error:', e, out);
      return res.status(500).json({ error: 'Invalid response', details: out });
    }
  });

  py.on('error', e => {
    console.error('Spawn error:', e);
    return res.status(500).json({ error: 'Server error', details: e.message });
  });
});


// ─── 8) START SERVER ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
// ─── GET PROFILE ────────────────────────────────────────────────────────
app.get('/api/profile', async (req, res) => {
    try {
      // grab the first (or only) user in the DB
      const user = await User.findOne().lean();
      if (!user) {
        return res.status(404).json({ message: 'No user found' });
      }
      return res.json({
        name:           user.name,
        email:          user.email || '',
        age:            user.age   || '',
        phone:          user.phone || '',
        address:        user.address || '',
        medicalHistory: user.medicalHistory || ''
      });
    } catch (err) {
      console.error('Profile error:', err);
      return res.status(500).json({ message: 'Server error fetching profile' });
    }
  });
  
  // ─── GET HEALTH REPORT ─────────────────────────────────────────────────
  app.get('/api/health-report', (req, res) => {
    // static example; swap in real data if you store it later
    res.json({
      glucoseLevel:   135,
      bloodPressure:  '120/80',
      cholesterol:    190,
      weight:         75,
      overall:        'Good',
      riskLevel:      'Low'
    });
  });
  
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
