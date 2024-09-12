import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    membershipType: {
      type: String,
      enum: [
        "6-Hours",
        "8-Hours",
        "10-Hours",
        "12-Hours",
        "16-Hours",
        "Reserved",
        "Reserved Discrete",
        "Locker",
      ],
      required: [true, "Membership type is required"],
    },
    fee: {
      type: Number,
      required: [true, "Membership fee is required"],
    },
    duration: {
      type: String,
      enum: [
        "Daily",
        "Weekly",
        "Monthly",
        "Quarterly",
        "Half-yearly",
        "Yearly",
      ],
      required: [true, "Duration fee is required"],
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

export const Membership = mongoose.model("Membership", membershipSchema);
