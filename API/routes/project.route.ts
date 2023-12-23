import { Router } from 'express';
import projectController from '../controllers/project.controller';
import isAuth from '../middleware/auth';
import isAdmin from '../middleware/admin';

const projectRouter = Router();

projectRouter.get('/', projectController.getAllProjects);
projectRouter.get('/:id', projectController.getProjectById);
projectRouter.post('/', isAuth, isAdmin, projectController.addNewProject);
projectRouter.put('/:id', isAuth, isAdmin, projectController.updateProject);
projectRouter.delete('/:id', isAuth, isAdmin, projectController.deleteProjectById);

export default projectRouter;