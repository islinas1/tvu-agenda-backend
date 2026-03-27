import * as ContactModel from "../models/contactModel.js";

// obtener todos los contactos
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await ContactModel.getAllContacts();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

// obtener contacto por ID - INNECESARIO 
/*
export const getContact = async (req, res, next) => {
 try {
   const { id } = req.params;
   const contact = await ContactModel.getContactById(id);
   if (!contact) return res.status(404).json({ error: "Contacto no encontrado" });
   res.json(contact);
 } catch (err) {
   next(err);
 }
};
*/

// crear contacto
export const createContactController = async (req, res, next) => {
  try {
    const { contact_name, contact_institution, contact_position, description, created_by } = req.body;

    if (!contact_name)
      return res.status(400).json({ error: "contact_name es requerido" });

    const newContact = await ContactModel.createContact({ contact_name, contact_institution, contact_position, description, created_by });
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
};

// actualizar contacto
export const updateContactController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contact_name, contact_institution, contact_position, description, is_active } = req.body;

    if (!contact_name || is_active === undefined)
      return res.status(400).json({ error: "Campos incompletos para actualizar" });

    const updatedContact = await ContactModel.updateContact(id, { contact_name, contact_institution, contact_position, description, is_active });
    if (!updatedContact) return res.status(404).json({ error: "Contacto no encontrado" });

    res.json(updatedContact);
  } catch (err) {
    next(err);
  }
};

// desactivar contacto
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

// eliminar contacto
export const deleteContactController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ContactModel.deleteContact(id);
    if (!deleted) return res.status(404).json({ error: "Contacto no encontrado" });
    res.json({ message: "Contacto eliminado correctamente", deleted });
  } catch (err) {
    next(err);
  }
};
