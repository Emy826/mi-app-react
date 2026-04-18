import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import logo from '../utzac.jpg'

function MyForm() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!e.target.checkValidity()) {
      e.target.classList.add('was-validated');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const formData = new FormData(e.target);
      const datos = {
        name: formData.get('name'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        escuela: formData.get('escuela'),
        carrera: formData.get('carrera'),
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/guardar-datos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTipoMensaje('success');
        setMensaje('✅ ' + result.mensaje);
        e.target.reset();
        e.target.classList.remove('was-validated');
        // Recargar la página después de 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setTipoMensaje('danger');
        setMensaje('❌ Error: ' + (result.error || 'No se pudo guardar'));
      }
    } catch (error) {
      setTipoMensaje('danger');
      setMensaje('❌ Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container-fluid">

          {/* LOGO */}
          <a className="navbar-brand" href="#">
            <img src={logo} alt="UTZAC" style={{height:"45px"}} />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="collapsibleNavbar">

            {/* LINKS */}
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Inicio</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">Carreras</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">Contacto</a>
              </li>
            </ul>

            {/* BUSCADOR */}
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="text"
                placeholder="Buscar..."
              />
              <button className="btn btn-success" type="submit">
                Buscar
              </button>
            </form>

          </div>
        </div>
      </nav>

      {/* FORMULARIO */}
      <div className="container mt-3">
        <h3>Formulario de preregistro</h3>
        <p>Información de contacto</p>

        {mensaje && (
          <div className={`alert alert-${tipoMensaje} alert-dismissible fade show`} role="alert">
            {mensaje}
            <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="was-validated"
          noValidate
        >

          <div className="mb-3 mt-3">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Captura tu nombre completo"
              name="name"
              minLength="5"
              maxLength="60"
              pattern="[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Captura tu correo electrónico"
              name="email"
              maxLength="100"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="tel"
              className="form-control"
              id="telefono"
              placeholder="Captura tu número de teléfono"
              name="telefono"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Selecciona tu escuela de procedencia:
            </label>

            <select
              className="form-select"
              name="escuela"
              required
            >
              <option value="">Selecciona la escuela</option>
              <option value="CETIS 113">CETIS 113</option>
              <option value="CONALEP">CONALEP</option>
              <option value="CBT 188">CBT 188</option>
              <option value="UAZ">UAZ</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Selecciona la carrera que te interesa:
            </label>

            <select
              className="form-select"
              name="carrera"
              required
            >
              <option value="">Selecciona la carrera</option>
              <option value="Tecnologías de la Información">Tecnologías de la Información</option>
              <option value="Mecatrónica">Mecatrónica</option>
              <option value="Energías renovables">Energías renovables</option>
              <option value="Terapia Física">Terapia Física</option>
              <option value="Procesos Industriales">Procesos Industriales</option>
              <option value="Minas">Minas</option>
              <option value="Mantenimiento Industrial">Mantenimiento Industrial</option>
              <option value="Negocios">Negocios</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
            </select>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="myCheck"
              required
            />
            <label className="form-check-label">
              Acepto los términos.
            </label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Enviar'}
          </button>

        </form>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <MyForm />
)
