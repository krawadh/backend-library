import dotenv from "dotenv";
dotenv.config();

const configVariable = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URL || "mongodb://localhost:27017/Prime_Library", //
  jwtAccessSecret: process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
  jwtRefreshSecret: process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
  jwtAccessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "1d",
  jwtRefreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "10d",
  requestOrigin: process.env.ORIGIN || "http://localhost:5173",
};

export const {
  port,
  mongoURI,
  jwtAccessSecret,
  jwtRefreshSecret,
  requestOrigin,
  jwtAccessTokenExpiry,
  jwtRefreshTokenExpiry,
} = configVariable;
