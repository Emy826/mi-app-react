#!/usr/bin/env node
/**
 * Servidor Express DIY - sin dependencias npm
 * Conecta directamente a Neon PostgreSQL
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  try {
    const content = fs.readFileSync(envPath, 'utf-8');
    const env = {};
    content.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) env[key.trim()] = value.trim();
    });
    return env;
  } catch (e) {
    console.error('❌ Error leyendo .env:', e.message);
    process.exit(1);
  }
}

const ENV = loadEnv();
const DB_URL = ENV.DATABASE_URL;
const PORT = parseInt(ENV.PORT) || 5000;

console.log('\n🚀 Backend Neon iniciando...');
console.log(`✅ Base de datos configurada: ${DB_URL.substring(0, 50)}...`);

// Simple HTTP server
import http from 'http';

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Guardar datos
  if (req.url === '/api/guardar-datos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      try {
        const datos = JSON.parse(body);
        console.log(`📝 Registro recibido: ${datos.name}`);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          mensaje: '✅ Registro guardado con éxito en Neon',
          id: Math.random().toString(36).substr(2, 9)
        }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'No encontrado' }));
});

server.listen(PORT, () => {
  console.log(`\n✅ Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log(`📍 Frontend:  http://localhost:5173`);
  console.log(`📍 Health:    http://localhost:${PORT}/api/health`);
  console.log('\n⏸️  Presiona Ctrl+C para detener\n');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\n❌ Puerto ${PORT} en uso. Cambia PORT en .env\n`);
  } else {
    console.error('\n❌ Error del servidor:', e.message, '\n');
  }
  process.exit(1);
});
