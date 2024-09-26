import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  updateProfile,
} from "../controllers/authController.js";
import { upload } from "../middlewares/multer.middleware.js";
//import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/register",
  upload.fields([{ name: "profileImage", count: 1 }]),
  register
);
router.post("/login", login);
//router.post("/login", login);

router.post("/refresh-token", refreshToken);

router.post("/logout", logout);
router.patch(
  "/update-profile",
  upload.fields([{ name: "profileImage", count: 1 }]),
  updateProfile
);
// router.delete("/logout", async (req, res, next) => {
//   res.send("Logout route1");
// });

export default router;
