document.addEventListener('DOMContentLoaded', () => {
  // ===========================
  // 角色卡片文件名列表（请根据实际文件完整补充）
const CARD_FILES = [
  'HeadSquare_10001_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10002_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10003_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10004_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10005_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10006_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10007_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10008_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10009_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10010_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10011_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10013_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10014_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10015_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10016_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10017_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10018_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10019_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10020_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10021_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10022_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10024_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10025_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10026_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10027_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10028_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10029_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10030_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10031_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10032_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10033_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10034_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10035_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10036_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10037_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10038_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10039_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10040_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10041_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10042_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10043_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10044_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10045_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10046_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10047_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10048_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10049_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10050_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10051_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10052_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10053_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10054_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10055_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10056_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10059_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10060_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10061_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10062_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10064_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10067_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10069_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10070_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10071_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10073_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10074_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10075_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10076_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10077_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10078_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10080_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10082_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10083_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10086_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10089_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10091_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10093_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10094_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10095_1_CardHeadSquare_fui_atlas0_2.png.png',
  'HeadSquare_10096_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10097_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10098_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10099_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10100_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10101_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10102_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10103_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10104_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10105_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10106_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10107_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10108_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10109_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10110_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10111_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10112_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10113_1_CardHeadSquare_fui_atlas0.png.png',
  'HeadSquare_10114_1_CardHeadSquare_fui_atlas0_1.png.png',
  'HeadSquare_10115_1_CardHeadSquare_fui_atlas0.png.png',
];

  // 背景图片列表
const BUILTIN_BACKGROUNDS = [
  { name: '默认深色', type: 'color', value: '#1a1a2e' },
  { name: 'bg1', type: 'image', file: './assets/bg/eventcovers_00.png' },
  { name: 'bg2', type: 'image', file: './assets/bg/eventcovers_0028_bg2.png' },
  { name: 'bg3', type: 'image', file: './assets/bg/eventcovers_0031.png' },
  { name: 'bg4', type: 'image', file: './assets/bg/frame_250725173524_3a228f_100.png' },
  { name: 'bg5', type: 'image', file: './assets/bg/frame_250815140809_0d3524_100.png' },
  { name: 'bg6', type: 'image', file: './assets/bg/frame_251017103301_1c86e6_100.png' },
  { name: 'bg7', type: 'image', file: './assets/bg/frame_251130230234_bf92ff_80.png' },
  { name: 'bg8', type: 'image', file: './assets/bg/home2.mp4_000005.400.png' },
  { name: 'bg9', type: 'image', file: './assets/bg/home2.mp4_000037.298.png' },
  { name: 'bg10', type: 'image', file: './assets/bg/home2.mp4_000041.210.png' },
  { name: 'bg11', type: 'image', file: './assets/bg/home2.mp4_000042.544.png' },
  { name: 'bg12', type: 'image', file: './assets/bg/home2.mp4_000046.040.png' },
  { name: 'bg13', type: 'image', file: './assets/bg/home2.mp4_000051.381.png' },
  { name: 'bg14', type: 'image', file: './assets/bg/home2.mp4_000055.389.png' },
  { name: 'bg15', type: 'image', file: './assets/bg/home2.mp4_000100.933.png' },
  { name: 'bg16', type: 'image', file: './assets/bg/home2.mp4_000105.265.png' }
];

  // 从文件名提取 CSV 对应 ID
  function getCsvIdFromFilename(filename) {
    const match = filename.match(/_(\d+)_/);
    if (match) {
      const idStr = match[1];
      const lastThree = idStr.slice(-3);
      return 10000100 + parseInt(lastThree, 10);
    }
    return null;
  }

  // 全局角色信息
  let characterMap = {};

  // 构建卡片数据
  function buildCardItems() {
    return CARD_FILES.map(file => {
      const csvId = getCsvIdFromFilename(file);
      const info = characterMap[csvId] || {};
      return {
        file: './assets/card/' + file,
        id: csvId,
        name: info.name || '未知',
        star: info.star || 0,
        profession: info.profession || '',
        element: info.element || ''
      };
    });
  }

  // 加载 CSV
  function loadCSV() {
    return fetch('./assets/characters.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.trim().split('\n');
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line) continue;
          const cols = line.split(',');
          const id = parseInt(cols[0], 10);
          if (!id) continue;
          characterMap[id] = {
            name: cols[1] || '未知',
            star: parseInt(cols[2], 10) || 0,
            profession: cols[3] || '',
            element: cols[4] || ''
          };
        }
      })
      .catch(() => console.warn('CSV 加载失败'));
  }

  // ===========================

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
  let cardItems = [];

  // 筛选条件（多选集合）
  let currentFilter = {
    stars: new Set(),
    professions: new Set(),
    elements: new Set()
  };

  // 加载 CSV 后初始化卡片数据
  loadCSV().then(() => {
    cardItems = buildCardItems();
  });

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
    if (cardItems.length === 0) {
      cardItems = buildCardItems();
    }
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

  // ---------- 背景选择 ----------
  function openBgPicker() {
    bgGrid.innerHTML = '';
    BUILTIN_BACKGROUNDS.forEach((bg) => {
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
        img.src = bg.file;
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
      body.style.backgroundImage = `url(${bg.file})`;
      body.style.backgroundColor = '';
      body.classList.add('has-bg');
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

  // 初始化筛选按钮
  initFilterButtons();

  // 启动
  renderTiers();
});