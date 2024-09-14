import express from "express";
import {
  getMembers,
  getMemberById,
  addMember,
  updateMember,
  removeMember,
  assignSeat,
  seatReserveById,
} from "../controllers/memberController.js";

const router = express.Router();

router.get("/", getMembers);
router.get("/:id", getMemberById);
router.post("/", addMember);
router.patch("/:id", updateMember);
router.delete("/:id", removeMember);
router.patch("/assignSeat/:id", assignSeat);
router.get("/assignSeat/:id", seatReserveById);

export default router;
