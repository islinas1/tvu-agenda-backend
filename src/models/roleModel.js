import pool from "../config/db.js";

// Obtener todos los roles
export const getAllRoles = async () => {
  const result = await pool.query("SELECT * FROM role ORDER BY id_role");
  return result.rows;
};

// Obtener un rol por ID
export const getRoleById = async (id_role) => {
  const result = await pool.query("SELECT * FROM role WHERE id_role=$1", [id_role]);
  return result.rows[0];
};

// Crear un rol
export const createRole = async (roleName) => {
  const result = await pool.query(
    "INSERT INTO role (role) VALUES ($1) RETURNING *",
    [roleName]
  );
  return result.rows[0];
};

// Actualizar un rol
export const updateRole = async (id_role, roleName) => {
  const result = await pool.query(
    "UPDATE role SET role=$1 WHERE id_role=$2 RETURNING *",
    [roleName, id_role]
  );
  return result.rows[0];
};

// Eliminar un rol
export const deleteRole = async (id_role) => {
  const result = await pool.query(
    "DELETE FROM role WHERE id_role=$1 RETURNING *",
    [id_role]
  );
  return result.rows[0];
};
