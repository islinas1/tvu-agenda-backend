// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import roleRoutes from "./routes/roleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import phoneRoutes from "./routes/phoneRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/phones", phoneRoutes);

// Health check
//app.get("/api/health", (req, res) => {
//  res.json({ status: "ok" });
//});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});


// cambios en package.json
//type : commonjs

// crear usuario -> 
/*
ROLE: role_id, role       ->       roles establecidos: admin [1], user [2] (default)
USER: user_id, role_id, name, lastname, ci, password_hash, expiration_date, is_active
CONTACT: contact_id, phone_id, name, institution, position, registration_date, is_active
PHONE: phone_id, id_person, phone

user default false, el admin los activa y define el tiempo de uso
*/
