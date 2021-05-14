import dotenv from 'dotenv';

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';

import './database/connection';
import routes from './routes';

dotenv.config();

const app = express();

app.use(cors({ origin: 'https://nlw2-proffy-web-gvieira.herokuapp.com' }));
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, 'uploads')));
app.use(routes);

app.listen(process.env.PORT || 3333, () => console.log('Server started'));
