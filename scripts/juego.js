
function empezarJuego() {
  document.getElementById("pantallaInstrucciones").style.display = "none";
  document.getElementById("pantallaJuego").style.display = "block";
}

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