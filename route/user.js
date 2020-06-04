import { Router } from 'express';
import { verifyToken } from '../middleware/auth';

import userController from '../controller/user';

const router = Router();

router.post('/create', userController.createUserAccount);

router.post('/forget', userController.forgetPassword);

router.put('/reset-password', userController.resetPassword);

router.post('/login', userController.loginUser);

router.patch('/verify', userController.verifyUser);

router.post('/verify/resend', userController.resendVerifyUser);

router.delete('/', verifyToken, userController.deleteUser);

export default router;
