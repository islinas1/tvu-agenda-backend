import express from "express";
import { login, checkCI } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/check-ci", checkCI);

export default router;