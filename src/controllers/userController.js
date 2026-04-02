import * as UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.getUserById(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { id_role, name, last_name, ci, password, is_active } = req.body;
    if (!name || !last_name || !ci)
      return res.status(400).json({ error: "Nombre, apellido y CI son requeridos" });

    const exists = await UserModel.ciExists(ci);
    if (exists) return res.status(400).json({ error: "CI ya existe" });

    const rawPassword = password || ci.toString();
    const password_hash = await bcrypt.hash(rawPassword, 10);

    const newUser = await UserModel.createUser({
      id_role: id_role || 2,
      name, last_name, ci, password_hash,
      is_active: is_active ?? false
    });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_role, name, last_name, ci, password, is_active, expiration_date } = req.body;

    let password_hash;
    if (password) password_hash = await bcrypt.hash(password, 10);

    const updatedUser = await UserModel.updateUser(id, { id_role, name, last_name, ci, password_hash, is_active, expiration_date });
    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deactivateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deactivatedUser = await UserModel.deactivateUser(id);
    if (!deactivatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario desactivado", user: deactivatedUser });
  } catch (err) {
    next(err);
  }
};

export const activateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activatedUser = await UserModel.activateUser(id);
    if (!activatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario activado", user: activatedUser });
  } catch (err) {
    next(err);
  }
};

//cambiar contraseña del admin
export const changePasswordController = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const id_user = req.user.id_user; // viene del token JWT

    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "contraseña actual y nueva son requeridas" });

    if (newPassword.length < 4)
      return res.status(400).json({ error: "La nueva contraseña debe tener al menos 4 caracteres" });

    // Verificar contraseña actual
    const user = await UserModel.getUserByIdRaw(id_user);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ error: "contraseña actual incorrecta" });

    const newHash = await bcrypt.hash(newPassword, 10);
    await UserModel.changePassword(id_user, newHash);

    res.json({ message: "Contraseña actualizada. Proxima actualizacion en 90 dias." });
  } catch (err) {
    next(err);
  }
};