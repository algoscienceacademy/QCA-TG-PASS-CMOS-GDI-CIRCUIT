import zipfile
import xml.etree.ElementTree as ET

pptx_path = r'c:\Users\shahrear\Downloads\LTSpice\Thesis\Thesis Book\Presenatation\Adder.pptx'

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'
}

with zipfile.ZipFile(pptx_path, 'r') as z:
    m_xml = ET.fromstring(z.read('ppt/slideMasters/slideMaster1.xml'))
    print("=== MASTER SLIDE SHAPES ===")
    for sp in m_xml.findall('.//p:sp', NS):
        nvSpPr = sp.find('p:nvSpPr', NS)
        name = nvSpPr.find('p:cNvPr', NS).attrib.get('name') if nvSpPr is not None else ""
        text = ""
        txBody = sp.find('p:txBody', NS)
        if txBody is not None:
            text = " ".join([t.text for t in txBody.findall('.//a:t', NS) if t.text])
        fills = [f.attrib.get('val') for f in sp.findall('.//a:srgbClr', NS)]
        print(f"Shape: '{name}', fills={fills}, text='{text}'")

    print("\n=== SLIDE LAYOUTS ===")
    for name in z.namelist():
        if name.startswith('ppt/slideLayouts/slideLayout'):
            l_xml = ET.fromstring(z.read(name))
            l_name = name.split('/')[-1]
            shapes = l_xml.findall('.//p:sp', NS)
            print(f"Layout {l_name}: shapes={len(shapes)}")
