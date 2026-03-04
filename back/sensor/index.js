import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Info endpoint
app.get('/info', (req, res) => {
  res.json({ status: 'ok', service: 'sensor' });
});

app.listen(PORT, () => {
  console.log(`Sensor server running on port ${PORT}`);
});
