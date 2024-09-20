// authService.js
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import createError from "http-errors";
import { authSchema, loginSchema } from "../utils/validation_schema.js";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

class AuthService {
  static async register(req) {
    // Simulate registration logic
    // Save user to database (or any other storage)
    try {
      //const { firstName, lastName, email, phone, password, gender, role } = req.body;

      const { firstName, lastName, email, phone, password, gender, role } =
        await authSchema.validateAsync(req.body);
      // const file = req.file;
      // const fileUri = getDataUri(file);
      // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

      const user = await User.findOne({ email });

      console.log(user);
      if (user) {
        //throw createError(401, "User already exist with this email"); //or
        throw createError.Conflict(
          `User already exist with this email: ${email}`
        );
      }
      // this code is now in userModel.js, work as mongoose middleware to tackle before the saving
      //const hashedPassword = await bcrypt.hash(password, 10); this
      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        role,
      });
      await User.create(newUser);
      return {
        username: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        phone: newUser.phone,
        gender: newUser.gender,
        role: newUser.role,
      };
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      console.log(error.message);
      throw error;
    }
  }

  static async login(req) {
    // Simulate login logic
    try {
      const result = await loginSchema.validateAsync(req.body);
      const { email, password, role } = result;
      if (!email || !password || !role) {
        throw createError.BadRequest();
      }
      const user = await User.findOne({ email });

      if (!user) {
        throw createError.NotFound("User not registered");
      }
      // Check password is correct or not
      const isMatched = await user.isValidPassword(password); //await bcrypt.compare(password, user.password);
      if (!isMatched)
        throw createError.Unauthorized("Email/password not valid");
      // check role is correct or not
      if (role !== user.role) {
        throw createError.BadRequest(
          "Account doesn't exist with current role."
        );
      }
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      //refresh token update to the user
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      const generetedUser = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        role: user.role,
      };
      return { accessToken, refreshToken, user: generetedUser };
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      throw error;
    }
  }

  static async verifyToken(token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.userId;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  static async refreshToken(req) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const user = await User.findById(userId);

      if (!user) throw createError.NotFound();

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      return { accessToken: accessToken, refreshToken: refToken, user };
    } catch (error) {
      throw error;
    }
  }

  static async logout(req) {
    try {
      const { refreshToken, userId } = req.body;

      // if (!refreshToken) throw createError.BadRequest();
      // const userId = await verifyRefreshToken(refreshToken);
      await User.findByIdAndUpdate(
        userId,
        {
          $unset: {
            refreshToken: 1, // this removes the field from document
          },
        },
        {
          new: true,
        }
      );

      // client.DEL(userId, (err, val) => {
      //   if (err) {
      //     console.log(err.message);
      //     throw createError.InternalServerError();
      //   }
      //   console.log(val);
      //   res.sendStatus(204);
      // });
      return "";
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default AuthService;
