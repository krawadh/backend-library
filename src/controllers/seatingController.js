import SeatService from "../services/seatingService.js";

export const addSeat = async (req, res, next) => {
  try {
    const seat = await SeatService.add(req);
    return res.status(201).json({
      message: "Seat created successfully.",
      success: true,
      seat,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const getSeats = async (req, res, next) => {
  try {
    const seats = await SeatService.getSeats(req);
    return res.status(200).json({
      seats,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const getSeatById = async (req, res, next) => {
  try {
    const seat = await SeatService.getSeatByid(req);
    return res.status(200).json({
      seat,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const updateSeat = async (req, res, next) => {
  try {
    const updatedSeat = await SeatService.updateSeatById(req);
    return res.status(200).json({
      message: "Seat updated successfully.",
      updatedSeat,
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};

export const removeSeat = async (req, res, next) => {
  try {
    const deleteSeat = await SeatService.removeSeatById(req);
    return res.status(200).json({
      deleteSeat,
      message: "Seat remove successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error.messages);
    next(error);
  }
};
