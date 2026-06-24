/* ═══════════════════════════════════════════════════════════════
   Dim720 Dashboard — JavaScript Principal
   Sistema de Evaluación de Riesgo v5
   ═══════════════════════════════════════════════════════════════ */

// ─── Auth & Session ───
const user = JSON.parse(localStorage.getItem('dim720_user'));

if (!user && !window.location.href.includes('index.html')) {
    window.location.href = 'index.html';
}

// ─── Navigation Config ───
const navConfig = {
    gg: [
        { icon: 'mdi-view-dashboard', label: 'Resumen', view: 'gg', active: true },
        { icon: 'mdi-chart-line', label: 'Mora vs Esperado', section: 'charts' },
        { icon: 'mdi-bell-alert', label: 'Alertas', section: 'alerts' },
        { icon: 'mdi-robot', label: 'Recomendaciones', section: 'recs' }
    ],
    gr: [
        { icon: 'mdi-shield-alert', label: 'Alertas Críticas', view: 'gr', active: true, badge: 3, badgeClass: 'red' },
        { icon: 'mdi-robot', label: 'Decisiones Automáticas', section: 'decisions' },
        { icon: 'mdi-brain', label: 'Explicabilidad', section: 'explain' },
        { icon: 'mdi-crystal-ball', label: 'Predicciones', section: 'pred' },
        { icon: 'mdi-radar', label: 'Early Warning', section: 'ew' },
        { icon: 'mdi-tag-multiple', label: 'Catálogo Estados', section: 'estados' }
    ],
    gc: [
        { icon: 'mdi-chart-bar', label: 'Cartera Comercial', view: 'gc', active: true },
        { icon: 'mdi-trending-up', label: 'Resultados 6M', section: 'tend' },
        { icon: 'mdi-account-check', label: 'Recuperables', section: 'recup' },
        { icon: 'mdi-currency-usd-off', label: 'Ventas Perdidas', section: 'lost' },
        { icon: 'mdi-trophy', label: 'Ranking', section: 'rank' },
        { icon: 'mdi-file-document-edit', label: 'Condiciones', section: 'cond' }
    ],
    ec: [
        { icon: 'mdi-lightning-bolt', label: 'Evaluar', view: 'ec', active: true },
        { icon: 'mdi-file-document', label: 'Ficha Deudor', section: 'ficha-d' },
        { icon: 'mdi-file-document-outline', label: 'Ficha Cedente', section: 'ficha-c' },
        { icon: 'mdi-format-list-bulleted', label: 'Operaciones', section: 'ops' }
    ],
    rc: [
        { icon: 'mdi-account-tie', label: 'Ficha Cliente', view: 'rc', active: true },
        { icon: 'mdi-robot', label: 'Análisis Automático', section: 'auto' },
        { icon: 'mdi-lightning-bolt', label: 'EVT Activos', section: 'evt' },
        { icon: 'mdi-history', label: 'Histórico WORM', section: 'hist' }
    ],
    rd: [
        { icon: 'mdi-account-cash', label: 'Ficha Deudor', view: 'rd', active: true },
        { icon: 'mdi-history', label: 'Operaciones', section: 'ops' },
        { icon: 'mdi-pie-chart', label: 'Concentración', section: 'conc' },
        { icon: 'mdi-web', label: 'Fuentes Externas', section: 'fuentes' }
    ]
};

// ─── Sidebar Role Labels ───
const roleLabels = {
    gg: 'Gerencia General',
    gr: 'Gerente de Riesgo',
    gc: 'Gerencia Comercial',
    ec: 'Ejecutivo Comercial',
    rc: 'Rep. Cliente',
    rd: 'Rep. Deudor'
};

// ─── Initialize Dashboard ───
document.addEventListener('DOMContentLoaded', () => {
    if (!user) return;

    // Update user info
    document.getElementById('userAvatar').textContent = user.initials;
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = roleLabels[user.role];

    // Update topbar
    const iconClass = user.icon || 'mdi-domain';
    document.getElementById('topbarTitle').innerHTML = `<i class="mdi ${iconClass}"></i> ${user.name}`;
    document.getElementById('breadcrumbRole').textContent = user.name;

    // Build sidebar
    buildSidebar();

    // Show only the relevant view
    showViewForRole(user.role);

    // Update date
    updateDate();

    // Init charts after a short delay
    setTimeout(() => initChartsForRole(user.role), 200);
});

// ─── Build Sidebar Navigation ───
// ─── Build Sidebar Navigation (estructura con acordeón) ───
function buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    const items = navConfig[user.role];
    if (!items || !nav) return;

    let html = `<ul class="side-nav mt-2">`;

    items.forEach((item, idx) => {
        const hasSubitems = item.subitems && item.subitems.length;
        const collapseId = `sidebarCollapse_${idx}`;
        const isActive = item.active ? 'active' : '';

        if (hasSubitems) {
            // ========== ITEM CON SUBMENÚ (ACORDEÓN) ==========
            html += `
                <li class="side-nav-item nav-item ${isActive}">
                    <a data-bs-toggle="collapse" class="side-nav-link" aria-expanded="false" href="#${collapseId}">
                        <i class="mdi ${item.icon}"></i>
                        <span>${item.label}</span>
                        ${item.badge ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
                    </a>
                    <div class="collapse" id="${collapseId}">
                        <ul class="side-nav-second-level">
                            ${item.subitems.map(sub => `
                                <li>
                                    <a href="javascript:void(0)" onclick="scrollToSection('${sub.target}')" ${sub.active ? 'class="active"' : ''}>
                                        <span class="sub-item">${sub.label}</span>
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </li>
            `;
        } else {
            // ========== ITEM SIMPLE (SIN SUBMENÚ) ==========
            // Determina el target: puede ser una vista (view-rol) o una sección interna
            let target = '';
            if (item.view) target = `view-${item.view}`;
            else if (item.section) target = item.section;

            html += `
                <li class="side-nav-item nav-item ${isActive}">
                    <a href="javascript:void(0)" class="side-nav-link" onclick="scrollToSection('${target}')">
                        <i class="mdi ${item.icon}"></i>
                        <span>${item.label}</span>
                        ${item.badge ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
                    </a>
                </li>
            `;
        }
    });

    html += `</ul>`;
    nav.innerHTML = html;
}

// ─── Show View For Role ───
function showViewForRole(role) {
    document.querySelectorAll('.dashboard-view').forEach(v => v.classList.remove('active'));
    const viewId = `view-${role}`;
    const view = document.getElementById(viewId);
    if (view) {
        view.classList.add('active');
    }
}

// ─── Scroll to Section ───
function scrollToSection(id) {
    // If it's a view switch
    if (id.startsWith('view-')) {
        // Already in single-view mode per role
        return;
    }
    // Section scroll within view
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile sidebar
    closeSidebar();
}

// ─── Mobile Sidebar ───
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('mobile-open');
    document.getElementById('mobileOverlay').classList.toggle('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('mobileOverlay').classList.remove('active');
}

// ─── Update Date ───
function updateDate() {
    const now = new Date();
    const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    const day = String(now.getDate()).padStart(2, '0');
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('topbarDate').textContent = `${day} ${month} ${year} · ${hours}:${minutes}`;
}
setInterval(updateDate, 60000);

// ─── Logout ───
function logout() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro que deseas salir del sistema?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d21047',
        cancelButtonColor: '#6b7280',
        background: '#fff',
        iconColor: '#d21047'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('dim720_user');
            Swal.fire({
                title: '¡Hasta pronto!',
                text: 'Sesión cerrada correctamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000,
                confirmButtonColor: '#d21047'
            }).then(() => {
                window.location.href = 'index.html';
            });
        }
    });
}

// ════════════════════════════════════════════
// CHARTS
// ════════════════════════════════════════════

const charts = {};
const chartTooltip = {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    titleColor: '#333333',
    bodyColor: '#555555',
    padding: 10,
    cornerRadius: 6,
    titleFont: { family: 'Inter', size: 11 },
    bodyFont: { family: 'JetBrains Mono', size: 10 }
};

function destroyCharts(prefix) {
    Object.keys(charts).filter(k => k.startsWith(prefix)).forEach(k => {
        if (charts[k]) { charts[k].destroy(); delete charts[k]; }
    });
}

function initChartsForRole(role) {
    if (role === 'gg') initChartsGG();
    if (role === 'gc') initChartsGC();
}

// ─── GG Charts ───
function initChartsGG() {
    if (charts['gg-mora']) return;

    const mo = ['May','Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr'];

    charts['gg-mora'] = new Chart(document.getElementById('gg-mora'), {
        type: 'line',
        data: {
            labels: mo,
            datasets: [
                {
                    label: 'Mora Real %',
                    data: [4.1,3.9,3.7,4.2,3.8,3.5,3.2,3.4,3.0,2.8,2.5,2.3],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239,68,68,0.06)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ef4444',
                    borderWidth: 2.5
                },
                {
                    label: 'Pérdida Esperada %',
                    data: [4.8,4.5,4.3,4.6,4.2,4.0,3.8,3.6,3.4,3.2,3.0,2.8],
                    borderColor: '#d21047',
                    backgroundColor: 'rgba(210,16,71,0.04)',
                    tension: 0.4,
                    fill: true,
                    borderDash: [5,4],
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#d21047',
                    borderWidth: 2.5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: { font: { family: 'JetBrains Mono', size: 10 }, color: '#6b7280', usePointStyle: true, pointStyleWidth: 8, boxWidth: 6 }
                },
                tooltip: chartTooltip
            },
            scales: {
                x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9aa0a6', font: { family: 'JetBrains Mono', size: 9 } }, border: { display: false } },
                y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9aa0a6', font: { family: 'JetBrains Mono', size: 9 }, callback: v => v + '%' }, border: { display: false } }
            },
            animation: { duration: 1200, easing: 'easeOutQuart' }
        }
    });

    charts['gg-donut'] = new Chart(document.getElementById('gg-donut'), {
        type: 'doughnut',
        data: {
            labels: ['BAJO','MEDIO','ALTO','CRÍTICO'],
            datasets: [{
                data: [68,19,9,4],
                backgroundColor: ['rgba(16,185,129,0.85)','rgba(245,158,11,0.85)','rgba(249,115,22,0.85)','rgba(239,68,68,0.85)'],
                borderColor: ['#10b981','#f59e0b','#f97316','#ef4444'],
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: { display: false },
                tooltip: { ...chartTooltip, callbacks: { label: ctx => ` ${ctx.parsed}%` } }
            },
            animation: { animateRotate: true, duration: 1000, easing: 'easeOutQuart' }
        }
    });
}

// ─── GC Charts ───
function initChartsGC() {
    if (charts['gc-tend']) return;

    charts['gc-tend'] = new Chart(document.getElementById('gc-tend'), {
        type: 'bar',
        data: {
            labels: ['Dic','Ene','Feb','Mar','Abr','May'],
            datasets: [
                { type: 'bar', label: 'APROBADO', data: [198,210,228,240,242,265], backgroundColor: 'rgba(16,210,155,0.6)', borderColor: '#10d29b', borderWidth: 1, borderRadius: 4, yAxisID: 'y', order: 2 },
                { type: 'bar', label: 'CONDICIONADO', data: [72,78,82,87,84,96], backgroundColor: 'rgba(245,158,11,0.6)', borderColor: '#f59e0b', borderWidth: 1, borderRadius: 4, yAxisID: 'y', order: 3 },
                { type: 'bar', label: 'RECHAZADO', data: [40,40,45,47,52,51], backgroundColor: 'rgba(210,16,71,0.5)', borderColor: '#d21047', borderWidth: 1, borderRadius: 4, yAxisID: 'y', order: 4 },
                { type: 'line', label: 'Mora %', data: [3.5,3.2,3.0,2.8,3.1,2.3], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.06)', tension: 0.4, pointRadius: 4, pointHoverRadius: 7, pointBackgroundColor: '#3b82f6', fill: true, yAxisID: 'y1', order: 1, borderWidth: 2.5 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { position: 'top', align: 'end', labels: { font: { family: 'JetBrains Mono', size: 9 }, color: '#6b7280', usePointStyle: true, boxWidth: 6 } },
                tooltip: chartTooltip
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#9aa0a6', font: { size: 10 } }, stacked: true, border: { display: false } },
                y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9aa0a6', font: { size: 9 } }, stacked: true, border: { display: false } },
                y1: { position: 'right', grid: { display: false }, ticks: { color: '#3b82f6', font: { size: 9 }, callback: v => v + '%' }, border: { display: false } }
            },
            animation: { duration: 1200, easing: 'easeOutQuart' }
        }
    });

    charts['gc-donut'] = new Chart(document.getElementById('gc-donut'), {
        type: 'doughnut',
        data: {
            labels: ['BAJO','MEDIO','ALTO','CRÍTICO'],
            datasets: [{
                data: [68,19,9,4],
                backgroundColor: ['rgba(16,210,155,0.8)','rgba(245,158,11,0.8)','rgba(249,115,22,0.8)','rgba(210,16,71,0.8)'],
                borderColor: ['#10d29b','#f59e0b','#f97316','#d21047'],
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: { display: false },
                tooltip: { ...chartTooltip, callbacks: { label: ctx => ` ${ctx.parsed}%` } }
            },
            animation: { animateRotate: true, duration: 1000, easing: 'easeOutQuart' }
        }
    });
}

// ════════════════════════════════════════════
// EJECUTIVO COMERCIAL — SIM EVAL
// ════════════════════════════════════════════

const evalStates = [
    {
        cls: 'aprobado', score: 870, res: 'APROBADO', nivel: 'BAJO', nc: 'nivel-bajo', sc: 'SC-02 · Cliente Activo', scc: 'sc-02',
        desc: 'Deudor BAJO · SC-02 (tieneHistoricoInterno: true) · Sin alertas externas ni internas. Cupo y plazo aprobados.',
        evts: ['EVT-031 · flag_dependencia (inf)','AC-11 · registro_evidencia'], monto: '$120M', mc: 'var(--success)', plazo: '60 días',
        est: 'EST-D01 DEUDOR_APTO', ec: 'status-aprobado', eid: 'EVL-20260522-1501', hist: true,
        se: [
            { ir: 'IR-09 · TGR · Ext.', n: 'Deuda Tributaria', st: 'SIN DEUDA ✓', c: 'ok', a: 'Sin deuda tributaria. Fortaleza principal.' },
            { ir: 'IR-20 · DimRepo · Int.', n: 'Días Desvío Pago', st: '4 días prom.', c: 'warn', a: 'Excelente comportamiento. SC-02 comportamiento alto.' },
            { ir: 'IR-21 · DimRepo · Int.', n: 'Tasa Recompra', st: '0.8% — OK ✓', c: 'ok', a: 'Bajo umbral. Historial recompra excelente.' },
            { ir: 'IR-24 · Sheriff · Ext.', n: 'Protestos', st: 'Sin protestos ✓', c: 'ok', a: 'Historial limpio en Sheriff.' },
            { ir: 'IR-30 · DimRepo · Int.', n: 'Concentración', st: '8% — OK ✓', c: 'ok', a: 'Muy bajo umbral. Cartera diversificada.' },
            { ir: 'IR-06 · SII · Ext.', n: 'Continuidad IVA', st: '12/12 meses ✓', c: 'ok', a: 'Declaraciones completas.' }
        ]
    },
    {
        cls: 'condicionado', score: 610, res: 'CONDICIONADO', nivel: 'MEDIO', nc: 'nivel-medio', sc: 'SC-02 · Cliente Activo', scc: 'sc-02',
        desc: 'Deudor MEDIO · SC-02 (tieneHistoricoInterno: true) · Deuda TGR activa (IR-09) · Analista notificado (AC-04) · Monto y plazo reducidos.',
        evts: ['EVT-006 · deuda_tributaria','EVT-053 · deterioro_score SC-02','AC-04 · revision_manual'], monto: '$80M', mc: 'var(--warning)', plazo: '30 días',
        est: 'EST-02 CONDICIONADO', ec: 'status-condicionado', eid: 'EVL-20260522-1482', hist: true,
        se: [
            { ir: 'IR-09 · TGR · Ext.', n: 'Deuda Tributaria', st: 'CON DEUDA', c: 'warn', a: 'Regularizar $28M con TGR → +85 pts → posible APROBADO' },
            { ir: 'IR-20 · DimRepo · Int.', n: 'Días Desvío Pago', st: '18 días prom.', c: 'warn', a: 'Pagos puntuales 3 meses → +40 pts (SC-02 comportamiento)' },
            { ir: 'IR-21 · DimRepo · Int.', n: 'Tasa Recompra', st: '1.2% — OK ✓', c: 'ok', a: 'Bajo umbral. Historial favorable.' },
            { ir: 'IR-24 · Sheriff · Ext.', n: 'Protestos', st: 'Sin protestos ✓', c: 'ok', a: 'Punto fuerte. Mantener.' },
            { ir: 'IR-30 · DimRepo · Int.', n: 'Concentración', st: '22% — OK ✓', c: 'ok', a: 'Bajo umbral 30%.' },
            { ir: 'IR-06 · SII · Ext.', n: 'Continuidad IVA', st: '12/12 meses ✓', c: 'ok', a: 'Sin anomalías tributarias.' }
        ]
    },
    {
        cls: 'rechazado', score: 380, res: 'RECHAZADO', nivel: 'CRÍTICO', nc: 'nivel-critico', sc: 'SC-01 · Cliente Nuevo', scc: 'sc-01',
        desc: 'CRÍTICO · SC-01 (tieneHistoricoInterno: false) · Deuda TGR + protestos · AC-01 · CAPA_AUTO · No operar.',
        evts: ['EVT-006 · deuda_tributaria','EVT-024 · deudor_protestos','EVT-050 · score_critico_nuevo','AC-01 · bloqueo_total'], monto: '$0', mc: 'var(--danger)', plazo: 'NINGUNO',
        est: 'EST-D03 DEUDOR_BLOQUEADO', ec: 'status-rechazado', eid: 'EVL-20260522-0841', hist: false,
        se: [
            { ir: 'IR-09 · TGR · Ext.', n: 'Deuda Tributaria', st: 'CON DEUDA', c: 'warn', a: 'Certificado TGR con deuda activa. BLOQUEO TOTAL (RL-009).' },
            { ir: 'IR-24 · Sheriff · Ext.', n: 'Protestos Dicom', st: '2 protestos $38M', c: 'warn', a: '2 protestos impagos. Deben regularizarse + 90 días.' },
            { ir: 'IR-13 · Sheriff · Ext.', n: 'Juicios Vigentes', st: '3 juicios', c: 'warn', a: 'Juicios laborales activos. Dimensión Legal en 310/1000.' },
            { ir: 'IR-30 · N/A (SC-01)', n: 'Concentración', st: 'Sin historial', c: 'warn', a: 'SC-01: sin datos internos. tieneHistoricoInterno: false.' },
            { ir: 'IR-06 · SII · Ext.', n: 'Continuidad IVA', st: '8/12 meses', c: 'warn', a: '4 meses sin declarar. Revisar IR-15 sustancia económica.' },
            { ir: 'IR-16 · Sheriff · Ext.', n: 'PEP/Sanciones', st: 'Sin match ✓', c: 'ok', a: 'Sin coincidencias OFAC/ONU. Punto positivo.' }
        ]
    }
];

let eIdx = 1;

function setTipo(t, btn) {
    document.querySelectorAll('.eval-tipo').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const el = document.getElementById('hist-tag-ec');
    if (!el) return;
    if (t === 'EVALUAR_DEUDOR') { el.textContent = 'tieneHistoricoInterno: — → SC-03'; el.className = 'hist-tag si'; }
    else if (t === 'MONITOREO_PREVENTIVO') { el.textContent = 'tieneHistoricoInterno: true → SC-02 · origen=MONITOR'; el.className = 'hist-tag si'; }
    else { el.textContent = 'tieneHistoricoInterno: true → SC-02'; el.className = 'hist-tag si'; }
}

function simEval() {
    eIdx = (eIdx + 1) % 3;
    const e = evalStates[eIdx];

    const circle = document.getElementById('res-circle');
    const score = document.getElementById('res-score');
    const resultado = document.getElementById('res-resultado');
    const nivel = document.getElementById('res-nivel');
    const sc = document.getElementById('res-sc');
    const eid = document.getElementById('res-eid');
    const desc = document.getElementById('res-desc');
    const evts = document.getElementById('res-evts');
    const srMonto = document.getElementById('sr-monto');
    const srPlazo = document.getElementById('sr-plazo');
    const srEstado = document.getElementById('sr-estado');
    const seGrid = document.getElementById('se-grid');
    const histTag = document.getElementById('hist-tag-ec');

    if (circle) {
        circle.className = 'result-circle ' + e.cls;
        circle.style.borderColor = e.mc === 'var(--success)' ? '#10b981' : e.mc === 'var(--warning)' ? '#f59e0b' : '#ef4444';
        circle.style.boxShadow = e.mc === 'var(--success)' ? '0 0 20px rgba(16,185,129,0.9)' : e.mc === 'var(--warning)' ? '0 0 20px rgba(245,158,11,0.9)' : '0 0 20px rgba(239,68,68,0.9)';
    }
    if (score) { score.textContent = e.score; score.style.color = e.mc === 'var(--success)' ? '#10b981' : e.mc === 'var(--warning)' ? '#f59e0b' : '#ef4444'; }
    if (resultado) { resultado.className = 'result-title ' + e.cls; resultado.textContent = e.res; }
    if (nivel) { nivel.className = 'nivel-badge ' + e.nc; nivel.textContent = e.nivel; }
    if (sc) { sc.className = 'sc-badge ' + e.scc; sc.textContent = e.sc; }
    if (eid) eid.textContent = e.eid;
    if (desc) desc.textContent = e.desc;
    if (evts) evts.innerHTML = e.evts.map(t => `<span class="evt-tag">${t}</span>`).join('');
    if (srMonto) { srMonto.style.color = e.mc; srMonto.textContent = e.monto; }
    if (srPlazo) srPlazo.textContent = e.plazo;
    if (srEstado) { srEstado.textContent = e.est; srEstado.className = 'status-badge ' + e.ec; }
    if (seGrid) seGrid.innerHTML = e.se.map(s => `
        <div class="se-item">
            <div class="se-ir">${s.ir}</div>
            <div class="se-name">${s.n}</div>
            <span class="se-status ${s.c}">${s.st}</span>
            <div class="se-accion">${s.a}</div>
        </div>
    `).join('');
    if (histTag) {
        histTag.textContent = e.hist ? `tieneHistoricoInterno: true → ${e.sc.split(' ·')[0]}` : 'tieneHistoricoInterno: false → SC-01';
        histTag.className = 'hist-tag ' + (e.hist ? 'si' : 'no');
    }

    // Animate result card
    const resCard = document.getElementById('ec-result');
    if (resCard) {
        resCard.style.animation = 'none';
        resCard.offsetHeight; // force reflow
        resCard.style.animation = 'scaleIn 0.4s ease';
    }
}

// ════════════════════════════════════════════
// REP CLIENTE
// ════════════════════════════════════════════

function selCliente(btn, nombre, rut, score, nc, estado, sc, hist) {
    document.querySelectorAll('#view-rc .selector-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const nameEl = document.getElementById('rch-name');
    const rutEl = document.getElementById('rch-rut');
    const scoreEl = document.getElementById('rch-score-num');
    const circleEl = document.getElementById('rch-circle');
    const nivelEl = document.getElementById('rch-nivel');
    const estadoEl = document.getElementById('rch-estado-pill');
    const scEl = document.getElementById('rch-sc');
    const hiEl = document.getElementById('rch-hist-int');

    if (nameEl) nameEl.textContent = nombre;
    if (rutEl) rutEl.textContent = rut;

    const colorMap = { bajo: '#10b981', medio: '#f59e0b', alto: '#f97316', critico: '#ef4444' };
    const c = colorMap[nc] || '#6b7280';

    if (scoreEl) { scoreEl.textContent = score; scoreEl.style.color = c; }
    if (circleEl) {
        circleEl.style.borderColor = c;
        circleEl.style.boxShadow = `0 0 24px ${c}33`;
    }
    if (nivelEl) { nivelEl.className = 'nivel-badge nivel-' + nc; nivelEl.textContent = nc.toUpperCase(); }
    if (estadoEl) estadoEl.textContent = estado;
    if (scEl) { scEl.textContent = sc.toUpperCase(); scEl.className = 'sc-badge sc-' + sc.replace('sc',''); }
    if (hiEl) {
        hiEl.textContent = 'tieneHistoricoInterno: ' + hist;
        hiEl.style.color = hist ? 'var(--dim-teal)' : 'var(--text-muted)';
    }

    // Animate
    const hero = document.querySelector('.hero-score');
    if (hero) { hero.style.animation = 'none'; hero.offsetHeight; hero.style.animation = 'fadeInUp 0.4s ease'; }
}

// ════════════════════════════════════════════
// REP DEUDOR
// ════════════════════════════════════════════

function selDeudor(btn, nombre, rut, score, nc, mora, protestos, conc) {
    document.querySelectorAll('#view-rd .selector-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const nameEl = document.getElementById('rd-name');
    const rutEl = document.getElementById('rd-rut');
    const pmVal = document.getElementById('pm-val');
    const scorePill = document.getElementById('rd-score-pill');
    const protestosEl = document.getElementById('rd-protestos');
    const concEl = document.getElementById('rd-conc');
    const sheriffEl = document.getElementById('rd-sheriff-score');
    const nivelEl = document.getElementById('rd-nivel');
    const pmCircle = document.getElementById('pm-circle');
    const estadoEl = document.getElementById('rd-estado-pill');

    if (nameEl) nameEl.textContent = nombre;
    if (rutEl) rutEl.textContent = rut;
    if (pmVal) pmVal.textContent = mora + ' días';
    if (scorePill) scorePill.textContent = score;
    if (protestosEl) {
        protestosEl.textContent = protestos;
        protestosEl.style.color = protestos > 0 ? '#ef4444' : '#10b981';
    }
    if (concEl) {
        concEl.textContent = conc + '%';
        concEl.style.color = conc > 25 ? '#ef4444' : conc > 15 ? '#f59e0b' : '#10b981';
    }
    if (sheriffEl) sheriffEl.textContent = score;
    if (nivelEl) { nivelEl.className = 'nivel-badge nivel-' + nc; nivelEl.textContent = nc.toUpperCase(); }

    const colorMap = { bajo: '#10b981', medio: '#f59e0b', alto: '#f97316', critico: '#ef4444' };
    const c = colorMap[nc] || '#6b7280';

    if (pmCircle) pmCircle.style.borderColor = c;
    if (pmVal) pmVal.style.color = c;

    const estMap = { bajo: 'EST-D01 DEUDOR_APTO', medio: 'EST-D02 DEUDOR_OBSERVADO', alto: 'EST-D02 DEUDOR_OBSERVADO', critico: 'EST-D03 DEUDOR_BLOQUEADO' };
    if (estadoEl) estadoEl.textContent = estMap[nc] || estado;

    // Animate
    const hero = document.querySelector('#view-rd .hero-score');
    if (hero) { hero.style.animation = 'none'; hero.offsetHeight; hero.style.animation = 'fadeInUp 0.4s ease'; }
}

// ════════════════════════════════════════════
// GLOBAL HELPERS
// ════════════════════════════════════════════

// Smooth entrance animation for cards on scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply scroll reveal to cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-dim, .kpi-card, .insumo-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.25s ease, border-color 0.25s ease';
        cardObserver.observe(card);
    });
});

// ─── Ripple Effect on Buttons ───
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-action, .btn-eval, .btn-login, .selector-btn, .eval-tipo');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});

// ─── Keyboard Shortcuts ───
document.addEventListener('keydown', (e) => {
    // ESC to close sidebar on mobile
    if (e.key === 'Escape') {
        closeSidebar();
    }
});

// ─── Welcome Toast on First Load ───
document.addEventListener('DOMContentLoaded', () => {
    const welcomed = sessionStorage.getItem('dim720_welcomed');
    if (!welcomed && user) {
        sessionStorage.setItem('dim720_welcomed', '1');
        setTimeout(() => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#fff',
                iconColor: '#d21047',
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: 'success',
                title: `Bienvenido, ${user.name}`
            });
        }, 800);
    }
});

console.log('%c Dim720 ', 'background:linear-gradient(135deg,#d21047,#10d29b);color:#fff;font-size:20px;font-weight:700;padding:8px 16px;border-radius:8px;', 'Motor de Evaluación de Riesgo v5 iniciado');
