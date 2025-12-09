// -------- VARIABLES GLOBALES --------
let viajes = JSON.parse(localStorage.getItem("viajes")) || [];

// -------- LOGIN --------
function login() {
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    // CREDENCIALES DE EJEMPLO
    if (user === "admin" && pass === "1234") {
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("main-screen").classList.remove("hidden");
        cargarViajes(); // Carga los viajes al iniciar sesión
    } else {
        document.getElementById("login-error").innerText = "Usuario o contraseña incorrectos";
    }
}

// -------- REGISTRO DE VIAJES (Validado) --------
function registrarViaje() {
    
    // OBTENER VALORES y VALIDAR
    let inputFecha = document.getElementById("fecha").value;
    let conductor = document.getElementById("conductor").value.trim();
    let placa = document.getElementById("placa").value.trim();
    
    // Asignar la fecha de hoy si el campo está vacío
    let fechaDelViaje = inputFecha;
    if (!fechaDelViaje) {
        fechaDelViaje = new Date().toISOString().slice(0, 10);
    }
    
    // Validación estricta para evitar guardar viajes incompletos
    if (!conductor || !placa) {
        alert("¡Error! Debes completar el nombre del Conductor y la Placa antes de registrar el viaje.");
        return; // Detiene la función si faltan datos
    }
    
    let viaje = {
        fecha: fechaDelViaje,
        conductor: conductor,
        placa: placa,
        inicioCarga: document.getElementById("inicioCarga").value,
        finCarga: document.getElementById("finCarga").value,
        inicioDescarga: document.getElementById("inicioDescarga").value,
        finDescarga: document.getElementById("finDescarga").value
    };

    viajes.push(viaje);
    localStorage.setItem("viajes", JSON.stringify(viajes));

    // Limpiar campos después de registrar (opcional, para agilizar el siguiente registro)
    document.getElementById("conductor").value = "";
    document.getElementById("placa").value = "";
    document.getElementById("inicioCarga").value = "";
    document.getElementById("finCarga").value = "";
    document.getElementById("inicioDescarga").value = "";
    document.getElementById("finDescarga").value = "";

    cargarViajes(); // Vuelve a cargar y actualiza la tabla y los contadores
}

// ---- CARGAR TABLA Y CONTADORES ----
function cargarViajes() {
    let tbody = document.querySelector("#tablaViajes tbody");
    tbody.innerHTML = "";

    let fechaHoy = new Date().toISOString().slice(0, 10);

    let totalDia = 0;
    let totalConductores = {};

    viajes.forEach(v => {
        // Solo cuenta y muestra los viajes cuya fecha coincide con la de hoy
        if (v.fecha === fechaHoy) {
            totalDia++;

            if (!totalConductores[v.conductor]) {
                totalConductores[v.conductor] = 0;
            }
            totalConductores[v.conductor]++;

            let fila = `
                <tr>
                    <td>${v.fecha}</td>
                    <td>${v.conductor}</td>
                    <td>${v.placa}</td>
                    <td>${v.inicioCarga}</td>
                    <td>${v.finCarga}</td>
                    <td>${v.inicioDescarga}</td>
                    <td>${v.finDescarga}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        }
    });

    // 🏆 ACTUALIZACIÓN DEL CONTADOR DE HOY (clave para WhatsApp)
    document.getElementById("totalDia").innerText = totalDia;

    // Actualización de totales por conductor
    let lista = document.getElementById("totalConductores");
    lista.innerHTML = "";

    Object.keys(totalConductores).forEach(c => {
        lista.innerHTML += `<li>${c}: ${totalConductores[c]} viajes</li>`;
    });

    // Cálculo del total general (de todos los viajes guardados, sin importar la fecha)
    let totalGeneral = viajes.length; // Cambiado para contar todos los viajes en localStorage
    document.getElementById("totalGeneral").innerText = totalGeneral;
}

// -------- EXPORTAR EXCEL --------
function exportarExcel() {
    let csv = "Fecha,Conductor,Placa,InicioCarga,FinCarga,InicioDescarga,FinDescarga\n";

    viajes.forEach(v => {
        csv += `${v.fecha},${v.conductor},${v.placa},${v.inicioCarga},${v.finCarga},${v.inicioDescarga},${v.finDescarga}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "viajes.csv";
    a.click();
}

// -------- WHATSAPP (Sin cambios, ya estaba correcto) --------
function compartirWhatsApp() {
    // ⚠️ Asegúrate de llamar a cargarViajes() justo antes de esto si dudas de que el contador esté actualizado
    let fechaHoy = new Date().toISOString().slice(0, 10);
    // Obtiene el número que se muestra en pantalla
    let totalDia = document.getElementById("totalDia").innerText; 
    let mensaje = `Total de viajes del día ${fechaHoy}: ${totalDia}`;

    let url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}
