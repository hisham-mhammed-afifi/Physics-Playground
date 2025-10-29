/**
 * ParticleSystem - Manages particle effects for explosions and visual feedback
 * Implements object pooling for better performance
 */

'use strict';

/**
 * Represents a single particle
 */
class Particle {
  /**
   * Creates a particle
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} velocityX - X velocity
   * @param {number} velocityY - Y velocity
   * @param {string} color - Particle color
   * @param {number} lifetime - Particle lifetime in frames
   */
  constructor(x, y, velocityX, velocityY, color, lifetime) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
    this.active = true;
  }

  /**
   * Updates particle position and lifetime
   */
  update() {
    if (!this.active) return;

    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityY += CONFIG.PARTICLES.GRAVITY;
    this.lifetime--;

    if (this.lifetime <= 0) {
      this.active = false;
    }
  }

  /**
   * Draws the particle on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    if (!this.active) return;

    const alpha = Math.max(0, this.lifetime / this.maxLifetime);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, CONFIG.PARTICLES.RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Resets particle with new properties (for object pooling)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} velocityX - X velocity
   * @param {number} velocityY - Y velocity
   * @param {string} color - Particle color
   * @param {number} lifetime - Particle lifetime in frames
   */
  reset(x, y, velocityX, velocityY, color, lifetime) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
    this.active = true;
  }
}

/**
 * Manages a pool of particles for efficient memory usage
 */
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.pool = [];
    this.maxPoolSize = 200; // Prevent unlimited growth
  }

  /**
   * Gets a particle from the pool or creates a new one
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} velocityX - X velocity
   * @param {number} velocityY - Y velocity
   * @param {string} color - Particle color
   * @param {number} lifetime - Particle lifetime in frames
   * @returns {Particle} A particle instance
   */
  getParticle(x, y, velocityX, velocityY, color, lifetime) {
    let particle;

    if (this.pool.length > 0) {
      particle = this.pool.pop();
      particle.reset(x, y, velocityX, velocityY, color, lifetime);
    } else {
      particle = new Particle(x, y, velocityX, velocityY, color, lifetime);
    }

    return particle;
  }

  /**
   * Returns a particle to the pool
   * @param {Particle} particle - Particle to return to pool
   */
  returnToPool(particle) {
    if (this.pool.length < this.maxPoolSize) {
      particle.active = false;
      this.pool.push(particle);
    }
  }

  /**
   * Creates an explosion effect at the specified position
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} color - Explosion color
   */
  createExplosion(x, y, color = CONFIG.COLORS.EXPLOSION) {
    for (let i = 0; i < CONFIG.PARTICLES.COUNT_PER_EXPLOSION; i++) {
      const velocityX = (Math.random() - 0.5) * CONFIG.PARTICLES.MAX_VELOCITY;
      const velocityY = (Math.random() - 0.5) * CONFIG.PARTICLES.MAX_VELOCITY;

      const particle = this.getParticle(
        x,
        y,
        velocityX,
        velocityY,
        color,
        CONFIG.PARTICLES.LIFETIME
      );

      this.particles.push(particle);
    }
  }

  /**
   * Updates all active particles
   */
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update();

      if (!particle.active) {
        this.returnToPool(particle);
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Draws all active particles
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    this.particles.forEach(particle => particle.draw(ctx));
  }

  /**
   * Clears all particles
   */
  clear() {
    this.particles.forEach(particle => this.returnToPool(particle));
    this.particles = [];
  }

  /**
   * Gets the number of active particles
   * @returns {number} Active particle count
   */
  getActiveCount() {
    return this.particles.length;
  }

  /**
   * Gets the pool size
   * @returns {number} Pool size
   */
  getPoolSize() {
    return this.pool.length;
  }
}
