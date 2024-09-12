import { Seating } from "../models/seatingModel.js";
import createError from "http-errors";
import { validateSeatingInput } from "../utils/validation_schema.js";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

class SeatService {
  static async add(req) {
    // Save user to database (or any other storage)
    try {
      const value = await validateSeatingInput(req.body);
      console.log(value);
      const {
        seatNumber,
        seatType,
        isAvailable,
        reservedBy,
        reservationStartTime,
        reservationEndTime,
        createdBy,
      } = value;

      const seat = await Seating.findOne({ seatNumber });

      console.log(seat);
      if (seat) {
        //throw createError(401, `Seat already exist with this number: ${seatNumber}`); //or
        throw createError.Conflict(
          `Seat already exist with this number: ${seatNumber}`
        );
      }

      const newSeat = new Seating({
        seatNumber,
        seatType,
        isAvailable,
        reservedBy,
        reservationStartTime,
        reservationEndTime,
        createdBy,
      });
      const createdSeat = await Seating.create(newSeat);
      return createdSeat;
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      throw error;
    }
  }

  static async getSeats(req) {
    try {
      const keyword = req.query.keyword || "";
      const query = {
        $or: [
          { seatNumber: { $regex: keyword, $options: "i" } },
          //{ description: { $regex: keyword, $options: "i" } },
        ],
      };
      const seats = await Seating.find(query)
        .populate({
          path: "reservedBy",
        })
        .sort({ createdAt: -1 });
      if (!seats) throw createError.NotFound();
      return seats;
    } catch (error) {
      throw error;
    }
  }

  static async getSeatByid(req) {
    try {
      const seatId = req.params.id;
      const seat = await Seating.findById(seatId)
        .populate({
          path: "reservedBy",
        })
        .sort({ createdAt: -1 });
      if (!seat) throw createError.NotFound();
      return seat;
    } catch (error) {
      throw error;
    }
  }

  static async updateSeatById(req) {
    try {
      const id = req.params.id;
      //const value = await validateSeatingInput(req.body);
      const value = req.body;
      //const { _id, __v, ...updateNew } = value;
      if (value.seatNumber && value.seatNumber != undefined) {
        const seatNumber = value.seatNumber;
        const existingSeat = await Seating.findOne({
          $and: [
            { seatNumber }, // First condition: seatNumber must match
            { _id: { $ne: id } }, // Second condition: id must not equal the given value
          ],
        });

        // Handle the case when the seat number already exists, such as updating it or informing the user.
        if (existingSeat)
          throw createError.Conflict(
            `Seat number ${seatNumber} already exists`
          );
      }

      const updatedRs = await Seating.findByIdAndUpdate(
        id,
        { $set: value },
        {
          new: true,
        }
      );
      if (!updatedRs) throw createError.NotFound();
      return updatedRs;
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      throw error;
    }
  }

  static async removeSeatById(req) {
    try {
      const id = req.params.id;
      const seatDeletedRs = await Seating.findByIdAndDelete(id);
      if (!seatDeletedRs) throw createError.NotFound();
      return seatDeletedRs;
    } catch (error) {
      throw error;
    }
  }
}

export default SeatService;
