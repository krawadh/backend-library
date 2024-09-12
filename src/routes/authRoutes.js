import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/authController.js";
//import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
//router.post("/login", login);

router.post("/refresh-token", refreshToken);

router.get("/logout", logout);
// router.delete("/logout", async (req, res, next) => {
//   res.send("Logout route1");
// });

export default router;
