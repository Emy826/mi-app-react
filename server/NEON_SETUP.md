# Instrucciones de Configuración de Neon

## 1. Crear cuenta en Neon
- Ve a https://neon.tech
- Crea una cuenta gratuita
- Crea un nuevo proyecto

## 2. Obtener URL de conexión
- En el dashboard de Neon, ve a "Connection string"  
- Copia la URL completa que dice "PostgreSQL"

## 3. Configurar archivo .env
- Pega la URL en el archivo .env como: DATABASE_URL=<tu-url>
- Ejemplo:
  DATABASE_URL=postgresql://user:password@ep-xxxxx.region.neon.tech/dbname?sslmode=require

## 4. Iniciar el servidor
npm run dev

## 5. La base de datos se crearán automáticamente cuando se ejecute
Cuando hagas el primer registro, la tabla "prospectos" se creará automáticamente en Neon.
