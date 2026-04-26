import csv
import os
import re
import glob

csv_file = 'assets/characters.csv'
card_dir = 'assets/card'

# 1. 从 CSV 获取所有有效 ID（集合）
valid_ids = set()
with open(csv_file, encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        valid_ids.add(int(row['ID']))

print(f"从 CSV 中读取到 {len(valid_ids)} 个有效角色 ID")

# 2. 收集所有图片文件
images = glob.glob(os.path.join(card_dir, 'HeadSquare_*.png'))
print(f"在 {card_dir} 中找到 {len(images)} 个图片文件\n")

# 统计
renamed = 0
skipped = 0
warnings = []

for img_path in images:
    old_name = os.path.basename(img_path)
    # 提取 HeadSquare_ 后面的第一个数字（5 位或更多）
    match = re.search(r'HeadSquare_(\d{5})', old_name)
    if not match:
        warnings.append(f"未能识别数字：{old_name}")
        skipped += 1
        continue

    five_digit = int(match.group(1))
    # 按规则计算八位 ID
    full_id = 10000100 + (five_digit - 10000)

    if full_id not in valid_ids:
        warnings.append(f"计算出的 ID {full_id} 不在 CSV 中，跳过：{old_name}")
        skipped += 1
        continue

    # 新的文件名
    new_name = f"HeadSquare_{full_id}.png"
    new_path = os.path.join(card_dir, new_name)

    # 避免重复重命名
    if old_name == new_name:
        skipped += 1
        continue

    # 如果目标文件已存在（罕见情况），先改名备份
    if os.path.exists(new_path):
        backup = new_path + '.backup'
        os.rename(new_path, backup)
        print(f"⚠️ 目标已存在，原文件备份为 {backup}")

    os.rename(img_path, new_path)
    print(f"✅ {old_name} → {new_name}")
    renamed += 1

# 汇总
print(f"\n===== 重命名完成 =====")
print(f"成功：{renamed} 个")
print(f"跳过：{skipped} 个")
if warnings:
    print(f"\n⚠️ 警告信息：")
    for w in warnings:
        print(f"  - {w}")