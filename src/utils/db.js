import mongoose from "mongoose";
import { mongoURI, dbName } from "../config.js";
const connectDb = async () => {
  try {
    //await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connect(`${mongoURI}/${dbName}`);
    console.log("mongodb connected successfully.");
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
};
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected.");
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
  } finally {
    process.exit(0);
  }
});

export default connectDb;
