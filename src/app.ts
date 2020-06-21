import express from 'express';
import mongoose from 'mongoose';

import policyRoutes from './routes/policy';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/policy', policyRoutes);

app.use(errorHandler);

mongoose
  .connect('mongodb://mongo:27017/insurance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
