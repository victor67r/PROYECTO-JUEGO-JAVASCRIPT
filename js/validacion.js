/**
 * @fileoverview validacion.js
 * Lógica de validación de decisiones del agente.
 *
 * Determina si APROBAR/DENEGAR fue correcto según el pasajero y las reglas del día.
 */

'use strict';

/**
 * @typedef {Object} ResultadoValidacion
 * @property {boolean}          esCorrecta
 * @property {string}           mensaje   - Explicación legible
 * @property {number}           creditos  - Créditos ganados (0 si fue error)
 * @property {'exito'|'error'}  tipo      - Para aplicar estilos en UI
 */

/**
 * Valida la decisión del agente para el pasajero actual.
 *
 * Lógica:
 *   - APROBAR pasajero válido   → Correcto (+créditos)
 *   - DENEGAR pasajero inválido → Correcto (+créditos)
 *   - APROBAR pasajero inválido → Error (penalización)
 *   - DENEGAR pasajero válido   → Error (penalización)
 *
 * Nota sobre equipaje: si el agente encontró contrabando haciendo clic en los
 * items, eso le da créditos al momento. Aprobar con contrabando NO detectado es
 * una infracción. Denegar siempre es correcto si había infracción.
 *
 * @param {PasajeroCompleto} pasajero
 * @param {boolean}          esAprobado         - true = APROBAR
 * @param {number}           dia                - Día actual
 * @param {boolean}          equipajeInspect    - Si el agente abrió el equipaje
 * @param {boolean}          contrabandoEncontrado - Si se confiscó algún ilegal
 * @returns {ResultadoValidacion}
 */
function validarDecision(pasajero, esAprobado, dia, equipajeInspect, contrabandoEncontrado) {
    const infracciones  = _detectarInfracciones(pasajero, dia, equipajeInspect, contrabandoEncontrado);
    const hayInfraccion = infracciones.length > 0;

    if (esAprobado && !hayInfraccion) {
        return {
            esCorrecta: true,
            mensaje:    '✅ Correcto — Pasajero con documentación válida aprobado.',
            creditos:   CREDITOS_DECISION_CORRECTA,
            tipo:       'exito',
        };
    }
    if (!esAprobado && hayInfraccion) {
        return {
            esCorrecta: true,
            mensaje:    `✅ Correcto — Infracción: ${infracciones[0].descripcion}`,
            creditos:   CREDITOS_DECISION_CORRECTA,
            tipo:       'exito',
        };
    }
    if (esAprobado && hayInfraccion) {
        return {
            esCorrecta: false,
            mensaje:    `❌ Error — Aprobaste infracción: ${infracciones[0].descripcion}`,
            creditos:   0,
            tipo:       'error',
        };
    }
    // !esAprobado && !hayInfraccion
    return {
        esCorrecta: false,
        mensaje:    '❌ Error — Denegaste a un pasajero con documentación válida.',
        creditos:   0,
        tipo:       'error',
    };
}

/**
 * Detecta todas las infracciones activas según las reglas del día.
 * @private
 * @param {PasajeroCompleto} pasajero
 * @param {number}  dia
 * @param {boolean} equipajeInspect
 * @param {boolean} contrabandoEncontrado
 * @returns {{id:string, descripcion:string}[]}
 */
function _detectarInfracciones(pasajero, dia, equipajeInspect, contrabandoEncontrado) {
    const inf = [];

    // Regla: Pasaporte no expirado
    if (reglasActivaEnDia(REGLAS.PASAPORTE_VALIDO, dia)) {
        if (pasajero.pasaporte.estaExpirado) {
            inf.push({ id: 'pasaporte_expirado', descripcion: 'Pasaporte caducado.' });
        }
    }

    // Regla: Nombre coincide entre pasaporte y tarjeta
    if (reglasActivaEnDia(REGLAS.NOMBRE_COINCIDE, dia)) {
        const nomPas = `${pasajero.pasaporte.nombre} ${pasajero.pasaporte.apellido}`.toLowerCase().trim();
        const nomTar = pasajero.tarjeta.nombrePasajero.toLowerCase().trim();
        if (nomPas !== nomTar) {
            inf.push({ id: 'nombre_no_coincide', descripcion: 'Nombre no coincide con tarjeta.' });
        }
    }

    // Regla: Equipaje sin contrabando no detectado
    if (reglasActivaEnDia(REGLAS.EQUIPAJE_INSPECCION, dia)) {
        if (pasajero.equipaje.tieneContrabando && !contrabandoEncontrado) {
            inf.push({ id: 'contrabando_no_detectado', descripcion: 'Contrabando en equipaje no detectado.' });
        }
    }

    return inf;
}
