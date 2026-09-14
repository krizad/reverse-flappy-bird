# Reverse Flappy Bird 🐤🕹️

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)](#technology-stack)
[![HTML5 Canvas](https://img.shields.io/badge/Graphics-HTML5%20Canvas-orange.svg)](#features)
[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-blue.svg)](#sound--chiptune-music)

> **Flip the classic role!** You are no longer the fragile flapping bird — **You are the iconic green pipe**. Slide your pipe vertically to open safe passage for the flock, survive reckless flyers, build combo streaks, and master dynamic day-to-night skies!

---

## 🎮 Gameplay & Mechanics

In **Reverse Flappy Bird**, incoming birds fly across your territory. Your mission is to align the pipe gap so they fly through without crashing into the rims.

### 🐦 Bird Types
| Bird | Traits |
| :--- | :--- |
| **Normal Bird** | Classic steady flaps and gentle bounces. |
| **Drunk Bird** | Sinusoidal wavy flight path with psychedelic trail. |
| **Fat Bird** | Heavy glide requiring maximum gap clearance. |
| **Rocket Bird** | Fast, high-speed darting flyer with rocket smoke trail and incoming siren alert. |
| **Ghost Bird** | Eerie phase-shifting transparency and floating trajectory. |
| **Golden Bird** | Rare shiny bonus flyer! Safely passing awards **+5 bonus points** and sparkle shower. |

### ⚡ Collectible Power-Ups
- **Wrench Kit**: Restores damaged pipe health (**+1 HP**).
- **Mega Gap**: Temporarily widens your pipe gap for ~8.3 seconds for emergency relief during intense bird waves.

### 🏅 Medal Awards
Just like the iconic arcade scoreboard:
- 🥉 **Bronze Medal**: Score 5+
- 🥈 **Silver Medal**: Score 15+
- 🥇 **Gold Medal**: Score 30+
- 💎 **Platinum Medal**: Score 50+

---

## ✨ Features

- **Zero External Dependencies**: Pure Vanilla JavaScript and HTML5 Canvas. No heavy frameworks, no bundlers required.
- **Procedural 8-bit Chiptune Soundtrack**: Music and sound effects are synthesized on-the-fly using the browser's native **Web Audio API** oscillators — zero external MP3/WAV files to load.
- **Seamless Infinite Parallax Scenery**: Mathematically continuous, sub-pixel tiled parallax scrolling across clouds, city skylines, bushes, and ground stripes.
- **Dynamic Time-of-Day Skies**: Smoothly progresses from bright morning daylight to warm golden sunset and starry midnight as your score advances.
- **Full Viewport Responsive**: Adapts fluidly to full browser window dimensions (`100vw × 100vh`) with native Fullscreen mode toggle (`⛶`).
- **Combo & Streak Multiplier**: Passing birds continuously increases your streak multiplier with dynamic audio pitch scaling and floating accolades (`NICE!`, `GREAT STREAK!`, `PIPE MASTER!`).
- **Career Stats Tracking**: Saves total birds rescued, high scores, peak combos, and golden birds via `localStorage`.

---

## 🕹️ Controls

| Action | Desktop (Mouse / Keyboard) | Mobile / Tablet |
| :--- | :--- | :--- |
| **Move Pipe Up / Down** | Move **Mouse Vertically** or press <kbd>W</kbd> / <kbd>S</kbd> / <kbd>▲</kbd> / <kbd>▼</kbd> | **Touch & Drag** anywhere on screen |
| **Start / Play Again** | Click **START GAME** or press <kbd>Space</kbd> | Tap button on screen |
| **Pause / Resume** | Press <kbd>P</kbd> or <kbd>ESC</kbd> or click top pause button | Tap top pause button |
| **Toggle Fullscreen** | Click top fullscreen button | Tap top fullscreen button |

---

## 🚀 Getting Started

### Option 1: Direct Browser Launch (No installation needed)
Simply clone the repository and open `index.html` in any modern web browser:
```bash
git clone https://github.com/your-username/reverse-flappy-bird.git
cd reverse-flappy-bird
open index.html # On macOS (or double-click index.html in Explorer / Finder)
```

### Option 2: Local Dev Server
```bash
npm run dev
# Launches a local server at http://localhost:3000
```

---

## 📂 Project Architecture

```
reverse-flappy-bird/
├── index.html                  # Semantic entrypoint with SVG vector icons
├── package.json                # Project metadata & convenience scripts
├── .gitignore                  # Git exclusions for OS and IDE artifacts
├── LICENSE                     # MIT License
├── css/
│   ├── main.css                # Viewport sizing, canvas display & color tokens
│   ├── ui.css                  # Retro arcade scoreboard, modals, buttons & HUD
│   └── retro.css               # CRT scanlines shader, vignette & responsive rules
└── js/
    ├── config.js               # Game constants, physics configs, difficulty curves
    ├── audio.js                # Web Audio retro SFX + Procedural Chiptune synthesizer
    ├── particles.js            # Feather bursts, star sparkles, rocket smoke & floating text
    ├── birds.js                # 6 Bird classes with dynamic facial reactions
    ├── pipe.js                 # Player Pipe mechanics, full ceiling/floor range & hitboxes
    ├── scenery.js              # Seamless infinite parallax day/sunset/night sky
    ├── powerups.js             # Canvas vector collectibles (Wrench & Mega Gap)
    ├── ui.js                   # HUD renderer, screens, medal awards & career stats
    └── game.js                 # Core game engine, loop, combo tracking & input orchestration
```

---

## 🛠️ Technology Stack

- **Graphics**: HTML5 `<canvas>` 2D Rendering Context
- **Language**: Vanilla JavaScript (ES6+ Clean Modular Object-Oriented Architecture)
- **Styling**: Vanilla CSS3 (Custom Properties, Flexbox, Grid, CRT Scanlines shader)
- **Audio**: Web Audio API (Synthesized square, triangle, sine, and noise oscillators)
- **Typography**: Google Fonts ("Press Start 2P")

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
