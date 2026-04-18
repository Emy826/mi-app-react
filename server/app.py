from flask import Flask, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import sys
from urllib.parse import urlparse, parse_qsl
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

# Force UTF-8 output so Windows consoles do not fail on emoji or unicode logs.
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv('DATABASE_URL')
PORT = int(os.getenv('PORT', 5000))


def parse_database_url(url):
    if not url:
        raise ValueError('DATABASE_URL no está configurada')

    parsed = urlparse(url)
    if parsed.scheme not in ('postgres', 'postgresql'):
        raise ValueError('DATABASE_URL debe ser PostgreSQL')

    query = dict(parse_qsl(parsed.query))
    config = {
        'host': parsed.hostname,
        'port': parsed.port or 5432,
        'user': parsed.username,
        'password': parsed.password,
        'dbname': parsed.path.lstrip('/'),
    }
    
    if query.get('sslmode'):
        config['sslmode'] = query.get('sslmode')
    if query.get('channel_binding'):
        config['channel_binding'] = query.get('channel_binding')
    if query.get('sslrootcert'):
        config['sslrootcert'] = query.get('sslrootcert')
    
    return config


def get_db_connection():
    config = parse_database_url(DATABASE_URL)
    try:
        return psycopg2.connect(**config)
    except psycopg2.OperationalError:
        if config.get('port') == 6432:
            print('Puerto 6432 falló, reintentando con 5432...')
            config['port'] = 5432
            return psycopg2.connect(**config)
        raise


def init_db():
    """Crear tabla si no existe"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS prospectos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(60) NOT NULL,
                email VARCHAR(100) NOT NULL,
                telefono VARCHAR(10) NOT NULL,
                carrera VARCHAR(100),
                escuela VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')
        
        # Crear índices
        cur.execute('CREATE INDEX IF NOT EXISTS idx_email ON prospectos(email);')
        cur.execute('CREATE INDEX IF NOT EXISTS idx_created ON prospectos(created_at);')
        
        conn.commit()
        cur.close()
        conn.close()
        print('Tabla verificada/creada')
    except Exception as e:
        print(f'Error inicializando BD: {e}')

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'mensaje': 'Servidor funcionando'})

@app.route('/api/guardar-datos', methods=['POST', 'OPTIONS'])
def guardar_datos():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email') 
        telefono = data.get('telefono')
        carrera = data.get('carrera', '')
        escuela = data.get('escuela', '')
        
        if not name or not email or not telefono:
            return jsonify({
                'success': False,
                'error': 'Nombre, email y teléfono son requeridos'
            }), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO prospectos (nombre, email, telefono, carrera, escuela) VALUES (%s, %s, %s, %s, %s) RETURNING id',
            (name, email, telefono, carrera, escuela)
        )
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'mensaje': 'Registro guardado con éxito en Neon',
            'id': result[0]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/prospectos', methods=['GET'])
def get_prospectos():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM prospectos ORDER BY created_at DESC')
        result = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/test-neon', methods=['GET'])
def test_neon():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT 1')
        value = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({
            'success': True,
            'message': 'Conexión a Neon exitosa',
            'value': value
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    init_db()
    print(f'Servidor corriendo en http://localhost:{PORT}')
    app.run(debug=False, port=PORT, host='0.0.0.0')
