const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

// Passport configuration (for backward compatibility with passport-local-mongoose)
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');

const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

// Enable CORS for frontend clients
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Support (backward-compatible)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'SwasthyaSankalpSessionSecret2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: false
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Safety middleware: ensure session methods exist to guard against passport 0.6+ crashes
app.use((req, res, next) => {
  if (req.session) {
    if (typeof req.session.regenerate !== 'function') {
      req.session.regenerate = (cb) => { if (cb) cb(); };
    }
    if (typeof req.session.save !== 'function') {
      req.session.save = (cb) => { if (cb) cb(); };
    }
  }
  next();
});

// REST API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/superadmin', superAdminRoutes);

// Backward-compatible alias for /api/policies
app.use('/api/policies', (req, res, next) => {
  req.url = `/policies${req.url === '/' ? '' : req.url}`;
  return superAdminRoutes(req, res, next);
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'SwasthyaSankalp Healthcare Management REST API',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'SwasthyaSankalp Healthcare Backend REST API is running.'
  });
});

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
