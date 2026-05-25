# Documentación Técnica — Control de Aduanas

**Proyecto:** Juego estilo *Papers Please* ambientado en un aeropuerto  
**Tecnologías:** HTML5 · CSS3 · JavaScript Vanilla (sin frameworks)  
**Versión:** 1.0.0

---

## Arquitectura de Archivos

```
PruebasPaperPlease/
├── index.html            — Estructura HTML (5 pantallas + 1 modal)
├── index.css             — Estilos principales del juego
├── index.js              — Controlador principal (flujo de pantallas)
│
├── js/
│   ├── gameState.js      — Estado global y persistencia (localStorage)
│   ├── dias.js           — Reglas y boletines por día
│   ├── pasajeros.js      — Pool de pasajeros y generador de documentos
│   ├── validacion.js     — Lógica de validación de decisiones
│   ├── timer.js          — Temporizador de turno (90 segundos)
│   └── ui.js             — Renderizado de documentos y HUD
│
├── css/
│   └── documentos.css    — Estilos visuales de pasaporte y tarjeta
│
├── assets/
│   ├── pasajeros/        — Fotos de pasajeros (FUTURO)
│   └── equipaje/         — Imágenes de items de equipaje (FUTURO)
│       └── maleta_fondo.png  — Imagen de maleta abierta (FUTURO)
│
└── docs/
    └── DOCUMENTACION.md  — Este archivo
```

---

## Flujo del Juego

```
Menú ──► Boletín del Día ──► Turno (loop infinito de pasajeros)
  ▲                               │ (timer 90s agotado)
  └──── Boletín siguiente día ◄── Fin de día (guardado automático)
                                       │ (3 avisos)
                                   Game Over
```

---

## Módulos JavaScript

### `js/gameState.js`
Gestiona el estado global de la partida. **Nadie más debe modificar `gameState` directamente.**

| Función | Descripción |
|---------|-------------|
| `getEstado()` | Retorna copia del estado actual |
| `guardarPartida()` | Serializa estado en `localStorage` |
| `cargarDesdeStorage()` | Carga desde `localStorage`, retorna `boolean` |
| `hayPartidaGuardada()` | Comprueba si existe save |
| `getInfoPartidaGuardada()` | Info resumida para el menú (día, créditos, fecha) |
| `reiniciarPartida()` | Resetea a estado inicial (Día 1) |
| `reiniciarContadoresDiarios()` | Resetea contadores del turno actual |
| `avanzarDia()` | Incrementa día y guarda automáticamente |
| `sumarPuntos(cantidad)` | Suma/resta créditos (mínimo 0) |
| `registrarAcierto(creditos)` | Decisión correcta |
| `registrarPenalizacion()` | Aviso. Retorna `true` si el jugador es despedido |
| `incrementarAtendidos()` | Cuenta pasajero procesado |
| `borrarPartidaGuardada()` | Elimina el save del localStorage |

**Constantes de balance:**
```javascript
CREDITOS_DECISION_CORRECTA   = 10   // Por APROBAR/DENEGAR correctamente
CREDITOS_CONFISCAR_CONTRABANDO = 20 // Al confiscar item ilegal en equipaje
PENALIZACION_ITEM_LEGAL      = 5    // Al confiscar item legal por error
MAX_PENALIZACIONES           = 3    // Avisos antes del game over
```

---

### `js/dias.js`
Define las reglas activas y el boletín para cada día.

| Función | Descripción |
|---------|-------------|
| `getConfigDia(dia)` | Configuración del día (o del último si no existe) |
| `generarHTMLBoletin(dia)` | HTML del boletín para insertar en pantalla |
| `reglasActivaEnDia(idRegla, dia)` | Si una regla está activa ese día |

**IDs de reglas (`REGLAS`):**
```javascript
REGLAS.PASAPORTE_VALIDO    // Día 1+: pasaporte no expirado
REGLAS.NOMBRE_COINCIDE     // Día 2+: nombre igual en pasaporte y tarjeta
REGLAS.TARJETA_FECHA       // Día 2+: tarjeta del día actual
REGLAS.EQUIPAJE_INSPECCION // Día 3+: revisar equipaje obligatorio
REGLAS.VISA_REQUERIDA      // Día 4+: visa para ciertas naciones
```

**Para añadir un nuevo día:**
```javascript
// En CONFIGURACION_DIAS de dias.js:
{
    dia: 5,
    titulo: 'TÍTULO DEL BOLETÍN',
    reglas: ['📋 Regla nueva...', '⚠️ Aviso...'],
    reglasActivas: [REGLAS.PASAPORTE_VALIDO, REGLAS.NOMBRE_COINCIDE, /* ... */],
    notaFinal: 'Texto al pie del boletín.',
    fraudePorcentaje: 0.6,  // 60% de pasajeros problemáticos
}
```

---

### `js/pasajeros.js`
Pool de pasajeros predefinidos y generador de documentos completos.

| Función | Descripción |
|---------|-------------|
| `generarPasajero(dia)` | Genera un `PasajeroCompleto` para el día dado |

**Para añadir un pasajero:**
```javascript
// En POOL_PASAJEROS de pasajeros.js:
{ id: 16, nombre: 'Nuevo', apellido: 'Pasajero', nacionalidad: 'Portuguesa',
  genero: 'M', foto: null /* 'assets/pasajeros/16_nuevo.png' */ }
```

**Para añadir foto real al pasajero:**
1. Coloca la imagen en `assets/pasajeros/` (ej: `16_nuevo.png`)
2. Cambia `foto: null` por `foto: 'assets/pasajeros/16_nuevo.png'`

**Para añadir item de equipaje:**
```javascript
// En ITEMS_EQUIPAJE de pasajeros.js:
{ id: 'tijeras', nombre: 'Tijeras', emoji: '✂️', legal: false,
  imagen: null /* 'assets/equipaje/tijeras.png' */,
  descripcion: '⚠️ OBJETO CORTANTE — Prohibido en cabina.' }
```

**Tipo `PasajeroCompleto`:**
```javascript
{
  datos:          DatosPasajero,    // Nombre, apellido, nacionalidad, género, foto
  pasaporte:      Pasaporte,        // Número, fechas, si está expirado
  tarjeta:        TarjetaEmbarque,  // Vuelo, destino, asiento, nombre en tarjeta
  equipaje:       DatosEquipaje,    // Items, tieneContrabando, itemsIlegales
  esValido:       boolean,          // Si todo es correcto
  razonInvalidez: string|null       // 'pasaporte_expirado' | 'nombre_incorrecto' | 'contrabando' | null
}
```

---

### `js/validacion.js`
Valida si la decisión del agente fue correcta.

| Función | Descripción |
|---------|-------------|
| `validarDecision(pasajero, esAprobado, dia, equipajeInspect, contrabandoEncontrado)` | Retorna `ResultadoValidacion` |

**Lógica de validación:**
| Situación | Resultado |
|-----------|-----------|
| APROBAR + pasajero válido | ✅ Correcto (+créditos) |
| DENEGAR + pasajero inválido | ✅ Correcto (+créditos) |
| APROBAR + pasajero inválido | ❌ Error (penalización) |
| DENEGAR + pasajero válido | ❌ Error (penalización) |

**Nota sobre equipaje:** Si el agente encontró contrabando haciendo clic (créditos ya dados en el momento), aprobar al pasajero NO es infracción. Si había contrabando y el agente NO lo encontró, entonces aprobar sí es infracción.

---

### `js/timer.js`
Temporizador de cuenta atrás de 90 segundos por turno.

| Función | Descripción |
|---------|-------------|
| `iniciarTimer(onFinTurno)` | Inicia desde cero con callback |
| `detenerTimer()` | Para y limpia el callback |
| `pausarTimer()` | Pausa sin resetear (para modal equipaje) |
| `reanudarTimer()` | Reanuda desde donde se pausó |
| `getSegundosRestantes()` | Tiempo restante actual |

**Cambiar duración del turno:**
```javascript
// En timer.js, línea 1:
const DURACION_TURNO_SEGUNDOS = 90; // Cambia a los segundos deseados
```

---

### `js/ui.js`
Renderizado de toda la interfaz durante el juego.

| Función | Descripción |
|---------|-------------|
| `mostrarPasajeroEnMesa(pasajero)` | Renderiza todos los documentos y resetea estado |
| `renderizarPasaporte(pasajero)` | HTML visual del pasaporte |
| `renderizarTarjetaEmbarque(pasajero)` | HTML visual de la tarjeta |
| `cambiarTab('pasaporte'\|'tarjeta')` | Cambia panel de documento visible |
| `abrirInspeccionEquipaje()` | Abre modal de equipaje (pausa timer) |
| `cerrarInspeccionEquipaje()` | Cierra modal (reanuda timer) |
| `mostrarSello(esAprobado)` | Sello APROBADO / DENEGADO |
| `ocultarSello()` | Oculta el sello |
| `actualizarHUD()` | Sincroniza HUD con gameState |
| `mostrarFeedbackDecision(resultado)` | Notificación temporal |
| `mostrarFinDia()` | Pantalla de fin de turno con estadísticas |
| `mostrarGameOver(razon)` | Pantalla de game over |
| `getPasajeroActual()` | Getter para index.js |
| `getEquipajeInspeccionado()` | Si el agente abrió el equipaje |
| `seEncontroContrabando()` | Si se confiscó algún item ilegal |

---

### `index.js`
Controlador principal. Gestiona el flujo entre pantallas y coordina módulos.

| Función global | Descripción |
|----------------|-------------|
| `cambiarPantalla(idPantalla)` | Activa una pantalla, oculta el resto |
| `iniciarNuevaPartida()` | Resetea y empieza desde Día 1 |
| `cargarPartidaGuardada()` | Carga save y va al boletín del día guardado |
| `mostrarCreditos()` | Alert con créditos |
| `empezarTurno()` | Inicia el turno: timer + primer pasajero |
| `procesarDecision(esAprobado)` | Valida y aplica APROBAR/DENEGAR |
| `irAlSiguienteDia()` | Desde fin de día, va al boletín siguiente |
| `guardarYSalir()` | Guarda y vuelve al menú |
| `volverAlMenu()` | Vuelve al menú sin guardar |

---

## Sistema de Guardado

**Clave localStorage:** `aeropuertoSaveGame_v1`

**Estructura del save:**
```json
{
  "dia": 3,
  "puntuacion": 145,
  "penalizaciones": 1,
  "pasajerosAtendidos": 12,
  "aciertos": 11,
  "errores": 1,
  "pasajerosHoy": 4,
  "aciertosHoy": 4,
  "erroresHoy": 0,
  "timestamp": "2026-05-25T09:00:00.000Z"
}
```

**El día se guarda automáticamente al finalizar cada turno** (`_finalizarTurno` → `avanzarDia` → `guardarPartida`). Al cargar partida, se continúa directamente en el día guardado.

---

## Cómo Añadir Contenido Futuro

### Fotos de pasajeros
1. Coloca las imágenes en `assets/pasajeros/` (PNG o JPG, idealmente 100×120px)
2. En `POOL_PASAJEROS` de `pasajeros.js`, cambia `foto: null` por la ruta:
   ```javascript
   foto: 'assets/pasajeros/01_carlos.png'
   ```
   El juego mostrará la imagen automáticamente en el pasaporte y en la figura de la mesa.

### Imágenes de equipaje
1. Coloca las imágenes en `assets/equipaje/`
2. En `ITEMS_EQUIPAJE` de `pasajeros.js`, cambia `imagen: null` por la ruta
3. En `abrirInspeccionEquipaje()` de `ui.js`, ya hay comentario con el código a cambiar.

### Imagen de fondo de maleta
1. Coloca `maleta_fondo.png` en `assets/equipaje/`
2. En `index.html`, busca el comentario `FUTURO CON IMAGEN REAL DE MALETA` y sigue las instrucciones.

### Música de fondo
- El HTML ya tiene los elementos `<audio>` comentados:
  - `#audio-menu` → `assets/audio/menu.mp3` (pantalla de menú)
  - `#audio-juego` → `assets/audio/game.mp3` (durante el turno)
- Descomenta los elementos y añade lógica en `empezarTurno()` / `volverAlMenu()`.

---

## Pantallas del Juego

| ID | Nombre | Descripción |
|----|--------|-------------|
| `pantalla-menu` | Menú Principal | Nueva partida, continuar, créditos |
| `pantalla-intro` | Boletín Diario | Nuevas reglas del día, botón para empezar |
| `pantalla-juego` | Juego Principal | Mesa con HUD, documentos, botones |
| `pantalla-fin-dia` | Fin de Turno | Estadísticas del día completado |
| `pantalla-game-over` | Game Over | Se muestra al acumular 3 avisos |
| `modal-equipaje` | Inspección (overlay) | Point & click del equipaje |
