import express from "express";
import {
  getMembers,
  getMemberById,
  addMember,
  updateMember,
  removeMember,
} from "../controllers/memberController.js";

const router = express.Router();

router.get("/", getMembers);
router.get("/:id", getMemberById);
router.post("/", addMember);
router.patch("/:id", updateMember);
router.delete("/:id", removeMember);

export default router;
