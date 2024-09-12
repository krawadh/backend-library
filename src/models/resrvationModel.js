import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reservationStartTime: {
      type: Date,
    },
    reservationEndTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
  },
  { timestamps: true }
);
export const Reservation = mongoose.model("Reservation", reservationSchema);
