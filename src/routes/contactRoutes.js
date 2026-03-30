import express from "express";
import {
  getContacts,
  createContactController,
  updateContactController,
  deactivateContactController,
  deleteContactController,
} from "../controllers/contactController.js";
import { authMiddleware, adminOnly } from "../middlewares/authMiddleware.js";
 
const router = express.Router();
 
router.get("/", authMiddleware, getContacts);

router.post("/", authMiddleware, createContactController);
router.put("/:id", authMiddleware, adminOnly, updateContactController);
router.patch("/deactivate/:id", authMiddleware, adminOnly, deactivateContactController);
router.delete("/:id", authMiddleware, adminOnly, deleteContactController);
 
export default router;