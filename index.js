import express from 'express';
import router from './src/router/index.js';

const app = express();
const port = process.env.PORT || 3000;
const host = 'localhost';

app.get('/', (req, res) => {
  console.log(`v1.0.3 Example app listening at http://${host}:${port}/app`);
  res.send({ message: `v1.0.3 Example app listening at http://${host}:${port}/app` });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/app', express.static('src/public'));
app.use('/', router);

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}/app`);
});
