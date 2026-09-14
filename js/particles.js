/**
 * Particle Effects & Floating Notification Text System
 */

class FeatherParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 3.5 + 2.5;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6.0 + 2.0;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 1.8;
    this.rotation = Math.random() * Math.PI;
    this.vRot = (Math.random() - 0.5) * 0.25;
    this.alpha = 1.0;
    this.gravity = 0.15;
    this.friction = 0.95;
    this.decay = Math.random() * 0.02 + 0.012;
  }

  update() {
    this.vx *= this.friction;
    this.vy = this.vy * this.friction + this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vRot;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * 2.4, this.radius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class SparkleParticle {
  constructor(x, y, color = '#facc15') {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 4 + 2;
    this.vx = (Math.random() - 0.5) * 2.5;
    this.vy = (Math.random() - 0.5) * 2.5 - 0.8;
    this.alpha = 1.0;
    this.decay = Math.random() * 0.03 + 0.02;
    this.rotation = Math.random() * Math.PI;
    this.rotSpeed = 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    // Draw 4-point star sparkle
    const s = this.size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.25, -s * 0.25);
    ctx.lineTo(s, 0);
    ctx.lineTo(s * 0.25, s * 0.25);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.25, s * 0.25);
    ctx.lineTo(-s, 0);
    ctx.lineTo(-s * 0.25, -s * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

class SmokeParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 4 + 2;
    this.vx = -(Math.random() * 2 + 1);
    this.vy = (Math.random() - 0.5) * 1.2;
    this.alpha = 0.7;
    this.decay = 0.03;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.radius += 0.2;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FloatingText {
  constructor(x, y, text, color = '#facc15', fontSize = 15) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
    this.alpha = 1.0;
    this.vy = -1.6;
  }

  update() {
    this.y += this.vy;
    this.alpha -= 0.022;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.font = `bold ${this.fontSize}px "Press Start 2P", monospace`;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
