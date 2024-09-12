import express from "express";
import {
  getSeats,
  getSeatById,
  addSeat,
  updateSeat,
  removeSeat,
} from "../controllers/seatingController.js";

const router = express.Router();

router.get("/", getSeats);
router.get("/:id", getSeatById);
router.post("/", addSeat);
router.patch("/:id", updateSeat);
router.delete("/:id", removeSeat);

export default router;
