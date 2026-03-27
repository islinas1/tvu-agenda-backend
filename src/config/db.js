// src/config/db.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env (¡muy importante!)
dotenv.config();

// Validamos que existan las variables críticas
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Faltan variables de entorno para la base de datos:');
  missingVars.forEach(v => console.error(`  - ${v}`));
  process.exit(1);
}

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Recomendado en producción / entornos con muchas conexiones
  max:              20,          // máximo de conexiones en el pool
  idleTimeoutMillis: 30000,      // cerrar conexiones inactivas después de 30s
  connectionTimeoutMillis: 2000, // timeout si no conecta en 2 segundos
  allowExitOnIdle:  true,

  // Opcional: ssl en producción ( Railway, Render, Supabase, Neon, Fly.io, etc.)
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Para debugging en desarrollo (opcional)
if (process.env.NODE_ENV !== 'production') {
  pool.on('connect', () => {
    console.log('→ Nueva conexión al pool de PostgreSQL');
  });

  pool.on('error', (err, client) => {
    console.error('Error en el pool de conexiones:', err.message);
  });
}

// Prueba de conexión al iniciar (buena práctica)
pool.connect()
  .then(client => {
    console.log('PostgreSQL conectado exitosamente');
    client.release();
  })
  .catch(err => {
    console.error('Error al conectar a PostgreSQL:');
    console.error(err.stack);
    process.exit(1);
  });

export default pool;