import express from "express";
import {
 getContacts,
 //getContact,
 createContactController,
 updateContactController,
 deactivateContactController,
 deleteContactController,
} from "../controllers/contactController.js";
//import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas protegidas
//router.use(authMiddleware);

// CRUD contactos
router.get("/", getContacts);                  // GET /api/contacts
//router.get("/:id", getContact);                // GET /api/contacts/:id
router.post("/", createContactController);    // POST /api/contacts
router.put("/:id", updateContactController);  // PUT /api/contacts/:id
router.patch("/deactivate/:id", deactivateContactController); // PATCH /api/contacts/deactivate/:id
router.delete("/:id", deleteContactController); // DELETE /api/contacts/:id

export default router;
