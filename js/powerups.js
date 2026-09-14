/**
 * Collectible Power-Ups System with Canvas Vector/Pixel Icons
 */

class PowerUp {
  constructor(type, canvasWidth, canvasHeight) {
    this.type = type;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.groundY = CONFIG.CANVAS.GROUND_Y;

    this.x = -40;
    this.baseY = Math.random() * (canvasHeight - 320) + 160;
    this.y = this.baseY;
    this.vx = 2.4;
    this.frame = 0;
    this.radius = 18;
    this.collected = false;

    if (type === 'repair') {
      this.color = CONFIG.POWERUPS.REPAIR.color;
      this.name = CONFIG.POWERUPS.REPAIR.name;
    } else {
      this.color = CONFIG.POWERUPS.MEGA_GAP.color;
      this.name = CONFIG.POWERUPS.MEGA_GAP.name;
    }
  }

  update() {
    this.frame++;
    this.x += this.vx;
    this.y = this.baseY + Math.sin(this.frame * 0.06) * 18;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Glowing circle behind icon
    const pulse = Math.sin(this.frame * 0.1) * 3;
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 6 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Bubble badge
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw Vector/Pixel Icon
    ctx.globalAlpha = 1.0;
    if (this.type === 'repair') {
      // Wrench Icon
      ctx.save();
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;

      // Handle
      ctx.fillRect(-2.5, -2, 5, 12);
      ctx.strokeRect(-2.5, -2, 5, 12);

      // Head
      ctx.beginPath();
      ctx.arc(0, -5, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Jaw cutout
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-2, -9, 4, 4.5);
      ctx.restore();
    } else {
      // Lightning Bolt Icon
      ctx.save();
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(1, -9);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-0.5, 0);
      ctx.lineTo(-2.5, 9);
      ctx.lineTo(6, -1);
      ctx.lineTo(1, -1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}
