import createError from "http-errors";
import { Membership } from "../models/memberShipModel.js";
import { validateMemberInput } from "../utils/validation_schema.js";
class MembershipService {
  static async add(req) {
    // Save user to database (or any other storage)
    try {
      const value = await validateMemberInput(req.body);
      const {
        membershipType,
        fee,
        duration,
        description,
        isActive,
        createdBy,
      } = value;
      const memberShip = await Membership.findOne({
        $and: [
          { membershipType }, // First condition: membership type must match
          { duration }, // Second condition: duration type must match
        ],
      });

      console.log(memberShip);
      if (memberShip) {
        throw createError.Conflict(
          `Membership already exist with this type: ${membershipType}`
        );
      }

      const newmember = new Membership({
        membershipType,
        fee,
        duration,
        description,
        isActive,
        createdBy,
      });

      const createdMembership = await Membership.create(newmember);
      return createdMembership;
    } catch (error) {
      console.log("catch block.....", error);
      if (error.isJoi === true) error.status = 422;
      throw error;
    }
  }

  static async getMemberships(req) {
    try {
      const keyword = req.query.keyword || "";
      const query = {
        $or: [
          { membershipType: { $regex: keyword, $options: "i" } },
          //{ description: { $regex: keyword, $options: "i" } },
        ],
      };
      const memberships = await Membership.find(query)
        .populate({
          path: "createdBy",
        })
        .sort({ createdAt: -1 });
      if (!memberships) throw createError.NotFound();
      return memberships;
    } catch (error) {
      throw error;
    }
  }

  static async getMembershipByid(req) {
    try {
      const membershipId = req.params.id;
      const memberShip = await Membership.findById(membershipId)
        .populate({
          path: "createdBy",
        })
        .sort({ createdAt: -1 });
      if (!memberShip) throw createError.NotFound();
      return memberShip;
    } catch (error) {
      throw error;
    }
  }

  static async updateMembershipById(req) {
    try {
      const id = req.params.id;
      const value = req.body;
      if (value.membershipType && value.membershipType != undefined) {
        const membershipType = value.membershipType;
        const existingMembership = await Membership.findOne({
          $and: [
            { membershipType: membershipType }, // First condition: membershipType must match
            { _id: { $ne: id } }, // Second condition: id must not equal the given value
          ],
        });

        // Handle the case when the membership type already exists, such as updating it or informing the user.
        if (existingMembership)
          throw createError.Conflict(
            `Membership ${membershipType} already exists`
          );
      }

      const updatedRs = await Membership.findByIdAndUpdate(
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

  static async removeMembershipById(req) {
    try {
      const id = req.params.id;
      const membershipDeletedRs = await Membership.findByIdAndDelete(id);
      if (!membershipDeletedRs) throw createError.NotFound();
      return membershipDeletedRs;
    } catch (error) {
      throw error;
    }
  }
}

export default MembershipService;
