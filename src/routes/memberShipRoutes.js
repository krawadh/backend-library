import express from "express";
import {
  getMemberships,
  getMembershipById,
  addMembership,
  updateMembership,
  removeMembership,
} from "../controllers/memberShipController.js";
import { verifyAccessToken } from "../utils/jwt.js";

const router = express.Router();

router.get("/", verifyAccessToken, getMemberships);
router.get("/:id", verifyAccessToken, getMembershipById);
router.post("/", verifyAccessToken, addMembership); //addMembership
router.patch("/:id", verifyAccessToken, updateMembership);
router.delete("/:id", verifyAccessToken, removeMembership);

export default router;
