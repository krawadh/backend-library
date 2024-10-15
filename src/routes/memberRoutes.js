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
router.get("/:id", getMemberById);
router.post("/", addMember);
router.patch(
  "/:id",
  upload.fields([{ name: "profileImage", count: 1 }]),
  updateMember
);
router.delete("/:id", removeMember);
router.patch("/assignSeat/:id", assignSeat);
router.get("/assignSeat/:id", seatReserveById);

export default router;
