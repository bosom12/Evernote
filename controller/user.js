import db from '../model';
import { Form } from 'form-my-simple-validation';
import formSchema from '../validator/schema';
import { uuid } from 'uuidv4';
import { send } from '../utils/mail';
import * as Utils from '../utils/helpers';

/**
 * @desc CLASS USER
 */
class User {
  /**
   * @desc CREATING USER ACCOUNT
   * @param {*} req
   * @param {*} res
   *  @return {obj} json
   */
  static async createUserAccount(req, res) {
    try {
      const { username, email, password } = req.body;

      /**
       * @desc VALIDATE ACCOUNT
       * @return {validatorResult} JSON
       */

      const validationResult = Form.validateFields(
        'signUp',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const foundUser = await db.user.findOne({ email });

      if (foundUser) {
        return res.status(401).json({ message: 'user already exist' });
      }

      const user = await db.user.create({
        username,
        email,
        password,
      });
      const verifyToken = uuid();
      const verifyExpire = Date.now() + 3600000;
      user.verifyToken = verifyToken;
      user.verifyExpire = verifyExpire;
      await user.save();

      const URL = origin
        ? `${origin}/verify?verify_Token=${user.verifyToken}`
        : `${host}/api/user/verify?verify_Token=${user.verifyToken}`;
      await send({
        email,
        subject: 'verify account',
        html: `<div>
        <p style="text-transform: capitalize;">Hi ${username},</p>
        <p>you are one click away to complete our registration.</p>
        <p>kindly click the link below to verify you account${URL}</p>
        </div>`,
      });

      return res
        .status(201)
        .json({
          message:
            'A link has been sent to your email address to verify your account',
          user,
        });
    } catch (err) {
      res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc FORGET PASSWORD
   * @param {*} req
   * @param {*} res
   * @return {*}JSON
   */
  static async forgetPassword(req, res) {
    try {
      const validationResult = Form.validateFields(
        'forgetPassword',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const foundUser = await db.user.findOne({ email: req.body.email });
      if (!foundUser) {
        return res.status(401).json({ message: 'email not found' });
      }

      const { email } = req.body;

      const host = req.get('Host');

      const origin = req.get('Origin');

      foundUser.resetPasswordToken = uuid();
      foundUser.resetPasswordExpire = Date.now() + 3600000;

      await foundUser.save();
      const resetURL = origin
        ? `${origin}/new-password?Reset_Token=${foundUser.resetPasswordToken}`
        : `${host}/api/user/reset-password?Reset_Token=${foundUser.resetPasswordToken}`;

      await send({
        email,
        subject: 'Reset Password',
        html: `<div>
          <p style="text-transform: capitalize;">Hi,</p>
          <p>You recently requested to reset your password. If this wasn't you, please ignore this mail.</p>
          <p>To reset your password</p>
          <p>
          Click or copy password link to a new tab: <a href='${resetURL}'>
          ${resetURL}</a>
          </p>
          <p>Have a great day.</p>
          </div>`,
      });

      return res
        .status(200)
        .json({ message: 'reset password link has been sent to your email' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
  /**
   * @desc RESET PASSWORD
   * @param {*} req
   * @param {*} res
   * @return {obj}JSON
   */
  static async resetPassword(req, res) {
    try {
      const validationResult = Form.validateFields(
        'resetPassword',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const user = await db.user.findOne({
        resetPasswordToken: req.query.Reset_Token,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: 'reset password token is invalid' });
      }
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.password = req.body.password;

      await user.save();

      return res
        .status(200)
        .json({ message: 'password reset successfully, proceed to login' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc VERIFICATION
   * @param {*} req
   * @param {*} res
   * @return {obj}JSON
   */
  static async verifyUser(req, res) {
    try {
      const user = await db.user.findOne({
        verifyToken: req.query.verify_Token,
        verifyExpire: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(401).json({ message: 'verify Token is invalid' });
      }
      user.verifyToken = undefined;
      user.verifyExpire = undefined;
      user.isVerified = true;

      await user.save();

      return res.status(200).json({ message: 'Account verify successfully' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc RESEND VERIFICATION
   * @param {*} req 
   * @param {*} res 
   * @return {obj}JSON
   */
  static async resendVerifyUser(req, res) {
    try {
      const {email} = req.body;
      const user = await db.user.findOne({ email })
     
      if (!user) {
        return res.status(401).json({ message: 'email not found' });
      }
      const host = req.get('Host');

      const origin = req.get('Origin');

      const verifyToken = uuid();
      const verifyExpire = Date.now() + 3600000;

      const URL = origin
      ? `${origin}/verify?verify_Token=${verifyToken}`
      : `${host}/api/user/verify?verify_Token=${verifyToken}`;
    await send({
      email,
      subject: 'verify account',
      html: `<div>
      <p style="text-transform: capitalize;">Hi ${user.username},</p>
      <p>you are one click away to complete your registration.</p>
      <p>kindly click the link below to verify you account ${URL}</p>
      </div>`,
    });
    user.verifyToken = verifyToken;
    user.verifyExpire = verifyExpire;

      await user.save();

      return res.status(200).json({ message: 'verification mail has been sent to your email' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc LOGIN USER
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      /**
       * @desc VALIDATE ACCOUNT
       * @return {validatorResult} JSON
       */
      const validationResult = Form.validateFields(
        'login',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const findUser = await db.user.findOne({ email });

      if (!findUser) {
        return res.status(401).json({ message: 'email not found' });
      }
      const passwordMatch = await findUser.comparePassword(password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'password incorrect' });
      }
      /**
       * @desc GENERATE TOKEN FOR AUTHORIZATION
       * @returns {String} void
       */
      const token = Utils.generateToken({ id: findUser._id });

      return res.status(200).json({
        message: 'Account is successfully logged in',
        findUser,
        token,
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc DELETE USER ACCOUNT
   * @param {*} req
   * @param {*} res
   * @return {obj} JSON
   */
  static async deleteUser(req, res) {
    try {
      const { _id: userId } = req.user;

      const user = await db.user.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ message: 'user not found' });
      }
      //PERFORM DELETION
      await db.user.findByIdAndRemove(userId);

      return res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
}

export default User;
