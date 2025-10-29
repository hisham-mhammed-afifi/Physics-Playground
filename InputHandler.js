/**
 * InputHandler - Manages all user input (mouse, touch, keyboard)
 * Provides unified interface for game controls
 */

'use strict';

class InputHandler {
  /**
   * Creates an InputHandler
   * @param {PhysicsPlayground} game - Game instance
   */
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;

    // Bind event handlers
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    // Keyboard state
    this.keysPressed = new Set();
    this.keyboardAimInterval = null;
    this.keyboardAngle = CONFIG.AIMING.DEFAULT_ANGLE;
    this.keyboardPower = CONFIG.AIMING.DEFAULT_POWER;

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Sets up all event listeners
   */
  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);

    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd);

    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    // Button events
    if (this.game.elements.resetBtn) {
      this.game.elements.resetBtn.addEventListener('click', () => {
        this.game.resetGame();
      });
    }

    if (this.game.elements.soundToggleBtn) {
      this.game.elements.soundToggleBtn.addEventListener('click', () => {
        this.game.toggleSound();
      });
    }
  }

  /**
   * Handles mouse down event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseDown(event) {
    if (this.game.launched || this.game.gameState !== 'playing') {
      return;
    }

    this.game.isDragging = true;
    this.updateAimFromMouse(event.offsetX, event.offsetY);
  }

  /**
   * Handles mouse move event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseMove(event) {
    if (!this.game.isDragging || this.game.gameState !== 'playing') {
      return;
    }

    this.updateAimFromMouse(event.offsetX, event.offsetY);
  }

  /**
   * Handles mouse up event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseUp(event) {
    if (!this.game.isDragging || this.game.gameState !== 'playing') {
      return;
    }

    this.game.isDragging = false;
    this.game.launch(this.game.dragAngle, this.game.dragPower);
  }

  /**
   * Updates aim angle and power from mouse position
   * @param {number} mouseX - Mouse X position
   * @param {number} mouseY - Mouse Y position
   */
  updateAimFromMouse(mouseX, mouseY) {
    const deltaX = mouseX - this.game.launcherPos.x;
    const deltaY = this.game.launcherPos.y - mouseY;

    // Calculate angle (in degrees)
    let angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    angle = Math.min(
      CONFIG.AIMING.MAX_ANGLE,
      Math.max(CONFIG.AIMING.MIN_ANGLE, angle)
    );

    // Calculate power from distance
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const power = Math.min(
      CONFIG.AIMING.MAX_POWER,
      Math.pow(distance / CONFIG.AIMING.POWER_DISTANCE_DIVISOR, CONFIG.AIMING.POWER_CURVE_EXPONENT)
    );

    this.game.dragAngle = angle;
    this.game.dragPower = power;

    // Update predicted path
    this.game.updatePredictedPath(angle, power);
  }

  /**
   * Handles touch start event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchStart(event) {
    event.preventDefault();

    if (this.game.launched || this.game.gameState !== 'playing') {
      return;
    }

    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      this.game.isDragging = true;
      this.updateAimFromMouse(x, y);
    }
  }

  /**
   * Handles touch move event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchMove(event) {
    event.preventDefault();

    if (!this.game.isDragging || this.game.gameState !== 'playing') {
      return;
    }

    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      this.updateAimFromMouse(x, y);
    }
  }

  /**
   * Handles touch end event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchEnd(event) {
    event.preventDefault();

    if (!this.game.isDragging || this.game.gameState !== 'playing') {
      return;
    }

    this.game.isDragging = false;
    this.game.launch(this.game.dragAngle, this.game.dragPower);
  }

  /**
   * Handles keyboard down event
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyDown(event) {
    this.keysPressed.add(event.key.toLowerCase());

    // Handle special keys
    switch (event.key.toLowerCase()) {
      case 'escape':
      case 'p':
        if (this.game.gameState === 'playing') {
          this.game.pause();
        } else if (this.game.gameState === 'paused') {
          this.game.resume();
        }
        break;

      case 'r':
        this.game.resetGame();
        break;

      case 'm':
        this.game.toggleSound();
        break;

      case ' ':
      case 'enter':
        event.preventDefault();
        if (!this.game.launched && this.game.gameState === 'playing') {
          this.game.launch(this.keyboardAngle, this.keyboardPower);
        }
        break;

      case 'arrowup':
      case 'w':
        event.preventDefault();
        this.startKeyboardAiming();
        break;

      case 'arrowdown':
      case 's':
        event.preventDefault();
        this.startKeyboardAiming();
        break;

      case 'arrowleft':
      case 'a':
        event.preventDefault();
        this.startKeyboardAiming();
        break;

      case 'arrowright':
      case 'd':
        event.preventDefault();
        this.startKeyboardAiming();
        break;
    }
  }

  /**
   * Handles keyboard up event
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyUp(event) {
    this.keysPressed.delete(event.key.toLowerCase());

    // Stop keyboard aiming if no arrow keys pressed
    const arrowKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];
    const anyArrowPressed = arrowKeys.some(key => this.keysPressed.has(key));

    if (!anyArrowPressed) {
      this.stopKeyboardAiming();
    }
  }

  /**
   * Starts keyboard aiming mode
   */
  startKeyboardAiming() {
    if (this.keyboardAimInterval || this.game.launched || this.game.gameState !== 'playing') {
      return;
    }

    this.keyboardAimInterval = setInterval(() => {
      this.updateKeyboardAim();
    }, 16); // ~60fps
  }

  /**
   * Stops keyboard aiming mode
   */
  stopKeyboardAiming() {
    if (this.keyboardAimInterval) {
      clearInterval(this.keyboardAimInterval);
      this.keyboardAimInterval = null;
    }
  }

  /**
   * Updates aim based on keyboard input
   */
  updateKeyboardAim() {
    let angleChanged = false;
    let powerChanged = false;

    // Adjust angle
    if (this.keysPressed.has('arrowup') || this.keysPressed.has('w')) {
      this.keyboardAngle = Math.min(CONFIG.AIMING.MAX_ANGLE, this.keyboardAngle + 1);
      angleChanged = true;
    }
    if (this.keysPressed.has('arrowdown') || this.keysPressed.has('s')) {
      this.keyboardAngle = Math.max(CONFIG.AIMING.MIN_ANGLE, this.keyboardAngle - 1);
      angleChanged = true;
    }

    // Adjust power
    if (this.keysPressed.has('arrowright') || this.keysPressed.has('d')) {
      this.keyboardPower = Math.min(CONFIG.AIMING.MAX_POWER, this.keyboardPower + 1);
      powerChanged = true;
    }
    if (this.keysPressed.has('arrowleft') || this.keysPressed.has('a')) {
      this.keyboardPower = Math.max(CONFIG.AIMING.MIN_POWER, this.keyboardPower - 1);
      powerChanged = true;
    }

    // Update visual feedback if anything changed
    if (angleChanged || powerChanged) {
      this.game.dragAngle = this.keyboardAngle;
      this.game.dragPower = this.keyboardPower;
      this.game.isDragging = true;
      this.game.updatePredictedPath(this.keyboardAngle, this.keyboardPower);
    }
  }

  /**
   * Removes all event listeners
   */
  dispose() {
    // Remove mouse events
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);

    // Remove touch events
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);

    // Remove keyboard events
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);

    // Stop keyboard aiming
    this.stopKeyboardAiming();
  }
}
