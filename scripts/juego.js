// ============================
// MUSICA
// ============================
let logroMostrado = false;
function toggleMusica() {

  const musica =
    document.getElementById("musicaFondo");

  const boton =
    document.getElementById("botonMusica");

  if (musica.muted) {

    musica.muted = false;

    boton.textContent = "🔊";

  } else {

    musica.muted = true;

    boton.textContent = "🔇";
  }
}

// ============================
// RANKING INICIO
// ============================

let rankingInicioVisible = false;

function toggleRankingInicio() {

  let contenedor =
    document.getElementById("rankingInicioPantalla");

  rankingInicioVisible =
    !rankingInicioVisible;

  if (rankingInicioVisible) {

    contenedor.style.display = "block";

    cargarRankingPantallaInicio();

  } else {

    contenedor.style.display = "none";
  }
}

function cargarRankingPantallaInicio() {

  let ranking =
    JSON.parse(localStorage.getItem("ranking")) || [];

  let lista =
    document.getElementById("listaRankingInicio");

  lista.innerHTML = "";

  ranking.sort((a, b) => b.puntos - a.puntos);

  if (ranking.length === 0) {

    let li = document.createElement("li");

    li.textContent =
      "No hay partidas guardadas";

    lista.appendChild(li);

    return;
  }

  ranking.forEach(j => {

    let li = document.createElement("li");

    li.textContent =
      `${j.usuario} - ${j.puntos} pts`;

    lista.appendChild(li);
  });
}

// ============================
// USUARIO
// ============================

let nombreUsuario = "";
let puntuacion = 0;

function mostrarModalUsuario() {

  document.getElementById("modalUsuario")
    .style.display = "flex";
}

function guardarUsuario() {

  let input =
    document.getElementById("inputUsuario")
      .value
      .trim();

  if (!input) {

    alert("Introduce un nombre");

    return;
  }

  nombreUsuario = input;

  document.getElementById("hudUsuario")
    .innerHTML = nombreUsuario;

  document.getElementById("modalUsuario")
    .style.display = "none";

  mostrarInstrucciones();
}

// ============================
// INSTRUCCIONES
// ============================

let indiceFrase = 0;

function mostrarInstrucciones() {

  document.getElementById("pantallaInicio")
    .style.display = "none";

  let pantalla =
    document.getElementById("pantallaInstrucciones");

  pantalla.style.display = "flex";

  let frases =
    document.getElementsByClassName("instruccion");

  for (let i = 0; i < frases.length; i++) {

    frases[i].style.opacity = 0;
  }

  indiceFrase = 0;

  mostrarSiguienteFrase();
}

function mostrarSiguienteFrase() {

  let frases =
    document.getElementsByClassName("instruccion");

  if (indiceFrase < frases.length) {

    frases[indiceFrase].style.opacity = 1;

    indiceFrase++;

  } else {

    let boton =
      document.getElementById("botonSiguiente");

    boton.innerHTML =
      "Comenzar Juego";

    boton.onclick = empezarJuego;
  }
}

// ============================
// EMPEZAR JUEGO
// ============================

function empezarJuego() {

  mezclarPasajeros();   
  pasajeroActual = 0;   
  document.getElementById("pantallaInstrucciones")
    .style.display = "none";

  document.getElementById("Pasajero")
    .style.display = "flex";

  mostrarPasajero();
}

// ============================
// PASAJEROS
// ============================

let pasajeros = [

  {
    nombre: "Jacob Hershel",
    pais: "Israel",
    edad: 34,
    imagen: "assets/personajes/jacob.png"
  },

  {
    nombre: "Mohammed Abdul",
    pais: "Yemen",
    edad: 28,
    imagen: "assets/personajes/Mohammed.png"
  },

  {
    nombre: "Borja Blasco-Ibáñez",
    pais: "España",
    edad: 37,
    imagen: "assets/personajes/Borja.png"
  },

  {
    nombre: "Guadalupe Atahualpa",
    pais: "Bolivia",
    edad: 17,
    imagen: "assets/personajes/Guadalupe.png"
  },

  {
    nombre: "Kim Jong Un",
    pais: "Corea la buena",
    edad: 33,
    imagen: "assets/personajes/kim.png"
  },

  {
    nombre: "Ricardo Klement",
    pais: "Argentina",
    edad: 44,
    imagen: "assets/personajes/adolfo.png"
  },

  {
    nombre: "Karen Smith",
    pais: "USA",
    edad: 27,
    imagen: "assets/personajes/trans.png"
  },
  {
    nombre: "German Martinez Calvente",
    pais: "Turquía",
    edad: 67,
    imagen: "assets/personajes/German.png"
  },
  {
  nombre: "Amina El-Khatib",
  pais: "Marruecos",
  edad: 26,
  imagen: "assets/personajes/amina.png"
},

{
  nombre: "Oliver Schmidt",
  pais: "Alemania",
  edad: 45,
  imagen: "assets/personajes/oliver.png"
},

{
  nombre: "Lucía Fernández",
  pais: "España",
  edad: 31,
  imagen: "assets/personajes/lucia.png"
},

{
  nombre: "Dmitri Ivanov",
  pais: "Rusia",
  edad: 39,
  imagen: "assets/personajes/dmitri.png"
}
];

let fotosAleatorias = [

  "assets/pasaporte/opcion11.png",
  "assets/pasaporte/opcion22.png",
  "assets/pasaporte/opcion33.png",
  "assets/pasaporte/opcion44.png",
  "assets/pasaporte/opcion55.png"
];

let pasajeroActual = 0;
// mezcla pasajeros
function mezclarPasajeros() {
  for (let i = pasajeros.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pasajeros[i], pasajeros[j]] = [pasajeros[j], pasajeros[i]];
  }
}
// ============================
// VARIABLES VALIDACION
// ============================

let datosCorrectos = false;

// ============================
// MOSTRAR PASAJERO
// ============================

function mostrarPasajero() {

  let p =
    pasajeros[pasajeroActual];
  let pasaporte =
    generarPasaporte(p);
  let tarjeta =
    generarTarjeta(p);

    let visado =
  generarVisado(p);

  // ============================
  // VALIDAR DATOS
  // ============================

  datosCorrectos =

    datosCorrectos =

    p.nombre === pasaporte.nombre &&
    p.edad === pasaporte.edad &&
    p.pais === pasaporte.pais &&
    p.imagen === pasaporte.imagen &&
    p.nombre === tarjeta.nombre &&
    p.nombre === visado.nombre &&
    p.pais === visado.pais;

  // ============================
  // PERSONA
  // ============================

  document.getElementById("fotoPasajero")
    .src = p.imagen;
  document.getElementById("nombre")
    .innerHTML =
      "Nombre: " + p.nombre;
  document.getElementById("pais")
    .innerHTML =
      "País: " + p.pais;
  document.getElementById("edad")
    .innerHTML =
      "Edad: " + p.edad;

  // ============================
  // PASAPORTE
  // ============================

  document.getElementById("fotoPasaporte")
    .src = pasaporte.imagen;
  document.getElementById("pasaporteNombre")
    .innerHTML =
      "Nombre: " + pasaporte.nombre;

  document.getElementById("pasaportePais")
    .innerHTML =
      "País: " + pasaporte.pais;
  document.getElementById("pasaporteEdad")
    .innerHTML =
      "Edad: " + pasaporte.edad;

  // ============================
  // TARJETA
  // ============================

  document.getElementById("tarjetaNombre")
    .innerHTML =
      "Nombre: " + tarjeta.nombre;
  document.getElementById("tarjetaVuelo")
    .innerHTML =
      "Vuelo: " + tarjeta.vuelo;
  document.getElementById("tarjetaAsiento")
    .innerHTML =
      "Asiento: " + tarjeta.asiento;
      document.getElementById("visadoNombre")
  .innerHTML =
  "Nombre: " + visado.nombre;

document.getElementById("visadoPais")
  .innerHTML =
  "País: " + visado.pais;

document.getElementById("visadoMotivo")
  .innerHTML =
  "Motivo: " + visado.motivo;

document.getElementById("visadoValidez")
  .innerHTML =
  "Validez: " + visado.validez;
}

// ============================
// GENERAR PASAPORTE
// ============================

function generarPasaporte(p) {

  // 20% error
  let falso =
    Math.random() < 0.20;

  let fotoFinal =
    p.imagen;

  // 15% foto falsa
  if (Math.random() < 0.15) {

    fotoFinal =
      fotosAleatorias[
        Math.floor(
          Math.random() *
          fotosAleatorias.length
        )
      ];
  }

  let nombreFinal =
    p.nombre;
  let edadFinal =
    p.edad;
  let paisFinal =
    p.pais;

  if (falso) {

    let nombresFalsos = [
      "Luis Mendoza",
      "Carlos Ruiz",
      "John Smith",
      "Ivan Petrov",
      "Ali Hassan"
    ];

    let paisesFalsos = [
      "Rusia",
      "Brasil",
      "Canadá",
      "Francia",
      "Japón"
    ];

    let tipoFallo =
      Math.floor(Math.random() * 3);

    // NOMBRE FALSO
    if (tipoFallo === 0) {
      nombreFinal =
        nombresFalsos[
          Math.floor(
            Math.random() *
            nombresFalsos.length
          )
        ];
    }

    // EDAD FALSA
    else if (tipoFallo === 1) {
      edadFinal =
        p.edad +
        Math.floor(Math.random() * 8) +
        1;
    }

    // PAIS FALSO
    else {

      paisFinal =
        paisesFalsos[
          Math.floor(
            Math.random() *
            paisesFalsos.length
          )
        ];
    }
  }

  return {

    nombre: nombreFinal,
    pais: paisFinal,
    edad: edadFinal,
    imagen: fotoFinal
  };
}

// ============================
// GENERAR TARJETA
// ============================

function generarTarjeta(p) {

  let vuelos = [

    "IB203",
    "FR221",
    "JK881",
    "AX009"
  ];

  let asientos = [

    "12A",
    "7C",
    "21F",
    "3B"
  ];

  let nombresFalsos = [

    "Luis Mendoza",
    "Carlos Ruiz",
    "John Smith",
    "Ivan Petrov",
    "Ali Hassan"
  ];

  // 20% error
  let falso =
    Math.random() < 0.20;

  let nombreFinal =
    p.nombre;

  // NOMBRE FALSO
  if (falso) {

    nombreFinal =
      nombresFalsos[
        Math.floor(
          Math.random() *
          nombresFalsos.length
        )
      ];
  }

  return {

    nombre: nombreFinal,

    vuelo:
      vuelos[
        Math.floor(
          Math.random() *
          vuelos.length
        )
      ],

    asiento:
      asientos[
        Math.floor(
          Math.random() *
          asientos.length
        )
      ]
  };
}

// ============================
// DOCUMENTOS
// ============================

function mostrarDocumento(tipo) {

  let docs =
    document.querySelectorAll(".documento");

  let tabs =
    document.querySelectorAll(".tab");

  docs.forEach(d =>
    d.classList.remove("activo")
  );

  tabs.forEach(t =>
    t.classList.remove("activa")
  );

  if (tipo === "pasaporte") {

    document.getElementById("pasaporte")
      .classList.add("activo");

    tabs[0].classList.add("activa");

  }
  else if (tipo === "tarjeta") {

    document.getElementById("tarjeta")
      .classList.add("activo");

    tabs[1].classList.add("activa");

  }
  else if (tipo === "visado") {

    document.getElementById("visado")
      .classList.add("activo");

    tabs[2].classList.add("activa");

  }
}

// ============================
// SIGUIENTE PASAJERO:
// ============================

function siguientePasajero() {

  pasajeroActual++;

  if (
    pasajeroActual <
    pasajeros.length
  ) {
    mostrarPasajero();

  } else {
    guardarRanking();

// 👇 NUEVO LOGRO
comprobarLogroMaximo();

setTimeout(() => {
  alert(
    "Fin de la cola\n\nPuntuación final: " + puntuacion
  );

  location.reload();
}, 1500);
  }
}

// ============================
// DECISIONES
// ============================

function aceptar() {

  if (datosCorrectos) {
    puntuacion += 10;
    mostrarSello("APROBADO");
  } else {
    puntuacion -= 10;
    mostrarSello("ERROR");
  }

  actualizarPuntuacion();
  setTimeout(
    siguientePasajero,
    1000
  );
}

function rechazar() {
  if (!datosCorrectos) {
    puntuacion += 10;
    mostrarSello("DENEGADO");
  } else {
    puntuacion -= 10;
    mostrarSello("ERROR");
  }

  actualizarPuntuacion();
  setTimeout(
    siguientePasajero,
    1000
  );
}

// ============================
// PUNTUACION
// ============================

function actualizarPuntuacion() {
  document.getElementById("puntuacion")
    .innerHTML = puntuacion;
}

// ============================
// GUARDAR RANKING
// ============================

function guardarRanking() {
  let ranking =
    JSON.parse(
      localStorage.getItem("ranking")
    ) || [];

  ranking.push({
    usuario: nombreUsuario,
    puntos: puntuacion
  });
  localStorage.setItem(
    "ranking",
    JSON.stringify(ranking)
  );
}
// SELLO
function mostrarSello(texto) {
  let sello =
    document.getElementById("selloResultado");
  sello.innerHTML = texto;
  sello.classList.remove("mostrar");
  void sello.offsetWidth;

  // APROBADO
  if (texto === "APROBADO") {
    sello.style.borderColor =
      "#2ecc71";
    sello.style.color =
      "#2ecc71";
  }

  // DENEGADO
  else if (texto === "DENEGADO") {
    sello.style.borderColor =
      "#e74c3c";
    sello.style.color =
      "#e74c3c";
  }
  // ERROR
  else {
    sello.style.borderColor =
      "#f1c40f";
    sello.style.color =
      "#f1c40f";
  }
  sello.classList.add("mostrar");
}

function borrarRanking() {

  let confirmar = confirm("¿Seguro que quieres borrar todo el ranking?");
  if (!confirmar) return;
  localStorage.removeItem("ranking");
  cargarRankingPantallaInicio();
}

// ============================
// GENERAR VISADO
// ============================

function generarVisado(p) {

  let motivos = [
    "Turismo",
    "Trabajo",
    "Estudios",
    "Negocios"
  ];

  let nombreFinal = p.nombre;

  // ============================
  // 80% correcto / 20% con error
  // ============================
  let visadoCorrecto = Math.random() < 0.80;

  let añoValidez = 2026; 

  if (!visadoCorrecto) {

    let tipoError = Math.floor(Math.random() * 2);
    // 0 = nombre malo, 1 = caducado

    if (tipoError === 0) {

      // ❌ nombre falso
      let nombresFalsos = [
        "Luis Mendoza",
        "Carlos Ruiz",
        "John Smith",
        "Ivan Petrov",
        "Ali Hassan",
        "Mark Johnson",
        "Pedro Gómez"
      ];

      nombreFinal =
        nombresFalsos[
          Math.floor(Math.random() * nombresFalsos.length)
        ];

    } else {

  
      añoValidez = 2025;
    }
  }

  return {
    nombre: nombreFinal,
    pais: p.pais,
    motivo: motivos[Math.floor(Math.random() * motivos.length)],
    validez: añoValidez
  };
}

// ============================
// LOGRO MAXIMO
// ============================

function comprobarLogroMaximo() {

  const maximo = pasajeros.length * 10;
  if (puntuacion >= maximo) {
    logroMostrado = true;
    document.getElementById("logroMaximo").style.display = "flex";
  }
}

function cerrarLogro() {
  document.getElementById("logroMaximo").style.display = "none";
}

