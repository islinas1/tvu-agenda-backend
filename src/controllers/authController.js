import * as UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id_user: user.id_user,
      ci: user.ci,
      name: user.name,
      last_name: user.last_name,
      role: user.id_role === 1 ? "admin" : "usuario"
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
};

export const login = async (req, res, next) => {
  try {
    const { ci, password } = req.body;
    if (!ci) return res.status(400).json({ error: "C.I es requerido" });

    const user = await UserModel.getUserByCI(ci);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Usuario no encontrado o inactivo" });
    }

    if (user.id_role === 2) {
      const token = generateToken(user);
      return res.json({ message: "Login exitoso", role: "usuario", redirect: "/contacts", token });
    }

    if (user.id_role === 1) {
      if (!password) return res.status(400).json({ error: "Contrasena requerida" });

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) return res.status(401).json({ error: "Contrasena incorrecta" });

      const token = generateToken(user);
      // CORREGIDO: redirige a /dashboard en vez de /contacts
      return res.json({ message: "Login exitoso", role: "admin", redirect: "/dashboard", token });
    }

    return res.status(403).json({ error: "Rol no autorizado" });
  } catch (err) {
    next(err);
  }
};

export const checkCI = async (req, res, next) => {
  try {
    const { ci } = req.body;
    if (!ci) return res.status(400).json({ error: "C.I es requerido" });

    const user = await UserModel.getUserByCI(ci);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Usuario no encontrado o inactivo" });
    }

    if (user.id_role === 2) {
      const token = generateToken(user);
      return res.json({ role: "usuario", redirect: "/contacts", token });
    }

    if (user.id_role === 1) {
      return res.json({ role: "admin", redirect: "/admin" });
    }

    return res.status(403).json({ error: "Rol no autorizado" });
  } catch (err) {
    next(err);
  }
};