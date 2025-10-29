# 🎯 Physics Playground — Matter.js Projectile Motion Game

An interactive physics-based web game built with **Matter.js** and **HTML5 Canvas**.
Inspired by classic projectile motion challenges, this game lets players **drag, aim, and launch** projectiles to hit targets using real-world physics. Now featuring clean architecture, multiple control methods, and infinite procedurally generated levels!

---

## 🚀 Live Demo

👉 [Play on GitHub Pages](https://hisham-mhammed-afifi.github.io/Physics-Playground/)

---

## 🧩 Features

| Category                           | Description                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| ⚙️ **Physics Engine**              | Powered by [Matter.js](https://brm.io/matter-js/) with realistic gravity and collisions |
| 🖱️ **Multiple Control Methods**    | Mouse, touch, and full keyboard support with visual feedback                            |
| 🎯 **Projectile Trajectory**       | Real-time predicted path with physics simulation                                        |
| 🧱 **8+ Levels**                   | Hand-crafted levels plus infinite procedural generation                                 |
| 💥 **Advanced Particle System**    | Object pooling for performance with dynamic particle effects                            |
| ☁️ **Dynamic Backgrounds**         | Animated clouds, sky gradients, and parallax effects                                    |
| 🏆 **Score Tracking**              | Points per target + level bonuses with localStorage persistence                         |
| ♿ **Full Accessibility**          | ARIA labels, keyboard navigation, screen reader support                                 |
| 📱 **Responsive Design**           | Works seamlessly on desktop, tablet, and mobile                                         |
| 🎵 **Audio Manager**               | Singleton audio system with autoplay policy handling                                    |
| 🏗️ **Clean Architecture**         | Modular classes, SOLID principles, comprehensive documentation                          |
| ⚡ **Performance Optimized**       | Throttled updates, object pooling, efficient rendering                                  |

---

## 📂 Project Structure

```
physics-playground/
├── index.html              # Main HTML with accessibility features
├── styles.css              # External stylesheet with responsive design
├── config.js               # Centralized configuration constants
├── game.js                 # Main PhysicsPlayground game class
├── AudioManager.js         # Audio system with error handling
├── ParticleSystem.js       # Particle effects with object pooling
├── LevelManager.js         # Level loading and procedural generation
├── InputHandler.js         # Unified input handling (mouse/touch/keyboard)
├── levels.json             # Level definitions with procedural config
├── assets/
│   └── cloud.png          # Cloud decoration image
└── README.md              # This file
```

---

## 🧠 Architecture Highlights

### Clean Code Principles
- **Single Responsibility**: Each class has one clear purpose
- **Configuration Management**: All constants in `config.js`
- **Error Handling**: Try-catch blocks with fallback mechanisms
- **Event Cleanup**: Proper disposal of listeners and intervals
- **JSDoc Documentation**: Comprehensive function documentation

### Design Patterns
- **Singleton**: AudioManager instance
- **Object Pooling**: Particle system for performance
- **Strategy Pattern**: Multiple input handlers
- **Factory Pattern**: Procedural level generation
- **Observer Pattern**: Event-driven collision handling

---

## 🕹️ How to Play

### Controls

#### 🖱️ Mouse/Trackpad
1. **Aim**: Click and drag from the launcher
2. **Adjust Power**: Drag farther for more power
3. **Launch**: Release the mouse button

#### 📱 Touch (Mobile)
1. **Aim**: Touch and drag from the launcher
2. **Adjust Power**: Drag farther for more power
3. **Launch**: Release your finger

#### ⌨️ Keyboard
- **Arrow Up / W**: Increase launch angle
- **Arrow Down / S**: Decrease launch angle
- **Arrow Right / D**: Increase launch power
- **Arrow Left / A**: Decrease launch power
- **Space / Enter**: Launch projectile
- **P / Escape**: Pause/Resume game
- **R**: Reset game
- **M**: Toggle sound on/off

### Objective
Hit all targets on each level within the limited number of tries (equal to the number of targets).

### Scoring
- **+1 point** for each target hit
- **+3 points** for completing a level
- High scores are saved automatically

---

## ⚡ Setup Instructions

### Quick Start
```bash
# Clone the repository
git clone https://github.com/hisham-mhammed-afifi/Physics-Playground.git
cd physics-playground

# Open in browser (or use a local server)
open index.html
```

### Development Setup
For development, use a local server to avoid CORS issues:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

### Requirements
- Modern web browser with HTML5 Canvas support
- ES6+ JavaScript support
- Web Audio API (optional, for sound)

---

## 🎨 Customization

### Modify Game Settings
Edit `config.js` to customize:

```javascript
// Increase projectile speed
CONFIG.LAUNCHER.VELOCITY_SCALE = 0.3;

// More explosion particles
CONFIG.PARTICLES.COUNT_PER_EXPLOSION = 30;

// Allow more powerful shots
CONFIG.AIMING.MAX_POWER = 120;

// Adjust difficulty
CONFIG.DIFFICULTY.EASY.velocityScale = 0.35;
```

### Create Custom Levels
Add new levels to `levels.json`:

```json
{
  "id": 9,
  "name": "My Custom Level",
  "targets": [
    { "x": 600, "y": 500 },
    { "x": 700, "y": 400 }
  ],
  "obstacles": [
    {
      "x": 500,
      "y": 450,
      "width": 120,
      "height": 20,
      "angle": 0.5
    }
  ]
}
```

### Configure Procedural Generation
Modify procedural settings in `levels.json`:

```json
{
  "proceduralGeneration": {
    "enabled": true,
    "startAfterLevel": 8,
    "targetCount": { "min": 3, "max": 6 },
    "obstacleCount": { "min": 2, "max": 5 }
  }
}
```

---

## 🧮 Technical Implementation

### Core Technologies
- **Physics**: Matter.js engine with custom configuration
- **Rendering**: HTML5 Canvas with optimized drawing
- **Audio**: Web Audio API with singleton manager
- **Storage**: localStorage for high score persistence
- **Architecture**: ES6 classes with clean separation of concerns

### Performance Optimizations
- Object pooling for particle system
- Throttled path prediction updates (60 FPS)
- Efficient collision detection
- Proper event listener cleanup
- Minimal DOM manipulation

### Error Handling
- Graceful fallback for missing assets
- localStorage error handling
- Audio context initialization handling
- Level data validation
- CDN failure detection

---

## ♿ Accessibility Features

- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard control support
- **Screen Reader Support**: Status updates announced via `aria-live`
- **Focus Indicators**: Clear visual focus states
- **Color Contrast**: High contrast mode support
- **Reduced Motion**: Respects `prefers-reduced-motion` preference
- **Semantic HTML**: Proper use of semantic elements

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Mobile Safari | iOS 14+ | ✅ Fully Supported |
| Chrome Mobile | Latest | ✅ Fully Supported |

---

## 📚 Code Quality

### Best Practices
- ✅ Strict mode enabled
- ✅ No global scope pollution
- ✅ Proper use of `const` and `let`
- ✅ JSDoc documentation
- ✅ Descriptive variable names
- ✅ Single responsibility principle
- ✅ DRY (Don't Repeat Yourself)
- ✅ SOLID design principles

### Security
- ✅ SRI (Subresource Integrity) for CDN
- ✅ Input validation
- ✅ Safe localStorage access
- ✅ No `eval()` or unsafe code

---

## 🚀 Future Enhancements

- [ ] Power-ups and special projectiles
- [ ] Multiplayer mode
- [ ] Visual level editor
- [ ] Achievement system
- [ ] Custom themes
- [ ] Game progress saving
- [ ] Replay system
- [ ] Online leaderboards
- [ ] More sound effects and music
- [ ] Tutorial system

---

## 🧱 Built With

- [Matter.js](https://brm.io/matter-js/) — Physics Engine
- **HTML5 Canvas** — Rendering
- **JavaScript ES6+** — Game Logic
- **Web Audio API** — Sound Effects
- **CSS3** — Styling & Animations
- **localStorage API** — Data Persistence

---

## 📖 Changelog

### Version 2.0.0 (Current) - Major Refactor
- ✨ Complete architectural refactor with clean code principles
- ✨ Added keyboard controls (Arrow keys + WASD)
- ✨ Enhanced touch support for mobile devices
- ✨ Procedural level generation for infinite gameplay
- ✨ Full accessibility support (ARIA, keyboard navigation)
- ✨ AudioManager with proper context handling
- ✨ ParticleSystem with object pooling
- ✨ LevelManager with JSON loading
- ✨ InputHandler for unified input management
- ✨ Comprehensive error handling
- ✨ Performance optimizations
- ✨ External CSS and modular JavaScript
- ✨ JSDoc documentation
- ✨ 8 hand-crafted levels
- 📚 Complete documentation

### Version 1.0.0 - Initial Release
- ⚡ Basic gameplay with Matter.js
- ⚡ 3 levels
- ⚡ Mouse-only controls
- ⚡ Basic particle effects

---

## 🧑‍💻 Author

**Hesham Afifi**
Senior Frontend Developer | Angular & Game Dev Enthusiast
🌐 [LinkedIn](https://www.linkedin.com/in/hisham-abd-elshafouk/) • [GitHub](https://github.com/hisham-mhammed-afifi)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests for:
- 🐛 Bug fixes
- ✨ New features
- 🎮 Level designs
- 📚 Documentation improvements
- ⚡ Performance optimizations
- ♿ Accessibility enhancements

---

## 🏁 License

This project is released under the [MIT License](LICENSE).

---

## 🌟 If you like this project

Give it a ⭐ on GitHub and share it with others learning **Matter.js**, **Canvas Game Development**, or **Clean Code Architecture**!

---

**Enjoy playing Physics Playground!** 🎮
