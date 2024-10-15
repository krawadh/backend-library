import express from "express";
import {
  getSeats,
  getSeatById,
  addSeat,
  updateSeat,
  removeSeat,
} from "../controllers/seatingController.js";
import { verifyAccessToken } from "../utils/jwt.js";

const router = express.Router();

router.get("/", verifyAccessToken, getSeats);
router.get("/:id", verifyAccessToken, getSeatById);
router.post("/", verifyAccessToken, addSeat);
router.patch("/:id", verifyAccessToken, updateSeat);
router.delete("/:id", verifyAccessToken, removeSeat);

export default router;
