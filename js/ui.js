/**
 * UI & HUD Controller - Authentic Retro Arcade Experience with Vector Icons
 */

class UIManager {
  constructor(game) {
    this.game = game;

    // Screens & Modals
    this.startScreen = document.getElementById('start-screen');
    this.gameOverScreen = document.getElementById('gameover-screen');
    this.pauseScreen = document.getElementById('pause-screen');
    this.statsModal = document.getElementById('stats-modal');
    this.guideModal = document.getElementById('guide-modal');

    // Action Buttons
    this.startBtn = document.getElementById('start-btn');
    this.restartBtn = document.getElementById('restart-btn');
    this.resumeBtn = document.getElementById('resume-btn');
    this.pauseBtn = document.getElementById('pause-btn');
    this.sfxBtn = document.getElementById('sfx-toggle');
    this.bgmBtn = document.getElementById('bgm-toggle');
    this.statsBtn = document.getElementById('stats-btn');
    this.guideBtn = document.getElementById('guide-btn');
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
    this.closeStatsBtn = document.getElementById('close-stats-btn');
    this.closeGuideBtn = document.getElementById('close-guide-btn');

    // Scoreboard elements
    this.finalScoreEl = document.getElementById('final-score');
    this.highScoreEl = document.getElementById('high-score');
    this.newHighBadge = document.getElementById('new-high-badge');
    this.medalIconEl = document.getElementById('medal-icon');

    // Career Stats DOM
    this.statTotalSaved = document.getElementById('stat-total-saved');
    this.statBestScore = document.getElementById('stat-best-score');
    this.statBestCombo = document.getElementById('stat-best-combo');
    this.statGoldenRescued = document.getElementById('stat-golden-rescued');

    this.loadStats();
    this.bindEvents();
    this.updateControlIcons();
  }

  loadStats() {
    this.stats = {
      highScore: Number.parseInt(localStorage.getItem('rfb_high_score') || '0', 10),
      totalSaved: Number.parseInt(localStorage.getItem('rfb_total_saved') || '0', 10),
      bestCombo: Number.parseInt(localStorage.getItem('rfb_best_combo') || '0', 10),
      goldenRescued: Number.parseInt(localStorage.getItem('rfb_golden_rescued') || '0', 10),
      gamesPlayed: Number.parseInt(localStorage.getItem('rfb_games_played') || '0', 10)
    };
  }

  saveStats() {
    localStorage.setItem('rfb_high_score', this.stats.highScore);
    localStorage.setItem('rfb_total_saved', this.stats.totalSaved);
    localStorage.setItem('rfb_best_combo', this.stats.bestCombo);
    localStorage.setItem('rfb_golden_rescued', this.stats.goldenRescued);
    localStorage.setItem('rfb_games_played', this.stats.gamesPlayed);
  }

  getIconSVG(type) {
    switch (type) {
      case 'fullscreen-enter':
        return '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
      case 'fullscreen-exit':
        return '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';
      case 'sfx-on':
        return '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      case 'sfx-off':
        return '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
      case 'bgm-on':
        return '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>';
      case 'bgm-off':
        return '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.73 4.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2V7z"/></svg>';
      default:
        return '';
    }
  }

  updateControlIcons() {
    if (this.sfxBtn) {
      this.sfxBtn.innerHTML = this.getIconSVG(this.game.sound.sfxMuted ? 'sfx-off' : 'sfx-on');
    }
    if (this.bgmBtn) {
      this.bgmBtn.innerHTML = this.getIconSVG(this.game.sound.bgmMuted ? 'bgm-off' : 'bgm-on');
    }
    if (this.fullscreenBtn) {
      this.fullscreenBtn.innerHTML = this.getIconSVG(document.fullscreenElement ? 'fullscreen-exit' : 'fullscreen-enter');
    }
  }

  bindEvents() {
    this.startBtn?.addEventListener('click', () => this.game.startGame());
    this.restartBtn?.addEventListener('click', () => this.game.startGame());
    this.resumeBtn?.addEventListener('click', () => this.game.togglePause());

    this.pauseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.game.togglePause();
    });

    this.fullscreenBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFullscreen();
    });

    this.sfxBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.game.sound.init();
      this.game.sound.sfxMuted = !this.game.sound.sfxMuted;
      this.updateControlIcons();
    });

    this.bgmBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.game.sound.init();
      this.game.sound.bgmMuted = !this.game.sound.bgmMuted;
      this.updateControlIcons();
    });

    this.statsBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showStats();
    });

    this.guideBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.guideModal.classList.remove('hidden');
    });

    this.closeStatsBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.statsModal.classList.add('hidden');
    });

    this.closeGuideBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.guideModal.classList.add('hidden');
    });

    document.addEventListener('fullscreenchange', () => {
      this.updateControlIcons();
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    setTimeout(() => this.updateControlIcons(), 80);
  }

  showStats() {
    this.statTotalSaved.textContent = this.stats.totalSaved;
    this.statBestScore.textContent = this.stats.highScore;
    this.statBestCombo.textContent = this.stats.bestCombo;
    this.statGoldenRescued.textContent = this.stats.goldenRescued;
    this.statsModal.classList.remove('hidden');
  }

  updateCombo(_combo) {
    // Handled in canvas drawHUD
  }

  showStart() {
    this.startScreen.classList.remove('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
  }

  showPlaying() {
    this.startScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
    this.statsModal.classList.add('hidden');
    this.guideModal.classList.add('hidden');
  }

  showPause() {
    this.pauseScreen.classList.remove('hidden');
  }

  hidePause() {
    this.pauseScreen.classList.add('hidden');
  }

  getMedal(score) {
    for (const m of CONFIG.MEDALS) {
      if (score >= m.min) return m;
    }
    return null;
  }

  showGameOver(score, maxCombo) {
    this.stats.gamesPlayed++;
    this.stats.totalSaved += score;
    if (maxCombo > this.stats.bestCombo) {
      this.stats.bestCombo = maxCombo;
    }

    const isNewHigh = score > this.stats.highScore;
    if (isNewHigh) {
      this.stats.highScore = score;
      this.newHighBadge.classList.remove('hidden');
    } else {
      this.newHighBadge.classList.add('hidden');
    }

    this.saveStats();

    // Vector Medal Award
    const medal = this.getMedal(score);
    if (medal && this.medalIconEl) {
      this.medalIconEl.style.background = medal.color;
      this.medalIconEl.style.borderColor = medal.border;
      this.medalIconEl.innerHTML = `<span style="color:${medal.starColor}; text-shadow:1px 1px 0 rgba(0,0,0,0.6); font-size:26px;">★</span>`;
    } else if (this.medalIconEl) {
      this.medalIconEl.style.background = '#cbbd75';
      this.medalIconEl.style.borderColor = '#54381e';
      this.medalIconEl.innerHTML = '<span style="color:#54381e; font-size:24px;">—</span>';
    }

    this.finalScoreEl.textContent = score;
    this.highScoreEl.textContent = this.stats.highScore;
    this.gameOverScreen.classList.remove('hidden');
  }

  drawHUD(ctx, score, hp, maxHp, powerupTimer, powerupType, combo, width) {
    ctx.save();

    // 1. Classic Flappy Giant Center Score
    ctx.textAlign = 'center';
    ctx.font = 'bold clamp(32px, 5vw, 46px) "Press Start 2P", monospace';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(score.toString(), width / 2, 65);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(score.toString(), width / 2, 65);

    // 2. Active Combo Indicator (under main score)
    if (combo >= 2) {
      ctx.font = 'bold 13px "Press Start 2P", monospace';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(`★ ${combo}x STREAK ★`, width / 2, 92);
      ctx.fillStyle = '#facc15';
      ctx.fillText(`★ ${combo}x STREAK ★`, width / 2, 92);
    }

    // 3. Top-Left Retro HP Badge (Hearts)
    const badgeX = 18;
    const badgeY = 16;
    const badgeW = 150;
    const badgeH = 34;

    // Background pill
    ctx.fillStyle = '#ded895';
    ctx.strokeStyle = '#54381e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
    } else {
      ctx.rect(badgeX, badgeY, badgeW, badgeH);
    }
    ctx.fill();
    ctx.stroke();

    // 5 Hearts inside pill
    for (let i = 0; i < maxHp; i++) {
      const hx = badgeX + 12 + i * 26;
      const hy = badgeY + 10;
      const isAlive = i < hp;
      this.drawPixelHeart(ctx, hx, hy, isAlive);
    }

    // 4. Active Powerup Countdown Banner
    if (powerupTimer > 0 && powerupType) {
      const pBoxW = 200;
      const pBoxX = width / 2 - pBoxW / 2;
      const pBoxY = combo >= 2 ? 104 : 84;

      ctx.fillStyle = '#ded895';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(pBoxX, pBoxY, pBoxW, 26, 4);
      } else {
        ctx.rect(pBoxX, pBoxY, pBoxW, 26);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0284c7';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillText(`MEGA GAP ${(powerupTimer / 60).toFixed(1)}s`, width / 2, pBoxY + 17);
    }

    ctx.restore();
  }

  drawPixelHeart(ctx, x, y, isAlive) {
    ctx.save();
    ctx.fillStyle = isAlive ? '#e52521' : '#a89d6e';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(x + 9, y + 14);
    ctx.bezierCurveTo(x + 1, y + 7, x, y, x + 6, y);
    ctx.bezierCurveTo(x + 9, y, x + 9, y + 3, x + 9, y + 3);
    ctx.bezierCurveTo(x + 9, y + 3, x + 9, y, x + 12, y);
    ctx.bezierCurveTo(x + 18, y, x + 17, y + 7, x + 9, y + 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (isAlive) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + 5, y + 3, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
