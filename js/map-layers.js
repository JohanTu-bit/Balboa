// ═══════════════════════════════════════════════════════
//  SIG AMIGO | map-layers.js — Lógica Geográfica
//  Balboa – Risaralda | EPSG:4326
//
//  MODO DEMO: datos mock integrados.
//  Para conectar al backend Django+PostGIS, busca los
//  comentarios marcados con [DJANGO] y descomenta.
// ═══════════════════════════════════════════════════════

// ── 1. INICIALIZAR MAPA ──────────────────────────────────
const map = L.map('map-placeholder', {
    zoomControl: true,
    attributionControl: true,
}).setView([4.9511, -75.8883], 15);

// Posicionar el control de zoom (abajo derecha)
map.zoomControl.setPosition('bottomright');

// Exponer instancia para main.js
window.mapInstance = map;

// ── 2. CAPAS BASE ────────────────────────────────────────
const capaTopografica = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
    }
).addTo(map);

const capaSatelital = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Esri, Maxar, GeoEye, Earthstar Geographics',
        maxZoom: 19,
    }
);

// Función pública para cambiar capa base (llamada desde main.js)
window.switchBasemap = function(tipo) {
    if (tipo === 'sat') {
        map.removeLayer(capaTopografica);
        capaSatelital.addTo(map);
    } else {
        map.removeLayer(capaSatelital);
        capaTopografica.addTo(map);
    }
};

// ── 3. ESTILOS POR TIPO DE CAPA ──────────────────────────
const estilos = {
    perimetro: {
        color: '#10b981',
        weight: 2.5,
        fillColor: '#34d399',
        fillOpacity: 0.12,
        dashArray: null,
    },
    riesgo: {
        color: '#ef4444',
        weight: 2,
        fillColor: '#fca5a5',
        fillOpacity: 0.25,
        dashArray: '6 4',
    },
    forestal: {
        color: '#059669',
        weight: 2,
        fillColor: '#6ee7b7',
        fillOpacity: 0.3,
        dashArray: null,
    },
    catastro: {
        color: '#f59e0b',
        weight: 1.5,
        fillColor: '#fde68a',
        fillOpacity: 0.2,
        dashArray: null,
    },
};

// ── 4. GEOMETRÍAS DEMO (GeoJSON) ─────────────────────────
//  Polígonos simplificados centrados en Balboa, Risaralda.
//  [DJANGO] Reemplazar cada "geometriaMock_*" con el fetch()
//  correspondiente a tu API.

const geometriaMock_perimetro = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        properties: {
            nombre:     'Perímetro Urbano Balboa',
            area:       '42.5',
            hectareas:  '4.25',
            municipio:  'Balboa',
        },
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [-75.8940, 4.9560],
                [-75.8820, 4.9560],
                [-75.8820, 4.9455],
                [-75.8940, 4.9455],
                [-75.8940, 4.9560],
            ]],
        },
    }],
};

const geometriaMock_riesgo = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                nombre:  'Zona de Riesgo Alta – Ladera Norte',
                tipo:    'Deslizamiento',
                nivel:   'Alto',
                area:    '8.3',
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-75.8910, 4.9545],
                    [-75.8870, 4.9545],
                    [-75.8870, 4.9510],
                    [-75.8910, 4.9510],
                    [-75.8910, 4.9545],
                ]],
            },
        },
        {
            type: 'Feature',
            properties: {
                nombre:  'Zona de Inundación – Río Risaralda',
                tipo:    'Inundación',
                nivel:   'Medio',
                area:    '5.1',
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-75.8860, 4.9480],
                    [-75.8830, 4.9480],
                    [-75.8830, 4.9460],
                    [-75.8860, 4.9460],
                    [-75.8860, 4.9480],
                ]],
            },
        },
    ],
};

const geometriaMock_forestal = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        properties: {
            nombre:    'Reserva Forestal Municipal',
            cobertura: 'Bosque Secundario',
            especies:  '120',
            area:      '280.4',
        },
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [-75.8960, 4.9590],
                [-75.8900, 4.9600],
                [-75.8840, 4.9570],
                [-75.8830, 4.9530],
                [-75.8880, 4.9510],
                [-75.8950, 4.9520],
                [-75.8960, 4.9590],
            ]],
        },
    }],
};

const geometriaMock_catastro = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                referencia: '66075-01-001',
                uso:        'Habitacional',
                area:       '145.2',
                hectareas:  '0.0145',
                pisos:      '3',
                municipio:  'Balboa',
                tipoSuelo:  'Suelo Urbano',
                avaluo:     48500000,
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-75.8895, 4.9522],
                    [-75.8890, 4.9522],
                    [-75.8890, 4.9518],
                    [-75.8895, 4.9518],
                    [-75.8895, 4.9522],
                ]],
            },
        },
        {
            type: 'Feature',
            properties: {
                referencia: '66075-01-002',
                uso:        'Comercial',
                area:       '210.0',
                hectareas:  '0.021',
                pisos:      '2',
                municipio:  'Balboa',
                tipoSuelo:  'Suelo Urbano',
                avaluo:     72000000,
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-75.8885, 4.9515],
                    [-75.8878, 4.9515],
                    [-75.8878, 4.9510],
                    [-75.8885, 4.9510],
                    [-75.8885, 4.9515],
                ]],
            },
        },
        {
            type: 'Feature',
            properties: {
                referencia: '66075-02-001',
                uso:        'Agropecuario',
                area:       '8420.0',
                hectareas:  '0.842',
                pisos:      '1',
                municipio:  'Balboa',
                tipoSuelo:  'Suelo Rural',
                avaluo:     35000000,
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-75.8920, 4.9495],
                    [-75.8900, 4.9495],
                    [-75.8900, 4.9480],
                    [-75.8920, 4.9480],
                    [-75.8920, 4.9495],
                ]],
            },
        },
    ],
};

// ── 5. REFERENCIAS A CAPAS ACTIVAS ───────────────────────
let capaPerimetro  = null;
let capaRiesgo     = null;
let capaForestal   = null;
let capaCatastro   = null;

// ── 6. FUNCIÓN GENÉRICA: CARGAR CAPA GEOJSON ────────────
//
//  [DJANGO] Para conectar al backend, cambia `datos` por:
//
//  const res = await fetch('http://localhost:8000/admin/capas/dptolimite/');
//  const datos = await res.json();
//
//  El resto de la función permanece igual.

function cargarCapaGeoJSON(datos, estilo, opcionesClick) {
    return L.geoJSON(datos, {
        style: estilo,
        onEachFeature: (feature, layer) => {
            const p = feature.properties;

            // Tooltip siempre visible al hover
            layer.bindTooltip(p.nombre || p.referencia || 'Sin nombre', {
                sticky: true,
                className: 'sig-tooltip',
            });

            // Highlight al pasar el cursor
            layer.on('mouseover', function() {
                this.setStyle({ weight: estilo.weight + 1.5, fillOpacity: Math.min(estilo.fillOpacity + 0.15, 0.6) });
            });
            layer.on('mouseout', function() {
                this.setStyle(estilo);
            });

            // Clic: lógica personalizada según capa
            if (opcionesClick) {
                layer.on('click', (e) => {
                    opcionesClick(p, e);
                    L.DomEvent.stopPropagation(e);
                });
            }
        },
    }).addTo(map);
}

// ── 7. LÓGICA DE CLIC POR TIPO DE CAPA ──────────────────

function clickPerimetro(p) {
    if (window.abrirDetallePredio) {
        window.abrirDetallePredio({
            referencia: p.referencia || '66075-00-000',
            tipoSuelo:  'Límite Municipal',
            uso:        'Área Urbana',
            area:       p.area       || '—',
            areaC:      p.hectareas  || '—',
            pisos:      '—',
            municipio:  p.municipio  || 'Balboa',
        });
    }
}

function clickRiesgo(p) {
    const nivelColor = { Alto: '#ef4444', Medio: '#f59e0b', Bajo: '#10b981' };
    if (window.abrirDetallePredio) {
        window.abrirDetallePredio({
            referencia: p.nombre     || 'Zona de Riesgo',
            tipoSuelo:  `Riesgo ${p.nivel || ''}`,
            uso:        p.tipo       || '—',
            area:       p.area       || '—',
            areaC:      '—',
            pisos:      '—',
            municipio:  'Balboa',
        });
    }
}

function clickForestal(p) {
    if (window.abrirDetallePredio) {
        window.abrirDetallePredio({
            referencia: 'RFM-001',
            tipoSuelo:  'Suelo de Protección',
            uso:        p.cobertura  || 'Forestal',
            area:       p.area       || '—',
            areaC:      `${p.especies || '—'} spp`,
            pisos:      '—',
            municipio:  'Balboa',
        });
    }
}

function clickCatastro(p) {
    if (window.abrirDetallePredio) {
        window.abrirDetallePredio({
            referencia: p.referencia,
            tipoSuelo:  p.tipoSuelo  || 'Suelo Urbano',
            uso:        p.uso        || 'Habitacional',
            area:       p.area,
            areaC:      (parseFloat(p.area) * 0.68).toFixed(1),
            pisos:      p.pisos,
            municipio:  p.municipio  || 'Balboa',
            avaluo:     p.avaluo,
        });
    }
}

// ── 8. TOGGLES DE CAPAS (checkboxes del panel) ──────────

document.getElementById('check-limites').addEventListener('change', async (e) => {
    if (e.target.checked) {
        // [DJANGO] const data = await fetchCapa('perimetro');
        capaPerimetro = cargarCapaGeoJSON(
            geometriaMock_perimetro,
            estilos.perimetro,
            clickPerimetro
        );
        if (window.mostrarToast) window.mostrarToast('Perímetro urbano cargado', 'success');
    } else {
        if (capaPerimetro) { map.removeLayer(capaPerimetro); capaPerimetro = null; }
    }
});

document.getElementById('check-riesgo').addEventListener('change', async (e) => {
    if (e.target.checked) {
        capaRiesgo = cargarCapaGeoJSON(
            geometriaMock_riesgo,
            estilos.riesgo,
            clickRiesgo
        );
        if (window.mostrarToast) window.mostrarToast('Zonas de riesgo cargadas', 'success');
    } else {
        if (capaRiesgo) { map.removeLayer(capaRiesgo); capaRiesgo = null; }
    }
});

document.getElementById('check-forestal').addEventListener('change', async (e) => {
    if (e.target.checked) {
        capaForestal = cargarCapaGeoJSON(
            geometriaMock_forestal,
            estilos.forestal,
            clickForestal
        );
        if (window.mostrarToast) window.mostrarToast('Reserva forestal cargada', 'success');
    } else {
        if (capaForestal) { map.removeLayer(capaForestal); capaForestal = null; }
    }
});

document.getElementById('check-catastro').addEventListener('change', async (e) => {
    if (e.target.checked) {
        capaCatastro = cargarCapaGeoJSON(
            geometriaMock_catastro,
            estilos.catastro,
            clickCatastro
        );
        if (window.mostrarToast) window.mostrarToast('Catastro predial cargado', 'success');
    } else {
        if (capaCatastro) { map.removeLayer(capaCatastro); capaCatastro = null; }
    }
});

// ── 9. CARGA AUTOMÁTICA DE CAPA POR DEFECTO ──────────────
//  Carga el perímetro al iniciar (el checkbox viene marcado en el HTML)

window.addEventListener('load', () => {
    const checkLimites = document.getElementById('check-limites');
    if (checkLimites && checkLimites.checked) {
        capaPerimetro = cargarCapaGeoJSON(
            geometriaMock_perimetro,
            estilos.perimetro,
            clickPerimetro
        );
    }
});

// ── 10. HERRAMIENTA DE MEDICIÓN ──────────────────────────
let puntosMedicion = [];
let lineaMedicion  = null;
let markersMedicion = [];

window.toggleMedicion = function(activo) {
    if (!activo) {
        // Limpiar medición
        if (lineaMedicion) { map.removeLayer(lineaMedicion); lineaMedicion = null; }
        markersMedicion.forEach(m => map.removeLayer(m));
        markersMedicion = [];
        puntosMedicion  = [];
        map.off('click', onClickMedicion);
    } else {
        map.on('click', onClickMedicion);
    }
};

function onClickMedicion(e) {
    const latlng = e.latlng;
    puntosMedicion.push(latlng);

    // Marker en cada punto
    const m = L.circleMarker(latlng, {
        radius: 5, color: '#f59e0b', fillColor: '#fde68a',
        fillOpacity: 1, weight: 2,
    }).addTo(map);
    markersMedicion.push(m);

    // Redibujar línea
    if (lineaMedicion) map.removeLayer(lineaMedicion);

    if (puntosMedicion.length > 1) {
        lineaMedicion = L.polyline(puntosMedicion, {
            color: '#f59e0b', weight: 2.5, dashArray: '8 4',
        }).addTo(map);

        // Calcular distancia total
        let dist = 0;
        for (let i = 1; i < puntosMedicion.length; i++) {
            dist += puntosMedicion[i-1].distanceTo(puntosMedicion[i]);
        }

        const label = dist < 1000
            ? `${dist.toFixed(1)} m`
            : `${(dist / 1000).toFixed(3)} km`;

        if (window.mostrarToast) window.mostrarToast(`Distancia: ${label}`, 'info');
    }
}

// ── 11. HELPER: FETCH AL BACKEND DJANGO ──────────────────
//  [DJANGO] Descomentar cuando el backend esté disponible.
//
//  async function fetchCapa(nombre) {
//      try {
//          const res = await fetch(`http://localhost:8000/admin/capas/dptolimite/`);
//          if (!res.ok) throw new Error(`HTTP ${res.status}`);
//          return await res.json();
//      } catch (err) {
//          console.error(`Error cargando capa "${nombre}":`, err);
//          if (window.mostrarToast) window.mostrarToast(`Error cargando ${nombre}`, 'error');
//          return null;
//      }
//  }

// ── 12. ESTILO TOOLTIP LEAFLET (inyectado via JS) ────────
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .sig-tooltip {
        background: rgba(255,255,255,0.95) !important;
        border: 1px solid rgba(255,255,255,0.6) !important;
        border-radius: 10px !important;
        padding: 6px 12px !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        color: #1e293b !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
        backdrop-filter: blur(8px) !important;
    }
    .sig-tooltip::before { display: none !important; }
`;
document.head.appendChild(tooltipStyle);