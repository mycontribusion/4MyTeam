# 4MyTeam – Patient Location Tracker

A zero-backend, zero-internet **Progressive Web App (PWA)** for medical teams to track patient Ward & Bed assignments and sync them between devices using QR codes.

> **Works fully offline. No server. No account. No internet.**

---

## Features

| Feature | Description |
|---|---|
| 📋 Patient Dashboard | Cards showing Ward + Bed with color-coded badges |
| ➕ Add / Delete | Simple form with inline validation & duplicate detection |
| 🗑️ Clear All | End-of-shift reset with confirmation prompt |
| 📱 Export via QR | Generates a scannable QR code from the patient list |
| 📷 Import via Scan | Camera scanner merges & deduplicates incoming patients |
| 📋 Copy / Share | Web Share API with clipboard fallback |
| 💾 Auto-save | `localStorage` persistence — survives page reloads |
| 📲 PWA Installable | Add to Home Screen on Android & iOS |

---

## Tech Stack

- **React 18** + **Vite 6**
- **Tailwind CSS 3** — utility-first styling
- **Lucide React** — icons
- **qrcode.react** — QR code generation
- **html5-qrcode** — camera-based QR scanning
- **vite-plugin-pwa** — service worker & manifest

---

## Getting Started

### Prerequisites
- Node.js ≥ 18

### Install & Run

```bash
git clone <repo-url>
cd 4MyTeam
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production Build

```bash
npm run build
npm run preview
```

The build output in `dist/` is fully static — deploy anywhere (Nginx, GitHub Pages, Netlify, etc.).

---

## QR Sync Flow

```
Device A                        Device B
───────                         ───────
[Export QR] → QR modal          [Import / Scan]
              shows QR  ──────► camera reads QR
                                parses JSON
                                merges patients
                                (deduplicates)
```

**QR payload format** (minimized for maximum capacity):
```json
[{"w":"A1","b":"12"},{"w":"B3","b":"4"}]
```

---

## Project Structure

```
src/
├── App.jsx                  # State, localStorage, actions
├── index.css                # Global styles + component classes
├── main.jsx                 # React entry point
└── components/
    ├── Header.jsx           # Title + Saved Locally badge
    ├── AddPatientForm.jsx   # Ward + Bed inputs
    ├── PatientCard.jsx      # Individual patient display
    ├── PatientList.jsx      # Card list with count
    ├── ExportModal.jsx      # QR generation + share
    ├── ScannerComponent.jsx # Camera scanner (with cleanup)
    ├── ConfirmDialog.jsx    # Reusable confirm modal
    └── EmptyState.jsx       # Zero-state illustration
```

---

## Privacy

All data stays **on the device**. Nothing is ever sent to any server.
