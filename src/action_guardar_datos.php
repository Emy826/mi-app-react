<?php    
    // 1. CONFIGURACIÓN DE SUPABASE
    // Sustituye estos valores con los de tu proyecto (Settings -> API)
    $supabaseUrl = "https://vtvsplfxavrfbzgobuns.supabase.co"; 
    $supabaseKey = "sb_publishable_BOoLhwF0GxEUt1ij4ib84w_k_TeebkMl8";        
    $tabla = "Integradora"; 

    // 2. RECIBIR DATOS DEL FORMULARIO
    // Mapeamos los nombres que vienen de los 'name' de tus inputs en React
    $datos = [
        "nombre"   => $_POST['name'] ?? '',
        "correo"   => $_POST['email'] ?? '',
        "telefono" => $_POST['telefono'] ?? '',
        "carrera"  => $_POST['carrera'] ?? '',
        "escuela"  => $_POST['escuela'] ?? ''  // <-- Nueva columna agregada
    ];

    // 3. PREPARAR LA PETICIÓN POR cURL
    $url = $supabaseUrl . "/rest/v1/" . $tabla;
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datos));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: " . $supabaseKey,
        "Authorization: Bearer " . $supabaseKey,
        "Content-Type: application/json",
        "Prefer: return=representation"
    ]);

    // 4. EJECUTAR Y VERIFICAR
    $respuesta = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // 5. RESPUESTA AL FRONTEND (React)
    header('Content-Type: application/json'); // Indicamos que respondemos JSON

    if ($httpCode == 201 || $httpCode == 200) {
        echo json_encode([
            "success" => true, 
            "mensaje" => "Registro guardado en Supabase incluyendo la escuela."
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "error" => "Error en Supabase (Código $httpCode): " . $respuesta
        ]);
    }
?>