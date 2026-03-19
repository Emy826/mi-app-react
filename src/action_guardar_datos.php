[2:21 p.m., 27/2/2026] Pedro Uribe: import { createRoot } from 'react-dom/client'
import { useState } from 'react'

function MyForm() {
  return (
    <div className="container mt-3">
      <h3>Formulario de preregistro</h3>
      <p>Información de contacto</p>

      <form
        action="http://localhost/action_guardar_datos.php"
        method="POST"
        className="was-validated"
      >
        {/* Campo Nombre */}
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
          <div className="valid-feedback">Válido</div>
          <div className="invalid-feedback">
            Por favor captura tu nombre completo.
          </div>
        </div>

        {/* Campo Correo */}
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
          <div className="valid-feedback">Válido</div>
          <div className="invalid-feedback">
            Por favor captura un correo válido.
          </div>
        </div>

        {/* Campo Teléfono */}
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
          <div className="valid-feedback">Válido</div>
          <div className="invalid-feedback">
            Ingresa un número de 10 dígitos sin espacios ni guiones.
          </div>
        </div>

        {/* Checkbox */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="myCheck"
            name="remember"
            required
          />
          <label className="form-check-label" htmlFor="myCheck">
            I agree on blabla.
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <MyForm />
);
[2:21 p.m., 27/2/2026] Emily Nava: main
[2:21 p.m., 27/2/2026] Emily Nava: <?php    
    // 1. Configuración de conexión
    $host = "localhost";
    $user = "root"; 
    $pass = "";     
    $db   = "integradorae";

    // 2. Establecer la conexión
    $conexion = mysqli_connect($host, $user, $pass, $db, 3306);

    // Verificar conexión
    if (!$conexion) {
        die("Conexión fallida: " . mysqli_connect_error());
    }

    // 3. Recibir datos del formulario
    $nombre   = $_POST['name'];
    $correo   = $_POST['email'];
    $telefono = $_POST['telefono'];
    $carrera = $_POST['carrera'];
    $escuela = $_POST['escuela'];


    print("$nombre - $correo - $telefono");

    // 4. Consulta SQL con teléfono agregado
    $sql = "INSERT INTO prospectos (nombre, email, telefono, carrera, escuela) 
            VALUES ('$nombre', '$correo', '$telefono', '$carrera', '$escuela')";

    // 5. Ejecutar consulta
    if (mysqli_query($conexion, $sql)) {
        echo " Registro guardado con éxito.";
    } else {
        echo " Error: " . mysqli_error($conexion);
    }

    // 6. Cerrar conexión
    mysqli_close($conexion);
?>