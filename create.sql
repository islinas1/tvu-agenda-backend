-- new version

CREATE TABLE role (
    id_role SERIAL PRIMARY KEY,
    role VARCHAR(25) NOT NULL
);

CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    id_role INT NOT NULL,
	name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
    ci INT NOT NULL UNIQUE,
    password_hash TEXT,
	expiration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_user_role
        FOREIGN KEY (id_role) REFERENCES role(id_role)
);

CREATE TABLE contact (
    id_contact SERIAL PRIMARY KEY,
	contact_name VARCHAR(255) NOT NULL,
	contact_institution VARCHAR(255),
    contact_position VARCHAR(255),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INT NOT NULL,

    CONSTRAINT fk_contact_user
        FOREIGN KEY (created_by) REFERENCES users(id_user)
);

CREATE TABLE phone (
    id_phone SERIAL PRIMARY KEY,
	id_contact INT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

	CONSTRAINT fk_phone_contact
		FOREIGN KEY (id_contact) REFERENCES contact(id_contact)
);

CREATE INDEX idx_contact_active ON contact(is_active);
CREATE INDEX idx_phone_active ON phone(is_active);
