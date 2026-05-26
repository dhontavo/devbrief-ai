const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const { generateDoc } = require('../services/openai');
const router = express.Router();
const FREE_LIMIT = parseInt(process.env.FREE_LIMIT) || 10;

router.post('/', authMiddleware, async (req, res) => {
  const { code, docType, language } = req.body;
  if (!code || !docType)
    return res.status(400).json({ error: 'Codigo y tipo de documentacion requeridos' });

  // Verificar limite gratuito
  const count = db.prepare('SELECT COUNT(*) as total FROM generations WHERE user_id = ?')
    .get(req.user?.id).total;
  if (count >= FREE_LIMIT)
    return res.status(403).json({ error: 'Limite del plan gratuito alcanzado', limit: FREE_LIMIT });

  try {
    const result = await generateDoc(code, docType, language || 'javascript');
    db.prepare('INSERT INTO generations (user_id, code_input, doc_type, result, language) VALUES (?,?,?,?,?)')
      .run(req.user.id, code, docType, result, language);

    const remaining = FREE_LIMIT - (count + 1);
    res.json({ result, remaining, total: count + 1 });
  } catch (e) {
    res.status(500).json({ error: 'Error al generar documentacion', detail: e.message });
  }
});

router.get('/history', authMiddleware, (req, res) => {
  const history = db.prepare(
    'SELECT id, doc_type, language, result, created_at FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).all(req.user?.id);

  if (history.length === 0) {
    return res.status(200).json({ message: 'No hay historial disponible.' });
  }

  res.json(history);
});


module.exports = router;