import zipfile
import xml.etree.ElementTree as ET

pptx_path = r'c:\Users\shahrear\Downloads\LTSpice\Thesis\Thesis Book\Presenatation\Adder.pptx'

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'
}

with zipfile.ZipFile(pptx_path, 'r') as z:
    for i in range(1, 30):
        s_name = f'ppt/slides/slide{i}.xml'
        if s_name in z.namelist():
            tree = ET.fromstring(z.read(s_name))
            bg = tree.find('p:bg', NS)
            bg_color = "default/none"
            if bg is not None:
                clr = bg.find('.//a:srgbClr', NS)
                if clr is not None:
                    bg_color = clr.attrib.get('val')
            
            # Count shapes
            shapes = tree.findall('.//p:sp', NS)
            pics = tree.findall('.//p:pic', NS)
            tbls = tree.findall('.//a:tbl', NS)
            
            # Check shape fills / colors
            shape_colors = []
            for sp in shapes:
                solidFill = sp.find('.//a:solidFill/a:srgbClr', NS)
                if solidFill is not None:
                    shape_colors.append(solidFill.attrib.get('val'))
            
            print(f"Slide {i:02d}: bg={bg_color}, shapes={len(shapes)}, pics={len(pics)}, tbls={len(tbls)}, fills={shape_colors[:5]}")
