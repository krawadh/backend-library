import { User } from "../models/userModel.js";
import createError from "http-errors";
import { Reservation } from "../models/resrvationModel.js";
import { Seating } from "../models/seatingModel.js";
class reservationService {
  static async seatreservation(req) {
    try {
      const id = req.params.id;
      const value = req.body;
      const filter = { reservedBy: value.reservedBy }; //seat: value.seat,
      const result = await Reservation.findOneAndUpdate(filter, value, {
        upsert: true, // Insert if no matching document is found
        new: true, // Return the modified document rather than the original
        runValidators: true, // Validate the update against the schema
      });
      if (!result) throw createError.NotFound();

      return result;
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      throw error;
    }
  }

  static async seatReserveBy(req) {
    try {
      const userId = req.params.id;
      const result = await Reservation.find({ reservedBy: userId })
        .populate({
          path: "seat", // This is now referencing the 'Seating' model
          select: "seatNumber seatType", // Select specific fields from Seating
        })
        .populate({
          path: "reservedBy", // This is now referencing the 'Seating' model
          select: "firstName lastName email, phone", // Select specific fields from Seating
        });

      if (!result) throw createError.NotFound();

      return result;
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      throw error;
    }
  }
}

export default reservationService;
