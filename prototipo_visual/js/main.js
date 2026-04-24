let isAdmin = false;

document.addEventListener('DOMContentLoaded', () => {
    // Sincronizar botones con el HTML original
    const consultBtn = document.getElementById('consult-btn');
    const closeDetail = document.getElementById('close-panel');
    const authBtn = document.getElementById('auth-btn');
    const loginForm = document.getElementById('login-form');
    const closeLogin = document.getElementById('close-login');
    const loginModal = document.getElementById('login-modal');

    // Cargar capas iniciales
    renderLayers();

    // 1. Mostrar/Ocultar Joyita (Panel Predial)
    consultBtn.onclick = () => document.getElementById('detail-panel').classList.add('active');
    closeDetail.onclick = () => document.getElementById('detail-panel').classList.remove('active');

    // 2. Control del Acceso Técnico
    authBtn.onclick = () => {
        if (!isAdmin) {
            loginModal.style.opacity = "1";
            loginModal.style.pointerEvents = "auto";
        } else {
            if(confirm("¿Desea cerrar la sesión administrativa?")) location.reload();
        }
    };

    closeLogin.onclick = () => {
        loginModal.style.opacity = "0";
        loginModal.style.pointerEvents = "none";
    };

    // 3. Simular Entrada Admin
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        isAdmin = true;
        closeLogin.click();
        activarHerramientasAdmin();
    };
});

function activarHerramientasAdmin() {
    // Cambiar visual del botón y badge
    document.getElementById('auth-btn').innerText = "Cerrar Sesión";
    document.getElementById('auth-btn').style.background = "#dc2626";
    document.getElementById('admin-badge').classList.remove('hidden');

    // Inyectar herramientas en footer
    const toolBar = document.getElementById('tool-bar');
    toolBar.innerHTML += `
        <div class="w-[1px] bg-slate-300 mx-2 h-8 admin-appear"></div>
        <button class="w-12 h-12 hover:bg-amber-50 rounded-xl text-xl admin-appear" title="Cargar Datos">☁️</button>
        <button class="w-12 h-12 hover:bg-amber-50 rounded-xl text-xl admin-appear" title="Metadatos">⚙️</button>
    `;

    // Mostrar capas técnicas (Sentinel/Catastro)
    renderLayers();
}

function renderLayers() {
    const list = document.getElementById('layer-list');
    list.innerHTML = '';

    LAYERS_CONFIG.forEach(layer => {
        if (layer.adminOnly && !isAdmin) return;

        const card = document.createElement('div');
        card.className = `p-4 rounded-2xl flex items-center justify-between bg-white/60 border border-transparent hover:border-emerald-200 transition-all ${layer.adminOnly ? 'bg-amber-50/50 border-amber-200 admin-appear' : ''}`;
        card.innerHTML = `
            <div class="flex items-center gap-3">
                <span>${layer.icon}</span>
                <span class="text-sm font-bold text-slate-700">${layer.name}</span>
            </div>
            <input type="checkbox" class="w-5 h-5 accent-emerald-600 cursor-pointer">
        `;
        list.appendChild(card);
    });
}