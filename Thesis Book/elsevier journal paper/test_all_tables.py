import subprocess, re, fitz

with open('main.tex', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update preamble to include tabularx, colortbl, and color definitions
packages_old = r'''\usepackage{array}
\usepackage{url}
\usepackage{xcolor}'''

packages_new = r'''\usepackage{array}
\usepackage{tabularx}
\usepackage{url}
\usepackage{xcolor}
\usepackage{colortbl}

%% ---------- MICROSOFT WORD TABLE STYLING ----------
\definecolor{worddarkblue}{HTML}{2F5597}   % Word Accent 1 Dark Blue (Header)
\definecolor{wordlightblue}{HTML}{D9E1F2}  % Word Accent 1 Light Blue (Highlight / Totals)
\definecolor{wordzebra}{HTML}{F2F5F9}      % Word Soft Alternating Row Tint
\definecolor{wordborder}{HTML}{A6B9D0}     % Word Grid Line Soft Steel Blue'''

text = text.replace(packages_old, packages_new)

# Table 1
t1_old = r'''\begin{table}[t]
    \centering
    \caption{Logic functions realizable with a single GDI cell.}
    \label{tab:gdi_functions}
    \resizebox{\columnwidth}{!}{%
    \begin{tabular}{llccl}
        \toprule
        \textbf{Function} & \textbf{Output Expression} & \textbf{$N$} & \textbf{$P$} & \textbf{Description} \\
        \midrule
        F1  & $\bar{G} \cdot P$         & 0         & $B$       & AND with inverted gate \\
        F2  & $G + P$                   & $B$       & 1         & OR function \\
        INV & $\bar{G}$                 & 0         & 1         & Standard inverter \\
        MUX & $\bar{G} P + G N$         & $B$       & $C$       & 2-to-1 multiplexer \\
        XOR & $\bar{G} B + G \bar{B}$   & $\bar{B}$ & $B$       & Exclusive-OR \\
        XNOR & $\bar{G}\bar{B} + G B$   & $B$       & $\bar{B}$ & Exclusive-NOR \\
        \bottomrule
    \end{tabular}%
    }
\end{table}'''

t1_new = r'''\begin{table}[t]
    \centering
    \caption{Logic functions realizable with a single GDI cell.}
    \label{tab:gdi_functions}
    \renewcommand{\arraystretch}{1.35}
    \setlength{\tabcolsep}{4pt}
    {\small
    \arrayrulecolor{wordborder}
    \begin{tabular}{|c|c|c|c|p{2.7cm}|}
        \hline
        \rowcolor{worddarkblue}
        \textcolor{white}{\textbf{Function}} & \textcolor{white}{\textbf{Output Expression}} & \textcolor{white}{\textbf{$N$}} & \textcolor{white}{\textbf{$P$}} & \textcolor{white}{\textbf{Description}} \\
        \hline
        F1  & $\bar{G} \cdot P$         & 0         & $B$       & AND with inverted gate \\
        \hline
        \rowcolor{wordzebra}
        F2  & $G + P$                   & $B$       & 1         & OR function \\
        \hline
        INV & $\bar{G}$                 & 0         & 1         & Standard inverter \\
        \hline
        \rowcolor{wordzebra}
        MUX & $\bar{G} P + G N$         & $B$       & $C$       & 2-to-1 multiplexer \\
        \hline
        XOR & $\bar{G} B + G \bar{B}$   & $\bar{B}$ & $B$       & Exclusive-OR \\
        \hline
        \rowcolor{wordzebra}
        XNOR & $\bar{G}\bar{B} + G B$   & $B$       & $\bar{B}$ & Exclusive-NOR \\
        \hline
    \end{tabular}
    }
\end{table}'''

text = text.replace(t1_old, t1_new)

# Table 2
t2_old = r'''\begin{table}[t]
    \centering
    \caption{Truth table for a 1-bit magnitude comparator.}
    \label{tab:truth_table}
    \begin{tabular*}{\columnwidth}{@{\extracolsep{\fill}}ccccc@{}}
        \toprule
        \textbf{Input $A$} & \textbf{Input $B$} & \textbf{$A>B$} & \textbf{$A=B$} & \textbf{$A<B$} \\
        \midrule
        0 & 0 & 0 & 1 & 0 \\
        0 & 1 & 0 & 0 & 1 \\
        1 & 0 & 1 & 0 & 0 \\
        1 & 1 & 0 & 1 & 0 \\
        \bottomrule
    \end{tabular*}
\end{table}'''

t2_new = r'''\begin{table}[t]
    \centering
    \caption{Truth table for a 1-bit magnitude comparator.}
    \label{tab:truth_table}
    \renewcommand{\arraystretch}{1.35}
    \setlength{\tabcolsep}{8pt}
    {\small
    \arrayrulecolor{wordborder}
    \begin{tabular}{|c|c|c|c|c|}
        \hline
        \rowcolor{worddarkblue}
        \textcolor{white}{\textbf{Input $A$}} & \textcolor{white}{\textbf{Input $B$}} & \textcolor{white}{\textbf{$A>B$}} & \textcolor{white}{\textbf{$A=B$}} & \textcolor{white}{\textbf{$A<B$}} \\
        \hline
        0 & 0 & 0 & 1 & 0 \\
        \hline
        \rowcolor{wordzebra}
        0 & 1 & 0 & 0 & 1 \\
        \hline
        1 & 0 & 1 & 0 & 0 \\
        \hline
        \rowcolor{wordzebra}
        1 & 1 & 0 & 1 & 0 \\
        \hline
    \end{tabular}
    }
\end{table}'''

text = text.replace(t2_old, t2_new)

# Table 3
t3_old = r'''\begin{table}[t]
    \centering
    \caption{GDI cell terminal assignments for each comparator output.}
    \label{tab:gdi_mapping}
    \resizebox{\columnwidth}{!}{%
    \begin{tabular}{lccccc}
        \toprule
        \textbf{Output} & \textbf{Boolean Function} & \textbf{$G$} & \textbf{$P$} & \textbf{$N$} & \textbf{Transistors} \\
        \midrule
        $A > B$ & $A \cdot \overline{B}$ & $B$ & $A$ & GND & 2 \\
        $A < B$ & $\overline{A} \cdot B$ & $A$ & $B$ & GND & 2 \\
        $A = B$ & $A \odot B$ (XNOR) & $A$ & $\overline{B}$ & $B$ & 2 \\
        Inverter $\overline{A}$ & $\overline{A}$ & $A$ & $V_{DD}$ & GND & 2 \\
        Inverter $\overline{B}$ & $\overline{B}$ & $B$ & $V_{DD}$ & GND & 2 \\
        \midrule
        \multicolumn{5}{r}{\textbf{Total transistor count:}} & \textbf{10} \\
        \bottomrule
    \end{tabular}%
    }
\end{table}'''

t3_new = r'''\begin{table}[t]
    \centering
    \caption{GDI cell terminal assignments for each comparator output.}
    \label{tab:gdi_mapping}
    \renewcommand{\arraystretch}{1.35}
    \setlength{\tabcolsep}{3.5pt}
    {\small
    \arrayrulecolor{wordborder}
    \begin{tabular}{|c|c|c|c|c|c|}
        \hline
        \rowcolor{worddarkblue}
        \textcolor{white}{\textbf{Output}} & \textcolor{white}{\textbf{Boolean Function}} & \textcolor{white}{\textbf{$G$}} & \textcolor{white}{\textbf{$P$}} & \textcolor{white}{\textbf{$N$}} & \textcolor{white}{\textbf{Transistors}} \\
        \hline
        $A > B$ & $A \cdot \overline{B}$ & $B$ & $A$ & GND & 2 \\
        \hline
        \rowcolor{wordzebra}
        $A < B$ & $\overline{A} \cdot B$ & $A$ & $B$ & GND & 2 \\
        \hline
        $A = B$ & $A \odot B$ (XNOR) & $A$ & $\overline{B}$ & $B$ & 2 \\
        \hline
        \rowcolor{wordzebra}
        Inverter $\overline{A}$ & $\overline{A}$ & $A$ & $V_{DD}$ & GND & 2 \\
        \hline
        Inverter $\overline{B}$ & $\overline{B}$ & $B$ & $V_{DD}$ & GND & 2 \\
        \hline
        \rowcolor{wordlightblue}
        \multicolumn{5}{|r|}{\textbf{Total transistor count:}} & \textbf{10} \\
        \hline
    \end{tabular}
    }
\end{table}'''

text = text.replace(t3_old, t3_new)

# Table 4
t4_old = r'''\begin{table}[t]
    \centering
    \caption{Functional verification results across all comparator topologies.}
    \label{tab:functional_ver}
    \resizebox{\columnwidth}{!}{%
    \begin{tabular}{ccccccc}
        \toprule
        $A$ & $B$ & \textbf{Expected} & \textbf{Static CMOS} & \textbf{TGL} & \textbf{PTL} & \textbf{GDI} \\
        \midrule
        0 & 0 & $A=B$ High & \checkmark & \checkmark & \checkmark & \checkmark \\
        0 & 1 & $A<B$ High & \checkmark & \checkmark & \checkmark & \checkmark \\
        1 & 0 & $A>B$ High & \checkmark & \checkmark & \checkmark & \checkmark \\
        1 & 1 & $A=B$ High & \checkmark & \checkmark & \checkmark & \checkmark \\
        \bottomrule
    \end{tabular}%
    }
\end{table}'''

t4_new = r'''\begin{table}[t]
    \centering
    \caption{Functional verification results across all comparator topologies.}
    \label{tab:functional_ver}
    \renewcommand{\arraystretch}{1.35}
    \setlength{\tabcolsep}{2.5pt}
    {\footnotesize
    \arrayrulecolor{wordborder}
    \begin{tabular}{|c|c|c|c|c|c|c|}
        \hline
        \rowcolor{worddarkblue}
        \textcolor{white}{\textbf{$A$}} & \textcolor{white}{\textbf{$B$}} & \textcolor{white}{\textbf{Expected}} & \textcolor{white}{\textbf{Static CMOS}} & \textcolor{white}{\textbf{TGL}} & \textcolor{white}{\textbf{PTL}} & \textcolor{white}{\textbf{GDI}} \\
        \hline
        0 & 0 & $A=B$ High & \checkmark & \checkmark & \checkmark & \checkmark \\
        \hline
        \rowcolor{wordzebra}
        0 & 1 & $A<B$ High & \checkmark & \checkmark & \checkmark & \checkmark \\
        \hline
        1 & 0 & $A>B$ High & \checkmark & \checkmark & \checkmark & \checkmark \\
        \hline
        \rowcolor{wordzebra}
        1 & 1 & $A=B$ High & \checkmark & \checkmark & \checkmark & \checkmark \\
        \hline
    \end{tabular}
    }
\end{table}'''

text = text.replace(t4_old, t4_new)

# Table 5
t5_old = r'''\begin{table}[t]
    \centering
    \caption{Measured performance of proposed 10-transistor GDI comparator (180\,nm PTM, $V_{DD}$ = 1.8\,V).}
    \label{tab:gdi_performance}
    \resizebox{\columnwidth}{!}{%
    \begin{tabular}{lccc}
        \toprule
        \textbf{Performance Metric} & \textbf{$A<B$} & \textbf{$A=B$} & \textbf{$A>B$} \\
        \midrule
        Transistor count & \multicolumn{3}{c}{\textbf{10}} \\
        Rise time $t_r$ (10\%--90\%) & 553.03\,ps & 515.36\,ps & 532.37\,ps \\
        Fall time $t_f$ (90\%--10\%) & 154.21\,ps & 157.73\,ps & 158.19\,ps \\
        Propagation delay $t_{pd}$ & 353.50\,ps & \textbf{336.00\,ps} & 345.00\,ps \\
        Average power $P_{avg}$ & \multicolumn{3}{c}{\textbf{34.18\,pW}} \\
        Power-Delay Product (PDP) & $1.20 \times 10^{-5}$\,fJ & $\mathbf{1.14 \times 10^{-5}}$\,\textbf{fJ} & $1.17 \times 10^{-5}$\,fJ \\
        \bottomrule
    \end{tabular}%
    }
\end{table}'''

t5_new = r'''\begin{table}[t]
    \centering
    \caption{Measured performance of proposed 10-transistor GDI comparator (180\,nm PTM, $V_{DD}$ = 1.8\,V).}
    \label{tab:gdi_performance}
    \renewcommand{\arraystretch}{1.35}
    \setlength{\tabcolsep}{3.5pt}
    {\small
    \arrayrulecolor{wordborder}
    \begin{tabular}{|l|c|c|c|}
        \hline
        \rowcolor{worddarkblue}
        \textcolor{white}{\textbf{Performance Metric}} & \textcolor{white}{\textbf{$A<B$}} & \textcolor{white}{\textbf{$A=B$}} & \textcolor{white}{\textbf{$A>B$}} \\
        \hline
        Transistor count & \multicolumn{3}{c|}{\textbf{10}} \\
        \hline
        \rowcolor{wordzebra}
        Rise time $t_r$ (10\%--90\%) & 553.03\,ps & 515.36\,ps & 532.37\,ps \\
        \hline
        Fall time $t_f$ (90\%--10\%) & 154.21\,ps & 157.73\,ps & 158.19\,ps \\
        \hline
        \rowcolor{wordzebra}
        Propagation delay $t_{pd}$ & 353.50\,ps & \textbf{336.00\,ps} & 345.00\,ps \\
        \hline
        Average power $P_{avg}$ & \multicolumn{3}{c|}{\textbf{34.18\,pW}} \\
        \hline
        \rowcolor{wordzebra}
        Power-Delay Product (PDP) & $1.20 \times 10^{-5}$\,fJ & $\mathbf{1.14 \times 10^{-5}}$\,\textbf{fJ} & $1.17 \times 10^{-5}$\,fJ \\
        \hline
    \end{tabular}
    }
\end{table}'''

text = text.replace(t5_old, t5_new)

# Table 6
t6_old = r'''\begin{table*}[t]
    \centering
    \caption{Performance summary and comparative evaluation of benchmark comparator topologies (180\,nm PTM, 1.8\,V, $A=B$ output).}
    \label{tab:benchmark_results}
    \begin{tabular*}{\textwidth}{@{\extracolsep{\fill}}lcccc@{}}
        \toprule
        \textbf{Metric} & \textbf{Static CMOS} & \textbf{TGL} & \textbf{PTL} & \textbf{Proposed GDI} \\
        \midrule
        Transistor count & 32 & 16 & 10 & \textbf{10} \\
        Device count reduction & Baseline & 50.00\% & 68.75\% & \textbf{68.75\%} \\
        Average power $P_{avg}$ & 130.61\,pW & 105.21\,$\mu$W & 38.12\,pW & \textbf{34.18\,pW} \\
        Power savings vs.\ CMOS & Baseline & --- & 70.81\% & \textbf{73.83\%} \\
        Delay $t_{pd}$ ($A=B$) & 398.09\,ps & 587.24\,ps & 421.77\,ps & \textbf{336.00\,ps} \\
        Speed improvement vs.\ CMOS & Baseline & $-47.51$\% & $-5.95$\% & \textbf{+15.59\%} \\
        PDP ($A=B$) & $5.10 \times 10^{-5}$\,fJ & 61.78\,fJ & $1.60 \times 10^{-5}$\,fJ & $\mathbf{1.14 \times 10^{-5}}$\,\textbf{fJ} \\
        PDP improvement vs.\ CMOS & Baseline & --- & 68.63\% & \textbf{77.65\%} \\
        \bottomrule
    \end{tabular*}
\end{table*}'''

t6_new = r'''\begin{table*}[t]
    \centering
    \caption{Performance summary and comparative evaluation of benchmark comparator topologies (180\,nm PTM, 1.8\,V, $A=B$ output).}
    \label{tab:benchmark_results}
    \renewcommand{\arraystretch}{1.4}
    \setlength{\tabcolsep}{10pt}
    {\small
    \arrayrulecolor{wordborder}
    \begin{tabular}{|l|c|c|c|c|}
        \hline
        \rowcolor{worddarkblue}
        \textcolor{white}{\textbf{Metric}} & 
        \textcolor{white}{\textbf{Static CMOS}} & 
        \textcolor{white}{\textbf{TGL}} & 
        \textcolor{white}{\textbf{PTL}} & 
        \textcolor{white}{\textbf{Proposed GDI}} \\
        \hline
        Transistor count & 32 & 16 & 10 & \textbf{10} \\
        \hline
        \rowcolor{wordzebra}
        Device count reduction & Baseline & 50.00\% & 68.75\% & \textbf{68.75\%} \\
        \hline
        Average power $P_{avg}$ & 130.61\,pW & 105.21\,$\mu$W & 38.12\,pW & \textbf{34.18\,pW} \\
        \hline
        \rowcolor{wordzebra}
        Power savings vs.\ CMOS & Baseline & --- & 70.81\% & \textbf{73.83\%} \\
        \hline
        Delay $t_{pd}$ ($A=B$) & 398.09\,ps & 587.24\,ps & 421.77\,ps & \textbf{336.00\,ps} \\
        \hline
        \rowcolor{wordzebra}
        Speed improvement vs.\ CMOS & Baseline & $-47.51$\% & $-5.95$\% & \textbf{+15.59\%} \\
        \hline
        PDP ($A=B$) & $5.10 \times 10^{-5}$\,fJ & 61.78\,fJ & $1.60 \times 10^{-5}$\,fJ & $\mathbf{1.14 \times 10^{-5}}$\,\textbf{fJ} \\
        \hline
        \rowcolor{wordzebra}
        PDP improvement vs.\ CMOS & Baseline & --- & 68.63\% & \textbf{77.65\%} \\
        \hline
    \end{tabular}
    }
\end{table*}'''

text = text.replace(t6_old, t6_new)

# Table 7
t7_old = r'''\begin{table*}[t]
    \centering
    \caption{Performance comparison with published comparator implementations arranged in reverse chronological order.}
    \label{tab:literature_comparison}
    \begin{tabular*}{\textwidth}{@{\extracolsep{\fill}}llccc@{}}
        \toprule
        \textbf{Reference} & \textbf{Design Architecture} & \textbf{Delay ($t_{pd}$)} & \textbf{Power ($P_{avg}$)} & \textbf{PDP (fJ)} \\
        \midrule
        Sharma et al. (2025) \cite{sharma2025} & PTL-GDI-TGL hybrid & 5.5\,ps & 7.3\,$\mu$W & 0.04 \\
        Lubaba et al. (2020) \cite{lubaba2020} & PTL-TG-CMOS hybrid (2-bit) & 0.192\,ns & 7.792\,$\mu$W & 1.496 \\
        Tailor et al. (2019) \cite{tailor2019} & MTCMOS with forced stack & 330.61\,ps & 48.12\,pW & $1.59 \times 10^{-5}$ \\
        Kumar \& Kumar (2017) \cite{kumar2017} & CMOS with stacking & 49.38\,ns & 174.35\,pW & 0.0086 \\
        \midrule
        \textbf{Proposed GDI (This work)} & \textbf{Pure GDI 10-transistor} & \textbf{336\,ps} & \textbf{34.18\,pW} & $\mathbf{1.14 \times 10^{-5}}$ \\
        \bottomrule
    \end{tabular*}
\end{table*}'''

t7_new = r'''\begin{table*}[t]
    \centering
    \caption{Performance comparison with published comparator implementations arranged in reverse chronological order.}
    \label{tab:literature_comparison}
    \renewcommand{\arraystretch}{1.4}
    \setlength{\tabcolsep}{8pt}
    {\small
    \arrayrulecolor{wordborder}
    \begin{tabular}{|l|l|c|c|c|}
        \hline
        \rowcolor{worddarkblue}
        \textcolor{white}{\textbf{Reference}} & 
        \textcolor{white}{\textbf{Design Architecture}} & 
        \textcolor{white}{\textbf{Delay ($t_{pd}$)}} & 
        \textcolor{white}{\textbf{Power ($P_{avg}$)}} & 
        \textcolor{white}{\textbf{PDP (fJ)}} \\
        \hline
        Sharma et al. (2025) \cite{sharma2025} & PTL-GDI-TGL hybrid & 5.5\,ps & 7.3\,$\mu$W & 0.04 \\
        \hline
        \rowcolor{wordzebra}
        Lubaba et al. (2020) \cite{lubaba2020} & PTL-TG-CMOS hybrid (2-bit) & 0.192\,ns & 7.792\,$\mu$W & 1.496 \\
        \hline
        Tailor et al. (2019) \cite{tailor2019} & MTCMOS with forced stack & 330.61\,ps & 48.12\,pW & $1.59 \times 10^{-5}$ \\
        \hline
        \rowcolor{wordzebra}
        Kumar \& Kumar (2017) \cite{kumar2017} & CMOS with stacking & 49.38\,ns & 174.35\,pW & 0.0086 \\
        \hline
        \rowcolor{wordlightblue}
        \textbf{Proposed GDI (This work)} & \textbf{Pure GDI 10-transistor} & \textbf{336\,ps} & \textbf{34.18\,pW} & $\mathbf{1.14 \times 10^{-5}}$ \\
        \hline
    \end{tabular}
    }
\end{table*}'''

text = text.replace(t7_old, t7_new)

# Table 8
t8_old = r'''\begin{table}[t]
    \centering
    \caption{Propagation delay ($t_{pd}$) for the $A=B$ output across PTM technology nodes.}
    \label{tab:scaling}
    \resizebox{\columnwidth}{!}{%
    \begin{tabular}{lcccc}
        \toprule
        \textbf{Technology Node} & \textbf{Static CMOS} & \textbf{TG Logic} & \textbf{PTL} & \textbf{Proposed GDI} \\
        \midrule
        180\,nm PTM & 35.54\,ns & 25.54\,ns & 25.21\,ns & \textbf{25.50\,ns} \\
        90\,nm PTM  & 35.19\,ns & 35.91\,ns & 25.21\,ns & \textbf{25.50\,ns} \\
        45\,nm PTM  & 35.54\,ns & 25.62\,ns & 25.25\,ns & \textbf{25.35\,ns} \\
        \bottomrule
    \end{tabular}%
    }
\end{table}'''

t8_new = r'''\begin{table}[t]
    \centering
    \caption{Propagation delay ($t_{pd}$) for the $A=B$ output across PTM technology nodes.}
    \label{tab:scaling}
    \renewcommand{\arraystretch}{1.35}
    \setlength{\tabcolsep}{3.5pt}
    {\small
    \arrayrulecolor{wordborder}
    \begin{tabular}{|l|c|c|c|c|}
        \hline
        \rowcolor{worddarkblue}
        \textcolor{white}{\textbf{Technology Node}} & 
        \textcolor{white}{\textbf{Static CMOS}} & 
        \textcolor{white}{\textbf{TG Logic}} & 
        \textcolor{white}{\textbf{PTL}} & 
        \textcolor{white}{\textbf{Proposed GDI}} \\
        \hline
        180\,nm PTM & 35.54\,ns & 25.54\,ns & 25.21\,ns & \textbf{25.50\,ns} \\
        \hline
        \rowcolor{wordzebra}
        90\,nm PTM  & 35.19\,ns & 35.91\,ns & 25.21\,ns & \textbf{25.50\,ns} \\
        \hline
        45\,nm PTM  & 35.54\,ns & 25.62\,ns & 25.25\,ns & \textbf{25.35\,ns} \\
        \hline
    \end{tabular}
    }
\end{table}'''

text = text.replace(t8_old, t8_new)

with open('main_test.tex', 'w', encoding='utf-8') as f:
    f.write(text)

print('Wrote main_test.tex successfully. Compiling with pdflatex...')
res = subprocess.run(['pdflatex', '-interaction=nonstopmode', 'main_test.tex'], capture_output=True, text=True)
print('Compilation exit code:', res.returncode)
if res.returncode != 0:
    print('Error tail:')
    print(res.stdout[-1000:])
else:
    print('Compilation SUCCEEDED!')
