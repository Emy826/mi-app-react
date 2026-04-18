from dotenv import load_dotenv
import os
import psycopg2
import urllib.parse as u

load_dotenv()
url = os.getenv('DATABASE_URL')
print('URL=', url)
parsed = u.urlparse(url)
print('host=', parsed.hostname, 'port=', parsed.port)

try:
    conn = psycopg2.connect(url, connect_timeout=5)
    print('CONNECTED')
    conn.close()
except Exception:
    if url and ':6432' in url:
        alt_url = url.replace(':6432', ':5432')
        print('Retrying with port 5432:', alt_url)
        try:
            conn = psycopg2.connect(alt_url, connect_timeout=5)
            print('CONNECTED 5432')
            conn.close()
        except Exception:
            import traceback
            traceback.print_exc()
    else:
        import traceback
        traceback.print_exc()
