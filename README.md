# Thesis Digital Logic Benchmark Suite

An implementation and comparison repository for digital logic gates and comparator blocks across multiple CMOS design styles and QCA representations.

## 1. Purpose

This project supports academic and engineering evaluation of logic circuit implementations with focus on:

- Functional correctness
- Delay behavior
- Power and energy characteristics
- Design complexity tradeoffs

The repository is structured to make cross-style benchmarking repeatable and easy to review.

## 2. Scope

### Included

- LTspice schematic implementations for core logic gates in:
  - Static CMOS
  - Pass Transistor Logic
  - Transmission Gate Logic
  - GDI (Gate Diffusion Input)
- QCA gate and comparator artifacts
- Comparator workspace for expansion

### Not Included (Current State)

- Automated simulation scripts
- Centralized measured-results database
- Formal verification files

## 3. Repository Structure

```text
Thesis/
|-- comparator/
|-- GDI/
|   |-- AND.asc
|   |-- NAND.asc
|   |-- NOR.asc
|   |-- OR.asc
|   |-- XNOR.asc
|   \-- XOR.asc
|-- PassTransistor/
|   |-- AND.asc
|   |-- NAND.asc
|   |-- NOR.asc
|   |-- OR.asc
|   |-- XNOR.asc
|   \-- XOR.asc
|-- QCA/
|   |-- AbarB
|   |-- AND
|   |-- Comparator
|   |-- Comparatorsheet
|   |-- NAND
|   |-- NOR
|   |-- NOT
|   |-- OR
|   |-- XNOR
|   |-- XOR
|   |-- bitpreview.pdf
|   \-- Comparatorsheetpreview.pdf
|-- Static/
|   |-- AND.asc
|   |-- NAND.asc
|   |-- NOR.asc
|   |-- OR.asc
|   |-- XNOR.asc
|   \-- XOR.asc
\-- TG/
    |-- AND.asc
    |-- NAND.asc
    |-- NOR.asc
    |-- OR.asc
    |-- XNOR.asc
    \-- XOR.asc
```

## 4. Supported Logic Functions

The following functions are currently represented in LTspice style folders:

- AND
- OR
- NAND
- NOR
- XOR
- XNOR

Additional comparator-related designs are expected to grow under comparator and QCA.

## 5. Toolchain and Environment

### Recommended Tools

- LTspice (latest stable release)
- QCA design/simulation tool used by your lab workflow
- Spreadsheet or scripting tool for result aggregation (Excel, MATLAB, Python, or equivalent)

### Recommended Operating Environment

- Windows 10/11
- Stable power model and consistent simulation settings between runs

## 6. Simulation and Measurement Methodology

Use a consistent methodology across all logic styles to preserve fairness.

### 6.1 Testbench Consistency Requirements

- Use identical supply voltage for each style comparison.
- Use matched input stimulus pattern and timing.
- Use same output load assumptions.
- Use equivalent temperature and process assumptions.

### 6.2 Core Metrics

- Propagation delay:
  - tPLH: low-to-high output transition delay
  - tPHL: high-to-low output transition delay
- Average power consumption
- Energy per switching event (if measured)
- Transistor count (for CMOS styles)

### 6.3 Suggested Comparison Sequence

1. Select one gate type (for example XOR).
2. Simulate the gate in Static, PassTransistor, TG, and GDI.
3. Capture delay and power metrics using identical measurement points.
4. Record transistor count and implementation notes.
5. Repeat for all gate types.
6. Summarize trends and outliers.

## 7. Data Recording Template

Use a table format similar to the following for consistent reporting:

| Logic Style | Gate | VDD | Load | tPLH | tPHL | Avg Power | Energy/Switch | Transistor Count | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Static | XOR |  |  |  |  |  |  |  |  |
| TG | XOR |  |  |  |  |  |  |  |  |
| PassTransistor | XOR |  |  |  |  |  |  |  |  |
| GDI | XOR |  |  |  |  |  |  |  |  |

## 8. Quality and Review Checklist

Before accepting a design or result entry, verify:

- Schematic opens without missing symbols or models.
- Circuit output truth table is correct.
- Input vectors cover all required states.
- Measurement points are documented and repeatable.
- Data entries include units and test conditions.

## 9. Naming and Organization Standards

- Keep gate schematic names uppercase and function-based (for example AND.asc).
- Maintain identical gate filename sets across style folders.
- Place comparator-focused files under comparator unless intentionally archived elsewhere.
- Keep preview/reference documents under the relevant implementation folder.

## 10. Contribution Guidelines

When adding or modifying designs:

1. Preserve existing folder conventions.
2. Ensure all new schematics are simulation-ready.
3. Add a short note in commit message on what changed and why.
4. If metrics are updated, include test conditions used.

## 11. Limitations and Risks

- Cross-style comparison can be biased by unequal loading or non-equivalent sizing.
- QCA and CMOS technology assumptions are fundamentally different; direct numeric comparison should be interpreted carefully.
- Missing documentation of test conditions reduces reproducibility.

## 12. Roadmap

- Add standardized LTspice testbenches for all gates.
- Add comparator implementations in all applicable styles.
- Add automated extraction of delay and power metrics.
- Add consolidated results report and plots.

## 13. Versioning

Use semantic, milestone-based repository tagging where possible:

- v0.x for exploratory design stage
- v1.0 for first complete baseline comparison set

## 14. License and Citation

License and citation policy are currently not defined in this repository.
For academic publication, add:

- LICENSE file
- CITATION file (or citation section with BibTeX)

## 15. Contact and Ownership

Project ownership currently follows thesis workflow and supervision structure.
Add maintainer contact details once publication or team collaboration requires formal support.
