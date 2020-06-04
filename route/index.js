import express from 'express';
import Todo from './todo';
import user from './user';

const router = express.Router();

router.use('/user', user);

router.use('/todo', Todo);

export default router;
