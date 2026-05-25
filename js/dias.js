/**
 * @fileoverview dias.js
 * Configuración de reglas y boletines por día de juego.
 *
 * Para añadir un nuevo día: agrega un objeto al array CONFIGURACION_DIAS.
 * Los días sin configuración explícita usan la del último día definido.
 */

'use strict';

// ============================================================
// IDs DE REGLAS
// ============================================================

/**
 * Identificadores de todas las reglas de validación disponibles.
 * Usados en reglasActivas de cada día y en validacion.js.
 * @readonly @enum {string}
 */
const REGLAS = Object.freeze({
    PASAPORTE_VALIDO:    'pasaporte_valido',    // Pasaporte no expirado
    NOMBRE_COINCIDE:     'nombre_coincide',     // Nombre igual en pasaporte y tarjeta
    TARJETA_FECHA:       'tarjeta_fecha',       // Tarjeta del día actual
    EQUIPAJE_INSPECCION: 'equipaje_inspeccion', // Revisar equipaje
    VISA_REQUERIDA:      'visa_requerida',      // Visa para ciertas naciones
});

// ============================================================
// CONFIGURACIÓN POR DÍA
// ============================================================

/**
 * @typedef {Object} ConfigDia
 * @property {number}   dia
 * @property {string}   titulo
 * @property {string[]} reglas           - Líneas del boletín (HTML permitido)
 * @property {string[]} reglasActivas    - IDs de REGLAS en vigor
 * @property {string}   notaFinal
 * @property {number}   fraudePorcentaje - 0.0–1.0 probabilidad de pasajero problemático
 */

/** @type {ConfigDia[]} */
const CONFIGURACION_DIAS = [
    {
        dia: 1,
        titulo: 'PRIMER DÍA DE SERVICIO',
        reglas: [
            '📋 Bienvenido a su puesto de control de fronteras.',
            '🛂 <strong>REGLA 1:</strong> Todo viajero debe presentar pasaporte válido y no caducado.',
            '⚠️ Se emitirán avisos por decisiones incorrectas. Al tercer aviso, será despedido.',
        ],
        reglasActivas: [REGLAS.PASAPORTE_VALIDO],
        notaFinal: 'El Ministerio confía en su profesionalidad. Gloria a Aerolandia.',
        fraudePorcentaje: 0.20,
    },
    {
        dia: 2,
        titulo: 'NUEVAS DIRECTRICES — TARJETA DE EMBARQUE',
        reglas: [
            '🎫 <strong>NUEVA REGLA:</strong> Todo pasajero debe presentar tarjeta de embarque válida.',
            '📅 La <em>fecha</em> de la tarjeta debe corresponder al día de hoy.',
            '🔤 El <em>nombre</em> en la tarjeta debe coincidir exactamente con el pasaporte.',
        ],
        reglasActivas: [REGLAS.PASAPORTE_VALIDO, REGLAS.NOMBRE_COINCIDE, REGLAS.TARJETA_FECHA],
        notaFinal: 'Permanezca atento. El rigor es señal de profesionalidad.',
        fraudePorcentaje: 0.30,
    },
    {
        dia: 3,
        titulo: 'ALERTA DE SEGURIDAD — NIVEL NARANJA',
        reglas: [
            '🧳 <strong>NUEVA REGLA:</strong> Es OBLIGATORIO revisar el equipaje de todos los pasajeros.',
            '🔪 Confisque los objetos prohibidos (armas, explosivos, sustancias ilegales).',
            '💰 El efectivo superior a 10.000€ debe ser declarado.',
            '⚡ Se han detectado intentos de contrabando en los últimos días.',
        ],
        reglasActivas: [REGLAS.PASAPORTE_VALIDO, REGLAS.NOMBRE_COINCIDE, REGLAS.TARJETA_FECHA, REGLAS.EQUIPAJE_INSPECCION],
        notaFinal: 'Máxima alerta. Cualquier descuido puede tener consecuencias graves.',
        fraudePorcentaje: 0.40,
    },
    {
        dia: 4,
        titulo: '🚨 SITUACIÓN DE EMERGENCIA — MÁXIMA ALERTA',
        reglas: [
            '🚨 Se han recibido informes sobre una red de contrabando activa en el aeropuerto.',
            '🔍 Revise TODOS los documentos con la máxima atención.',
            '🌍 Nuevas restricciones de entrada para múltiples nacionalidades.',
            '⚡ El porcentaje de documentación fraudulenta ha aumentado significativamente.',
        ],
        reglasActivas: [REGLAS.PASAPORTE_VALIDO, REGLAS.NOMBRE_COINCIDE, REGLAS.TARJETA_FECHA, REGLAS.EQUIPAJE_INSPECCION, REGLAS.VISA_REQUERIDA],
        notaFinal: 'La seguridad del aeropuerto depende de usted. Gloria al Ministerio.',
        fraudePorcentaje: 0.55,
    },
];

// ============================================================
// FUNCIONES
// ============================================================

/**
 * Obtiene la configuración del día indicado.
 * Si el día no está definido, retorna la del último día disponible.
 * @param {number} dia
 * @returns {ConfigDia}
 */
function getConfigDia(dia) {
    return CONFIGURACION_DIAS.find(c => c.dia === dia)
        ?? CONFIGURACION_DIAS[CONFIGURACION_DIAS.length - 1];
}

/**
 * Genera el HTML del boletín oficial para el día indicado.
 * @param {number} dia
 * @returns {string} HTML listo para insertar
 */
function generarHTMLBoletin(dia) {
    const cfg = getConfigDia(dia);
    const items = cfg.reglas.map(r => `<li class="boletin-item">${r}</li>`).join('');
    return `
        <h4 class="boletin-subtitulo">— ${cfg.titulo} —</h4>
        <ul class="boletin-reglas">${items}</ul>
        <p class="boletin-nota-final"><em>${cfg.notaFinal}</em></p>
    `;
}

/**
 * Comprueba si una regla está activa en el día indicado.
 * @param {string} idRegla - Valor de la enum REGLAS
 * @param {number} dia
 * @returns {boolean}
 */
function reglasActivaEnDia(idRegla, dia) {
    return getConfigDia(dia).reglasActivas.includes(idRegla);
}
