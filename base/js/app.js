// app.js

document.addEventListener('DOMContentLoaded', () => {
  // ===========================
  // 本地数据加载（独立于代码）
  const JSON_CHARACTERS = './assets/characters.json';
  const JSON_BG_LIST = './assets/bg_list.json';

  let characterMap = {};   // id -> 角色信息
  let cardItems = [];      // 用于显示的卡片列表
  let bgListData = [];     // 背景列表数据

  // ---------- 加载角色数据 ----------
  async function loadCharacterData() {
    try {
      const resp = await fetch(JSON_CHARACTERS);
      if (!resp.ok) throw new Error('无法加载角色数据');
      const data = await resp.json();
      data.forEach(ch => {
        characterMap[ch.id] = ch;
      });
      cardItems = data.map(ch => ({
        id: ch.id,
        file: './assets/card/' + ch.img,
        name: ch.name,
        star: ch.star,
        profession: ch.profession,
        element: ch.element || ''
      }));
      console.log(`✅ 加载了 ${cardItems.length} 个角色`);
    } catch (e) {
      console.error('角色数据加载失败', e);
      cardItems = [];
    }
  }

  // ---------- 加载背景列表 ----------
  async function loadBgList() {
    try {
      const resp = await fetch(JSON_BG_LIST);
      if (!resp.ok) throw new Error('无法加载背景列表');
      bgListData = await resp.json();
      console.log(`✅ 加载了 ${bgListData.length} 个背景`);
    } catch (e) {
      console.error('背景列表加载失败', e);
      // 兜底最小列表
      bgListData = [
        { name: '默认深色', type: 'color', value: '#1a1a2e' }
      ];
    }
  }

  // ===========================
  // 等级行定义
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

  // 背景视图尺寸：small / medium / large
  let bgViewSize = 'medium';

  // ---------- 创建单个等级行 DOM（不重新渲染全局）----------
  function createTierRow(tier, index) {
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

    // 初始化拖拽
    new Sortable(items, {
      group: 'shared',
      animation: 150,
      draggable: '.tier-card',
      ghostClass: 'sortable-ghost',
    });

    return row;
  }

  // ---------- 整个重绘（仅用于“重置”按钮）----------
  function fullRenderTiers() {
    tierContainer.innerHTML = '';
    tiers.forEach((tier, index) => {
      tierContainer.appendChild(createTierRow(tier, index));
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

  function getFilteredItems() {
    return cardItems
      .filter(item => {
        if (currentFilter.stars.size > 0 && !currentFilter.stars.has(item.star)) return false;
        if (currentFilter.professions.size > 0 && !currentFilter.professions.has(item.profession)) return false;
        if (currentFilter.elements.size > 0 && !currentFilter.elements.has(item.element)) return false;
        return true;
      })
      .sort((a, b) => b.id - a.id);
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

  // ---------- 筛选按钮 ----------
  function initFilterButtons() {
    const starsGroup = document.getElementById('filterStars');
    const profsGroup = document.getElementById('filterProfs');
    const elemsGroup = document.getElementById('filterElems');

    for (let i = 1; i <= 5; i++) {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = '⭐' + i;
      btn.addEventListener('click', () => {
        const set = currentFilter.stars;
        set.has(i) ? set.delete(i) : set.add(i);
        updateFilterButtonStates();
        renderImageGrid();
      });
      starsGroup.appendChild(btn);
    }

    ['坚甲','异刃','言灵','猎影'].forEach(prof => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = prof;
      btn.addEventListener('click', () => {
        const set = currentFilter.professions;
        set.has(prof) ? set.delete(prof) : set.add(prof);
        updateFilterButtonStates();
        renderImageGrid();
      });
      profsGroup.appendChild(btn);
    });

    ['水属性','火属性','木属性','暗属性','光属性'].forEach(elem => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = elem;
      btn.addEventListener('click', () => {
        const set = currentFilter.elements;
        set.has(elem) ? set.delete(elem) : set.add(elem);
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
    // 更新该行的标签
    const label = document.querySelector(`.tier-row:nth-child(${currentTierIndex + 1}) .tier-label`);
    if (label) {
      label.textContent = tiers[currentTierIndex].name;
      label.style.backgroundColor = tiers[currentTierIndex].bg;
      label.style.color = tiers[currentTierIndex].text;
    }
    editTierModal.hidden = true;
    currentTierIndex = -1;
  }

  // ---------- 背景选择（支持视图大小调节）----------
  async function openBgPicker() {
    if (bgListData.length === 0) {
      await loadBgList();
    }
    renderBgGrid();
    bgModal.hidden = false;
  }

  function renderBgGrid() {
    bgGrid.innerHTML = '';
    bgGrid.className = 'image-grid view-' + bgViewSize; // 应用视图尺寸类
    bgListData.forEach((bg) => {
      const div = document.createElement('div');
      div.className = 'grid-item';
      if (bg.type === 'color') {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = bg.value;
        div.appendChild(swatch);
      } else {
        const img = document.createElement('img');
        img.src = './assets/bg/' + bg.file;
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
  }

  function applyBackground(bg) {
    const body = document.body;
    if (bg.type === 'color') {
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = bg.value;
      body.classList.remove('has-bg');
    } else {
      body.style.backgroundImage = `url(./assets/bg/${bg.file})`;
      body.style.backgroundColor = '';
      body.classList.add('has-bg');
    }
  }

  function resetBackground() {
    applyBackground({ type: 'color', value: '#1a1a2e' });
    bgModal.hidden = true;
  }

  // 切换背景视图大小
  function setBgViewSize(size) {
    bgViewSize = size;
    // 更新按钮激活状态
    document.querySelectorAll('.view-toggle button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === size);
    });
    renderBgGrid();
  }

  // ---------- 导出截图（隐藏 UI 元素）----------
  function exportImage() {
    if (typeof html2canvas === 'undefined') {
      alert('导出库未加载，请检查 html2canvas.js 引入');
      return;
    }

    const btn = exportBtn;
    const originalText = btn.textContent;
    btn.textContent = '⏳ 导出中…';
    btn.disabled = true;

    // 隐藏工具栏和提示
    const toolbar = document.querySelector('.toolbar');
    const tips = document.querySelector('.tips');
    const origToolbarDisplay = toolbar.style.display;
    const origTipsDisplay = tips.style.display;
    toolbar.style.display = 'none';
    tips.style.display = 'none';

    const appEl = document.getElementById('app');
    const bodyStyles = window.getComputedStyle(document.body);

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

    html2canvas(appEl, {
      backgroundColor: null,
      allowTaint: true,
      useCORS: false,
      scale: 2,
      logging: false,
      onclone: function (clonedDoc) {
        const elementsWithBackdrop = clonedDoc.querySelectorAll('*');
        elementsWithBackdrop.forEach(el => {
          const style = getComputedStyle(el);
          if (style.backdropFilter && style.backdropFilter !== 'none') {
            el.style.backdropFilter = 'none';
            el.style.webkitBackdropFilter = 'none';
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
      // 恢复 UI 元素
      toolbar.style.display = origToolbarDisplay;
      tips.style.display = origTipsDisplay;
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
    const newTier = { name: '新等级', bg: '#999', text: '#fff' };
    const newIndex = tiers.length;
    tiers.push(newTier);
    // 追加新行，不清空已有内容
    tierContainer.appendChild(createTierRow(newTier, newIndex));
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    tiers = [
      { name: '夯', bg: '#e33b2c', text: '#000' },
      { name: '顶级', bg: '#f1ca4d', text: '#000' },
      { name: '人上人', bg: '#f9ff28', text: '#000' },
      { name: 'NPC', bg: '#f9f3d0', text: '#000' },
      { name: '拉完了', bg: '#fafaf8', text: '#000' }
    ];
    fullRenderTiers();
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

  // 背景视图切换按钮事件
  document.querySelectorAll('.view-toggle button').forEach(btn => {
    btn.addEventListener('click', () => setBgViewSize(btn.dataset.size));
  });

  // ---------- 启动 ----------
  async function init() {
    await loadCharacterData();
    await loadBgList();
    initFilterButtons();
    fullRenderTiers(); // 初始渲染
  }
  init();
});