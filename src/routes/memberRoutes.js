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
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../utils/jwt.js";

const router = express.Router();

router.get("/", verifyAccessToken, getMembers);
router.get("/:id", verifyAccessToken, getMemberById);
router.post("/", verifyAccessToken, addMember);
router.patch(
  "/:id",
  upload.fields([{ name: "profileImage", count: 1 }]),
  updateMember
);
router.delete("/:id", verifyAccessToken, removeMember);
router.patch("/assignSeat/:id", verifyAccessToken, assignSeat);
router.get("/assignSeat/:id", verifyAccessToken, seatReserveById);

export default router;
