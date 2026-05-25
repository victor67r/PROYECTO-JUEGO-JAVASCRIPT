
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


// INSTRUCCIONES

let indiceFrase = 0;

function mostrarInstrucciones() {

  document.getElementById("pantallaInicio").style.display = "none";

  let pantalla = document.getElementById("pantallaInstrucciones");

  pantalla.style.display = "flex";

  let frases = document.getElementsByClassName("instruccion");

  for (let i = 0; i < frases.length; i++) {
    frases[i].style.opacity = 0;
  }

  mostrarSiguienteFrase();
}


function mostrarSiguienteFrase() {

  let frases = document.getElementsByClassName("instruccion");

  if (indiceFrase > 0) {
    frases[indiceFrase - 1].style.opacity = 1;
  }

  if (indiceFrase < frases.length) {

    frases[indiceFrase].style.opacity = 1;

    indiceFrase++;
  }

  else {

    let boton = document.getElementById("botonSiguiente");

    boton.innerHTML = "Comenzar Juego";

    boton.onclick = empezarJuego;
  }
}


// EMPEZAR JUEGO

function empezarJuego() {

  document.getElementById("pantallaInstrucciones").style.display = "none";

  document.getElementById("pantallaJuego").style.display = "flex";

  mostrarPasajero();
}


// PASAJEROS

let pasajeros = [

  {
    nombre: "Jacob Hershel",
    pais: "Israel",
    edad: 34,
    imagen: "assets/personajes/Jacob_Hershel.png"
  },

  {
    nombre: "Mohammed Abdul",
    pais: "Yemen",
    edad: 28,
    imagen: "assets/personajes/Mohammed_Abdul.png"
  },

  {
    nombre: "Borja Blasco-Ibáñez",
    pais: "España",
    edad: 37,
    imagen: "assets/personajes/Borja_BlascoIbanez_de_Alvarez.png"
  },

  {
    nombre: "Guadalupe Bolivar",
    pais: "Bolivia",
    edad: 17,
    imagen: "assets/personajes/Guadalupe_Bolivar_Atahualpa.png"
  }

];

let pasajeroActual = 0;

let errores = 0;


// MOSTRAR PASAJERO

function mostrarPasajero() {

  let p = pasajeros[pasajeroActual];

  let pasaporte = generarPasaporte(p);

  document.getElementById("nombre").innerHTML =
    "Nombre: " + p.nombre;

  document.getElementById("pais").innerHTML =
    "País: " + p.pais;

  document.getElementById("edad").innerHTML =
    "Edad: " + p.edad;

  document.getElementById("fotoPasajero").src =
    p.imagen;


  document.getElementById("pasaporteNombre").innerHTML =
    "Nombre: " + pasaporte.nombre;

  document.getElementById("pasaportePais").innerHTML =
    "País: " + pasaporte.pais;

  document.getElementById("pasaporteEdad").innerHTML =
    "Edad: " + pasaporte.edad;

  actualizarCola();
}


// PASAPORTE

function generarPasaporte(p) {

  let falso = Math.random() < 0.5;

  let nombrePasaporte;
  let paisPasaporte;
  let edadPasaporte;

  if (falso) {

    let nombresFalsos = [
      "Carlos Mendoza",
      "Luis Herrera",
      "Miguel Castro",
      "Javier Torres"
    ];

    nombrePasaporte =
      nombresFalsos[Math.floor(Math.random() * nombresFalsos.length)];

    paisPasaporte = "Desconocido";

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


// COLA

function actualizarCola() {

  let quedan = pasajeros.length - pasajeroActual;

  document.getElementById("contadorCola").innerHTML = quedan;
}


// SIGUIENTE PASAJERO

function siguientePasajero() {

  pasajeroActual++;

  if (pasajeroActual < pasajeros.length) {

    mostrarPasajero();
  }

  else {

    alert("Fin de la jornada");
  }
}


// SELLO

function mostrarSello(texto, color) {

  let sello = document.getElementById("sello");

  sello.innerHTML = texto;

  sello.style.display = "flex";

  sello.style.color = color;

  sello.style.borderColor = color;

  setTimeout(() => {

    sello.style.display = "none";

  }, 1200);
}


// BOTONES

function aceptar() {

  mostrarSello("APROBADO", "#2ecc71");

  siguientePasajero();
}


function rechazar() {

  mostrarSello("DENEGADO", "#e74c3c");

  errores++;

  document.getElementById("errores").innerHTML = errores;

  siguientePasajero();
}