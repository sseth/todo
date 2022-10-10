import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
// import cors, { CorsOptions } from 'cors';

import { errorHandler } from './middleware/index.js';
import { userRouter, todoRouter } from './routes/index.js';

dotenv.config();
const app = express();

app.use(express.json());
const port = process.env.PORT || 5000;

app.get('/test', async (req, res) => {
  res.json({ response: 'test' });
});

app.use('/api/user', userRouter);
app.use('/api/todos', todoRouter);

app.use(errorHandler);

// eslint-disable-next-line
app.listen(port, () => console.log(`Listening on port ${port}`));
