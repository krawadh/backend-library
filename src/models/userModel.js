import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [/^\S+@\S+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: [/^\d{10}$/, "Invalid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: [true, "Gender is required"],
    },
    role: {
      type: String,
      enum: ["Member", "Admin"],
      required: [true, "Role is required"],
    },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "test",
    // },
    address: {
      type: String,
      default: "",
    },
    profile: {
      bio: { type: String },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
    },
    membershipFee: {
      type: Number,
      default: 0,
    },
    membershipExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    /* 
    Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
    */
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};
userSchema.virtual("reservations", {
  ref: "Reservation", // The model to use
  localField: "_id", // User's _id
  foreignField: "reservedBy", // Field in Reservation that refers to the user
});
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });
export const User = mongoose.model("User", userSchema);
