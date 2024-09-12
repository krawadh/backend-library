import Joi from "@hapi/joi";

export const authSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .messages({ "any.required": "First name is required" }),

  lastName: Joi.string()
    .trim()
    .required()
    .messages({ "any.required": "Last name is required" }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .lowercase()
    .messages({
      "any.required": "Email is required",
      "string.email": "Invalid email",
    }),

  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "any.required": "Phone number is required",
      "string.pattern.base": "Invalid phone number",
    }),

  password: Joi.string().min(8).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),

  gender: Joi.string().valid("Male", "Female").required().messages({
    "any.required": "Gender is required",
    "any.only": "Gender must be either Male or Female",
  }),

  role: Joi.string().valid("Member", "Admin").required().messages({
    "any.required": "Role is required",
    "any.only": "Role must be either Member or Admin",
  }),

  address: Joi.string().default(""),
  membership: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // Assuming ObjectId
  membershipFee: Joi.number().default(0),
  membershipExpiry: Joi.date().optional(),
  profile: Joi.object({
    bio: Joi.string().allow(""),
    profilePhoto: Joi.string().default(""),
  }).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .lowercase()
    .messages({
      "any.required": "Email is required",
      "string.email": "Invalid email",
    }),
  password: Joi.string().min(8).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
  role: Joi.string().valid("Member", "Admin").required().messages({
    "any.required": "Role is required",
    "any.only": "Role must be either Member or Admin",
  }),
});

export const seatSchema = Joi.object({
  seatNumber: Joi.string()
    .required()
    .messages({ "any.required": "Seat number is required" }),

  seatType: Joi.string().valid("Normal", "Cabin").required().messages({
    "any.required": "Seat type is required",
    "any.only": "Seat type must be either Normal or Cabin",
  }),

  isAvailable: Joi.boolean().default(true),

  reservedBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Assuming ObjectId format
    .optional()
    .messages({ "string.pattern.base": "Invalid reservedBy ID format" }),

  reservationStartTime: Joi.date().optional(),

  reservationEndTime: Joi.date().optional(),

  createdBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Assuming ObjectId format
    .required()
    .messages({
      "any.required": "Created by field is required",
      "string.pattern.base": "Invalid createdBy ID format",
    }),
});

export async function validateSeatingInput(input) {
  console.log(input);
  try {
    const value = await seatSchema.validateAsync(input);
    console.log("Validation successful:", value);
    return value;
  } catch (error) {
    console.log("Validation error:", error.details);
    //throw error;
  }
}

export const memberSchema = Joi.object({
  membershipType: Joi.string()
    .valid(
      "6-Hours",
      "8-Hours",
      "10-Hours",
      "12-Hours",
      "16-Hours",
      "Reserved",
      "Reserved Discrete",
      "Locker"
    )
    .required()
    .messages({
      "any.required": "Membership type is required",
      "any.only": "Invalid membership type",
    }),

  fee: Joi.number().required().messages({
    "any.required": "Membership fee is required",
    "number.base": "Membership fee must be a number",
  }),

  duration: Joi.string()
    .valid("Daily", "Weekly", "Monthly", "Quarterly", "Half-yearly", "Yearly")
    .required()
    .messages({
      "any.required": "Duration is required",
      "any.only": "Invalid duration",
    }),

  description: Joi.string().allow("").default(""),

  isActive: Joi.boolean().default(true),

  createdBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Assuming ObjectId format
    .required()
    .messages({
      "any.required": "Created by field is required",
      "string.pattern.base": "Invalid createdBy ID format",
    }),
});

export async function validateMemberInput(input) {
  try {
    const value = await memberSchema.validateAsync(input, {
      abortEarly: false,
    });
    return value;
  } catch (error) {
    throw error;
  }
}
