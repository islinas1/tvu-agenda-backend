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
      role_id: user.id_role
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
      return res.json({
        message: "Login exitoso",
        token,
        user: userData,
        role: "usuario",
        redirect: "/contacts"
      });
    }

    if (user.id_role === 1) {
      if (!password) return res.status(400).json({ error: "Contraseña requerida" });

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

      const token = generateToken(user);
      return res.json({
        message: "Login exitoso",
        token,
        user: {id_user: user.id_user, name: user.name, role_id: user.id_role},
        role: "admin",
        redirect: "/dashboard"
      });
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

    const userData = {
      id_user: user.id_user,
      name: user.name,
      role_id: user.id_role
    };

    if (user.id_role === 2) {
      const token = generateToken(user);
      return res.json({
        role: "usuario",
        redirect: "/contacts",
        token,
        user: userData
      });
    }

    if (user.id_role === 1) {
      return res.json({ role: "admin", redirect: "/dashboard" });
    }

    return res.status(403).json({ error: "Rol no autorizado" });
  } catch (err) {
    next(err);
  }
};