import * as PhoneModel from "../models/phoneModel.js";

// obtener todos los teléfonos
export const getPhones = async (req, res, next) => {
  try {
    const phones = await PhoneModel.getAllPhones();
    res.json(phones);
  } catch (err) {
    next(err);
  }
};

// obtener teléfono por ID
export const getPhone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const phone = await PhoneModel.getPhoneById(id);
    if (!phone) return res.status(404).json({ error: "Teléfono no encontrado" });
    res.json(phone);
  } catch (err) {
    next(err);
  }
};

// crear teléfono
export const createPhoneController = async (req, res, next) => {
  try {
    const { id_contact, phone } = req.body;
    if (!phone) return res.status(400).json({ error: "El número es requerido" });

    const newPhone = await PhoneModel.createPhone({ id_contact, phone });
    res.status(201).json(newPhone);
  } catch (err) {
    next(err);
  }
};

// actualizar teléfono
export const updatePhoneController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { phone, is_active } = req.body;

    if (!phone || is_active === undefined) return res.status(400).json({ error: "Campos incompletos" });
    const updatedPhone = await PhoneModel.updatePhone(id, { phone, is_active });
    if (!updatedPhone) return res.status(404).json({ error: "Teléfono no encontrado" });

    res.json(updatedPhone);
  } catch (err) {
    next(err);
  }
};

// desactivar teléfono
export const deactivatePhoneController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deactivated = await PhoneModel.deactivatePhone(id);
    if (!deactivated) return res.status(404).json({ error: "Teléfono no encontrado" });
    res.json({ message: "Teléfono desactivado correctamente", deactivated });
  } catch (err) {
    next(err);
  }
};

// eliminar teléfono físicamente
export const deletePhoneController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await PhoneModel.deletePhone(id);
    if (!deleted) return res.status(404).json({ error: "Teléfono no encontrado" });
    res.json({ message: "Teléfono eliminado correctamente", deleted });
  } catch (err) {
    next(err);
  }
};
