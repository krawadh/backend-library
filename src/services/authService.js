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

import { jwtAccessSecret } from "../config.js";

import {
  destroyOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { create } from "@hapi/joi/lib/ref.js";

class AuthService {
  static async register(req) {
    // Simulate registration logic
    // Save user to database (or any other storage)
    try {
      //const { firstName, lastName, email, phone, password, gender, role } = req.body;

      const { firstName, lastName, email, phone, password, gender, role } =
        await authSchema.validateAsync(req.body);

      const user = await User.findOne({ email });
      if (user) {
        //throw createError(401, "User already exist with this email"); //or
        throw createError.Conflict(
          `User already exist with this email: ${email}`
        );
      }

      // Initialize profileImage as empty by default
      let profileImage = { url: "", public_id: "" };

      // Check if req.files exists and if profileImage is provided
      if (req.files && req.files.profileImage && req.files.profileImage[0]) {
        const profileImageLocalPath = req.files?.profileImage[0]?.path;
        if (!profileImageLocalPath)
          throw createError.BadRequest("Profile image file is required");
        profileImage = await uploadOnCloudinary(profileImageLocalPath);
        if (!profileImage)
          throw createError.BadRequest("Profile image file is required");
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
        profile: {
          profilePhoto: profileImage.url ? profileImage?.url : "",
          profilePhotoPublicId: profileImage.public_id
            ? profileImage?.public_id
            : "", // Save Cloudinary public_id
        },
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
        throw createError.BadRequest("email/password/role is required");
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
        throw createError.BadRequest("User doesn't exist with current role.");
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
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        profile: user.profile,
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
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        throw createError.Unauthorized("unauthorized request");
      }
      const userId = await verifyRefreshToken(refreshToken);
      const user = await User.findById(userId);

      if (!user) throw createError.Forbidden("Invalid refresh token");

      if (refreshToken !== user?.refreshToken) {
        throw createError.Forbidden("Refresh token is expired or used");
      }
      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);

      //new refresh token has update into user collection
      // user.refreshToken = refToken;
      // await user.save({ validateBeforeSave: false });

      return { accessToken: accessToken, refreshToken: refToken, user };
    } catch (error) {
      //console.log("catch block---", error);
      throw error;
    }
  }

  static async logout(req) {
    try {
      const { userId } = req.body;

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
      console.log("catch error----", error);
      throw error;
    }
  }

  static async updateProfile(req) {
    // Simulate profile update logic
    // Save user to database (or any other storage)
    try {
      const { id, firstName, lastName, email, phone, gender } = req.body;
      const user = await User.findById(id).select("-password -refreshToken");

      //return user;
      // Initialize profileImage as empty by default
      let profileImage = { url: "", public_id: "" };

      // Check if req.files exists and if profileImage is provided

      if (req.files && req.files.profileImage && req.files.profileImage[0]) {
        const profileImageLocalPath = req.files?.profileImage[0]?.path;
        if (!profileImageLocalPath)
          throw createError.BadRequest("Profile image file is required");
        profileImage = await uploadOnCloudinary(profileImageLocalPath);
        if (!profileImage)
          throw createError.BadRequest("Profile image file is required");

        // TODO: delete the old image if it exists
        if (user.profile.profilePhotoPublicId) {
          const destroyRs = await destroyOnCloudinary(
            user.profile.profilePhotoPublicId
          );
          if (!destroyRs)
            throw createError.BadRequest("Error deleting old image.");
        }
      }
      const updatedUser = await User.findByIdAndUpdate(
        user?._id,
        {
          $set: {
            firstName,
            lastName,
            email,
            phone,
            gender,
            profile: {
              profilePhoto: profileImage.url
                ? profileImage?.url
                : user.profile.profilePhoto,
              profilePhotoPublicId: profileImage.public_id
                ? profileImage?.public_id
                : user.profile.profilePhotoPublicId, // Save Cloudinary public_id
            },
          },
        },
        { new: true }
      ).select("-password -refreshToken");

      if (updatedUser)
        return {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          gender: updatedUser.gender,
          role: updatedUser.role,
          profile: updatedUser.profile,
        };
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  static async updateUserProfileImage(req, res) {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Profile image file is missing");
    }

    // Fetch the current user and retrieve the public_id of the old avatar if it exists
    const user = await User.findById(req.user._id);

    // TODO: delete the old image if it exists
    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(
        user.avatarPublicId,
        (error, result) => {
          if (error) {
            console.error("Error deleting old avatar:", error);
          } else {
            console.log("Old avatar deleted successfully:", result);
          }
        }
      );
    }

    // Upload the new avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
      throw new ApiError(400, "Error while uploading avatar");
    }

    // After successful upload, delete the local file
    fs.unlink(avatarLocalPath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      }
    });

    // Update the user with the new avatar URL and public_id
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          avatar: avatar.url,
          avatarPublicId: avatar.public_id, // Store the new avatar's public_id
        },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "Avatar image updated successfully")
      );
  }
}

export default AuthService;
