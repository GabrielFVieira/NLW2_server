import express from 'express';

import authMiddleware from './app/middlewares/authMiddleware';

import ClassesController from './app/controllers/ClassesController';
import SubjectController from './app/controllers/SubjectController';
import ConnectionsController from './app/controllers/ConnectionsController';
import UserController from './app/controllers/UserController';
import AuthController from './app/controllers/AuthController';

const routes = express.Router();

routes.get('/user-classes', authMiddleware, ClassesController.find);
routes.get('/classes', ClassesController.index);
routes.post('/classes', authMiddleware, ClassesController.create);

routes.get('/subjects', SubjectController.index);
routes.post('/subjects', SubjectController.create);

routes.get('/connections', authMiddleware, ConnectionsController.index);
routes.post('/connections', authMiddleware, ConnectionsController.create);

routes.get('/user', authMiddleware, UserController.index);
routes.post('/user', UserController.create);

routes.post('/auth', AuthController.authenticate);

export default routes;