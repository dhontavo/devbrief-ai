const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post('/register', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email and password are required.',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Password must be at least 8 characters long.',
    });
  }

  // Check if user already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'An account with this email already exists.',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const { lastInsertRowid } = db.prepare(
      'INSERT INTO users (email, password) VALUES (?, ?)'
    ).run(email.toLowerCase(), hashedPassword);

    const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(lastInsertRowid);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Registration failed.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email and password are required.',
    });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const { password: _, ...safeUser } = user;
  return res.json({ token, user: safeUser });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

const auth = require('../middleware/auth');

router.get('/me', auth, (req, res) => {
  const user = db
    .prepare('SELECT id, email, created_at FROM users WHERE id = ?')
    .get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: 'User not found.' });
  }

  return res.json({ user });
});

module.exports = router;
