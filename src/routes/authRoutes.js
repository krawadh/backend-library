import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  updateProfile,
} from "../controllers/authController.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../utils/jwt.js";
//import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/register",
  upload.fields([{ name: "profileImage", count: 1 }]),
  register
);
router.post("/login", login);
//router.post("/login", login);

router.get("/refresh-token", refreshToken);

router.get("/logout", logout);
router.patch(
  "/update-profile",
  verifyAccessToken,
  upload.fields([{ name: "profileImage", count: 1 }]),
  updateProfile
);
// router.delete("/logout", async (req, res, next) => {
//   res.send("Logout route1");
// });

export default router;
