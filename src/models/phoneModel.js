import pool from "../config/db.js";

// todos los teléfonos
export const getAllPhones = async () => {
  const result = await pool.query(
    `SELECT p.id_phone, p.id_contact, p.phone, p.registration_date, p.is_active
    FROM phone p
    ORDER BY p.id_phone`
  );
  return result.rows;
};

// Obtener teléfono por ID - INNECESARIO
/*
export const getPhoneById = async (id_phone) => {
 const result = await pool.query(
   `SELECT ph.id_phone, ph.number, ph.is_active, ph.id_person, ph.id_institution,
           p.name AS person_name,
           i.institution_name
    FROM phone ph
    LEFT JOIN person p ON ph.id_person = p.id_person
    LEFT JOIN institution i ON ph.id_institution = i.id_institution
    WHERE ph.id_phone=$1`,
   [id_phone]
 );
 return result.rows[0];
};
*/

// crear teléfono
export const createPhone = async ({ id_contact, phone }) => {
  const result = await pool.query(
    `INSERT INTO phone (id_contact, phone, registration_date, is_active)
    VALUES ($1, $2, CURRENT_TIMESTAMP, TRUE)
    RETURNING *`,
    [id_contact, phone]
  );
  return result.rows[0];
};

// actualizar teléfono
export const updatePhone = async (id_phone, { phone, is_active }) => {
  const result = await pool.query(
    `UPDATE phone
    SET phone=$1, is_active=$2, registration_date=CURRENT_TIMESTAMP
    WHERE id_phone=$3
    RETURNING *`,
    [phone, is_active, id_phone]
  );
  return result.rows[0];
};

// desactivar teléfono
export const deactivatePhone = async (id_phone) => {
  const result = await pool.query(
    "UPDATE phone SET is_active=FALSE WHERE id_phone=$1 RETURNING *",
    [id_phone]
  );
  return result.rows[0];
};

// eliminar teléfono
export const deletePhone = async (id_phone) => {
  const result = await pool.query(
    "DELETE FROM phone WHERE id_phone=$1 RETURNING *",
    [id_phone]
  );
  return result.rows[0];
};
