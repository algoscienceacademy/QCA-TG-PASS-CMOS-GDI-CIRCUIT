import zipfile
import xml.etree.ElementTree as ET
import os
import json

pptx_path = r'c:\Users\shahrear\Downloads\LTSpice\Thesis\Thesis Book\Presenatation\Adder.pptx'

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

out_path = r'c:\Users\shahrear\Downloads\LTSpice\Thesis\Thesis Book\Presenatation\extracted_adder\detailed_slides_dump.txt'

with zipfile.ZipFile(pptx_path, 'r') as z:
    pres_xml = ET.fromstring(z.read('ppt/presentation.xml'))
    sldIdLst = pres_xml.find('p:sldIdLst', NS)
    slide_rids = [s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'] for s in sldIdLst.findall('p:sldId', NS)]

    pres_rels = ET.fromstring(z.read('ppt/_rels/presentation.xml.rels'))
    rid_map = {rel.attrib['Id']: rel.attrib['Target'] for rel in pres_rels.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship')}

    with open(out_path, 'w', encoding='utf-8') as out:
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

            out.write(f"\n================ SLIDE {idx+1} ({target}) ================\n")
            
            # Check shapes in spTree
            spTree = s_xml.find('.//p:spTree', NS)
            if spTree is not None:
                for child in spTree:
                    tag = child.tag.split('}')[-1]
                    
                    # Off / Ext coordinates
                    pos_str = ""
                    xfrm = child.find('.//a:xfrm', NS) or child.find('.//p:xfrm', NS)
                    if xfrm is not None:
                        off = xfrm.find('a:off', NS)
                        ext = xfrm.find('a:ext', NS)
                        if off is not None and ext is not None:
                            x = round(int(off.attrib['x']) / 914400.0, 2)
                            y = round(int(off.attrib['y']) / 914400.0, 2)
                            w = round(int(ext.attrib['cx']) / 914400.0, 2)
                            h = round(int(ext.attrib['cy']) / 914400.0, 2)
                            pos_str = f" [x={x}, y={y}, w={w}, h={h}]"

                    if tag == 'pic':
                        blip = child.find('.//a:blip', NS)
                        if blip is not None:
                            embed = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                            if embed in img_map:
                                out.write(f"  IMAGE: {img_map[embed]}{pos_str}\n")
                    
                    txBody = child.find('.//p:txBody', NS) or child.find('.//a:txBody', NS)
                    if txBody is not None:
                        for p in txBody.findall('a:p', NS):
                            p_text = ""
                            for r in p.findall('a:r', NS):
                                t = r.find('a:t', NS)
                                if t is not None and t.text:
                                    p_text += t.text
                            if p_text:
                                out.write(f"  TEXT{pos_str}: {p_text}\n")

                    tbl = child.find('.//a:tbl', NS)
                    if tbl is not None:
                        out.write(f"  TABLE{pos_str}:\n")
                        for row in tbl.findall('.//a:tr', NS):
                            row_cells = []
                            for cell in row.findall('.//a:tc', NS):
                                cell_txt = ""
                                for p in cell.findall('.//a:p', NS):
                                    for r in p.findall('.//a:r', NS):
                                        t = r.find('a:t', NS)
                                        if t is not None and t.text:
                                            cell_txt += t.text
                                row_cells.append(cell_txt)
                            out.write(f"    {row_cells}\n")

print("Done writing detailed dump.")
