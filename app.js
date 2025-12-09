// -------- LOGIN --------
function login() {
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    if (user === "admin" && pass === "1234") {
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("main-screen").classList.remove("hidden");
        cargarViajes();
    } else {
        document.getElementById("login-error").innerText = "Usuario o contraseña incorrectos";
    }
}

// -------- REGISTRO DE VIAJES --------
let viajes = JSON.parse(localStorage.getItem("viajes")) || [];

function registrarViaje() {
    let viaje = {
        fecha: document.getElementById("fecha").value,
        conductor: document.getElementById("conductor").value,
        placa: document.getElementById("placa").value,
        inicioCarga: document.getElementById("inicioCarga").value,
        finCarga: document.getElementById("finCarga").value,
        inicioDescarga: document.getElementById("inicioDescarga").value,
        finDescarga: document.getElementById("finDescarga").value
    };

    viajes.push(viaje);
    localStorage.setItem("viajes", JSON.stringify(viajes));

    cargarViajes();
}

// ---- CARGAR TABLA ----
function cargarViajes() {
    let tbody = document.querySelector("#tablaViajes tbody");
    tbody.innerHTML = "";

    let fechaHoy = new Date().toISOString().slice(0, 10);

    let totalDia = 0;
    let totalConductores = {};

    viajes.forEach(v => {
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

    document.getElementById("totalDia").innerText = totalDia;

    let lista = document.getElementById("totalConductores");
    lista.innerHTML = "";

    Object.keys(totalConductores).forEach(c => {
        lista.innerHTML += `<li>${c}: ${totalConductores[c]} viajes</li>`;
    });

    let totalGeneral = Object.values(totalConductores).reduce((a, b) => a + b, 0);
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

// -------- WHATSAPP --------
function compartirWhatsApp() {
    let fechaHoy = new Date().toISOString().slice(0, 10);
    let totalDia = document.getElementById("totalDia").innerText;
    let mensaje = `Total de viajes del día ${fechaHoy}: ${totalDia}`;

    let url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}