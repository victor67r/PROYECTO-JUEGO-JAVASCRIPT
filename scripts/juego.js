
function mostrarInstrucciones() {
  document.getElementById("pantallaInicio").style.display = "none";
  document.getElementById("pantallaInstrucciones").style.display = "block";
}

function empezarJuego() {
  document.getElementById("pantallaInstrucciones").style.display = "none";
  document.getElementById("pantallaJuego").style.display = "block";
}


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