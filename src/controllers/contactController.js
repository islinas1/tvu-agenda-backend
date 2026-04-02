import * as ContactModel from "../models/contactModel.js";
import * as PhoneModel from "../models/phoneModel.js";
import pool from "../config/db.js";

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await ContactModel.getAllContacts();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const { contact_name, contact_institution, contact_position, description, created_by, phones } = req.body;

    if (!contact_name)
      return res.status(400).json({ error: "contact_name es requerido" });

    const newContact = await ContactModel.createContact({
      contact_name, contact_institution, contact_position, description,
      created_by: req.user?.id_user || created_by || 1
    });

    if (phones && phones.length > 0) {
      for (const p of phones) {
        const phoneNumber = typeof p === 'string' ? p : p.phone;
        if (phoneNumber && phoneNumber.trim() !== '') {
          await PhoneModel.createPhone({
            id_contact: newContact.id_contact,
            phone: phoneNumber.trim()
          });
        }
      }
    }

    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contact_name, contact_institution, contact_position, description, is_active, phones } = req.body;

    if (!contact_name || is_active === undefined)
      return res.status(400).json({ error: "Campos incompletos para actualizar" });

    const updatedContact = await ContactModel.updateContact(id, {
      contact_name, contact_institution, contact_position, description, is_active
    });
    if (!updatedContact) return res.status(404).json({ error: "Contacto no encontrado" });

    if (phones) {
      await pool.query("DELETE FROM phone WHERE id_contact = $1", [id]);
      for (const p of phones) {
        const phoneNumber = typeof p === 'string' ? p : p.phone;
        if (phoneNumber && phoneNumber.trim() !== '') {
          await pool.query(
            "INSERT INTO phone (id_contact, phone) VALUES ($1, $2)",
            [id, phoneNumber.trim()]
          );
        }
      }
    }

    res.json(updatedContact);
  } catch (err) {
    next(err);
  }
};

export const deactivateContactController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deactivated = await ContactModel.deactivateContact(id);
    if (!deactivated) return res.status(404).json({ error: "Contacto no encontrado" });
    res.json({ message: "Contacto desactivado correctamente", deactivated });
  } catch (err) {
    next(err);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM phone WHERE id_contact = $1", [id]);
    const deleted = await ContactModel.deleteContact(id);
    if (!deleted) return res.status(404).json({ error: "Contacto no encontrado" });
    res.json({ message: "Contacto eliminado correctamente", deleted });
  } catch (err) {
    next(err);
  }
};