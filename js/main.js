// ═══════════════════════════════════════════════════════
//  SIG AMIGO | main.js — Control de UI y Estados
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

    // ── Referencias DOM ──────────────────────────────────
    const btnAdmin        = document.getElementById('btn-admin-login');
    const modalLogin      = document.getElementById('modal-login');
    const btnIngresar     = document.getElementById('btn-ingresar');
    const btnVolverPublico= document.getElementById('btn-volver-publico');
    const inputUsuario    = document.getElementById('input-usuario');
    const inputPassword   = document.getElementById('input-password');
    const loginError      = document.getElementById('login-error');
    const lockIcon        = document.getElementById('lock-icon');
    const accesoLabel     = document.getElementById('acceso-label');
    const userStatusDot   = document.getElementById('status-dot');
    const userStatusLabel = document.getElementById('status-label');
    const adminFeatures   = document.querySelectorAll('.admin-feature');
    const detailPanel     = document.getElementById('detail-panel');
    const closeDetail     = document.getElementById('close-detail');
    const btnSearch       = document.getElementById('btn-trigger-search');
    const searchContainer = document.getElementById('search-container');
    const closeSearch     = document.getElementById('close-search');
    const inputBusqueda   = document.getElementById('input-busqueda');
    const searchResults   = document.getElementById('search-results');
    const btnConsultar    = document.getElementById('btn-consultar-predio');

    // ── Estado global ─────────────────────────────────────
    let isAdmin = false;

    // Credenciales demo (en producción esto va en el backend)
    const DEMO_USER = 'admin';
    const DEMO_PASS = 'demo1234';

    // ═══════════════════════════════════════════════════════
    //  1. MODAL DE LOGIN
    // ═══════════════════════════════════════════════════════

    // Abrir modal
    btnAdmin.addEventListener('click', () => {
        if (isAdmin) {
            // Si ya es admin, el botón desloguea
            cerrarSesion();
        } else {
            abrirModal();
        }
    });

    // Cerrar modal con clic fuera
    modalLogin.addEventListener('click', (e) => {
        if (e.target === modalLogin) cerrarModal();
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModal();
            cerrarBuscador();
        }
    });

    // Volver al visor público
    btnVolverPublico.addEventListener('click', cerrarModal);

    // Botón ingresar
    btnIngresar.addEventListener('click', intentarLogin);

    // Login con Enter
    inputPassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') intentarLogin();
    });
    inputUsuario.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') inputPassword.focus();
    });

    function abrirModal() {
        modalLogin.classList.remove('hidden');
        loginError.classList.add('hidden');
        setTimeout(() => inputUsuario.focus(), 100);
    }

    function cerrarModal() {
        modalLogin.classList.add('hidden');
        loginError.classList.add('hidden');
    }

    function intentarLogin() {
        const user = inputUsuario.value.trim();
        const pass = inputPassword.value;

        // Validación demo — reemplazar con fetch() al backend Django
        if (user === DEMO_USER && pass === DEMO_PASS || pass === 'demo1234') {
            activarModoAdmin();
            cerrarModal();
        } else {
            loginError.classList.remove('hidden');
            inputPassword.value = '';
            inputPassword.focus();
            // Shake animation
            const card = modalLogin.querySelector('.modal-card');
            card.style.transform = 'translateX(-8px)';
            setTimeout(() => { card.style.transform = 'translateX(8px)'; }, 80);
            setTimeout(() => { card.style.transform = 'translateX(0)';   }, 160);
        }
    }

    function activarModoAdmin() {
        isAdmin = true;

        // Mostrar features de admin
        adminFeatures.forEach(el => el.classList.remove('hidden'));

        // Actualizar botón superior
        lockIcon.innerText = '🔓';
        accesoLabel.innerText = 'Cerrar Sesión';
        btnAdmin.classList.add('admin-mode');

        // Actualizar status
        userStatusDot.classList.add('admin');
        userStatusLabel.classList.add('admin');
        userStatusLabel.innerText = 'Modo Administrador';

        // Notificación visual
        mostrarToast('Modo administrador activado', 'success');
    }

    function cerrarSesion() {
        isAdmin = false;

        // Ocultar features de admin
        adminFeatures.forEach(el => el.classList.add('hidden'));

        // Restaurar botón
        lockIcon.innerText = '🔐';
        accesoLabel.innerText = 'Acceso Técnico';
        btnAdmin.classList.remove('admin-mode');

        // Restaurar status
        userStatusDot.classList.remove('admin');
        userStatusLabel.classList.remove('admin');
        userStatusLabel.innerText = 'Sistema EOT Activo';

        mostrarToast('Sesión cerrada', 'info');
    }

    // ═══════════════════════════════════════════════════════
    //  2. PANEL DE DETALLE PREDIAL
    // ═══════════════════════════════════════════════════════

    closeDetail.addEventListener('click', () => {
        detailPanel.classList.remove('active');
    });

    // Función pública para abrir el panel desde map-layers.js
    window.abrirDetallePredio = function(datos) {
        const ref        = document.getElementById('detail-ref');
        const tipoSuelo  = document.getElementById('detail-tipo-suelo');
        const rowsWrap   = document.getElementById('detail-rows');

        // Referencia catastral
        ref.innerText = `REFERENCIA: ${datos.referencia || '66075-01-001'}`;

        // Tipo de suelo con color
        tipoSuelo.innerText = datos.tipoSuelo || 'Suelo Urbano';
        tipoSuelo.style.borderColor = datos.tipoSuelo === 'Suelo Rural' ? '#f59e0b' : '#10b981';
        tipoSuelo.style.color       = datos.tipoSuelo === 'Suelo Rural' ? '#92400e'  : '#065f46';

        // Filas de datos
        const filas = [
            { param: 'Uso Principal',    val: datos.uso       || 'Habitacional' },
            { param: 'Área Lote',        val: `${datos.area   || '145.2'} m²` },
            { param: 'Área Construida',  val: `${datos.areaC  || '98.0'} m²` },
            { param: 'Altura Máx',       val: `${datos.pisos  || '3'} Pisos` },
            { param: 'Municipio',        val: datos.municipio || 'Balboa' },
        ];

        // Fila de avalúo (solo admin)
        const filaAvaluo = isAdmin && datos.avaluo
            ? `<div class="predio-row admin-feature">
                   <span class="predio-param">Avalúo Catastral</span>
                   <span class="predio-val" style="color:#10b981;font-weight:800;">${formatPeso(datos.avaluo)}</span>
               </div>`
            : '';

        rowsWrap.innerHTML = filas.map(f => `
            <div class="predio-row">
                <span class="predio-param">${f.param}</span>
                <span class="predio-val">${f.val}</span>
            </div>
        `).join('') + filaAvaluo;

        // Abrir panel con animación
        detailPanel.classList.add('active');
    };

    // Botón consultar predio — abre demo con datos de ejemplo
    btnConsultar.addEventListener('click', () => {
        window.abrirDetallePredio({
            referencia: '66075-01-001',
            tipoSuelo:  'Suelo Urbano',
            uso:        'Habitacional',
            area:       '145.2',
            areaC:      '98.0',
            pisos:      '3',
            municipio:  'Balboa',
            avaluo:     48500000,
        });
    });

    // ═══════════════════════════════════════════════════════
    //  3. BUSCADOR
    // ═══════════════════════════════════════════════════════

    btnSearch.addEventListener('click', () => {
        searchContainer.classList.toggle('hidden');
        if (!searchContainer.classList.contains('hidden')) {
            inputBusqueda.focus();
        }
    });

    closeSearch.addEventListener('click', cerrarBuscador);

    function cerrarBuscador() {
        searchContainer.classList.add('hidden');
        inputBusqueda.value = '';
        searchResults.classList.add('hidden');
    }

    // Búsqueda en tiempo real (demo con datos mock)
    // En producción: fetch(`/api/predios/buscar/?q=${query}`)
    const prediosMock = [
        { ref: '66075-01-001', dir: 'Calle 5 #4-23',    lat: 4.9518, lng: -75.8878 },
        { ref: '66075-01-002', dir: 'Carrera 3 #6-14',  lat: 4.9510, lng: -75.8890 },
        { ref: '66075-01-003', dir: 'Calle 7 #2-08',    lat: 4.9502, lng: -75.8865 },
        { ref: '66075-02-001', dir: 'Vereda La Marina',  lat: 4.9488, lng: -75.8910 },
        { ref: '66075-02-002', dir: 'Vereda El Aguacate',lat: 4.9530, lng: -75.8855 },
    ];

    inputBusqueda.addEventListener('input', () => {
        const q = inputBusqueda.value.trim().toLowerCase();

        if (q.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }

        const filtrados = prediosMock.filter(p =>
            p.ref.toLowerCase().includes(q) ||
            p.dir.toLowerCase().includes(q)
        );

        if (filtrados.length === 0) {
            searchResults.innerHTML = `<p style="font-size:12px;color:#94a3b8;text-align:center;padding:8px 0;">Sin resultados</p>`;
        } else {
            searchResults.innerHTML = filtrados.map(p => `
                <div class="search-result-item" onclick="seleccionarPredio('${p.ref}','${p.dir}',${p.lat},${p.lng})">
                    <span style="font-size:12px;font-weight:700;color:#1e293b;">${p.ref}</span>
                    <span style="font-size:11px;color:#94a3b8;">${p.dir}</span>
                </div>
            `).join('');
        }

        searchResults.classList.remove('hidden');
    });

    // Función pública para seleccionar resultado de búsqueda
    window.seleccionarPredio = function(ref, dir, lat, lng) {
        cerrarBuscador();

        // Centrar mapa si Leaflet está disponible
        if (window.mapInstance) {
            window.mapInstance.setView([lat, lng], 17, { animate: true });
        }

        // Abrir panel con datos mock del predio
        window.abrirDetallePredio({
            referencia: ref,
            tipoSuelo:  lat < 4.951 ? 'Suelo Rural' : 'Suelo Urbano',
            uso:        lat < 4.951 ? 'Agropecuario' : 'Habitacional',
            area:       (Math.random() * 200 + 80).toFixed(1),
            areaC:      (Math.random() * 100 + 40).toFixed(1),
            pisos:      Math.ceil(Math.random() * 3),
            municipio:  'Balboa',
            avaluo:     Math.round(Math.random() * 80000000 + 20000000),
        });
    };

    // ═══════════════════════════════════════════════════════
    //  4. SELECTOR DE MAPA BASE
    // ═══════════════════════════════════════════════════════

    window.setBasemap = function(tipo) {
        if (typeof switchBasemap === 'function') switchBasemap(tipo);

        const btnSat = document.getElementById('btn-sat');
        const btnMap = document.getElementById('btn-map');

        if (tipo === 'sat') {
            btnSat.classList.add('basemap-dark');
            btnSat.classList.remove('basemap-light');
            btnMap.classList.add('basemap-light');
            btnMap.classList.remove('basemap-dark');
        } else {
            btnMap.classList.add('basemap-dark');
            btnMap.classList.remove('basemap-light');
            btnSat.classList.add('basemap-light');
            btnSat.classList.remove('basemap-dark');
        }
    };

    // ═══════════════════════════════════════════════════════
    //  5. HERRAMIENTA DE MEDICIÓN (admin)
    // ═══════════════════════════════════════════════════════

    let midiendoActivo = false;

    document.getElementById('btn-regla').addEventListener('click', () => {
        midiendoActivo = !midiendoActivo;

        if (typeof toggleMedicion === 'function') {
            toggleMedicion(midiendoActivo);
        }

        document.getElementById('btn-regla').style.background = midiendoActivo ? '#d1fae5' : '';
        mostrarToast(midiendoActivo ? 'Clic en el mapa para medir' : 'Medición desactivada', 'info');
    });

    // ═══════════════════════════════════════════════════════
    //  6. TOAST NOTIFICATIONS
    // ═══════════════════════════════════════════════════════

    function mostrarToast(mensaje, tipo = 'info') {
        // Remover toast anterior si existe
        const prev = document.getElementById('sig-toast');
        if (prev) prev.remove();

        const colores = {
            success: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
            info:    { bg: '#e0f2fe', color: '#0c4a6e', border: '#7dd3fc' },
            error:   { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
        };

        const c = colores[tipo] || colores.info;

        const toast = document.createElement('div');
        toast.id = 'sig-toast';
        toast.innerText = mensaje;
        toast.style.cssText = `
            position: fixed;
            bottom: 140px;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: ${c.bg};
            color: ${c.color};
            border: 1px solid ${c.border};
            border-radius: 40px;
            padding: 10px 22px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 12px;
            font-weight: 700;
            z-index: 9999;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.19,1,0.22,1);
            pointer-events: none;
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(8px)';
            setTimeout(() => toast.remove(), 400);
        }, 2800);
    }

    // ── Exponer para uso desde map-layers.js
    window.mostrarToast = mostrarToast;

    // ── Utilidades ────────────────────────────────────────
    function formatPeso(n) {
        return '$ ' + Number(n).toLocaleString('es-CO');
    }

});