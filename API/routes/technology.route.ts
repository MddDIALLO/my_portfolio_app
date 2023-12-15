import { Router } from 'express';
import technologyController from '../controllers/technology.controller';
import isAuth from '../middleware/auth';
import isAdmin from '../middleware/admin';

const technologyRouter = Router();

technologyRouter.get('/', technologyController.getAll);
technologyRouter.get('/:id', technologyController.getTechnologyById);
technologyRouter.post('/', isAuth, isAdmin, technologyController.addNewTechnology);
technologyRouter.put('/:id', isAuth, isAdmin, technologyController.updateTechnology);
technologyRouter.delete('/:id', isAuth, isAdmin, technologyController.deleteTechnology);

export default technologyRouter;