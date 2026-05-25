/**
 * @fileoverview timer.js
 * Temporizador de cuenta atrás para el turno diario.
 *
 * Duración configurable por DURACION_TURNO_SEGUNDOS.
 * Soporta pausar/reanudar (para la inspección de equipaje).
 * Al llegar a 0 llama al callback de fin de turno registrado.
 */

'use strict';

/** Duración de cada turno en segundos */
const DURACION_TURNO_SEGUNDOS = 90;

/** @type {number|null} ID del setInterval activo */
let _intervaloTimer = null;

/** @type {number} Segundos restantes en el turno actual */
let _segundosRestantes = DURACION_TURNO_SEGUNDOS;

/** @type {Function|null} Callback a ejecutar cuando el tiempo llega a 0 */
let _callbackFinTurno = null;

// ============================================================
// API PÚBLICA
// ============================================================

/**
 * Inicia el temporizador de turno desde cero.
 * @param {Function} onFinTurno - Se llama cuando el contador llega a 0
 */
function iniciarTimer(onFinTurno) {
    detenerTimer();
    _segundosRestantes = DURACION_TURNO_SEGUNDOS;
    _callbackFinTurno  = onFinTurno;
    _actualizarUITimer();
    _arrancarIntervalo();
}

/**
 * Detiene completamente el timer y limpia el callback.
 * Usar al salir al menú o al finalizar la partida.
 */
function detenerTimer() {
    _limpiarIntervalo();
    _callbackFinTurno = null;
}

/**
 * Pausa el timer sin resetearlo (para modales, inspección de equipaje, etc.).
 */
function pausarTimer() { _limpiarIntervalo(); }

/**
 * Reanuda el timer desde donde se pausó.
 * No hace nada si no hay callback o si el tiempo ya llegó a 0.
 */
function reanudarTimer() {
    if (_callbackFinTurno && _segundosRestantes > 0 && _intervaloTimer === null) {
        _arrancarIntervalo();
    }
}

/** @returns {number} Segundos restantes actuales */
function getSegundosRestantes() { return _segundosRestantes; }

// ============================================================
// FUNCIONES PRIVADAS
// ============================================================

/** @private */
function _arrancarIntervalo() {
    _intervaloTimer = setInterval(() => {
        _segundosRestantes -= 1;
        _actualizarUITimer();
        if (_segundosRestantes <= 0) {
            _limpiarIntervalo();
            if (_callbackFinTurno) _callbackFinTurno();
        }
    }, 1000);
}

/** @private */
function _limpiarIntervalo() {
    if (_intervaloTimer !== null) {
        clearInterval(_intervaloTimer);
        _intervaloTimer = null;
    }
}

/**
 * Formatea segundos como M:SS.
 * @private
 * @param {number} s
 * @returns {string}
 */
function _formatearTiempo(s) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Actualiza los elementos del HUD relacionados con el timer.
 * @private
 */
function _actualizarUITimer() {
    const timerEl   = document.getElementById('hud-timer');
    const barraFill = document.getElementById('barra-timer-fill');

    if (!timerEl) return;

    timerEl.textContent = _formatearTiempo(_segundosRestantes);

    // Clases de urgencia
    timerEl.classList.remove('timer-normal', 'timer-advertencia', 'timer-urgente');
    if      (_segundosRestantes <= 15) timerEl.classList.add('timer-urgente');
    else if (_segundosRestantes <= 30) timerEl.classList.add('timer-advertencia');
    else                               timerEl.classList.add('timer-normal');

    // Barra de progreso
    if (barraFill) {
        const pct = (_segundosRestantes / DURACION_TURNO_SEGUNDOS) * 100;
        barraFill.style.width           = `${pct}%`;
        barraFill.style.backgroundColor =
            _segundosRestantes <= 15 ? '#c62828' :
            _segundosRestantes <= 30 ? '#f57f17' : '#2e7d32';
    }
}
