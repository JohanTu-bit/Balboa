/**
 * SIG AMIGO - Balboa, Risaralda
 * Versión: Interfaz Adaptativa (Desktop/Mobile)
 */

let isAdmin = false;

// Configuración de capas (Públicas y Técnicas)
const LAYERS_CONFIG = [
    { id: 'urbano', name: 'Perímetro Urbano', icon: '🏙️', adminOnly: false },
    { id: 'riesgo', name: 'Zonas de Riesgo', icon: '🚧', adminOnly: false },
    { id: 'reserva', name: 'Reserva Forestal', icon: '🌳', adminOnly: false },
    { id: 'sentinel', name: 'Sentinel 2 (Técnico)', icon: '🛰️', adminOnly: true },
    { id: 'catastro', name: 'Gestión Catastral', icon: '📋', adminOnly: true }
];

document.addEventListener('DOMContentLoaded', () => {
    renderLayers();
    initUIEvents();
});

/**
 * Inicialización de todos los eventos de la interfaz
 */
function initUIEvents() {
    const authBtn = document.getElementById('auth-btn');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const closeLogin = document.getElementById('close-login');
    const consultBtn = document.getElementById('consult-btn');
    const closeDetail = document.getElementById('close-panel');
    const detailPanel = document.getElementById('detail-panel');

    // 1. Control de Paneles (Lógica Anti-Colisión)
    const togglePanel = (panelId, show) => {
        const panel = document.getElementById(panelId);
        
        // En móvil, si abrimos un panel, cerramos los demás
        if (window.innerWidth < 768 && show) {
            document.querySelectorAll('aside.glass-panel').forEach(p => {
                p.classList.remove('active');
            });
        }

        if (show) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    };

    // Eventos de apertura/cierre
    if (consultBtn) {
        consultBtn.onclick = () => togglePanel('detail-panel', true);
    }
    
    if (closeDetail) {
        closeDetail.onclick = () => togglePanel('detail-panel', false);
    }

    // 2. Control de Acceso Técnico
    if (authBtn) {
        authBtn.onclick = () => {
            if (!isAdmin) {
                loginModal.style.opacity = "1";
                loginModal.style.pointerEvents = "auto";
            } else {
                if (confirm("¿Cerrar sesión técnica de SIG AMIGO?")) {
                    location.reload();
                }
            }
        };
    }

    if (closeLogin) {
        closeLogin.onclick = () => {
            loginModal.style.opacity = "0";
            loginModal.style.pointerEvents = "none";
        };
    }

    // 3. Procesar Login
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            isAdmin = true;
            if (closeLogin) closeLogin.click();
            activarModoAdministrador();
        };
    }
}

/**
 * Activa las funciones exclusivas para técnicos de la Alcaldía
 */
function activarModoAdministrador() {
    // Cambiar estado visual del botón principal
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        authBtn.innerText = "Cerrar Sesión";
        authBtn.style.backgroundColor = "#dc2626"; // Rojo para indicar sesión activa
    }

    // Mostrar el badge de Sistema EOT Activo
    const badge = document.getElementById('admin-badge');
    if (badge) badge.classList.remove('hidden');

    // Inyectar Previa Administrativa en el Toolbar (Nube y Engranaje)
    const toolBar = document.getElementById('tool-bar');
    if (toolBar) {
        const adminTools = document.createElement('div');
        adminTools.className = 'flex gap-1 items-center border-l border-slate-300 ml-2 pl-2 admin-appear';
        adminTools.innerHTML = `
            <button class="w-10 h-10 hover:bg-amber-50 rounded-xl text-lg" title="Cargar Capas (PostGIS/QGIS)">☁️</button>
            <button class="w-10 h-10 hover:bg-amber-50 rounded-xl text-lg" title="Configurar Metadatos">⚙️</button>
        `;
        toolBar.appendChild(adminTools);
    }

    // Volver a renderizar capas para incluir las técnicas (Sentinel/Catastro)
    renderLayers();
}

/**
 * Genera la lista de capas en el panel izquierdo
 */
function renderLayers() {
    const list = document.getElementById('layer-list');
    if (!list) return;
    
    list.innerHTML = '';

    LAYERS_CONFIG.forEach(layer => {
        // Si la capa es técnica y no somos admin, no la mostramos
        if (layer.adminOnly && !isAdmin) return;

        const card = document.createElement('div');
        // Estilo especial para capas técnicas
        const adminClass = layer.adminOnly ? 'bg-amber-50/50 border-amber-200 admin-appear' : 'bg-white/60 border-transparent';
        
        card.className = `p-4 rounded-2xl flex items-center justify-between border transition-all ${adminClass} hover:border-emerald-200`;
        card.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-xl">${layer.icon}</span>
                <span class="text-sm font-bold text-slate-700">${layer.name}</span>
            </div>
            <input type="checkbox" class="w-5 h-5 accent-emerald-600 cursor-pointer">
        `;
        list.appendChild(card);
    });
}
