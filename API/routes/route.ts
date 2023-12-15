import { Router } from 'express';
import technologyRouter from './technology.route';
import userRouter from './user.route'
import projectRouter from './project.route';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/technologies', technologyRouter);
routes.use('/projects', projectRouter);

export default routes;