/**
 * @fileoverview index.js
 * Punto de entrada y controlador principal del juego.
 *
 * Coordina todos los módulos y gestiona el flujo de pantallas:
 *   Menú ──► Boletín ──► Turno (loop pasajeros) ──► Fin de día ──► Boletín ──► ...
 *
 * Módulos utilizados:
 *   gameState.js  – Estado y persistencia
 *   dias.js       – Reglas y boletines por día
 *   pasajeros.js  – Generación de pasajeros
 *   validacion.js – Validación de decisiones
 *   timer.js      – Temporizador de turno
 *   ui.js         – Renderizado y HUD
 */

'use strict';

// ============================================================
// INICIALIZACIÓN
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
    _configurarMenu();
});

/**
 * Configura el menú principal: habilita "Continuar" si hay save
 * y muestra la información de la partida guardada.
 * @private
 */
function _configurarMenu() {
    const btnCargar = document.getElementById('btn-cargar');
    const infoSave  = document.getElementById('info-partida-guardada');

    if (hayPartidaGuardada()) {
        if (btnCargar) btnCargar.disabled = false;
        const info = getInfoPartidaGuardada();
        if (info && infoSave) {
            const fecha = new Date(info.timestamp).toLocaleDateString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
            infoSave.textContent  = `💾 Día ${info.dia} · ${info.puntuacion}€ · ${fecha}`;
            infoSave.style.display = 'block';
        }
    } else {
        if (btnCargar) btnCargar.disabled = true;
        if (infoSave)  infoSave.style.display = 'none';
    }
}

// ============================================================
// SISTEMA DE PANTALLAS
// ============================================================

/**
 * Cambia la pantalla visible (oculta todas las demás).
 * Función accesible globalmente para ser llamada desde ui.js.
 * @param {string} idPantalla
 */
function cambiarPantalla(idPantalla) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    const el = document.getElementById(idPantalla);
    if (el) el.classList.add('activa');
    else    console.error('[Main] Pantalla no encontrada:', idPantalla);
}

// ============================================================
// FLUJO: MENÚ PRINCIPAL
// ============================================================

/** Inicia una nueva partida desde el Día 1. */
function iniciarNuevaPartida() {
    reiniciarPartida();
    _irABoletin();
}

/** Carga la partida guardada y continúa desde el día guardado. */
function cargarPartidaGuardada() {
    if (cargarDesdeStorage()) {
        _irABoletin();
    } else {
        alert('No se pudo cargar la partida guardada.');
        _configurarMenu();
    }
}

/** Muestra los créditos del juego. */
function mostrarCreditos() {
    alert(
        'CONTROL DE ADUANAS\n' +
        '══════════════════\n' +
        'Juego estilo Papers Please en un aeropuerto.\n\n' +
        'Tecnologías: HTML5 · CSS3 · JavaScript Vanilla\n' +
        'Desarrollado como proyecto DAM.\n\n' +
        '─ Aeropuerto Internacional de Valencia ─'
    );
}

// ============================================================
// FLUJO: BOLETÍN DIARIO
// ============================================================

/**
 * Navega a la pantalla del boletín oficial del día actual.
 * @private
 */
function _irABoletin() {
    const estado = getEstado();
    document.getElementById('numero-dia').textContent     = estado.dia;
    document.getElementById('texto-boletin').innerHTML   = generarHTMLBoletin(estado.dia);
    cambiarPantalla('pantalla-intro');
}

// ============================================================
// FLUJO: TURNO DE JUEGO
// ============================================================

/**
 * Empieza el turno del día actual.
 * Resetea contadores diarios, inicia el timer y genera el primer pasajero.
 */
function empezarTurno() {
    reiniciarContadoresDiarios();
    actualizarHUD();
    cambiarPantalla('pantalla-juego');
    iniciarTimer(_finalizarTurno);
    _siguientePasajero();
}

/**
 * Genera y muestra el siguiente pasajero en la mesa.
 * @private
 */
function _siguientePasajero() {
    const pasajero = generarPasajero(getEstado().dia);
    mostrarPasajeroEnMesa(pasajero);
}

// ============================================================
// FLUJO: DECISIÓN DEL AGENTE
// ============================================================

/**
 * Procesa la decisión del agente (APROBAR o DENEGAR).
 *
 * 1. Obtiene el pasajero actual desde ui.js
 * 2. Valida la decisión con las reglas del día
 * 3. Muestra el sello visual (APROBADO / DENEGADO)
 * 4. Aplica el resultado al estado del juego
 * 5. Muestra notificación de feedback
 * 6. Tras animación, pasa al siguiente pasajero
 *
 * @param {boolean} esAprobado - true = APROBAR, false = DENEGAR
 */
function procesarDecision(esAprobado) {
    const pasajero = getPasajeroActual();
    if (!pasajero) return;

    const estado = getEstado();
    const resultado = validarDecision(
        pasajero,
        esAprobado,
        estado.dia,
        getEquipajeInspeccionado(),
        seEncontroContrabando()
    );

    mostrarSello(esAprobado);
    incrementarAtendidos();

    if (resultado.esCorrecta) {
        registrarAcierto(resultado.creditos);
    } else {
        const despedido = registrarPenalizacion();
        if (despedido) {
            detenerTimer();
            setTimeout(() => {
                mostrarGameOver('Has acumulado 3 avisos por negligencia. Estás despedido.');
                borrarPartidaGuardada();
                _configurarMenu();
            }, 1500);
            return;
        }
    }

    actualizarHUD();
    mostrarFeedbackDecision(resultado);

    // Pasar al siguiente pasajero tras la animación del sello
    setTimeout(() => {
        ocultarSello();
        _siguientePasajero();
    }, 1600);
}

// ============================================================
// FLUJO: FIN DE TURNO / DÍA
// ============================================================

/**
 * Callback cuando el temporizador llega a cero.
 * Guarda el progreso, avanza al siguiente día y muestra el resumen.
 * @private
 */
function _finalizarTurno() {
    detenerTimer();
    avanzarDia();        // Incrementa día y guarda en localStorage
    mostrarFinDia();     // mostrarFinDia usa e.dia - 1 para mostrar el día terminado
}

/** Desde la pantalla de fin de día, continúa al boletín del siguiente día. */
function irAlSiguienteDia() {
    _irABoletin();
}

// ============================================================
// FLUJO: GUARDAR Y SALIR / VOLVER AL MENÚ
// ============================================================

/** Guarda la partida y vuelve al menú principal. */
function guardarYSalir() {
    detenerTimer();
    guardarPartida();
    _configurarMenu();
    cambiarPantalla('pantalla-menu');
}

/** Vuelve al menú sin guardar (desde game over u otras pantallas). */
function volverAlMenu() {
    detenerTimer();
    _configurarMenu();
    cambiarPantalla('pantalla-menu');
}