import express from "express";
import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRoleController,
} from "../controllers/roleController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas protegidas con auth
router.use(verifyToken);

// CRUD roles
router.get("/", authorizeRoles(1), getRoles);             // GET /api/roles
router.get("/:id", authorizeRoles(1), getRole);           // GET /api/roles/:id
router.post("/", authorizeRoles(1), createRole);          // POST /api/roles
router.put("/:id", authorizeRoles(1), updateRole);        // PUT /api/roles/:id
router.delete("/:id", authorizeRoles(1), deleteRoleController); // DELETE /api/roles/:id disable

export default router;