import express from 'express';
import cors from 'cors';
import weatherRouter from './routes/weather';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/status', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/weather', weatherRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
