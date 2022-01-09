import express from 'express';
import serverless from 'serverless-http';
import router from './src/router/index.js';
import errorHandler from './src/errors/errorHandler.js';

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

app.use('/api/v1', router);
app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Example app listening at http://${HOST}:${PORT}`);
});

export const handler = serverless(app);
