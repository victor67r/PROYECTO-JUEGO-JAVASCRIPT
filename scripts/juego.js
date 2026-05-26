// ============================
// MUSICA
// ============================

function toggleMusica() {
  const musica = document.getElementById("musicaFondo");
  const boton = document.getElementById("botonMusica");

  if (musica.muted) {
    musica.muted = false;
    boton.textContent = "🔊";
  } else {
    musica.muted = true;
    boton.textContent = "🔇";
  }
}

// ============================
// RANKING
// ============================

let rankingVisible = false;

function toggleRanking() {
  let contenedor = document.getElementById("rankingInicio");
  rankingVisible = !rankingVisible;

  if (rankingVisible) {
    contenedor.style.display = "block";
    cargarRankingInicio();
  } else {
    contenedor.style.display = "none";
  }
}

function cargarRankingInicio() {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  let lista = document.getElementById("listaRanking");

  lista.innerHTML = "";

  ranking.sort((a, b) => b.puntos - a.puntos);

  for (let i = 0; i < Math.min(5, ranking.length); i++) {
    let li = document.createElement("li");
    li.textContent = ranking[i].usuario + " - " + ranking[i].puntos + " pts";
    lista.appendChild(li);
  }
}

// ============================
// USUARIO
// ============================

let nombreUsuario = "";
let puntuacion = 0;

function mostrarModalUsuario() {
  document.getElementById("modalUsuario").style.display = "flex";
}

function guardarUsuario() {
  let input = document.getElementById("inputUsuario").value.trim();

  if (input === "") {
    alert("Introduce un nombre");
    return;
  }

  nombreUsuario = input;
  document.getElementById("hudUsuario").innerHTML = nombreUsuario;

  document.getElementById("modalUsuario").style.display = "none";

  mostrarInstrucciones();
}

// ============================
// INSTRUCCIONES
// ============================

let indiceFrase = 0;

function mostrarInstrucciones() {
  document.getElementById("pantallaInicio").style.display = "none";

  let pantalla = document.getElementById("pantallaInstrucciones");
  pantalla.style.display = "flex";

  let frases = document.getElementsByClassName("instruccion");

  for (let i = 0; i < frases.length; i++) {
    frases[i].style.opacity = 0;
  }

  indiceFrase = 0;
  mostrarSiguienteFrase();
}

function mostrarSiguienteFrase() {
  let frases = document.getElementsByClassName("instruccion");

  if (indiceFrase < frases.length) {
    frases[indiceFrase].style.opacity = 1;
    indiceFrase++;
  } else {
    let boton = document.getElementById("botonSiguiente");
    boton.innerHTML = "Comenzar Juego";
    boton.onclick = empezarJuego;
  }
}

// ============================
// EMPEZAR
// ============================

function empezarJuego() {
  document.getElementById("pantallaInstrucciones").style.display = "none";
  document.getElementById("Pasajero").style.display = "flex";
  mostrarPasajero();
}

// ============================
// PASAJEROS
// ============================

let pasajeros = [
  { nombre: "Jacob Hershel", pais: "Israel", edad: 34, imagen: "assets/personajes/Jacob_Hershel.png" },
  { nombre: "Mohammed Abdul", pais: "Yemen", edad: 28, imagen: "assets/personajes/Mohammed_Abdul.png" },
  { nombre: "Borja Blasco-Ibáñez", pais: "España", edad: 37, imagen: "assets/personajes/Borja_BlascoIbanez_de_Alvarez.png" },
  { nombre: "Guadalupe Atahualpa", pais: "Bolivia", edad: 17, imagen: "assets/personajes/Guadalupe_Bolivar_Atahualpa.png" },
  { nombre: "Kim Jong Un", pais: "Corea la buena", edad: 33, imagen: "assets/personajes/kim_jong_un.png" },
  { nombre: "Ricardo Klement", pais: "Argentina", edad: 44, imagen: "assets/personajes/adolfo_hilario.png" },
  { nombre: "Karen Smith", pais: "USA", edad: 27, imagen: "assets/personajes/trans_eunte.png" }
];

let pasajeroActual = 0;

// 🔥 NUEVAS FOTOS ALEATORIAS
let fotosAleatorias = [
  "assets/pasaporte/opcion1.png",
  "assets/pasaporte/opcion2.png",
];

// ============================
// MOSTRAR PASAJERO
// ============================

function mostrarPasajero() {
  let p = pasajeros[pasajeroActual];

  let pasaporte = generarPasaporte(p);
  let tarjeta = generarTarjeta(p);

  document.getElementById("fotoPasajero").src = p.imagen;

  document.getElementById("nombre").innerHTML = "Nombre: " + p.nombre;
  document.getElementById("pais").innerHTML = "País: " + p.pais;
  document.getElementById("edad").innerHTML = "Edad: " + p.edad;

  document.getElementById("fotoPasaporte").src = pasaporte.imagen;

  document.getElementById("pasaporteNombre").innerHTML = "Nombre: " + pasaporte.nombre;
  document.getElementById("pasaportePais").innerHTML = "País: " + pasaporte.pais;
  document.getElementById("pasaporteEdad").innerHTML = "Edad: " + pasaporte.edad;

  document.getElementById("tarjetaNombre").innerHTML = "Nombre: " + tarjeta.nombre;
  document.getElementById("tarjetaVuelo").innerHTML = "Vuelo: " + tarjeta.vuelo;
  document.getElementById("tarjetaAsiento").innerHTML = "Asiento: " + tarjeta.asiento;
}

// ============================
// PASAPORTE
// ============================

function generarPasaporte(p) {

  let falso = Math.random() < 0.35;

  let fotoFinal = p.imagen;

  // 20% foto aleatoria
  if (Math.random() < 0.2) {
    fotoFinal = fotosAleatorias[
      Math.floor(Math.random() * fotosAleatorias.length)
    ];
  }

  let nombreFinal = p.nombre;
  let edadFinal = p.edad;

  if (falso) {

    let nombresFalsos = ["Luis Mendoza","Carlos Ruiz","John Smith","Ivan Petrov","Ali Hassan"];

    let tipoFallo = Math.floor(Math.random() * 3);

    if (tipoFallo === 0) {
      nombreFinal = nombresFalsos[Math.floor(Math.random() * nombresFalsos.length)];
    } else if (tipoFallo === 1) {
      edadFinal = p.edad + Math.floor(Math.random() * 8) + 1;
    } else {
      nombreFinal = nombresFalsos[Math.floor(Math.random() * nombresFalsos.length)];
      edadFinal = p.edad + Math.floor(Math.random() * 8) + 1;
    }
  }

  return {
    nombre: nombreFinal,
    pais: p.pais,
    edad: edadFinal,
    imagen: fotoFinal
  };
}

// ============================
// TARJETA
// ============================

function generarTarjeta(p) {
  let vuelos = ["IB203", "FR221", "JK881", "AX009"];
  let asientos = ["12A", "7C", "21F", "3B"];

  return {
    nombre: p.nombre,
    vuelo: vuelos[Math.floor(Math.random() * vuelos.length)],
    asiento: asientos[Math.floor(Math.random() * asientos.length)]
  };
}

// ============================
// DOCUMENTOS
// ============================

function mostrarDocumento(tipo) {
  let docs = document.querySelectorAll(".documento");
  let tabs = document.querySelectorAll(".tab");

  docs.forEach(d => d.classList.remove("activo"));
  tabs.forEach(t => t.classList.remove("activa"));

  if (tipo === "pasaporte") {
    document.getElementById("pasaporte").classList.add("activo");
    tabs[0].classList.add("activa");
  } else {
    document.getElementById("tarjeta").classList.add("activo");
    tabs[1].classList.add("activa");
  }
}

// ============================
// PASAR PASAJERO
// ============================

function siguientePasajero() {
  pasajeroActual++;

  if (pasajeroActual < pasajeros.length) {
    mostrarPasajero();
  } else {
    alert("Fin de la cola");
    guardarRanking();
  }
}

// ============================
// DECISIONES
// ============================

function aceptar() {
  puntuacion += 10;
  actualizarPuntuacion();
  mostrarSello("APROBADO");

  setTimeout(siguientePasajero, 1000);
}

function rechazar() {
  puntuacion -= 5;
  actualizarPuntuacion();
  mostrarSello("DENEGADO");

  setTimeout(siguientePasajero, 1000);
}

// ============================
// PUNTUACION
// ============================

function actualizarPuntuacion() {
  document.getElementById("puntuacion").innerHTML = puntuacion;
}

function guardarRanking() {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  ranking.push({
    usuario: nombreUsuario,
    puntos: puntuacion
  });

  localStorage.setItem("ranking", JSON.stringify(ranking));
}

// ============================
// SELLO
// ============================

function mostrarSello(texto) {
  let sello = document.getElementById("selloResultado");

  sello.innerHTML = texto;
  sello.classList.remove("mostrar");

  void sello.offsetWidth;

  if (texto === "APROBADO") {
    sello.style.borderColor = "#2ecc71";
    sello.style.color = "#2ecc71";
  } else {
    sello.style.borderColor = "#e74c3c";
    sello.style.color = "#e74c3c";
  }

  sello.classList.add("mostrar");
}