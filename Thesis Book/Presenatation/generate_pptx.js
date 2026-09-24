const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();
pptx.defineLayout({ name: 'WIDESCREEN', width: 13.33, height: 7.5 });
pptx.layout = 'WIDESCREEN';

// ============================================================================
// COLOR PALETTE & DESIGN SYSTEM TOKENS
// ============================================================================
const C_DARK_BG    = '0F172A'; // Obsidian Navy Header & Accent
const C_NAVY_ACCENT= '242852'; // Classic Deep Navy Accent
const C_WHITE      = 'FFFFFF'; // Pure White
const C_LIGHT_CARD = 'F8FAFC'; // Card Background
const C_BORDER     = 'CBD5E1'; // Border Gray
const C_TEXT_DARK  = '0F172A'; // High-contrast Text Dark Slate
const C_TEXT_MUTED = '475569'; // Subtitle Gray Text
const C_BLUE_ACCENT= '297FD5'; // Primary Accent Blue
const C_GOLD       = 'D97706'; // Highlight Gold/Amber
const C_TEAL       = '0D9488'; // Primary Accent Teal

const MEDIA_DIRS = [
    path.join(__dirname, 'extracted_adder', 'ppt', 'media'),
    path.join(__dirname, 'extracted_adder', 'media'),
    path.join(__dirname, '..'),
    __dirname
];

function getImgPath(filename) {
    if (!filename) return null;
    for (const dir of MEDIA_DIRS) {
        const fullPath = path.join(dir, filename);
        if (fs.existsSync(fullPath)) {
            return fullPath;
        }
    }
    console.warn(`[WARN] Image not found: ${filename}`);
    return null;
}

// Helper: Add Standard Slide Header & Footer
function addSlideHeader(slide, titleText, slideNum, categoryText = "DEPARTMENT OF EEE, IIUC | B.Sc. THESIS PRESENTATION") {
    // Top Banner Background
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: 13.33, h: 1.0,
        fill: { color: C_DARK_BG },
        line: { color: C_DARK_BG }
    });

    // Subtitle / Category
    slide.addText(categoryText, {
        x: 0.6, y: 0.12, w: 9.0, h: 0.28,
        fontSize: 11, bold: true, color: C_GOLD, fontFace: 'Arial'
    });

    // Main Slide Title
    slide.addText(titleText, {
        x: 0.6, y: 0.4, w: 12.0, h: 0.5,
        fontSize: 22, bold: true, color: C_WHITE, fontFace: 'Arial'
    });

    // Accent Line
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 1.0, w: 13.33, h: 0.05,
        fill: { color: C_BLUE_ACCENT },
        line: { color: C_BLUE_ACCENT }
    });

    // Footer Bar
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 7.05, w: 13.33, h: 0.45,
        fill: { color: 'E2E8F0' },
        line: { color: 'CBD5E1', pt: 1 }
    });

    slide.addText("16-bit Adder with Manchester Carry Ahead | Department of EEE, IIUC", {
        x: 0.6, y: 7.12, w: 10.0, h: 0.32,
        fontSize: 11, bold: true, color: C_TEXT_DARK, fontFace: 'Arial'
    });

    if (slideNum) {
        slide.addText(`Slide ${slideNum}`, {
            x: 11.0, y: 7.12, w: 1.73, h: 0.32,
            fontSize: 11, bold: true, color: C_BLUE_ACCENT, fontFace: 'Arial', align: 'right'
        });
    }
}

// Helper: Add Container Card
function addCard(slide, x, y, w, h, title = null, bg = C_WHITE, borderColor = C_BORDER) {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: y, w: w, h: h,
        fill: { color: bg },
        line: { color: borderColor, pt: 1.5 },
        rectRadius: 0.08
    });

    if (title) {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: x, y: y, w: w, h: 0.5,
            fill: { color: C_DARK_BG },
            line: { color: C_DARK_BG },
            rectRadius: 0.08
        });

        slide.addShape(pptx.shapes.RECTANGLE, {
            x: x, y: y + 0.25, w: w, h: 0.25,
            fill: { color: C_DARK_BG },
            line: { color: C_DARK_BG }
        });

        slide.addText(title, {
            x: x + 0.2, y: y + 0.08, w: w - 0.4, h: 0.35,
            fontSize: 16, bold: true, color: C_WHITE, fontFace: 'Arial'
        });
    }
}

// ============================================================================
// SLIDE 1: TITLE SLIDE (FRONT PAGE)
// ============================================================================
{
    let slide = pptx.addSlide();
    
    // Obsidian Dark Background
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: 13.33, h: 7.5,
        fill: { color: '0A0F1D' }
    });

    // Gold Top Accent Bar
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: 13.33, h: 0.12,
        fill: { color: C_GOLD }
    });

    // IIUC Banner Header Image (image1.png)
    const img1 = getImgPath('image1.png');
    if (img1) {
        slide.addImage({ path: img1, x: 2.25, y: 0.5, w: 8.83, h: 1.1 });
    }

    // Title Main Card Box Left
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 1.9, w: 11.73, h: 1.5,
        fill: { color: '1E293B' },
        line: { color: C_BLUE_ACCENT, pt: 2 },
        rectRadius: 0.12
    });

    slide.addText("16-bit Adder with Manchester Carry Ahead", {
        x: 1.0, y: 2.2, w: 11.33, h: 0.9,
        fontSize: 32, bold: true, color: C_WHITE, fontFace: 'Arial', align: 'center'
    });

    // Presenters Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 3.7, w: 6.8, h: 3.2,
        fill: { color: '1E293B' },
        line: { color: C_GOLD, pt: 1.5 },
        rectRadius: 0.1
    });

    slide.addText("PRESENTED BY", {
        x: 1.1, y: 3.9, w: 6.2, h: 0.35,
        fontSize: 14, bold: true, color: C_GOLD, fontFace: 'Arial'
    });

    slide.addText([
        { text: "• Ashikur Rahman Bhi  ", options: { bold: true, fontSize: 16, color: C_WHITE } },
        { text: "(ID: ET193069)\n", options: { fontSize: 14, color: C_TEAL } },
        { text: "• Chowdhury Arap Mahamud Recap  ", options: { bold: true, fontSize: 16, color: C_WHITE } },
        { text: "(ID: ET193068)\n", options: { fontSize: 14, color: C_TEAL } },
        { text: "• Pranta Paul  ", options: { bold: true, fontSize: 16, color: C_WHITE } },
        { text: "(ID: ET193089)", options: { fontSize: 14, color: C_TEAL } }
    ], { x: 1.1, y: 4.35, w: 6.2, h: 2.3, fontFace: 'Arial', lineSpacing: 22 });

    // Supervisor Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 7.9, y: 3.7, w: 4.63, h: 3.2,
        fill: { color: '1E293B' },
        line: { color: C_BLUE_ACCENT, pt: 1.5 },
        rectRadius: 0.1
    });

    slide.addText("SUPERVISED BY", {
        x: 8.2, y: 3.9, w: 4.0, h: 0.35,
        fontSize: 14, bold: true, color: C_BLUE_ACCENT, fontFace: 'Arial'
    });

    slide.addText("Engr. Riazul Islam", {
        x: 8.2, y: 4.35, w: 4.0, h: 0.45,
        fontSize: 20, bold: true, color: C_WHITE, fontFace: 'Arial'
    });

    slide.addText("Lecturer\nDepartment of Electrical & Electronic Engineering\nInternational Islamic University Chittagong (IIUC)", {
        x: 8.2, y: 4.9, w: 4.0, h: 1.6,
        fontSize: 14, color: 'CBD5E1', fontFace: 'Arial', lineSpacing: 20
    });
}

// ============================================================================
// SLIDE 2: PRESENTATION OVERVIEW / ROADMAP (IMAGE 2)
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "Presentation Overview & Outline", 2);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Presentation Roadmap", C_WHITE);
    const img2 = getImgPath('image2.png');
    if (img2) {
        slide.addImage({ path: img2, x: 1.2, y: 1.85, w: 10.93, h: 4.7 });
    }
}

// ============================================================================
// SLIDE 3: INTRODUCTION
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "1. INTRODUCTION", 3);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Background & Importance of Adders", C_WHITE);

    slide.addText([
        { text: "• Fundamental Arithmetic Block:\n", options: { bold: true, fontSize: 18, color: C_BLUE_ACCENT } },
        { text: "  Adders are fundamental building blocks in digital electronics and computing. They are circuits designed to perform binary addition, the core operation behind most arithmetic functions in digital systems. Adders are not only essential for simple calculations but also serve as the foundation for more complex arithmetic operations, such as subtraction, multiplication, and division, which are widely used in various applications like media signal processing, computer processors, and embedded systems.\n\n", options: { fontSize: 16, color: C_TEXT_DARK } },
        { text: "• High-Performance VLSI Demand:\n", options: { bold: true, fontSize: 18, color: C_BLUE_ACCENT } },
        { text: "  As technology evolves, there is a growing emphasis on designing faster, smaller, and more energy-efficient adders to meet the demands of modern computing. From the basic Half Adder (HA) to more advanced structures like the Carry Look-Ahead Adder (CLA) and Kogge-Stone Adder (KSA), various adder architectures have been developed to optimize speed, area, and power consumption.\n\n", options: { fontSize: 16, color: C_TEXT_DARK } },
        { text: "• Scope of Presentation:\n", options: { bold: true, fontSize: 18, color: C_BLUE_ACCENT } },
        { text: "  In this presentation, we explore different types of adders, their operation, and their significance in modern digital systems, along with the challenges and innovations in designing efficient adder circuits.", options: { fontSize: 16, color: C_TEXT_DARK } }
    ], { x: 0.9, y: 1.9, w: 11.53, h: 4.6, fontFace: 'Arial', lineSpacing: 22 });
}

// ============================================================================
// SLIDE 4: BACKGROUND - HALF ADDER
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "2. BACKGROUND: Half Adder (HA) Architecture", 4);

    // Left Column: Text & Truth Table
    addCard(slide, 0.6, 1.25, 5.8, 5.5, "Half Adder Concept & Truth Table", C_WHITE);
    slide.addText("A basic adder known as the Half Adder (HA) performs simple binary addition of two input bits using just an XOR gate (for the sum) and an AND gate (for the carry). The structure and behavior of a half adder can be understood through its logic circuit and accompanying truth table.", {
        x: 0.85, y: 1.9, w: 5.3, h: 1.4,
        fontSize: 15, color: C_TEXT_DARK, fontFace: 'Arial', lineSpacing: 20
    });

    // Truth Table
    const table1Rows = [
        [
            { text: "A", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 14 } },
            { text: "B", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 14 } },
            { text: "Sum (S)", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 14 } },
            { text: "Carry (C)", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 14 } }
        ],
        [{ text: "0", options: { fontSize: 14 } }, { text: "0", options: { fontSize: 14 } }, { text: "0", options: { fontSize: 14 } }, { text: "0", options: { fontSize: 14 } }],
        [{ text: "0", options: { fontSize: 14 } }, { text: "1", options: { fontSize: 14 } }, { text: "1", options: { fontSize: 14 } }, { text: "0", options: { fontSize: 14 } }],
        [{ text: "1", options: { fontSize: 14 } }, { text: "0", options: { fontSize: 14 } }, { text: "1", options: { fontSize: 14 } }, { text: "0", options: { fontSize: 14 } }],
        [{ text: "1", options: { fontSize: 14 } }, { text: "1", options: { fontSize: 14 } }, { text: "0", options: { fontSize: 14 } }, { text: "1", options: { fontSize: 14 } }]
    ];

    slide.addTable(table1Rows, {
        x: 0.85, y: 3.4, w: 5.3, h: 2.3,
        colW: [1.3, 1.3, 1.35, 1.35],
        border: { pt: 1, color: C_BORDER },
        align: 'center'
    });

    slide.addText("Table 1: The truth table of a Half Adder", {
        x: 0.85, y: 5.85, w: 5.3, h: 0.4,
        fontSize: 13, bold: true, color: C_BLUE_ACCENT, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Schematic Image
    addCard(slide, 6.7, 1.25, 6.03, 5.5, "Half Adder Logic Diagram", C_WHITE);
    const img4 = getImgPath('image4.png');
    if (img4) {
        slide.addImage({ path: img4, x: 7.0, y: 1.9, w: 5.43, h: 3.8 });
    }
    slide.addText("Fig 01: Half Adder design", {
        x: 7.0, y: 5.85, w: 5.43, h: 0.4,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });
}

// ============================================================================
// SLIDE 5: BACKGROUND - FULL ADDER
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "2. BACKGROUND: Full Adder (FA) Architecture", 5);

    // Left Column: Text & Truth Table
    addCard(slide, 0.6, 1.25, 5.8, 5.5, "Full Adder Concept & Truth Table", C_WHITE);
    slide.addText("By combining two Half adders together, we can process the outputs of the Carry along with the sum for multi-bit binary addition.", {
        x: 0.85, y: 1.85, w: 5.3, h: 0.8,
        fontSize: 15, color: C_TEXT_DARK, fontFace: 'Arial', lineSpacing: 20
    });

    // Truth Table
    const table2Rows = [
        [
            { text: "A", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 13 } },
            { text: "B", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 13 } },
            { text: "Cin", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 13 } },
            { text: "S", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 13 } },
            { text: "C", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 13 } }
        ],
        [{ text: "0", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }],
        [{ text: "0", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }],
        [{ text: "0", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }],
        [{ text: "0", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }],
        [{ text: "1", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }],
        [{ text: "1", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }],
        [{ text: "1", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "0", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }],
        [{ text: "1", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }, { text: "1", options: { fontSize: 12 } }]
    ];

    slide.addTable(table2Rows, {
        x: 0.85, y: 2.7, w: 5.3, h: 3.3,
        colW: [1.06, 1.06, 1.06, 1.06, 1.06],
        border: { pt: 1, color: C_BORDER },
        align: 'center'
    });

    slide.addText("Table 2: The truth table of a Full Adder", {
        x: 0.85, y: 6.1, w: 5.3, h: 0.35,
        fontSize: 13, bold: true, color: C_BLUE_ACCENT, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Schematic Image
    addCard(slide, 6.7, 1.25, 6.03, 5.5, "Full Adder Logic Circuit", C_WHITE);
    const img5 = getImgPath('image5.png');
    if (img5) {
        slide.addImage({ path: img5, x: 7.0, y: 1.9, w: 5.43, h: 3.8 });
    }
    slide.addText("Fig 02: Full Adder design", {
        x: 7.0, y: 5.85, w: 5.43, h: 0.4,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });
}

// ============================================================================
// SLIDE 6: BACKGROUND - RIPPLE CARRY ADDER
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "2. BACKGROUND: Ripple Carry Adder (RCA)", 6);

    // Left Column: RCA Explanation
    addCard(slide, 0.6, 1.25, 5.2, 5.5, "RCA Operation & Limitations", C_WHITE);
    slide.addText([
        { text: "• Cascaded Full Adders:\n", options: { bold: true, fontSize: 18, color: C_BLUE_ACCENT } },
        { text: "  By combining Full Adders in series, we can calculate the sum of n-bit numbers. However, it is a slow method as each bit must process sequentially.\n\n", options: { fontSize: 16, color: C_TEXT_DARK } },
        { text: "• Delay Bottleneck in RCA:\n", options: { bold: true, fontSize: 18, color: 'DC2626' } },
        { text: "  To calculate the most significant bit (MSB), we must wait for the carry signal to propagate all the way from the least significant bit (LSB). This carry propagation delay limits high-speed multiplication and ALU performance.", options: { fontSize: 16, color: C_TEXT_DARK } }
    ], { x: 0.85, y: 1.9, w: 4.7, h: 4.6, fontFace: 'Arial', lineSpacing: 22 });

    // Right Column: Diagram
    addCard(slide, 6.1, 1.25, 6.63, 5.5, "Ripple Carry Adder Circuit Diagram", C_WHITE);
    const img6 = getImgPath('image6.png');
    if (img6) {
        slide.addImage({ path: img6, x: 6.35, y: 1.9, w: 6.13, h: 4.0 });
    }
    slide.addText("Fig 03: Ripple carry Adder design", {
        x: 6.35, y: 6.0, w: 6.13, h: 0.4,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });
}

// ============================================================================
// SLIDE 7: BACKGROUND - CARRY LOOK-AHEAD (CLA)
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "2. BACKGROUND: Carry Look-Ahead (CLA) Block", 7);

    // Left Column: CLA Schematic (image12.png)
    addCard(slide, 0.6, 1.25, 5.8, 5.5, "CLA Carry Calculation Block", C_WHITE);
    const img12 = getImgPath('image12.png');
    if (img12) {
        slide.addImage({ path: img12, x: 0.85, y: 1.85, w: 5.3, h: 4.2 });
    }
    slide.addText("Fig 04: Carry Look Ahead Carry Calculation Block", {
        x: 0.85, y: 6.15, w: 5.3, h: 0.35,
        fontSize: 13, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Text & Formulas
    addCard(slide, 6.7, 1.25, 6.03, 5.5, "CLA Parallel Speed Advantage", C_WHITE);
    slide.addText([
        { text: "• Fast Carry Generation:\n", options: { bold: true, fontSize: 17, color: C_BLUE_ACCENT } },
        { text: "  The circuit shown in Fig 4 calculates carry signals separately and in parallel.\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: "• Reduced Latency:\n", options: { bold: true, fontSize: 17, color: C_BLUE_ACCENT } },
        { text: "  By doing so, we calculate the sum much faster than the ripple carry adder because bits do not need to wait for sequential propagation.", options: { fontSize: 15, color: C_TEXT_DARK } }
    ], { x: 6.95, y: 1.85, w: 5.53, h: 2.2, fontFace: 'Arial', lineSpacing: 20 });

    // Formula Images (image9, image10, image11)
    const img9 = getImgPath('image9.png');
    const img10 = getImgPath('image10.png');
    const img11 = getImgPath('image11.png');

    if (img9) slide.addImage({ path: img9, x: 6.95, y: 4.1, w: 2.5, h: 0.5 });
    if (img10) slide.addImage({ path: img10, x: 9.6, y: 4.1, w: 2.8, h: 0.5 });
    if (img11) slide.addImage({ path: img11, x: 6.95, y: 4.8, w: 5.45, h: 1.6 });
}

// ============================================================================
// SLIDE 8: BACKGROUND - CONVENTIONAL MANCHESTER CARRY ADDER
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "2. BACKGROUND: Manchester Carry Adder", 8);

    // Left Column: Schematic (image13.png)
    addCard(slide, 0.6, 1.25, 7.8, 5.5, "Conventional Manchester Carry Circuit", C_WHITE);
    const img13 = getImgPath('image13.png');
    if (img13) {
        slide.addImage({ path: img13, x: 0.85, y: 1.85, w: 7.3, h: 4.3 });
    }
    slide.addText("Fig 05: Conventional Manchester Carry Adder Carry Calculation", {
        x: 0.85, y: 6.15, w: 7.3, h: 0.35,
        fontSize: 13, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Explanation
    addCard(slide, 8.7, 1.25, 4.03, 5.5, "Manchester Carry Features", C_WHITE);
    slide.addText([
        { text: "• Direct Switch Logic:\n", options: { bold: true, fontSize: 17, color: C_BLUE_ACCENT } },
        { text: "  Calculates carry separately using pass-transistor switch chains.\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: "• Gate Elimination:\n", options: { bold: true, fontSize: 17, color: C_TEAL } },
        { text: "  Differs from standard CLA by avoiding heavy static logic gates in the carry chain, reducing gate count and power.", options: { fontSize: 15, color: C_TEXT_DARK } }
    ], { x: 8.95, y: 1.9, w: 3.53, h: 4.6, fontFace: 'Arial', lineSpacing: 20 });
}

// ============================================================================
// SLIDE 9: BACKGROUND - PARALLEL CARRY LOOK-AHEAD FORMULA
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "2. BACKGROUND: Parallel Carry Generation Principles", 9);

    // Left Column: Formula Image (image14.png)
    addCard(slide, 0.6, 1.25, 6.2, 5.5, "Carry Generation Formulas", C_WHITE);
    const img14 = getImgPath('image14.png');
    if (img14) {
        slide.addImage({ path: img14, x: 0.85, y: 1.9, w: 5.7, h: 4.5 });
    }

    // Right Column: Strategic Importance
    addCard(slide, 7.1, 1.25, 5.63, 5.5, "Parallel Computation Significance", C_WHITE);
    slide.addText([
        { text: "• Simultaneous Carry Calculation:\n", options: { bold: true, fontSize: 18, color: C_BLUE_ACCENT } },
        { text: "  Instead of waiting for each carry to be produced sequentially (as in ripple-carry addition), all carries are computed in parallel using closed-form logic expressions.\n\n", options: { fontSize: 16, color: C_TEXT_DARK } },
        { text: "• Essential for High-Speed CPUs:\n", options: { bold: true, fontSize: 18, color: C_TEAL } },
        { text: "  Carry Look-Ahead calculation is essential for building fast arithmetic logic units (ALUs) found in modern microprocessors and digital signal processors (DSPs), improving overall system clock rates.", options: { fontSize: 16, color: C_TEXT_DARK } }
    ], { x: 7.35, y: 1.9, w: 5.13, h: 4.6, fontFace: 'Arial', lineSpacing: 22 });
}

// ============================================================================
// SLIDE 10: LITERATURE REVIEW
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "3. LITERATURE REVIEW: Prior Art Comparison", 10);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Summary of Literature Contributions & Limitations", C_WHITE);

    const litRows = [
        [
            { text: "Researcher(s)", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 15 } },
            { text: "Year", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 15 } },
            { text: "Contribution", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 15 } },
            { text: "Drawbacks / Limitations", options: { bold: true, fill: C_DARK_BG, color: C_WHITE, fontSize: 15 } }
        ],
        [
            { text: "Padmanabhan Balasubramanian &\nNikos E. Mastorakis [1]", options: { fontSize: 13, color: C_TEXT_DARK } },
            { text: "2022", options: { fontSize: 13, color: C_TEXT_DARK } },
            { text: "Use of CLA Adder for an advanced high-speed design", options: { fontSize: 13, color: C_TEXT_DARK } },
            { text: "Uses static logic gates which are more complex and power-heavy.", options: { fontSize: 13, color: C_TEXT_DARK } }
        ],
        [
            { text: "Vellingiri GOVINDARAJ,\nEzhılazhagan CHENGUTTUVAN,\nDhanasekar SUBRAMANIYAM [2]", options: { fontSize: 13, color: C_TEXT_DARK } },
            { text: "2022", options: { fontSize: 13, color: C_TEXT_DARK } },
            { text: "Use of CSKA Adder for a FIR filter design using block bypass.", options: { fontSize: 13, color: C_TEXT_DARK } },
            { text: "Employs Ripple Carry Adder blocks with logic gates, resulting in slow speed.", options: { fontSize: 13, color: C_TEXT_DARK } }
        ],
        [
            { text: "P Das, A L Bhalerao, A Mane,\nA Angeline A, V S K Bhaaskaran [3]", options: { fontSize: 13, color: C_TEXT_DARK } },
            { text: "2019", options: { fontSize: 13, color: C_TEXT_DARK } },
            { text: "Use of Manchester carry adder with High-Speed Domino (HSD) logic.", options: { fontSize: 13, color: C_TEXT_DARK } },
            { text: "The design does not incorporate any multi-level carry bypass system.", options: { fontSize: 13, color: C_TEXT_DARK } }
        ]
    ];

    slide.addTable(litRows, {
        x: 0.85, y: 1.95, w: 11.63, h: 4.4,
        colW: [3.2, 1.1, 3.6, 3.73],
        border: { pt: 1, color: C_BORDER },
        align: 'center'
    });
}

// ============================================================================
// SLIDE 11: PROBLEM STATEMENT
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "4. PROBLEM STATEMENT", 11);

    const problems = [
        { num: "01", title: "Reduce Power Consumption", desc: "Conventional 16-bit adders exhibit high dynamic and static power dissipation due to redundant switching and heavy gate counts." },
        { num: "02", title: "Reduce Rise Time and Fall Time", desc: "Long signal propagation delays in traditional carry chains increase rise/fall times, creating performance bottlenecks at higher frequencies." },
        { num: "03", title: "Reduce Circuit Complexity", desc: "Complex logic gate structures increase transistor count, layout footprint, and routing parasitic capacitance." }
    ];

    problems.forEach((p, idx) => {
        let yPos = 1.3 + idx * 1.85;

        addCard(slide, 0.6, yPos, 12.13, 1.65, null, C_WHITE, C_BORDER);

        // Badge
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 0.9, y: yPos + 0.3, w: 1.1, h: 1.05,
            fill: { color: C_DARK_BG },
            rectRadius: 0.1
        });
        slide.addText(p.num, {
            x: 0.9, y: yPos + 0.45, w: 1.1, h: 0.75,
            fontSize: 22, bold: true, color: C_GOLD, fontFace: 'Arial', align: 'center'
        });

        // Content
        slide.addText(p.title, {
            x: 2.3, y: yPos + 0.3, w: 9.8, h: 0.4,
            fontSize: 20, bold: true, color: C_TEXT_DARK, fontFace: 'Arial'
        });

        slide.addText(p.desc, {
            x: 2.3, y: yPos + 0.75, w: 9.8, h: 0.7,
            fontSize: 15, color: C_TEXT_MUTED, fontFace: 'Arial', lineSpacing: 20
        });
    });
}

// ============================================================================
// SLIDE 12: OBJECTIVES
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "5. RESEARCH OBJECTIVES", 12);

    const objectives = [
        { num: "01", title: "Novel Hybrid Adder Design", desc: "Develop a new 16-bit adder design utilizing existing Manchester Carry and bypass techniques to minimize critical path delay." },
        { num: "02", title: "Rise & Fall Time Optimization", desc: "Significantly improve rise time and fall time dynamics through optimized transistor sizing and multi-level bypass paths." },
        { num: "03", title: "Power & Energy Characterization", desc: "Rigorously calculate and analyze total power consumption and power-delay product (PDP) across nanometer nodes." }
    ];

    objectives.forEach((o, idx) => {
        let yPos = 1.3 + idx * 1.85;

        addCard(slide, 0.6, yPos, 12.13, 1.65, null, C_WHITE, C_BORDER);

        // Badge
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 0.9, y: yPos + 0.3, w: 1.1, h: 1.05,
            fill: { color: C_BLUE_ACCENT },
            rectRadius: 0.1
        });
        slide.addText(o.num, {
            x: 0.9, y: yPos + 0.45, w: 1.1, h: 0.75,
            fontSize: 22, bold: true, color: C_WHITE, fontFace: 'Arial', align: 'center'
        });

        // Content
        slide.addText(o.title, {
            x: 2.3, y: yPos + 0.3, w: 9.8, h: 0.4,
            fontSize: 20, bold: true, color: C_TEXT_DARK, fontFace: 'Arial'
        });

        slide.addText(o.desc, {
            x: 2.3, y: yPos + 0.75, w: 9.8, h: 0.7,
            fontSize: 15, color: C_TEXT_MUTED, fontFace: 'Arial', lineSpacing: 20
        });
    });
}

// ============================================================================
// SLIDE 13: METHODOLOGY - SYSTEM BLOCK DIAGRAM
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "6. METHODOLOGY: Overall System Architecture", 13);

    // Left Column: Block Diagram Image (image15.png)
    addCard(slide, 0.6, 1.25, 8.5, 5.5, "16-Bit Adder Architecture Diagram", C_WHITE);
    const img15 = getImgPath('image15.png');
    if (img15) {
        slide.addImage({ path: img15, x: 0.85, y: 1.85, w: 8.0, h: 4.3 });
    }
    slide.addText("Fig 06: System Block Diagram", {
        x: 0.85, y: 6.15, w: 8.0, h: 0.35,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Description
    addCard(slide, 9.3, 1.25, 3.43, 5.5, "System Integration", C_WHITE);
    slide.addText([
        { text: "• Component Hierarchy:\n", options: { bold: true, fontSize: 17, color: C_BLUE_ACCENT } },
        { text: "  The overall system block diagram contains the various modular cell components of the proposed 16-bit Manchester Carry Adder.\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: "• Modular Design:\n", options: { bold: true, fontSize: 17, color: C_TEAL } },
        { text: "  Combines Type I, Type II, Type III, Type IV cells, Domino logic, and summer stages for high-speed operation.", options: { fontSize: 15, color: C_TEXT_DARK } }
    ], { x: 9.55, y: 1.9, w: 2.93, h: 4.6, fontFace: 'Arial', lineSpacing: 20 });
}

// ============================================================================
// SLIDE 14: METHODOLOGY - TYPE I CELL
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "6. METHODOLOGY: Type I Cell Circuit", 14);

    // Left Column: Image (image16.png)
    addCard(slide, 0.6, 1.25, 6.5, 5.5, "Type I Cell Transistor Schematic", C_WHITE);
    const img16 = getImgPath('image16.png');
    if (img16) {
        slide.addImage({ path: img16, x: 0.85, y: 1.85, w: 6.0, h: 4.3 });
    }
    slide.addText("Fig 07: Type I Cell", {
        x: 0.85, y: 6.15, w: 6.0, h: 0.35,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Explanation
    addCard(slide, 7.3, 1.25, 5.43, 5.5, "Type I Cell Operation", C_WHITE);
    slide.addText([
        { text: "• Transistor Structure:\n", options: { bold: true, fontSize: 17, color: C_BLUE_ACCENT } },
        { text: "  The Type I cell incorporates one intercell and two intracell bypass transistors, specifically P0-3, P1-3, and P2-3.\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: "• Swift Carry Propagation:\n", options: { bold: true, fontSize: 17, color: C_TEAL } },
        { text: "  The presence of P0-3 enables the carry input Cin to propagate swiftly to the Type II cell, bypassing intermediate nodes.", options: { fontSize: 15, color: C_TEXT_DARK } }
    ], { x: 7.55, y: 1.9, w: 4.93, h: 4.6, fontFace: 'Arial', lineSpacing: 20 });
}

// ============================================================================
// SLIDE 15: METHODOLOGY (CONT) - TYPE II CELL
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "6. METHODOLOGY: Type II Cell Structure", 15);

    // Left Column: Image (image17.png)
    addCard(slide, 0.6, 1.25, 6.5, 5.5, "Type II Cell Transistor Schematic", C_WHITE);
    const img17 = getImgPath('image17.png');
    if (img17) {
        slide.addImage({ path: img17, x: 0.85, y: 1.85, w: 6.0, h: 4.3 });
    }
    slide.addText("Fig 08: Type II Cell", {
        x: 0.85, y: 6.15, w: 6.0, h: 0.35,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Explanation
    addCard(slide, 7.3, 1.25, 5.43, 5.5, "Type II & Type III Topology", C_WHITE);
    slide.addText([
        { text: "• Shared Topology:\n", options: { bold: true, fontSize: 17, color: C_BLUE_ACCENT } },
        { text: "  Topologically, the Type II and Type III cells share the same structure; their main distinction lies in transistor sizing.\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: "• Carry-Skip Function:\n", options: { bold: true, fontSize: 17, color: C_TEAL } },
        { text: "  Transistors P8-11 enable standard carry-skip across bit blocks whenever all propagate signals within the block are high.", options: { fontSize: 15, color: C_TEXT_DARK } }
    ], { x: 7.55, y: 1.9, w: 4.93, h: 4.6, fontFace: 'Arial', lineSpacing: 20 });
}

// ============================================================================
// SLIDE 16: METHODOLOGY (CONT) - TYPE IV CELL
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "6. METHODOLOGY: Type IV Cell Structure", 16);

    // Left Column: Image (image18.PNG)
    addCard(slide, 0.6, 1.25, 6.5, 5.5, "Type IV Cell Transistor Schematic", C_WHITE);
    const img18 = getImgPath('image18.PNG');
    if (img18) {
        slide.addImage({ path: img18, x: 0.85, y: 1.85, w: 6.0, h: 4.3 });
    }
    slide.addText("Fig 09: Type IV Cell", {
        x: 0.85, y: 6.15, w: 6.0, h: 0.35,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Explanation
    addCard(slide, 7.3, 1.25, 5.43, 5.5, "Type IV Cell Distinctions", C_WHITE);
    slide.addText([
        { text: "• Sizing & Bypass Placement:\n", options: { bold: true, fontSize: 17, color: C_BLUE_ACCENT } },
        { text: "  The Type IV cell differs from Type II and Type III cells in both transistor sizing and placement of the intercell bypass transistor P_(12-15).\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: "• Block Skip Execution:\n", options: { bold: true, fontSize: 17, color: C_TEAL } },
        { text: "  Transistor P_(12-15) performs the usual skip action on blocks of bits when all propagate signals into the blocks are high.", options: { fontSize: 15, color: C_TEXT_DARK } }
    ], { x: 7.55, y: 1.9, w: 4.93, h: 4.6, fontFace: 'Arial', lineSpacing: 20 });
}

// ============================================================================
// SLIDE 17: METHODOLOGY (CONT) - DOMINO LOGIC GATE
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "6. METHODOLOGY: Multiple-Output Domino Logic Gate", 17);

    // Left Column: Image (image19.png)
    addCard(slide, 0.6, 1.25, 6.5, 5.5, "Multiple-Output Domino Logic Schematic", C_WHITE);
    const img19 = getImgPath('image19.png');
    if (img19) {
        slide.addImage({ path: img19, x: 0.85, y: 1.85, w: 6.0, h: 4.3 });
    }
    slide.addText("Fig 10: Multiple-output domino logic gate used to compute P_(i-j)", {
        x: 0.85, y: 6.15, w: 6.0, h: 0.35,
        fontSize: 13, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Explanation
    addCard(slide, 7.3, 1.25, 5.43, 5.5, "Propagate Control Generation", C_WHITE);
    slide.addText([
        { text: "• Control Signal Generation:\n", options: { bold: true, fontSize: 17, color: C_BLUE_ACCENT } },
        { text: "  The intercell and intracell bypass transistors are controlled by signals Pi-j.\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: "• High-Speed Domino Gate:\n", options: { bold: true, fontSize: 17, color: C_TEAL } },
        { text: "  These control signals are generated by a high-speed multiple-output domino logic gate, minimizing area and driver delay.", options: { fontSize: 15, color: C_TEXT_DARK } }
    ], { x: 7.55, y: 1.9, w: 4.93, h: 4.6, fontFace: 'Arial', lineSpacing: 20 });
}

// ============================================================================
// SLIDE 18: METHODOLOGY (CONT) - SUMMER CIRCUIT
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "6. METHODOLOGY: Summer Circuit Architecture", 18);

    // Left Column: Image (image20.png)
    addCard(slide, 0.6, 1.25, 6.5, 5.5, "Summer Circuit Schematic Diagram", C_WHITE);
    const img20 = getImgPath('image20.png');
    if (img20) {
        slide.addImage({ path: img20, x: 0.85, y: 1.85, w: 6.0, h: 4.3 });
    }
    slide.addText("Fig 11: Summer Circuit used in design", {
        x: 0.85, y: 6.15, w: 6.0, h: 0.35,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Explanation
    addCard(slide, 7.3, 1.25, 5.43, 5.5, "Independent Sum Generation", C_WHITE);
    slide.addText([
        { text: "• Carry & Generate Combination:\n", options: { bold: true, fontSize: 17, color: C_BLUE_ACCENT } },
        { text: "  The carry signal is combined with the generate output of the half adder to obtain the final sum.\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: "• Independent Sum Computation:\n", options: { bold: true, fontSize: 17, color: C_TEAL } },
        { text: "  Each block has its bypass signal. By bypassing the carry and utilizing a summer circuit, the sum output is computed fast and independently.", options: { fontSize: 15, color: C_TEXT_DARK } }
    ], { x: 7.55, y: 1.9, w: 4.93, h: 4.6, fontFace: 'Arial', lineSpacing: 20 });
}

// ============================================================================
// SLIDE 19: IMPLEMENTATION - CADENCE SIMULATION SETUP
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "7. IMPLEMENTATION: Cadence Simulation Setup", 19);

    // Image (image21.png)
    addCard(slide, 0.6, 1.25, 8.5, 5.5, "Cadence Simulation Parameters & Analysis", C_WHITE);
    const img21 = getImgPath('image21.png');
    if (img21) {
        slide.addImage({ path: img21, x: 0.85, y: 1.85, w: 8.0, h: 4.3 });
    }
    slide.addText("Fig 12: Simulation parameters and analysis type", {
        x: 0.85, y: 6.15, w: 8.0, h: 0.35,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Notes
    addCard(slide, 9.3, 1.25, 3.43, 5.5, "Simulation Environment", C_WHITE);
    slide.addText("This figure displays the Cadence Virtuoso simulation configuration, transient analysis settings, and model parameter setups for the 16-bit adder design.", {
        x: 9.55, y: 1.9, w: 2.93, h: 4.6,
        fontSize: 15, color: C_TEXT_DARK, fontFace: 'Arial', lineSpacing: 22
    });
}

// ============================================================================
// SLIDE 20: SIMULATION - SUM OUTPUT WAVEFORMS
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "8. SIMULATION: Sum Output Waveforms", 20);

    // Left Column: Waveform Image (image22.png)
    addCard(slide, 0.6, 1.25, 8.8, 5.5, "Transient Simulation Waveforms (Bits 12-15)", C_WHITE);
    const img22 = getImgPath('image22.png');
    if (img22) {
        slide.addImage({ path: img22, x: 0.85, y: 1.85, w: 8.3, h: 4.3 });
    }
    slide.addText("Fig 09: Sum Output of Adder from simulation", {
        x: 0.85, y: 6.15, w: 8.3, h: 0.35,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });

    // Right Column: Note
    addCard(slide, 9.6, 1.25, 3.13, 5.5, "Waveform Analysis", C_WHITE);
    slide.addText("Sum Output waveform of the 16-bit adder corresponding to bits 12 through 15 during high-frequency transient simulation.", {
        x: 9.8, y: 1.9, w: 2.73, h: 4.6,
        fontSize: 15, color: C_TEXT_DARK, fontFace: 'Arial', lineSpacing: 22
    });
}

// ============================================================================
// SLIDE 21: SIMULATION (CONT) - INPUT SIGNALS
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "8. SIMULATION: Input Test Signals", 21);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Input Waveform Vectors for Bits 12 to 15", C_WHITE);
    const img23 = getImgPath('image23.png');
    if (img23) {
        slide.addImage({ path: img23, x: 0.9, y: 1.85, w: 11.53, h: 4.0 });
    }
    slide.addText("Fig 10: Input Signals for Adder (bits 12 to 15 corresponding to output waveforms)", {
        x: 0.9, y: 6.0, w: 11.53, h: 0.4,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });
}

// ============================================================================
// SLIDE 22: SIMULATION (CONT) - POWER CONSUMPTION
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "8. SIMULATION: Instantaneous Power Consumption", 22);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Power Waveform Graph & Dynamic Fluctuations", C_WHITE);
    const img24 = getImgPath('image24.png');
    if (img24) {
        slide.addImage({ path: img24, x: 0.9, y: 1.85, w: 11.53, h: 3.9 });
    }
    slide.addText("Fig 11: Output of the power Consumption of the circuit. The fluctuations represent dynamic switching during peak logic operations.", {
        x: 0.9, y: 5.95, w: 11.53, h: 0.5,
        fontSize: 14, bold: true, color: C_DARK_BG, fontFace: 'Arial', align: 'center'
    });
}

// ============================================================================
// SLIDE 23: RESULT ANALYSIS - AVERAGE POWER
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "9. RESULT ANALYSIS: Average Power Calculation", 23);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Cadence Calculator Average Power Measurement", C_WHITE);
    const img25 = getImgPath('image25.png');
    if (img25) {
        slide.addImage({ path: img25, x: 2.8, y: 1.85, w: 7.73, h: 3.6 });
    }
    slide.addText("Fig 12: Average Power Output measured using Cadence Virtuoso Calculator function.", {
        x: 0.9, y: 5.75, w: 11.53, h: 0.5,
        fontSize: 15, bold: true, color: C_BLUE_ACCENT, fontFace: 'Arial', align: 'center'
    });
}

// ============================================================================
// SLIDE 24: RESULT ANALYSIS (CONT) - RISE & FALL TIME
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "9. RESULT ANALYSIS: Rise & Fall Time Metrics", 24);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Cadence Calculator Rise and Fall Time Analysis", C_WHITE);
    const img26 = getImgPath('image26.png');
    if (img26) {
        slide.addImage({ path: img26, x: 2.0, y: 1.9, w: 9.33, h: 3.5 });
    }
    slide.addText("Fig 13: Rise Time and Fall Time measurements displayed directly from the Cadence main interface calculator.", {
        x: 0.9, y: 5.75, w: 11.53, h: 0.5,
        fontSize: 15, bold: true, color: C_BLUE_ACCENT, fontFace: 'Arial', align: 'center'
    });
}

// ============================================================================
// SLIDE 25: COMPARISON - 45NM NODE PERFORMANCE
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "10. PERFORMANCE COMPARISON: 45nm Technology Node", 25);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Table 1: Performance Comparison of Various Adders (45nm)", C_WHITE);
    const img28 = getImgPath('image28.png');
    if (img28) {
        slide.addImage({ path: img28, x: 1.5, y: 1.9, w: 10.33, h: 4.5 });
    }
}

// ============================================================================
// SLIDE 26: COMPARISON - 90NM NODE PERFORMANCE
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "10. PERFORMANCE COMPARISON: 90nm Technology Node", 26);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Table 2: Performance Comparison of Various Adders (90nm)", C_WHITE);
    const img27 = getImgPath('image27.png') || getImgPath('image28.png');
    if (img27) {
        slide.addImage({ path: img27, x: 1.5, y: 1.9, w: 10.33, h: 4.5 });
    }
}

// ============================================================================
// SLIDE 27: CONCLUSION
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "11. CONCLUSION & SUMMARY", 27);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Concluding Remarks", C_WHITE);

    slide.addText([
        { text: "• Optimization Significance:\n", options: { bold: true, fontSize: 20, color: C_BLUE_ACCENT } },
        { text: "  As technology advances and the demand for high-performance, low-power systems continues to grow, optimizing adder designs becomes increasingly critical. Understanding the strengths and limitations of various adder types enables engineers to make informed architectural decisions when developing processors, DSPs, and modern digital ICs.\n\n", options: { fontSize: 18, color: C_TEXT_DARK } },
        { text: "• Enabling Next-Gen Computing:\n", options: { bold: true, fontSize: 20, color: C_TEAL } },
        { text: "  Ultimately, mastering adder design is not just about improving basic arithmetic operations—it is about enabling faster, smarter, and more energy-efficient computing architectures for the future.", options: { fontSize: 18, color: C_TEXT_DARK } }
    ], { x: 0.9, y: 1.9, w: 11.53, h: 4.6, fontFace: 'Arial', lineSpacing: 24 });
}

// ============================================================================
// SLIDE 28: REFERENCES
// ============================================================================
{
    let slide = pptx.addSlide();
    addSlideHeader(slide, "12. REFERENCES", 28);

    addCard(slide, 0.6, 1.25, 12.13, 5.5, "Key Literature References", C_WHITE);

    const refs = [
        "[1] P. Das, A. L. Bhalerao, A. Mane, A. A Angeline, and V. S. K. Bhaaskaran, \"Design of Manchester Carry Chain Adder using High speed Domino Logic,\" IOP Conference Series: Materials Science and Engineering, vol. 561, no. 1, p. 012125, Oct. 2019, doi: 10.1088/1757-899X/561/1/012125.",
        "[2] G. V, E. CHENGUTTUVAN, and D. SUBRAMANIYAM, \"Design of Power and Area Efficient Carry Skip Adder and FIR filter Implementation,\" El-Cezeri Fen ve Mühendislik Dergisi, Dec. 2022, doi: 10.31202/ecjse.1162711.",
        "[3] P. Balasubramanian and N. E. Mastorakis, \"High-Speed and Energy-Efficient Carry Look-Ahead Adder,\" Journal of Low Power Electronics and Applications, vol. 12, no. 3, p. 46, Aug. 2022, doi: 10.3390/jlpea12030046."
    ];

    slide.addText([
        { text: refs[0] + "\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: refs[1] + "\n\n", options: { fontSize: 15, color: C_TEXT_DARK } },
        { text: refs[2], options: { fontSize: 15, color: C_TEXT_DARK } }
    ], { x: 0.9, y: 1.9, w: 11.53, h: 4.6, fontFace: 'Arial', lineSpacing: 22 });
}

// ============================================================================
// SLIDE 29: THANK YOU (CLOSING SLIDE / END PAGE)
// ============================================================================
{
    let slide = pptx.addSlide();

    // Dark Background
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: 13.33, h: 7.5,
        fill: { color: '0A0F1D' }
    });

    // Gold Top Accent
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: 13.33, h: 0.12,
        fill: { color: C_GOLD }
    });

    slide.addText("THANK YOU!", {
        x: 1.0, y: 2.0, w: 11.33, h: 1.2,
        fontSize: 52, bold: true, color: C_GOLD, fontFace: 'Arial', align: 'center'
    });

    slide.addText("Questions & Answers", {
        x: 1.0, y: 3.3, w: 11.33, h: 0.6,
        fontSize: 28, bold: true, color: C_WHITE, fontFace: 'Arial', align: 'center'
    });

    // Container Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 3.5, y: 4.2, w: 6.33, h: 2.2,
        fill: { color: '1E293B' },
        line: { color: C_BLUE_ACCENT, pt: 1.5 },
        rectRadius: 0.1
    });

    slide.addText("DEPARTMENT OF EEE, IIUC", {
        x: 3.7, y: 4.45, w: 5.93, h: 0.35,
        fontSize: 14, bold: true, color: C_BLUE_ACCENT, fontFace: 'Arial', align: 'center'
    });

    slide.addText("16-bit Adder with Manchester Carry Ahead\nInternational Islamic University Chittagong", {
        x: 3.7, y: 4.95, w: 5.93, h: 1.2,
        fontSize: 16, color: C_WHITE, fontFace: 'Arial', align: 'center', lineSpacing: 22
    });
}

// ============================================================================
// SAVE PRESENTATION FILE
// ============================================================================
const outputPath = path.join(__dirname, 'Adder_Generated.pptx');
const outputPathMain = path.join(__dirname, 'Adder.pptx');

pptx.writeFile({ fileName: outputPath })
    .then(fileName => {
        console.log(`[SUCCESS] Presentation generated successfully: ${fileName}`);
        fs.copyFileSync(outputPath, outputPathMain);
        console.log(`[SUCCESS] Updated ${outputPathMain}`);
    })
    .catch(err => {
        console.error(`[ERROR] Failed to write presentation:`, err);
    });
