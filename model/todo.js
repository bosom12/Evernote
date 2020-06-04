import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      trim: true,
      required: 'title is required',
    },
    description: {
      type: String,
      trim: true,
      required: 'description is required',
    },
    dueDate: {
      type: String,
      trim: true,
      required: 'date is required',
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    isFinished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const todoUser = mongoose.model('Todo', TodoSchema);

export default todoUser;
