const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// In-memory storage (replace with database in production)
let users = [];
let projects = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User Management

// GET /users - Retrieve a list of users
app.get('/v1/users', authenticateToken, (req, res) => {
  res.json({
    users: users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }))
  });
});

// POST /users - Create a new user
app.post('/v1/users', authenticateToken, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const newUser = {
      id: uuidv4(),
      name,
      email,
      role: role || 'user',
      created_at: new Date().toISOString()
    };

    users.push(newUser);

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      created_at: newUser.created_at
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Project Management

// GET /projects - Get all projects
app.get('/v1/projects', authenticateToken, (req, res) => {
  res.json({
    projects: projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      status: project.status
    }))
  });
});

// POST /projects - Create a new project
app.post('/v1/projects', authenticateToken, (req, res) => {
  try {
    const { name, description, technologies } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const newProject = {
      id: uuidv4(),
      name,
      description: description || '',
      technologies: technologies || [],
      status: 'active',
      created_at: new Date().toISOString()
    };

    projects.push(newProject);

    res.status(201).json({
      id: newProject.id,
      name: newProject.name,
      description: newProject.description,
      technologies: newProject.technologies,
      status: newProject.status
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication endpoint (for demo purposes)
app.post('/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple demo auth - in production, verify against database
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo, accept any password. In production, hash and compare.
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Line Tech API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;