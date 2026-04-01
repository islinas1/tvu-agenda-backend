import express from "express";
import {
 getPhones,
 getPhone,
 createPhoneController,
 updatePhoneController,
 deactivatePhoneController,
 deletePhoneController,
} from "../controllers/phoneController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Todas las rutas protegidas
router.use(verifyToken);

// CRUD teléfonos
router.get("/", authorizeRoles(1), getPhones);                  // GET /api/phones
router.get("/:id", authorizeRoles(1), getPhone);                // GET /api/phones/:id
router.post("/", authorizeRoles(1), createPhoneController);    // POST /api/phones
router.put("/:id", authorizeRoles(1), updatePhoneController);  // PUT /api/phones/:id
router.patch("/deactivate/:id", authorizeRoles(1), deactivatePhoneController); // PATCH /api/phones/deactivate/:id
router.delete("/:id", authorizeRoles(1),   deletePhoneController); // DELETE /api/phones/:id

export default router;
