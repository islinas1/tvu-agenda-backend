import express from "express";
import {
  getContacts,
  createContactController,
  updateContactController,
  deactivateContactController,
  deleteContactController,
} from "../controllers/contactController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getContacts);
router.post("/", verifyToken, createContactController);
router.put("/:id", verifyToken, authorizeRoles(1), updateContactController);
router.patch("/deactivate/:id", verifyToken, authorizeRoles(1), deactivateContactController);
router.delete("/:id", verifyToken, authorizeRoles(1), deleteContactController);

export default router;