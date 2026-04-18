import http from 'http';
import url from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

function normalizeDatabaseUrl(urlString) {
  if (!urlString) return urlString;
  return urlString.replace(':6432', ':5432');
}

const pool = new Pool({
  connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL),
});

pool.on('connect', () => {
  console.log('✅ Conectado a Neon PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error:', err);
});

// Crear tabla al iniciar
async function initTable() {
  try {
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
    console.log('✅ Tabla verificada/creada');
  } catch (error) {
    console.error('Error creando tabla:', error);
  }
}

initTable();

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Health check
  if (pathname === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', mensaje: 'Servidor funcionando' }));
    return;
  }

  // Guardar datos
  if (pathname === '/api/guardar-datos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const datos = JSON.parse(body);
        const { name, email, telefono, carrera = '', escuela = '' } = datos;

        if (!name || !email || !telefono) {
          res.writeHead(400);
          res.end(JSON.stringify({ 
            success: false, 
            error: 'Nombre, email y teléfono son requeridos' 
          }));
          return;
        }

        const result = await pool.query(
          'INSERT INTO prospectos (nombre, email, telefono, carrera, escuela) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [name, email, telefono, carrera, escuela]
        );

        res.writeHead(200);
        res.end(JSON.stringify({ 
          success: true, 
          mensaje: 'Registro guardado con éxito en Neon',
          id: result.rows[0].id 
        }));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
    return;
  }

  // Obtener prospectos
  if (pathname === '/api/prospectos' && req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM prospectos ORDER BY created_at DESC');
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: result.rows }));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
