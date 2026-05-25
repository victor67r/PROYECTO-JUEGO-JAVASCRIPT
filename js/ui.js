/**
 * @fileoverview ui.js
 * Renderizado de documentos y gestión visual de la interfaz del juego.
 *
 * Responsabilidades:
 *  - Mostrar pasajero en mesa (foto/silueta + nombre)
 *  - Renderizar pasaporte como documento visual oficial
 *  - Renderizar tarjeta de embarque estilo aerolínea
 *  - Gestionar inspección de equipaje (point & click)
 *  - Mostrar/ocultar sello APROBADO/DENEGADO
 *  - Actualizar HUD
 *  - Mostrar notificaciones de feedback
 */

'use strict';

// ============================================================
// ESTADO INTERNO
// ============================================================

/** @type {PasajeroCompleto|null} */
let _pasajeroActual = null;

/** @type {boolean} Si el agente abrió el equipaje en este turno */
let _equipajeInspeccionado = false;

/** @type {ItemEquipaje[]} Items ilegales confiscados en este turno */
let _ilegalesEncontrados = [];

// ============================================================
// GETTERS PÚBLICOS
// ============================================================

/** @returns {PasajeroCompleto|null} */
function getPasajeroActual()        { return _pasajeroActual; }

/** @returns {boolean} */
function getEquipajeInspeccionado() { return _equipajeInspeccionado; }

/** @returns {boolean} */
function seEncontroContrabando()    { return _ilegalesEncontrados.length > 0; }

// ============================================================
// MOSTRAR PASAJERO EN MESA
// ============================================================

/**
 * Pone un nuevo pasajero en la mesa: renderiza documentos y resetea el estado
 * de inspección del turno anterior.
 * @param {PasajeroCompleto} pasajero
 */
function mostrarPasajeroEnMesa(pasajero) {
    _pasajeroActual        = pasajero;
    _equipajeInspeccionado = false;
    _ilegalesEncontrados   = [];

    _renderizarFiguraPasajero(pasajero);
    renderizarPasaporte(pasajero);
    renderizarTarjetaEmbarque(pasajero);
    cambiarTab('pasaporte');
    ocultarSello();
    _setAccionesHabilitadas(true);
}

/** @private */
function _renderizarFiguraPasajero(pasajero) {
    const fotoEl    = document.getElementById('pasajero-foto');
    const siluetaEl = document.getElementById('pasajero-silueta');
    const nombreEl  = document.getElementById('pasajero-nombre-display');

    if (pasajero.datos.foto) {
        fotoEl.src             = pasajero.datos.foto;
        fotoEl.style.display   = 'block';
        siluetaEl.style.display = 'none';
    } else {
        siluetaEl.textContent   = pasajero.datos.genero === 'F' ? '👩' : '👨';
        fotoEl.style.display    = 'none';
        siluetaEl.style.display = 'block';
    }

    if (nombreEl) {
        nombreEl.textContent = `${pasajero.pasaporte.nombre} ${pasajero.pasaporte.apellido}`;
    }
}

// ============================================================
// RENDER: PASAPORTE
// ============================================================

/**
 * Genera y muestra el HTML visual del pasaporte.
 *
 * El pasaporte muestra:
 *  - Encabezado con escudo y nombre del país
 *  - Foto del pasajero (imagen real o placeholder emoji)
 *  - Campos: apellido, nombre, nacionalidad, sexo, nacimiento, caducidad, nº
 *  - Zona MRZ (Machine Readable Zone) simulada
 *  - Si está expirado: sello visual rojo de CADUCADO
 *
 * @param {PasajeroCompleto} pasajero
 */
function renderizarPasaporte(pasajero) {
    const p = pasajero.pasaporte;

    /*
     * FUTURO con foto real:
     *   Si p.foto tiene ruta, se mostrará <img>. Si es null, se muestra emoji.
     *   Para añadir foto: pon la ruta en POOL_PASAJEROS[n].foto
     */
    const fotoHTML = p.foto
        ? `<img src="${p.foto}" alt="Foto pasajero" class="pasaporte-foto-img">`
        : `<div class="pasaporte-foto-placeholder">${p.genero === 'F' ? '👩' : '👨'}</div>`;

    // MRZ simulada (formato ICAO tipo P)
    const line1 = `P<ARL${p.apellido.toUpperCase().replace(/[ \-]/g,'<')}<<${p.nombre.toUpperCase().replace(/[ \-]/g,'<')}`.padEnd(44,'<').slice(0,44);
    const line2 = (p.numero.toUpperCase() + '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<').slice(0,44);

    document.getElementById('doc-pasaporte').innerHTML = `
        <div class="pasaporte-doc ${p.estaExpirado ? 'pasaporte-doc--expirado' : ''}">
            <div class="pasaporte-cabecera">
                <span class="pasaporte-escudo">🦅</span>
                <div class="pasaporte-titulo-pais">
                    <div class="pasaporte-pais">REINO DE AEROLANDIA</div>
                    <div class="pasaporte-subtipo">PASAPORTE · PASSPORT</div>
                </div>
                <span class="pasaporte-escudo">🦅</span>
            </div>
            <div class="pasaporte-cuerpo">
                <div class="pasaporte-foto-area">
                    ${fotoHTML}
                    <div class="pasaporte-numero-doc">${p.numero}</div>
                </div>
                <div class="pasaporte-datos-area">
                    <div class="pasaporte-campo">
                        <span class="pasaporte-etiqueta">APELLIDOS / SURNAME</span>
                        <span class="pasaporte-valor">${p.apellido.toUpperCase()}</span>
                    </div>
                    <div class="pasaporte-campo">
                        <span class="pasaporte-etiqueta">NOMBRE / GIVEN NAMES</span>
                        <span class="pasaporte-valor">${p.nombre.toUpperCase()}</span>
                    </div>
                    <div class="pasaporte-fila">
                        <div class="pasaporte-campo">
                            <span class="pasaporte-etiqueta">NACIÓN / NATIONALITY</span>
                            <span class="pasaporte-valor">${p.nacionalidad.toUpperCase()}</span>
                        </div>
                        <div class="pasaporte-campo">
                            <span class="pasaporte-etiqueta">SEXO / SEX</span>
                            <span class="pasaporte-valor">${p.genero}</span>
                        </div>
                    </div>
                    <div class="pasaporte-fila">
                        <div class="pasaporte-campo">
                            <span class="pasaporte-etiqueta">FECHA NAC. / DATE OF BIRTH</span>
                            <span class="pasaporte-valor">${p.fechaNacimiento}</span>
                        </div>
                        <div class="pasaporte-campo">
                            <span class="pasaporte-etiqueta">CADUCIDAD / EXPIRY</span>
                            <span class="pasaporte-valor ${p.estaExpirado ? 'valor--error' : ''}">${p.fechaExpiracion}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pasaporte-mrz">
                <div class="mrz-linea">${line1}</div>
                <div class="mrz-linea">${line2}</div>
            </div>
            ${p.estaExpirado ? '<div class="pasaporte-sello-caducado">⚠ CADUCADO</div>' : ''}
        </div>`;
}

// ============================================================
// RENDER: TARJETA DE EMBARQUE
// ============================================================

/**
 * Genera y muestra el HTML de la tarjeta de embarque.
 *
 * La tarjeta muestra:
 *  - Header de aerolínea
 *  - Nombre del pasajero (rojo si no coincide con pasaporte)
 *  - Ruta con códigos IATA y ciudades
 *  - Detalles: vuelo, fecha, hora embarque, puerta
 *  - Stub (sección desprendible): asiento grande + código de barras simulado
 *  - Si el nombre no coincide: aviso visual en rojo al pie
 *
 * @param {PasajeroCompleto} pasajero
 */
function renderizarTarjetaEmbarque(pasajero) {
    const t = pasajero.tarjeta;
    const p = pasajero.pasaporte;

    const nomPas = `${p.nombre} ${p.apellido}`.toLowerCase().trim();
    const nomTar = t.nombrePasajero.toLowerCase().trim();
    const nombreDif = nomPas !== nomTar;

    // Código de barras simulado con divs de ancho variable
    const barcode = Array.from({ length: 28 }, () =>
        `<span class="barcode-barra" style="width:${Math.random() < 0.4 ? 2 : 1}px"></span>`
    ).join('');

    document.getElementById('doc-tarjeta').innerHTML = `
        <div class="tarjeta-doc">
            <div class="tarjeta-header">
                <span class="tarjeta-aerolinea">✈ AEROLANDIA AIR</span>
                <span class="tarjeta-titulo-doc">BOARDING PASS / TARJETA DE EMBARQUE</span>
            </div>
            <div class="tarjeta-cuerpo">
                <div class="tarjeta-left">
                    <div class="tarjeta-campo">
                        <span class="tarjeta-etiqueta">PASAJERO / PASSENGER</span>
                        <span class="tarjeta-valor ${nombreDif ? 'valor--error' : ''}">${t.nombrePasajero.toUpperCase()}</span>
                    </div>
                    <div class="tarjeta-ruta">
                        <div class="tarjeta-aeropuerto">
                            <div class="tarjeta-iata">${t.codigoOrigen}</div>
                            <div class="tarjeta-ciudad">${t.origen}</div>
                        </div>
                        <div class="tarjeta-flecha">✈ ─ ─ ─</div>
                        <div class="tarjeta-aeropuerto">
                            <div class="tarjeta-iata">${t.codigoDestino}</div>
                            <div class="tarjeta-ciudad">${t.destino}</div>
                        </div>
                    </div>
                    <div class="tarjeta-detalles">
                        <div class="tarjeta-detalle-item">
                            <span class="tarjeta-etiqueta">VUELO</span>
                            <span class="tarjeta-valor">${t.numeroVuelo}</span>
                        </div>
                        <div class="tarjeta-detalle-item">
                            <span class="tarjeta-etiqueta">FECHA</span>
                            <span class="tarjeta-valor">${t.fechaVuelo}</span>
                        </div>
                        <div class="tarjeta-detalle-item">
                            <span class="tarjeta-etiqueta">EMBARQUE</span>
                            <span class="tarjeta-valor">${t.horaEmbarque}</span>
                        </div>
                        <div class="tarjeta-detalle-item">
                            <span class="tarjeta-etiqueta">PUERTA</span>
                            <span class="tarjeta-valor">${t.puerta}</span>
                        </div>
                    </div>
                </div>
                <div class="tarjeta-divider"><div class="tarjeta-perforacion"></div></div>
                <div class="tarjeta-stub">
                    <div class="stub-asiento-label">ASIENTO</div>
                    <div class="stub-asiento">${t.asiento}</div>
                    <div class="stub-vuelo">${t.numeroVuelo}</div>
                    <div class="stub-barcode">
                        <div class="barcode-barras">${barcode}</div>
                        <div class="barcode-numero">${t.numeroVuelo}${t.asiento}</div>
                    </div>
                </div>
            </div>
            ${nombreDif ? '<div class="tarjeta-alerta">⚠ NOMBRE NO COINCIDE CON PASAPORTE</div>' : ''}
        </div>`;
}

// ============================================================
// GESTIÓN DE PESTAÑAS
// ============================================================

/**
 * Cambia el panel de documento visible.
 * El tab de equipaje es especial (abre modal, no panel).
 * @param {'pasaporte'|'tarjeta'} tab
 */
function cambiarTab(tab) {
    document.querySelectorAll('.documento-panel').forEach(p => p.classList.remove('activo'));
    document.querySelectorAll('.pestana').forEach(t => t.classList.remove('activa'));
    const panel = document.getElementById(`doc-${tab}`);
    const tabEl = document.getElementById(`tab-${tab}`);
    if (panel) panel.classList.add('activo');
    if (tabEl) tabEl.classList.add('activa');
}

// ============================================================
// INSPECCIÓN DE EQUIPAJE (Point & Click)
// ============================================================

/**
 * Abre el modal de inspección de equipaje para el pasajero actual.
 *
 * Muestra una "maleta abierta" con todos los items clickables:
 *  - Click en item ILEGAL: confiscado → créditos extra inmediatos
 *  - Click en item LEGAL:  penalización leve (error del agente)
 *
 * ──────────────────────────────────────────────────────────────
 * FUTURO CON IMÁGENES REALES:
 *   1. Añade la imagen de la maleta abierta en 'assets/equipaje/maleta_fondo.png'
 *   2. Reemplaza el div.maleta-interior por:
 *         <div class="maleta-interior" style="background-image:url(...)">
 *   3. Para cada item con 'imagen', usa <img> posicionado absolutamente.
 *   4. Puedes ocultar items ilegales debajo de otros para más realismo.
 * ──────────────────────────────────────────────────────────────
 */
function abrirInspeccionEquipaje() {
    if (!_pasajeroActual) return;

    pausarTimer();
    _equipajeInspeccionado = true;
    _ilegalesEncontrados   = [];
    _actualizarContadoresEquipaje();

    const grid = document.getElementById('items-equipaje-grid');
    grid.innerHTML = '';

    _pasajeroActual.equipaje.items.forEach(item => {
        const el = document.createElement('div');
        el.className  = `item-equipaje ${item.legal ? 'item--legal' : 'item--ilegal'}`;
        el.dataset.id = item.id;
        el.title      = item.descripcion;

        /*
         * FUTURO con imagen real: reemplaza el innerHTML por:
         *   el.innerHTML = `
         *     <img src="${item.imagen}" class="item-img" alt="${item.nombre}">
         *     <span class="item-nombre">${item.nombre}</span>`;
         * Si el item ilegal va oculto dentro de ropa, añade clase 'item--oculto'
         * y muéstralo solo al hacer clic en una zona específica.
         */
        el.innerHTML = `
            <div class="item-visual">${item.emoji}</div>
            <div class="item-nombre">${item.nombre}</div>`;

        el.addEventListener('click', () => _onClickItemEquipaje(item, el));
        grid.appendChild(el);
    });

    document.getElementById('modal-equipaje').style.display = 'flex';
}

/**
 * Maneja el click sobre un item del equipaje.
 * @private
 * @param {ItemEquipaje} item
 * @param {HTMLElement}  el
 */
function _onClickItemEquipaje(item, el) {
    if (el.classList.contains('item--confiscado')) return;

    el.classList.add('item--confiscado');
    el.style.pointerEvents = 'none';

    if (!item.legal) {
        _ilegalesEncontrados.push(item);
        el.classList.add('item--ilegal-encontrado');
        sumarPuntos(CREDITOS_CONFISCAR_CONTRABANDO);
        _mostrarFeedbackItem(el, `+${CREDITOS_CONFISCAR_CONTRABANDO}€ ¡CONFISCADO!`, true);
    } else {
        el.classList.add('item--legal-error');
        sumarPuntos(-PENALIZACION_ITEM_LEGAL);
        _mostrarFeedbackItem(el, `-${PENALIZACION_ITEM_LEGAL}€ Item legal`, false);
    }

    actualizarHUD();
    _actualizarContadoresEquipaje();

    // Animar desaparición
    setTimeout(() => {
        el.style.transition = 'opacity 0.3s, transform 0.3s';
        el.style.opacity    = '0';
        el.style.transform  = 'scale(0.4) rotate(15deg)';
    }, 700);
}

/** @private */
function _mostrarFeedbackItem(el, texto, esExito) {
    const fb = document.createElement('div');
    fb.className   = `item-feedback ${esExito ? 'item-feedback--exito' : 'item-feedback--error'}`;
    fb.textContent = texto;
    el.appendChild(fb);
    setTimeout(() => fb.remove(), 1200);
}

/** @private */
function _actualizarContadoresEquipaje() {
    const totalIleg = _pasajeroActual?.equipaje.itemsIlegales.length ?? 0;
    const encontrados  = document.querySelectorAll('.item--ilegal-encontrado').length;
    const legalesErr   = document.querySelectorAll('.item--legal-error').length;
    const elConf = document.getElementById('count-confiscados');
    const elErr  = document.getElementById('count-errores-eq');
    if (elConf) elConf.textContent = `${encontrados}/${totalIleg}`;
    if (elErr)  elErr.textContent  = legalesErr;
}

/** Cierra el modal y reanuda el timer. */
function cerrarInspeccionEquipaje() {
    document.getElementById('modal-equipaje').style.display = 'none';
    reanudarTimer();
}

// ============================================================
// SELLO APROBADO / DENEGADO
// ============================================================

/**
 * Muestra el sello visual sobre los documentos.
 * @param {boolean} esAprobado
 */
function mostrarSello(esAprobado) {
    const overlay = document.getElementById('sello-overlay');
    const texto   = document.getElementById('sello-texto');
    if (!overlay || !texto) return;

    texto.textContent = esAprobado ? '✈ APROBADO' : '✖ DENEGADO';
    texto.className   = `sello-texto ${esAprobado ? 'sello--aprobado' : 'sello--denegado'}`;
    overlay.style.display = 'flex';
    overlay.style.opacity = '0';
    requestAnimationFrame(() => {
        overlay.style.transition = 'opacity 0.15s';
        overlay.style.opacity    = '1';
    });
}

/** Oculta el sello. */
function ocultarSello() {
    const overlay = document.getElementById('sello-overlay');
    if (overlay) overlay.style.display = 'none';
}

// ============================================================
// HUD
// ============================================================

/**
 * Actualiza todos los elementos del HUD con el estado actual.
 * Llamar tras cualquier cambio en gameState.
 */
function actualizarHUD() {
    const e = getEstado();
    const diaEl = document.getElementById('hud-dia');
    const punEl = document.getElementById('hud-puntuacion');
    const atEl  = document.getElementById('hud-atendidos');

    if (diaEl) diaEl.textContent = e.dia;
    if (punEl) punEl.textContent = `${e.puntuacion} €`;
    if (atEl)  atEl.textContent  = e.pasajerosHoy;

    // Indicadores de penalización
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`pen-${i}`);
        if (dot) {
            dot.classList.toggle('penalty-dot--activo', i <= e.penalizaciones);
            dot.classList.toggle('penalty-dot--vacio',  i >  e.penalizaciones);
        }
    }
}

// ============================================================
// FEEDBACK DE DECISIÓN
// ============================================================

/**
 * Muestra una notificación temporal con el resultado de la decisión.
 * Se autodestruye tras ~2 segundos.
 * @param {ResultadoValidacion} resultado
 */
function mostrarFeedbackDecision(resultado) {
    const notif = document.createElement('div');
    notif.className = `notificacion ${resultado.tipo === 'exito' ? 'notif--exito' : 'notif--error'}`;
    notif.innerHTML = `
        <div class="notif-mensaje">${resultado.mensaje}</div>
        ${resultado.creditos > 0 ? `<div class="notif-creditos">+${resultado.creditos} €</div>` : ''}`;

    document.body.appendChild(notif);
    requestAnimationFrame(() => notif.classList.add('notif--visible'));

    setTimeout(() => {
        notif.classList.remove('notif--visible');
        setTimeout(() => notif.remove(), 400);
    }, 2200);
}

// ============================================================
// PANTALLAS FIN DE DÍA / GAME OVER
// ============================================================

/** Muestra la pantalla de fin de día con estadísticas del turno. */
function mostrarFinDia() {
    const e = getEstado();
    // avanzarDia() ya incrementó e.dia, por eso mostramos dia - 1
    document.getElementById('fin-dia-numero').textContent  = e.dia - 1;
    document.getElementById('fin-atendidos').textContent   = e.pasajerosHoy;
    document.getElementById('fin-aciertos').textContent    = e.aciertosHoy;
    document.getElementById('fin-errores').textContent     = e.erroresHoy;
    document.getElementById('fin-puntuacion').textContent  = `${e.puntuacion} €`;
    cambiarPantalla('pantalla-fin-dia');
}

/**
 * Muestra la pantalla de game over.
 * @param {string} razon - Mensaje explicando la causa
 */
function mostrarGameOver(razon) {
    const e = getEstado();
    document.getElementById('game-over-razon').textContent = razon;
    document.getElementById('go-dia').textContent          = e.dia;
    document.getElementById('go-puntuacion').textContent   = e.puntuacion;
    cambiarPantalla('pantalla-game-over');
}

// ============================================================
// UTILIDADES
// ============================================================

/** @private */
function _setAccionesHabilitadas(habilitado) {
    const btnA = document.getElementById('btn-aprobar');
    const btnD = document.getElementById('btn-denegar');
    if (btnA) btnA.disabled = !habilitado;
    if (btnD) btnD.disabled = !habilitado;
}
