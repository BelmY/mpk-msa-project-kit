<p align="center">
  <svg width="120" height="120" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mpkFullBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e3a8a"/>
      </linearGradient>
    </defs>
    <!-- Escudo / Marco Exterior -->
    <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#mpkFullBg)" stroke="#38bdf8" stroke-width="2.5"/>
    <path d="M32 8 L50 15 V31 C50 44 41 53 32 57 C23 53 14 44 14 31 V15 Z" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.25"/>
    <!-- Monograma MPK -->
    <text x="32" y="25" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-weight="900" font-size="15" letter-spacing="0.8">MPK</text>
    <!-- Barras Gantt -->
    <rect x="14" y="31" width="22" height="5" rx="2" fill="#38bdf8"/>
    <rect x="22" y="39" width="20" height="5" rx="2" fill="#f59e0b"/>
    <rect x="14" y="47" width="24" height="5" rx="2" fill="#10b981"/>
    <!-- Hito / Milestone -->
    <path d="M36 33.5 H49 V45 M42 41.5 H49" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="49,44 54,49 49,54 44,49" fill="#ffffff" stroke="#38bdf8" stroke-width="1.5"/>
  </svg>
</p>


# MPK — MSA Project Kit (by FJB)

Standalone desktop project management suite tailored for **Mission & Safety Assurance (MSA / RAMS)** engineering workflows. Based on the Gantit open-source engine, MPK provides a professional Ribbon-style interface, WBS task/milestone management, advanced dual-table budgeting (tasks & engineering roles), document control signatures, and professional PDF/Print exports.

---

## ✨ Key Features
- **Ribbon-Based UI:** Grouped productivity modules for File, WBS Tasks, Resources, Cost, Config, and Visualization.
- **WBS & Milestones:** Effortless task injection, summary work-package grouping, and zero-duration milestones.
- **Dual-Table Cost Engine:** Track hourly engineering roles (Work) and fixed-price items/licenses (Material) with executive KPIs.
- **Document Control & Signatures:** Configurable engineering approval blocks (*Prepared by, Reviewed by, Approved by*), document codes, and revision control for formal printing/PDFs.
- **Standalone Portable Execution:** Fully packaged for Windows via Electron-Builder.

---

## 🚀 Quick Start & Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/BelmY/mpk-msa-project-kit.git](https://github.com/BelmY/mpk-msa-project-kit.git)
   cd mpk-msa-project-kit