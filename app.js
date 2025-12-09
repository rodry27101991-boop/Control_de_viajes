// -------- LOGIN --------
function login() {
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    if (user === "admin" && pass === "1234") {
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("main-screen").classList.remove("hidden");
        iniciarDia();
    } else {
        document.getElementById("login-error").innerText = "Usuario o contraseña incorrectos";
    }
}

// -------- INICIAR DÍA --------
let viajes = [];
function iniciarDia() {
    let hoy = new Date().toISOString().slice(0, 10);
    document.getElementById("fecha").value = hoy;
    cargarViajes(); // inicia tabla vacía
}

// -------- REGISTRO DE VIAJES --------
function registrarViaje() {
    let fecha = document.getElementById("fecha").value;
    let conductor = document.getElementById("conductor").value.trim();
    let placa = document.getElementById("placa").value.trim();
    let inicioCarga = document.getElementById("inicioCarga").value;
    let finCarga = document.getElementById("finCarga").value;
    let inicioDescarga = document.getElementById("inicioDescarga").value;
    let finDescarga = document.getElementById("finDescarga").value;

    if (!fecha || !conductor || !placa || !inicioCarga || !finCarga || !inicioDescarga || !finDescarga) {
        alert("Por favor complete todos los campos.");
        return;
    }

    let viaje = { fecha, conductor, placa, inicioCarga, finCarga, inicioDescarga, finDescarga };
    viajes.push(viaje);

    cargarViajes();
}

// -------- ELIMINAR VIAJE --------
function eliminarViaje(index) {
    if (confirm("¿Desea eliminar este viaje?")) {
        viajes.splice(index, 1);
        cargarViajes();
    }
}

// -------- CARGAR TABLA --------
function cargarViajes() {
    let tbody = document.querySelector("#tablaViajes tbody");
    tbody.innerHTML = "";

    let totalDia = 0;
    let totalConductores = {};

    viajes.forEach((v, i) => {
        totalDia++;
        totalConductores[v.conductor] = (totalConductores[v.conductor] || 0) + 1;

        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${v.fecha}</td>
            <td>${v.conductor}</td>
            <td>${v.placa}</td>
            <td>${v.inicioCarga}</td>
            <td>${v.finCarga}</td>
            <td>${v.inicioDescarga}</td>
            <td>${v.finDescarga}</td>
            <td><button onclick="eliminarViaje(${i})">Borrar</button></td>
        `;
        tbody.appendChild(fila);
    });

    document.getElementById("totalDia").innerText = totalDia;

    let lista = document.getElementById("totalConductores");
    lista.innerHTML = "";
    Object.keys(totalConductores).forEach(c => {
        lista.innerHTML += `<li>${c}: ${totalConductores[c]} viajes</li>`;
    });
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

// -------- WHATSAPP --------
function compartirWhatsApp() {
    let mensaje = "Viajes registrados hoy:\n";
    viajes.forEach(v => {
        mensaje += `${v.fecha} - ${v.conductor} - ${v.placa}\n`;
    });
    let url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}
