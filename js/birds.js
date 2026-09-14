/**
 * Bird Hierarchy: Base Bird & Specialized Bird Classes
 */

class Bird {
  constructor(type, canvasWidth, canvasHeight) {
    this.type = type;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.groundY = CONFIG.CANVAS.GROUND_Y;
    this.x = -60;
    this.passed = false;
    this.crashed = false;
    this.nearMiss = false;
    this.frame = 0;
    this.rotation = 0;
  }

  update(soundEngine, particles) {
    this.frame++;
    if (this.crashed) {
      this.vy += 0.42;
      this.x += this.vx * 0.3;
      this.y += this.vy;
      this.rotation += 0.15;
    }
  }

  drawCommon(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation || 0);

    const r = this.radius;

    // Shadow under bird
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(0, r + 4, r * 0.9, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Belly
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-r * 0.2, r * 0.25, r * 0.55, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    const wingFlap = Math.sin(this.frame * (this.type === 'fat' ? 0.42 : 0.28)) * (r * 0.4);
    ctx.fillStyle = this.wingColor || '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(-r * 0.45, wingFlap, r * 0.5, r * 0.32, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eye
    const eyeX = r * 0.4;
    const eyeY = -r * 0.3;
    const eyeR = r * 0.34;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pupil (Changes expression if near miss or passed!)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    if (this.passed) {
      // Happy curved closed eye line
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeR * 0.6, Math.PI, 0);
      ctx.stroke();
    } else if (this.nearMiss) {
      // Wide startled panic pupil!
      ctx.arc(eyeX, eyeY, eyeR * 0.25, 0, Math.PI * 2);
      ctx.fill();
      // Panic sweat drop
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(eyeX - eyeR * 1.5, eyeY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'drunk') {
      ctx.arc(eyeX + Math.cos(this.frame * 0.2) * 2, eyeY + Math.sin(this.frame * 0.2) * 2, eyeR * 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.arc(eyeX + eyeR * 0.3, eyeY, eyeR * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eye Highlight (only if not happily closed)
    if (!this.passed) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX + eyeR * 0.1, eyeY - eyeR * 0.2, eyeR * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Beak
    ctx.fillStyle = '#f97316';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(r * 0.8, -r * 0.1);
    ctx.lineTo(r * 1.5, r * 0.1);
    ctx.lineTo(r * 0.8, r * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

class NormalBird extends Bird {
  constructor(canvasWidth, canvasHeight) {
    super('normal', canvasWidth, canvasHeight);
    const cfg = CONFIG.BIRDS.NORMAL;
    this.radius = cfg.radius;
    this.color = cfg.color;
    this.wingColor = cfg.wingColor;
    this.vx = cfg.baseSpeed + Math.random() * 0.5;
    this.vy = -1.5;
    this.gravity = cfg.gravity;
    this.flapPower = cfg.flapPower;
    this.flapTimer = 0;
    this.flapInterval = Math.floor(Math.random() * (cfg.flapInterval[1] - cfg.flapInterval[0]) + cfg.flapInterval[0]);
    this.y = Math.random() * (canvasHeight - 260) + 120;
  }

  update(soundEngine, particles) {
    super.update(soundEngine, particles);
    if (this.crashed) return;

    this.vy += this.gravity;
    this.y += this.vy;
    this.flapTimer++;

    if (this.flapTimer >= this.flapInterval || this.y > this.groundY - 32) {
      this.vy = this.flapPower;
      this.flapTimer = 0;
      if (this.x > 0 && this.x < this.canvasWidth) {
        soundEngine.playFlap();
      }
    }

    if (this.y - this.radius < 10) {
      this.y = 10 + this.radius;
      this.vy = 0.5;
    }

    this.x += this.vx;
    this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.vy * 0.08));
  }

  draw(ctx) {
    this.drawCommon(ctx);
  }
}

class DrunkBird extends Bird {
  constructor(canvasWidth, canvasHeight) {
    super('drunk', canvasWidth, canvasHeight);
    const cfg = CONFIG.BIRDS.DRUNK;
    this.radius = cfg.radius;
    this.color = cfg.color;
    this.wingColor = cfg.wingColor;
    this.vx = cfg.baseSpeed + Math.random() * 0.4;
    this.baseY = Math.random() * (canvasHeight - 300) + 150;
    this.y = this.baseY;
    this.vy = 0;
    this.amplitude = Math.random() * (cfg.amplitude[1] - cfg.amplitude[0]) + cfg.amplitude[0];
    this.freq = Math.random() * (cfg.freq[1] - cfg.freq[0]) + cfg.freq[0];
    this.phase = Math.random() * Math.PI * 2;
    this.trail = [];
  }

  update(soundEngine, particles) {
    super.update(soundEngine, particles);
    if (this.crashed) return;

    this.x += this.vx;
    const prevY = this.y;
    const rawY = this.baseY + Math.sin(this.frame * this.freq + this.phase) * this.amplitude;
    this.y = Math.max(16 + this.radius, Math.min(this.groundY - this.radius - 8, rawY));
    this.vy = this.y - prevY;
    this.rotation = Math.sin(this.frame * 0.1) * 0.3 + (this.vy * 0.05);

    if (this.frame % 3 === 0) {
      this.trail.push({ x: this.x - this.radius, y: this.y, alpha: 0.7 });
    }
    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].alpha -= 0.035;
      this.trail[i].x -= 1.0;
      if (this.trail[i].alpha <= 0) this.trail.splice(i, 1);
    }
  }

  draw(ctx) {
    if (this.trail.length > 0) {
      ctx.save();
      for (const t of this.trail) {
        ctx.globalAlpha = Math.max(0, t.alpha);
        ctx.fillStyle = '#e879f9';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    this.drawCommon(ctx);
  }
}

class FatBird extends Bird {
  constructor(canvasWidth, canvasHeight) {
    super('fat', canvasWidth, canvasHeight);
    const cfg = CONFIG.BIRDS.FAT;
    this.radius = cfg.radius;
    this.color = cfg.color;
    this.wingColor = cfg.wingColor;
    this.vx = cfg.baseSpeed + Math.random() * 0.4;
    this.vy = -1.2;
    this.gravity = cfg.gravity;
    this.flapPower = cfg.flapPower;
    this.flapTimer = 0;
    this.flapInterval = Math.floor(Math.random() * (cfg.flapInterval[1] - cfg.flapInterval[0]) + cfg.flapInterval[0]);
    this.y = Math.random() * (canvasHeight - 280) + 140;
  }

  update(soundEngine, particles) {
    super.update(soundEngine, particles);
    if (this.crashed) return;

    this.vy += this.gravity;
    this.y += this.vy;
    this.flapTimer++;

    if (this.flapTimer >= this.flapInterval || this.y > this.groundY - 36) {
      this.vy = this.flapPower;
      this.flapTimer = 0;
      if (this.x > 0 && this.x < this.canvasWidth) {
        soundEngine.playFlap();
      }
    }

    if (this.y - this.radius < 12) {
      this.y = 12 + this.radius;
      this.vy = 0.5;
    }

    this.x += this.vx;
    this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.vy * 0.08));
  }

  draw(ctx) {
    this.drawCommon(ctx);
  }
}

class SpeedyBird extends Bird {
  constructor(canvasWidth, canvasHeight) {
    super('speedy', canvasWidth, canvasHeight);
    const cfg = CONFIG.BIRDS.SPEEDY;
    this.radius = cfg.radius;
    this.color = cfg.color;
    this.wingColor = cfg.wingColor;
    this.vx = cfg.baseSpeed;
    this.vy = 0;
    this.y = Math.random() * (canvasHeight - 300) + 140;
  }

  update(soundEngine, particles) {
    super.update(soundEngine, particles);
    if (this.crashed) return;

    this.x += this.vx;
    this.rotation = 0.05;

    // Emit smoke particles
    if (particles && this.frame % 2 === 0) {
      particles.push(new SmokeParticle(this.x - this.radius - 2, this.y));
    }
  }

  draw(ctx) {
    ctx.save();
    // Rocket flame behind bird
    if (!this.crashed) {
      ctx.fillStyle = (this.frame % 4 < 2) ? '#f97316' : '#facc15';
      ctx.beginPath();
      ctx.moveTo(this.x - this.radius, this.y - 4);
      ctx.lineTo(this.x - this.radius - (8 + Math.random() * 6), this.y);
      ctx.lineTo(this.x - this.radius, this.y + 4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    this.drawCommon(ctx);
  }
}

class GhostBird extends Bird {
  constructor(canvasWidth, canvasHeight) {
    super('ghost', canvasWidth, canvasHeight);
    const cfg = CONFIG.BIRDS.GHOST;
    this.radius = cfg.radius;
    this.color = cfg.color;
    this.wingColor = cfg.wingColor;
    this.vx = cfg.baseSpeed;
    this.baseY = Math.random() * (canvasHeight - 320) + 160;
    this.y = this.baseY;
    this.alpha = 0.65;
  }

  update(soundEngine, particles) {
    super.update(soundEngine, particles);
    if (this.crashed) return;

    this.x += this.vx;
    this.y = this.baseY + Math.sin(this.frame * 0.04) * 35;
    this.alpha = 0.45 + Math.sin(this.frame * 0.08) * 0.35;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.2, this.alpha);
    this.drawCommon(ctx);
    ctx.restore();
  }
}

class GoldenBird extends Bird {
  constructor(canvasWidth, canvasHeight) {
    super('golden', canvasWidth, canvasHeight);
    const cfg = CONFIG.BIRDS.GOLDEN;
    this.radius = cfg.radius;
    this.color = cfg.color;
    this.wingColor = cfg.wingColor;
    this.vx = cfg.baseSpeed;
    this.vy = -1.3;
    this.gravity = cfg.gravity;
    this.flapPower = cfg.flapPower;
    this.flapTimer = 0;
    this.flapInterval = Math.floor(Math.random() * (cfg.flapInterval[1] - cfg.flapInterval[0]) + cfg.flapInterval[0]);
    this.y = Math.random() * (canvasHeight - 260) + 120;
  }

  update(soundEngine, particles) {
    super.update(soundEngine, particles);
    if (this.crashed) return;

    this.vy += this.gravity;
    this.y += this.vy;
    this.flapTimer++;

    if (this.flapTimer >= this.flapInterval || this.y > this.groundY - 32) {
      this.vy = this.flapPower;
      this.flapTimer = 0;
      if (this.x > 0 && this.x < this.canvasWidth) {
        soundEngine.playFlap();
      }
    }

    this.x += this.vx;
    this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.vy * 0.08));

    // Emit sparkling stars
    if (particles && this.frame % 3 === 0) {
      particles.push(new SparkleParticle(this.x, this.y, '#fef08a'));
    }
  }

  draw(ctx) {
    // Golden glow aura around bird
    ctx.save();
    ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    this.drawCommon(ctx);
  }
}
