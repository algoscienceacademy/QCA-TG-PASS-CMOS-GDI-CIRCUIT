import zipfile
import xml.etree.ElementTree as ET
import os

pptx_path = r'c:\Users\shahrear\Downloads\LTSpice\Thesis\Thesis Book\Presenatation\Adder.pptx'

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

with zipfile.ZipFile(pptx_path, 'r') as z:
    for name in z.namelist():
        if name.startswith('ppt/slideMasters/'):
            print("Master:", name)
            m_xml = ET.fromstring(z.read(name))
            # look for background colors or shapes
            for srgb in m_xml.findall('.//a:srgbClr', NS):
                print("  Master color:", srgb.attrib.get('val'))
        if name == 'ppt/theme/theme1.xml':
            t_xml = ET.fromstring(z.read(name))
            for srgb in t_xml.findall('.//a:srgbClr', NS):
                print("  Theme color:", srgb.attrib.get('val'))
