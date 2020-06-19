import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {
  res.send('Hi');
});

app.listen(3000);
