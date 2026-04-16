
//esto es para la musica
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

//necesitamos la cuenta de las frases que llevamos
var indiceFrase = 0;

function mostrarInstrucciones() {
  document.getElementById("pantallaInicio").style.display = "none";

  // mostrar pantalla de instrucciones
  var pantalla = document.getElementById("pantallaInstrucciones");
  pantalla.style.display = "flex";

  // obtener todas las frases
  var frases = document.getElementsByClassName('instruccion');

  // ocultar todas las frases al inicio
  for (var i = 0; i < frases.length; i++) {
    frases[i].style.opacity = 0;
  }
  mostrarSiguienteFrase();
}

function mostrarSiguienteFrase() {
  // obtener todas las frases
  var frases = document.getElementsByClassName('instruccion');
  
  // si ya hay alguna frase mostrada, dejarla visible
  if (indiceFrase > 0) {
    frases[indiceFrase - 1].style.opacity = 1;
  }
  
  // mostrar la siguiente frase si queda alguna
  if (indiceFrase < frases.length) {
    frases[indiceFrase].style.opacity = 1;
    indiceFrase = indiceFrase + 1; 
  } 
  else {
    // si ya no quedan frases se cambia el boton
    var boton = document.getElementById("botonSiguiente");
    boton.innerHTML = "Comenzar Juego"; 
    boton.onclick = empezarJuego;        
  }
}

//empezar el juego
function empezarJuego(){
  document.getElementById("pantallaInstrucciones").style.display = "none";
  document.getElementById("Pasajero").style.display="block";
  mostrarPasajero();
}

//mostramos los pasajeros
let pasajeros = [  {
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
  }]
let pasajeroActual = 0;

function mostrarPasajero(){
  let p = pasajeros[pasajeroActual];
  document.getElementById("nombre").innerHTML = "Nombre: "+p.nombre;
  document.getElementById("pais").innerHTML = "Pais: "+p.pais;
  document.getElementById("edad").innerHTML = "Edad: "+p.edad;
  document.getElementById("fotoPasajero").src = p.imagen;

}

//pasar de pasajero
function siguientePasajero(){
  pasajeroActual++;
  if (pasajeroActual<pasajeros.length){
    mostrarPasajero();
  }
      else{
        alert("No hay nadie en la cola")
  }
}

//botones para aceptar o rechazar
function aceptar(){
  alert("Pasajero aceptado");
  siguientePasajero();
}

function rechazar(){
  alert("Pasajero rechazado");
  siguientePasajero();
}
