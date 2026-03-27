import * as UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";

// Login por CI (y contraseña si es administrador)
export const login = async (req, res, next) => {
  try {
    const { ci, password } = req.body;

    if (!ci) return res.status(400).json({ error: "C.I es requerido" });

    const user = await UserModel.getUserByCI(ci);

    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Usuario no encontrado o inactivo" });
    }

    // usuario tipo 'usuario' (rol_id=2), no pide contraseña
    if (user.id_role === 2) {
      return res.json({ message: "Login exitoso", role: "usuario", redirect: "/contacts" });
    }

    // usuario tipo 'administrador' (rol_id=1), valida contraseña
    if (user.id_role === 1) {
      if (!password) return res.status(400).json({ error: "Contraseña requerida" });

      //const validPassword = await bcrypt.compare(password, user.password_hash);
      const validPassword = password === user.password_hash; // MODIFICAR
      if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

      return res.json({ message: "Login exitoso", role: "admin", redirect: "/admin" });
    }

    return res.status(403).json({ error: "Rol no autorizado" });

  } catch (err) {
    next(err);
  }
};

// authController.ts
export const checkCI = async (req, res, next) => {
  try {
    const { ci } = req.body;
    if (!ci) return res.status(400).json({ error: "C.I es requerido" });

    const user = await UserModel.getUserByCI(ci);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Usuario no encontrado o inactivo" });
    }

    // Devuelve solo rol y redirect
    if (user.id_role === 2) {
      return res.json({ role: "usuario", redirect: "/contacts" });
    }

    if (user.id_role === 1) {
      return res.json({ role: "admin", redirect: "/admin" });
    }

    return res.status(403).json({ error: "Rol no autorizado" });

  } catch (err) {
    next(err);
  }
};