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
router.get("/:id", getMembershipById);
router.post("/", addMembership); //addMembership
router.patch("/:id", updateMembership);
router.delete("/:id", removeMembership);

export default router;
