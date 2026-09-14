/**
 * Player-Controlled Pipe Class
 */

class PlayerPipe {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.groundY = CONFIG.CANVAS.GROUND_Y;

    this.x = CONFIG.PIPE.DEFAULT_X;
    this.width = CONFIG.PIPE.WIDTH;
    this.lipExtra = CONFIG.PIPE.LIP_EXTRA;
    this.lipHeight = CONFIG.PIPE.LIP_HEIGHT;

    this.gapSize = CONFIG.PIPE.DEFAULT_GAP;
    this.targetGapSize = CONFIG.PIPE.DEFAULT_GAP;
    this.gapY = canvasHeight / 2;
    this.targetGapY = canvasHeight / 2;

    this.speed = CONFIG.PIPE.SPEED;
    this.hitFlash = 0;
    this.glowColor = 'rgba(115, 191, 46, 0.4)';
  }

  resize(canvasWidth, canvasHeight, groundY) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.groundY = groundY;
    this.x = Math.max(260, Math.floor(canvasWidth * 0.68));
  }

  reset() {
    this.gapSize = CONFIG.PIPE.DEFAULT_GAP;
    this.targetGapSize = CONFIG.PIPE.DEFAULT_GAP;
    this.gapY = this.canvasHeight / 2;
    this.targetGapY = this.canvasHeight / 2;
    this.hitFlash = 0;
  }

  update() {
    // Smooth vertical gap interpolation
    this.gapY += (this.targetGapY - this.gapY) * 0.38;

    // Smooth gap expansion / deflation (when Mega Gap is active)
    this.gapSize += (this.targetGapSize - this.gapSize) * 0.15;

    if (this.hitFlash > 0) {
      this.hitFlash--;
    }
  }

  setTargetY(y) {
    const minY = CONFIG.PIPE.MIN_GAP_Y;
    const maxY = this.groundY - 30;
    this.targetGapY = Math.max(minY, Math.min(maxY, y));
  }

  moveBy(deltaY) {
    this.setTargetY(this.targetGapY + deltaY);
  }

  getHitboxes() {
    const halfGap = this.gapSize / 2;
    const topLipY = this.gapY - halfGap;
    const botLipY = this.gapY + halfGap;
    const groundY = this.groundY;

    const rects = [];

    // 1. Top pipe trunk (only if above y = 0)
    const topTrunkH = topLipY - this.lipHeight;
    if (topTrunkH > 0) {
      rects.push({
        x: this.x,
        y: 0,
        w: this.width,
        h: topTrunkH
      });
    }

    // 2. Top pipe rim/lip (only if on screen)
    if (topLipY > 0) {
      const lipY = Math.max(0, topLipY - this.lipHeight);
      const lipH = topLipY - lipY;
      if (lipH > 0) {
        rects.push({
          x: this.x - this.lipExtra,
          y: lipY,
          w: this.width + this.lipExtra * 2,
          h: lipH
        });
      }
    }

    // 3. Bottom pipe rim/lip (only if above ground)
    if (botLipY < groundY) {
      const lipEndY = Math.min(groundY, botLipY + this.lipHeight);
      const lipH = lipEndY - botLipY;
      if (lipH > 0) {
        rects.push({
          x: this.x - this.lipExtra,
          y: botLipY,
          w: this.width + this.lipExtra * 2,
          h: lipH
        });
      }
    }

    // 4. Bottom pipe trunk (only if above ground)
    const botTrunkY = botLipY + this.lipHeight;
    if (botTrunkY < groundY) {
      rects.push({
        x: this.x,
        y: botTrunkY,
        w: this.width,
        h: groundY - botTrunkY
      });
    }

    return rects;
  }

  drawSegment(ctx, rx, ry, rw, rh, isLip, isHit, hp) {
    if (rh <= 0) return;

    ctx.save();

    let baseColor = '#73bf2e';
    let lightColor = '#9de64e';
    let highlightColor = '#defa8c';
    let darkColor = '#558022';
    let deepDarkColor = '#2e6f1f';

    if (isHit) {
      baseColor = '#ef4444';
      lightColor = '#f87171';
      highlightColor = '#fca5a5';
      darkColor = '#b91c1c';
      deepDarkColor = '#7f1d1d';
    }

    ctx.fillStyle = baseColor;
    ctx.fillRect(rx, ry, rw, rh);

    ctx.fillStyle = lightColor;
    ctx.fillRect(rx + 6, ry, 12, rh);

    ctx.fillStyle = highlightColor;
    ctx.fillRect(rx + 8, ry, 4, rh);

    ctx.fillStyle = darkColor;
    ctx.fillRect(rx + rw - 18, ry, 14, rh);

    ctx.fillStyle = deepDarkColor;
    ctx.fillRect(rx + rw - 6, ry, 6, rh);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(rx, ry, rw, rh);

    // Damage cracks on lower HP
    if (hp <= 3 && rh > 40) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rx + rw * 0.3, ry + rh * 0.4);
      ctx.lineTo(rx + rw * 0.5, ry + rh * 0.45);
      ctx.lineTo(rx + rw * 0.4, ry + rh * 0.6);
      ctx.stroke();
    }
    if (hp <= 1 && rh > 40) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(rx + rw * 0.7, ry + rh * 0.2);
      ctx.lineTo(rx + rw * 0.6, ry + rh * 0.35);
      ctx.lineTo(rx + rw * 0.75, ry + rh * 0.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  draw(ctx, hp, isBoosted = false) {
    const halfGap = this.gapSize / 2;
    const topLipY = this.gapY - halfGap;
    const botLipY = this.gapY + halfGap;
    const isHit = this.hitFlash > 0;

    // 1. Top pipe trunk
    const topTrunkH = topLipY - this.lipHeight;
    if (topTrunkH > 0) {
      this.drawSegment(ctx, this.x, 0, this.width, topTrunkH, false, isHit, hp);
    }

    // 2. Top pipe rim
    this.drawSegment(
      ctx,
      this.x - this.lipExtra,
      topLipY - this.lipHeight,
      this.width + this.lipExtra * 2,
      this.lipHeight,
      true,
      isHit,
      hp
    );

    // 3. Bottom pipe rim
    this.drawSegment(
      ctx,
      this.x - this.lipExtra,
      botLipY,
      this.width + this.lipExtra * 2,
      this.lipHeight,
      true,
      isHit,
      hp
    );

    // 4. Bottom pipe trunk
    const botTrunkH = Math.max(0, this.canvasHeight - (botLipY + this.lipHeight));
    if (botTrunkH > 0) {
      this.drawSegment(
        ctx,
        this.x,
        botLipY + this.lipHeight,
        this.width,
        botTrunkH,
        false,
        isHit,
        hp
      );
    }

    // Alignment Guide Beam
    ctx.save();
    if (isBoosted) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 3;
    } else {
      ctx.strokeStyle = this.glowColor;
      ctx.lineWidth = 2;
    }
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(this.x - 45, this.gapY);
    ctx.lineTo(this.x + this.width + 45, this.gapY);
    ctx.stroke();

    // Laser beam between top and bottom lips
    ctx.fillStyle = isBoosted ? 'rgba(56, 189, 248, 0.08)' : 'rgba(74, 222, 128, 0.05)';
    ctx.fillRect(this.x - this.lipExtra, topLipY, this.width + this.lipExtra * 2, this.gapSize);

    ctx.restore();
  }
}
