import express from "express";
import {
 getPhones,
 getPhone,
 createPhoneController,
 updatePhoneController,
 deactivatePhoneController,
 deletePhoneController,
} from "../controllers/phoneController.js";
//import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas protegidas
//router.use(authMiddleware);

// CRUD teléfonos
router.get("/", getPhones);                  // GET /api/phones
router.get("/:id", getPhone);                // GET /api/phones/:id
router.post("/", createPhoneController);    // POST /api/phones
router.put("/:id", updatePhoneController);  // PUT /api/phones/:id
router.patch("/deactivate/:id", deactivatePhoneController); // PATCH /api/phones/deactivate/:id
router.delete("/:id", deletePhoneController); // DELETE /api/phones/:id

export default router;
