import express from 'express';
import router from './src/router/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
  console.log(`v1.0.8 Example app listening at http://${HOST}:${PORT}`);
  res.send({ message: `v1.0.8 Example app listening at http://${HOST}:${PORT}` });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/', router);

app.listen(PORT, HOST, () => {
  console.log(`Example app listening at http://${HOST}:${PORT}`);
});
