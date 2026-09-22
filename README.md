<h1 align="center">2048</h1>

<p align="center">
  <img src="https://harshgupta59.github.io/2048-Game/favicon.ico" alt="2048 Logo" width="100"/>
</p>

<p align="center">
  <strong>A modern, responsive, and completely vanilla JavaScript clone of the legendary 2048 puzzle game.</strong>
</p>

<p align="center">
  <a href="https://harshgupta59.github.io/2048-Game/"><strong>🎮 Play it Live Here!</strong></a>
</p>

---

## 🌟 Overview

Welcome to **2048**! This is a web-based implementation of the classic tile-sliding puzzle game originally created by Gabriele Cirulli. We've taken the classic game and elevated it by building it entirely from scratch using **Vanilla HTML, CSS, and JavaScript**—no frameworks, no external libraries, just pure code.

The game is designed with a sleek, minimalist UI, perfectly mimicking the original aesthetic while adding our own unique twists.

## ✨ Features

- **Classic Mode:** The traditional 2048 experience. Swipe to merge matching tiles, add them up, and try to reach the elusive 2048 tile!
- **Time Attack Mode ⏱️:** A brand new, high-stakes game mode! You have a global progress bar ticking down. If you don't make a move within 2 seconds, the game automatically spawns a new tile, filling up your board! Panic, think fast, and merge quickly!
- **Persistent High Score:** Your BEST score is securely saved in your browser's local storage. Even if you close the tab, your highest achievement will be waiting for you when you return.
- **Flawless Animations:** Smooth, buttery 60fps CSS transitions when tiles slide and merge.
- **Fully Responsive:** Beautifully adapts to any screen size. Whether you're on a massive desktop monitor or a tiny smartphone screen, the grid resizes flawlessly using dynamic CSS Grid and `calc()`.
- **Mobile Touch Support:** Includes native swipe detection for iOS and Android devices.

## 🕹️ How to Play

1. **Move:** Use your **Arrow Keys** (Up, Down, Left, Right) or **W A S D** keys to slide all tiles on the board. On mobile? Just **Swipe** the screen!
2. **Merge:** When two tiles with the exact same number touch, they merge into a single tile with double the value! (e.g., `2` + `2` = `4`).
3. **Spawn:** Every time you move, a new tile (either a `2` or a `4`) spawns in a random empty spot. (Fun fact: It has a 90% chance to be a 2, and a 10% chance to be a 4!).
4. **Win:** Combine tiles until you create a tile with the value **2048**!
5. **Lose:** If the board fills up and no more adjacent merges are possible, the game is over.

## 🛠️ Tech Stack

This game is a masterclass in frontend fundamentals:
- **HTML5:** Semantic architecture for layout and accessibility.
- **CSS3:** Heavy use of CSS Variables (Custom Properties), CSS Grid, Flexbox, and hardware-accelerated animations (`transform`, `transition`).
- **JavaScript (ES6):** Object-oriented state management utilizing a `Tile` class, completely decoupled logic from the DOM, and dynamic Event Listeners for both keyboard and touch events.

## 🚀 Run Locally

Want to tinker with the code yourself? It's as easy as it gets:

```bash
# Clone the repository
git clone https://github.com/harshgupta59/2048-Game.git

# Navigate into the folder
cd 2048-Game

# Start a local server (if you have Python installed)
python3 -m http.server 8083
```
Then, simply open `http://localhost:8083` in your browser!

---
*Built with ❤️ for the love of the puzzle.*
