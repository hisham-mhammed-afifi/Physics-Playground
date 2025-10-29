/**
 * Configuration constants for Physics Playground
 * Centralizes all magic numbers and configuration values
 */

'use strict';

const CONFIG = {
  // Canvas dimensions
  CANVAS: {
    WIDTH: 800,
    HEIGHT: 600,
  },

  // Launcher configuration
  LAUNCHER: {
    X: 100,
    Y: 550,
    SIZE: 20,
    VELOCITY_SCALE: 0.25,
  },

  // Projectile physics
  PROJECTILE: {
    RADIUS: 12,
    RESTITUTION: 0.6,
    FRICTION_AIR: 0.01,
    MIN_VELOCITY_THRESHOLD: 0.2,
    STOP_Y_POSITION: 580,
  },

  // Aiming constraints
  AIMING: {
    MIN_ANGLE: 10,
    MAX_ANGLE: 80,
    MIN_POWER: 0,
    MAX_POWER: 100,
    DEFAULT_ANGLE: 45,
    DEFAULT_POWER: 50,
    POWER_CURVE_EXPONENT: 0.85,
    POWER_DISTANCE_DIVISOR: 4,
    AIM_LINE_LENGTH_MULTIPLIER: 2,
    AIM_CIRCLE_RADIUS_DIVISOR: 3,
  },

  // Ground and walls
  WORLD: {
    GROUND_Y: 590,
    GROUND_WIDTH: 800,
    GROUND_HEIGHT: 20,
    WALL_WIDTH: 20,
    WALL_HEIGHT: 600,
    WALL_Y: 300,
  },

  // Target configuration
  TARGET: {
    RADIUS: 20,
    LABEL: 'target',
  },

  // Obstacle configuration
  OBSTACLE: {
    LABEL: 'obstacle',
  },

  // Particle effects
  PARTICLES: {
    COUNT_PER_EXPLOSION: 18,
    MAX_VELOCITY: 6,
    GRAVITY: 0.15,
    RADIUS: 3,
    LIFETIME: 60,
  },

  // Prediction path
  PREDICTION: {
    SIMULATION_STEPS: 300,
    DELTA_TIME: 1000 / 60,
    MAX_Y: 620,
    MAX_X: 820,
    DASH_PATTERN: [6, 6],
    OPACITY: 0.4,
  },

  // Clouds
  CLOUDS: {
    COUNT: 8,
    MIN_SIZE: 40,
    MAX_SIZE: 100,
    MIN_SPEED: 0.2,
    MAX_SPEED: 0.5,
    MAX_Y: 150,
    LAYER_1_OPACITY: 0.9,
    LAYER_2_OPACITY: 0.6,
    RESET_X: -100,
    OFF_SCREEN_X: 850,
  },

  // Colors
  COLORS: {
    BACKGROUND_THEMES: [
      { sky: '#bce0ff', ground: '#7bc96f' },
      { sky: '#ffe6b3', ground: '#c49d56' },
      { sky: '#ffc6d1', ground: '#c06c84' },
    ],
    LAUNCHER: '#444',
    PROJECTILE: '#a22',
    EXPLOSION: '#f22',
    BODIES_STROKE: '#000',
    AIM_LINE: 'rgba(0,0,0,0.6)',
    AIM_CIRCLE: 'rgba(0,0,0,0.2)',
    PREDICTION_PATH: 'rgba(0,0,0,0.4)',
    OVERLAY_BG: 'rgba(0, 0, 0, 0.7)',
    OVERLAY_TEXT: '#fff',
  },

  // Scoring
  SCORING: {
    POINTS_PER_TARGET: 1,
    POINTS_PER_LEVEL: 3,
    HIGH_SCORE_KEY: 'physicsPlaygroundHighScore',
  },

  // Timing
  TIMING: {
    PROJECTILE_CHECK_INTERVAL: 500,
    LEVEL_TRANSITION_DELAY: 2000,
    WIN_SCREEN_DELAY: 3500,
    THROTTLE_DELAY: 16, // ~60fps
  },

  // Audio frequencies (in Hz)
  AUDIO: {
    LAUNCH: { frequency: 220, type: 'triangle', duration: 0.2, volume: 0.3 },
    HIT: { frequency: 440, type: 'square', duration: 0.2, volume: 0.3 },
    LEVEL_COMPLETE: { frequency: 600, type: 'sine', duration: 0.3, volume: 0.3 },
    WIN: { frequency: 880, type: 'square', duration: 0.5, volume: 0.4 },
  },

  // Game settings
  GAME: {
    STARTING_LEVEL: 1,
    STARTING_SCORE: 0,
  },

  // Assets
  ASSETS: {
    CLOUD_IMAGE: 'assets/cloud.png',
  },

  // Canvas rendering
  RENDERING: {
    LINE_WIDTH: 2,
    AIM_LINE_WIDTH: 2,
  },

  // Difficulty settings (for future enhancement)
  DIFFICULTY: {
    EASY: {
      velocityScale: 0.3,
      triesMultiplier: 2,
    },
    MEDIUM: {
      velocityScale: 0.25,
      triesMultiplier: 1,
    },
    HARD: {
      velocityScale: 0.2,
      triesMultiplier: 0.5,
    },
  },
};

// Freeze the configuration to prevent accidental modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.CANVAS);
Object.freeze(CONFIG.LAUNCHER);
Object.freeze(CONFIG.PROJECTILE);
Object.freeze(CONFIG.AIMING);
Object.freeze(CONFIG.WORLD);
Object.freeze(CONFIG.TARGET);
Object.freeze(CONFIG.OBSTACLE);
Object.freeze(CONFIG.PARTICLES);
Object.freeze(CONFIG.PREDICTION);
Object.freeze(CONFIG.CLOUDS);
Object.freeze(CONFIG.COLORS);
Object.freeze(CONFIG.SCORING);
Object.freeze(CONFIG.TIMING);
Object.freeze(CONFIG.AUDIO);
Object.freeze(CONFIG.GAME);
Object.freeze(CONFIG.ASSETS);
Object.freeze(CONFIG.RENDERING);
Object.freeze(CONFIG.DIFFICULTY);
