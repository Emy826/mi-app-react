import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

function normalizeDatabaseUrl(urlString) {
  if (!urlString) return urlString;
  return urlString.replace(':6432', ':5432');
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL),
});

async function initDatabase() {
  try {
    console.log('🔄 Inicializando base de datos en Neon...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prospectos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(60) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(10) NOT NULL,
        carrera VARCHAR(100),
        escuela VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Tabla "prospectos" creada/verificada en Neon');
    
    // Agregar índices para mejorar búsquedas
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_email ON prospectos(email);
      CREATE INDEX IF NOT EXISTS idx_created ON prospectos(created_at);
    `);
    
    console.log('✅ Índices creados');
    
    await pool.end();
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
    process.exit(1);
  }
}

initDatabase();
