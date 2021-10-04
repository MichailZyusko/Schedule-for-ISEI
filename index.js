import express from 'express';
import router from './src/router/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};
app.use(allowCrossDomain);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/', router);

app.listen(PORT, HOST, () => {
  console.log(`Example app listening at http://${HOST}:${PORT}`);
});
