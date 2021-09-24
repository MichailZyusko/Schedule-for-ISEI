import express from 'express';
import router from './src/router/index.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/app', express.static('src/public'));
app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/app`);
});
