// src/enemies.js - 🌟 みかど世界観 監修：全3ステージのザコ敵クラス群

// 🌟 2.5Dザコ敵共通の高度連動ドロップシャドウ（接地影）
function drawEnemyDropShadow(ctx, entity, cameraX) {
  const curStage = window.game ? window.game.stage : null;
  if (curStage && typeof curStage.getGroundYBelow === 'function') {
    const footX = entity.x + entity.width / 2;
    const footY = entity.y + entity.height;
    const groundY = curStage.getGroundYBelow(footX, footY);
    if (groundY !== null) {
      const dist = Math.max(0, groundY - footY);
      const factor = Math.max(0.25, 1 - dist / 200);
      const alpha = Math.max(0.06, 0.40 * (1 - dist / 240));
      ctx.save();
      ctx.translate(footX - cameraX, groundY);
      ctx.scale(factor, 0.24 * factor);
      ctx.fillStyle = `rgba(15, 15, 30, ${alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, entity.width * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}


// =============================================================================
// 🐾 ステージ1: 執事ネズミ（ButlerMouse）
// =============================================================================
class ButlerMouse {
  constructor(x, y, range = 180) {
    this.startX = x;
    this.x = x;
    this.y = y;
    this.width = 46;
    this.height = 44;
    this.vx = -1.3;
    this.range = range;
    this.isDead = false;
    this.deathTimer = 0;
    this.walkAnimTimer = Math.random() * 10;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.loadSprite();
  }

  loadSprite() {
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.onerror = (e) => { console.error('Failed to load mouse sprite:', e); };
    this.spriteImg.src = 'assets/mouse_spritesheet.png';
  }

  update(stage) {
    if (this.isDead) {
      this.deathTimer--;
      return;
    }

    this.walkAnimTimer++;
    this.x += this.vx;

    // 範囲・壁反転
    if (this.x < this.startX - this.range) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.startX + this.range) {
      this.vx = -Math.abs(this.vx);
    }

    // 崖反転
    const aheadX = this.vx > 0 ? this.x + this.width + 10 : this.x - 10;
    if (!stage.hasGroundAt(aheadX, this.y + this.height + 10)) {
      this.vx = -this.vx;
    }
  }

  defeat() {
    this.isDead = true;
    this.deathTimer = 30;
    window.sound.playEnemyDefeat();
    window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isDead && this.deathTimer <= 0) return;
    drawEnemyDropShadow(ctx, this, cameraX);

    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(this.vx >= 0 ? 1 : -1, 1);

    if (this.spriteLoaded && this.spriteImg) {
      if (this.isDead) {
        const sx = 1030; const sy = 260; const sw = 290; const sh = 245;
        const squashProgress = 1 - (this.deathTimer / 30);
        const renderW = 62 + squashProgress * 10;
        const renderH = Math.max(16, 36 - squashProgress * 18);

        ctx.drawImage(
          this.spriteImg,
          sx, sy, sw, sh,
          -renderW / 2, this.height / 2 - renderH, renderW, renderH
        );

        // 頭上にピヨピヨ星
        const starAngle = (30 - this.deathTimer) * 0.3;
        ctx.fillStyle = '#ffea00';
        for (let i = 0; i < 3; i++) {
          const a = starAngle + (i * Math.PI * 2 / 3);
          const starX = Math.cos(a) * 16;
          const starY = -12 + Math.sin(a) * 6;
          ctx.beginPath();
          ctx.arc(starX, starY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        const step = Math.floor(this.walkAnimTimer / 8) % 2;
        const sx = (step === 0) ? 60 : 375;
        const sy = 210;
        const sw = 275;
        const sh = 295;
        const walkBounce = (step === 0) ? 0 : 1.2;
        const renderW = 54;
        const renderH = 58;

        ctx.drawImage(
          this.spriteImg,
          sx, sy, sw, sh,
          -renderW / 2, -renderH / 2 + walkBounce, renderW, renderH
        );
      }
    } else {
      ctx.fillStyle = '#9e9e9e';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// =============================================================================
// 🛒 ステージ2: カート押しネズミ（CartMouse）
// =============================================================================
class CartMouse {
  constructor(x, y, range = 220) {
    this.startX = x;
    this.x = x;
    this.y = y;
    this.width = 56;
    this.height = 44;
    this.vx = -1.9; // 執事より少し速い突進！
    this.range = range;
    this.isDead = false;
    this.deathTimer = 0;
    this.animTimer = Math.random() * 10;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/mouse2_sheet.png';
  }

  update(stage) {
    if (this.isDead) {
      this.deathTimer--;
      return;
    }

    this.animTimer++;
    this.x += this.vx;

    // 範囲反転
    if (this.x < this.startX - this.range) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.startX + this.range) {
      this.vx = -Math.abs(this.vx);
    }

    // 崖反転
    const aheadX = this.vx > 0 ? this.x + this.width + 10 : this.x - 10;
    if (!stage.hasGroundAt(aheadX, this.y + this.height + 10)) {
      this.vx = -this.vx;
    }

    // カートの車輪火花エフェクト
    if (this.animTimer % 12 === 0 && Math.random() > 0.4) {
      window.particleManager.particles.push(new Particle(
        this.x + (this.vx > 0 ? 8 : this.width - 8),
        this.y + this.height - 2,
        -this.vx * 0.5,
        -1 - Math.random(),
        (Math.random() > 0.5 ? '#ff007f' : '#00f5d4'),
        3,
        12,
        'star'
      ));
    }
  }

  defeat() {
    this.isDead = true;
    this.deathTimer = 30;
    window.sound.playEnemyDefeat();
    window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isDead && this.deathTimer <= 0) return;
    drawEnemyDropShadow(ctx, this, cameraX);

    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(this.vx >= 0 ? 1 : -1, 1);

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 4;
      const rowH = sheetH;

      let col = 0;
      if (this.isDead) {
        col = 3; // ひっくり返りピヨピヨ気絶
      } else {
        const step = Math.floor(this.animTimer / 8) % 2;
        col = (step === 0) ? 0 : 1; // 軽快な歩行アニメーション
      }

      const renderW = 68;
      const renderH = 60;
      const sy = 220;
      const sh = 300;

      ctx.drawImage(
        this.spriteImg,
        col * colW, sy, colW, sh,
        -renderW / 2, -renderH / 2, renderW, renderH
      );
    } else {
      ctx.fillStyle = '#adb5bd';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// =============================================================================
// 🕰️ ステージ3: からくり時計ネズミ（ClockMouse）
// =============================================================================
class ClockMouse {
  constructor(x, y, range = 200) {
    this.startX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 46;
    this.vx = -1.4;
    this.range = range;
    this.isDead = false;
    this.deathTimer = 0;
    this.animTimer = Math.random() * 20;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/mouse3_sheet.png';
  }

  update(stage) {
    if (this.isDead) {
      this.deathTimer--;
      return;
    }

    this.animTimer++;
    this.x += this.vx;

    // 空中を優雅に上下ホバリング（波状飛行）
    this.y = this.baseY + Math.sin(this.animTimer * 0.07) * 26;

    // 左右反転
    if (this.x < this.startX - this.range) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.startX + this.range) {
      this.vx = -Math.abs(this.vx);
    }
  }

  defeat() {
    this.isDead = true;
    this.deathTimer = 30;
    window.sound.playEnemyDefeat();
    window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isDead && this.deathTimer <= 0) return;
    drawEnemyDropShadow(ctx, this, cameraX);

    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(this.vx >= 0 ? 1 : -1, 1);

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 4;
      const rowH = sheetH;

      let col = 0;
      if (this.isDead) {
        col = 3; // バネ飛び散りピヨピヨ気絶
      } else {
        const step = Math.floor(this.animTimer / 7) % 2;
        col = (step === 0) ? 0 : 1; // プロペラ回転・飛行アニメーション
      }

      const renderW = 64;
      const renderH = 76;
      const sy = 150;
      const sh = 420;

      ctx.drawImage(
        this.spriteImg,
        col * colW, sy, colW, sh,
        -renderW / 2, -renderH / 2, renderW, renderH
      );
    } else {
      ctx.fillStyle = '#6c757d';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// =============================================================================
// 🍳 ステージ4: シェフネズミ（ChefMouse）
// =============================================================================
class ChefMouse {
  constructor(x, y, range = 180) {
    this.startX = x;
    this.x = x;
    this.y = y;
    this.width = 46;
    this.height = 44;
    this.vx = -1.6;
    this.range = range;
    this.isDead = false;
    this.deathTimer = 0;
    this.animTimer = Math.random() * 10;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/mouse4_sheet.png';
  }

  update(stage) {
    if (this.isDead) {
      this.deathTimer--;
      return;
    }
    this.animTimer++;
    this.x += this.vx;

    if (this.x < this.startX - this.range) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.startX + this.range) {
      this.vx = -Math.abs(this.vx);
    }

    const aheadX = this.vx > 0 ? this.x + this.width + 10 : this.x - 10;
    if (stage && !stage.hasGroundAt(aheadX, this.y + this.height + 10)) {
      this.vx = -this.vx;
    }
  }

  defeat() {
    this.isDead = true;
    this.deathTimer = 30;
    if (window.sound) window.sound.playEnemyDefeat();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isDead && this.deathTimer <= 0) return;
    drawEnemyDropShadow(ctx, this, cameraX);
    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(this.vx >= 0 ? 1 : -1, 1);

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 4;
      const rowH = sheetH;

      let col = 0;
      if (this.isDead) {
        col = 3; // 気絶コマ
      } else {
        const step = Math.floor(this.animTimer / 8) % 2;
        col = (step === 0) ? 0 : 1; // 軽快な歩行アニメーション
      }

      const renderW = 64;
      const renderH = 65;
      const sy = 190;
      const sh = 350;

      ctx.drawImage(
        this.spriteImg,
        col * colW, sy, colW, sh,
        -renderW / 2, -renderH / 2, renderW, renderH
      );
    } else {
      ctx.fillStyle = '#adb5bd';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// =============================================================================
// 🏖️ ステージ5: 浮き輪ネズミ（TubeMouse）
// =============================================================================
class TubeMouse {
  constructor(x, y, range = 200) {
    this.startX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 44;
    this.vx = -1.5;
    this.vy = 0;
    this.range = range;
    this.isDead = false;
    this.deathTimer = 0;
    this.animTimer = Math.random() * 10;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/mouse5_sheet.png';
  }

  update(stage) {
    if (this.isDead) {
      this.deathTimer--;
      return;
    }
    this.animTimer++;
    this.x += this.vx;

    // Bounce
    this.vy += 0.2;
    this.y += this.vy;
    if (this.y >= this.baseY) {
      this.y = this.baseY;
      this.vy = -4.0;
      if (window.particleManager) {
        for (let i = 0; i < 3; i++) {
          window.particleManager.particles.push({
            x: this.x + this.width / 2,
            y: this.y + this.height,
            vx: (Math.random() - 0.5) * 2,
            vy: -1 - Math.random() * 2,
            color: '#00b4d8',
            life: 15,
            type: 'circle',
            update: function() { this.x += this.vx; this.y += this.vy; this.life--; },
            draw: function(ctx, cx) {
              if (this.life <= 0) return;
              ctx.fillStyle = this.color;
              ctx.globalAlpha = this.life / 15;
              ctx.beginPath();
              ctx.arc(this.x - cx, this.y, 2, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1.0;
            }
          });
        }
      }
    }

    if (this.x < this.startX - this.range) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.startX + this.range) {
      this.vx = -Math.abs(this.vx);
    }
  }

  defeat() {
    this.isDead = true;
    this.deathTimer = 30;
    if (window.sound) window.sound.playEnemyDefeat();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isDead && this.deathTimer <= 0) return;
    drawEnemyDropShadow(ctx, this, cameraX);
    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(this.vx >= 0 ? 1 : -1, 1);

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 4;
      const rowH = sheetH;

      let col = 0;
      if (this.isDead) {
        col = 3; // 気絶コマ
      } else {
        const step = Math.floor(this.animTimer / 8) % 2;
        col = (step === 0) ? 0 : 1; // ぷかぷか・パタパタ歩行/泳ぎアニメーション
      }

      const renderW = 66;
      const renderH = 70;
      const sy = 120;
      const sh = 440;

      ctx.drawImage(
        this.spriteImg,
        col * colW, sy, colW, sh,
        -renderW / 2, -renderH / 2, renderW, renderH
      );
    } else {
      ctx.fillStyle = '#00b4d8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// =============================================================================
// 👻 ステージ6: ゴーストネズミ（GhostMouse）
// =============================================================================
class GhostMouse {
  constructor(x, y, range = 200) {
    this.startX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.width = 46;
    this.height = 46;
    this.vx = -1.2;
    this.range = range;
    this.isDead = false;
    this.deathTimer = 0;
    this.animTimer = Math.random() * 20;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/mouse6_sheet.png';
  }

  update(stage) {
    if (this.isDead) {
      this.deathTimer--;
      return;
    }
    this.animTimer++;
    this.x += this.vx;
    this.y = this.baseY + Math.sin(this.animTimer * 0.05) * 20;

    if (this.x < this.startX - this.range) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.startX + this.range) {
      this.vx = -Math.abs(this.vx);
    }
  }

  defeat() {
    this.isDead = true;
    this.deathTimer = 30;
    if (window.sound) window.sound.playEnemyDefeat();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isDead && this.deathTimer <= 0) return;
    drawEnemyDropShadow(ctx, this, cameraX);
    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(this.vx >= 0 ? 1 : -1, 1);

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 4;
      const rowH = sheetH;

      let col = 0;
      if (this.isDead) {
        col = 3; // シーツ絡まり気絶コマ
      } else {
        const step = Math.floor(this.animTimer / 8) % 3;
        col = step; // オバケ〜構え・シーツたなびき・ニッコリ浮遊
      }

      const renderW = 64;
      const renderH = 64;
      const sy = 200;
      const sh = 340;

      ctx.drawImage(
        this.spriteImg,
        col * colW, sy, colW, sh,
        -renderW / 2, -renderH / 2, renderW, renderH
      );
    } else {
      ctx.fillStyle = '#f8f9fa';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// =============================================================================
// 🚀 ステージ7: スペースネズミ（SpaceMouse）
// =============================================================================
class SpaceMouse {
  constructor(x, y, range = 250) {
    this.startX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.vx = -2.0;
    this.range = range;
    this.isDead = false;
    this.deathTimer = 0;
    this.animTimer = Math.random() * 10;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/mouse7_sheet.png';
  }

  update(stage) {
    if (this.isDead) {
      this.deathTimer--;
      return;
    }
    this.animTimer++;
    this.x += this.vx;
    this.y = this.baseY + Math.sin(this.animTimer * 0.1) * 10;

    if (this.x < this.startX - this.range) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.startX + this.range) {
      this.vx = -Math.abs(this.vx);
    }

    if (this.animTimer % 4 === 0 && window.particleManager) {
      window.particleManager.particles.push({
        x: this.x + (this.vx > 0 ? 10 : this.width - 10),
        y: this.y + this.height - 10,
        vx: -this.vx * 0.2,
        vy: 2 + Math.random(),
        color: '#ff9f1c',
        life: 10,
        type: 'circle',
        update: function() { this.x += this.vx; this.y += this.vy; this.life--; },
        draw: function(ctx, cx) {
          if (this.life <= 0) return;
          ctx.fillStyle = this.color;
          ctx.globalAlpha = this.life / 10;
          ctx.beginPath();
          ctx.arc(this.x - cx, this.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      });
    }
  }

  defeat() {
    this.isDead = true;
    this.deathTimer = 30;
    if (window.sound) window.sound.playEnemyDefeat();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isDead && this.deathTimer <= 0) return;
    drawEnemyDropShadow(ctx, this, cameraX);
    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(this.vx >= 0 ? 1 : -1, 1);

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 4;
      const rowH = sheetH / 2; // 上下2行構成の上行を使用

      let col = 0;
      if (this.isDead) {
        col = 3; // 割れたヘルメット気絶コマ
      } else {
        const step = Math.floor(this.animTimer / 8) % 3;
        col = step; // 浮遊前進・ロケット噴射・光線銃構え
      }

      const renderW = 72;
      const renderH = 72;
      const padX = 6;
      const padY = 6;

      ctx.drawImage(
        this.spriteImg,
        col * colW + padX, padY, colW - padX * 2, rowH - padY * 2,
        -renderW / 2, -renderH / 2, renderW, renderH
      );
    } else {
      ctx.fillStyle = '#00b4d8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// =============================================================================
// 🛡️ ステージ8: ガードネズミ（GuardMouse）
// =============================================================================
class GuardMouse {
  constructor(x, y, range = 150) {
    this.startX = x;
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 50;
    this.vx = -1.0;
    this.range = range;
    this.isDead = false;
    this.deathTimer = 0;
    this.animTimer = Math.random() * 10;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/mouse8_sheet.png';
  }

  update(stage) {
    if (this.isDead) {
      this.deathTimer--;
      return;
    }
    this.animTimer++;
    this.x += this.vx;

    if (this.x < this.startX - this.range) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.startX + this.range) {
      this.vx = -Math.abs(this.vx);
    }

    const aheadX = this.vx > 0 ? this.x + this.width + 10 : this.x - 10;
    if (stage && !stage.hasGroundAt(aheadX, this.y + this.height + 10)) {
      this.vx = -this.vx;
    }
  }

  defeat() {
    this.isDead = true;
    this.deathTimer = 30;
    if (window.sound) window.sound.playEnemyDefeat();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isDead && this.deathTimer <= 0) return;
    drawEnemyDropShadow(ctx, this, cameraX);
    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(this.vx >= 0 ? 1 : -1, 1);

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 4;
      const rowH = sheetH / 2; // 上下2行の上行を使用

      let col = 0;
      if (this.isDead) {
        col = 3; // 兜ズレ気絶コマ
      } else {
        const step = Math.floor(this.animTimer / 8) % 3;
        col = step; // 行進歩行1・行進歩行2・盾構え
      }

      const renderW = 72;
      const renderH = 72;
      const padX = 6;
      const padY = 6;

      ctx.drawImage(
        this.spriteImg,
        col * colW + padX, padY, colW - padX * 2, rowH - padY * 2,
        -renderW / 2, -renderH / 2, renderW, renderH
      );
    } else {
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

window.ButlerMouse = ButlerMouse;
window.CartMouse = CartMouse;
window.ClockMouse = ClockMouse;
window.ChefMouse = ChefMouse;
window.TubeMouse = TubeMouse;
window.GhostMouse = GhostMouse;
window.SpaceMouse = SpaceMouse;
window.GuardMouse = GuardMouse;
