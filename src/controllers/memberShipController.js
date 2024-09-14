import MembershipService from "../services/membershipService.js";

export const addMembership = async (req, res, next) => {
  try {
    const membership = await MembershipService.add(req);
    return res.status(201).json({
      membership,
      message: "Membership created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const getMemberships = async (req, res, next) => {
  try {
    const memberships = await MembershipService.getMemberships(req);
    return res.status(200).json({
      memberships,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const getMembershipById = async (req, res, next) => {
  try {
    const membership = await MembershipService.getMembershipByid(req);
    return res.status(200).json({
      membership,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const updateMembership = async (req, res, next) => {
  try {
    const updateRs = await MembershipService.updateMembershipById(req);
    return res.status(200).json({
      updateRs,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const removeMembership = async (req, res, next) => {
  try {
    const deletedRs = await MembershipService.removeMembershipById(req);
    return res.status(200).json({
      deletedRs,
      message: "Membership remove successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};
