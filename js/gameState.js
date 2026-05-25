/**
 * @fileoverview gameState.js
 * Gestión del estado global del juego y persistencia en localStorage.
 *
 * Expone todas las funciones necesarias para leer y mutar el estado.
 * Ningún otro módulo debe modificar `gameState` directamente.
 */

'use strict';

// ============================================================
// CONSTANTES DE BALANCE
// ============================================================

/** Créditos por decisión correcta (APROBAR/DENEGAR) */
const CREDITOS_DECISION_CORRECTA = 10;

/** Créditos extra al confiscar contrabando en el equipaje */
const CREDITOS_CONFISCAR_CONTRABANDO = 20;

/** Créditos restados al confiscar un item legal por error */
const PENALIZACION_ITEM_LEGAL = 5;

/** Avisos máximos antes del game over */
const MAX_PENALIZACIONES = 3;

// ============================================================
// CLAVE LOCALSTORAGE
// ============================================================

const SAVE_KEY = 'aeropuertoSaveGame_v1';

// ============================================================
// ESTADO
// ============================================================

/**
 * @typedef {Object} GameState
 * @property {number} dia               - Día actual (empieza en 1)
 * @property {number} puntuacion        - Créditos acumulados totales
 * @property {number} penalizaciones    - Avisos totales (máx MAX_PENALIZACIONES)
 * @property {number} pasajerosAtendidos - Total histórico procesados
 * @property {number} aciertos          - Total histórico de aciertos
 * @property {number} errores           - Total histórico de errores
 * @property {number} pasajerosHoy      - Pasajeros del turno actual
 * @property {number} aciertosHoy       - Aciertos del turno actual
 * @property {number} erroresHoy        - Errores del turno actual
 * @property {string} timestamp         - ISO string del último guardado
 */

/** @type {GameState} */
let gameState = _crearEstadoInicial();

/** @private */
function _crearEstadoInicial() {
    return {
        dia: 1,
        puntuacion: 0,
        penalizaciones: 0,
        pasajerosAtendidos: 0,
        aciertos: 0,
        errores: 0,
        pasajerosHoy: 0,
        aciertosHoy: 0,
        erroresHoy: 0,
        timestamp: new Date().toISOString(),
    };
}

// ============================================================
// GETTERS
// ============================================================

/** Retorna copia del estado actual. @returns {GameState} */
function getEstado() { return { ...gameState }; }

/** @returns {boolean} */
function hayPartidaGuardada() { return localStorage.getItem(SAVE_KEY) !== null; }

/**
 * Información resumida de la partida guardada (para el menú).
 * @returns {{dia:number, puntuacion:number, timestamp:string}|null}
 */
function getInfoPartidaGuardada() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const { dia, puntuacion, timestamp } = JSON.parse(raw);
        return { dia, puntuacion, timestamp };
    } catch { return null; }
}

// ============================================================
// PERSISTENCIA
// ============================================================

/** Guarda el estado actual en localStorage. */
function guardarPartida() {
    gameState.timestamp = new Date().toISOString();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(gameState)); }
    catch (e) { console.error('[GameState] Error guardando:', e); }
}

/**
 * Carga la partida guardada.
 * @returns {boolean} true si tuvo éxito
 */
function cargarDesdeStorage() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        gameState = JSON.parse(raw);
        return true;
    } catch (e) {
        console.error('[GameState] Error cargando:', e);
        return false;
    }
}

/** Elimina la partida guardada. */
function borrarPartidaGuardada() { localStorage.removeItem(SAVE_KEY); }

// ============================================================
// MUTADORES
// ============================================================

/** Resetea a nueva partida. */
function reiniciarPartida() { gameState = _crearEstadoInicial(); }

/** Resetea contadores diarios (se llama al inicio de cada turno). */
function reiniciarContadoresDiarios() {
    gameState.pasajerosHoy = 0;
    gameState.aciertosHoy = 0;
    gameState.erroresHoy = 0;
}

/** Avanza al siguiente día y guarda. */
function avanzarDia() {
    gameState.dia += 1;
    guardarPartida();
}

/**
 * Suma créditos. No puede bajar de 0.
 * @param {number} cantidad - Puede ser negativo
 */
function sumarPuntos(cantidad) {
    gameState.puntuacion = Math.max(0, gameState.puntuacion + cantidad);
}

/**
 * Registra decisión correcta.
 * @param {number} creditos
 */
function registrarAcierto(creditos) {
    gameState.aciertos    += 1;
    gameState.aciertosHoy += 1;
    sumarPuntos(creditos);
}

/**
 * Registra penalización.
 * @returns {boolean} true → el jugador ha sido despedido (3 penalizaciones)
 */
function registrarPenalizacion() {
    gameState.penalizaciones += 1;
    gameState.errores        += 1;
    gameState.erroresHoy     += 1;
    return gameState.penalizaciones >= MAX_PENALIZACIONES;
}

/** Incrementa contadores de pasajeros atendidos. */
function incrementarAtendidos() {
    gameState.pasajerosAtendidos += 1;
    gameState.pasajerosHoy       += 1;
}
