// -------- CONFIGURACIÓN FIREBASE --------
const firebaseConfig = {
  apiKey: "AIzaSyC0TMmqqIyH8GCt9FXbqbFv3zwJQncW4AQ",
  authDomain: "control-de-viajes-mixers.firebaseapp.com",
  databaseURL: "https://control-de-viajes-mixers-default-rtdb.firebaseio.com/",
  projectId: "control-de-viajes-mixers",
  storageBucket: "control-de-viajes-mixers.firebasestorage.app",
  messagingSenderId: "100547620302",
  appId: "1:100547620302:web:1a16d80e0132cce7a3cf9f",
  measurementId: "G-DNRQT6790F"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// -------- LOGIN --------
function login() {
    const user = document.getElementById("user").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if (user === "admin" && pass === "1234") {
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("main-screen").classList.remove("hidden");
        iniciarDia();
        escucharViajes();
    } else {
        document.getElementById("login-error").innerText = "Usuario o contraseña incorrectos";
    }
}

// -------- INICIAR DÍA --------
function iniciarDia() {
    const hoy = new Date().toISOString().slice(0, 10);
    document.getElementById("fecha").value = hoy;
}

// -------- REGISTRO DE VIAJES --------
function registrarViaje() {
    const fecha = document.getElementById("fecha").value;
    const conductor = document.getElementById("conductor").value.trim();
    const placa = document.getElementById("placa").value.trim();
    const inicioCarga = document.getElementById("inicioCarga").value;
    const finCarga = document.getElementById("finCarga").value;
    const inicioDescarga = document.getElementById("inicioDescarga").value;
    const finDescarga = document.getElementById("finDescarga").value;

    if (!fecha || !conductor || !placa || !inicioCarga || !finCarga || !inicioDescarga || !finDescarga) {
        alert("Por favor complete todos los campos.");
        return;
    }

    const viaje = { fecha, conductor, placa, inicioCarga, finCarga, inicioDescarga, finDescarga };

    // Guardar en Firebase
    db.ref('viajes').push(viaje)
      .then(() => {
        document.getElementById("conductor").value = "";
        document.getElementById("placa").value = "";
        document.getElementById("inicioCarga").value = "";
        document.getElementById("finCarga").value = "";
        document.getElementById("inicioDescarga").value = "";
        document.getElementById("finDescarga").value = "";
        console.log("Viaje registrado correctamente");
      })
      .catch((error) => {
        console.error("Error al registrar el viaje: ", error);
        alert("Error al registrar el viaje: " + error);
      });
}

// -------- ELIMINAR VIAJE --------
function eliminarViaje(key) {
    if (confirm("¿Desea eliminar este viaje?")) {
        db.ref('viajes/' + key).remove();
    }
}

// -------- ESCUCHAR VIAJES EN TIEMPO REAL --------
let viajes = [];
function escucharViajes() {
    db.ref('viajes').on('value', snapshot => {
        viajes = [];
        snapshot.forEach(child => {
            let v = child.val();
            v.key = child.key;
            viajes.push(v);
        });
        cargarViajes();
    });
}

// -------- CARGAR TABLA --------
function cargarViajes() {
    const tbody = document.querySelector("#tablaViajes tbody");
    tbody.innerHTML = "";

    let totalDia = 0;
    let totalConductores = {};

    viajes.forEach((v) => {
        totalDia++;
        totalConductores[v.conductor] = (totalConductores[v.conductor] || 0) + 1;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td data-label="Fecha">${v.fecha}</td>
            <td data-label="Conductor">${v.conductor}</td>
            <td data-label="Placa">${v.placa}</td>
            <td data-label="Inicio Carga">${v.inicioCarga}</td>
            <td data-label="Fin Carga">${v.finCarga}</td>
            <td data-label="Inicio Descarga">${v.inicioDescarga}</td>
            <td data-label="Fin Descarga">${v.finDescarga}</td>
            <td data-label="Acción"><button onclick="eliminarViaje('${v.key}')">Borrar</button></td>
        `;
        tbody.appendChild(fila);
    });

    document.getElementById("totalDia").innerText = totalDia;

    const lista = document.getElementById("totalConductores");
    lista.innerHTML = "";
    Object.keys(totalConductores).forEach(c => {
        lista.innerHTML += `<li>${c}: ${totalConductores[c]} viajes</li>`;
    });
}

// -------- EXPORTAR EXCEL --------
function exportarExcel() {
    let csv = "Fecha,Conductor,Placa,InicioCarga,FinCarga,InicioDescarga,FinDescarga\n";
    viajes.forEach(v => {
        csv += `"${v.fecha}","${v.conductor}","${v.placa}","${v.inicioCarga}","${v.finCarga}","${v.inicioDescarga}","${v.finDescarga}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
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
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}
