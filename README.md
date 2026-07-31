# Video RBT - Magic Companion

A modern Video Ring Back Tone (RBT) subscription landing page with 3D carousel, built with Vite + Vanilla JavaScript.

## ✨ Features

- 🎨 Aurora gradient glass morphism design
- 🎞️ Interactive 3D swipeable carousel with video previews
- 🔊 Video sound toggle functionality
- 📱 Fully responsive mobile-first design
- 🎯 Multi-mode subscription flow (SMS OTP / 1-Click Carrier / WiFi)
- 🎭 Simulated order outcomes (Success / Insufficient Balance / Network Error)
- ⚡ Built with Vite for blazing fast development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start dev server (default: http://localhost:5173)
npm run dev
```

### Build for Production

```bash
# Build static files to ./dist
npm run build
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

## 📦 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages auto-deployment
├── src/
│   ├── components/
│   │   ├── carousel.js         # 3D carousel swipe logic
│   │   ├── grid.js             # Video grid & sound toggle
│   │   └── modal.js            # Subscription flow & modals
│   ├── styles/
│   │   └── main.css            # All styles (glass morphism, animations)
│   └── main.js                 # Entry point
├── index.html                  # HTML entry
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

## 🎮 Demo Controller

The page includes a built-in demo controller (sticky header) to simulate different user scenarios:

### User State / Mode
- **Mode A**: New Visitor (SMS OTP) - Requires 4-digit PIN verification
- **Mode B**: Cellular Carrier (1-Click) - Direct subscription without OTP
- **Mode C**: WiFi Broadband (SMS OTP) - SMS verification flow

### Order Outcome
- **Success**: Subscription activated
- **Insufficient Balance**: Low carrier balance error
- **Network / System Error**: Gateway timeout simulation

## 🌐 Deployment

### GitHub Pages (Automatic)

1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings (Source: GitHub Actions)
3. Push to `main` branch triggers automatic deployment
4. Access via `https://<username>.github.io/<repo-name>/`

### Manual Deployment

```bash
# Build production files
npm run build

# Deploy ./dist folder to any static hosting service
# (Netlify, Vercel, Cloudflare Pages, etc.)
```

## 🎨 Design Highlights

- **Aurora Gradient Background**: Smooth gradient from dark purple to warm orange
- **Glass Morphism Cards**: Frosted glass effect with backdrop blur
- **Gold Glow CTA**: Breathing animation with sweeping shine effect
- **3D Carousel**: Scale and opacity transitions with video autoplay
- **State-Aware UI**: Loading skeletons, network errors, failed states

## 📄 License

© 2026 Carrier Video RBT. All rights reserved.

## 🛠️ Tech Stack

- **Vite** - Next-generation frontend tooling
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern animations & effects (backdrop-filter, glass morphism)
- **GitHub Actions** - CI/CD automation

---

Built with 💜 for modern mobile web experiences
