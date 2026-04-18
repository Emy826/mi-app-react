# 🚀 Migración XAMPP a Neon - Setup Completo

Tu aplicación ha sido configurada para guardar registros en **Neon PostgreSQL** en lugar de XAMPP.

## 📋 Estructura del Proyecto

```
my-react-app/
├── src/                    # Frontend React
│   ├── main.jsx           # Formulario actualizado
│   └── ...
├── server/                # Backend Node.js/Express
│   ├── server.js          # API del servidor
│   ├── init-db.js         # Inicializador de BD
│   ├── .env               # Credenciales de Neon
│   ├── package.json
│   └── setup.ps1          # Script de configuración
├── package.json           # Dependencies del frontend
└── README.md             # Este archivo
```

## 🔧 PASOS PARA CONFIGURAR (5-10 minutos)

### 1️⃣ Crear Base de Datos en Neon

1. Ve a **https://neon.tech**
2. **Crea una cuenta** (es gratis)
3. **Crea un nuevo proyecto** - selecciona PostgreSQL
4. Una vez creado, ve a **"Connection string"**
5. **Copia la URL PostgreSQL completa** (será algo como):
   ```
   postgresql://user:password@ep-xxxxx.region.neon.tech/neondb?sslmode=require
   ```

### 2️⃣ Configurar el Servidor

Abre PowerShell en la carpeta `server/` y ejecuta:

```powershell
# Opción 1: Script automático (Recomendado)
.\setup.ps1
```

Luego pega la URL de Neon que copiaste. El servidor se iniciará automáticamente.

**O manual:**

```powershell
# Edita el archivo .env
notepad .env
# Pega la URL en DATABASE_URL=

# Inicializa la BD
npm run init-db

# Inicia el servidor
npm run dev
```

### 3️⃣ Iniciar el Frontend

En otra terminal (en la carpeta raíz `my-react-app`):

```bash
npm run dev
```

Abre el navegador en http://localhost:5173

## ✅ Verificar que Todo Funciona

1. **Backend corriendo:** http://localhost:5000/api/health
2. **Frontend corriendo:** http://localhost:5173
3. **Completa el formulario** y verifica que:
   - Aparezca el mensaje "✅ Registro guardado con éxito en Neon"
   - Te redirige automáticamente después de 2 segundos

## 📊 Ver los Datos Guardados

Para ver todos los registros en Neon:

1. Opción A: En el navegador, ve a http://localhost:5000/api/prospectos
2. Opción B: En Neon dashboard → SQL Editor → Query los datos

## 🆘 Troubleshooting

| Problema | Solución |
|----------|----------|
| "Error de conexión" | Verifica que la URL en `.env` es correcta |
| "Puerto 6432" o timeout | Si tu URL usa `:6432`, cámbiala a `:5432` en `.env` |
| "Puerto 5000 en uso" | Cambia el PORT en `.env` a 5001 o similar |
| "CORS error" | El backend ya está configurado con CORS |
| "Base de datos vacía" | Ejecuta `npm run init-db` para crear la tabla |

## 📝 Cambios Realizados

- ✅ Migrada base de datos de MySQL (XAMPP) a PostgreSQL (Neon)
- ✅ Frontend React actualizado con fetch en lugar de formulario HTML
- ✅ Backend Express creado para conectarse a Neon
- ✅ Validación de datos añadida
- ✅ Mensajes de error/éxito en tiempo real
- ✅ Auto-recarga después de guardar registro

## 🎯 Próximos Pasos

Después de verificar que todo funciona:

1. **Para producción:** Deploy en Vercel o Heroku
2. **Base de datos:** Los datos en Neon son persistentes
3. **Escalar:** Neon permite hasta 10 ramas de proyecto gratis

---

**¿Necesitas ayuda?** Revisar los archivos:
- [server/NEON_SETUP.md](server/NEON_SETUP.md) - Guía de Neon
- [server/server.js](server/server.js) - Código del backend
- [src/main.jsx](src/main.jsx) - Código del frontend
