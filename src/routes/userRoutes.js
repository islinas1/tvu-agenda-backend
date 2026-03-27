import express from "express";
import {
 getUsers,
 getUser,
 createUser,
 updateUserController,
 deactivateUserController,
} from "../controllers/userController.js";
//import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas protegidas
//router.use(authMiddleware);

// CRUD usuarios
router.get("/", getUsers);             // GET /api/users
router.get("/:id", getUser);           // GET /api/users/:id
router.post("/", createUser);          // POST /api/users
router.put("/:id", updateUserController); // PUT /api/users/:id
router.patch("/deactivate/:id", deactivateUserController); // PATCH /api/users/deactivate/:id

export default router;
