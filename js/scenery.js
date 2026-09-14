/**
 * Parallax Scenery & Dynamic Time-of-Day System
 * Implements mathematically seamless, infinite parallax scrolling for all layers.
 */

class Scenery {
  constructor(canvasWidth, canvasHeight, groundY) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.groundY = groundY || (canvasHeight - 75);

    // Independent layer offsets (each layer tracks its own sub-pixel offset)
    this.cloudOffset = 0;
    this.cityOffset = 0;
    this.treeOffset = 0;
    this.groundOffset = 0;

    // Layer repeat periods (in pixels)
    this.cloudPeriod = 360;
    this.treePeriod = 42;
    this.groundPeriod = 36;

    this.initElements();
  }

  initElements() {
    // Generate star field
    this.stars = [];
    const starCount = Math.max(30, Math.floor(this.width / 18));
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.groundY - 100),
        size: Math.random() * 2 + 1,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    // Build a fixed, repeating modular city block pattern
    this.cityBuildings = [
      { width: 44, height: 65, hasWindows: true },
      { width: 36, height: 95, hasWindows: true },
      { width: 50, height: 50, hasWindows: false },
      { width: 40, height: 80, hasWindows: true },
      { width: 48, height: 110, hasWindows: true },
      { width: 34, height: 60, hasWindows: false },
      { width: 52, height: 75, hasWindows: true },
      { width: 38, height: 100, hasWindows: true },
      { width: 46, height: 55, hasWindows: false },
      { width: 42, height: 90, hasWindows: true },
      { width: 54, height: 70, hasWindows: true },
      { width: 36, height: 105, hasWindows: true }
    ];

    // Calculate exact period of city tile (width of all buildings + gaps)
    this.cityPeriod = 0;
    for (const b of this.cityBuildings) {
      this.cityPeriod += b.width + 8;
    }
  }

  resize(width, height, groundY) {
    this.width = width;
    this.height = height;
    this.groundY = groundY;
    this.initElements();
  }

  update() {
    // Smooth continuous accumulation wrapped exactly at each layer's own period
    this.cloudOffset = (this.cloudOffset + 0.35) % this.cloudPeriod;
    this.cityOffset = (this.cityOffset + 0.7) % this.cityPeriod;
    this.treeOffset = (this.treeOffset + 1.4) % this.treePeriod;
    this.groundOffset = (this.groundOffset + 2.5) % this.groundPeriod;
  }

  getCurrentTheme(score) {
    if (score < 15) {
      return { theme: CONFIG.THEMES.DAY, blend: 0, nextTheme: CONFIG.THEMES.SUNSET };
    } else if (score < 35) {
      const t = (score - 15) / 20;
      return { theme: CONFIG.THEMES.SUNSET, blend: t, nextTheme: CONFIG.THEMES.NIGHT };
    } else {
      return { theme: CONFIG.THEMES.NIGHT, blend: 1, nextTheme: CONFIG.THEMES.NIGHT };
    }
  }

  drawSky(ctx, score) {
    const { theme } = this.getCurrentTheme(score);

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.groundY);
    skyGrad.addColorStop(0, theme.skyTop);
    skyGrad.addColorStop(0.65, theme.skyMid);
    skyGrad.addColorStop(1, theme.skyBottom);

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.groundY);

    // 2. Stars (Sunset / Night)
    if (theme.starsAlpha > 0) {
      ctx.save();
      const time = performance.now() * 0.003;
      for (const s of this.stars) {
        const starAlpha = Math.max(0, (Math.sin(time + s.twinklePhase) * 0.4 + 0.6) * theme.starsAlpha);
        ctx.globalAlpha = starAlpha;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      ctx.restore();
    }

    // 3. Seamless Distant Clouds
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${theme.cloudAlpha})`;
    const cloudStartX = -this.cloudOffset;
    for (let cx = cloudStartX - this.cloudPeriod; cx < this.width + this.cloudPeriod; cx += this.cloudPeriod) {
      this.drawCloud(ctx, cx, 115, 48);
      this.drawCloud(ctx, cx + 180, 65, 36);
    }
    ctx.restore();

    // 4. Seamless City Skyline (Tiled)
    ctx.save();
    ctx.fillStyle = theme.cityColor;
    const cityStartX = -this.cityOffset;
    for (let tileX = cityStartX - this.cityPeriod; tileX < this.width + this.cityPeriod; tileX += this.cityPeriod) {
      let bx = tileX;
      for (const b of this.cityBuildings) {
        // Only draw if within visible range
        if (bx + b.width > -50 && bx < this.width + 50) {
          ctx.fillRect(bx, this.groundY - b.height, b.width, b.height);

          // Night glowing windows
          if (theme.starsAlpha > 0.4 && b.hasWindows) {
            ctx.fillStyle = '#fef08a';
            for (let wy = this.groundY - b.height + 10; wy < this.groundY - 10; wy += 14) {
              ctx.fillRect(bx + 6, wy, 4, 5);
              ctx.fillRect(bx + b.width - 10, wy, 4, 5);
            }
            ctx.fillStyle = theme.cityColor;
          }
        }
        bx += b.width + 8;
      }
    }
    ctx.restore();

    // 5. Seamless Green Bush / Tree Layer
    ctx.save();
    ctx.fillStyle = theme.treeColor;
    const treeStartX = -this.treeOffset;
    for (let tx = treeStartX - this.treePeriod * 2; tx < this.width + this.treePeriod * 2; tx += this.treePeriod) {
      ctx.beginPath();
      ctx.arc(tx, this.groundY, 26, Math.PI, 0);
      ctx.fill();
    }
    ctx.restore();
  }

  drawCloud(ctx, x, y, s) {
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.arc(x + s * 0.7, y - s * 0.2, s * 0.8, 0, Math.PI * 2);
    ctx.arc(x + s * 1.4, y, s * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGround(ctx) {
    const groundY = this.groundY;

    // Ground body
    ctx.fillStyle = '#ded895';
    ctx.fillRect(0, groundY, this.width, this.height - groundY);

    // Grass top rim
    ctx.fillStyle = '#73bf2e';
    ctx.fillRect(0, groundY, this.width, 14);
    ctx.fillStyle = '#558022';
    ctx.fillRect(0, groundY + 14, this.width, 4);

    // Ground decorative diagonal slashes (Seamless)
    ctx.strokeStyle = '#cbbd75';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const groundStartX = -this.groundOffset;
    for (let sx = groundStartX - this.groundPeriod * 2; sx < this.width + this.groundPeriod * 2; sx += this.groundPeriod) {
      ctx.moveTo(sx, groundY + 22);
      ctx.lineTo(sx - 12, this.height);
    }
    ctx.stroke();

    // Crisp separator line at top of ground
    ctx.strokeStyle = '#2e6f1f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(this.width, groundY);
    ctx.stroke();
  }
}
