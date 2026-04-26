document.addEventListener('DOMContentLoaded', () => {
  // ===========================
  // 本地数据加载（独立于代码）
  const JSON_CHARACTERS = './assets/characters.json';
  const JSON_BG_LIST = './assets/bg_list.json';
  const STORAGE_KEY = 'tierlist_save';   // localStorage 键名

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

  // 当前背景信息（用于保存）
  let currentBackground = { name: '默认深色', type: 'color', value: '#1a1a2e' };

  const tierContainer = document.getElementById('tierContainer');
  const pickerModal = document.getElementById('pickerModal');
  const editTierModal = document.getElementById('editTierModal');
  const bgModal = document.getElementById('bgModal');
  const imageGrid = document.getElementById('imageGrid');
  const bgGrid = document.getElementById('bgGrid');
  const exportBtn = document.getElementById('exportBtn');
  const saveBtn = document.getElementById('saveBtn');
  const exportSaveBtn = document.getElementById('exportSaveBtn');
  const importSaveBtn = document.getElementById('importSaveBtn');
  const importFileInput = document.getElementById('importFile');

  let currentTierIndex = -1;
  let selectedImages = new Set();

  // 筛选条件
  let currentFilter = {
    stars: new Set(),
    professions: new Set(),
    elements: new Set()
  };

  let bgViewSize = 'medium';

  // ===========================
  // 序列化 / 反序列化当前排榜状态
  // ===========================
  function serializeState() {
    const tiersState = tiers.map((tier, index) => {
      const container = document.querySelector(`.tier-items[data-tier-index="${index}"]`);
      const cards = [];
      if (container) {
        container.querySelectorAll('.tier-card').forEach(card => {
          const name = card.getAttribute('data-name');
          // 通过 name 找到对应的角色 id（name 是唯一的吗？保险起见用 id 查找）
          const item = cardItems.find(c => c.name === name);
          if (item) {
            cards.push(item.id);
          } else {
            // 降级：直接存名字（可能性极低，仅容错）
            cards.push({ name: name, file: card.querySelector('img')?.src || '' });
          }
        });
      }
      return {
        name: tier.name,
        bg: tier.bg,
        text: tier.text,
        cards: cards
      };
    });
    return {
      tiers: tiersState,
      background: currentBackground
    };
  }

  function deserializeState(state) {
    if (!state || !state.tiers) return false;
    try {
      // 恢复背景
      if (state.background) {
        const bg = bgListData.find(b => b.name === state.background.name);
        if (bg) {
          applyBackground(bg, false); // 不保存到历史
          currentBackground = state.background;
        } else {
          // 如果背景列表中没有，尝试直接使用保存的值
          const savedBg = state.background;
          if (savedBg.type === 'color') {
            applyBackground(savedBg, false);
            currentBackground = savedBg;
          } else {
            // 图片背景可能文件已丢失，回退默认
            applyBackground({ name: '默认深色', type: 'color', value: '#1a1a2e' }, false);
            currentBackground = { name: '默认深色', type: 'color', value: '#1a1a2e' };
          }
        }
      }

      // 恢复等级行和卡片
      tiers = state.tiers.map(t => ({
        name: t.name,
        bg: t.bg,
        text: t.text
      }));
      fullRenderTiers();

      // 等待 DOM 更新后添加卡片
      requestAnimationFrame(() => {
        state.tiers.forEach((tierData, index) => {
          const container = document.querySelector(`.tier-items[data-tier-index="${index}"]`);
          if (!container) return;
          tierData.cards.forEach(cardId => {
            // cardId 可能是数字(角色id) 或字符串(只存了名字，容错)
            let item;
            if (typeof cardId === 'number') {
              item = cardItems.find(c => c.id === cardId);
            } else if (typeof cardId === 'string' && cardId.includes('HeadSquare')) {
              // 直接是文件名？容错处理
              item = cardItems.find(c => c.file.includes(cardId));
            } else {
              item = cardItems.find(c => c.name === cardId);
            }
            if (item) {
              const card = createImageCard(item.name, item.file);
              container.appendChild(card);
            }
          });
        });
      });
      return true;
    } catch (e) {
      console.error('恢复进度失败', e);
      return false;
    }
  }

  // ===========================
  // 自动保存到 localStorage
  // ===========================
  function autoSave() {
    const state = serializeState();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log('✅ 进度已自动保存');
    } catch (e) {
      console.warn('⚠️ 保存失败（可能存储空间不足）', e);
    }
  }

  // 手动保存按钮（也是覆盖自动保存的同一个 key）
  function manualSave() {
    const state = serializeState();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      alert('进度已保存！下次打开将自动恢复。');
    } catch (e) {
      alert('保存失败，请尝试导出进度文件备份。');
    }
  }

  function loadFromLocal() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const state = JSON.parse(raw);
      if (deserializeState(state)) {
        console.log('✅ 已从本地存储恢复进度');
        return true;
      }
    } catch (e) {}
    return false;
  }

  // ===========================
  // 导入 / 导出进度文件
  // ===========================
  function exportProgressFile() {
    const state = serializeState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tierlist_backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const state = JSON.parse(e.target.result);
        if (deserializeState(state)) {
          alert('导入成功！进度已恢复。');
          autoSave(); // 同时保存到 localStorage
        } else {
          alert('文件格式不正确或角色数据不匹配。');
        }
      } catch (err) {
        alert('文件解析失败，请选择有效的 JSON 文件。');
      }
    };
    reader.readAsText(file);
    importFileInput.value = ''; // 清空以便再次选择同一文件
  }

  // ===========================
  // 以下为原有核心逻辑（修改了部分以支持自动保存）
  // ===========================

  function getRowIndex(row) {
    const rows = [...tierContainer.querySelectorAll('.tier-row')];
    return rows.indexOf(row);
  }

  function createTierRow(tier, index) {
    const row = document.createElement('div');
    row.className = 'tier-row';

    const label = document.createElement('div');
    label.className = 'tier-label';
    label.style.backgroundColor = tier.bg;
    label.style.color = tier.text;
    label.textContent = tier.name;

    const delBtn = document.createElement('span');
    delBtn.className = 'del-tier-btn';
    delBtn.textContent = '×';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteRow(row);
    });
    label.appendChild(delBtn);

    const items = document.createElement('div');
    items.className = 'tier-items';
    items.setAttribute('data-tier-index', index);

    row.appendChild(label);
    row.appendChild(items);

    // 拖拽排序，并在结束后自动保存
    new Sortable(items, {
      group: 'shared',
      animation: 150,
      draggable: '.tier-card',
      ghostClass: 'sortable-ghost',
      onEnd: function () {
        autoSave();
      }
    });

    return row;
  }

  function deleteRow(row) {
    const index = getRowIndex(row);
    if (index < 0) return;
    row.remove();
    tiers.splice(index, 1);
    tierContainer.querySelectorAll('.tier-row').forEach((r, i) => {
      const items = r.querySelector('.tier-items');
      if (items) {
        items.setAttribute('data-tier-index', i);
      }
    });
    autoSave();
  }

  function fullRenderTiers() {
    tierContainer.innerHTML = '';
    tiers.forEach((tier, index) => {
      tierContainer.appendChild(createTierRow(tier, index));
    });
  }

  // 事件委托
  tierContainer.addEventListener('click', (e) => {
    const label = e.target.closest('.tier-label');
    if (label) {
      if (e.target.classList.contains('del-tier-btn')) return;
      const row = label.closest('.tier-row');
      const index = getRowIndex(row);
      if (index >= 0) openEditTierModal(index);
      return;
    }

    const items = e.target.closest('.tier-items');
    if (items && e.target === items) {
      const index = parseInt(items.getAttribute('data-tier-index'), 10);
      if (!isNaN(index)) openPicker(index);
    }
  });

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
      autoSave();
    });
    card.appendChild(delBtn);
    return card;
  }

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
    autoSave();
  }

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

  function openEditTierModal(index) {
    if (index < 0 || index >= tiers.length) return;
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
    const label = document.querySelector(`.tier-row:nth-child(${currentTierIndex + 1}) .tier-label`);
    if (label) {
      const delBtn = label.querySelector('.del-tier-btn');
      label.childNodes.forEach(child => {
        if (child.nodeType === 3) label.removeChild(child);
      });
      label.prepend(document.createTextNode(tiers[currentTierIndex].name));
      label.style.backgroundColor = tiers[currentTierIndex].bg;
      label.style.color = tiers[currentTierIndex].text;
      if (delBtn) label.appendChild(delBtn);
    }
    editTierModal.hidden = true;
    currentTierIndex = -1;
    autoSave();
  }

  async function openBgPicker() {
    if (bgListData.length === 0) {
      await loadBgList();
    }
    renderBgGrid();
    bgModal.hidden = false;
  }

  function renderBgGrid() {
    bgGrid.innerHTML = '';
    bgGrid.className = 'image-grid view-' + bgViewSize;
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
        applyBackground(bg, true);
        bgModal.hidden = true;
      });
      bgGrid.appendChild(div);
    });
  }

  function applyBackground(bg, save = true) {
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
    currentBackground = { name: bg.name, type: bg.type, value: bg.value, file: bg.file };
    if (save) autoSave();
  }

  function resetBackground() {
    applyBackground({ name: '默认深色', type: 'color', value: '#1a1a2e' }, true);
    bgModal.hidden = true;
  }

  function setBgViewSize(size) {
    bgViewSize = size;
    document.querySelectorAll('.view-toggle button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === size);
    });
    renderBgGrid();
  }

  function exportImage() {
    if (typeof html2canvas === 'undefined') {
      alert('导出库未加载，请检查 html2canvas.js 引入');
      return;
    }

    const btn = exportBtn;
    const originalText = btn.textContent;
    btn.textContent = '⏳ 导出中…';
    btn.disabled = true;

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

  // ========== 事件绑定 ==========
  document.getElementById('addTierBtn').addEventListener('click', () => {
    const newTier = { name: '新等级', bg: '#999', text: '#fff' };
    const newIndex = tiers.length;
    tiers.push(newTier);
    tierContainer.appendChild(createTierRow(newTier, newIndex));
    autoSave();
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
    // 重置背景为默认
    applyBackground({ name: '默认深色', type: 'color', value: '#1a1a2e' }, true);
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

  // 保存 / 导入 / 导出按钮
  saveBtn.addEventListener('click', manualSave);
  exportSaveBtn.addEventListener('click', exportProgressFile);
  importSaveBtn.addEventListener('click', () => importFileInput.click());
  importFileInput.addEventListener('change', handleImportFile);

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

  document.querySelectorAll('.view-toggle button').forEach(btn => {
    btn.addEventListener('click', () => setBgViewSize(btn.dataset.size));
  });

  // ========== 启动 ==========
  async function init() {
    await loadCharacterData();
    await loadBgList();
    initFilterButtons();

    // 尝试从 localStorage 恢复进度
    const restored = loadFromLocal();
    if (!restored) {
      // 没有存档就用默认
      fullRenderTiers();
      applyBackground({ name: '默认深色', type: 'color', value: '#1a1a2e' }, false);
    }
    // 恢复后或默认后，做一次自动保存（覆盖旧的）
    autoSave();
  }
  init();
});