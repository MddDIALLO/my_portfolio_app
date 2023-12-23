import { Router } from 'express';
import userController from '../controllers/user.controller';
import isAuth from '../middleware/auth';
import isAdmin from '../middleware/admin';

const userRouter = Router();

userRouter.post('/login', userController.login);
userRouter.post('/logout', isAuth, userController.logout);
// userRouter.post('/token', userController.validateToken);
userRouter.get('/', isAuth, isAdmin, userController.getAll);
userRouter.get('/:id', isAuth, userController.getUserById);
userRouter.post('/', userController.addNewUser);
userRouter.put('/:id', isAuth, userController.updateExistingUser);
userRouter.delete('/:id', isAuth, userController.deleteUserById);

export default userRouter;