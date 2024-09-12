import mongoose from "mongoose";
import { mongoURI } from "../config.js";
const connectDb = async () => {
  try {
    //await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connect(mongoURI);
    console.log("mongodb connected successfully.");
  } catch (error) {
    console.log(error);
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
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDb;
