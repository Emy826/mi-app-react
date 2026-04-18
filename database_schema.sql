-- Código SQL para crear la tabla 'prospectos' en Supabase

CREATE TABLE IF NOT EXISTS prospectos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(10) NOT NULL,
  carrera VARCHAR(100),
  escuela VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Políticas de Seguridad (RLS - Row Level Security)
-- Esto permite que la página web inserte datos sin necesidad de un usuario logueado
ALTER TABLE prospectos ENABLE ROW LEVEL SECURITY;

-- Política para permitir que cualquiera pueda insertar datos
CREATE POLICY "Permitir insertar a usuarios anónimos" 
ON prospectos 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir que cualquiera pueda leer datos (Opcional, útil para ver si se guardaron)
CREATE POLICY "Permitir leer a usuarios anónimos" 
ON prospectos 
FOR SELECT 
USING (true);
