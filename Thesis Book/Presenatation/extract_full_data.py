import zipfile
import xml.etree.ElementTree as ET
import os
import json

pptx_path = r'c:\Users\shahrear\Downloads\LTSpice\Thesis\Thesis Book\Presenatation\Adder.pptx'
media_dir = r'c:\Users\shahrear\Downloads\LTSpice\Thesis\Thesis Book\Presenatation\extracted_adder\ppt\media'

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

def parse_all_slides():
    slides = []
    with zipfile.ZipFile(pptx_path, 'r') as z:
        pres_xml = ET.fromstring(z.read('ppt/presentation.xml'))
        sldIdLst = pres_xml.find('p:sldIdLst', NS)
        slide_rids = [s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'] for s in sldIdLst.findall('p:sldId', NS)]

        pres_rels = ET.fromstring(z.read('ppt/_rels/presentation.xml.rels'))
        rid_map = {rel.attrib['Id']: rel.attrib['Target'] for rel in pres_rels.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship')}

        for idx, rId in enumerate(slide_rids):
            target = rid_map[rId]
            s_file = 'ppt/' + target if not target.startswith('ppt/') else target
            s_rels_file = s_file.replace('slides/slide', 'slides/_rels/slide') + '.rels'
            
            img_map = {}
            if s_rels_file in z.namelist():
                s_rels = ET.fromstring(z.read(s_rels_file))
                for rel in s_rels.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                    if 'image' in rel.attrib.get('Type', ''):
                        img_map[rel.attrib['Id']] = os.path.basename(rel.attrib['Target'])

            s_xml = ET.fromstring(z.read(s_file))

            slide_data = {
                'number': idx + 1,
                'elements': []
            }

            spTree = s_xml.find('.//p:spTree', NS)
            if spTree is not None:
                for child in spTree:
                    tag = child.tag.split('}')[-1]
                    
                    # Coordinates
                    pos = {}
                    xfrm = child.find('.//a:xfrm', NS) or child.find('.//p:xfrm', NS)
                    if xfrm is not None:
                        off = xfrm.find('a:off', NS)
                        ext = xfrm.find('a:ext', NS)
                        if off is not None and ext is not None:
                            pos = {
                                'x': round(int(off.attrib['x']) / 914400.0, 2),
                                'y': round(int(off.attrib['y']) / 914400.0, 2),
                                'w': round(int(ext.attrib['cx']) / 914400.0, 2),
                                'h': round(int(ext.attrib['cy']) / 914400.0, 2)
                            }

                    # Image
                    if tag == 'pic':
                        blip = child.find('.//a:blip', NS)
                        if blip is not None:
                            embed = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                            if embed in img_map:
                                slide_data['elements'].append({
                                    'type': 'image',
                                    'file': img_map[embed],
                                    'pos': pos
                                })

                    # Text box or Shape
                    txBody = child.find('.//p:txBody', NS) or child.find('.//a:txBody', NS)
                    if txBody is not None:
                        paragraphs = []
                        for p in txBody.findall('a:p', NS):
                            p_runs = []
                            for r in p.findall('a:r', NS):
                                t = r.find('a:t', NS)
                                rPr = r.find('a:rPr', NS)
                                font_sz = int(rPr.attrib.get('sz')) / 100.0 if (rPr is not None and 'sz' in rPr.attrib) else None
                                bold = rPr.attrib.get('b') == '1' if rPr is not None else False
                                color_elem = rPr.find('.//a:srgbClr', NS) if rPr is not None else None
                                color_hex = color_elem.attrib.get('val') if color_elem is not None else None
                                if t is not None and t.text:
                                    p_runs.append({
                                        'text': t.text,
                                        'fontSize': font_sz,
                                        'bold': bold,
                                        'color': color_hex
                                    })
                            if p_runs:
                                paragraphs.append(p_runs)
                        if paragraphs:
                            slide_data['elements'].append({
                                'type': 'text',
                                'paragraphs': paragraphs,
                                'pos': pos
                            })

                    # Table
                    tbl = child.find('.//a:tbl', NS)
                    if tbl is not None:
                        rows_data = []
                        for row in tbl.findall('.//a:tr', NS):
                            row_cells = []
                            for cell in row.findall('.//a:tc', NS):
                                cell_text = ""
                                for p in cell.findall('.//a:p', NS):
                                    for r in p.findall('.//a:r', NS):
                                        t = r.find('a:t', NS)
                                        if t is not None and t.text:
                                            cell_text += t.text
                                row_cells.append(cell_text)
                            rows_data.append(row_cells)
                        slide_data['elements'].append({
                            'type': 'table',
                            'rows': rows_data,
                            'pos': pos
                        })

            slides.append(slide_data)
    return slides

slides = parse_all_slides()
with open(r'c:\Users\shahrear\Downloads\LTSpice\Thesis\Thesis Book\Presenatation\extracted_adder\full_slides_data.json', 'w', encoding='utf-8') as f:
    json.dump(slides, f, indent=2, ensure_ascii=False)

print(f"Parsed {len(slides)} slides successfully into full_slides_data.json")
