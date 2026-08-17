// ============================================
// 高中学习助手 - 核心逻辑
// ============================================

// --- 数据模型 ---
const SUBJECTS = ['语文','数学','英语','物理','化学','生物','政治','历史','地理','信息技术','通用技术'];

// 各科知识点体系
const KNOWLEDGE_MAP = {
  语文: [
    '文言文阅读', '古诗词鉴赏', '现代文阅读', '作文写作', '语言文字运用',
    '名篇名句默写', '文学常识', '修辞手法', '文言虚词', '文言实词',
    '病句辨析', '成语运用', '阅读理解·论述类', '阅读理解·文学类', '阅读理解·实用类',
  ],
  数学: [
    '集合与逻辑', '函数概念与性质', '指数函数与对数函数', '三角函数', '平面向量',
    '数列', '不等式', '立体几何', '解析几何', '概率与统计',
    '导数及其应用', '复数', '排列组合', '二项式定理', '数学归纳法',
    '空间向量', '圆锥曲线', '直线与圆', '函数的零点', '定积分',
  ],
  英语: [
    '语法·时态语态', '语法·非谓语动词', '语法·从句', '语法·虚拟语气', '语法·倒装强调',
    '完形填空', '阅读理解', '七选五', '短文改错', '书面表达',
    '词汇辨析', '固定搭配', '听力理解', '任务型阅读', '语法填空',
  ],
  物理: [
    '运动学', '力的相互作用', '牛顿运动定律', '曲线运动', '万有引力',
    '机械能守恒', '动量守恒', '电场', '恒定电流', '磁场',
    '电磁感应', '交流电', '热学', '光学', '原子物理',
    '机械振动', '机械波', '相对论初步', '实验·力学', '实验·电学',
  ],
  化学: [
    '物质的量', '离子反应', '氧化还原反应', '金属及其化合物', '非金属及其化合物',
    '元素周期律', '化学键与分子结构', '化学反应与能量', '化学反应速率', '化学平衡',
    '水溶液中的离子平衡', '电化学', '有机化学基础', '化学实验基础', '物质结构与性质',
  ],
  生物: [
    '细胞的分子组成', '细胞的结构与功能', '细胞的代谢', '细胞的生命历程', '遗传的基本规律',
    '基因与染色体', '基因的表达', '生物的变异与进化', '植物激素', '动物生命活动调节',
    '人体的内环境与稳态', '种群与群落', '生态系统', '生物技术实践', '现代生物科技',
  ],
  政治: [
    '生活与消费', '生产劳动与经营', '收入与分配', '社会主义市场经济', '公民的政治生活',
    '为人民服务的政府', '发展社会主义民主政治', '当代国际社会', '文化与生活', '文化传承与创新',
    '中华文化与民族精神', '生活智慧与时代精神', '探索世界与追求真理', '思想方法与创新意识', '认识社会与价值选择',
  ],
  历史: [
    '中国古代政治制度', '中国古代经济', '中国古代思想文化', '列强侵华与民族危机', '近代中国民主革命',
    '近代中国经济结构变动', '近代中国思想解放', '新民主主义革命', '新中国政治建设', '新中国经济建设',
    '新中国外交', '古希腊罗马', '西方人文精神发展', '世界市场的形成', '西方民主政治',
    '社会主义运动', '世界近现代科技文化', '二战后的世界', '经济全球化', '中国古代史综合',
  ],
  地理: [
    '地球与地图', '大气运动', '水体运动', '地壳物质循环', '自然地理环境的整体性与差异性',
    '人口', '城市', '农业', '工业', '交通运输',
    '区域可持续发展', '地理信息技术', '世界地理', '中国地理', '自然灾害与防治',
  ],
  信息技术: [
    '信息与信息技术基础', '计算机基础', '网络基础', '数据库基础', '算法与程序设计',
    '多媒体技术', '信息安全', '人工智能初步', '数据处理与分析', '网页设计与制作',
  ],
  通用技术: [
    '技术与设计基础', '设计过程', '工艺与材料', '结构与力学', '流程与系统',
    '控制与设计', '技术试验', '技术图样绘制', '模型制作', '技术评价',
  ],
};

// 错误原因映射
const ERROR_REASONS = ['概念不清','计算错误','审题不清','知识点遗忘','粗心大意','方法错误','时间不够'];

// --- 存储 ---
const STORAGE_KEY = 'error_book_data';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { errors: [], papers: [], summaries: [], customKnowledge: {} };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let appData = loadData();

// --- 导航 ---
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  renderSidebarSubjects();
  initNavEvents();
  initFormEvents();
  initUploadEvents();
  initSummaryFormEvents();
  document.getElementById('summaryCount').textContent = (appData.summaries || []).length;
  navigateTo('dashboard');
}

function initNavEvents() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      navigateTo(page);
    });
  });
}

function navigateTo(page) {
  document.querySelectorAll('.nav-item[data-page]').forEach(i => i.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.style.display = 'block';

  switch(page) {
    case 'dashboard': renderDashboard(); break;
    case 'errors': renderErrorsPage(); break;
    case 'papers': renderPapersPage(); break;
    case 'knowledge': renderKnowledgePage(); break;
    case 'plan': renderPlanPage(); break;
    case 'summaries': renderSummariesPage(); break;
  }
}

function renderSidebarSubjects() {
  const nav = document.getElementById('sidebarNav');
  const subjectSection = nav.querySelector('.nav-section:last-child');
  // Remove existing subject items
  subjectSection.querySelectorAll('.nav-item[data-subject]').forEach(i => i.remove());

  SUBJECTS.forEach(subject => {
    const count = appData.errors.filter(e => e.subject === subject).length;
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.dataset.subject = subject;
    btn.innerHTML = `
      <span class="nav-icon">${getSubjectIcon(subject)}</span>${subject}
      ${count > 0 ? `<span class="nav-badge">${count}</span>` : ''}
    `;
    btn.addEventListener('click', () => {
      navigateTo('errors');
      document.getElementById('filterSubject').value = subject;
      renderErrorsTable();
    });
    subjectSection.appendChild(btn);
  });
}

function getSubjectIcon(subject) {
  const icons = { '语文':'📖','数学':'🔢','英语':'🌐','物理':'⚡','化学':'🧪','生物':'🧬','政治':'⚖️','历史':'📜','地理':'🌍','信息技术':'💻','通用技术':'🔧' };
  return icons[subject] || '📚';
}

// --- Dashboard ---
function renderDashboard() {
  const totalErrors = appData.errors.length;
  const mastered = appData.errors.filter(e => e.mastered === 'mastered').length;
  const notMastered = appData.errors.filter(e => e.mastered === 'not-mastered').length;
  const reviewing = appData.errors.filter(e => e.mastered === 'reviewing').length;
  const totalSummaries = (appData.summaries || []).length;

  document.getElementById('dashboardStats').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon blue">📝</div>
      <div class="stat-info"><h3>${totalErrors}</h3><p>错题总数</p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon red">⚠️</div>
      <div class="stat-info"><h3>${notMastered}</h3><p>未掌握</p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon orange">🔄</div>
      <div class="stat-info"><h3>${reviewing}</h3><p>复习中</p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green">✅</div>
      <div class="stat-info"><h3>${mastered}</h3><p>已掌握</p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon blue">📓</div>
      <div class="stat-info"><h3>${totalSummaries}</h3><p>考试总结</p></div>
    </div>
  `;

  // Subject chart
  const chartDiv = document.getElementById('subjectChart');
  if (totalErrors === 0) {
    chartDiv.innerHTML = '<div class="empty-state"><p>暂无数据，快去添加错题吧！</p></div>';
  } else {
    const subjectCounts = {};
    SUBJECTS.forEach(s => {
      const count = appData.errors.filter(e => e.subject === s).length;
      if (count > 0) subjectCounts[s] = count;
    });

    const maxCount = Math.max(...Object.values(subjectCounts), 1);
    chartDiv.innerHTML = Object.entries(subjectCounts).map(([s, c]) => {
      const pct = Math.round((c / maxCount) * 100);
      return `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="width:60px;font-size:13px;font-weight:600;">${getSubjectIcon(s)} ${s}</span>
          <div style="flex:1;height:24px;background:#f0f0f0;border-radius:12px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#818cf8,#4f46e5);border-radius:12px;transition:width 0.5s;"></div>
          </div>
          <span style="width:30px;font-size:13px;font-weight:600;text-align:right;">${c}</span>
        </div>`;
    }).join('');
  }

  // Top knowledge
  const topDiv = document.getElementById('topKnowledge');
  const knowledgeCounts = {};
  appData.errors.forEach(e => {
    if (e.knowledge && Array.isArray(e.knowledge)) {
      e.knowledge.forEach(k => {
        knowledgeCounts[k] = (knowledgeCounts[k] || 0) + 1;
      });
    }
  });
  const sorted = Object.entries(knowledgeCounts).sort((a,b) => b[1] - a[1]).slice(0, 10);
  if (sorted.length === 0) {
    topDiv.innerHTML = '<div class="empty-state"><p>暂无数据</p></div>';
  } else {
    topDiv.innerHTML = sorted.map(([k, c], i) => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0;">
        <span style="width:24px;height:24px;border-radius:50%;background:${i < 3 ? '#4f46e5' : '#e0e0e0'};color:${i < 3 ? '#fff' : '#666'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${i+1}</span>
        <span style="flex:1;font-size:14px;">${k}</span>
        <span style="font-weight:600;color:var(--primary);">${c}题</span>
      </div>`).join('');
  }
}

// --- Errors Page ---
function renderErrorsPage() {
  // Populate filters
  const filterSubject = document.getElementById('filterSubject');
  filterSubject.innerHTML = '<option value="">全部科目</option>' + SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('errorCount').textContent = appData.errors.length;

  // Event listeners
  document.getElementById('searchErrors').addEventListener('input', renderErrorsTable);
  document.getElementById('filterSubject').addEventListener('change', renderErrorsTable);
  document.getElementById('filterMastered').addEventListener('change', renderErrorsTable);

  renderErrorsTable();
}

function renderErrorsTable() {
  const search = (document.getElementById('searchErrors')?.value || '').toLowerCase();
  const subject = document.getElementById('filterSubject')?.value || '';
  const mastered = document.getElementById('filterMastered')?.value || '';

  let filtered = appData.errors;
  if (search) {
    filtered = filtered.filter(e =>
      (e.question || '').toLowerCase().includes(search) ||
      (e.knowledge || []).some(k => k.toLowerCase().includes(search)) ||
      (e.correctAnswer || '').toLowerCase().includes(search)
    );
  }
  if (subject) filtered = filtered.filter(e => e.subject === subject);
  if (mastered) filtered = filtered.filter(e => e.mastered === mastered);

  // Sort by date desc
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  const tbody = document.getElementById('errorsTableBody');
  const empty = document.getElementById('errorsEmpty');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = filtered.map(e => `
      <tr>
        <td><span class="subject-tag ${e.subject}">${e.subject}</span></td>
        <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(e.question)}">${escapeHtml(e.question).substring(0, 40)}</td>
        <td>${(e.knowledge || []).map(k => `<span class="knowledge-tag" style="font-size:11px;padding:2px 8px;">${k}</span>`).join(' ')}</td>
        <td>${e.errorReason || '-'}</td>
        <td><span class="difficulty ${e.difficulty}">${getDifficultyLabel(e.difficulty)}</span></td>
        <td><span class="mastered-badge ${e.mastered}">${getMasteredLabel(e.mastered)}</span></td>
        <td>${e.date || '-'}</td>
        <td>
          <div class="actions">
            <button class="btn btn-sm btn-outline" onclick="viewDetail('${e.id}')" title="查看">👁</button>
            <button class="btn btn-sm btn-outline" onclick="editError('${e.id}')" title="编辑">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="deleteError('${e.id}')" title="删除">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function getDifficultyLabel(d) {
  const map = { 'easy': '⭐ 简单', 'medium': '⭐⭐ 中等', 'hard': '⭐⭐⭐ 困难' };
  return map[d] || '中等';
}

function getMasteredLabel(m) {
  const map = { 'not-mastered': '未掌握', 'reviewing': '复习中', 'mastered': '已掌握' };
  return map[m] || '未掌握';
}

// --- Add/Edit Modal ---
function openAddModal() {
  document.getElementById('modalTitle').textContent = '添加错题';
  document.getElementById('errorId').value = '';
  document.getElementById('errorForm').reset();
  document.getElementById('errorSubject').value = document.getElementById('filterSubject')?.value || '';
  document.getElementById('errorMastered').value = 'not-mastered';
  document.getElementById('errorDifficulty').value = 'medium';
  populateSubjectSelect('errorSubject');
  populatePaperSelect('errorPaper');
  updateKnowledgeTags();
  document.getElementById('errorModal').classList.add('show');
}

function editError(id) {
  const error = appData.errors.find(e => e.id === id);
  if (!error) return;

  document.getElementById('modalTitle').textContent = '编辑错题';
  document.getElementById('errorId').value = error.id;
  populateSubjectSelect('errorSubject');
  populatePaperSelect('errorPaper');

  document.getElementById('errorSubject').value = error.subject || '';
  document.getElementById('errorDifficulty').value = error.difficulty || 'medium';
  document.getElementById('errorMastered').value = error.mastered || 'not-mastered';
  document.getElementById('errorQuestion').value = error.question || '';
  document.getElementById('errorMyAnswer').value = error.myAnswer || '';
  document.getElementById('errorCorrectAnswer').value = error.correctAnswer || '';
  document.getElementById('errorReason').value = error.errorReason || '';
  document.getElementById('errorPaper').value = error.paperId || '';

  updateKnowledgeTags(error.knowledge || []);
  document.getElementById('errorModal').classList.add('show');
}

function closeModal() {
  document.getElementById('errorModal').classList.remove('show');
}

function populateSubjectSelect(selectId) {
  const select = document.getElementById(selectId);
  if (select && select.options.length <= 1) {
    select.innerHTML = '<option value="">请选择科目</option>' + SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join('');
  }
}

function populatePaperSelect(selectId) {
  const select = document.getElementById(selectId);
  if (select) {
    select.innerHTML = '<option value="">无关联试卷</option>' + appData.papers.map(p => `<option value="${p.id}">${p.name} (${p.subject})</option>`).join('');
  }
}

// --- Knowledge Tags ---
let selectedKnowledge = [];

function updateKnowledgeTags(preselected = []) {
  selectedKnowledge = [...preselected];
  const subject = document.getElementById('errorSubject').value;
  const tagsDiv = document.getElementById('knowledgeTags');

  let availableTags = [];
  if (subject && KNOWLEDGE_MAP[subject]) {
    availableTags = KNOWLEDGE_MAP[subject];
  }

  // Add custom knowledge for this subject
  const customForSubject = appData.customKnowledge[subject] || [];
  availableTags = [...new Set([...availableTags, ...customForSubject])];

  tagsDiv.innerHTML = availableTags.map(k => {
    const isSelected = selectedKnowledge.includes(k);
    return `<span class="knowledge-tag ${isSelected ? 'selected' : ''}" onclick="toggleKnowledge('${escapeHtml(k)}')">${k}</span>`;
  }).join('');

  if (availableTags.length === 0) {
    tagsDiv.innerHTML = '<span style="color:#999;font-size:13px;">请先选择科目</span>';
  }
}

function toggleKnowledge(knowledge) {
  const idx = selectedKnowledge.indexOf(knowledge);
  if (idx >= 0) {
    selectedKnowledge.splice(idx, 1);
  } else {
    selectedKnowledge.push(knowledge);
  }
  updateKnowledgeTags(selectedKnowledge);
}

document.getElementById('errorSubject')?.addEventListener('change', () => {
  selectedKnowledge = [];
  updateKnowledgeTags();
});

// Custom knowledge input
document.getElementById('knowledgeInput')?.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const val = this.value.trim();
    const subject = document.getElementById('errorSubject').value;
    if (val && subject) {
      if (!appData.customKnowledge[subject]) appData.customKnowledge[subject] = [];
      if (!appData.customKnowledge[subject].includes(val)) {
        appData.customKnowledge[subject].push(val);
      }
      if (!selectedKnowledge.includes(val)) {
        selectedKnowledge.push(val);
      }
      updateKnowledgeTags(selectedKnowledge);
      this.value = '';
    }
  }
});

// --- Form Submit ---
function initFormEvents() {
  document.getElementById('errorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveError();
  });
}

function saveError() {
  const id = document.getElementById('errorId').value;
  const error = {
    id: id || generateId(),
    subject: document.getElementById('errorSubject').value,
    difficulty: document.getElementById('errorDifficulty').value,
    mastered: document.getElementById('errorMastered').value,
    question: document.getElementById('errorQuestion').value.trim(),
    myAnswer: document.getElementById('errorMyAnswer').value.trim(),
    correctAnswer: document.getElementById('errorCorrectAnswer').value.trim(),
    errorReason: document.getElementById('errorReason').value,
    knowledge: [...selectedKnowledge],
    paperId: document.getElementById('errorPaper').value || null,
    date: id ? (appData.errors.find(e => e.id === id)?.date || getToday()) : getToday(),
  };

  if (!error.subject || !error.question || !error.correctAnswer) {
    alert('请填写科目、题目内容和正确答案');
    return;
  }

  if (id) {
    const idx = appData.errors.findIndex(e => e.id === id);
    if (idx >= 0) appData.errors[idx] = error;
  } else {
    appData.errors.push(error);
  }

  saveData(appData);
  closeModal();
  renderErrorsTable();
  renderSidebarSubjects();
  document.getElementById('errorCount').textContent = appData.errors.length;
}

function deleteError(id) {
  if (!confirm('确定要删除这道错题吗？此操作不可撤销。')) return;
  appData.errors = appData.errors.filter(e => e.id !== id);
  saveData(appData);
  renderErrorsTable();
  renderSidebarSubjects();
  document.getElementById('errorCount').textContent = appData.errors.length;
}

// --- View Detail ---
function viewDetail(id) {
  const error = appData.errors.find(e => e.id === id);
  if (!error) return;

  const paper = error.paperId ? appData.papers.find(p => p.id === error.paperId) : null;

  document.getElementById('detailContent').innerHTML = `
    <div style="margin-bottom:16px;">
      <span class="subject-tag ${error.subject}">${error.subject}</span>
      <span class="difficulty ${error.difficulty}" style="margin-left:8px;">${getDifficultyLabel(error.difficulty)}</span>
      <span class="mastered-badge ${error.mastered}" style="margin-left:8px;">${getMasteredLabel(error.mastered)}</span>
    </div>
    <div class="form-group">
      <label>📝 题目</label>
      <div style="background:#fafafa;padding:14px;border-radius:8px;white-space:pre-wrap;">${escapeHtml(error.question)}</div>
    </div>
    <div class="form-group">
      <label>❌ 我的答案</label>
      <div style="background:#fef2f2;padding:14px;border-radius:8px;white-space:pre-wrap;">${escapeHtml(error.myAnswer || '（未填写）')}</div>
    </div>
    <div class="form-group">
      <label>✅ 正确答案</label>
      <div style="background:#ecfdf5;padding:14px;border-radius:8px;white-space:pre-wrap;">${escapeHtml(error.correctAnswer)}</div>
    </div>
    <div class="form-group">
      <label>🏷️ 知识点</label>
      <div>${(error.knowledge || []).map(k => `<span class="knowledge-tag">${k}</span>`).join(' ') || '无'}</div>
    </div>
    <div class="form-group">
      <label>🔍 错误原因</label>
      <div>${error.errorReason || '未标注'}</div>
    </div>
    ${paper ? `<div class="form-group"><label>📄 来源试卷</label><div>${paper.name}</div></div>` : ''}
    <div class="form-group">
      <label>📅 日期</label>
      <div>${error.date}</div>
    </div>
    <div class="form-actions">
      <button class="btn btn-outline" onclick="closeDetailModal();editError('${error.id}')">✏️ 编辑</button>
      <button class="btn btn-primary" onclick="closeDetailModal()">关闭</button>
    </div>
  `;

  document.getElementById('detailModal').classList.add('show');
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.remove('show');
}

// --- Papers ---
function renderPapersPage() {
  const filterSubject = document.getElementById('filterPaperSubject');
  filterSubject.innerHTML = '<option value="">全部科目</option>' + SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('searchPapers').addEventListener('input', renderPapersTable);
  document.getElementById('filterPaperSubject').addEventListener('change', renderPapersTable);

  renderPapersTable();
}

function renderPapersTable() {
  const search = (document.getElementById('searchPapers')?.value || '').toLowerCase();
  const subject = document.getElementById('filterPaperSubject')?.value || '';

  let filtered = appData.papers;
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  if (subject) filtered = filtered.filter(p => p.subject === subject);
  filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

  const tbody = document.getElementById('papersTableBody');
  const empty = document.getElementById('papersEmpty');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = filtered.map(p => {
      const errorCount = appData.errors.filter(e => e.paperId === p.id).length;
      return `
        <tr>
          <td>📄 ${escapeHtml(p.name)}</td>
          <td><span class="subject-tag ${p.subject}">${p.subject}</span></td>
          <td>${p.uploadDate || '-'}</td>
          <td>${errorCount}</td>
          <td>
            <div class="actions">
              <button class="btn btn-sm btn-outline" onclick="viewPaperErrors('${p.id}')">查看错题</button>
              <button class="btn btn-sm btn-danger" onclick="deletePaper('${p.id}')">删除</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }
}

function viewPaperErrors(paperId) {
  navigateTo('errors');
  // Filter is handled by the errors page - we can set a custom filter
  const filtered = appData.errors.filter(e => e.paperId === paperId);
  document.getElementById('filterSubject').value = '';
  document.getElementById('filterMastered').value = '';
  document.getElementById('searchErrors').value = '';
  // Temporary override
  const origFilter = appData.errors;
  appData.errors = filtered;
  renderErrorsTable();
  appData.errors = origFilter;
}

function deletePaper(id) {
  if (!confirm('确定要删除这张试卷吗？关联的错题不会删除。')) return;
  appData.papers = appData.papers.filter(p => p.id !== id);
  saveData(appData);
  renderPapersTable();
}

// --- Upload ---
function uploadPaper() {
  populateSubjectSelect('uploadSubject');
  document.getElementById('uploadForm').reset();
  document.getElementById('filePreview').style.display = 'none';
  document.getElementById('uploadModal').classList.add('show');
}

function closeUploadModal() {
  document.getElementById('uploadModal').classList.remove('show');
}

function initUploadEvents() {
  document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const subject = document.getElementById('uploadSubject').value;
    const name = document.getElementById('uploadName').value.trim();
    const fileInput = document.getElementById('fileInput');

    if (!subject || !name) {
      alert('请填写科目和试卷名称');
      return;
    }

    // Simulate upload - in a real app this would upload to server
    const paper = {
      id: generateId(),
      name: name,
      subject: subject,
      fileName: fileInput.files[0]?.name || '未上传文件',
      uploadDate: getToday(),
    };

    appData.papers.push(paper);
    saveData(appData);
    closeUploadModal();
    renderPapersTable();
    alert(`试卷「${name}」上传成功！现在可以从这张试卷中添加错题了。`);
  });

  // Drag and drop
  const dropArea = document.getElementById('fileDropArea');
  dropArea.addEventListener('dragover', e => { e.preventDefault(); dropArea.style.borderColor = '#4f46e5'; });
  dropArea.addEventListener('dragleave', () => { dropArea.style.borderColor = '#e0e0e0'; });
  dropArea.addEventListener('drop', e => {
    e.preventDefault();
    dropArea.style.borderColor = '#e0e0e0';
    const file = e.dataTransfer.files[0];
    if (file) {
      document.getElementById('fileInput').files = e.dataTransfer.files;
      showFilePreview(file);
    }
  });
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) showFilePreview(file);
}

function showFilePreview(file) {
  const preview = document.getElementById('filePreview');
  preview.style.display = 'block';
  preview.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;padding:12px;background:#f0fdf4;border-radius:8px;">
      <span style="font-size:24px;">📄</span>
      <div>
        <div style="font-weight:600;">${escapeHtml(file.name)}</div>
        <div style="font-size:12px;color:#666;">${formatFileSize(file.size)}</div>
      </div>
    </div>
  `;
}

// --- Knowledge Page ---
function renderKnowledgePage() {
  document.getElementById('filterKnowledgeSubject').addEventListener('change', updateKnowledgePage);

  const filterSelect = document.getElementById('filterKnowledgeSubject');
  filterSelect.innerHTML = '<option value="">全部科目</option>' + SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join('');
  updateKnowledgePage();
}

function updateKnowledgePage() {
  const subject = document.getElementById('filterKnowledgeSubject').value;
  const content = document.getElementById('knowledgeContent');

  // Collect knowledge stats from errors
  const knowledgeStats = {};
  appData.errors.forEach(e => {
    (e.knowledge || []).forEach(k => {
      if (!knowledgeStats[k]) knowledgeStats[k] = { total: 0, notMastered: 0, reviewing: 0, mastered: 0, subjects: new Set() };
      knowledgeStats[k].total++;
      knowledgeStats[k].subjects.add(e.subject);
      if (e.mastered === 'not-mastered') knowledgeStats[k].notMastered++;
      else if (e.mastered === 'reviewing') knowledgeStats[k].reviewing++;
      else if (e.mastered === 'mastered') knowledgeStats[k].mastered++;
    });
  });

  let entries = Object.entries(knowledgeStats);
  if (subject) {
    entries = entries.filter(([k, s]) => s.subjects.has(subject));
  }
  entries.sort((a, b) => b[1].total - a[1].total);

  if (entries.length === 0) {
    content.innerHTML = '<div class="empty-state"><div class="empty-icon">🧠</div><h3>暂无知识点数据</h3><p>添加错题并标注知识点后将在此展示</p></div>';
    return;
  }

  content.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr><th>知识点</th><th>科目</th><th>错题总数</th><th>未掌握</th><th>复习中</th><th>已掌握</th><th>掌握率</th></tr>
        </thead>
        <tbody>
          ${entries.map(([k, s]) => {
            const rate = s.total > 0 ? Math.round((s.mastered / s.total) * 100) : 0;
            return `
              <tr>
                <td style="font-weight:600;">${k}</td>
                <td>${[...s.subjects].map(sb => `<span class="subject-tag ${sb}">${sb}</span>`).join(' ')}</td>
                <td>${s.total}</td>
                <td><span style="color:var(--danger);font-weight:600;">${s.notMastered}</span></td>
                <td><span style="color:var(--warning);font-weight:600;">${s.reviewing}</span></td>
                <td><span style="color:var(--success);font-weight:600;">${s.mastered}</span></td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div style="flex:1;height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;">
                      <div style="width:${rate}%;height:100%;background:${rate >= 80 ? '#059669' : rate >= 50 ? '#d97706' : '#dc2626'};border-radius:4px;"></div>
                    </div>
                    <span style="font-size:12px;font-weight:600;">${rate}%</span>
                  </div>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// --- Plan Page ---
function renderPlanPage() {
  generatePlan();
}

function generatePlan() {
  const content = document.getElementById('planContent');

  // Find weak areas
  const knowledgeStats = {};
  appData.errors.forEach(e => {
    (e.knowledge || []).forEach(k => {
      if (!knowledgeStats[k]) knowledgeStats[k] = { total: 0, notMastered: 0, subjects: new Set() };
      knowledgeStats[k].total++;
      knowledgeStats[k].subjects.add(e.subject);
      if (e.mastered === 'not-mastered') knowledgeStats[k].notMastered++;
    });
  });

  const weakAreas = Object.entries(knowledgeStats)
    .filter(([k, s]) => s.notMastered > 0)
    .sort((a, b) => b[1].notMastered - a[1].notMastered)
    .slice(0, 15);

  // Subject weak analysis
  const subjectAnalysis = {};
  SUBJECTS.forEach(s => {
    const errors = appData.errors.filter(e => e.subject === s);
    const notMastered = errors.filter(e => e.mastered === 'not-mastered').length;
    if (errors.length > 0) {
      subjectAnalysis[s] = { total: errors.length, notMastered };
    }
  });

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);

  let planHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
      <div class="table-container" style="padding:20px;">
        <h3 style="margin-bottom:12px;">🎯 薄弱知识点（需重点攻克）</h3>
        ${weakAreas.length === 0 ? '<p style="color:#999;">暂无薄弱知识点数据</p>' :
          weakAreas.map(([k, s], i) => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f5f5f5;">
              <span style="font-weight:700;color:var(--danger);">${i+1}.</span>
              <span style="flex:1;">${k}</span>
              <span style="font-size:12px;color:var(--text-secondary);">${[...s.subjects].join('、')}</span>
              <span style="color:var(--danger);font-weight:600;">${s.notMastered}题未掌握</span>
            </div>`).join('')
        }
      </div>
      <div class="table-container" style="padding:20px;">
        <h3 style="margin-bottom:12px;">📊 各科掌握情况</h3>
        ${Object.entries(subjectAnalysis).sort((a,b) => {
          const rateA = a[1].total > 0 ? (1 - a[1].notMastered / a[1].total) : 1;
          const rateB = b[1].total > 0 ? (1 - b[1].notMastered / b[1].total) : 1;
          return rateA - rateB;
        }).map(([s, d]) => {
          const rate = d.total > 0 ? Math.round((1 - d.notMastered / d.total) * 100) : 100;
          return `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <span style="width:60px;font-weight:600;">${getSubjectIcon(s)} ${s}</span>
              <div style="flex:1;height:20px;background:#f0f0f0;border-radius:10px;overflow:hidden;">
                <div style="width:${rate}%;height:100%;background:${rate>=80?'#059669':rate>=50?'#d97706':'#dc2626'};border-radius:10px;transition:width 0.5s;"></div>
              </div>
              <span style="font-size:12px;font-weight:600;width:60px;text-align:right;">${rate}% 掌握</span>
            </div>`;
        }).join('')}
        ${Object.keys(subjectAnalysis).length === 0 ? '<p style="color:#999;">暂无数据</p>' : ''}
      </div>
    </div>
    <div class="table-container" style="padding:20px;">
      <h3 style="margin-bottom:12px;">📅 本周推荐学习计划</h3>
      ${generateWeeklyPlan(weakAreas, subjectAnalysis)}
    </div>
    <div style="text-align:center;margin-top:20px;">
      <button class="btn btn-outline" onclick="printPlan()">🖨️ 打印学习计划</button>
    </div>
  `;

  content.innerHTML = planHTML;
}

function generateWeeklyPlan(weakAreas, subjectAnalysis) {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const weakSubjects = Object.entries(subjectAnalysis)
    .sort((a, b) => {
      const rateA = a[1].total > 0 ? (1 - a[1].notMastered / a[1].total) : 1;
      const rateB = b[1].total > 0 ? (1 - b[1].notMastered / b[1].total) : 1;
      return rateA - rateB;
    })
    .slice(0, 7)
    .map(([s]) => s);

  // Pad weakSubjects if fewer than 7
  while (weakSubjects.length < 7) {
    const remaining = SUBJECTS.filter(s => !weakSubjects.includes(s));
    if (remaining.length === 0) break;
    weakSubjects.push(remaining[0]);
  }

  let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">';
  days.forEach((day, i) => {
    const subject = weakSubjects[i] || '综合';
    const knowledgeForSubject = weakAreas.filter(([k, s]) => s.subjects.has(subject)).slice(0, 3);
    html += `
      <div style="border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-weight:700;margin-bottom:6px;">${day}</div>
        <div><span class="subject-tag ${subject}">${subject}</span></div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:6px;">
          ${knowledgeForSubject.length > 0 ?
            knowledgeForSubject.map(([k]) => `• ${k}`).join('<br>') :
            '• 综合复习'}
        </div>
        <div style="margin-top:6px;font-size:11px;color:var(--text-secondary);">
          📝 复习错题 ${Math.floor(Math.random() * 5) + 3} 道
        </div>
      </div>`;
  });
  html += '</div>';

  html += `
    <div style="margin-top:16px;padding:14px;background:#fffbeb;border-radius:8px;border:1px solid #fcd34d;">
      <strong>💡 学习建议：</strong>
      <ul style="margin:8px 0 0 16px;font-size:13px;">
        <li>每天专注1-2个薄弱知识点，反复练习直到掌握</li>
        <li>每道错题至少重做3遍，确保真正理解而非死记硬背</li>
        <li>周末进行本周错题回顾，标记已掌握的题目</li>
        <li>每两周做一次综合测试，检验学习效果</li>
        <li>注意劳逸结合，保证充足睡眠和适量运动</li>
      </ul>
    </div>
  `;

  return html;
}

// --- Exam Summaries (考试总结 / 心得体会) ---
function renderSummariesPage() {
  document.getElementById('summaryCount').textContent = (appData.summaries || []).length;

  const filterSelect = document.getElementById('filterSummarySubject');
  filterSelect.innerHTML = '<option value="">全部科目</option>' + SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('searchSummaries').addEventListener('input', renderSummariesGrid);
  document.getElementById('filterSummarySubject').addEventListener('change', renderSummariesGrid);

  renderSummariesGrid();
}

function renderSummariesGrid() {
  const search = (document.getElementById('searchSummaries')?.value || '').toLowerCase();
  const subject = document.getElementById('filterSummarySubject')?.value || '';

  let filtered = appData.summaries || [];
  if (search) {
    filtered = filtered.filter(s =>
      (s.examName || '').toLowerCase().includes(search) ||
      (s.reflection || '').toLowerCase().includes(search) ||
      (s.strengths || '').toLowerCase().includes(search) ||
      (s.weaknesses || '').toLowerCase().includes(search) ||
      (s.nextPlan || '').toLowerCase().includes(search)
    );
  }
  if (subject) filtered = filtered.filter(s => s.subject === subject);

  filtered.sort((a, b) => (b.examDate || '').localeCompare(a.examDate || ''));

  const grid = document.getElementById('summaryGrid');
  const empty = document.getElementById('summariesEmpty');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = filtered.map(s => {
    const scoreHTML = s.score !== '' && s.score !== undefined && s.score !== null
      ? `<span class="summary-meta-item">${s.score}${s.fullScore ? ` / ${s.fullScore}` : ''} 分</span>`
      : '';
    const rankHTML = s.rank ? `<span class="summary-meta-item">🏅 ${escapeHtml(s.rank)}</span>` : '';
    return `
      <div class="summary-card">
        <div class="summary-card-header">
          <h3>📓 ${escapeHtml(s.examName || '未命名考试')}</h3>
          <div class="actions">
            <button class="btn btn-sm btn-outline" onclick="editSummary('${s.id}')" title="编辑">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="deleteSummary('${s.id}')" title="删除">🗑</button>
          </div>
        </div>
        <div class="summary-meta">
          ${s.subject ? `<span class="subject-tag ${s.subject}">${s.subject}</span>` : '<span class="subject-tag">综合</span>'}
          <span class="summary-meta-item">📅 ${s.examDate || '-'}</span>
          ${scoreHTML}
          ${rankHTML}
        </div>
        <div class="summary-section">
          <div class="summary-section-title">💭 心得体会</div>
          <div class="summary-section-body blue">${escapeHtml(s.reflection || '（未填写）')}</div>
        </div>
        ${s.strengths ? `
        <div class="summary-section">
          <div class="summary-section-title">👍 做得好的地方</div>
          <div class="summary-section-body green">${escapeHtml(s.strengths)}</div>
        </div>` : ''}
        ${s.weaknesses ? `
        <div class="summary-section">
          <div class="summary-section-title">👎 不足之处</div>
          <div class="summary-section-body red">${escapeHtml(s.weaknesses)}</div>
        </div>` : ''}
        ${s.nextPlan ? `
        <div class="summary-section">
          <div class="summary-section-title">🎯 下阶段改进计划</div>
          <div class="summary-section-body orange">${escapeHtml(s.nextPlan)}</div>
        </div>` : ''}
      </div>`;
  }).join('');
}

function openSummaryModal() {
  document.getElementById('summaryModalTitle').textContent = '添加考试总结';
  document.getElementById('summaryForm').reset();
  document.getElementById('summaryId').value = '';
  document.getElementById('summaryDate').value = getToday();
  populateSummarySubjectSelect();
  document.getElementById('summaryModal').classList.add('show');
}

function editSummary(id) {
  const summary = (appData.summaries || []).find(s => s.id === id);
  if (!summary) return;

  document.getElementById('summaryModalTitle').textContent = '编辑考试总结';
  document.getElementById('summaryId').value = summary.id;
  document.getElementById('summaryExamName').value = summary.examName || '';
  document.getElementById('summarySubject').value = summary.subject || '';
  document.getElementById('summaryDate').value = summary.examDate || getToday();
  document.getElementById('summaryScore').value = summary.score ?? '';
  document.getElementById('summaryFullScore').value = summary.fullScore ?? '';
  document.getElementById('summaryRank').value = summary.rank || '';
  document.getElementById('summaryReflection').value = summary.reflection || '';
  document.getElementById('summaryStrengths').value = summary.strengths || '';
  document.getElementById('summaryWeaknesses').value = summary.weaknesses || '';
  document.getElementById('summaryNextPlan').value = summary.nextPlan || '';
  populateSummarySubjectSelect();
  document.getElementById('summaryModal').classList.add('show');
}

function populateSummarySubjectSelect() {
  const select = document.getElementById('summarySubject');
  const current = select.value;
  select.innerHTML = '<option value="">全部（综合考试）</option>' + SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join('');
  select.value = current;
}

function closeSummaryModal() {
  document.getElementById('summaryModal').classList.remove('show');
}

function initSummaryFormEvents() {
  document.getElementById('summaryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveSummary();
  });
}

function saveSummary() {
  const id = document.getElementById('summaryId').value;
  const examName = document.getElementById('summaryExamName').value.trim();
  const reflection = document.getElementById('summaryReflection').value.trim();

  if (!examName || !reflection) {
    alert('请填写考试名称和心得体会');
    return;
  }

  const summary = {
    id: id || generateId(),
    examName: examName,
    subject: document.getElementById('summarySubject').value,
    examDate: document.getElementById('summaryDate').value || getToday(),
    score: document.getElementById('summaryScore').value === '' ? null : Number(document.getElementById('summaryScore').value),
    fullScore: document.getElementById('summaryFullScore').value === '' ? null : Number(document.getElementById('summaryFullScore').value),
    rank: document.getElementById('summaryRank').value.trim(),
    reflection: reflection,
    strengths: document.getElementById('summaryStrengths').value.trim(),
    weaknesses: document.getElementById('summaryWeaknesses').value.trim(),
    nextPlan: document.getElementById('summaryNextPlan').value.trim(),
    createdAt: id ? ((appData.summaries || []).find(s => s.id === id)?.createdAt || getToday()) : getToday(),
  };

  if (!appData.summaries) appData.summaries = [];
  if (id) {
    const idx = appData.summaries.findIndex(s => s.id === id);
    if (idx >= 0) appData.summaries[idx] = summary;
  } else {
    appData.summaries.push(summary);
  }

  saveData(appData);
  closeSummaryModal();
  renderSummariesGrid();
  document.getElementById('summaryCount').textContent = appData.summaries.length;
  renderDashboard();
}

function deleteSummary(id) {
  if (!confirm('确定要删除这条考试总结吗？此操作不可撤销。')) return;
  appData.summaries = (appData.summaries || []).filter(s => s.id !== id);
  saveData(appData);
  renderSummariesGrid();
  document.getElementById('summaryCount').textContent = appData.summaries.length;
  renderDashboard();
}

// --- Print ---
function printErrors() {
  window.print();
}

function printPlan() {
  window.print();
}

// --- Utilities ---
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return size.toFixed(1) + ' ' + units[i];
}

// --- Sample Data for Demo ---
function addSampleData() {
  if (appData.errors.length > 0) return; // Don't add if data exists

  const sampleErrors = [
    { subject: '数学', question: '已知函数 f(x) = x² + 2x + 3，求 f(x) 在区间 [-2, 1] 上的最大值和最小值。', myAnswer: '最大值 6，最小值 2', correctAnswer: 'f(x) = (x+1)² + 2，对称轴 x=-1。在[-2,1]上，最小值 f(-1)=2，最大值 f(1)=6。', knowledge: ['函数概念与性质', '二次函数'], difficulty: 'easy', mastered: 'not-mastered', errorReason: '概念不清' },
    { subject: '数学', question: '在△ABC中，已知 a=3, b=4, ∠C=60°，求 c 边的长度。', myAnswer: 'c = 5', correctAnswer: '由余弦定理：c² = a² + b² - 2ab·cosC = 9+16-2×3×4×0.5 = 25-12 = 13，故 c = √13 ≈ 3.606', knowledge: ['三角函数', '解三角形'], difficulty: 'medium', mastered: 'not-mastered', errorReason: '计算错误' },
    { subject: '物理', question: '一物体从静止开始沿光滑斜面下滑，斜面倾角为30°，求2秒末物体的速度。', myAnswer: 'v = 20 m/s', correctAnswer: 'a = g·sin30° = 9.8×0.5 = 4.9 m/s²，v = at = 4.9×2 = 9.8 m/s', knowledge: ['运动学', '力的相互作用'], difficulty: 'medium', mastered: 'reviewing', errorReason: '审题不清' },
    { subject: '英语', question: 'If I ___ you, I would accept the offer.\
A. am  B. was  C. were  D. be', myAnswer: 'B', correctAnswer: 'C. were。虚拟语气中，与现在事实相反时，be动词统一用were。', knowledge: ['语法·虚拟语气'], difficulty: 'easy', mastered: 'not-mastered', errorReason: '知识点遗忘' },
    { subject: '化学', question: '写出钠与水反应的化学方程式，并描述实验现象。', myAnswer: 'Na + H₂O = NaOH + H₂↑', correctAnswer: '2Na + 2H₂O = 2NaOH + H₂↑。现象：钠浮在水面，熔成闪亮小球，四处游动，发出嘶嘶声，溶液变红（加酚酞）。', knowledge: ['金属及其化合物', '氧化还原反应'], difficulty: 'easy', mastered: 'mastered', errorReason: '粗心大意' },
    { subject: '语文', question: '下列句子中，没有语病的一项是：\
A. 通过这次学习，使我提高了认识\
B. 他的写作水平有了明显的提高\
C. 我们一定要发扬和继承优良传统\
D. 这个问题的答案是肯定的', myAnswer: 'D', correctAnswer: 'B。A缺主语，C语序不当（应先继承后发扬），D表意不明。', knowledge: ['病句辨析'], difficulty: 'medium', mastered: 'not-mastered', errorReason: '审题不清' },
    { subject: '生物', question: '简述光合作用中光反应和暗反应的主要区别。', myAnswer: '光反应在光下进行，暗反应在暗处进行', correctAnswer: '光反应在类囊体薄膜上进行，需光，产物是ATP、[H]和O₂；暗反应在叶绿体基质中进行，不需光，利用ATP和[H]将CO₂还原为糖类。', knowledge: ['细胞的代谢'], difficulty: 'medium', mastered: 'reviewing', errorReason: '概念不清' },
    { subject: '历史', question: '简述辛亥革命的历史意义。', myAnswer: '推翻了清朝统治', correctAnswer: '①推翻清王朝，结束两千多年封建君主专制制度；②建立资产阶级共和国，使民主共和观念深入人心；③为民族资本主义发展创造条件；④打击帝国主义在华势力。', knowledge: ['近代中国民主革命'], difficulty: 'hard', mastered: 'not-mastered', errorReason: '知识点遗忘' },
  ];

  const today = getToday();
  sampleErrors.forEach((e, i) => {
    appData.errors.push({
      ...e,
      id: generateId(),
      date: today,
      myAnswer: e.myAnswer || '',
      paperId: null,
    });
  });

  // Add a sample paper
  appData.papers.push({
    id: generateId(),
    name: '2024年高一上学期期中考试',
    subject: '数学',
    fileName: '2024高一期中数学.pdf',
    uploadDate: today,
  });

  // Add a sample exam summary
  appData.summaries.push({
    id: generateId(),
    examName: '高一下学期期中考试',
    subject: '数学',
    examDate: today,
    score: 112,
    fullScore: 150,
    rank: '班级第 8 名',
    reflection: '这次数学考试整体发挥一般。函数部分的基础题失分较多，说明概念掌握还不够扎实；但立体几何的大题完成得不错，说明近期专项练习有效果。考试时时间分配不太合理，最后一道大题没来得及仔细检查。',
    strengths: '立体几何大题的辅助线作法掌握熟练；填空基础题的正确率比上次提高了。',
    weaknesses: '函数单调性与奇偶性的综合题容易漏条件；考试最后30分钟容易慌张，导致会做的题也出错。',
    nextPlan: '1. 本周重点复习函数性质章节，每天做3道综合题；2. 周末做一次限时模拟，练习时间分配；3. 建立易错条件清单，考前过一遍。',
    createdAt: today,
  });

  saveData(appData);
}

// --- 高一物理分班考复盘（心得体会） ---
const PLACEMENT_SEED_KEY = 'error_book_placement_seeded';

function seedPlacementSummary() {
  // 只植入一次；如果用户手动删除该条，不再自动加回
  if (localStorage.getItem(PLACEMENT_SEED_KEY)) return;
  if (!appData.summaries) appData.summaries = [];
  const exists = appData.summaries.some(s => s.examName === '高一物理分班考');
  if (!exists) {
    const today = getToday();
    appData.summaries.push({
      id: generateId(),
      examName: '高一物理分班考',
      subject: '物理',
      examDate: today,
      score: null,
      fullScore: null,
      rank: '',
      reflection: '这次分班物理考试，遇到一道看上去自己有能力做出来的题目，就投入大量时间死磕，耗了不少时间，但这道题并没有顺利解出来。回过头发现还有两道难度相对容易、自己有把握的题目还没有作答。最后容易的题没拿到分，难题也没有啃下来，整体考试结果不理想。\n\n吸取这次考试教训，后续考试记住做题原则：先易后难。拿到试卷做题，优先把自己看得懂、有把握的简单题目全部完成，把该拿的分数稳稳拿到手。遇到看上去好像能做，但做一小段时间没有思路、卡壳的题目，要主动果断跳过去，不要恋战，不要抱着"我应该能做出来"就一味耗时间。先标记搁置，把全卷会做的题目全部做完之后，再回头集中精力攻克这类有难度的题目。\n\n考试比拼的不只是会不会做题，也考验时间分配策略。优先确保简单题不丢分，再争取难题的分数，整体考试效率和总分才会更高。',
      strengths: '有把握的简单题本可以稳定拿分——那两道没来得及作答的题其实都是会做的。',
      weaknesses: '时间分配不合理：遇到看似能做但实际卡住的难题就死磕，耗了大量时间还没解出来，导致后面两道有把握的简单题没时间作答，简单分没拿到、难题也没啃下来。',
      nextPlan: '做题原则：先易后难。①拿到试卷，先把看得懂、有把握的简单题全部完成，稳稳拿到该拿的分数；②遇到看似能做、但做一小段时间没思路卡壳的题，主动果断跳过并标记搁置，不恋战、不抱着"我应该能做出来"的心态一味耗时间；③把全卷会做的题全部做完后，再回头集中精力攻克难题。\n\n📝 考试提醒（便签版）：做题先易后难。遇到看似能做但卡住的题，不要死磕消耗时间，先标记跳过。优先做完所有有把握的简单题，拿到基础分数，全部做完之后，再回头攻坚难题。',
      createdAt: today,
    });
    saveData(appData);
  }
  localStorage.setItem(PLACEMENT_SEED_KEY, '1');
}

// Initialize with sample data
addSampleData();
seedPlacementSummary();
