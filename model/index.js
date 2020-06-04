import mongoose from 'mongoose';
import { config } from 'dotenv';
import user from './user';
import Todo from './todo';

config();

const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose
  .connect(process.env.MONGODB_URL, option)
  .then(() => console.log('connected'))
  .catch((err) => console.log(err.message));

export default { user, Todo };
