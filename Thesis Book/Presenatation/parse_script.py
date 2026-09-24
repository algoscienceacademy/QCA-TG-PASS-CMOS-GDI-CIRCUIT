import json
import os

summary_path = os.path.join(os.path.dirname(__file__), 'extracted_adder', 'slides_summary.json')
overview_path = os.path.join(os.path.dirname(__file__), 'extracted_adder', 'slides_overview.txt')

with open(summary_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

with open(overview_path, 'w', encoding='utf-8') as out:
    out.write(f"Total Slides: {data['total_slides']}\n")
    for slide in data['slides']:
        s_num = slide['slide_num']
        out.write(f"\n=== Slide {s_num} ===\n")
        for sh in slide['shapes']:
            pos = sh.get('pos', {})
            pos_str = f"x={pos.get('x')}, y={pos.get('y')}, w={pos.get('w')}, h={pos.get('h')}"
            if 'image' in sh:
                out.write(f"  [IMAGE] {sh['image']} at {pos_str}\n")
            if 'text' in sh:
                txt = ' | '.join(sh['text'])
                out.write(f"  [TEXT] {txt} at {pos_str}\n")
            if 'table' in sh:
                out.write(f"  [TABLE] {len(sh['table'])} rows at {pos_str}\n")
                for r in sh['table']:
                    out.write(f"      {r}\n")

print('Done writing overview to slides_overview.txt')
