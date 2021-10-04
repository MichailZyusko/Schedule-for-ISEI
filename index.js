import express from 'express';
import router from './src/router/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const host = '0.0.0.0';

app.get('/', (req, res) => {
  console.log(`v1.0.7 Example app listening at http://${host}:${PORT}`);
  res.send({ message: `v1.0.7 Example app listening at http://${host}:${PORT}` });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/app', express.static('src/public'));
app.use('/api/', router);

app.listen(PORT, host, () => {
  console.log(`Example app listening at http://${host}:${PORT}`);
});
