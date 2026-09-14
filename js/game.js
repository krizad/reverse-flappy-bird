/**
 * Main Reverse Flappy Bird Game Engine
 */

class ReverseFlappyGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.groundY = this.height - Math.min(100, Math.max(70, Math.floor(this.height * 0.14)));
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Subsystems
    this.sound = new SoundEngine();
    this.pipe = new PlayerPipe(this.width, this.height);
    this.pipe.resize(this.width, this.height, this.groundY);
    this.scenery = new Scenery(this.width, this.height, this.groundY);
    this.ui = new UIManager(this);

    window.addEventListener('resize', () => this.resize());

    // State
    this.state = 'START';
    this.score = 0;
    this.combo = 0;
    this.maxSessionCombo = 0;
    this.hp = CONFIG.PIPE.MAX_HP;
    this.maxHp = CONFIG.PIPE.MAX_HP;

    // Powerup status
    this.powerupTimer = 0;
    this.powerupType = null;

    // Screen Shake
    this.shakeTimer = 0;
    this.shakeIntensity = 0;

    // Entities
    this.birds = [];
    this.powerups = [];
    this.particles = [];
    this.floatingTexts = [];

    // Spawning
    this.spawnTimer = 0;
    this.spawnInterval = CONFIG.DIFFICULTY.INITIAL_SPAWN_INTERVAL;
    this.powerupSpawnTimer = 0;

    // Inputs
    this.keys = { up: false, down: false };

    this.initEventListeners();
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.groundY = this.height - Math.min(100, Math.max(70, Math.floor(this.height * 0.14)));
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (this.pipe) {
      this.pipe.resize(this.width, this.height, this.groundY);
    }
    if (this.scenery) {
      this.scenery.resize(this.width, this.height, this.groundY);
    }
  }

  initEventListeners() {
    const handlePointerMove = (clientY) => {
      if (this.state !== 'PLAYING') return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleY = this.canvas.height / rect.height;
      const canvasY = (clientY - rect.top) * scaleY;
      this.pipe.setTargetY(canvasY);
    };

    this.canvas.addEventListener('mousemove', (e) => {
      handlePointerMove(e.clientY);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches && e.touches[0]) {
        handlePointerMove(e.touches[0].clientY);
      }
    }, { passive: false });

    this.canvas.addEventListener('click', () => {
      if (this.state === 'START' || this.state === 'GAMEOVER') {
        this.startGame();
      }
    });

    window.addEventListener('keydown', (e) => {
      this.sound.init();

      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.keys.up = true;
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.keys.down = true;
      } else if (e.code === 'Space') {
        if (this.state === 'START' || this.state === 'GAMEOVER') {
          e.preventDefault();
          this.startGame();
        }
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
          e.preventDefault();
          this.togglePause();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.keys.up = false;
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.keys.down = false;
      }
    });
  }

  startGame() {
    this.sound.init();
    this.sound.startBGM();

    this.state = 'PLAYING';
    this.score = 0;
    this.combo = 0;
    this.maxSessionCombo = 0;
    this.hp = this.maxHp;
    this.powerupTimer = 0;
    this.powerupType = null;

    this.pipe.reset();
    this.birds = [];
    this.powerups = [];
    this.particles = [];
    this.floatingTexts = [];
    this.spawnTimer = 20;
    this.spawnInterval = CONFIG.DIFFICULTY.INITIAL_SPAWN_INTERVAL;
    this.powerupSpawnTimer = 0;
    this.shakeTimer = 0;

    this.ui.showPlaying();
    this.ui.updateCombo(this.combo);
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.ui.showPause();
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.ui.hidePause();
    }
  }

  triggerGameOver() {
    this.state = 'GAMEOVER';
    this.sound.stopBGM();
    this.sound.playGameOver();
    this.ui.showGameOver(this.score, this.maxSessionCombo);
  }

  takeDamage(x, y, birdColor) {
    this.hp--;
    this.combo = 0;
    this.ui.updateCombo(0);

    this.pipe.hitFlash = CONFIG.PIPE.HIT_FLASH_FRAMES;
    this.shakeTimer = CONFIG.PIPE.SHAKE_DURATION;
    this.shakeIntensity = CONFIG.PIPE.SHAKE_INTENSITY;
    this.sound.playHit();

    // Feather burst
    for (let i = 0; i < 24; i++) {
      this.particles.push(new FeatherParticle(x, y, birdColor));
    }

    this.floatingTexts.push(new FloatingText(this.pipe.x + 20, y, '-1 HP', '#ef4444', 16));

    if (this.hp <= 0) {
      this.hp = 0;
      this.triggerGameOver();
    }
  }

  spawnBird() {
    const unlocked = [];
    if (this.score >= CONFIG.BIRDS.NORMAL.unlockScore) unlocked.push(CONFIG.BIRDS.NORMAL.type);
    if (this.score >= CONFIG.BIRDS.DRUNK.unlockScore) unlocked.push(CONFIG.BIRDS.DRUNK.type);
    if (this.score >= CONFIG.BIRDS.FAT.unlockScore) unlocked.push(CONFIG.BIRDS.FAT.type);
    if (this.score >= CONFIG.BIRDS.SPEEDY.unlockScore) unlocked.push(CONFIG.BIRDS.SPEEDY.type);
    if (this.score >= CONFIG.BIRDS.GHOST.unlockScore) unlocked.push(CONFIG.BIRDS.GHOST.type);

    // Rare Golden bird chance
    if (this.score >= CONFIG.BIRDS.GOLDEN.unlockScore && Math.random() < CONFIG.BIRDS.GOLDEN.spawnChance) {
      this.birds.push(new GoldenBird(this.width, this.height));
      return;
    }

    // Pick random unlocked bird
    const type = unlocked[Math.floor(Math.random() * unlocked.length)] || 'normal';

    if (type === 'normal') {
      this.birds.push(new NormalBird(this.width, this.height));
    } else if (type === 'drunk') {
      this.birds.push(new DrunkBird(this.width, this.height));
    } else if (type === 'fat') {
      this.birds.push(new FatBird(this.width, this.height));
    } else if (type === 'speedy') {
      this.sound.playWarning();
      this.birds.push(new SpeedyBird(this.width, this.height));
      this.floatingTexts.push(new FloatingText(40, 200, 'ROCKET INCOMING!', '#ef4444', 14));
    } else if (type === 'ghost') {
      this.birds.push(new GhostBird(this.width, this.height));
    }
  }

  spawnPowerup() {
    // Spawns repair kit if hurt, otherwise 50/50 with mega gap
    let type = 'mega_gap';
    if (this.hp < this.maxHp && Math.random() < 0.6) {
      type = 'repair';
    }
    this.powerups.push(new PowerUp(type, this.width, this.height));
  }

  checkCircleRect(cx, cy, r, rx, ry, rw, rh) {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) < (r * r);
  }

  applyPowerup(p) {
    p.collected = true;
    this.sound.playPowerup();

    if (p.type === 'repair') {
      if (this.hp < this.maxHp) {
        this.hp++;
      }
      this.floatingTexts.push(new FloatingText(this.pipe.x + 20, this.pipe.gapY, '+1 HP REPAIR!', '#22c55e', 15));
    } else if (p.type === 'mega_gap') {
      this.powerupTimer = CONFIG.POWERUPS.MEGA_GAP.duration;
      this.powerupType = 'mega_gap';
      this.pipe.targetGapSize = CONFIG.PIPE.BOOST_GAP;
      this.floatingTexts.push(new FloatingText(this.pipe.x + 20, this.pipe.gapY, 'MEGA GAP ACTIVE!', '#38bdf8', 15));
    }

    // Sparkles
    for (let i = 0; i < 20; i++) {
      this.particles.push(new SparkleParticle(p.x, p.y, p.color));
    }
  }

  update(dt) {
    if (this.shakeTimer > 0) {
      this.shakeTimer--;
    }

    this.scenery.update();

    if (this.state !== 'PLAYING') return;

    // Keyboard controls
    if (this.keys.up) {
      this.pipe.moveBy(-this.pipe.speed);
    }
    if (this.keys.down) {
      this.pipe.moveBy(this.pipe.speed);
    }

    // Active powerup countdown
    if (this.powerupTimer > 0) {
      this.powerupTimer--;
      if (this.powerupTimer <= 0) {
        this.powerupType = null;
        this.pipe.targetGapSize = CONFIG.PIPE.DEFAULT_GAP;
      }
    }

    this.pipe.update();

    // Spawning Birds
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnBird();
      this.spawnTimer = 0;
      this.spawnInterval = Math.max(
        CONFIG.DIFFICULTY.MIN_SPAWN_INTERVAL,
        CONFIG.DIFFICULTY.INITIAL_SPAWN_INTERVAL - Math.floor(this.score * CONFIG.DIFFICULTY.SPAWN_ACCELERATION)
      );
    }

    // Spawning Powerups occasionally (~every 600-900 frames)
    this.powerupSpawnTimer++;
    if (this.powerupSpawnTimer >= 650 && Math.random() < 0.02) {
      this.spawnPowerup();
      this.powerupSpawnTimer = 0;
    }

    const hitboxes = this.pipe.getHitboxes();

    // Update & check powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.update();

      if (!p.collected && Math.abs(p.x - this.pipe.x) < 30) {
        // Collect if inside gap
        const halfGap = this.pipe.gapSize / 2;
        if (p.y >= this.pipe.gapY - halfGap && p.y <= this.pipe.gapY + halfGap) {
          this.applyPowerup(p);
        }
      }

      if (p.x > this.width + 80 || p.collected) {
        this.powerups.splice(i, 1);
      }
    }

    // Update birds & collisions
    for (let i = this.birds.length - 1; i >= 0; i--) {
      const bird = this.birds[i];
      bird.update(this.sound, this.particles);

      if (!bird.crashed) {
        // Check near miss for panic expression
        const distToPipe = Math.abs(bird.x - this.pipe.x);
        if (distToPipe < 60) {
          const halfGap = this.pipe.gapSize / 2;
          const distToEdge = Math.min(
            Math.abs(bird.y - (this.pipe.gapY - halfGap)),
            Math.abs(bird.y - (this.pipe.gapY + halfGap))
          );
          bird.nearMiss = distToEdge < 30;
        }

        let hit = false;
        for (const rect of hitboxes) {
          if (this.checkCircleRect(bird.x, bird.y, bird.radius, rect.x, rect.y, rect.w, rect.h)) {
            hit = true;
            break;
          }
        }

        if (hit) {
          bird.crashed = true;
          bird.vx = -1.2;
          bird.vy = 1.8;
          this.takeDamage(bird.x, bird.y, bird.color);
        } else if (!bird.passed && bird.x - bird.radius > this.pipe.x + this.pipe.width + this.pipe.lipExtra) {
          bird.passed = true;
          this.combo++;
          if (this.combo > this.maxSessionCombo) {
            this.maxSessionCombo = this.combo;
          }
          this.ui.updateCombo(this.combo);

          let points = 1;
          if (bird.type === 'golden') {
            points = CONFIG.BIRDS.GOLDEN.bonusPoints;
            this.ui.stats.goldenRescued++;
            this.sound.playGoldenBird();
            this.floatingTexts.push(new FloatingText(bird.x, bird.y - 20, `+${points} BONUS!`, '#fbbf24', 16));
            for (let s = 0; s < 16; s++) {
              this.particles.push(new SparkleParticle(bird.x, bird.y, '#fde047'));
            }
          } else {
            this.sound.playScore(this.combo);
            this.floatingTexts.push(new FloatingText(bird.x, bird.y - 15, `+${points}`, '#4ade80', 14));
          }

          this.score += points;

          // Combo accolade notifications
          if (this.combo === 3) {
            this.floatingTexts.push(new FloatingText(this.pipe.x - 40, this.pipe.gapY - 40, 'NICE!', '#38bdf8', 14));
          } else if (this.combo === 5) {
            this.floatingTexts.push(new FloatingText(this.pipe.x - 60, this.pipe.gapY - 40, 'GREAT STREAK!', '#facc15', 14));
          } else if (this.combo === 10) {
            this.floatingTexts.push(new FloatingText(this.pipe.x - 70, this.pipe.gapY - 40, 'PIPE MASTER!', '#ef4444', 16));
          }
        }
      }

      if (bird.x > this.width + 100 || bird.y > this.height + 100) {
        this.birds.splice(i, 1);
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      this.floatingTexts[i].update();
      if (this.floatingTexts[i].alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  render() {
    const ctx = this.ctx;

    ctx.save();

    // Screen Shake effect
    if (this.shakeTimer > 0) {
      const dx = (Math.random() - 0.5) * this.shakeIntensity;
      const dy = (Math.random() - 0.5) * this.shakeIntensity;
      ctx.translate(dx, dy);
    }

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Sky & Parallax Scenery
    this.scenery.drawSky(ctx, this.score);

    // 2. Player Pipe
    const isBoosted = this.powerupTimer > 0 && this.powerupType === 'mega_gap';
    this.pipe.draw(ctx, this.hp, isBoosted);

    // 3. Powerups
    for (const p of this.powerups) {
      p.draw(ctx);
    }

    // 4. Birds
    for (const bird of this.birds) {
      bird.draw(ctx);
    }

    // 5. Ground (drawn over pipe base so pipe sinks cleanly under grass)
    this.scenery.drawGround(ctx);

    // 6. Particles
    for (const p of this.particles) {
      p.draw(ctx);
    }

    // 7. Floating Texts
    for (const ft of this.floatingTexts) {
      ft.draw(ctx);
    }

    // 8. Live HUD
    this.ui.drawHUD(ctx, this.score, this.hp, this.maxHp, this.powerupTimer, this.powerupType, this.combo, this.width);

    ctx.restore();
  }

  animate(time) {
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.animate);
  }
}

// Bootstrap game on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.game = new ReverseFlappyGame();
});
