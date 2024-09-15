import mongoose from "mongoose";

const seatingSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: [true, "Seat number is required"],
      //unique: true,
    },
    seatType: {
      type: String,
      enum: ["Normal", "Cabin"],
      required: [true, "Seat type is required"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    reservedBy: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Seating = mongoose.model("Seating", seatingSchema);
