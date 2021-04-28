import express from 'express';

import authMiddleware from './app/middlewares/authMiddleware';

import ClassesController from './app/controllers/ClassesController';
import SubjectController from './app/controllers/SubjectController';
import ScheduleController from './app/controllers/ScheduleController';
import ConnectionsController from './app/controllers/ConnectionsController';
import UserController from './app/controllers/UserController';
import AuthController from './app/controllers/AuthController';
import recoveryMiddleware from './app/middlewares/recoveryMiddleware';

const routes = express.Router();

routes.get('/user-classes', authMiddleware, ClassesController.find);
routes.get('/classes', ClassesController.index);
routes.post('/classes', authMiddleware, ClassesController.create);
routes.delete('/classes', authMiddleware, ClassesController.delete);

routes.get('/subjects', SubjectController.index);
routes.post('/subjects', SubjectController.create);

routes.delete('/schedules', authMiddleware, ScheduleController.delete);

routes.get('/connections', ConnectionsController.index);
routes.post('/connections', authMiddleware, ConnectionsController.create);

routes.get('/user', authMiddleware, UserController.index);
routes.post('/user', UserController.create);
routes.put('/user', authMiddleware, UserController.update);
routes.post('/user/changePassword', authMiddleware, UserController.changePassword);

routes.post('/auth', AuthController.authenticate);
routes.post('/recovery', AuthController.recovery);
routes.post('/resetPassword', recoveryMiddleware, UserController.resetPassword);

export default routes;
