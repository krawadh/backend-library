import JWT from "jsonwebtoken";
import createError from "http-errors";
//const client = require("./init_redis");
import {
  jwtAccessSecret,
  jwtRefreshSecret,
  jwtAccessTokenExpiry,
  jwtRefreshTokenExpiry,
} from "../config.js";
const jwtService = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = jwtAccessSecret;
      const options = {
        expiresIn: jwtAccessTokenExpiry,
        //issuer: "pickurpage.com",
        audience: userId,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(createError.Unauthorized());
    }

    JWT.verify(token, jwtAccessSecret, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = jwtRefreshSecret;
      const options = {
        expiresIn: jwtRefreshTokenExpiry,
        //issuer: "pickurpage.com",
        audience: userId,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
          return;
        }

        // client.SET(userId, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
        //   if (err) {
        //     console.log(err.message);
        //     reject(createError.InternalServerError());
        //     return;
        //   }
        //   resolve(token);
        // });
        resolve(token);
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, jwtRefreshSecret, (err, payload) => {
        if (err)
          return reject(
            createError.Forbidden("Refresh token is expired or used")
          );
        const userId = payload.aud;

        resolve(userId);
      });
    });
  },
};

export const {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = jwtService;
