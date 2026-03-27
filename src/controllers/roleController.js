import * as RoleModel from "../models/roleModel.js";

// Obtener todos los roles
export const getRoles = async (req, res, next) => {
  try {
    const roles = await RoleModel.getAllRoles();
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

// Obtener rol por ID
export const getRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await RoleModel.getRoleById(id);
    if (!role) return res.status(404).json({ error: "Rol no encontrado" });
    res.json(role);
  } catch (err) {
    next(err);
  }
};

// Crear un rol
export const createRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || role.trim() === "") return res.status(400).json({ error: "El nombre del rol es requerido" });

    const newRole = await RoleModel.createRole(role.trim());
    res.status(201).json(newRole);
  } catch (err) {
    next(err);
  }
};

// Actualizar un rol
export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || role.trim() === "") return res.status(400).json({ error: "El nombre del rol es requerido" });

    const updatedRole = await RoleModel.updateRole(id, role.trim());
    if (!updatedRole) return res.status(404).json({ error: "Rol no encontrado" });

    res.json(updatedRole);
  } catch (err) {
    next(err);
  }
};

// Eliminar un rol
export const deleteRoleController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar si hay usuarios asociados a este rol antes de eliminar
    const usersResult = await pool.query(
      "SELECT * FROM users WHERE id_role=$1",
      [id]
    );
    if (usersResult.rows.length > 0) {
      return res.status(400).json({ error: "No se puede eliminar un rol que tiene usuarios asociados" });
    }

    const deletedRole = await RoleModel.deleteRole(id);
    if (!deletedRole) return res.status(404).json({ error: "Rol no encontrado" });

    res.json({ message: "Rol eliminado correctamente", deletedRole });
  } catch (err) {
    next(err);
  }
};