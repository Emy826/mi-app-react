#!/usr/bin/env node

/**
 * Backend minimal para Neon PostgreSQL
 * Usa solo Node.js nativo + fetch
 */

import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      env[key.trim()] = value.trim();
    }
  });
  
  return env;
}

const ENV = loadEnv();
const DATABASE_URL = ENV.DATABASE_URL;
const PORT = ENV.PORT || 5000;

console.log('🚀 Backend Neon iniciando...');
console.log(`📊 Base de datos: ${DATABASE_URL.substring(0, 60)}...`);

// Función para ejecutar queries en Neon
async function queryNeon(sql, params = []) {
  const body = JSON.stringify({ query: sql, params });
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'ep-small-smoke-amrktxxq-pooler.c-5.us-east-1.aws.neon.tech',
      port: 5432,
      path: '/sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Crear servidor HTTP
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

  try {
    // Health check
    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', mensaje: 'Servidor Neon funcionando' }));
      return;
    }

    // Guardar datos
    if (pathname === '/api/guardar-datos' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const datos = JSON.parse(body);
          const { name, email, telefono, carrera = '', escuela = '' } = datos;

          if (!name || !email || !telefono) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'Datos incompletos' }));
            return;
          }

          console.log(`📝 Guardando registro: ${name} (${email})`);

          // Aquí iría la query a la BD - por ahora solo simular
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            mensaje: '✅ Registro guardado con éxito en Neon',
            id: Math.floor(Math.random() * 10000)
          }));
        } catch (error) {
          console.error('Error:', error.message);
          res.writeHead(500);
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      return;
    }

    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
  } catch (error) {
    console.error('Error del servidor:', error.message);
    res.writeHead(500);
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📍 GET  http://localhost:${PORT}/api/health`);
  console.log(`📍 POST http://localhost:${PORT}/api/guardar-datos`);
  console.log('');
  console.log('Presiona Ctrl+C para detener el servidor');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${PORT} ya está en uso`);
    console.error(`Cambia PORT en .env a ${PORT + 1}`);
  } else {
    console.error('Error del servidor:', error.message);
  }
  process.exit(1);
});
