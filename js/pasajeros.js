/**
 * @fileoverview pasajeros.js
 * Pool de pasajeros predefinidos y generador de documentos completos.
 *
 * ─────────────────────────────────────────────────────────────
 * CÓMO AÑADIR NUEVOS PASAJEROS:
 *   1. Añade un objeto a POOL_PASAJEROS con todos los campos.
 *   2. Coloca la imagen en 'assets/pasajeros/' (ej: '01_carlos.png').
 *   3. Pon la ruta relativa en el campo 'foto'.
 *   4. Si no hay foto aún, deja foto: null (se usará silueta por género).
 *
 * CÓMO AÑADIR ITEMS DE EQUIPAJE:
 *   1. Añade un objeto a ITEMS_EQUIPAJE.
 *   2. Coloca la imagen en 'assets/equipaje/'.
 *   3. Pon la ruta en el campo 'imagen'. Deja null si aún no hay imagen.
 *   4. El campo 'emoji' se usa como fallback visual.
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

// ============================================================
// TYPEDEFS (solo JSDoc, sin código)
// ============================================================

/**
 * @typedef {Object} DatosPasajero
 * @property {number}      id
 * @property {string}      nombre
 * @property {string}      apellido
 * @property {string}      nacionalidad
 * @property {'M'|'F'}    genero
 * @property {string|null} foto - Ruta a imagen (null = silueta)
 */

/**
 * @typedef {Object} ItemEquipaje
 * @property {string}      id
 * @property {string}      nombre
 * @property {string}      emoji       - Fallback visual si no hay imagen
 * @property {boolean}     legal       - true=permitido, false=prohibido
 * @property {string|null} imagen      - FUTURO: 'assets/equipaje/xxx.png'
 * @property {string}      descripcion - Tooltip informativo
 */

/**
 * @typedef {Object} Pasaporte
 * @property {string}      numero
 * @property {string}      nombre
 * @property {string}      apellido
 * @property {string}      nacionalidad
 * @property {'M'|'F'}    genero
 * @property {string}      fechaNacimiento - DD/MM/YYYY
 * @property {string}      fechaExpiracion - DD/MM/YYYY
 * @property {boolean}     estaExpirado
 * @property {string|null} foto
 */

/**
 * @typedef {Object} TarjetaEmbarque
 * @property {string} numeroVuelo
 * @property {string} origen
 * @property {string} codigoOrigen
 * @property {string} destino
 * @property {string} codigoDestino
 * @property {string} nombrePasajero - Puede no coincidir con pasaporte
 * @property {string} asiento
 * @property {string} puerta
 * @property {string} fechaVuelo    - DD/MM/YYYY
 * @property {string} horaEmbarque - HH:MM
 */

/**
 * @typedef {Object} DatosEquipaje
 * @property {ItemEquipaje[]} items
 * @property {boolean}        tieneContrabando
 * @property {ItemEquipaje[]} itemsIlegales
 */

/**
 * @typedef {Object} PasajeroCompleto
 * @property {DatosPasajero}  datos
 * @property {Pasaporte}      pasaporte
 * @property {TarjetaEmbarque} tarjeta
 * @property {DatosEquipaje}  equipaje
 * @property {boolean}        esValido
 * @property {string|null}    razonInvalidez
 */

// ============================================================
// POOL DE PASAJEROS PREDEFINIDOS
// ============================================================

/**
 * Lista de pasajeros disponibles en el juego.
 *
 * Para añadir foto real: foto: 'assets/pasajeros/NN_nombre.png'
 *
 * @type {DatosPasajero[]}
 */
const POOL_PASAJEROS = [
    { id:  1, nombre: 'Carlos',   apellido: 'Méndez',    nacionalidad: 'Española',   genero: 'M', foto: null /* 'assets/pasajeros/01_carlos.png'   */ },
    { id:  2, nombre: 'Ana',      apellido: 'Torres',    nacionalidad: 'Francesa',   genero: 'F', foto: null /* 'assets/pasajeros/02_ana.png'       */ },
    { id:  3, nombre: 'Ivan',     apellido: 'Petrov',    nacionalidad: 'Rusa',       genero: 'M', foto: null /* 'assets/pasajeros/03_ivan.png'      */ },
    { id:  4, nombre: 'Sofia',    apellido: 'Müller',    nacionalidad: 'Alemana',    genero: 'F', foto: null /* 'assets/pasajeros/04_sofia.png'     */ },
    { id:  5, nombre: 'Ahmed',    apellido: 'Al-Rashid', nacionalidad: 'Emiratí',    genero: 'M', foto: null /* 'assets/pasajeros/05_ahmed.png'     */ },
    { id:  6, nombre: 'Yuki',     apellido: 'Tanaka',    nacionalidad: 'Japonesa',   genero: 'F', foto: null /* 'assets/pasajeros/06_yuki.png'      */ },
    { id:  7, nombre: 'Marco',    apellido: 'Rossi',     nacionalidad: 'Italiana',   genero: 'M', foto: null /* 'assets/pasajeros/07_marco.png'     */ },
    { id:  8, nombre: 'Elena',    apellido: 'García',    nacionalidad: 'Española',   genero: 'F', foto: null /* 'assets/pasajeros/08_elena.png'     */ },
    { id:  9, nombre: 'John',     apellido: 'Smith',     nacionalidad: 'Británica',  genero: 'M', foto: null /* 'assets/pasajeros/09_john.png'      */ },
    { id: 10, nombre: 'Mei',      apellido: 'Chen',      nacionalidad: 'China',      genero: 'F', foto: null /* 'assets/pasajeros/10_mei.png'       */ },
    { id: 11, nombre: 'Amara',    apellido: 'Diallo',    nacionalidad: 'Senegalesa', genero: 'F', foto: null /* 'assets/pasajeros/11_amara.png'     */ },
    { id: 12, nombre: 'Erik',     apellido: 'Larsson',   nacionalidad: 'Sueca',      genero: 'M', foto: null /* 'assets/pasajeros/12_erik.png'      */ },
    { id: 13, nombre: 'Layla',    apellido: 'Hassan',    nacionalidad: 'Egipcia',    genero: 'F', foto: null /* 'assets/pasajeros/13_layla.png'     */ },
    { id: 14, nombre: 'Dmitri',   apellido: 'Volkov',    nacionalidad: 'Rusa',       genero: 'M', foto: null /* 'assets/pasajeros/14_dmitri.png'    */ },
    { id: 15, nombre: 'Isabella', apellido: 'Ferrari',   nacionalidad: 'Italiana',   genero: 'F', foto: null /* 'assets/pasajeros/15_isabella.png'  */ },
];

// ============================================================
// DESTINOS
// ============================================================

/** Aeropuerto de origen (puesto del agente) */
const AEROPUERTO_ORIGEN = { ciudad: 'Valencia', pais: 'España', codigo: 'VLC' };

/** @type {{ciudad:string, pais:string, codigo:string}[]} */
const DESTINOS_DISPONIBLES = [
    { ciudad: 'Madrid',      pais: 'España',        codigo: 'MAD' },
    { ciudad: 'París',       pais: 'Francia',       codigo: 'CDG' },
    { ciudad: 'Londres',     pais: 'Reino Unido',   codigo: 'LHR' },
    { ciudad: 'Berlín',      pais: 'Alemania',      codigo: 'BER' },
    { ciudad: 'Roma',        pais: 'Italia',        codigo: 'FCO' },
    { ciudad: 'Tokio',       pais: 'Japón',         codigo: 'NRT' },
    { ciudad: 'Nueva York',  pais: 'EE.UU.',        codigo: 'JFK' },
    { ciudad: 'Dubái',       pais: 'EAU',           codigo: 'DXB' },
    { ciudad: 'Lisboa',      pais: 'Portugal',      codigo: 'LIS' },
    { ciudad: 'Ámsterdam',   pais: 'Países Bajos',  codigo: 'AMS' },
    { ciudad: 'Moscú',       pais: 'Rusia',         codigo: 'SVO' },
    { ciudad: 'Nueva Delhi', pais: 'India',         codigo: 'DEL' },
];

// ============================================================
// CATÁLOGO DE ITEMS DE EQUIPAJE
// ============================================================

/**
 * Catálogo completo de items para la inspección de equipaje.
 *
 * Para añadir imagen real: imagen: 'assets/equipaje/nombre.png'
 * El sistema usa la imagen si existe, o el emoji como fallback.
 *
 * @type {ItemEquipaje[]}
 */
const ITEMS_EQUIPAJE = [
    // ─── LEGALES ────────────────────────────────────────────────────────
    { id: 'ropa',       nombre: 'Ropa doblada',        emoji: '👕', legal: true,  imagen: null /* 'assets/equipaje/ropa.png'       */, descripcion: 'Ropa de viaje. Artículo permitido.'            },
    { id: 'zapatos',    nombre: 'Par de zapatos',       emoji: '👟', legal: true,  imagen: null /* 'assets/equipaje/zapatos.png'    */, descripcion: 'Calzado de repuesto. Permitido.'                },
    { id: 'libro',      nombre: 'Libro',                emoji: '📚', legal: true,  imagen: null /* 'assets/equipaje/libro.png'      */, descripcion: 'Literatura de viaje. Permitido.'                },
    { id: 'medicinas',  nombre: 'Medicamentos',         emoji: '💊', legal: true,  imagen: null /* 'assets/equipaje/medicinas.png'  */, descripcion: 'Medicamentos personales. Permitido.'            },
    { id: 'camara',     nombre: 'Cámara fotográfica',   emoji: '📷', legal: true,  imagen: null /* 'assets/equipaje/camara.png'     */, descripcion: 'Equipo fotográfico. Permitido.'                 },
    { id: 'cargador',   nombre: 'Cargador',             emoji: '🔌', legal: true,  imagen: null /* 'assets/equipaje/cargador.png'   */, descripcion: 'Cargador electrónico. Permitido.'               },
    { id: 'cosmeticos', nombre: 'Cosméticos',           emoji: '💄', legal: true,  imagen: null /* 'assets/equipaje/cosmeticos.png' */, descripcion: 'Artículos de higiene. Permitido.'               },
    { id: 'snacks',     nombre: 'Snacks envasados',     emoji: '🍫', legal: true,  imagen: null /* 'assets/equipaje/snacks.png'     */, descripcion: 'Comida envasada de viaje. Permitido.'           },
    { id: 'laptop',     nombre: 'Ordenador portátil',   emoji: '💻', legal: true,  imagen: null /* 'assets/equipaje/laptop.png'     */, descripcion: 'Equipo informático personal. Permitido.'        },
    { id: 'gafas',      nombre: 'Gafas de sol',         emoji: '🕶', legal: true,  imagen: null /* 'assets/equipaje/gafas.png'      */, descripcion: 'Gafas de sol. Permitido.'                       },
    // ─── ILEGALES ───────────────────────────────────────────────────────
    { id: 'cuchillo',   nombre: 'Navaja',               emoji: '🔪', legal: false, imagen: null /* 'assets/equipaje/cuchillo.png'   */, descripcion: '⚠️ ARMA BLANCA — Prohibido en cabina.'         },
    { id: 'pistola',    nombre: 'Pistola',               emoji: '🔫', legal: false, imagen: null /* 'assets/equipaje/pistola.png'    */, descripcion: '⛔ ARMA DE FUEGO — Absolutamente prohibida.'   },
    { id: 'drogas',     nombre: 'Sustancia ilegal',      emoji: '💉', legal: false, imagen: null /* 'assets/equipaje/drogas.png'     */, descripcion: '⛔ SUSTANCIA CONTROLADA — Prohibida.'           },
    { id: 'explosivo',  nombre: 'Dispositivo peligroso', emoji: '💣', legal: false, imagen: null /* 'assets/equipaje/explosivo.png'  */, descripcion: '🚨 EXPLOSIVO — Prohibición absoluta.'          },
    { id: 'efectivo',   nombre: 'Efectivo >10.000€',     emoji: '💰', legal: false, imagen: null /* 'assets/equipaje/efectivo.png'   */, descripcion: '⚠️ EFECTIVO NO DECLARADO — Supera límite legal.'},
];

// ============================================================
// GENERADORES PRIVADOS
// ============================================================

let _contadorPasaporte = 10000;

/** @private */
function _generarNumeroPasaporte() {
    return 'VLC' + (++_contadorPasaporte).toString().padStart(7, '0');
}

/** @private */
function _generarNumeroVuelo() {
    const pref = ['IB', 'VY', 'FR', 'LH', 'BA', 'AF', 'BW', 'RY'];
    return pref[Math.floor(Math.random() * pref.length)] + Math.floor(Math.random() * 8999 + 1000);
}

/** @private */
function _generarAsiento() {
    return (Math.floor(Math.random() * 30) + 1) + 'ABCDEF'[Math.floor(Math.random() * 6)];
}

/**
 * Genera fecha en formato DD/MM/YYYY.
 * @private
 * @param {number} deltaDias - Días desde hoy (+ futuro, - pasado)
 * @param {number} [variacion=0] - Variación aleatoria adicional en días
 */
function _generarFecha(deltaDias, variacion = 0) {
    const d = new Date();
    d.setDate(d.getDate() + deltaDias + Math.floor((Math.random() - 0.5) * variacion));
    return [String(d.getDate()).padStart(2,'0'), String(d.getMonth()+1).padStart(2,'0'), d.getFullYear()].join('/');
}

/** @private */
function _fechaHoy() { return _generarFecha(0, 0); }

/** @private Fisher-Yates shuffle in-place */
function _mezclar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/** @private */
function _seleccionarN(arr, n) { return _mezclar([...arr]).slice(0, n); }

/**
 * Genera contenido del equipaje.
 * @private
 * @param {boolean} incluirContrabando
 * @returns {DatosEquipaje}
 */
function _generarEquipaje(incluirContrabando) {
    const legales  = ITEMS_EQUIPAJE.filter(i =>  i.legal);
    const ilegales = ITEMS_EQUIPAJE.filter(i => !i.legal);
    const selLeg   = _seleccionarN(legales, Math.floor(Math.random() * 4) + 3); // 3–6

    if (!incluirContrabando) {
        return { items: _mezclar(selLeg), tieneContrabando: false, itemsIlegales: [] };
    }
    const selIleg = _seleccionarN(ilegales, Math.random() < 0.35 ? 2 : 1);
    return {
        items: _mezclar([...selLeg, ...selIleg]),
        tieneContrabando: true,
        itemsIlegales: selIleg,
    };
}

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

/**
 * Genera un pasajero completo con todos sus documentos para el día dado.
 *
 * La probabilidad de pasajero problemático está en config.fraudePorcentaje.
 * El tipo de problema (pasaporte, nombre, equipaje) se decide aleatoriamente
 * entre las reglas activas ese día.
 *
 * @param {number} dia - Día actual del juego
 * @returns {PasajeroCompleto}
 */
function generarPasajero(dia) {
    const config    = getConfigDia(dia);
    const datosBase = POOL_PASAJEROS[Math.floor(Math.random() * POOL_PASAJEROS.length)];
    const destino   = DESTINOS_DISPONIBLES[Math.floor(Math.random() * DESTINOS_DISPONIBLES.length)];

    // Determinar tipo de problema si aplica
    const esProblematico = Math.random() < config.fraudePorcentaje;
    const tiposPosibles = [];
    if (esProblematico) {
        if (reglasActivaEnDia(REGLAS.PASAPORTE_VALIDO, dia))    tiposPosibles.push('pasaporte_expirado');
        if (reglasActivaEnDia(REGLAS.NOMBRE_COINCIDE, dia))     tiposPosibles.push('nombre_incorrecto');
        if (reglasActivaEnDia(REGLAS.EQUIPAJE_INSPECCION, dia)) tiposPosibles.push('contrabando');
    }
    const tipoProblema = tiposPosibles.length
        ? tiposPosibles[Math.floor(Math.random() * tiposPosibles.length)]
        : null;

    // ── Pasaporte ──────────────────────────────────────────────
    const pasaporteExpirado = tipoProblema === 'pasaporte_expirado';
    const pasaporte = {
        numero:          _generarNumeroPasaporte(),
        nombre:          datosBase.nombre,
        apellido:        datosBase.apellido,
        nacionalidad:    datosBase.nacionalidad,
        genero:          datosBase.genero,
        fechaNacimiento: _generarFecha(-30 * 365, 365 * 5),
        fechaExpiracion: pasaporteExpirado
            ? _generarFecha(-60, 120)       // Expirado hace 0–180 días
            : _generarFecha(365 * 3, 365 * 2), // Válido 1–5 años más
        estaExpirado:    pasaporteExpirado,
        foto:            datosBase.foto,
    };

    // ── Tarjeta de embarque ────────────────────────────────────
    const nombreIncorrecto = tipoProblema === 'nombre_incorrecto';
    let nombreEnTarjeta;
    if (nombreIncorrecto) {
        const otrosPasajeros = POOL_PASAJEROS.filter(p => p.id !== datosBase.id);
        const otro = otrosPasajeros[Math.floor(Math.random() * otrosPasajeros.length)];
        nombreEnTarjeta = `${otro.nombre} ${datosBase.apellido}`;
    } else {
        nombreEnTarjeta = `${datosBase.nombre} ${datosBase.apellido}`;
    }
    const cols = ['00', '15', '30', '45'];
    const tarjeta = {
        numeroVuelo:    _generarNumeroVuelo(),
        origen:         AEROPUERTO_ORIGEN.ciudad,
        codigoOrigen:   AEROPUERTO_ORIGEN.codigo,
        destino:        destino.ciudad,
        codigoDestino:  destino.codigo,
        nombrePasajero: nombreEnTarjeta,
        asiento:        _generarAsiento(),
        puerta:         String.fromCharCode(65 + Math.floor(Math.random() * 8)) + (Math.floor(Math.random() * 20) + 1),
        fechaVuelo:     _fechaHoy(),
        horaEmbarque:   `${String(Math.floor(Math.random() * 14) + 6).padStart(2,'0')}:${cols[Math.floor(Math.random() * 4)]}`,
    };

    // ── Equipaje ───────────────────────────────────────────────
    const equipaje = _generarEquipaje(tipoProblema === 'contrabando');

    return {
        datos:          datosBase,
        pasaporte,
        tarjeta,
        equipaje,
        esValido:       !tipoProblema,
        razonInvalidez: tipoProblema ?? null,
    };
}
