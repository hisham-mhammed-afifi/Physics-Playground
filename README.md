# 🎯 Physics Playground (Matter.js)

An interactive **projectile motion game** inspired by _Angry Birds_, built with **HTML5 Canvas** and **Matter.js**.  
Players adjust the **angle** and **power** to launch a ball toward static targets.  
Includes realistic physics, obstacles, scoring, and high-score persistence.

---

## 🧠 Concept

This project demonstrates:

- Physics simulation with [Matter.js](https://brm.io/matter-js/)
- Canvas-based rendering & animation
- User interaction via sliders and touch gestures
- Projectile motion with gravity
- Collision detection & scoring system
- Clean and maintainable vanilla JavaScript structure

---

## 🚀 Live Demo

> [🔗 (Add your GitHub Pages / Netlify / Vercel link here)](https://example.com)

---

## 🧩 Features Implemented

| Category                     | Feature                                                                   | Points |
| ---------------------------- | ------------------------------------------------------------------------- | ------ |
| **Core Requirements**        | Launch mechanism (angle + power), 3 static targets, scoring, hit feedback | ✅ 1   |
| **Trajectory Visualization** | Predicted dotted path before launch                                       | ✅ 1   |
| **Advanced Feature**         | Static obstacles/barriers                                                 | ✅ 2   |
| **Code Quality & Polish**    | Clean single-file structure, 60fps rendering, simple UI                   | ✅ 1   |
| **Bonus Features**           | High-score persistence (`localStorage`), Mobile touch controls            | ✅ +1  |

**Total Attempted:** 6 / 5 points

---

## 🎮 Controls

### Desktop

- **Angle slider:** Adjust launch angle (10°–80°)
- **Power slider:** Adjust launch power (10–100)
- **Launch button:** Fire projectile
- **Reset button:** Restart level

### Mobile / Touch

- **Drag back** from launcher to aim
- **Longer drag = more power**
- **Release** to launch

---

## 🧱 Gameplay Elements

| Element            | Description                                 |
| ------------------ | ------------------------------------------- |
| **Projectile**     | Ball launched from left bottom corner       |
| **Targets**        | 3 static circles to hit for points          |
| **Obstacles**      | 2 fixed barriers blocking direct shots      |
| **Ground & Walls** | Static boundaries preventing escape         |
| **Scoring**        | +1 per target destroyed                     |
| **High Score**     | Saved locally in browser via `localStorage` |

---

## 🛠️ Technologies Used

- **HTML5 Canvas** for rendering
- **Matter.js** for physics and collisions
- **Vanilla JavaScript (ES6)** for logic and UI
- **localStorage API** for persistent high score

---

## ⚙️ Setup & Run

1. Clone or download the repository

   ```bash
   git clone https://github.com/yourusername/physics-playground.git
   cd physics-playground
   ```

2. Open `index.html` directly in any browser
   _(no build or server needed)_

   Optional: serve locally

   ```bash
   npx serve .
   ```

---

## 🧑‍💻 Author

**Hesham Afifi**
Frontend Developer | Game Physics Enthusiast
[GitHub Profile](https://github.com/yourusername)

---

## 🪄 License

MIT License © 2025 Hesham Afifi
