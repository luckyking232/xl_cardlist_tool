document.addEventListener('DOMContentLoaded', () => {
  // ===========================
  // 远程配置（热更新核心）
  const REMOTE_DATA_URL = 'https://xl-cardlist-tool.2609113802.workers.dev/assets/characters.json';
  const REMOTE_IMG_BASE = 'https://xl-cardlist-tool.2609113802.workers.dev/assets/card/';
  const REMOTE_BG_LIST_URL = 'https://xl-cardlist-tool.2609113802.workers.dev/assets/bg_list.json';
  const LOCAL_IMG_BASE = './assets/card/';
  const LOCAL_BG_LIST_URL = './assets/bg_list.json';
  const REMOTE_BG_BASE = 'https://xl-cardlist-tool.2609113802.workers.dev/assets/bg/';
  const LOCAL_BG_BASE = './assets/bg/';
  let IMG_BASE = LOCAL_IMG_BASE;          // 默认本地，远程成功后自动切换
  let BG_BASE = LOCAL_BG_BASE;

  // 本地兜底数据（ZIP 中包含完整的 assets/characters.json 即可，此处为保险最小集）
  const FALLBACK_DATA = [
    { id: 10000101, name: '菲尼斯', star: 1, profession: '异刃', element: '火属性', img: 'HeadSquare_10000101.png' },
    { id: 10000102, name: '露露', star: 2, profession: '坚甲', element: '火属性', img: 'HeadSquare_10000102.png' }
  ];

  // 内置最少背景兜底（极端情况）
  const FALLBACK_BG_LIST = [
    { name: '默认深色', type: 'color', value: '#1a1a2e' },
    { name: '内置背景1', type: 'image', file: 'eventcovers_00.png' }
  ];

  let characterMap = {};   // id -> 完整角色信息
  let cardItems = [];      // 最终用于显示的卡片列表

  // ---------- 加载角色数据 ----------
  async function loadCharacterData() {
    let data = null;

    // 1️⃣ 优先从远程加载
    try {
      const resp = await fetch(REMOTE_DATA_URL + '?t=' + Date.now());
      if (resp.ok) {
        data = await resp.json();
        IMG_BASE = REMOTE_IMG_BASE;
        console.log('✅ 远程数据加载成功，使用远程图片');
      }
    } catch (e) {
      console.warn('⚠️ 远程数据加载失败，尝试本地 JSON', e);
    }

    // 2️⃣ 远程失败，尝试加载 ZIP 内的本地 JSON
    if (!data) {
      try {
        const resp = await fetch('./assets/characters.json');
        if (resp.ok) {
          data = await resp.json();
          IMG_BASE = LOCAL_IMG_BASE;
          console.log('📁 使用本地兜底数据');
        }
      } catch (e2) {
        console.warn('⚠️ 本地 JSON 加载失败，使用内置最小数据集', e2);
        data = FALLBACK_DATA;
        IMG_BASE = LOCAL_IMG_BASE;
      }
    }

    // 构建 characterMap 和 cardItems
    characterMap = {};
    data.forEach(ch => {
      characterMap[ch.id] = ch;
    });

    cardItems = data.map(ch => ({
      id: ch.id,
      file: IMG_BASE + ch.img,   // 完整图片路径
      name: ch.name,
      star: ch.star,
      profession: ch.profession,
      element: ch.element || ''
    }));

    console.log(`共加载 ${cardItems.length} 个角色`);
  }

  // ---------- 加载背景列表 ----------
  let bgListCache = null;

  async function loadBgList() {
    // 1️⃣ 远程优先
    try {
      const resp = await fetch(REMOTE_BG_LIST_URL + '?t=' + Date.now());
      if (resp.ok) {
        const list = await resp.json();
        BG_BASE = REMOTE_BG_BASE;
        console.log('✅ 远程背景列表加载成功，共', list.length, '个');
        return list;
      }
    } catch (e) { console.warn('远程背景列表加载失败', e); }

    // 2️⃣ 本地兜底
    try {
      const resp = await fetch(LOCAL_BG_LIST_URL + '?t=' + Date.now());
      if (resp.ok) {
        const list = await resp.json();
        BG_BASE = LOCAL_BG_BASE;
        console.log('📁 使用本地背景列表');
        return list;
      }
    } catch (e) { console.warn('本地背景列表加载失败', e); }

    BG_BASE = LOCAL_BG_BASE;
    return FALLBACK_BG_LIST;  // 极端情况兜底
  }

  // ===========================
  // 以下原有功能保持不变

  let tiers = [
    { name: '夯', bg: '#e33b2c', text: '#000' },
    { name: '顶级', bg: '#f1ca4d', text: '#000' },
    { name: '人上人', bg: '#f9ff28', text: '#000' },
    { name: 'NPC', bg: '#f9f3d0', text: '#000' },
    { name: '拉完了', bg: '#fafaf8', text: '#000' }
  ];

  const tierContainer = document.getElementById('tierContainer');
  const pickerModal = document.getElementById('pickerModal');
  const editTierModal = document.getElementById('editTierModal');
  const bgModal = document.getElementById('bgModal');
  const imageGrid = document.getElementById('imageGrid');
  const bgGrid = document.getElementById('bgGrid');
  const exportBtn = document.getElementById('exportBtn');

  let currentTierIndex = -1;
  let selectedImages = new Set();

  // 筛选条件（多选集合）
  let currentFilter = {
    stars: new Set(),
    professions: new Set(),
    elements: new Set()
  };

  // ---------- 渲染等级行 ----------
  function renderTiers() {
    tierContainer.innerHTML = '';
    tiers.forEach((tier, index) => {
      const row = document.createElement('div');
      row.className = 'tier-row';

      const label = document.createElement('div');
      label.className = 'tier-label';
      label.style.backgroundColor = tier.bg;
      label.style.color = tier.text;
      label.textContent = tier.name;
      label.addEventListener('click', () => openEditTierModal(index));

      const items = document.createElement('div');
      items.className = 'tier-items';
      items.setAttribute('data-tier-index', index);
      items.addEventListener('click', (e) => {
        if (e.target === items) openPicker(index);
      });

      row.appendChild(label);
      row.appendChild(items);
      tierContainer.appendChild(row);

      new Sortable(items, {
        group: 'shared',
        animation: 150,
        draggable: '.tier-card',
        ghostClass: 'sortable-ghost',
      });
    });
  }

  // ---------- 创建卡片 ----------
  function createImageCard(name, imgSrc) {
    const card = document.createElement('div');
    card.className = 'tier-card';
    card.setAttribute('data-name', name);

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = name;
    img.crossOrigin = 'anonymous';
    card.appendChild(img);

    const delBtn = document.createElement('span');
    delBtn.className = 'del-btn';
    delBtn.textContent = '×';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      card.remove();
    });
    card.appendChild(delBtn);
    return card;
  }

  // ---------- 图片选择弹窗 ----------
  function openPicker(tierIndex) {
    currentTierIndex = tierIndex;
    selectedImages.clear();
    renderImageGrid();
    pickerModal.hidden = false;
  }

  // 多选过滤函数
  function getFilteredItems() {
    return cardItems
      .filter(item => {
        if (currentFilter.stars.size > 0 && !currentFilter.stars.has(item.star)) return false;
        if (currentFilter.professions.size > 0 && !currentFilter.professions.has(item.profession)) return false;
        if (currentFilter.elements.size > 0 && !currentFilter.elements.has(item.element)) return false;
        return true;
      })
      .sort((a, b) => b.id - a.id); // 按 ID 降序排列
  }

  function renderImageGrid() {
    imageGrid.innerHTML = '';
    getFilteredItems().forEach(item => {
      const div = document.createElement('div');
      div.className = 'grid-item' + (selectedImages.has(item.file) ? ' selected' : '');
      const img = document.createElement('img');
      img.src = item.file;
      img.alt = item.name;
      div.appendChild(img);

      const nameSpan = document.createElement('span');
      nameSpan.className = 'item-name';
      nameSpan.textContent = item.name;
      div.appendChild(nameSpan);

      div.addEventListener('click', () => {
        if (selectedImages.has(item.file)) {
          selectedImages.delete(item.file);
          div.classList.remove('selected');
        } else {
          selectedImages.add(item.file);
          div.classList.add('selected');
        }
      });
      imageGrid.appendChild(div);
    });
  }

  function confirmPick() {
    if (currentTierIndex < 0) return;
    const itemsContainer = document.querySelector(`.tier-items[data-tier-index="${currentTierIndex}"]`);
    selectedImages.forEach(file => {
      const name = cardItems.find(item => item.file === file)?.name || 'unknown';
      const card = createImageCard(name, file);
      itemsContainer.appendChild(card);
    });
    pickerModal.hidden = true;
    currentTierIndex = -1;
    selectedImages.clear();
  }

  // ---------- 多选筛选按钮 ----------
  function initFilterButtons() {
    const starsGroup = document.getElementById('filterStars');
    const profsGroup = document.getElementById('filterProfs');
    const elemsGroup = document.getElementById('filterElems');

    // 星级按钮
    for (let i = 1; i <= 5; i++) {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = '⭐'+i;
      btn.addEventListener('click', () => {
        const set = currentFilter.stars;
        if (set.has(i)) {
          set.delete(i);
        } else {
          set.add(i);
        }
        updateFilterButtonStates();
        renderImageGrid();
      });
      starsGroup.appendChild(btn);
    }

    // 职业按钮
    ['坚甲','异刃','言灵','猎影'].forEach(prof => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = prof;
      btn.addEventListener('click', () => {
        const set = currentFilter.professions;
        if (set.has(prof)) {
          set.delete(prof);
        } else {
          set.add(prof);
        }
        updateFilterButtonStates();
        renderImageGrid();
      });
      profsGroup.appendChild(btn);
    });

    // 属性按钮
    ['水属性','火属性','木属性','暗属性','光属性'].forEach(elem => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = elem;
      btn.addEventListener('click', () => {
        const set = currentFilter.elements;
        if (set.has(elem)) {
          set.delete(elem);
        } else {
          set.add(elem);
        }
        updateFilterButtonStates();
        renderImageGrid();
      });
      elemsGroup.appendChild(btn);
    });

    document.getElementById('clearFilterBtn').addEventListener('click', () => {
      currentFilter.stars.clear();
      currentFilter.professions.clear();
      currentFilter.elements.clear();
      updateFilterButtonStates();
      renderImageGrid();
    });
  }

  // 更新按钮激活样式
  function updateFilterButtonStates() {
    document.querySelectorAll('#filterStars .filter-btn').forEach(btn => {
      const star = parseInt(btn.textContent.slice(1));
      btn.classList.toggle('active', currentFilter.stars.has(star));
    });
    document.querySelectorAll('#filterProfs .filter-btn').forEach(btn => {
      btn.classList.toggle('active', currentFilter.professions.has(btn.textContent));
    });
    document.querySelectorAll('#filterElems .filter-btn').forEach(btn => {
      btn.classList.toggle('active', currentFilter.elements.has(btn.textContent));
    });
  }

  // ---------- 编辑等级行弹窗 ----------
  function openEditTierModal(index) {
    currentTierIndex = index;
    const tier = tiers[index];
    document.getElementById('editName').value = tier.name;
    document.getElementById('editBgColor').value = tier.bg;
    document.getElementById('editTextColor').value = tier.text;
    editTierModal.hidden = false;
  }

  function saveTier() {
    if (currentTierIndex < 0) return;
    tiers[currentTierIndex].name = document.getElementById('editName').value;
    tiers[currentTierIndex].bg = document.getElementById('editBgColor').value;
    tiers[currentTierIndex].text = document.getElementById('editTextColor').value;
    renderTiers();
    editTierModal.hidden = true;
    currentTierIndex = -1;
  }

  // ---------- 背景选择（动态加载列表，支持远程更新）----------
  async function openBgPicker() {
    // 首次调用时加载背景列表
    if (!bgListCache) {
      bgListCache = await loadBgList();
    }
    bgGrid.innerHTML = '';
    bgListCache.forEach((bg) => {
      const div = document.createElement('div');
      div.className = 'grid-item';
      if (bg.type === 'color') {
        const swatch = document.createElement('div');
        swatch.style.width = '80px';
        swatch.style.height = '140px';
        swatch.style.backgroundColor = bg.value;
        swatch.style.borderRadius = '8px';
        div.appendChild(swatch);
      } else {
        const img = document.createElement('img');
        img.src = BG_BASE + bg.file;   // 动态拼接背景图片路径
        img.alt = bg.name;
        div.appendChild(img);
      }
      const nameSpan = document.createElement('span');
      nameSpan.className = 'item-name';
      nameSpan.textContent = bg.name;
      div.appendChild(nameSpan);

      div.addEventListener('click', () => {
        applyBackground(bg);
        bgModal.hidden = true;
      });
      bgGrid.appendChild(div);
    });
    bgModal.hidden = false;
  }

  function applyBackground(bg) {
    const body = document.body;
    if (bg.type === 'color') {
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = bg.value;
      body.classList.remove('has-bg');
    } else {
      const url = BG_BASE + bg.file;
      const img = new Image();
      img.onload = () => {
        body.style.backgroundImage = `url(${url})`;
        body.style.backgroundColor = '';
        body.classList.add('has-bg');
      };
      img.onerror = () => {
        // 远程失败，回退本地
        body.style.backgroundImage = `url(${LOCAL_BG_BASE}${bg.file})`;
        body.style.backgroundColor = '';
        body.classList.add('has-bg');
      };
      img.src = url;
    }
  }

  function resetBackground() {
    applyBackground({ type: 'color', value: '#1a1a2e' });
    bgModal.hidden = true;
  }

  // ---------- 导出图片 ----------
function exportImage() {
  if (typeof html2canvas === 'undefined') {
    alert('导出库未加载，请检查 html2canvas.js 引入');
    return;
  }

  const btn = exportBtn;
  const originalText = btn.textContent;
  btn.textContent = '⏳ 导出中…';
  btn.disabled = true;

  const appEl = document.getElementById('app');
  const bodyStyles = window.getComputedStyle(document.body);

  // 临时将 body 的背景应用到 #app 上
  const origBgImage = appEl.style.backgroundImage;
  const origBg = appEl.style.background;
  appEl.style.background = bodyStyles.background;
  appEl.style.backgroundImage = bodyStyles.backgroundImage;
  appEl.style.backgroundSize = bodyStyles.backgroundSize;
  appEl.style.backgroundPosition = bodyStyles.backgroundPosition;
  appEl.style.backgroundAttachment = 'scroll';

  if (document.body.classList.contains('has-bg')) {
    const overlay = document.createElement('div');
    overlay.id = '__export_overlay__';
    overlay.style.position = 'fixed';
    overlay.style.top = '0'; overlay.style.left = '0';
    overlay.style.width = '100%'; overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '0';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);
  }

  // 配置 html2canvas，处理 backdrop-filter 兼容问题
  html2canvas(appEl, {
    backgroundColor: null,
    allowTaint: true,
    useCORS: false,
    scale: 2,
    logging: false,
    onclone: function (clonedDoc) {
      // 在克隆的文档中移除所有 backdrop-filter，并替换为固定背景色
      const elementsWithBackdrop = clonedDoc.querySelectorAll('*');
      elementsWithBackdrop.forEach(el => {
        const style = getComputedStyle(el);
        if (style.backdropFilter && style.backdropFilter !== 'none') {
          el.style.backdropFilter = 'none';
          el.style.webkitBackdropFilter = 'none';
          // 设置一个接近的深色半透明背景，模拟模糊效果
          el.style.backgroundColor = 'rgba(20, 20, 35, 0.85)';
        }
      });
    }
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'tierlist.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(err => {
    console.error(err);
    alert('导出失败：请通过本地服务器打开（例如 Live Server），或上传至 TapTap 后使用。');
  }).finally(() => {
    // 恢复原始样式
    appEl.style.background = origBg;
    appEl.style.backgroundImage = origBgImage;
    const overlay = document.getElementById('__export_overlay__');
    if (overlay) overlay.remove();
    btn.textContent = originalText;
    btn.disabled = false;
  });
}

  // ---------- 事件绑定 ----------
  document.getElementById('addTierBtn').addEventListener('click', () => {
    tiers.push({ name: '新等级', bg: '#999', text: '#fff' });
    renderTiers();
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    tiers = [
      { name: '夯', bg: '#e33b2c', text: '#000' },
      { name: '顶级', bg: '#f1ca4d', text: '#000' },
      { name: '人上人', bg: '#f9ff28', text: '#000' },
      { name: 'NPC', bg: '#f9f3d0', text: '#000' },
      { name: '拉完了', bg: '#fafaf8', text: '#000' }
    ];
    renderTiers();
  });
  document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
  document.getElementById('bgBtn').addEventListener('click', openBgPicker);
  exportBtn.addEventListener('click', exportImage);

  document.getElementById('confirmPickBtn').addEventListener('click', confirmPick);
  document.getElementById('cancelPickBtn').addEventListener('click', () => {
    pickerModal.hidden = true; currentTierIndex = -1; selectedImages.clear();
  });
  document.querySelector('#pickerModal .modal-backdrop').addEventListener('click', () => {
    pickerModal.hidden = true; currentTierIndex = -1; selectedImages.clear();
  });

  document.getElementById('saveTierBtn').addEventListener('click', saveTier);
  document.getElementById('cancelTierBtn').addEventListener('click', () => {
    editTierModal.hidden = true; currentTierIndex = -1;
  });
  document.querySelector('#editTierModal .modal-backdrop').addEventListener('click', () => {
    editTierModal.hidden = true; currentTierIndex = -1;
  });

  document.getElementById('resetBgBtn').addEventListener('click', resetBackground);
  document.getElementById('cancelBgBtn').addEventListener('click', () => bgModal.hidden = true);
  document.querySelector('#bgModal .modal-backdrop').addEventListener('click', () => bgModal.hidden = true);

  // ---------- 页面初始化 ----------
  async function init() {
    await loadCharacterData();      // 加载角色数据
    // 背景列表在首次点击背景按钮时才加载，以减少启动时间
    initFilterButtons();
    renderTiers();
  }
  init();
});