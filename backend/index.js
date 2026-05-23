require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json({ limit: '50kb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/generate', require('./routes/generate'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Backend corriendo en puerto ${process.env.PORT || 3000}`)
);