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

        print(f"=== SLIDE {idx+1} ===")
        # Look for shapes and txBody with details
        for sp in s_xml.findall('.//p:sp', NS):
            # Shape text & formatting
            txBody = sp.find('p:txBody', NS)
            if txBody is not None:
                for p in txBody.findall('a:p', NS):
                    p_text = ""
                    for r in p.findall('a:r', NS):
                        rPr = r.find('a:rPr', NS)
                        t = r.find('a:t', NS)
                        font_sz = rPr.attrib.get('sz') if rPr is not None else None
                        color_elem = rPr.find('.//a:srgbClr', NS) if rPr is not None else None
                        color_hex = color_elem.attrib.get('val') if color_elem is not None else None
                        bold = rPr.attrib.get('b') if rPr is not None else None
                        if t is not None and t.text:
                            p_text += t.text
                    if p_text:
                        print(f"  [Text]: {p_text} (sz: {font_sz}, color: {color_hex}, bold: {bold})")
        
        # Look for pictures
        for pic in s_xml.findall('.//p:pic', NS):
            blip = pic.find('.//a:blip', NS)
            if blip is not None:
                embed = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                if embed in img_map:
                    print(f"  [Image]: {img_map[embed]}")

        # Look for tables
        for tbl in s_xml.findall('.//a:tbl', NS):
            print("  [Table found]")
