// MUSICA
function toggleMusica() {

  const musica = document.getElementById("musicaFondo");
  const boton = document.getElementById("botonMusica");

  if (musica.muted) {
    musica.muted = false;
    boton.textContent = "🔊";
  }
  else {
    musica.muted = true;
    boton.textContent = "🔇";
  }
}

// VARIABLES
var indiceFrase = 0;

let nombreJugador = "";
let puntuacion = 0;

// PANTALLA NOMBRE
function mostrarPantallaNombre() {

  document.getElementById("pantallaInicio").style.display = "none";

  document.getElementById("pantallaNombre").style.display = "flex";
}

function guardarNombre() {

  let nombre = document.getElementById("inputNombre").value;

  if (nombre.trim() == "") {
    alert("Introduce un nombre");
    return;
  }

  nombreJugador = nombre;

  document.getElementById("pantallaNombre").style.display = "none";

  mostrarInstrucciones();
}

// INSTRUCCIONES
function mostrarInstrucciones() {

  document.getElementById("pantallaInicio").style.display = "none";

  var pantalla = document.getElementById("pantallaInstrucciones");

  pantalla.style.display = "flex";

  var frases = document.getElementsByClassName('instruccion');

  for (var i = 0; i < frases.length; i++) {
    frases[i].style.opacity = 0;
  }

  mostrarSiguienteFrase();
}

function mostrarSiguienteFrase() {

  var frases = document.getElementsByClassName('instruccion');

  if (indiceFrase > 0) {
    frases[indiceFrase - 1].style.opacity = 1;
  }

  if (indiceFrase < frases.length) {

    frases[indiceFrase].style.opacity = 1;

    indiceFrase = indiceFrase + 1;
  }
  else {

    var boton = document.getElementById("botonSiguiente");

    boton.innerHTML = "Comenzar Juego";

    boton.onclick = empezarJuego;
  }
}

// EMPEZAR JUEGO
function empezarJuego() {

  document.getElementById("pantallaInstrucciones").style.display = "none";

  document.getElementById("Pasajero").style.display = "flex";

  document.getElementById("nombreJugadorHUD").innerHTML = nombreJugador;

  actualizarPuntuacion();

  mostrarPasajero();
}

// PASAJEROS
let pasajeros = [

  {
    "nombre": "Jacob Hershel",
    "pais": "Israel",
    "edad": 34,
    "pasaporte_valido": false,
    "tarjeta_embarque_valida": true,
    "equipaje_prohibido": true,
    "imagen": "assets/personajes/Jacob_Hershel.png"
  },

  {
    "nombre": "Mohammed Abdul",
    "pais": "Yemen",
    "edad": 28,
    "pasaporte_valido": false,
    "tarjeta_embarque_valida": false,
    "equipaje_prohibido": true,
    "imagen": "assets/personajes/Mohammed_Abdul.png"
  },

  {
    "nombre": "Borja Blasco-Ibáñez de Álvarez",
    "pais": "España",
    "edad": 37,
    "pasaporte_valido": true,
    "tarjeta_embarque_valida": true,
    "equipaje_prohibido": false,
    "imagen": "assets/personajes/Borja_BlascoIbanez_de_Alvarez.png"
  },

  {
    "nombre": "Guadalupe Bolivar Atahualpa",
    "pais": "Bolivia",
    "edad": 17,
    "pasaporte_valido": true,
    "tarjeta_embarque_valida": false,
    "equipaje_prohibido": true,
    "imagen": "assets/personajes/Guadalupe_Bolivar_Atahualpa.png"
  }
];

let pasajeroActual = 0;

// MOSTRAR PASAJERO
function mostrarPasajero() {

  let p = pasajeros[pasajeroActual];

  let pasaporte = generarPasaporte(p);

  document.getElementById("nombre").innerHTML =
    "Nombre: " + p.nombre;

  document.getElementById("pais").innerHTML =
    "Pais: " + p.pais;

  document.getElementById("edad").innerHTML =
    "Edad: " + p.edad;

  document.getElementById("fotoPasajero").src =
    p.imagen;

  document.getElementById("pasaporteNombre").innerHTML =
    "Nombre: " + pasaporte.nombre;

  document.getElementById("pasaportePais").innerHTML =
    "Pais: " + pasaporte.pais;

  document.getElementById("pasaporteEdad").innerHTML =
    "Edad: " + pasaporte.edad;
}

// SIGUIENTE PASAJERO
function siguientePasajero() {

  pasajeroActual++;

  if (pasajeroActual < pasajeros.length) {

    mostrarPasajero();
  }
  else {

    guardarRanking();

    alert(
      "Fin del juego\n\n" +
      "Jugador: " + nombreJugador +
      "\nPuntuación: " + puntuacion
    );
  }
}

// BOTONES
function aceptar() {

  puntuacion = puntuacion + 10;

  actualizarPuntuacion();

  mostrarSello("APROBADO", "aprobado");

  setTimeout(function() {
    siguientePasajero();
  }, 1000);
}

function rechazar() {

  puntuacion = puntuacion + 5;

  actualizarPuntuacion();

  mostrarSello("DENEGADO", "denegado");

  setTimeout(function() {
    siguientePasajero();
  }, 1000);
}

// PASAPORTE
function generarPasaporte(p) {

  let esFalso = Math.random() < 0.5;

  let nombresFalsos = [
    "Carlos Mendoza",
    "Juan Pérez",
    "Luis Ramírez",
    "Antonio Gómez"
  ];

  let paisesFalsos = [
    "Argentina",
    "Portugal",
    "Italia",
    "Francia"
  ];

  let nombrePasaporte;
  let paisPasaporte;
  let edadPasaporte;

  if (esFalso) {

    let nombreRandom =
      nombresFalsos[Math.floor(Math.random() * nombresFalsos.length)];

    let paisRandom =
      paisesFalsos[Math.floor(Math.random() * paisesFalsos.length)];

    nombrePasaporte = nombreRandom;
    paisPasaporte = paisRandom;
    edadPasaporte = p.edad + 5;
  }
  else {

    nombrePasaporte = p.nombre;
    paisPasaporte = p.pais;
    edadPasaporte = p.edad;
  }

  return {
    nombre: nombrePasaporte,
    pais: paisPasaporte,
    edad: edadPasaporte
  };
}

// PUNTUACION
function actualizarPuntuacion() {

  document.getElementById("puntuacionHUD").innerHTML =
    puntuacion;
}

// RANKING
function guardarRanking() {

  let ranking = localStorage.getItem("ranking");

  if (ranking == null) {

    ranking = [];
  }
  else {

    ranking = JSON.parse(ranking);
  }

  ranking.push({
    nombre: nombreJugador,
    puntos: puntuacion
  });

  ranking.sort(function(a, b) {
    return b.puntos - a.puntos;
  });

  localStorage.setItem("ranking", JSON.stringify(ranking));
}

// SELLO
function mostrarSello(texto, tipo) {

  let sello = document.createElement("div");

  sello.id = "selloDecision";

  sello.innerHTML = texto;

  if (tipo == "aprobado") {
    sello.classList.add("selloAprobado");
  }
  else {
    sello.classList.add("selloDenegado");
  }

  document.body.appendChild(sello);

  setTimeout(function() {
    sello.remove();
  }, 1000);
}