import pool from "../config/db.js";

// todos los contactos
export const getAllContacts = async () => {
  const result = await pool.query(
    `SELECT c.id_contact, c.contact_name, c.contact_institution, c.contact_position, c.description, c.is_active, c.created_by, 
      json_agg(
        json_build_object( 'phone', p.phone, 'is_active', p.is_active, 'registration_date', p.registration_date)
      ) AS phones
    FROM contact c
    LEFT JOIN phone p ON c.id_contact = p.id_contact
    GROUP BY c.id_contact
    ORDER BY c.id_contact;`
  );
  return result.rows;
};

// contacto por ID - INNECESARIO
/*
export const getContactById = async (id_contact) => {
 const result = await pool.query(
    `SELECT c.id_contact, c.contact_name, c.contact_institution, contact_position, 
      c.description, c.is_active, c.created_by, p.phone
    FROM contact c
    JOIN phone p ON c.id_contact=p.id_contact
    WHERE c.id_contact=$1`,
   [id_contact]
 );
 return result.rows[0];
};
*/

// crear contacto
export const createContact = async ({ contact_name, contact_institution, contact_position, description, created_by }) => {
  const result = await pool.query(
    `INSERT INTO contact
    (contact_name, contact_institution, contact_position, description, created_by)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [contact_name, contact_institution, contact_position, description, created_by]
  );
  return result.rows[0];
};

// actualizar contacto
export const updateContact = async (id_contact, { contact_name, contact_institution, contact_position, description, is_active }) => {
  const result = await pool.query(
    `UPDATE contact
    SET contact_name=$1, contact_institution=$2, contact_position=$3, description=$4, is_active=$5
    WHERE id_contact=$6
    RETURNING *`,
    [contact_name, contact_institution, contact_position, description, is_active, id_contact]
  );
  return result.rows[0];
};

// desactivar contacto
export const deactivateContact = async (id_contact) => {
  const result = await pool.query(
    "UPDATE contact SET is_active=FALSE WHERE id_contact=$1 RETURNING *",
    [id_contact]
  );
  return result.rows[0];
};

// eliminar contacto
export const deleteContact = async (id_contact) => {
  const result = await pool.query(
    "DELETE FROM contact WHERE id_contact=$1 RETURNING *",
    [id_contact]
  );
  return result.rows[0];
};
