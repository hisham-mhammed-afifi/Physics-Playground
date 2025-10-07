# 🎯 Physics Playground — Matter.js Projectile Motion Game

An interactive physics-based web game built with **Matter.js** and **HTML5 Canvas**.  
Inspired by classic projectile motion challenges, this demo lets players **drag, aim, and launch** a ball to hit multiple targets using real-world physics.

---

## 🚀 Live Demo

👉 [Play on GitHub Pages](https://hisham-mhammed-afifi.github.io/Physics-Playground/)

---

## 🧩 Features

| Category                      | Description                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| ⚙️ **Physics Engine**         | Powered by [Matter.js](https://brm.io/matter-js/) with realistic gravity and collisions |
| 🖱️ **Intuitive Controls**     | Click and drag to set **angle and power** visually                                      |
| 🎯 **Projectile Trajectory**  | Predicted path before launch + dynamic path simulation                                  |
| 🧱 **Levels & Obstacles**     | Three levels with unique obstacles and target layouts                                   |
| 💥 **Feedback & FX**          | Particle explosions and sound effects for hits and level clears                         |
| ☁️ **Dynamic Backgrounds**    | Animated clouds, sky gradients, and parallax effects                                    |
| 🏆 **Scoring & High Score**   | Automatic scoring and persistence using `localStorage`                                  |
| 🔁 **Limited Tries**          | Launch attempts per level equal to (targets - 1)                                        |
| 🕹️ **Auto Level Progression** | Win transitions and “You Win” finale screen                                             |
| 💻 **Responsive Canvas**      | Scales smoothly on most screen sizes                                                    |

---

## 📂 Project Structure

```

physics-playground/
│
├── index.html          # Main single-file Matter.js game
├── assets/
│   └── cloud.png       # Cloud image for parallax background
└── README.md

```

---

## 🧠 Core Concepts Demonstrated

- Canvas drawing, layers, and animation loops (`requestAnimationFrame`)
- Realistic projectile motion with gravity
- Collision detection (targets and obstacles)
- Parabolic motion & trajectory prediction
- Sound generation using Web Audio API
- Procedural particle effects
- Clean, modular JS game architecture
- Local persistence via `localStorage`

---

## 🕹️ How to Play

1. **Drag** anywhere on the screen to set **angle and power**.
2. **Release** to launch the projectile.
3. Try to **hit all targets** before you run out of launches.
4. Advance through all levels to **win the game!**

---

## ⚡ Setup Instructions

### Option 1: Run Locally

```bash
# Clone the repo
git clone https://github.com/hisham-mhammed-afifi/Physics-Playground.git
cd physics-playground

# Open in browser
open index.html
```

### Option 2: Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages → Deploy from Branch → main branch**.
3. Wait a minute, then open your live link.

---

## 🧮 Technical Highlights

- Uses **Matter.Engine** for physics simulation
- **requestAnimationFrame** loop for 60fps rendering
- Smooth power scaling curve for intuitive control
- **Sound FX** generated dynamically (no external assets)
- Fully encapsulated in **one HTML + JS file** (for learning clarity)

---

## 🧱 Built With

- [Matter.js](https://brm.io/matter-js/) — Physics Engine
- **HTML5 Canvas** — Rendering
- **JavaScript (ES6)** — Game Logic
- **Web Audio API** — Sound Effects

---

## 🧑‍💻 Author

**Hesham Afifi**
Senior Frontend Developer | Angular & Game Dev Enthusiast
🌐 [LinkedIn](https://www.linkedin.com/in/hisham-abd-elshafouk/) • [GitHub](https://github.com/hisham-mhammed-afifi)

---

## 🏁 License

This project is released under the [MIT License](LICENSE).

---

### 🌟 If you like this project

Give it a ⭐ on GitHub and share it with others learning **Matter.js** or **Canvas Game Development**!

---
