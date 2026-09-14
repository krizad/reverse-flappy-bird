/**
 * Reverse Flappy Bird - Game Configuration & Constants
 */
const CONFIG = {
  CANVAS: {
    WIDTH: 800,
    HEIGHT: 600,
    GROUND_Y: 530,
    GROUND_HEIGHT: 70
  },

  PIPE: {
    DEFAULT_X: 520,
    WIDTH: 76,
    LIP_EXTRA: 10,
    LIP_HEIGHT: 28,
    DEFAULT_GAP: 185,
    BOOST_GAP: 240,       // When Mega Gap powerup is active
    SPEED: 12,            // Keyboard movement speed
    MIN_GAP_Y: 30,        // Full range top ceiling retract
    MAX_GAP_Y: 500,       // Full range bottom floor sink
    MAX_HP: 5,
    HIT_FLASH_FRAMES: 12,
    SHAKE_DURATION: 14,
    SHAKE_INTENSITY: 8
  },

  DIFFICULTY: {
    INITIAL_SPAWN_INTERVAL: 135,
    MIN_SPAWN_INTERVAL: 65,
    SPAWN_ACCELERATION: 1.5
  },

  BIRDS: {
    NORMAL: {
      type: 'normal',
      name: 'Normal Bird',
      color: '#facc15',
      wingColor: '#f59e0b',
      radius: 15,
      baseSpeed: 2.5,
      gravity: 0.20,
      flapPower: -4.8,
      flapInterval: [26, 44],
      unlockScore: 0
    },
    DRUNK: {
      type: 'drunk',
      name: 'Drunk Bird',
      color: '#c084fc',
      wingColor: '#a855f7',
      radius: 15,
      baseSpeed: 2.6,
      amplitude: [25, 50],
      freq: [0.025, 0.038],
      unlockScore: 5
    },
    FAT: {
      type: 'fat',
      name: 'Fat Bird',
      color: '#38bdf8',
      wingColor: '#0284c7',
      radius: 23,
      baseSpeed: 2.0,
      gravity: 0.26,
      flapPower: -5.4,
      flapInterval: [20, 34],
      unlockScore: 10
    },
    SPEEDY: {
      type: 'speedy',
      name: 'Rocket Bird',
      color: '#ef4444',
      wingColor: '#dc2626',
      radius: 13,
      baseSpeed: 4.8,
      gravity: 0.12,
      flapPower: -3.8,
      flapInterval: [18, 28],
      unlockScore: 16
    },
    GHOST: {
      type: 'ghost',
      name: 'Ghost Bird',
      color: '#67e8f9',
      wingColor: '#06b6d4',
      radius: 15,
      baseSpeed: 2.7,
      amplitude: [30, 60],
      unlockScore: 24
    },
    GOLDEN: {
      type: 'golden',
      name: 'Golden Bird',
      color: '#fbbf24',
      wingColor: '#f59e0b',
      radius: 14,
      baseSpeed: 3.2,
      gravity: 0.18,
      flapPower: -4.5,
      flapInterval: [24, 38],
      bonusPoints: 5,
      spawnChance: 0.12,
      unlockScore: 8
    }
  },

  POWERUPS: {
    REPAIR: {
      type: 'repair',
      name: 'Wrench Kit',
      symbol: '🔧',
      color: '#22c55e',
      healAmount: 1,
      radius: 16
    },
    MEGA_GAP: {
      type: 'mega_gap',
      name: 'Mega Gap',
      symbol: '⚡',
      color: '#38bdf8',
      duration: 500, // frames (~8.3 seconds)
      radius: 16
    }
  },

  THEMES: {
    DAY: {
      name: 'Day',
      skyTop: '#4ec0ca',
      skyMid: '#70c5ce',
      skyBottom: '#bbf2f6',
      cloudAlpha: 0.45,
      cityColor: '#65b1b8',
      treeColor: '#5cba57',
      starsAlpha: 0
    },
    SUNSET: {
      name: 'Sunset',
      skyTop: '#f97316',
      skyMid: '#fb923c',
      skyBottom: '#fde047',
      cloudAlpha: 0.55,
      cityColor: '#7c2d12',
      treeColor: '#431407',
      starsAlpha: 0.1
    },
    NIGHT: {
      name: 'Night',
      skyTop: '#0f172a',
      skyMid: '#1e1b4b',
      skyBottom: '#312e81',
      cloudAlpha: 0.2,
      cityColor: '#090d16',
      treeColor: '#064e3b',
      starsAlpha: 0.85
    }
  },

  MEDALS: [
    { min: 50, name: 'Platinum', color: '#67e8f9', border: '#0891b2', starColor: '#ecfeff' },
    { min: 30, name: 'Gold',     color: '#facc15', border: '#b45309', starColor: '#fef9c3' },
    { min: 15, name: 'Silver',   color: '#e2e8f0', border: '#64748b', starColor: '#ffffff' },
    { min: 5,  name: 'Bronze',   color: '#d97706', border: '#78350f', starColor: '#fde68a' }
  ]
};
