document.addEventListener('DOMContentLoaded', async () => {

    // --- ESTRUCTURA DE DATOS INICIALES (ESTRICTAMENTE AMISTAD Y CUMPLEAÑOS) ---
    const defaultProjectData = {
        settings: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "16",
            colorPrimary: "#efb5c9",
            colorSecondary: "#c7b7eb",
            colorBg1: "#fff5f7",
            colorBg2: "#edf4ff",
            animationPreset: "normal"
        },
        screens: [
            {
                id: "inicio",
                name: "Inicio",
                template: "inicio",
                hidden: false,
                content: {
                    badge: "¡Feliz Cumpleaños!",
                    title: "Para <span class='highlight'>Daphne</span> 🎂",
                    subtitle: "Hoy celebramos tu vida, tu alegría y una amistad maravillosa que ilumina nuestros días."
                }
            },
            {
                id: "cartas",
                name: "Mi carta",
                template: "cartas",
                hidden: false,
                content: {
                    sectionTitle: "💌 Mi carta",
                    letterText: "Querida Daphne,\n\n¡Feliz cumpleaños! En este día tan especial quiero recordarte lo increíble que eres y lo afortunado/a que me siento de tener tu amistad. Gracias por cada risa, por estar en las buenas y en las malas, y por hacer que la vida sea mucho más divertida.\n\nQue este nuevo año de vida esté lleno de metas cumplidas, momentos inolvidables y muchísima felicidad. ¡Te quiero un montón!",
                    photoUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"
                }
            },
            {
                id: "recuerdos",
                name: "Recuerdos",
                template: "recuerdos",
                hidden: false,
                content: {
                    sectionTitle: "📸 Momentos Inolvidables",
                    items: [
                        { title: "Nuestras locuras", date: "Octubre 2025", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80", desc: "Esos días donde nos reímos hasta que nos dolía la panza sin parar." },
                        { title: "Apoyo incondicional", date: "Enero 2026", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80", desc: "Gracias por escucharme siempre y darme los mejores consejos." },
                        { title: "Aventuras épicas", date: "Julio 2026", image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=600&q=80", desc: "Por cada salida improvisada y cada plan que se vuelve inolvidable." }
                    ]
                }
            },
            {
                id: "fotos",
                name: "Nuestras Fotos",
                template: "fotos",
                hidden: false,
                content: {
                    sectionTitle: "✨ Galería de Amistad",
                    photos: [
                        { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", caption: "Sonrisas genuinas" },
                        { url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80", caption: "Celebrando la vida" },
                        { url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80", caption: "Grandes momentos" },
                        { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", caption: "Siempre unidos en amistad" }
                    ]
                }
            },
            {
                id: "mensajes",
                name: "Cosas que amamos",
                template: "mensajes",
                hidden: false,
                content: {
                    sectionTitle: "🌟 Cosas que amamos de ti, Daphne",
                    items: [
                        { icon: "💖", title: "Tu gran corazón", desc: "Siempre estás pendiente de los demás y ayudas con una sonrisa." },
                        { icon: "😂", title: "Tu sentido del humor", desc: "Tienes la habilidad única de alegrar cualquier día gris." },
                        { icon: "🎯", title: "Tu energía y chispa", desc: "Tu entusiasmo por la vida es contagioso e inspirador." }
                    ]
                }
            },
            {
                id: "sorpresas",
                name: "Sorpresas",
                template: "sorpresas",
                hidden: false,
                content: {
                    sectionTitle: "🎁 Sobres Sorpresa de Cumpleaños",
                    items: [
                        { title: "Sobre 1: Un deseo", message: "🌟 Deseo que este nuevo año te traiga salud, éxito rotundo y muchísima alegría." },
                        { title: "Sobre 2: Promesa", message: "🤝 Prometo seguir estando en cada logro, cada risa y cada desahogo que necesites." },
                        { title: "Sobre 3: ¡Felicidades!", message: "🎉 ¡Eres una amiga excepcional! Que hoy la pases increíble de principio a fin." }
                    ]
                }
            },
            {
                id: "final",
                name: "Foto Final",
                template: "final",
                hidden: false,
                content: {
                    sectionTitle: "🎉 ¡Feliz Cumpleaños, Daphne!",
                    finalText: "Gracias por ser esa amistad tan valiosa que ilumina el camino. ¡Brindemos por muchos años más de risas y momentos geniales juntos!",
                    bgPhoto: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80"
                }
            }
        ]
    };

    const shared = window.BIRTHDAY_SHARED === true;
    let db;
    try {
        db = await new Promise((resolve, reject) => {
            const r = indexedDB.open('daphne_birthday_photos', 1);
            r.onupgradeneeded = () => r.result.createObjectStore('project');
            r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
        });
    } catch (_) {}
    let saved;
    if (!shared) {
        try { saved = await new Promise((resolve, reject) => {
            if (!db) return resolve(null);
            const r = db.transaction('project').objectStore('project').get('current');
            r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
        }); } catch (_) {}
        try { saved ||= JSON.parse(localStorage.getItem('daphne_birthday_project')); } catch (_) {}
    }
    let projectData = structuredClone(window.BIRTHDAY_DATA || saved || defaultProjectData);
    if (!projectData.pastelVersion) {
        Object.assign(projectData.settings, {colorPrimary:'#efb5c9',colorSecondary:'#c7b7eb',colorBg1:'#fff5f7',colorBg2:'#edf4ff'});
        projectData.screens.forEach(sc => { if(sc.name === 'Nuestras Cartas') sc.name = 'Mi carta'; if(sc.template === 'cartas' && sc.content.sectionTitle === '💌 Dedicatorias de Cumpleaños') sc.content.sectionTitle = '💌 Mi carta'; });
        projectData.pastelVersion = 1;
    }
    let currentScreenId = null;
    let isEditMode = false;

    // --- APLICAR ESTILOS GLOBALES ---
    function applyGlobalStyles() {
        const s = projectData.settings;
        const root = document.documentElement;
        root.style.setProperty('--font-family', s.fontFamily);
        root.style.setProperty('--font-size-base', s.fontSize + 'px');
        root.style.setProperty('--primary-color', s.colorPrimary);
        root.style.setProperty('--secondary-color', s.colorSecondary);
        root.style.setProperty('--bg-color-1', s.colorBg1);
        root.style.setProperty('--bg-color-2', s.colorBg2);
    }

    // --- RENDERIZAR NAVEGACIÓN Y PANTALLAS ---
    function renderApp() {
        applyGlobalStyles();
        const nav = document.getElementById('appNav');
        const container = document.getElementById('screensContainer');
        
        nav.innerHTML = '';
        container.innerHTML = '';

        const visibleScreens = projectData.screens.filter(sc => !sc.hidden || isEditMode);

        if (visibleScreens.length === 0) {
            container.innerHTML = '<div class="card" style="text-align:center;"><h3>No hay apartados visibles. Activa el editor para añadir o mostrar apartados.</h3></div>';
            return;
        }

        // Determinar pantalla actual basada en URL hash o primera visible
        let hash = window.location.hash.replace('#', '');
        let activeScreen = visibleScreens.find(sc => sc.id === hash);
        if (!activeScreen) {
            activeScreen = visibleScreens[0];
            window.location.hash = activeScreen.id;
        }
        currentScreenId = activeScreen.id;

        // Construir menú superior
        visibleScreens.forEach(sc => {
            const btn = document.createElement('button');
            btn.className = `nav-pill ${sc.id === currentScreenId ? 'active' : ''}`;
            btn.textContent = sc.name;
            if (sc.hidden) btn.style.opacity = '0.5';
            btn.addEventListener('click', () => {
                window.location.hash = sc.id;
            });
            nav.appendChild(btn);
        });

        // Construir pantallas
        visibleScreens.forEach(sc => {
            const screenDiv = document.createElement('div');
            screenDiv.className = `screen-view ${sc.id === currentScreenId ? '' : 'hidden'}`;
            screenDiv.id = `screen-${sc.id}`;

            if (sc.hidden && isEditMode) {
                const hiddenNotice = document.createElement('div');
                hiddenNotice.className = 'edit-hint-box';
                hiddenNotice.textContent = '⚠️ Este apartado está oculto para Daphne.';
                screenDiv.appendChild(hiddenNotice);
            }

            screenDiv.appendChild(renderTemplateContent(sc));
            container.appendChild(screenDiv);
        });

        updateScreenControlsNav(visibleScreens);
        if (isEditMode) renderEditorList();
    }

    // --- RENDERIZAR PLANTILLAS ESPECÍFICAS ---
    function renderTemplateContent(sc) {
        const wrapper = document.createElement('div');
        const c = sc.content;

        if (isEditMode) {
            const editBtnBar = document.createElement('div');
            editBtnBar.style.cssText = "margin-bottom: 15px; text-align: right;";
            editBtnBar.innerHTML = `<button class="btn primary-btn" style="padding: 6px 16px; font-size: 0.85rem;" onclick="openContentEditor('${sc.id}')">✏️ Editar este contenido</button>`;
            wrapper.appendChild(editBtnBar);
        }

        switch(sc.template) {
            case 'inicio':
                wrapper.innerHTML += `
                    <section class="card hero-section">
                        <div class="badge">${c.badge}</div>
                        <h1>${c.title}</h1>
                        <p class="subtitle">${c.subtitle}</p>
                    </section>
                `;
                break;
            case 'cartas':
                wrapper.innerHTML += `
                    <section class="card">
                        <h2 class="section-title">${c.sectionTitle}</h2>
                        <div class="letter-content">${c.letterText.replace(/\n/g, '<br>')}</div>
                        ${(c.photos || (c.photoUrl ? [{url:c.photoUrl}] : [])).map(p => `<img src="${p.url}" class="letter-photo" alt="Foto de mi carta" loading="lazy">`).join('')}
                    </section>
                `;
                break;
            case 'recuerdos':
                let recCards = (c.items || []).map(item => `
                    <div class="content-card-item">
                        ${item.image ? `<img src="${item.image}" class="card-img" alt="${item.title}" onclick="openLightbox('${item.image}')">` : ''}
                        <h3>${item.title}</h3>
                        ${item.date ? `<span class="card-date">${item.date}</span>` : ''}
                        <p>${item.desc}</p>
                    </div>
                `).join('');
                wrapper.innerHTML += `
                    <section class="card">
                        <h2 class="section-title">${c.sectionTitle}</h2>
                        <div class="cards-grid">${recCards || '<p>Aún no hay recuerdos añadidos.</p>'}</div>
                    </section>
                `;
                break;
            case 'fotos':
                let galleryItems = (c.photos || []).map(p => `
                    <div class="gallery-item" onclick="openLightbox('${p.url}')">
                        <img src="${p.url}" alt="${p.caption}">
                        ${p.caption ? `<div class="gallery-caption">${p.caption}</div>` : ''}
                    </div>
                `).join('');
                wrapper.innerHTML += `
                    <section class="card">
                        <h2 class="section-title">${c.sectionTitle}</h2>
                        <div class="gallery-grid">${galleryItems || '<p>Aún no hay fotos añadidas.</p>'}</div>
                    </section>
                `;
                break;
            case 'mensajes':
                let msgCards = (c.items || []).map(item => `
                    <div class="content-card-item">
                        <div class="card-icon">${item.icon || '⭐'}</div>
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                `).join('');
                wrapper.innerHTML += `
                    <section class="card">
                        <h2 class="section-title">${c.sectionTitle}</h2>
                        <div class="cards-grid">${msgCards || '<p>Aún no hay mensajes añadidos.</p>'}</div>
                    </section>
                `;
                break;
            case 'sorpresas':
                let surpCards = (c.items || []).map((item, idx) => `
                    <div class="surprise-envelope" onclick="toggleSurprise(this)">
                        <h3>🎁 ${item.title}</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:5px;">(Toca para abrir)</p>
                        <div class="surprise-hidden-text hidden">${item.message}</div>
                    </div>
                `).join('');
                wrapper.innerHTML += `
                    <section class="card">
                        <h2 class="section-title">${c.sectionTitle}</h2>
                        <div class="surprises-grid">${surpCards || '<p>Aún no hay sorpresas añadidas.</p>'}</div>
                    </section>
                `;
                break;
            case 'final':
                wrapper.innerHTML += `
                    <div class="final-photo-container card" style="padding:0;">
                        ${c.bgPhoto ? `<img src="${c.bgPhoto}" class="fading-bg-photo" alt="Fondo final">` : ''}
                        <div class="final-content-box">
                            <h2 style="font-size: 2.2rem; margin-bottom: 15px; color: #fff;">${c.sectionTitle}</h2>
                            <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">${c.finalText}</p>
                        </div>
                    </div>
                `;
                break;
        }
        return wrapper;
    }

    function updateScreenControlsNav(visibleScreens) {
        const currentIndex = visibleScreens.findIndex(sc => sc.id === currentScreenId);
        const btnPrev = document.getElementById('btnPrevScreen');
        const btnNext = document.getElementById('btnNextScreen');

        btnPrev.style.display = currentIndex > 0 ? 'inline-flex' : 'none';
        btnNext.style.display = currentIndex < visibleScreens.length - 1 ? 'inline-flex' : 'none';

        btnPrev.onclick = () => {
            if (currentIndex > 0) window.location.hash = visibleScreens[currentIndex - 1].id;
        };
        btnNext.onclick = () => {
            if (currentIndex < visibleScreens.length - 1) window.location.hash = visibleScreens[currentIndex + 1].id;
        };
    }

    window.addEventListener('hashchange', renderApp);


    // --- 1. SISTEMA DE PARTÍCULAS (GLOBOS Y DESTELLOS DE CUMPLEAÑOS) ---
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 14 + 8;
            this.speedY = Math.random() * 1.2 + 0.4;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.type = Math.random() > 0.5 ? 'balloon' : 'sparkle';
            this.color = `hsla(${Math.random() * 60 + 320}, 100%, 75%, ${this.opacity})`;
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -30) this.reset();
        }
        draw() {
            if (projectData.settings.animationPreset === 'off') return;
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.beginPath();
            if (this.type === 'balloon') {
                ctx.ellipse(this.x, this.y, this.size * 0.8, this.size, 0, 0, Math.PI * 2);
            } else {
                ctx.arc(this.x, this.y, this.size / 3, 0, Math.PI * 2);
            }
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        const count = projectData.settings.animationPreset === 'subtle' ? 15 : 35;
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();


    // --- 2. FUNCIONES INTERACTIVAS (Lightbox & Sorpresas) ---
    window.openLightbox = function(url) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <img src="${url}" class="lightbox-content" alt="Ampliada">
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('.lightbox-close').onclick = () => overlay.remove();
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    }

    window.toggleSurprise = function(el) {
        const hiddenText = el.querySelector('.surprise-hidden-text');
        hiddenText.classList.toggle('hidden');
    }


    // --- 3. EDITOR VISUAL Y GESTIÓN DE PARTES ---
    const btnToggleEditMode = document.getElementById('btnToggleEditMode');
    const editorPanel = document.getElementById('editorPanel');
    const btnCloseEditor = document.getElementById('btnCloseEditor');

    btnToggleEditMode.onclick = () => {
        isEditMode = !isEditMode;
        editorPanel.classList.toggle('hidden', !isEditMode);
        btnToggleEditMode.textContent = isEditMode ? '👁️ Vista Previa' : '✏️ Editor';
        renderApp();
    };

    btnCloseEditor.onclick = () => {
        isEditMode = false;
        editorPanel.classList.add('hidden');
        btnToggleEditMode.textContent = '✏️ Editor';
        renderApp();
    };

    // Tabs del Editor
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        };
    });

    // Controles Generales
    const selectFont = document.getElementById('selectFont');
    const rangeFontSize = document.getElementById('rangeFontSize');
    const colorPrimary = document.getElementById('colorPrimary');
    const colorSecondary = document.getElementById('colorSecondary');
    const colorBg1 = document.getElementById('colorBg1');
    const colorBg2 = document.getElementById('colorBg2');
    const selectAnimationPreset = document.getElementById('selectAnimationPreset');

    selectFont.value = projectData.settings.fontFamily;
    rangeFontSize.value = projectData.settings.fontSize;
    colorPrimary.value = projectData.settings.colorPrimary;
    colorSecondary.value = projectData.settings.colorSecondary;
    colorBg1.value = projectData.settings.colorBg1;
    colorBg2.value = projectData.settings.colorBg2;
    selectAnimationPreset.value = projectData.settings.animationPreset;

    function saveSettings() {
        projectData.settings = {
            fontFamily: selectFont.value,
            fontSize: rangeFontSize.value,
            colorPrimary: colorPrimary.value,
            colorSecondary: colorSecondary.value,
            colorBg1: colorBg1.value,
            colorBg2: colorBg2.value,
            animationPreset: selectAnimationPreset.value
        };
        saveToLocalStorage();
        renderApp();
        initParticles();
    }

    selectFont.onchange = saveSettings;
    rangeFontSize.oninput = saveSettings;
    colorPrimary.oninput = saveSettings;
    colorSecondary.oninput = saveSettings;
    colorBg1.oninput = saveSettings;
    colorBg2.oninput = saveSettings;
    selectAnimationPreset.onchange = saveSettings;


    // --- 4. GESTIÓN DE PANTALLAS (Orden, Ocultar, Eliminar, Añadir) ---
    function renderEditorList() {
        const list = document.getElementById('screensListEditor');
        list.innerHTML = '';

        projectData.screens.forEach((sc, idx) => {
            const row = document.createElement('div');
            row.className = 'screen-row-item';
            row.innerHTML = `
                <div class="screen-row-info">
                    <span style="font-weight:600;">${sc.name}</span>
                    <span style="font-size:0.8rem; color:var(--text-muted);">(${sc.template})</span>
                </div>
                <div class="screen-row-actions">
                    <button class="icon-btn" title="Subir" onclick="moveScreen(${idx}, -1)">⬆️</button>
                    <button class="icon-btn" title="Bajar" onclick="moveScreen(${idx}, 1)">⬇️</button>
                    <button class="icon-btn" title="${sc.hidden ? 'Mostrar' : 'Ocultar'}" onclick="toggleHideScreen(${idx})">${sc.hidden ? '👁️‍🗨️' : '👁️'}</button>
                    <button class="icon-btn" title="Eliminar" onclick="deleteScreen(${idx})">🗑️</button>
                </div>
            `;
            list.appendChild(row);
        });
    }

    window.moveScreen = function(idx, dir) {
        const target = idx + dir;
        if (target < 0 || target >= projectData.screens.length) return;
        const temp = projectData.screens[idx];
        projectData.screens[idx] = projectData.screens[target];
        projectData.screens[target] = temp;
        saveToLocalStorage();
        renderApp();
    }

    window.toggleHideScreen = function(idx) {
        projectData.screens[idx].hidden = !projectData.screens[idx].hidden;
        saveToLocalStorage();
        renderApp();
    }

    window.deleteScreen = function(idx) {
        if (confirm(`¿Estás seguro de eliminar el apartado "${projectData.screens[idx].name}"?`)) {
            projectData.screens.splice(idx, 1);
            saveToLocalStorage();
            renderApp();
        }
    }

    // Modal Añadir Apartado
    const screenModal = document.getElementById('screenModal');
    document.getElementById('btnAddScreen').onclick = () => {
        document.getElementById('modalScreenName').value = '';
        screenModal.classList.remove('hidden');
    };
    document.getElementById('modalCancel').onclick = () => screenModal.classList.add('hidden');
    document.getElementById('modalSave').onclick = () => {
        const name = document.getElementById('modalScreenName').value.trim();
        const template = document.getElementById('modalScreenTemplate').value;
        if (!name) return alert('Por favor escribe un nombre.');

        const newId = 'screen_' + Date.now();
        let defaultContent = {};

        if (template === 'inicio') defaultContent = { badge: "¡Feliz Cumpleaños!", title: "Para <span class='highlight'>Daphne</span>", subtitle: "Escribe aquí tu subtítulo de bienvenida." };
        else if (template === 'cartas') defaultContent = { sectionTitle: "Nueva Dedicatoria", letterText: "Escribe tu carta aquí...", photoUrl: "" };
        else if (template === 'recuerdos') defaultContent = { sectionTitle: "Nuevos Recuerdos", items: [{ title: "Recuerdo 1", date: "Fecha", image: "", desc: "Descripción del momento." }] };
        else if (template === 'fotos') defaultContent = { sectionTitle: "Nueva Galería", photos: [{ url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", caption: "Pie de foto" }] };
        else if (template === 'mensajes') defaultContent = { sectionTitle: "Cosas que amamos", items: [{ icon: "💖", title: "Cualidad", desc: "Descripción..." }] };
        else if (template === 'sorpresas') defaultContent = { sectionTitle: "Sorpresas", items: [{ title: "Sobre 1", message: "Mensaje oculto..." }] };
        else if (template === 'final') defaultContent = { sectionTitle: "¡Feliz Cumpleaños!", finalText: "Mensaje final...", bgPhoto: "" };

        projectData.screens.push({
            id: newId,
            name: name,
            template: template,
            hidden: false,
            content: defaultContent
        });

        saveToLocalStorage();
        screenModal.classList.add('hidden');
        renderApp();
    };


    // Editor con borrador independiente: Cancelar nunca modifica el proyecto.
    const contentModal = document.getElementById('contentModal');
    let editingScreenId, draft;
    const labels = {badge:'Insignia',title:'Título',subtitle:'Subtítulo',sectionTitle:'Título de sección',letterText:'Mi carta',finalText:'Mensaje final',date:'Fecha',desc:'Descripción',caption:'Pie de foto',icon:'Emoji',message:'Mensaje'};
    function field(parent, object, key) {
        const group = document.createElement('div'); group.className='input-group';
        const label = document.createElement('label'); label.textContent=labels[key] || key;
        const input = document.createElement(['letterText','finalText','desc','message','subtitle'].includes(key)?'textarea':'input');
        input.value=object[key] || ''; input.rows=5;
        input.oninput=()=>object[key]=input.value;
        group.append(label,input); parent.append(group);
    }
    async function photoData(file) {
        if (!file.type.startsWith('image/')) throw new Error('Selecciona una imagen JPG, PNG o WebP.');
        const url=URL.createObjectURL(file);
        try {
            const img=new Image(); img.src=url; await img.decode();
            const scale=Math.min(1,1600/Math.max(img.width,img.height));
            const cv=document.createElement('canvas'); cv.width=Math.round(img.width*scale); cv.height=Math.round(img.height*scale);
            cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
            return cv.toDataURL('image/webp',0.86);
        } finally { URL.revokeObjectURL(url); }
    }
    function imagePicker(parent, onImages, multiple=false, current='') {
        const area=document.createElement('div'); area.className='paste-area'; area.tabIndex=0;
        if(current) { const img=new Image(); img.src=current; img.className='edit-thumbnail'; area.append(img); }
        const help=document.createElement('p'); help.textContent=multiple?'Pega aquí con Ctrl+V, arrastra fotos o selecciona varias.':'Haz clic aquí y pega una imagen con Ctrl+V, o selecciona una foto.';
        const picker=document.createElement('input'); picker.type='file';picker.accept='image/*';picker.multiple=multiple;
        const status=document.createElement('p'); status.setAttribute('role','status');
        let busy=false;
        async function accept(files) {
            if(busy) return;
            files=Array.from(files).filter(f=>f.type.startsWith('image/')); if(!files.length) return;
            busy=true; document.getElementById('contentModalSave').disabled=true; status.textContent='Preparando fotos…';
            try {
                const photos=[]; for(const f of (multiple?files:files.slice(0,1))) photos.push(await photoData(f));
                if(!contentModal.classList.contains('hidden')) onImages(photos);
            } catch(e) { status.textContent='No se pudo leer la imagen. Prueba con JPG, PNG o WebP.'; }
            finally { busy=false;document.getElementById('contentModalSave').disabled=false; }
        }
        picker.onchange=()=>accept(picker.files);
        area.onpaste=e=>{if(e.clipboardData.files.length){e.preventDefault();e.stopPropagation();accept(e.clipboardData.files);}};
        area.ondragover=e=>e.preventDefault(); area.ondrop=e=>{e.preventDefault();accept(e.dataTransfer.files);};
        area.append(help,picker,status);parent.append(area);
    }
    function drawContentEditor() {
        const body=document.getElementById('contentModalBody');body.replaceChildren();
        const nameLabel=document.createElement('p');nameLabel.textContent='Nombre del apartado';body.append(nameLabel);
        const name=document.createElement('input');name.value=draft.name;name.oninput=()=>draft.name=name.value;body.append(name);
        const c=draft.content;
        Object.keys(c).filter(k=>labels[k]).forEach(k=>field(body,c,k));
        const type=draft.template;
        if(type==='cartas') { c.photos ||= c.photoUrl?[{url:c.photoUrl,caption:''}]:[]; delete c.photoUrl; }
        const collection=['fotos','cartas'].includes(type)?'photos':['recuerdos','mensajes','sorpresas'].includes(type)?'items':null;
        if(collection) {
            const list=c[collection] ||= [];
            const photoKey=type==='recuerdos'?'image':'url';
            const canPhoto=['fotos','cartas','recuerdos'].includes(type);
            function fresh(url='') { return type==='recuerdos'?{title:'Nuevo recuerdo',date:'',desc:'',image:url}:type==='mensajes'?{icon:'💖',title:'',desc:''}:type==='sorpresas'?{title:'Nuevo sobre',message:''}:{url,caption:''}; }
            if(canPhoto) imagePicker(body, urls=>{urls.forEach(url=>list.push(fresh(url)));drawContentEditor();},true);
            const add=document.createElement('button');add.className='btn primary-btn';add.textContent=canPhoto?'+ Añadir foto / recuerdo':'+ Añadir elemento';add.onclick=()=>{list.push(fresh());drawContentEditor();};body.append(add);
            list.forEach((item,i)=>{
                const box=document.createElement('div');box.className='data-section-box';
                const title=document.createElement('h4');title.textContent=`${canPhoto?'Foto':'Elemento'} ${i+1}`;box.append(title);
                if(canPhoto) imagePicker(box,urls=>{item[photoKey]=urls[0];drawContentEditor();},false,item[photoKey]);
                Object.keys(item).filter(k=>labels[k]).forEach(k=>field(box,item,k));
                const remove=document.createElement('button');remove.className='btn secondary-btn';remove.textContent='Quitar';remove.onclick=()=>{list.splice(i,1);drawContentEditor();};box.append(remove);body.append(box);
            });
        }
        if(type==='final') imagePicker(body,urls=>{c.bgPhoto=urls[0];drawContentEditor();},false,c.bgPhoto);
    }
    window.openContentEditor = id => {
        editingScreenId=id;draft=structuredClone(projectData.screens.find(s=>s.id===id));
        drawContentEditor();contentModal.classList.remove('hidden');
    };
    document.getElementById('contentModalCancel').onclick=()=>contentModal.classList.add('hidden');
    document.getElementById('contentModalSave').onclick=async()=>{
        projectData.screens[projectData.screens.findIndex(s=>s.id===editingScreenId)]=draft;
        await saveToLocalStorage();contentModal.classList.add('hidden');renderApp();
    };

    // --- 6. GUARDADO, EXPORTACIÓN E IMPORTACIÓN ---
    async function saveToLocalStorage() {
        if(shared) return;
        try {
            if(db) await new Promise((resolve,reject)=>{
                const tx=db.transaction('project','readwrite');tx.objectStore('project').put(projectData,'current');
                tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
            });
            else localStorage.setItem('daphne_birthday_project',JSON.stringify(projectData));
        } catch (_) { alert('No se pudo guardar en este navegador. Exporta una copia JSON antes de cerrar para conservar tus cambios.'); }
    }

    document.getElementById('btnResetDefault').onclick = () => {
        if (confirm('¿Restaurar todo a los valores iniciales? Se perderán tus cambios.')) {
            projectData = JSON.parse(JSON.stringify(defaultProjectData));
            saveToLocalStorage();
            renderApp();
            alert('¡Restaurado con éxito!');
        }
    };

    // Exportar JSON
    document.getElementById('btnExportJSON').onclick = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "daphne_cumpleaños_backup.json");
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    };

    // Importar JSON
    document.getElementById('inputImportJSON').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const parsed = JSON.parse(evt.target.result);
                if (parsed.screens && parsed.settings) {
                    projectData = parsed;
                    saveToLocalStorage();
                    renderApp();
                    alert('¡Proyecto importado con éxito!');
                } else {
                    alert('El archivo no tiene el formato correcto.');
                }
            } catch (err) {
                alert('Error al leer el archivo JSON.');
            }
        };
        reader.readAsText(file);
    };

    // La exportación utiliza el mismo renderizado que la vista previa.
    async function buildShareable() {
        const [css,js]=await Promise.all(['style.css','script.js'].map(async path=>{
            const response=await fetch(path);if(!response.ok) throw new Error('No se pudo cargar '+path);return response.text();
        }));
        const doc=document.documentElement.cloneNode(true);
        doc.querySelectorAll('script,link[rel="stylesheet"],.lightbox-overlay').forEach(el=>el.remove());
        doc.querySelector('#appNav').replaceChildren();doc.querySelector('#screensContainer').replaceChildren();
        doc.querySelector('#contentModalBody').replaceChildren();
        doc.querySelectorAll('.modal-overlay,.editor-panel').forEach(el=>el.classList.add('hidden'));
        const style=document.createElement('style');style.textContent=css;doc.querySelector('head').append(style);
        const boot=document.createElement('script');
        boot.textContent='window.BIRTHDAY_SHARED=true;window.BIRTHDAY_DATA='+JSON.stringify(projectData).replace(/</g,'\\u003c')+';';
        doc.querySelector('body').append(boot);
        const runtime=document.createElement('script');runtime.textContent=js;doc.querySelector('body').append(runtime);
        return '<!DOCTYPE html>\n'+doc.outerHTML;
    }
    document.getElementById('btnExportShareable').onclick=async()=>{
        try {
            const url=URL.createObjectURL(new Blob([await buildShareable()],{type:'text/html;charset=utf-8'}));
            const a=document.createElement('a');a.href=url;a.download='index.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
        } catch(e) {alert('Para exportar, abre la página desde GitHub Pages o un servidor local, con los tres archivos juntos. '+e.message);}
    };
    const preview=document.getElementById('btnPreview');
    const back=document.getElementById('btnBackToEditor');
    preview.onclick=()=>{
        isEditMode=false;editorPanel.classList.add('hidden');btnToggleEditMode.classList.add('hidden');preview.classList.add('hidden');back.classList.remove('hidden');renderApp();
    };
    back.onclick=()=>{back.classList.add('hidden');preview.classList.remove('hidden');btnToggleEditMode.classList.remove('hidden');isEditMode=true;editorPanel.classList.remove('hidden');renderApp();};
    if(shared) {btnToggleEditMode.remove();preview.remove();back.remove();}
    renderApp();
});
