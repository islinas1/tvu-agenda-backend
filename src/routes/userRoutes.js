import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUserController,
  deactivateUserController,
  activateUserController,
  changePasswordController,
} from "../controllers/userController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta PUBLICA
router.post("/signup", createUser);


router.patch("/change-password", verifyToken, changePasswordController);

// Rutas protegidas (solo admin)
router.get("/", verifyToken, authorizeRoles(1), getUsers);
router.get("/:id", verifyToken, authorizeRoles(1), getUser);
router.post("/", verifyToken, authorizeRoles(1), createUser);
router.put("/:id", verifyToken, authorizeRoles(1), updateUserController);
router.patch("/deactivate/:id", verifyToken, authorizeRoles(1), deactivateUserController);
router.patch("/activate/:id", verifyToken, authorizeRoles(1), activateUserController);

export default router;