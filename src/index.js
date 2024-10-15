import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import createError from "http-errors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import seatingRoutes from "./routes/seatingRoutes.js";
import memberShipRoutes from "./routes/memberShipRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
//import { verifyAccessToken } from "./utils/jwt.js";
import connectDb from "./utils/db.js";
import { port, requestOrigin } from "./config.js";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname since ES6 modules don't provide it
/*const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);*/

// Load environment variables
dotenv.config({});
/*console.log(__dirname);
// Path to your certificate and key files
const key = fs.readFileSync(path.join(__dirname, "key.pem"));
const cert = fs.readFileSync(path.join(__dirname, "cert.pem"));*/

// Initialize express app
const app = express();

// CORS setup
app.use(
  cors({
    origin: requestOrigin, // Adjust the origin as needed
    credentials: true,
  })
);

// Middleware setup
app.use(morgan("dev")); // log requests and errors in development mode
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Define routes
app.get("/", async (req, res, next) => {
  console.log("cookie list", req.cookies);
  res.send("Hello from express.");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/seating", seatingRoutes);
app.use("/api/v1/membership", memberShipRoutes); // Add verifyAccessToken middleware if needed
app.use("/api/v1/member", memberRoutes);

// Error handling for 404
app.use(async (req, res, next) => {
  next(createError.NotFound());
});

// General error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(port, () => {
  connectDb();
  console.log(`Server is running on port ${port}`);
});
// Start server (using HTTPS for secured connections)
/*const server = https.createServer({ key, cert }, app);
// Handle 'clientError' event on the server
server.on("clientError", (err, socket) => {
  if (err) {
    console.error("Client error:", err.message);
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  } else {
    socket.destroy(); // Ensure the socket is closed properly
  }
});
server.listen(port, () => {
  connectDb(); // Connect to the database
  console.log(`Server is running on https://localhost:${port}`);
});*/
