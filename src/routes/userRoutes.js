import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUserController,
  deactivateUserController,
} from "../controllers/userController.js";
import { authMiddleware, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminOnly, getUsers);
router.get("/:id", authMiddleware, adminOnly, getUser);
router.post("/", authMiddleware, adminOnly, createUser);
router.put("/:id", authMiddleware, adminOnly, updateUserController);
router.patch("/deactivate/:id", authMiddleware, adminOnly, deactivateUserController);

export default router;