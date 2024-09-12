import dotenv from "dotenv";
dotenv.config();

const configVariable = {
  port: process.env.PORT || 3001,
  mongoURI: process.env.MONGO_URL || "mongodb://localhost:27017/Prime_Library", //
  jwtAccessSecret: process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
  jwtRefreshSecret: process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
};

export const { port, mongoURI, jwtAccessSecret, jwtRefreshSecret } =
  configVariable;
