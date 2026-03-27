import pool from "../config/db.js";

// todos los usuarios
export const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT u.id_user, u.name, u.last_name, u.ci, 
      u.expiration_date, u.is_active, r.role
    FROM users u
    JOIN role r ON u.id_role=r.id_role
    ORDER BY u.id_user`
  );
  return result.rows;
};

// usuario por ID
export const getUserById = async (id_user) => {
  const result = await pool.query(
    `SELECT u.id_user, u.name, u.last_name, u.ci, 
      u.expiration_date, u.is_active, r.role
    FROM users u
    JOIN role r ON u.id_role=r.id_role
    WHERE u.id_user=$1`,
    [id_user]
  );
  return result.rows[0];
};

// usuario por CI (login)
export const getUserByCI = async (ci) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE ci=$1",
    [ci]
  );
  return result.rows[0];
};

// crear usuario
export const createUser = async ({ id_role, name, last_name, ci, password_hash, is_active }) => {
  const result = await pool.query(
    `INSERT INTO users (id_role, name, last_name, ci, password_hash, is_active)
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [id_role, name, last_name, ci, password_hash, is_active]
  );
  return result.rows[0];
};

// actualizar usuario
export const updateUser = async (id_user, { id_role, name, last_name, ci, password_hash, is_active, expiration_date }) => {
  let query, values;
  if (password_hash) {
    query = `UPDATE users SET id_role=$1, name=$2, last_name=$3, ci=$4, password_hash=$5, is_active=$6, expiration_date=$7 WHERE id_user=$8 RETURNING *`;
    values = [id_role, name, last_name, ci, password_hash, is_active, expiration_date, id_user];
  } else {
    query = `UPDATE users SET id_role=$1, name=$2, last_name=$3, ci=$4, is_active=$5, expiration_date=$6 WHERE id_user=$7 RETURNING *`;
    values = [id_role, name, last_name, ci, is_active, expiration_date, id_user];
  }
  const result = await pool.query(query, values);
  return result.rows[0];
};

// soft delete de usuario
export const deactivateUser = async (id_user) => {
  const result = await pool.query(
    "UPDATE users SET is_active=FALSE WHERE id_user=$1 RETURNING *",
    [id_user]
  );
  return result.rows[0];
};

// validar si CI ya existe
export const ciExists = async (ci) => {
  const result = await pool.query("SELECT * FROM users WHERE ci=$1", [ci]);
  return result.rows.length > 0;
};
