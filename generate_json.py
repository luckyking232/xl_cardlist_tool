import csv
import json
import os

# 输入 CSV 文件路径（请根据实际位置确认）
csv_file = 'assets/characters.csv'
# 输出 JSON 文件路径
json_file = 'assets/characters.json'

characters = []

with open(csv_file, encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        char_id = int(row['ID'])
        name = row['Name'].split('/')[0]  # 保留中文名
        star = int(row['Star'])
        profession = row['Profession']
        element = row['Element']          # 新增：属性
        img = f"HeadSquare_{char_id}.png"

        characters.append({
            "id": char_id,
            "name": name,
            "star": star,
            "profession": profession,
            "element": element,           # 新增字段
            "img": img
        })

# 确保输出目录存在
os.makedirs(os.path.dirname(json_file), exist_ok=True)

with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(characters, f, ensure_ascii=False, indent=2)

print(f"✅ 已生成 {len(characters)} 个角色数据 -> {json_file}")