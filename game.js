/**
 * Main Game Class - Physics Playground
 * Handles game initialization, state management, rendering, and user input
 */

'use strict';

class PhysicsPlayground {
  /**
   * Creates a PhysicsPlayground game instance
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Matter.js physics engine
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.runner = Matter.Runner.create();

    // Game managers
    this.levelManager = new LevelManager();
    this.particleSystem = new ParticleSystem();

    // Game state
    this.level = CONFIG.GAME.STARTING_LEVEL;
    this.score = CONFIG.GAME.STARTING_SCORE;
    this.highScore = this.loadHighScore();
    this.triesLeft = 0;
    this.gameState = 'loading'; // loading, playing, paused, levelComplete, gameOver

    // Physics bodies
    this.ground = null;
    this.walls = [];
    this.targets = [];
    this.obstacles = [];
    this.projectile = null;

    // Launcher state
    this.launcherPos = { x: CONFIG.LAUNCHER.X, y: CONFIG.LAUNCHER.Y };
    this.launched = false;
    this.projectileMonitorInterval = null;

    // Aiming state
    this.isDragging = false;
    this.dragAngle = CONFIG.AIMING.DEFAULT_ANGLE;
    this.dragPower = CONFIG.AIMING.DEFAULT_POWER;
    this.predictedPath = [];

    // Visual effects
    this.clouds = [];
    this.cloudImage = new Image();
    this.cloudImage.onerror = () => {
      console.warn('Failed to load cloud image');
    };

    // UI elements
    this.elements = {
      levelDisplay: document.getElementById('levelDisplay'),
      scoreDisplay: document.getElementById('scoreDisplay'),
      triesDisplay: document.getElementById('triesDisplay'),
      highScoreDisplay: document.getElementById('highScoreDisplay'),
      overlay: document.getElementById('overlay'),
      resetBtn: document.getElementById('resetBtn'),
      soundToggleBtn: document.getElementById('soundToggleBtn'),
    };

    // Input handling
    this.inputHandler = null;

    // Animation frame ID
    this.animationFrameId = null;

    // Throttle function for performance
    this.lastPathUpdate = 0;
  }

  /**
   * Initializes the game
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      // Load levels
      this.showOverlay('Loading levels...', false);
      await this.levelManager.loadLevels();

      // Initialize audio on first user interaction
      audioManager.initialize();

      // Load cloud image
      this.cloudImage.src = CONFIG.ASSETS.CLOUD_IMAGE;

      // Create world boundaries
      this.createWorldBoundaries();

      // Initialize clouds
      this.initClouds();

      // Setup input handlers
      this.setupInputHandlers();

      // Start physics engine
      Matter.Runner.run(this.runner, this.engine);

      // Setup collision detection
      this.setupCollisionHandling();

      // Build first level
      this.buildLevel(this.level);

      // Update UI
      this.updateScoreDisplay();

      // Start game loop
      this.gameState = 'playing';
      this.hideOverlay();
      this.draw();

    } catch (error) {
      console.error('Failed to initialize game:', error);
      this.showOverlay(`Error: ${error.message}<br><small>Please refresh the page</small>`, true);
    }
  }

  /**
   * Creates world boundaries (ground and walls)
   */
  createWorldBoundaries() {
    this.ground = Matter.Bodies.rectangle(
      CONFIG.CANVAS.WIDTH / 2,
      CONFIG.WORLD.GROUND_Y,
      CONFIG.WORLD.GROUND_WIDTH,
      CONFIG.WORLD.GROUND_HEIGHT,
      { isStatic: true, label: 'ground' }
    );

    this.walls = [
      Matter.Bodies.rectangle(
        0,
        CONFIG.WORLD.WALL_Y,
        CONFIG.WORLD.WALL_WIDTH,
        CONFIG.WORLD.WALL_HEIGHT,
        { isStatic: true, label: 'wall' }
      ),
      Matter.Bodies.rectangle(
        CONFIG.CANVAS.WIDTH,
        CONFIG.WORLD.WALL_Y,
        CONFIG.WORLD.WALL_WIDTH,
        CONFIG.WORLD.WALL_HEIGHT,
        { isStatic: true, label: 'wall' }
      ),
    ];

    Matter.Composite.add(this.world, [this.ground, ...this.walls]);
  }

  /**
   * Builds a level from level data
   * @param {number} levelNumber - Level number to build
   */
  buildLevel(levelNumber) {
    // Clear existing level
    Matter.Composite.clear(this.world, false);
    Matter.Composite.add(this.world, [this.ground, ...this.walls]);

    this.targets = [];
    this.obstacles = [];
    this.projectile = null;
    this.launched = false;

    // Clear particles
    this.particleSystem.clear();

    // Get level data
    const levelData = this.levelManager.getLevel(levelNumber);

    if (!levelData || !this.levelManager.validateLevel(levelData)) {
      console.error('Invalid level data for level', levelNumber);
      this.showOverlay('Error loading level', true);
      return;
    }

    // Create targets
    levelData.targets.forEach(targetData => {
      const target = Matter.Bodies.circle(
        targetData.x,
        targetData.y,
        CONFIG.TARGET.RADIUS,
        { isStatic: true, label: CONFIG.TARGET.LABEL }
      );
      this.targets.push(target);
    });

    // Create obstacles
    levelData.obstacles.forEach(obstacleData => {
      const obstacle = Matter.Bodies.rectangle(
        obstacleData.x,
        obstacleData.y,
        obstacleData.width,
        obstacleData.height,
        {
          isStatic: true,
          angle: obstacleData.angle,
          label: CONFIG.OBSTACLE.LABEL,
        }
      );
      this.obstacles.push(obstacle);
    });

    // Add bodies to world
    Matter.Composite.add(this.world, [...this.targets, ...this.obstacles]);

    // Set tries
    this.triesLeft = this.targets.length;

    // Update UI
    this.updateLevelDisplay();
    this.updateTriesDisplay();

    // Update predicted path
    this.updatePredictedPath();
  }

  /**
   * Initializes cloud decorations
   */
  initClouds() {
    this.clouds = [];
    for (let i = 0; i < CONFIG.CLOUDS.COUNT; i++) {
      this.clouds.push({
        x: Math.random() * CONFIG.CANVAS.WIDTH,
        y: Math.random() * CONFIG.CLOUDS.MAX_Y,
        size: CONFIG.CLOUDS.MIN_SIZE + Math.random() * (CONFIG.CLOUDS.MAX_SIZE - CONFIG.CLOUDS.MIN_SIZE),
        speed: CONFIG.CLOUDS.MIN_SPEED + Math.random() * (CONFIG.CLOUDS.MAX_SPEED - CONFIG.CLOUDS.MIN_SPEED),
        layer: i < CONFIG.CLOUDS.COUNT / 2 ? 1 : 2,
      });
    }
  }

  /**
   * Computes predicted projectile path
   * @param {number} angleDegrees - Launch angle in degrees
   * @param {number} power - Launch power
   * @returns {Array<{x: number, y: number}>} Array of path points
   */
  computePredictedPath(angleDegrees, power) {
    // Create temporary physics simulation
    const tempEngine = Matter.Engine.create();
    tempEngine.gravity.y = this.engine.gravity.y;

    const tempBall = Matter.Bodies.circle(
      this.launcherPos.x,
      this.launcherPos.y,
      CONFIG.PROJECTILE.RADIUS,
      {
        restitution: CONFIG.PROJECTILE.RESTITUTION,
        frictionAir: CONFIG.PROJECTILE.FRICTION_AIR,
      }
    );

    Matter.Composite.add(tempEngine.world, tempBall);

    // Calculate velocity
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const velocity = power * CONFIG.LAUNCHER.VELOCITY_SCALE;

    Matter.Body.setVelocity(tempBall, {
      x: velocity * Math.cos(angleRadians),
      y: -velocity * Math.sin(angleRadians),
    });

    // Simulate and collect points
    const points = [];
    for (let i = 0; i < CONFIG.PREDICTION.SIMULATION_STEPS; i++) {
      Matter.Engine.update(tempEngine, CONFIG.PREDICTION.DELTA_TIME);
      points.push({ x: tempBall.position.x, y: tempBall.position.y });

      // Stop if ball goes off screen
      if (tempBall.position.y > CONFIG.PREDICTION.MAX_Y ||
          tempBall.position.x > CONFIG.PREDICTION.MAX_X) {
        break;
      }
    }

    return points;
  }

  /**
   * Updates the predicted path based on current aim
   * @param {number} angleDegrees - Launch angle in degrees
   * @param {number} power - Launch power
   */
  updatePredictedPath(
    angleDegrees = CONFIG.AIMING.DEFAULT_ANGLE,
    power = CONFIG.AIMING.DEFAULT_POWER
  ) {
    // Throttle path updates for performance
    const now = Date.now();
    if (now - this.lastPathUpdate < CONFIG.TIMING.THROTTLE_DELAY) {
      return;
    }
    this.lastPathUpdate = now;

    this.predictedPath = this.computePredictedPath(angleDegrees, power);
  }

  /**
   * Launches a projectile
   * @param {number} angleDegrees - Launch angle in degrees
   * @param {number} power - Launch power
   */
  launch(angleDegrees, power) {
    if (this.launched || this.triesLeft <= 0 || this.gameState !== 'playing') {
      return;
    }

    this.launched = true;
    this.triesLeft--;
    this.updateTriesDisplay();

    // Create projectile
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const velocity = power * CONFIG.LAUNCHER.VELOCITY_SCALE;

    this.projectile = Matter.Bodies.circle(
      this.launcherPos.x,
      this.launcherPos.y,
      CONFIG.PROJECTILE.RADIUS,
      {
        restitution: CONFIG.PROJECTILE.RESTITUTION,
        frictionAir: CONFIG.PROJECTILE.FRICTION_AIR,
        label: 'projectile',
      }
    );

    Matter.Composite.add(this.world, this.projectile);
    Matter.Body.setVelocity(this.projectile, {
      x: velocity * Math.cos(angleRadians),
      y: -velocity * Math.sin(angleRadians),
    });

    // Clear predicted path
    this.predictedPath = [];

    // Play sound
    audioManager.playSoundEffect('launch');

    // Start monitoring projectile
    this.monitorProjectile();
  }

  /**
   * Monitors projectile movement and stops when it settles
   */
  monitorProjectile() {
    this.projectileMonitorInterval = setInterval(() => {
      if (!this.projectile) {
        clearInterval(this.projectileMonitorInterval);
        return;
      }

      const velocity = this.projectile.velocity;
      const speed = Math.hypot(velocity.x, velocity.y);

      // Check if projectile has stopped or gone off screen
      if (speed < CONFIG.PROJECTILE.MIN_VELOCITY_THRESHOLD ||
          this.projectile.position.y > CONFIG.PROJECTILE.STOP_Y_POSITION) {
        Matter.Composite.remove(this.world, this.projectile);
        this.projectile = null;
        this.launched = false;
        clearInterval(this.projectileMonitorInterval);
        this.checkEndConditions();
      }
    }, CONFIG.TIMING.PROJECTILE_CHECK_INTERVAL);
  }

  /**
   * Checks if level is complete or game over
   */
  checkEndConditions() {
    const remainingTargets = this.getTargetsRemaining();

    if (remainingTargets.length === 0) {
      // Level complete
      if (this.level < this.levelManager.getLevelCount() || this.levelManager.proceduralConfig?.enabled) {
        this.handleLevelComplete();
      } else {
        this.handleGameWin();
      }
      return;
    }

    if (this.triesLeft <= 0) {
      // Out of tries
      this.handleLevelFailed();
    }
  }

  /**
   * Gets remaining target bodies
   * @returns {Array} Array of target bodies
   */
  getTargetsRemaining() {
    return Matter.Composite.allBodies(this.world).filter(
      body => body.label === CONFIG.TARGET.LABEL
    );
  }

  /**
   * Handles level completion
   */
  handleLevelComplete() {
    this.gameState = 'levelComplete';
    this.score += CONFIG.SCORING.POINTS_PER_LEVEL;

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }

    this.updateScoreDisplay();
    audioManager.playSoundEffect('level_complete');

    this.showOverlay(
      `Level ${this.level} Complete!<br><small>Next level loading...</small>`,
      true
    );

    setTimeout(() => {
      this.level++;
      this.buildLevel(this.level);
      this.gameState = 'playing';
      this.hideOverlay();
    }, CONFIG.TIMING.LEVEL_TRANSITION_DELAY);
  }

  /**
   * Handles game win (all levels complete)
   */
  handleGameWin() {
    this.gameState = 'gameWon';
    audioManager.playSoundEffect('win');

    this.showOverlay(
      `You Win!<br>Final Score: ${this.score}<br><small>Restarting...</small>`,
      true
    );

    setTimeout(() => {
      this.resetGame();
    }, CONFIG.TIMING.WIN_SCREEN_DELAY);
  }

  /**
   * Handles level failure
   */
  handleLevelFailed() {
    this.gameState = 'levelFailed';
    this.showOverlay(
      'Out of tries!<br><small>Restarting level...</small>',
      true
    );

    setTimeout(() => {
      this.buildLevel(this.level);
      this.gameState = 'playing';
      this.hideOverlay();
    }, CONFIG.TIMING.LEVEL_TRANSITION_DELAY);
  }

  /**
   * Resets the game to initial state
   */
  resetGame() {
    this.level = CONFIG.GAME.STARTING_LEVEL;
    this.score = CONFIG.GAME.STARTING_SCORE;
    this.buildLevel(this.level);
    this.updateScoreDisplay();
    this.gameState = 'playing';
    this.hideOverlay();
  }

  /**
   * Handles collision events
   * @param {Matter.Event} event - Collision event
   */
  handleCollision(event) {
    event.pairs.forEach(pair => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      // Check for projectile hitting target
      if (
        (bodyA.label === 'projectile' && bodyB.label === CONFIG.TARGET.LABEL) ||
        (bodyB.label === 'projectile' && bodyA.label === CONFIG.TARGET.LABEL)
      ) {
        const target = bodyA.label === CONFIG.TARGET.LABEL ? bodyA : bodyB;

        // Create explosion effect
        this.particleSystem.createExplosion(
          target.position.x,
          target.position.y,
          CONFIG.COLORS.EXPLOSION
        );

        // Play sound
        audioManager.playSoundEffect('hit');

        // Remove target
        Matter.Composite.remove(this.world, target);

        // Update score
        this.score += CONFIG.SCORING.POINTS_PER_TARGET;
        this.updateScoreDisplay();
      }
    });
  }

  /**
   * Sets up collision event handling
   */
  setupCollisionHandling() {
    Matter.Events.on(this.engine, 'collisionStart', event => {
      this.handleCollision(event);
    });
  }

  /**
   * Sets up input handlers (mouse, touch, keyboard)
   */
  setupInputHandlers() {
    this.inputHandler = new InputHandler(this);
  }

  /**
   * Draws the background with gradient and clouds
   */
  drawBackground() {
    const colorTheme = CONFIG.COLORS.BACKGROUND_THEMES[(this.level - 1) % CONFIG.COLORS.BACKGROUND_THEMES.length];

    // Draw gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, colorTheme.sky);
    gradient.addColorStop(1, colorTheme.ground);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw and update clouds
    this.clouds.forEach(cloud => {
      if (this.cloudImage.complete && this.cloudImage.naturalWidth > 0) {
        this.ctx.save();
        this.ctx.globalAlpha = cloud.layer === 1 ? CONFIG.CLOUDS.LAYER_1_OPACITY : CONFIG.CLOUDS.LAYER_2_OPACITY;
        this.ctx.drawImage(
          this.cloudImage,
          cloud.x,
          cloud.y,
          cloud.size * 2,
          cloud.size
        );
        this.ctx.restore();
      }

      // Update cloud position
      cloud.x += cloud.speed / (cloud.layer === 1 ? 1 : 2);
      if (cloud.x > CONFIG.CLOUDS.OFF_SCREEN_X) {
        cloud.x = CONFIG.CLOUDS.RESET_X;
      }
    });
  }

  /**
   * Draws the predicted path
   */
  drawPredictedPath() {
    if (this.predictedPath.length === 0) {
      return;
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.predictedPath.forEach((point, index) => {
      if (index === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.ctx.strokeStyle = CONFIG.COLORS.PREDICTION_PATH;
    this.ctx.setLineDash(CONFIG.PREDICTION.DASH_PATTERN);
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Draws the launcher
   */
  drawLauncher() {
    this.ctx.fillStyle = CONFIG.COLORS.LAUNCHER;
    this.ctx.fillRect(
      this.launcherPos.x - CONFIG.LAUNCHER.SIZE / 2,
      this.launcherPos.y,
      CONFIG.LAUNCHER.SIZE,
      CONFIG.LAUNCHER.SIZE
    );
  }

  /**
   * Draws the aim indicator when dragging
   */
  drawAimIndicator() {
    if (!this.isDragging) {
      return;
    }

    const angleRadians = (this.dragAngle * Math.PI) / 180;
    const lineLength = this.dragPower * CONFIG.AIMING.AIM_LINE_LENGTH_MULTIPLIER;

    this.ctx.save();

    // Draw aim line
    this.ctx.beginPath();
    this.ctx.moveTo(this.launcherPos.x, this.launcherPos.y);
    this.ctx.lineTo(
      this.launcherPos.x + Math.cos(angleRadians) * lineLength,
      this.launcherPos.y - Math.sin(angleRadians) * lineLength
    );
    this.ctx.strokeStyle = CONFIG.COLORS.AIM_LINE;
    this.ctx.lineWidth = CONFIG.RENDERING.AIM_LINE_WIDTH;
    this.ctx.stroke();

    // Draw power indicator circle
    this.ctx.beginPath();
    this.ctx.arc(
      this.launcherPos.x,
      this.launcherPos.y,
      this.dragPower / CONFIG.AIMING.AIM_CIRCLE_RADIUS_DIVISOR,
      0,
      Math.PI * 2
    );
    this.ctx.strokeStyle = CONFIG.COLORS.AIM_CIRCLE;
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Draws all physics bodies
   */
  drawBodies() {
    const bodies = Matter.Composite.allBodies(this.world);

    this.ctx.save();
    this.ctx.strokeStyle = CONFIG.COLORS.BODIES_STROKE;
    this.ctx.beginPath();

    bodies.forEach(body => {
      const vertices = body.vertices;
      this.ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let j = 1; j < vertices.length; j++) {
        this.ctx.lineTo(vertices[j].x, vertices[j].y);
      }
      this.ctx.lineTo(vertices[0].x, vertices[0].y);
    });

    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Draws the projectile
   */
  drawProjectile() {
    if (!this.projectile) {
      return;
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(
      this.projectile.position.x,
      this.projectile.position.y,
      CONFIG.PROJECTILE.RADIUS,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = CONFIG.COLORS.PROJECTILE;
    this.ctx.fill();
    this.ctx.restore();
  }

  /**
   * Main draw loop
   */
  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.drawBackground();

    // Draw predicted path (only when not launched and not dragging)
    if (!this.launched && !this.isDragging && this.gameState === 'playing') {
      this.drawPredictedPath();
    }

    // Draw launcher
    this.drawLauncher();

    // Draw aim indicator
    this.drawAimIndicator();

    // Draw physics bodies
    this.drawBodies();

    // Draw projectile
    this.drawProjectile();

    // Update and draw particles
    this.particleSystem.update();
    this.particleSystem.draw(this.ctx);

    // Continue animation loop
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  /**
   * Updates the level display
   */
  updateLevelDisplay() {
    if (this.elements.levelDisplay) {
      this.elements.levelDisplay.textContent = `Level: ${this.level}`;
    }
  }

  /**
   * Updates the score displays
   */
  updateScoreDisplay() {
    if (this.elements.scoreDisplay) {
      this.elements.scoreDisplay.textContent = `Score: ${this.score}`;
    }
    if (this.elements.highScoreDisplay) {
      this.elements.highScoreDisplay.textContent = `High Score: ${this.highScore}`;
    }
  }

  /**
   * Updates the tries display
   */
  updateTriesDisplay() {
    if (this.elements.triesDisplay) {
      this.elements.triesDisplay.textContent = `Tries Left: ${this.triesLeft}`;
    }
  }

  /**
   * Shows the overlay with a message
   * @param {string} message - HTML message to display
   * @param {boolean} autoHide - Whether to auto-hide
   */
  showOverlay(message, autoHide = false) {
    if (this.elements.overlay) {
      this.elements.overlay.innerHTML = message;
      this.elements.overlay.style.display = 'block';
    }
  }

  /**
   * Hides the overlay
   */
  hideOverlay() {
    if (this.elements.overlay) {
      this.elements.overlay.style.display = 'none';
    }
  }

  /**
   * Loads high score from localStorage
   * @returns {number} High score
   */
  loadHighScore() {
    try {
      const stored = localStorage.getItem(CONFIG.SCORING.HIGH_SCORE_KEY);
      return parseInt(stored, 10) || 0;
    } catch (error) {
      console.warn('Failed to load high score:', error);
      return 0;
    }
  }

  /**
   * Saves high score to localStorage
   */
  saveHighScore() {
    try {
      localStorage.setItem(CONFIG.SCORING.HIGH_SCORE_KEY, this.highScore.toString());
    } catch (error) {
      console.warn('Failed to save high score:', error);
    }
  }

  /**
   * Toggles sound on/off
   */
  toggleSound() {
    const enabled = audioManager.toggle();
    if (this.elements.soundToggleBtn) {
      this.elements.soundToggleBtn.textContent = enabled ? 'Sound: On' : 'Sound: Off';
    }
  }

  /**
   * Pauses the game
   */
  pause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
      Matter.Runner.stop(this.runner);
      this.showOverlay('Paused<br><small>Press ESC or P to resume</small>', true);
    }
  }

  /**
   * Resumes the game
   */
  resume() {
    if (this.gameState === 'paused') {
      this.gameState = 'playing';
      Matter.Runner.run(this.runner, this.engine);
      this.hideOverlay();
    }
  }

  /**
   * Cleans up resources
   */
  dispose() {
    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Stop projectile monitor
    if (this.projectileMonitorInterval) {
      clearInterval(this.projectileMonitorInterval);
    }

    // Stop physics engine
    Matter.Runner.stop(this.runner);

    // Clear event listeners
    if (this.inputHandler) {
      this.inputHandler.dispose();
    }

    // Dispose audio
    audioManager.dispose();
  }
}
