/**
 * AudioManager - Handles all audio playback with proper context management
 * Implements singleton pattern and handles browser autoplay policies
 */

'use strict';

class AudioManager {
  /**
   * Creates an AudioManager instance
   */
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.initialized = false;
    this.initializationError = false;
  }

  /**
   * Initializes the audio context (call on first user interaction)
   * @returns {boolean} True if initialization successful
   */
  initialize() {
    if (this.initialized || this.initializationError) {
      return this.initialized;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.warn('Web Audio API not supported');
        this.initializationError = true;
        return false;
      }

      this.audioContext = new AudioContext();
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      this.initializationError = true;
      return false;
    }
  }

  /**
   * Resumes audio context if it's suspended (for autoplay policy)
   * @returns {Promise<void>}
   */
  async resume() {
    if (!this.audioContext || this.audioContext.state !== 'suspended') {
      return;
    }

    try {
      await this.audioContext.resume();
    } catch (error) {
      console.error('Failed to resume AudioContext:', error);
    }
  }

  /**
   * Plays a sound with specified parameters
   * @param {number} frequency - Sound frequency in Hz
   * @param {OscillatorType} type - Oscillator type ('sine', 'square', 'triangle', 'sawtooth')
   * @param {number} duration - Duration in seconds
   * @param {number} volume - Volume (0-1)
   */
  playSound(frequency, type = 'sine', duration = 0.2, volume = 0.2) {
    if (!this.enabled || this.initializationError) {
      return;
    }

    // Initialize on first use
    if (!this.initialized && !this.initialize()) {
      return;
    }

    try {
      // Resume context if needed (for autoplay policy)
      this.resume();

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Configure oscillator
      oscillator.frequency.value = frequency;
      oscillator.type = type;

      // Configure gain (volume)
      gainNode.gain.value = volume;

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Play sound
      const currentTime = this.audioContext.currentTime;
      oscillator.start(currentTime);
      oscillator.stop(currentTime + duration);

      // Cleanup: disconnect after sound finishes
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  /**
   * Plays a predefined sound effect
   * @param {string} soundName - Name of the sound effect
   */
  playSoundEffect(soundName) {
    const sound = CONFIG.AUDIO[soundName.toUpperCase()];
    if (!sound) {
      console.warn(`Sound effect "${soundName}" not found`);
      return;
    }

    this.playSound(sound.frequency, sound.type, sound.duration, sound.volume);
  }

  /**
   * Toggles audio on/off
   * @returns {boolean} New enabled state
   */
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  /**
   * Sets audio enabled state
   * @param {boolean} enabled - Whether audio should be enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Gets current audio enabled state
   * @returns {boolean} Whether audio is enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Closes the audio context and cleans up resources
   */
  dispose() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (error) {
        console.error('Failed to close AudioContext:', error);
      }
    }
    this.audioContext = null;
    this.initialized = false;
  }
}

// Export singleton instance
const audioManager = new AudioManager();
