import memberService from "../services/memberService.js";
import reservationService from "../services/reservationService.js";

export const addMember = async (req, res, next) => {
  try {
    const member = await memberService.add(req);
    return res.status(201).json({
      message: "Member created successfully.",
      success: true,
      member,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await memberService.getMembers(req);
    return res.status(200).json({
      members,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const getMemberById = async (req, res, next) => {
  try {
    const member = await memberService.getMemberByid(req);
    return res.status(200).json({
      member,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const updatedMember = await memberService.updateMemberById(req);
    return res.status(200).json({
      message: "Member updated successfully.",
      updatedMember,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const deletedMember = await memberService.removeMemberById(req);
    return res.status(200).json({
      deletedMember,
      message: "Member remove successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const assignSeat = async (req, res, next) => {
  try {
    const updatedMember = await reservationService.seatreservation(req);
    return res.status(200).json({
      message: "Seat assign to member updated successfully.",
      updatedMember,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const seatReserveById = async (req, res, next) => {
  try {
    const reservedByMember = await reservationService.seatReserveBy(req);
    return res.status(200).json({
      reservedByMember,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};
