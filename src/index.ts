import express from 'express';
import stringsRouter from './routes/strings';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/strings', stringsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'String Analysis API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
