import MemberService from "../services/memberService.js";

export const addMember = async (req, res, next) => {
  try {
    const seat = await MemberService.add(req);
    return res.status(201).json({
      message: "Member created successfully.",
      success: true,
      seat,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await MemberService.getMembers(req);
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
    const member = await MemberService.getMemberByid(req);
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
    const updatedMember = await MemberService.updateMemberById(req);
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
    const deletedMember = await MemberService.removeMemberById(req);
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
