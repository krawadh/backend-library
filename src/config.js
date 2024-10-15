import dotenv from "dotenv";
dotenv.config();

const configVariable = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URL || "mongodb://localhost:27017/Prime_Library", //
  jwtAccessSecret: process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
  jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET || "your-secret-key",
  jwtAccessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15s",
  jwtRefreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "3h",
  requestOrigin: process.env.ORIGIN || "http://localhost:5173",
  dbName: process.env.DB_NAME,
};

export const {
  port,
  mongoURI,
  jwtAccessSecret,
  jwtRefreshSecret,
  requestOrigin,
  jwtAccessTokenExpiry,
  jwtRefreshTokenExpiry,
  dbName,
} = configVariable;
