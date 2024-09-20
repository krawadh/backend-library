// authController.js
import AuthService from "../services/authService.js";
import createError from "http-errors";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req);
    return res.status(201).json({
      message: "User created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);

    //res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res, next) => {
  //const { email, password, role } = req.body;
  try {
    const { accessToken, refreshToken, user } = await AuthService.login(req);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };
    res
      .status(200)
      /*.cookie("accessToken", accessToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1day
        httpsOnly: true,
        sameSite: "strict",
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "strict",
        secure: true, // Ensure this is true if using HTTPS
      })*/
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: `Welcome back ${user.firstName} ${user.lastName}`,
        user,
        success: true,
      });
  } catch (error) {
    //res.status(401).json({ error: error.message });
    console.log(error.message);
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await AuthService.refreshToken(
      req
    );
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };
    res
      .status(200)
      // .cookie("accessToken", accessToken, {
      //   maxAge: 1 * 24 * 60 * 60 * 1000, // 1day
      //   httpsOnly: true,
      //   sameSite: "strict",
      // })
      // .cookie("refreshToken", refreshToken, {
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      //   httpOnly: true,
      //   sameSite: "strict",
      //   secure: true, // Ensure this is true if using HTTPS
      // })
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: `Welcome back ${user.firstName} ${user.lastName}`,
        user,
        success: true,
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const val = await AuthService.logout(req);

    try {
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      };
      return (
        res
          .status(200)
          // .cookie("accessToken", "", { maxAge: 0 })
          // .cookie("refreshToken", "", { maxAge: 0 })
          .clearCookie("accessToken", options)
          .clearCookie("refreshToken", options)
          .json({
            message: "Logged out successfully.",
            success: true,
          })
      );
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    next(error);
  }
};
