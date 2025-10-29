/**
 * LevelManager - Handles level loading, progression, and procedural generation
 */

'use strict';

class LevelManager {
  /**
   * Creates a LevelManager instance
   */
  constructor() {
    this.levels = [];
    this.currentLevelIndex = 0;
    this.proceduralConfig = null;
    this.loaded = false;
    this.loadError = null;
  }

  /**
   * Loads level data from JSON file
   * @returns {Promise<boolean>} True if loading successful
   */
  async loadLevels() {
    try {
      const response = await fetch('levels.json');
      if (!response.ok) {
        throw new Error(`Failed to load levels: ${response.statusText}`);
      }

      const data = await response.json();
      this.levels = data.levels || [];
      this.proceduralConfig = data.proceduralGeneration || null;
      this.loaded = true;
      return true;
    } catch (error) {
      console.error('Error loading levels:', error);
      this.loadError = error.message;
      this.loadFallbackLevels();
      return false;
    }
  }

  /**
   * Loads fallback levels if JSON loading fails
   */
  loadFallbackLevels() {
    console.warn('Using fallback levels');
    this.levels = [
      {
        id: 1,
        name: 'Getting Started',
        targets: [
          { x: 600, y: 540 },
          { x: 650, y: 480 },
          { x: 700, y: 420 },
        ],
        obstacles: [
          { x: 400, y: 530, width: 100, height: 20, angle: 0 },
          { x: 500, y: 460, width: 120, height: 20, angle: Math.PI / 8 },
        ],
      },
      {
        id: 2,
        name: 'Rising Challenge',
        targets: [
          { x: 600, y: 500 },
          { x: 680, y: 450 },
          { x: 730, y: 400 },
        ],
        obstacles: [
          { x: 430, y: 520, width: 140, height: 20, angle: -Math.PI / 10 },
          { x: 500, y: 470, width: 100, height: 20, angle: Math.PI / 6 },
        ],
      },
      {
        id: 3,
        name: 'Expert Territory',
        targets: [
          { x: 650, y: 520 },
          { x: 700, y: 460 },
          { x: 750, y: 400 },
        ],
        obstacles: [
          { x: 420, y: 530, width: 120, height: 20, angle: Math.PI / 8 },
          { x: 550, y: 460, width: 150, height: 20, angle: -Math.PI / 8 },
        ],
      },
    ];
    this.loaded = true;
  }

  /**
   * Gets level by number (1-indexed)
   * @param {number} levelNumber - Level number
   * @returns {Object|null} Level data or null
   */
  getLevel(levelNumber) {
    if (levelNumber < 1) {
      return null;
    }

    // Check if we should generate procedural level
    if (this.proceduralConfig?.enabled &&
        levelNumber > this.proceduralConfig.startAfterLevel) {
      return this.generateProceduralLevel(levelNumber);
    }

    // Use existing levels (cycle through them)
    const index = (levelNumber - 1) % this.levels.length;
    return this.levels[index] || null;
  }

  /**
   * Generates a procedural level
   * @param {number} levelNumber - Level number
   * @returns {Object} Generated level data
   */
  generateProceduralLevel(levelNumber) {
    if (!this.proceduralConfig) {
      return this.getLevel(1); // Fallback to first level
    }

    const config = this.proceduralConfig;
    const seed = levelNumber; // Use level number as seed for consistency

    // Seeded random function
    const random = (min, max) => {
      const x = Math.sin(seed * 9999 + min * 1234 + max * 5678) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };

    const randomInt = (min, max) => Math.floor(random(min, max + 1));

    // Generate targets
    const targetCount = randomInt(config.targetCount.min, config.targetCount.max);
    const targets = [];

    for (let i = 0; i < targetCount; i++) {
      targets.push({
        x: random(config.targetSpawnArea.minX, config.targetSpawnArea.maxX),
        y: random(config.targetSpawnArea.minY, config.targetSpawnArea.maxY),
      });
    }

    // Generate obstacles
    const obstacleCount = randomInt(config.obstacleCount.min, config.obstacleCount.max);
    const obstacles = [];

    for (let i = 0; i < obstacleCount; i++) {
      obstacles.push({
        x: random(config.obstacleSpawnArea.minX, config.obstacleSpawnArea.maxX),
        y: random(config.obstacleSpawnArea.minY, config.obstacleSpawnArea.maxY),
        width: random(config.obstacleSize.minWidth, config.obstacleSize.maxWidth),
        height: config.obstacleSize.height,
        angle: random(config.obstacleAngleRange.min, config.obstacleAngleRange.max),
      });
    }

    return {
      id: levelNumber,
      name: `Procedural Level ${levelNumber}`,
      targets,
      obstacles,
    };
  }

  /**
   * Gets total number of predefined levels
   * @returns {number} Number of levels
   */
  getLevelCount() {
    return this.levels.length;
  }

  /**
   * Checks if levels are loaded
   * @returns {boolean} True if loaded
   */
  isLoaded() {
    return this.loaded;
  }

  /**
   * Gets load error if any
   * @returns {string|null} Error message or null
   */
  getLoadError() {
    return this.loadError;
  }

  /**
   * Validates level data
   * @param {Object} level - Level data to validate
   * @returns {boolean} True if valid
   */
  validateLevel(level) {
    if (!level || typeof level !== 'object') {
      return false;
    }

    if (!Array.isArray(level.targets) || level.targets.length === 0) {
      return false;
    }

    if (!Array.isArray(level.obstacles)) {
      return false;
    }

    // Validate each target has x and y
    for (const target of level.targets) {
      if (typeof target.x !== 'number' || typeof target.y !== 'number') {
        return false;
      }
    }

    // Validate each obstacle has required properties
    for (const obstacle of level.obstacles) {
      if (typeof obstacle.x !== 'number' ||
          typeof obstacle.y !== 'number' ||
          typeof obstacle.width !== 'number' ||
          typeof obstacle.height !== 'number' ||
          typeof obstacle.angle !== 'number') {
        return false;
      }
    }

    return true;
  }
}
