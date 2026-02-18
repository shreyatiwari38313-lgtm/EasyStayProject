import express from "express";
import authController from "../controllers/auth.controller.js";
import { registerValidation, loginValidation } from "../validations/auth.users.js";
import { validationResult } from "express-validator";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
