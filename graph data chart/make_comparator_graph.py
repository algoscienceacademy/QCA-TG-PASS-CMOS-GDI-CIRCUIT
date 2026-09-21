import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

# ============================================================
# CMOS 1-Bit Comparator Performance Graphs
# Data taken from the supplied PDF
# ============================================================

designs = [
    "Static CMOS (2017)",
    "Static CMOS (2019)",
    "Static, PASS, TG (2020)",
    "6T MUX ADDER (2025)",
    "GDI Proposed"
]

# PDF values converted to common units for comparison
# Delay: ns -> ps where necessary
delay_ps = [49380, 330.61, 192, 5.5, 336]

# Power: µW -> pW where necessary
power_pw = [174.352, 48.12, 7792, 7300, 34.18]

# PDP: fJ
pdp_fj = [0.0086, 0.0000159, 1.496, 0.04, 0.0000114]


def save_bar_chart(values, title, ylabel, filename):
    fig, ax = plt.subplots(figsize=(13, 7))
    x = np.arange(len(designs))

    bar_colors = ["#4c78a8"] * len(designs)
    bar_colors[-1] = "#d62728"
    bars = ax.bar(x, values, width=0.65, color=bar_colors)

    ax.set_title(title, fontsize=17, fontweight="bold")
    ax.set_xlabel("Comparator Design", fontsize=12)
    ax.set_ylabel(ylabel, fontsize=12)
    ax.set_xticks(x)
    ax.set_xticklabels(designs, rotation=15, ha="right")
    ax.set_yscale("log")
    ax.grid(axis="y", linestyle="--", alpha=0.35)

    for bar, value in zip(bars, values):
        ax.annotate(
            f"{value:g}",
            xy=(bar.get_x() + bar.get_width() / 2, bar.get_height()),
            xytext=(0, 7),
            textcoords="offset points",
            ha="center",
            va="bottom",
            fontsize=10
        )

    fig.tight_layout()
    fig.savefig(filename, dpi=300, bbox_inches="tight")
    plt.close(fig)


def save_line_chart(values, title, ylabel, filename):
    fig, ax = plt.subplots(figsize=(13, 7))
    x = np.arange(len(designs))

    ax.plot(
        x, values,
        marker="o",
        linewidth=2.5,
        markersize=7
    )

    ax.set_title(title, fontsize=17, fontweight="bold")
    ax.set_xlabel("Comparator Design", fontsize=12)
    ax.set_ylabel(ylabel, fontsize=12)
    ax.set_xticks(x)
    ax.set_xticklabels(designs, rotation=15, ha="right")
    ax.set_yscale("log")
    ax.grid(True, linestyle="--", alpha=0.35)

    for xi, value in zip(x, values):
        ax.annotate(
            f"{value:g}",
            (xi, value),
            xytext=(0, 9),
            textcoords="offset points",
            ha="center",
            fontsize=10
        )

    fig.tight_layout()
    fig.savefig(filename, dpi=300, bbox_inches="tight")
    plt.close(fig)


# Save all four PNG graphs automatically in the same folder as this script.
output_dir = Path(__file__).resolve().parent

save_line_chart(
    delay_ps,
    "Propagation Delay Comparison of CMOS 1-Bit Comparator Designs",
    "Propagation Delay (ps)",
    output_dir / "01_Propagation_Delay_Line_Graph.png"
)

save_bar_chart(
    delay_ps,
    "Propagation Delay Comparison of CMOS 1-Bit Comparator Designs",
    "Propagation Delay (ps)",
    output_dir / "02_Propagation_Delay_Bar_Chart.png"
)

save_bar_chart(
    power_pw,
    "Average Power Dissipation Comparison",
    "Average Power (pW)",
    output_dir / "03_Average_Power_Bar_Chart.png"
)

save_bar_chart(
    pdp_fj,
    "Power-Delay Product (PDP) Comparison",
    "Power-Delay Product (fJ)",
    output_dir / "04_PDP_Bar_Chart.png"
)

print("\n==============================================")
print("All graphs were generated successfully!")
print("==============================================")
print(f"Output folder: {output_dir}")
print("1. 01_Propagation_Delay_Line_Graph.png")
print("2. 02_Propagation_Delay_Bar_Chart.png")
print("3. 03_Average_Power_Bar_Chart.png")
print("4. 04_PDP_Bar_Chart.png")
print("==============================================")
