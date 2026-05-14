/* ============================================================
   Catavento Espaço Pedagógico — Financial Management App
   script.js
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const CATEGORIAS_FISICO = [
  'Aluguel','Água','Luz/Energia','Internet','Contabilidade','Salários',
  'Impostos','Empréstimos','Material pedagógico','Compras para o espaço',
  'Manutenção','Móveis e equipamentos','Presentes e datas comemorativas',
  'Comissões','Outros gastos físicos'
];

const CATEGORIAS_DIGITAL = [
  'Mentorias','Ferramentas digitais','WhatsApp/Z-API','Inteligência Artificial',
  'Hospedagem de site','Armazenamento em nuvem','Instagram profissional',
  'Plataformas digitais','Automações','Tráfego pago','Domínio','Design/Edição',
  'Assinaturas digitais','Outros gastos digitais'
];

const CONTAS = ['Sicoob','Inter','Conta Thiago','Manual','Outra'];
const FORMAS_PAGAMENTO = ['Pix','Boleto','Cartão','Dinheiro','Débito automático','Transferência'];

const CHART_COLORS = [
  '#26325B','#E9BE2B','#22C55E','#EF4444','#3B82F6',
  '#F59E0B','#8B5CF6','#EC4899','#14B8A6','#F97316'
];

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  fisico: 'Financeiro Físico',
  digital: 'Financeiro Digital',
  receitas: 'Receitas'
};

const LS_GASTOS    = 'catavento_gastos';
const LS_RECEITAS  = 'catavento_receitas';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let state = {
  gastos: [],
  receitas: [],
  currentView: 'dashboard',
  currentMonth: getCurrentMonth(),
  editingId: null,
  editingType: null,
  charts: {}
};

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────
function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatBRL(value) {
  const n = typeof value === 'number' ? value : 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatMonthLabel(yyyymm) {
  if (!yyyymm) return '';
  const [y, m] = yyyymm.split('-');
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function statusLabel(status) {
  const map = { pago: 'Pago', pendente: 'Pendente', atrasado: 'Atrasado', recebido: 'Recebido' };
  return map[status] || status;
}

function parseBRL(str) {
  if (typeof str !== 'string') return 0;
  const cleaned = str.replace(/[^\d]/g, '');
  if (!cleaned) return 0;
  return parseInt(cleaned, 10) / 100;
}

function applyBRLMask(input) {
  input.addEventListener('input', function () {
    const digits = this.value.replace(/[^\d]/g, '');
    if (!digits) { this.value = ''; return; }
    const num = parseInt(digits, 10) / 100;
    this.value = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  });
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function addMonths(yyyymm, n) {
  const [y, m] = yyyymm.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthFromDate(dateStr) {
  if (!dateStr) return '';
  return dateStr.substring(0, 7);
}

function destroyChart(key) {
  if (state.charts[key]) {
    state.charts[key].destroy();
    delete state.charts[key];
  }
}

// ─────────────────────────────────────────────
// LOCAL STORAGE
// ─────────────────────────────────────────────
function loadData() {
  try {
    state.gastos   = JSON.parse(localStorage.getItem(LS_GASTOS))   || [];
    state.receitas = JSON.parse(localStorage.getItem(LS_RECEITAS)) || [];
  } catch (e) {
    state.gastos   = [];
    state.receitas = [];
  }
}

function saveGastos() {
  localStorage.setItem(LS_GASTOS, JSON.stringify(state.gastos));
}

function saveReceitas() {
  localStorage.setItem(LS_RECEITAS, JSON.stringify(state.receitas));
}

// ─────────────────────────────────────────────
// STATUS AUTO-UPDATE
// ─────────────────────────────────────────────
function updateAllStatus() {
  const today = todayStr();
  let changed = false;
  state.gastos.forEach(g => {
    if (g.status !== 'pago') {
      if (g.dataVencimento < today && g.status !== 'atrasado') {
        g.status = 'atrasado';
        changed = true;
      } else if (g.dataVencimento >= today && g.status === 'atrasado') {
        g.status = 'pendente';
        changed = true;
      }
    }
  });
  if (changed) saveGastos();
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
function navigateTo(view) {
  state.currentView = view;

  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const target = document.getElementById(`view-${view}`);
  if (target) target.classList.remove('hidden');

  // Update sidebar nav active state
  document.querySelectorAll('#sidebar-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
    btn.setAttribute('aria-current', btn.dataset.view === view ? 'page' : 'false');
  });

  // Update bottom nav active state
  document.querySelectorAll('#bottom-nav .bottom-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
    btn.setAttribute('aria-current', btn.dataset.view === view ? 'page' : 'false');
  });

  // Update top bar title
  const titleEl = document.getElementById('view-title');
  if (titleEl) titleEl.textContent = VIEW_TITLES[view] || view;

  renderView(view);
}

function renderView(view) {
  if (view === 'dashboard') renderDashboard();
  else if (view === 'fisico') renderFisico();
  else if (view === 'digital') renderDigital();
  else if (view === 'receitas') renderReceitas();
}

// ─────────────────────────────────────────────
// MONTH SELECTOR
// ─────────────────────────────────────────────
function populateMonthSelector() {
  const monthLabel = document.getElementById('month-label');
  if (monthLabel) {
    monthLabel.textContent = formatMonthLabel(state.currentMonth);
  }
  // Also populate filter dropdowns in each view
  populateFilterMonths();
}

function populateFilterMonths() {
  const selectors = [
    'filter-fisico-mes',
    'filter-digital-mes',
    'filter-receitas-mes'
  ];
  const months = [];
  const base = getCurrentMonth();
  for (let i = -11; i <= 3; i++) {
    months.push(addMonths(base, i));
  }
  months.sort();

  selectors.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const current = sel.value;
    // Keep first empty option
    while (sel.options.length > 1) sel.remove(1);
    months.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = formatMonthLabel(m);
      sel.appendChild(opt);
    });
    if (current) sel.value = current;
  });
}

function updateMonthDisplay() {
  const monthLabel = document.getElementById('month-label');
  if (monthLabel) monthLabel.textContent = formatMonthLabel(state.currentMonth);
}

// ─────────────────────────────────────────────
// POPULATE FILTER CATEGORY DROPDOWNS
// ─────────────────────────────────────────────
function populateFilterCategories() {
  const fisicoSel = document.getElementById('filter-fisico-categoria');
  if (fisicoSel) {
    while (fisicoSel.options.length > 1) fisicoSel.remove(1);
    CATEGORIAS_FISICO.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      fisicoSel.appendChild(opt);
    });
  }

  const digitalSel = document.getElementById('filter-digital-categoria');
  if (digitalSel) {
    while (digitalSel.options.length > 1) digitalSel.remove(1);
    CATEGORIAS_DIGITAL.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      digitalSel.appendChild(opt);
    });
  }

  // Populate conta filters
  ['filter-fisico-conta', 'filter-digital-conta'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    while (sel.options.length > 1) sel.remove(1);
    CONTAS.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.toLowerCase().replace(/\s/g, '_');
      opt.textContent = c;
      sel.appendChild(opt);
    });
  });
}

// ─────────────────────────────────────────────
// DASHBOARD RENDER
// ─────────────────────────────────────────────
function renderDashboard() {
  const month = state.currentMonth;
  const gastos   = state.gastos.filter(g => g.mes === month);
  const receitas = state.receitas.filter(r => r.mes === month);

  const totalReceber    = receitas.reduce((s, r) => s + (r.valorPrevisto || 0), 0);
  const totalRecebido   = receitas.filter(r => r.status === 'recebido').reduce((s, r) => s + (r.valorRecebido || 0), 0);
  const gastosFisico    = gastos.filter(g => g.area === 'fisico').reduce((s, g) => s + (g.valor || 0), 0);
  const gastosDigital   = gastos.filter(g => g.area === 'digital').reduce((s, g) => s + (g.valor || 0), 0);
  const totalGastos     = gastosFisico + gastosDigital;
  const valorPago       = gastos.filter(g => g.status === 'pago').reduce((s, g) => s + (g.valor || 0), 0);
  const valorPendente   = gastos.filter(g => g.status === 'pendente').reduce((s, g) => s + (g.valor || 0), 0);
  const valorAtrasado   = gastos.filter(g => g.status === 'atrasado').reduce((s, g) => s + (g.valor || 0), 0);
  const saldoPrevisto   = totalReceber - totalGastos;
  const saldoReal       = totalRecebido - valorPago;

  // Hero saldo
  const heroVal = document.getElementById('hero-saldo-value');
  if (heroVal) {
    heroVal.textContent = formatBRL(saldoReal);
    heroVal.className = 'hero-card-value';
    heroVal.classList.add(saldoReal >= 0 ? 'text-success' : 'text-danger');
  }
  const heroPrevisto = document.getElementById('hero-saldo-previsto-value');
  if (heroPrevisto) heroPrevisto.textContent = formatBRL(saldoPrevisto);

  // Summary cards — map to inner value spans
  const cardMap = {
    'total-receber':   totalReceber,
    'total-recebido':  totalRecebido,
    'gastos-fisico':   gastosFisico,
    'gastos-digital':  gastosDigital,
    'total-gastos':    totalGastos,
    'valor-pago':      valorPago,
    'valor-pendente':  valorPendente,
    'valor-atrasado':  valorAtrasado,
    'saldo-previsto':  saldoPrevisto,
    'saldo-real':      saldoReal,
  };
  Object.entries(cardMap).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatBRL(val);
  });

  // Alerts
  renderAlerts(gastos, receitas);

  // Charts
  renderChartCategorias(gastos);
  renderChartFisicoDigital(gastosFisico, gastosDigital);
  renderChartEvolucao();
}

function renderAlerts(gastos, receitas) {
  const section = document.getElementById('alerts-section');
  if (!section) return;

  const atrasados = gastos.filter(g => g.status === 'atrasado');
  const today = todayStr();
  const in7days = new Date();
  in7days.setDate(in7days.getDate() + 7);
  const in7Str = in7days.toISOString().split('T')[0];
  const vencendo = gastos.filter(g => g.status === 'pendente' && g.dataVencimento >= today && g.dataVencimento <= in7Str);
  const receitasPendentes = receitas.filter(r => r.status === 'pendente');

  let html = '';

  if (atrasados.length > 0) {
    html += `<div class="alert alert-danger">
      <i data-lucide="alert-triangle"></i>
      <div>
        <strong>${atrasados.length} conta(s) atrasada(s)</strong>
        <span> — ${formatBRL(atrasados.reduce((s, g) => s + g.valor, 0))} em aberto</span>
        <ul class="alert-list">${atrasados.slice(0, 3).map(g =>
          `<li>${g.descricao} (${formatDate(g.dataVencimento)}) — ${formatBRL(g.valor)}</li>`
        ).join('')}${atrasados.length > 3 ? `<li>...e mais ${atrasados.length - 3}</li>` : ''}</ul>
      </div>
    </div>`;
  }

  if (vencendo.length > 0) {
    html += `<div class="alert alert-warning">
      <i data-lucide="clock"></i>
      <div>
        <strong>${vencendo.length} conta(s) vencendo em 7 dias</strong>
        <span> — ${formatBRL(vencendo.reduce((s, g) => s + g.valor, 0))}</span>
        <ul class="alert-list">${vencendo.slice(0, 3).map(g =>
          `<li>${g.descricao} (${formatDate(g.dataVencimento)}) — ${formatBRL(g.valor)}</li>`
        ).join('')}${vencendo.length > 3 ? `<li>...e mais ${vencendo.length - 3}</li>` : ''}</ul>
      </div>
    </div>`;
  }

  if (receitasPendentes.length > 0) {
    html += `<div class="alert alert-info">
      <i data-lucide="info"></i>
      <div>
        <strong>${receitasPendentes.length} receita(s) pendente(s)</strong>
        <span> — ${formatBRL(receitasPendentes.reduce((s, r) => s + r.valorPrevisto, 0))} aguardando</span>
      </div>
    </div>`;
  }

  section.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [section] });
}

// ─────────────────────────────────────────────
// CHARTS
// ─────────────────────────────────────────────
function renderChartCategorias(gastos) {
  destroyChart('categorias');
  const canvas = document.getElementById('chart-categorias');
  if (!canvas) return;

  const byCategoria = {};
  gastos.forEach(g => {
    const cat = g.categoria || 'Sem categoria';
    byCategoria[cat] = (byCategoria[cat] || 0) + (g.valor || 0);
  });

  const labels = Object.keys(byCategoria);
  const data   = labels.map(l => byCategoria[l]);

  if (labels.length === 0) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  state.charts.categorias = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${formatBRL(ctx.raw)}`
          }
        }
      }
    }
  });
}

function renderChartFisicoDigital(gastosFisico, gastosDigital) {
  destroyChart('fisicoDigital');
  const canvas = document.getElementById('chart-fisico-digital');
  if (!canvas) return;

  state.charts.fisicoDigital = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Físico', 'Digital'],
      datasets: [{
        data: [gastosFisico, gastosDigital],
        backgroundColor: [CHART_COLORS[0], CHART_COLORS[1]],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${formatBRL(ctx.raw)}`
          }
        }
      }
    }
  });
}

function renderChartEvolucao() {
  destroyChart('evolucao');
  const canvas = document.getElementById('chart-evolucao');
  if (!canvas) return;

  const months = [];
  for (let i = 5; i >= 0; i--) {
    months.push(addMonths(getCurrentMonth(), -i));
  }

  const gastosData   = months.map(m => state.gastos.filter(g => g.mes === m).reduce((s, g) => s + (g.valor || 0), 0));
  const receitasData = months.map(m => state.receitas.filter(r => r.mes === m).reduce((s, r) => s + (r.valorRecebido || 0), 0));

  state.charts.evolucao = new Chart(canvas, {
    type: 'line',
    data: {
      labels: months.map(formatMonthLabel),
      datasets: [
        {
          label: 'Gastos',
          data: gastosData,
          borderColor: CHART_COLORS[3],
          backgroundColor: CHART_COLORS[3] + '22',
          tension: 0.4,
          fill: true,
          pointRadius: 4
        },
        {
          label: 'Receitas',
          data: receitasData,
          borderColor: CHART_COLORS[2],
          backgroundColor: CHART_COLORS[2] + '22',
          tension: 0.4,
          fill: true,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { font: { family: 'Poppins', size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${formatBRL(ctx.raw)}`
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: v => formatBRL(v),
            font: { family: 'Poppins', size: 11 }
          }
        }
      }
    }
  });
}

function renderChartCategoriasArea(gastos, canvasId, chartKey) {
  destroyChart(chartKey);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const byCategoria = {};
  gastos.forEach(g => {
    const cat = g.categoria || 'Sem categoria';
    byCategoria[cat] = (byCategoria[cat] || 0) + (g.valor || 0);
  });

  const labels = Object.keys(byCategoria);
  const data   = labels.map(l => byCategoria[l]);

  if (labels.length === 0) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  state.charts[chartKey] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${formatBRL(ctx.raw)}`
          }
        }
      }
    }
  });
}

// ─────────────────────────────────────────────
// FÍSICO VIEW RENDER
// ─────────────────────────────────────────────
function renderFisico() {
  const search   = (document.getElementById('search-fisico') || {}).value || '';
  const catFil   = (document.getElementById('filter-fisico-categoria') || {}).value || '';
  const statusFil = (document.getElementById('filter-fisico-status') || {}).value || '';
  const contaFil = (document.getElementById('filter-fisico-conta') || {}).value || '';
  const tipoFil  = (document.getElementById('filter-fisico-tipo') || {}).value || '';
  const mesFil   = (document.getElementById('filter-fisico-mes') || {}).value || '';

  let items = state.gastos.filter(g => g.area === 'fisico');

  // Month: if filter-fisico-mes has value, use that; else use currentMonth
  const monthFilter = mesFil || state.currentMonth;
  items = items.filter(g => g.mes === monthFilter);

  if (search)   items = items.filter(g => g.descricao.toLowerCase().includes(search.toLowerCase()));
  if (catFil)   items = items.filter(g => g.categoria === catFil);
  if (statusFil) items = items.filter(g => g.status === statusFil);
  if (contaFil) items = items.filter(g => (g.conta || '').toLowerCase().replace(/\s/g, '_') === contaFil);
  if (tipoFil)  items = items.filter(g => g.tipoGasto === tipoFil);

  // Stats
  const total = items.reduce((s, g) => s + (g.valor || 0), 0);
  const fixos = items.filter(g => g.tipoGasto === 'fixo').reduce((s, g) => s + (g.valor || 0), 0);
  const variaveis = items.filter(g => g.tipoGasto === 'variavel').reduce((s, g) => s + (g.valor || 0), 0);
  const pagos = items.filter(g => g.status === 'pago').reduce((s, g) => s + (g.valor || 0), 0);
  const pendentes = items.filter(g => g.status === 'pendente').reduce((s, g) => s + (g.valor || 0), 0);
  const atrasados = items.filter(g => g.status === 'atrasado').reduce((s, g) => s + (g.valor || 0), 0);

  setText('total-fisico-mes', formatBRL(total));
  setText('fixos-fisico', formatBRL(fixos));
  setText('variaveis-fisico', formatBRL(variaveis));
  setText('pagos-fisico', formatBRL(pagos));
  setText('pendentes-fisico', formatBRL(pendentes));
  setText('atrasados-fisico', formatBRL(atrasados));

  renderList('lista-fisico', 'empty-fisico', items, 'fisico');
  renderChartCategoriasArea(items, 'chart-categorias-fisico', 'categoriasFisico');
}

// ─────────────────────────────────────────────
// DIGITAL VIEW RENDER
// ─────────────────────────────────────────────
function renderDigital() {
  const search   = (document.getElementById('search-digital') || {}).value || '';
  const catFil   = (document.getElementById('filter-digital-categoria') || {}).value || '';
  const statusFil = (document.getElementById('filter-digital-status') || {}).value || '';
  const contaFil = (document.getElementById('filter-digital-conta') || {}).value || '';
  const tipoFil  = (document.getElementById('filter-digital-tipo') || {}).value || '';
  const mesFil   = (document.getElementById('filter-digital-mes') || {}).value || '';

  let items = state.gastos.filter(g => g.area === 'digital');

  const monthFilter = mesFil || state.currentMonth;
  items = items.filter(g => g.mes === monthFilter);

  if (search)   items = items.filter(g => g.descricao.toLowerCase().includes(search.toLowerCase()));
  if (catFil)   items = items.filter(g => g.categoria === catFil);
  if (statusFil) items = items.filter(g => g.status === statusFil);
  if (contaFil) items = items.filter(g => (g.conta || '').toLowerCase().replace(/\s/g, '_') === contaFil);
  if (tipoFil)  items = items.filter(g => g.tipoGasto === tipoFil);

  const total = items.reduce((s, g) => s + (g.valor || 0), 0);
  const fixos = items.filter(g => g.tipoGasto === 'fixo').reduce((s, g) => s + (g.valor || 0), 0);
  const variaveis = items.filter(g => g.tipoGasto === 'variavel').reduce((s, g) => s + (g.valor || 0), 0);
  const pagos = items.filter(g => g.status === 'pago').reduce((s, g) => s + (g.valor || 0), 0);
  const pendentes = items.filter(g => g.status === 'pendente').reduce((s, g) => s + (g.valor || 0), 0);
  const atrasados = items.filter(g => g.status === 'atrasado').reduce((s, g) => s + (g.valor || 0), 0);

  setText('total-digital-mes', formatBRL(total));
  setText('fixos-digital', formatBRL(fixos));
  setText('variaveis-digital', formatBRL(variaveis));
  setText('pagos-digital', formatBRL(pagos));
  setText('pendentes-digital', formatBRL(pendentes));
  setText('atrasados-digital', formatBRL(atrasados));

  renderList('lista-digital', 'empty-digital', items, 'digital');
  renderChartCategoriasArea(items, 'chart-categorias-digital', 'categoriasDigital');
}

// ─────────────────────────────────────────────
// RECEITAS VIEW RENDER
// ─────────────────────────────────────────────
function renderReceitas() {
  const search    = (document.getElementById('search-receitas') || {}).value || '';
  const statusFil = (document.getElementById('filter-receitas-status') || {}).value || '';
  const mesFil    = (document.getElementById('filter-receitas-mes') || {}).value || '';

  const monthFilter = mesFil || state.currentMonth;
  let items = state.receitas.filter(r => r.mes === monthFilter);

  if (search)    items = items.filter(r => r.descricao.toLowerCase().includes(search.toLowerCase()));
  if (statusFil) items = items.filter(r => r.status === statusFil);

  const totalPrevisto  = items.reduce((s, r) => s + (r.valorPrevisto || 0), 0);
  const totalRecebido  = items.filter(r => r.status === 'recebido').reduce((s, r) => s + (r.valorRecebido || 0), 0);
  const totalPendente  = items.filter(r => r.status === 'pendente').reduce((s, r) => s + (r.valorPrevisto || 0), 0);

  setText('total-previsto-receitas', formatBRL(totalPrevisto));
  setText('total-recebido-receitas', formatBRL(totalRecebido));
  setText('total-pendente-receitas', formatBRL(totalPendente));

  renderListReceitas('lista-receitas', 'empty-receitas', items);
}

// ─────────────────────────────────────────────
// RENDER LISTS
// ─────────────────────────────────────────────
function renderList(listId, emptyId, items, type) {
  const list  = document.getElementById(listId);
  const empty = document.getElementById(emptyId);
  if (!list) return;

  if (items.length === 0) {
    list.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');
  // Sort by dataVencimento ascending
  const sorted = [...items].sort((a, b) => (a.dataVencimento || '').localeCompare(b.dataVencimento || ''));
  list.innerHTML = sorted.map(item => renderLancamentoItem(item, type)).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [list] });
}

function renderListReceitas(listId, emptyId, items) {
  const list  = document.getElementById(listId);
  const empty = document.getElementById(emptyId);
  if (!list) return;

  if (items.length === 0) {
    list.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');
  const sorted = [...items].sort((a, b) => (a.data || '').localeCompare(b.data || ''));
  list.innerHTML = sorted.map(item => renderReceitaItem(item)).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [list] });
}

function renderLancamentoItem(item, type) {
  const marcarBtn = item.status !== 'pago'
    ? `<button class="btn btn-sm btn-success btn-marcar-pago" title="Marcar como pago" data-id="${item.id}" data-type="${type}">✓ Pagar</button>`
    : '';

  return `
    <div class="lancamento-item" data-id="${item.id}" data-type="${type}" role="listitem">
      <div class="status-bar status-${item.status}"></div>
      <div class="item-body">
        <div class="item-title">${escapeHtml(item.descricao)}</div>
        <div class="item-meta">
          <span>${formatDate(item.dataVencimento)}</span>
          ${item.categoria ? `<span>${escapeHtml(item.categoria)}</span>` : ''}
          ${item.conta ? `<span>${escapeHtml(item.conta)}</span>` : ''}
          ${item.tipoGasto ? `<span class="badge-tipo badge-${item.tipoGasto}">${item.tipoGasto === 'fixo' ? 'Fixo' : 'Variável'}</span>` : ''}
          ${item.recorrente ? `<span class="badge-recorrente">↻ Recorrente</span>` : ''}
        </div>
      </div>
      <div class="item-right">
        <div class="item-value">${formatBRL(item.valor)}</div>
        <span class="status-badge status-${item.status}">${statusLabel(item.status)}</span>
      </div>
      <div class="item-actions">
        ${marcarBtn}
        <button class="btn-icon btn-edit" title="Editar" data-id="${item.id}" data-type="${type}">✏️</button>
        <button class="btn-icon btn-duplicate" title="Duplicar" data-id="${item.id}" data-type="${type}">📋</button>
        <button class="btn-icon btn-delete" title="Excluir" data-id="${item.id}" data-type="${type}">🗑️</button>
      </div>
    </div>`;
}

function renderReceitaItem(item) {
  const marcarBtn = item.status !== 'recebido'
    ? `<button class="btn btn-sm btn-success btn-marcar-pago" title="Marcar como recebido" data-id="${item.id}" data-type="receita">✓ Receber</button>`
    : '';

  return `
    <div class="lancamento-item" data-id="${item.id}" data-type="receita" role="listitem">
      <div class="status-bar status-${item.status}"></div>
      <div class="item-body">
        <div class="item-title">${escapeHtml(item.descricao)}</div>
        <div class="item-meta">
          <span>${formatDate(item.data)}</span>
          <span>Previsto: ${formatBRL(item.valorPrevisto)}</span>
          ${item.valorRecebido ? `<span>Recebido: ${formatBRL(item.valorRecebido)}</span>` : ''}
          ${item.recorrente ? `<span class="badge-recorrente">↻ Recorrente</span>` : ''}
        </div>
      </div>
      <div class="item-right">
        <div class="item-value">${formatBRL(item.valorPrevisto)}</div>
        <span class="status-badge status-${item.status}">${statusLabel(item.status)}</span>
      </div>
      <div class="item-actions">
        ${marcarBtn}
        <button class="btn-icon btn-edit" title="Editar" data-id="${item.id}" data-type="receita">✏️</button>
        <button class="btn-icon btn-duplicate" title="Duplicar" data-id="${item.id}" data-type="receita">📋</button>
        <button class="btn-icon btn-delete" title="Excluir" data-id="${item.id}" data-type="receita">🗑️</button>
      </div>
    </div>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────
function openAddModal() {
  const view = state.currentView;
  state.editingId   = null;
  state.editingType = null;

  if (view === 'fisico' || view === 'digital' || view === 'receitas') {
    const typeMap = { fisico: 'fisico', digital: 'digital', receitas: 'receita' };
    openModal(typeMap[view]);
  } else {
    showModalStep1();
  }
}

function showModalStep1() {
  document.getElementById('modal-step-1').classList.remove('hidden');
  document.getElementById('modal-step-2').classList.add('hidden');
  document.getElementById('modal-title').textContent = 'Novo Lançamento';
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function openModal(type, editId = null) {
  state.editingType = type;
  state.editingId   = editId;

  document.getElementById('modal-step-1').classList.add('hidden');
  document.getElementById('modal-step-2').classList.remove('hidden');

  const typeLabels = { fisico: 'Gasto Físico', digital: 'Gasto Digital', receita: 'Receita' };
  const badge = document.getElementById('modal-step-2-type-label');
  if (badge) {
    badge.textContent = typeLabels[type] || type;
    badge.className = `modal-type-badge type-badge-${type}`;
  }

  document.getElementById('modal-title').textContent = editId ? 'Editar Lançamento' : 'Novo Lançamento';
  document.getElementById('form-submit-label').textContent = editId ? 'Salvar alterações' : 'Salvar';

  buildFormFields(type);

  document.getElementById('modal-overlay').classList.remove('hidden');

  // If editing, fill form
  if (editId) {
    fillFormForEdit(editId, type);
  }

  // Re-init lucide icons inside modal
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ nodes: [document.getElementById('modal')] });
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-step-1').classList.remove('hidden');
  document.getElementById('modal-step-2').classList.add('hidden');
  document.getElementById('form-fields-container').innerHTML = '';
  const form = document.getElementById('lancamento-form');
  if (form) form.reset();
  state.editingId   = null;
  state.editingType = null;
}

function buildFormFields(type) {
  const container = document.getElementById('form-fields-container');
  if (!container) return;

  if (type === 'fisico' || type === 'digital') {
    const categorias = type === 'fisico' ? CATEGORIAS_FISICO : CATEGORIAS_DIGITAL;
    container.innerHTML = `
      <div class="form-section-title">Informações básicas</div>
      <div class="form-group">
        <label for="f-descricao">Descrição *</label>
        <input type="text" id="f-descricao" name="descricao" required placeholder="Ex: Aluguel maio 2025" autocomplete="off">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="f-valor">Valor *</label>
          <input type="text" id="f-valor" name="valor" placeholder="R$ 0,00" required autocomplete="off">
        </div>
        <div class="form-group">
          <label for="f-dataVencimento">Vencimento *</label>
          <input type="date" id="f-dataVencimento" name="dataVencimento" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="f-categoria">Categoria</label>
          <select id="f-categoria" name="categoria">
            <option value="">Selecione...</option>
            ${categorias.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="f-tipoGasto">Tipo</label>
          <select id="f-tipoGasto" name="tipoGasto">
            <option value="fixo">Fixo</option>
            <option value="variavel">Variável</option>
          </select>
        </div>
      </div>
      <div class="form-section-title">Pagamento</div>
      <div class="form-row">
        <div class="form-group">
          <label for="f-formaPagamento">Forma de pagamento</label>
          <select id="f-formaPagamento" name="formaPagamento">
            <option value="">Selecione...</option>
            ${FORMAS_PAGAMENTO.map(f => `<option value="${f.toLowerCase().replace(/\s/g, '_')}">${escapeHtml(f)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="f-conta">Conta</label>
          <select id="f-conta" name="conta">
            <option value="">Selecione...</option>
            ${CONTAS.map(c => `<option value="${c.toLowerCase().replace(/\s/g, '_')}">${escapeHtml(c)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="f-status">Status</label>
          <select id="f-status" name="status">
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>
        <div class="form-group">
          <label for="f-dataPagamento">Data de pagamento</label>
          <input type="date" id="f-dataPagamento" name="dataPagamento">
        </div>
      </div>
      <div class="form-group">
        <label for="f-responsavel">Responsável</label>
        <input type="text" id="f-responsavel" name="responsavel" placeholder="Nome do responsável">
      </div>
      <div class="form-group">
        <label for="f-observacao">Observação</label>
        <textarea id="f-observacao" name="observacao" placeholder="Observações adicionais..." rows="3"></textarea>
      </div>
      <div class="form-section-title">Recorrência</div>
      <div class="form-group toggle-row">
        <label class="toggle-label" for="chk-recorrente">
          <input type="checkbox" name="recorrente" id="chk-recorrente">
          <span class="toggle-slider"></span>
          Tornar recorrente
        </label>
      </div>
      <div id="recorrencia-fields" class="recorrencia-fields hidden">
        <div class="form-row">
          <div class="form-group">
            <label for="f-frequencia">Frequência</label>
            <select id="f-frequencia" name="frequencia">
              <option value="mensal">Mensal</option>
              <option value="semanal">Semanal</option>
              <option value="anual">Anual</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="f-diaVencimento">Dia do vencimento</label>
            <input type="number" id="f-diaVencimento" name="diaVencimento" min="1" max="31" placeholder="Ex: 5">
          </div>
        </div>
      </div>`;

    // Bind recorrente toggle
    const chk = document.getElementById('chk-recorrente');
    if (chk) {
      chk.addEventListener('change', function () {
        const fields = document.getElementById('recorrencia-fields');
        if (fields) fields.classList.toggle('hidden', !this.checked);
      });
    }

    // Apply BRL mask
    const valorInput = document.getElementById('f-valor');
    if (valorInput) applyBRLMask(valorInput);

  } else if (type === 'receita') {
    container.innerHTML = `
      <div class="form-group">
        <label for="f-descricao">Descrição *</label>
        <input type="text" id="f-descricao" name="descricao" required placeholder="Ex: Mensalidade João" autocomplete="off">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="f-valorPrevisto">Valor previsto *</label>
          <input type="text" id="f-valorPrevisto" name="valorPrevisto" placeholder="R$ 0,00" required autocomplete="off">
        </div>
        <div class="form-group">
          <label for="f-valorRecebido">Valor recebido</label>
          <input type="text" id="f-valorRecebido" name="valorRecebido" placeholder="R$ 0,00" autocomplete="off">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="f-data">Data *</label>
          <input type="date" id="f-data" name="data" required>
        </div>
        <div class="form-group">
          <label for="f-status">Status</label>
          <select id="f-status" name="status">
            <option value="pendente">Pendente</option>
            <option value="recebido">Recebido</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="f-observacao">Observação</label>
        <textarea id="f-observacao" name="observacao" placeholder="Observações adicionais..." rows="3"></textarea>
      </div>
      <div class="form-section-title">Recorrência</div>
      <div class="form-group toggle-row">
        <label class="toggle-label" for="chk-recorrente">
          <input type="checkbox" name="recorrente" id="chk-recorrente">
          <span class="toggle-slider"></span>
          Tornar recorrente
        </label>
      </div>`;

    // BRL masks
    const vpInput = document.getElementById('f-valorPrevisto');
    const vrInput = document.getElementById('f-valorRecebido');
    if (vpInput) applyBRLMask(vpInput);
    if (vrInput) applyBRLMask(vrInput);
  }
}

function fillFormForEdit(editId, type) {
  if (type === 'receita') {
    const item = state.receitas.find(r => r.id === editId);
    if (!item) return;
    setFieldValue('descricao', item.descricao);
    setFieldValueBRL('valorPrevisto', item.valorPrevisto);
    setFieldValueBRL('valorRecebido', item.valorRecebido);
    setFieldValue('data', item.data);
    setFieldValue('status', item.status);
    setFieldValue('observacao', item.observacao);
    setCheckbox('recorrente', item.recorrente);
  } else {
    const item = state.gastos.find(g => g.id === editId);
    if (!item) return;
    setFieldValue('descricao', item.descricao);
    setFieldValueBRL('valor', item.valor);
    setFieldValue('dataVencimento', item.dataVencimento);
    setFieldValue('categoria', item.categoria);
    setFieldValue('tipoGasto', item.tipoGasto || 'fixo');
    setFieldValue('formaPagamento', item.formaPagamento);
    setFieldValue('conta', item.conta);
    setFieldValue('status', item.status);
    setFieldValue('dataPagamento', item.dataPagamento || '');
    setFieldValue('responsavel', item.responsavel);
    setFieldValue('observacao', item.observacao);
    setCheckbox('recorrente', item.recorrente);
    if (item.recorrente) {
      const rf = document.getElementById('recorrencia-fields');
      if (rf) rf.classList.remove('hidden');
      setFieldValue('frequencia', item.frequencia);
      setFieldValue('diaVencimento', item.diaVencimento);
    }
  }
}

function setFieldValue(name, value) {
  const el = document.querySelector(`[name="${name}"]`);
  if (el && value !== null && value !== undefined) el.value = value;
}

function setFieldValueBRL(name, value) {
  const el = document.querySelector(`[name="${name}"]`);
  if (el && value !== null && value !== undefined && value !== 0) {
    el.value = formatBRL(value);
  }
}

function setCheckbox(name, checked) {
  const el = document.querySelector(`[name="${name}"]`);
  if (el) el.checked = !!checked;
}

// ─────────────────────────────────────────────
// FORM SUBMISSION
// ─────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();

  const type = state.editingType;
  const form = document.getElementById('lancamento-form');
  const data = new FormData(form);

  if (type === 'receita') {
    const descricao = (data.get('descricao') || '').trim();
    const valorPrevistoStr = data.get('valorPrevisto') || '';
    const dataField = data.get('data') || '';

    if (!descricao) { showToast('Descrição é obrigatória.', 'error'); return; }
    if (!valorPrevistoStr) { showToast('Valor previsto é obrigatório.', 'error'); return; }
    if (!dataField) { showToast('Data é obrigatória.', 'error'); return; }

    const valorPrevisto = parseBRL(valorPrevistoStr);
    const valorRecebido = parseBRL(data.get('valorRecebido') || '');

    const item = {
      id: state.editingId || crypto.randomUUID(),
      descricao,
      valorPrevisto,
      valorRecebido,
      data: dataField,
      status: data.get('status') || 'pendente',
      observacao: data.get('observacao') || '',
      recorrente: data.get('recorrente') === 'on',
      mes: getMonthFromDate(dataField),
      criadoEm: state.editingId
        ? (state.receitas.find(r => r.id === state.editingId) || {}).criadoEm || Date.now()
        : Date.now()
    };

    if (state.editingId) {
      const idx = state.receitas.findIndex(r => r.id === state.editingId);
      if (idx !== -1) state.receitas[idx] = item;
    } else {
      state.receitas.push(item);
    }
    saveReceitas();

    if (item.recorrente && !state.editingId) {
      gerarRecorrenciasReceita(item, 3);
    }

  } else {
    const descricao = (data.get('descricao') || '').trim();
    const valorStr  = data.get('valor') || '';
    const dataVencimento = data.get('dataVencimento') || '';

    if (!descricao) { showToast('Descrição é obrigatória.', 'error'); return; }
    if (!valorStr) { showToast('Valor é obrigatório.', 'error'); return; }
    if (!dataVencimento) { showToast('Data de vencimento é obrigatória.', 'error'); return; }

    const valor = parseBRL(valorStr);

    const item = {
      id: state.editingId || crypto.randomUUID(),
      area: type,
      descricao,
      valor,
      dataVencimento,
      dataPagamento: data.get('dataPagamento') || null,
      status: data.get('status') || 'pendente',
      formaPagamento: data.get('formaPagamento') || '',
      conta: data.get('conta') || '',
      categoria: data.get('categoria') || '',
      observacao: data.get('observacao') || '',
      tipoGasto: data.get('tipoGasto') || 'fixo',
      responsavel: data.get('responsavel') || '',
      recorrente: data.get('recorrente') === 'on',
      frequencia: data.get('frequencia') || 'mensal',
      diaVencimento: parseInt(data.get('diaVencimento') || '0', 10) || null,
      mes: getMonthFromDate(dataVencimento),
      criadoEm: state.editingId
        ? (state.gastos.find(g => g.id === state.editingId) || {}).criadoEm || Date.now()
        : Date.now()
    };

    // Auto-update status
    if (item.status !== 'pago' && item.dataVencimento < todayStr()) {
      item.status = 'atrasado';
    }
    if (item.dataPagamento) item.status = 'pago';

    if (state.editingId) {
      const idx = state.gastos.findIndex(g => g.id === state.editingId);
      if (idx !== -1) state.gastos[idx] = item;
    } else {
      state.gastos.push(item);
    }
    saveGastos();

    if (item.recorrente && !state.editingId) {
      gerarRecorrencias(item, 3);
      return; // gerarRecorrencias calls closeModal + renderView
    }
  }

  closeModal();
  showToast(state.editingId ? 'Lançamento atualizado!' : 'Lançamento adicionado!', 'success');
  renderView(state.currentView);
}

// ─────────────────────────────────────────────
// RECORRÊNCIA
// ─────────────────────────────────────────────
function gerarRecorrencias(gasto, meses) {
  let count = 0;
  for (let i = 1; i <= meses; i++) {
    const nextMonth = addMonths(gasto.mes, i);
    const exists = state.gastos.some(g =>
      g.descricao === gasto.descricao &&
      g.area === gasto.area &&
      g.mes === nextMonth
    );
    if (exists) continue;

    const [y, m] = nextMonth.split('-').map(Number);
    const day = gasto.diaVencimento || parseInt(gasto.dataVencimento.split('-')[2], 10);
    const maxDay = new Date(y, m, 0).getDate();
    const clampedDay = Math.min(day, maxDay);
    const newDate = `${nextMonth}-${String(clampedDay).padStart(2, '0')}`;

    const newGasto = {
      ...gasto,
      id: crypto.randomUUID(),
      dataVencimento: newDate,
      dataPagamento: null,
      status: newDate < todayStr() ? 'atrasado' : 'pendente',
      mes: nextMonth,
      criadoEm: Date.now()
    };
    state.gastos.push(newGasto);
    count++;
  }
  saveGastos();
  closeModal();
  showToast(`Lançamento adicionado! ${count > 0 ? `+${count} recorrências geradas.` : ''}`, 'success');
  renderView(state.currentView);
}

function gerarRecorrenciasReceita(receita, meses) {
  let count = 0;
  for (let i = 1; i <= meses; i++) {
    const nextMonth = addMonths(receita.mes, i);
    const exists = state.receitas.some(r =>
      r.descricao === receita.descricao &&
      r.mes === nextMonth
    );
    if (exists) continue;

    const [y, m] = nextMonth.split('-').map(Number);
    const day = parseInt(receita.data.split('-')[2], 10);
    const maxDay = new Date(y, m, 0).getDate();
    const clampedDay = Math.min(day, maxDay);
    const newDate = `${nextMonth}-${String(clampedDay).padStart(2, '0')}`;

    const newReceita = {
      ...receita,
      id: crypto.randomUUID(),
      data: newDate,
      status: 'pendente',
      valorRecebido: 0,
      mes: nextMonth,
      criadoEm: Date.now()
    };
    state.receitas.push(newReceita);
    count++;
  }
  saveReceitas();
}

// ─────────────────────────────────────────────
// ITEM ACTIONS
// ─────────────────────────────────────────────
function marcarComoPago(id, type) {
  if (type === 'receita') {
    const item = state.receitas.find(r => r.id === id);
    if (!item) return;
    item.status = 'recebido';
    item.valorRecebido = item.valorRecebido || item.valorPrevisto;
    saveReceitas();
    showToast('Marcado como recebido!', 'success');
  } else {
    const item = state.gastos.find(g => g.id === id);
    if (!item) return;
    item.status = 'pago';
    item.dataPagamento = todayStr();
    saveGastos();
    showToast('Marcado como pago!', 'success');
  }
  renderView(state.currentView);
}

function openEditModal(id, type) {
  openModal(type, id);
}

function confirmDelete(id, type) {
  if (!confirm('Confirmar exclusão?')) return;
  if (type === 'receita') {
    state.receitas = state.receitas.filter(r => r.id !== id);
    saveReceitas();
  } else {
    state.gastos = state.gastos.filter(g => g.id !== id);
    saveGastos();
  }
  showToast('Lançamento excluído.', 'info');
  renderView(state.currentView);
}

function duplicate(id, type) {
  if (type === 'receita') {
    const item = state.receitas.find(r => r.id === id);
    if (!item) return;
    const copy = { ...item, id: crypto.randomUUID(), criadoEm: Date.now() };
    state.receitas.push(copy);
    saveReceitas();
  } else {
    const item = state.gastos.find(g => g.id === id);
    if (!item) return;
    const copy = {
      ...item,
      id: crypto.randomUUID(),
      criadoEm: Date.now(),
      status: 'pendente',
      dataPagamento: null
    };
    state.gastos.push(copy);
    saveGastos();
  }
  showToast('Lançamento duplicado!', 'success');
  renderView(state.currentView);
}

// ─────────────────────────────────────────────
// TOASTS
// ─────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toasts');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hiding');
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// ─────────────────────────────────────────────
// EXPORT CSV
// ─────────────────────────────────────────────
function exportCSV(type) {
  let rows, headers, filename;

  if (type === 'receita') {
    const mesFil = (document.getElementById('filter-receitas-mes') || {}).value || '';
    const month  = mesFil || state.currentMonth;
    const items  = state.receitas.filter(r => r.mes === month);
    headers = ['Descrição','Valor Previsto','Valor Recebido','Data','Status','Observação'];
    rows    = items.map(r => [
      r.descricao,
      r.valorPrevisto,
      r.valorRecebido,
      r.data,
      r.status,
      r.observacao
    ]);
    filename = `receitas_${month}.csv`;
  } else {
    const mesFil = (document.getElementById(`filter-${type}-mes`) || {}).value || '';
    const month  = mesFil || state.currentMonth;
    const items  = state.gastos.filter(g => g.area === type && g.mes === month);
    headers = ['Descrição','Valor','Vencimento','Status','Categoria','Conta','Forma Pagamento','Tipo','Responsável','Observação'];
    rows    = items.map(g => [
      g.descricao,
      g.valor,
      g.dataVencimento,
      g.status,
      g.categoria,
      g.conta,
      g.formaPagamento,
      g.tipoGasto,
      g.responsavel,
      g.observacao
    ]);
    filename = `gastos_${type}_${month}.csv`;
  }

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  downloadBlob(csv, filename, 'text/csv;charset=utf-8;');
  showToast('CSV exportado!', 'success');
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob(['﻿' + content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────
// BACKUP & RESTORE
// ─────────────────────────────────────────────
function backupData() {
  const backup = {
    gastos:   state.gastos,
    receitas: state.receitas,
    exportedAt: new Date().toISOString()
  };
  const json = JSON.stringify(backup, null, 2);
  downloadBlob(json, `catavento_backup_${todayStr()}.json`, 'application/json');
  showToast('Backup realizado!', 'success');
}

function restoreData(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data.gastos) || !Array.isArray(data.receitas)) {
        showToast('Arquivo inválido.', 'error');
        return;
      }
      if (!confirm(`Restaurar backup de ${data.exportedAt || 'data desconhecida'}? Isso substituirá todos os dados atuais.`)) return;
      state.gastos   = data.gastos;
      state.receitas = data.receitas;
      saveGastos();
      saveReceitas();
      updateAllStatus();
      renderView(state.currentView);
      showToast('Backup restaurado com sucesso!', 'success');
    } catch (err) {
      showToast('Erro ao restaurar backup.', 'error');
    }
  };
  reader.readAsText(file);
}

// ─────────────────────────────────────────────
// SIDEBAR SETTINGS (backup/restore buttons)
// ─────────────────────────────────────────────
function buildSidebarFooterControls() {
  const footer = document.getElementById('sidebar-footer');
  if (!footer) return;

  const controls = document.createElement('div');
  controls.id = 'sidebar-data-controls';
  controls.innerHTML = `
    <div class="sidebar-divider"></div>
    <button class="btn-ghost btn-sm sidebar-btn" id="btn-backup" title="Fazer backup dos dados">
      <i data-lucide="download"></i>
      <span>Backup</span>
    </button>
    <label class="btn-ghost btn-sm sidebar-btn" title="Restaurar backup" style="cursor:pointer;">
      <i data-lucide="upload"></i>
      <span>Restaurar</span>
      <input type="file" id="input-restore" accept=".json" style="display:none">
    </label>
  `;
  footer.appendChild(controls);

  document.getElementById('btn-backup').addEventListener('click', backupData);
  document.getElementById('input-restore').addEventListener('change', function () {
    if (this.files && this.files[0]) {
      restoreData(this.files[0]);
      this.value = '';
    }
  });
}

function buildListToolbars() {
  // Add export buttons to each list view filter-bar
  [
    { barId: 'filter-bar-fisico',   type: 'fisico' },
    { barId: 'filter-bar-digital',  type: 'digital' },
    { barId: 'filter-bar-receitas', type: 'receita' }
  ].forEach(({ barId, type }) => {
    const bar = document.getElementById(barId);
    if (!bar) return;
    const btn = document.createElement('button');
    btn.className = 'btn-ghost btn-sm export-btn';
    btn.title = 'Exportar CSV';
    btn.innerHTML = `<i data-lucide="file-down"></i> <span>CSV</span>`;
    btn.addEventListener('click', () => exportCSV(type));
    const actions = bar.querySelector('.filter-actions');
    if (actions) actions.appendChild(btn);
    else bar.appendChild(btn);
  });
}

// ─────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────
function setupEventListeners() {

  // Navigation — sidebar + bottom nav
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view));
  });

  // Quick-add buttons in empty states
  document.querySelectorAll('[data-add-type]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.addType));
  });

  // Add button (top bar)
  const addBtn = document.getElementById('add-btn');
  if (addBtn) addBtn.addEventListener('click', openAddModal);

  // Month navigation
  const monthPrev = document.getElementById('month-prev');
  const monthNext = document.getElementById('month-next');
  if (monthPrev) {
    monthPrev.addEventListener('click', () => {
      state.currentMonth = addMonths(state.currentMonth, -1);
      updateMonthDisplay();
      renderView(state.currentView);
    });
  }
  if (monthNext) {
    monthNext.addEventListener('click', () => {
      state.currentMonth = addMonths(state.currentMonth, 1);
      updateMonthDisplay();
      renderView(state.currentView);
    });
  }

  // Modal overlay click-outside
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }

  // Modal close button
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Modal back button
  const backBtn = document.getElementById('modal-back-btn');
  if (backBtn) backBtn.addEventListener('click', showModalStep1);

  // Modal cancel button
  const cancelBtn = document.getElementById('form-cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Step 1 type selector buttons
  document.querySelectorAll('.type-selector-btn[data-type]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.type));
  });

  // Form submit
  const form = document.getElementById('lancamento-form');
  if (form) form.addEventListener('submit', handleFormSubmit);

  // Filters — físico
  const searchFisico = document.getElementById('search-fisico');
  if (searchFisico) searchFisico.addEventListener('input', debounce(() => renderFisico(), 300));

  ['filter-fisico-mes','filter-fisico-categoria','filter-fisico-status','filter-fisico-conta','filter-fisico-tipo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => renderFisico());
  });

  const clearFisico = document.getElementById('clear-filters-fisico');
  if (clearFisico) {
    clearFisico.addEventListener('click', () => {
      ['search-fisico','filter-fisico-mes','filter-fisico-categoria','filter-fisico-status','filter-fisico-conta','filter-fisico-tipo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      renderFisico();
    });
  }

  // Filters — digital
  const searchDigital = document.getElementById('search-digital');
  if (searchDigital) searchDigital.addEventListener('input', debounce(() => renderDigital(), 300));

  ['filter-digital-mes','filter-digital-categoria','filter-digital-status','filter-digital-conta','filter-digital-tipo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => renderDigital());
  });

  const clearDigital = document.getElementById('clear-filters-digital');
  if (clearDigital) {
    clearDigital.addEventListener('click', () => {
      ['search-digital','filter-digital-mes','filter-digital-categoria','filter-digital-status','filter-digital-conta','filter-digital-tipo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      renderDigital();
    });
  }

  // Filters — receitas
  const searchReceitas = document.getElementById('search-receitas');
  if (searchReceitas) searchReceitas.addEventListener('input', debounce(() => renderReceitas(), 300));

  ['filter-receitas-mes','filter-receitas-status'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => renderReceitas());
  });

  const clearReceitas = document.getElementById('clear-filters-receitas');
  if (clearReceitas) {
    clearReceitas.addEventListener('click', () => {
      ['search-receitas','filter-receitas-mes','filter-receitas-status'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      renderReceitas();
    });
  }

  // Event delegation for list item actions
  setupListDelegation('lista-fisico');
  setupListDelegation('lista-digital');
  setupListDelegation('lista-receitas');

  // Mobile menu toggle (sidebar)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
    });
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('sidebar-open') &&
          !sidebar.contains(e.target) &&
          e.target !== mobileMenuBtn) {
        sidebar.classList.remove('sidebar-open');
      }
    });
  }

  // Keyboard close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('modal-overlay');
      if (overlay && !overlay.classList.contains('hidden')) closeModal();
    }
  });
}

function setupListDelegation(listId) {
  const list = document.getElementById(listId);
  if (!list) return;

  list.addEventListener('click', function (e) {
    const pagoBtn    = e.target.closest('.btn-marcar-pago');
    const editBtn    = e.target.closest('.btn-edit');
    const deleteBtn  = e.target.closest('.btn-delete');
    const dupBtn     = e.target.closest('.btn-duplicate');

    if (pagoBtn) {
      marcarComoPago(pagoBtn.dataset.id, pagoBtn.dataset.type);
    } else if (editBtn) {
      openEditModal(editBtn.dataset.id, editBtn.dataset.type);
    } else if (deleteBtn) {
      confirmDelete(deleteBtn.dataset.id, deleteBtn.dataset.type);
    } else if (dupBtn) {
      duplicate(dupBtn.dataset.id, dupBtn.dataset.type);
    }
  });
}

// ─────────────────────────────────────────────
// INITIALIZE
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateAllStatus();
  populateMonthSelector();
  populateFilterCategories();
  buildSidebarFooterControls();
  buildListToolbars();
  setupEventListeners();

  if (typeof lucide !== 'undefined') lucide.createIcons();

  navigateTo('dashboard');
});
