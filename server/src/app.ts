import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';

import db from './db.js';

dotenv.config();
const app = express();

app.use(express.json());
const port = process.env.PORT || 5000;

app.get('/test', async (req, res) => {
  const result = await db.query('SELECT * FROM todo WHERE id = $1', [3]);
  console.log(result);
  res.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
