import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: 'username is required',
    },

    email: {
      type: String,
      trim: true,
      required: 'email is required',
    },

    password: {
      type: String,
      trim: true,
      required: 'password is required',
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
    verifyToken: String,
    verifyExpire: String,
    isVerified: {
      type:  Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

/* eslint-disable */
UserSchema.methods.comparePassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

const user = mongoose.model('User', UserSchema);

export default user;
