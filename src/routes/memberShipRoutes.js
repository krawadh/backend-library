import express from "express";
import {
  getMemberships,
  getMembershipById,
  addMembership,
  updateMembership,
  removeMembership,
} from "../controllers/memberShipController.js";

const router = express.Router();

router.get("/", getMemberships);
router.get("/:id", getMembershipById);
router.post("/", addMembership); //addMembership
router.patch("/:id", updateMembership);
router.delete("/:id", removeMembership);

export default router;
