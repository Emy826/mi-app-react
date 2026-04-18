# Script para configurar todo automáticamente

Write-Host "================================" -ForegroundColor Cyan
Write-Host "CONFIGURADOR DE NEON" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script te ayudará a configurar tu base de datos en Neon" -ForegroundColor Yellow
Write-Host ""

# Solicitar URL de conexión
Write-Host "Pasos previos:" -ForegroundColor Green
Write-Host "1. Ve a https://neon.tech y crea una cuenta"
Write-Host "2. Crea un nuevo proyecto" 
Write-Host "3. Copia la URL de conexión PostgreSQL"
Write-Host ""

$databaseUrl = Read-Host "Pega aquí la URL de conexión de Neon"

if ($databaseUrl -eq "") {
  Write-Host "❌ URL vacía. Abortando..." -ForegroundColor Red
  exit
}

# Guardar en .env
$envContent = @"
DATABASE_URL=$databaseUrl
PORT=5000
"@

$envPath = ".env"
Set-Content -Path $envPath -Value $envContent -Encoding UTF8

Write-Host "✅ URL guardada en .env" -ForegroundColor Green
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "INICIANDO SERVIDOR..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "El servidor estará disponible en: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor
npm run dev
