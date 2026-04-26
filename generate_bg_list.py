import os
import json
import glob

# 配置路径
BG_DIR = 'assets/bg'
OUTPUT_FILE = 'assets/bg_list.json'

# 获取所有 PNG 图片文件（按文件名排序）
image_files = sorted(glob.glob(os.path.join(BG_DIR, '*.png')))

# 提取纯文件名
image_names = [os.path.basename(f) for f in image_files]

# 构建背景列表，第一项为默认颜色
bg_list = [
    {"name": "默认深色", "type": "color", "value": "#1a1a2e"}
]

for idx, fname in enumerate(image_names, start=1):
    bg_list.append({
        "name": f"bg{idx}",
        "type": "image",
        "file": fname
    })

# 确保输出目录存在
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

# 写入 JSON 文件
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(bg_list, f, ensure_ascii=False, indent=2)

print(f"✅ 已扫描 {len(image_names)} 张背景图片，生成 {OUTPUT_FILE}")
print(f"   总背景数：{len(bg_list)}（含默认颜色）")