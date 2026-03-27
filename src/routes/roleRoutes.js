import express from "express";
import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRoleController,
} from "../controllers/roleController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas protegidas con auth
//router.use(authMiddleware);

// CRUD roles
router.get("/", getRoles);             // GET /api/roles
router.get("/:id", getRole);           // GET /api/roles/:id
router.post("/", createRole);          // POST /api/roles
router.put("/:id", updateRole);        // PUT /api/roles/:id
router.delete("/:id", deleteRoleController); // DELETE /api/roles/:id disable

export default router;