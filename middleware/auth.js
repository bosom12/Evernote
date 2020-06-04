import { config } from 'dotenv';
import * as JWT from 'jsonwebtoken';
import db from '../model';

config();

const secret = process.env.SECRET;

export const verifyToken = (req, res, next) => {
  try {
    const tokenBearer = req.headers.authorization;
    if (!tokenBearer)
      return res
        .status(403)
        .json({ status: 403, message: 'Client key required' });

    const token = tokenBearer.split(' ')[1];

    JWT.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ status: 403, message: 'Invalid key' });
      }
      const user = await db.user.findOne({ _id: decoded.id });

      if (!user) {
        return res.status(403).json({ status: 404, message: 'User not exist' });
      }
      if (!user.isVerified) {
        return res.status(403).json({ status: 404, message: 'please verify account to proceed' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Server error', error });
  }
};
