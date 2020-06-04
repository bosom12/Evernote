import express from 'express';
import Todo from '../controller/todo';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

//Application routes
router.post('/create', verifyToken, Todo.createTodo);

router.get('/', verifyToken, Todo.getAllTodo);

router.get('/:todoId', verifyToken, Todo.getOneTodo);

router.get('/trash', verifyToken, Todo.getAllTrashed);

router.patch('/:todoId/finish', verifyToken, Todo.finishedTodo);

router.put('/:todoId', verifyToken, Todo.updateTodo);

router.delete('/:todoId/trash', verifyToken, Todo.trashedTodo);

router.put('/:todoId/unTrash', verifyToken, Todo.unTrashedTodo);

router.delete('/:todoId', verifyToken, Todo.deleteTodo);

export default router;
