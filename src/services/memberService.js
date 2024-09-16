import { User } from "../models/userModel.js";
import createError from "http-errors";
import { authSchema } from "../utils/validation_schema.js";

class memberService {
  static async add(req) {
    // Save user to database (or any other storage)
    try {
      const value = await authSchema.validateAsync(req.body);
      console.log(value);
      const { firstName, lastName, email, phone, password, gender, role } =
        value;

      const member = await User.findOne({ email });

      console.log(member);
      if (member) {
        //throw createError(401, `Seat already exist with this number: ${seatNumber}`); //or
        throw createError.Conflict(
          `Member already exist with this number: ${email}`
        );
      }

      const newMember = new User({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        role,
      });
      const createdSeat = await User.create(newMember);
      return createdSeat;
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      throw error;
    }
  }

  static async getMembers(req) {
    try {
      const keyword = req.query.keyword || "";

      // Construct the query with role as "Member" and other conditions
      const query = {
        $and: [
          { role: "Member" }, // Ensure the user has the role "Member"
          {
            $or: [
              { firstName: { $regex: keyword, $options: "i" } },
              // { description: { $regex: keyword, $options: "i" } }, // Uncomment if needed
            ],
          },
        ],
      };

      // Find users with the specified query, populate, and sort
      const members = await User.find(query)
        .populate({
          path: "membership",
          select: "membershipType fee duration",
        })
        .populate({
          path: "reservations", // Use the virtual to populate reservations
          populate: {
            path: "seat", // Inside the reservation, populate the seat information
            select: "seatNumber seatType isAvailable", // Optional: select specific fields
          },
        })
        .sort({ createdAt: -1 });

      if (!members || members.length === 0) throw createError.NotFound();

      return members;
    } catch (error) {
      throw error;
    }
  }

  static async getMemberByid(req) {
    try {
      const memberId = req.params.id;
      const member = await User.findById(memberId)
        .populate({
          path: "membership",
          select: "membershipType fee duration",
        })
        .populate({
          path: "reservations", // Use the virtual to populate reservations
          populate: {
            path: "seat", // Inside the reservation, populate the seat information
            select: "seatNumber seatType isAvailable", // Optional: select specific fields
          },
        })
        .sort({ createdAt: -1 });
      if (!member) throw createError.NotFound();
      return member;
    } catch (error) {
      throw error;
    }
  }

  static async updateMemberById(req) {
    try {
      const id = req.params.id;
      const value = req.body;
      if (value.email && value.email != undefined) {
        const email = value.email;
        const existingEmail = await User.findOne({
          $and: [
            { email }, // First condition: email must match
            { _id: { $ne: id } }, // Second condition: id must not equal the given value
          ],
        });

        // Handle the case when the email already exists, such as updating it or informing the administrato.
        if (existingEmail)
          throw createError.Conflict(`Member email ${email} already exists`);
      }

      const updatedRs = await User.findByIdAndUpdate(
        id,
        { $set: value },
        {
          new: true,
        }
      );
      if (!updatedRs) throw createError.NotFound();
      return memberService.getMemberByid(req);
      //return updatedRs;
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      throw error;
    }
  }

  static async removeMemberById(req) {
    try {
      const id = req.params.id;
      const memberDeletedRs = await User.findByIdAndDelete(id);
      if (!memberDeletedRs) throw createError.NotFound();
      return memberDeletedRs;
    } catch (error) {
      throw error;
    }
  }
}

export default memberService;
