# 夯拉排位 - 星落角色自助排行工具

一款面向手游《星落》的浏览器端角色强度排行（Tier List）制作工具。玩家可将角色头像拖放至自定义等级行，制作并导出自己的角色强度排行榜。

## 运行方式

1. 运行 `start.bat`（通过 `npx serve` 启动本地 HTTP 服务器）
2. 浏览器访问 `http://localhost:3000`

> 直接打开 `index.html` 会因 CORS 限制导致图片加载和导出功能异常，推荐使用本地服务器方式运行。

## 功能特性

- **拖拽排行**：将角色卡片从选择面板拖入各等级行，自由排列
- **自定义等级**：可添加/删除等级行，自定义行名称、背景色和文字颜色
- **角色筛选**：按星级（1-5）、职业（坚甲/异刃/言灵/猎影）、元素（水/火/木/暗/光）筛选角色
- **背景切换**：内置 21 张游戏场景背景图，也可选纯色背景
- **本地保存**：通过 `localStorage` 自动保存排行状态，关闭页面不丢失
- **导出/导入**：支持导出排行数据为 JSON 文件，也可从文件导入恢复
- **截图导出**：一键将排行列表渲染为 PNG 图片（使用 html2canvas）
- **全屏模式**：沉浸式查看排行

## 项目结构

```
xl_cardlist_tool/
├── index.html              # 主页面
├── css/style.css           # 样式（深色主题 + 毛玻璃效果）
├── js/app.js               # 主逻辑（拖拽、筛选、保存、导入导出）
├── assets/
│   ├── card/               # 角色头像图片 (~100 张)
│   ├── bg/                 # 背景图片 (~21 张)
│   ├── bg_list.json        # 背景列表数据
│   └── characters.json     # 角色数据 (87 个角色)
├── lib/
│   ├── sortable.min.js     # SortableJS v1.15.7 (拖拽排序)
│   └── html2canvas.min.js  # html2canvas v1.4.1 (截图导出)
├── 批量处理工具/
│   ├── characters.csv      # 完整角色数据表
│   ├── generate_json.py    # CSV 转 JSON
│   ├── generate_bg_list.py # 扫描背景图生成列表
│   └── rename_batch.py     # 批量重命名头像
└── start.bat               # 启动本地服务器
```

## 数据维护

`批量处理工具/` 目录下的 Python 脚本用于维护应用数据：

- `generate_json.py`：从 `characters.csv` 生成 `assets/characters.json`
- `generate_bg_list.py`：扫描 `assets/bg/` 生成 `bg_list.json`
- `rename_batch.py`：批量重命名头像文件以匹配角色 ID

## 技术栈

- 原生 HTML5 + CSS3 + JavaScript（无框架）
- [SortableJS](https://github.com/SortableJS/Sortable) - 拖拽排序
- [html2canvas](https://html2canvas.hertzen.com/) - HTML 转截图
