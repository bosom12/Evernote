import db from '../model';
import { Form } from 'form-my-simple-validation';
import formSchema from '../validator/schema';

/**
 *@desc CLASS USER
 */
class Todo {
  /**
   * @desc CREATE TODO LIST
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async createTodo(req, res) {
    try {
      const { title, description, dueDate } = req.body;
      /**
       * @desc VALIDATOR
       * @return {validatorResult} JSON
       */
      const validationResult = Form.validateFields(
        'createTodo',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const findTodo = await db.Todo.findOne({ title });
      if (findTodo) {
        return res.status(401).json({ message: 'title already exist' });
      }
      //CREATING TODO
      const data = await db.Todo.create({
        userId: req.user._id,
        title,
        description,
        dueDate,
      });
      return res
        .status(200)
        .json({ message: 'Todo created successfully', data });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc RETRIEVE ALL TODO
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async getAllTodo(req, res) {
    try {
      const allTodo = await db.Todo.find({
        userId: req.user._id,
        isTrashed: false,
      }).sort({ createdAt: 'desc' });
      return res.status(200).json({
        message: 'Todo list all retrieved',
        allTodo,
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc RETRIEVE ONE TODO
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async getOneTodo(req, res) {
    try {
      const { todoId } = req.params;
      const { _id: userId } = req.user;
      // const userId = req.user._id

      const todo = await db.Todo.findOne({ _id: todoId });

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      if (!todo.userId.equals(userId)) {
        return res
          .status(404)
          .json({ message: 'Todo does not belong to you!' });
      }

      return res.status(200).json({
        success: true,
        message: 'One Todo retrieved',
        todo,
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc DELETE TODO
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async deleteTodo(req, res) {
    try {
      const { todoId } = req.params;
      const { _id: userId } = req.user;

      const todo = await db.Todo.findOne({ _id: todoId });

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      if (!todo.userId.equals(userId)) {
        return res.status(404).json({ message: 'Todo does not belong to you' });
      }
      //PERFORMING TODO DELETION
      await db.Todo.findOneAndRemove({ userId, _id: todoId });

      return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc UPDATE TODO
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async updateTodo(req, res) {
    try {
      const { todoId } = req.params;
      const { _id: userId } = req.user;
      const { title, description, dueDate } = req.body;

      const todo = await db.Todo.findOne({ userId, _id: todoId });

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      if (!todo.userId.equals(userId)) {
        return res.status(404).json({ message: 'Todo does not belong to you' });
      }

      todo.title = title || todo.title;
      todo.description = description || todo.description;
      todo.dueDate = dueDate || todo.dueDate;

      await todo.save();

      return res.status(200).json({ message: 'Todo is updated successfully ' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc TRASH TODO
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async trashedTodo(req, res) {
    try {
      const { todoId } = req.params;
      const { _id: userId } = req.user;

      const todo = await db.Todo.findOne({ userId, _id: todoId });

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      if (!todo.userId.equals(userId)) {
        return res
          .status(404)
          .json({ message: 'Todo does not belongs to you' });
      }

      todo.isTrashed = true;
      todo.save();

      return res.status(200).json({ message: 'Todo is successfully trashed' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc UN-TRASH TODO
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async unTrashedTodo(req, res) {
    try {
      const { todoId } = req.params;
      const { _id: userId } = req.user;

      const todo = await db.Todo.findOne({ userId, _id: todoId });

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      if (!todo.userId.equals(userId)) {
        return res
          .status(404)
          .json({ message: 'Todo does not belongs to you' });
      }

      todo.isTrashed = false;
      todo.save();

      return res.status(200).json({ message: 'Todo is successfully restored' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
  /**
   * @desc GET ALL TRASHED
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async getAllTrashed(req, res) {
    try {
      const allTodo = await db.Todo.find({
        userId: req.user._id,
        isTrashed: true,
      });
      return res.status(200).json({
        message: 'Todo list all retrieved',
        allTodo,
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc FINISHED API
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async finishedTodo(req, res) {
    try {
      const { todoId } = req.params;
      const { _id: userId } = req.user;

      const todo = await db.Todo.findOne({ userId, _id: todoId });
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      if (!todo.userId.equals(userId)) {
        return res
          .status(404)
          .json({ message: 'Todo does not belongs to you' });
      }

      todo.isFinished = true;
      todo.save();

      return res.status(200).json({ message: 'Done!' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
}

export default Todo;
