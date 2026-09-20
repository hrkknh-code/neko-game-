// src/boss.js - 🌟 みかど世界観 監修：全8ステージのボス＆弾幕システム

// ボスの足元に自然な接地感と立体感を与える動的アンビエントシャドウ
function drawBossShadow(ctx, x, y, width, height, cameraX, isAir = false) {
  ctx.save();
  const curStage = window.game ? window.game.stage : null;
  const footX = x + width / 2;
  const footY = y + height;
  let targetGroundY = (curStage && typeof curStage.getGroundYBelow === 'function')
    ? curStage.getGroundYBelow(footX, footY)
    : 460;
  if (targetGroundY === null) targetGroundY = 460;

  let shadowY, shadowW, shadowH, shadowAlpha;

  if (isAir) {
    // 浮遊ボス（宇宙・洋館・時計塔など）
    const dist = Math.max(0, targetGroundY - footY);
    const factor = Math.max(0.3, 1 - dist / 350);
    shadowY = targetGroundY;
    shadowW = (width * 0.70) * factor;
    shadowH = 14 * factor;
    shadowAlpha = 0.28 * factor;
  } else {
    // 地面ボス（成金ボス、板前、サーフ番長など）
    const dist = Math.max(0, targetGroundY - footY);
    const factor = Math.max(0.35, 1 - dist / 240);
    shadowY = targetGroundY;
    shadowW = (width * 0.78) * factor;
    shadowH = 14 * factor;
    shadowAlpha = 0.38 * factor;
  }

  ctx.translate(footX - cameraX, shadowY);
  ctx.fillStyle = `rgba(10, 10, 25, ${shadowAlpha})`;
  ctx.beginPath();
  ctx.ellipse(0, 0, shadowW / 2, shadowH / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// =============================================================================
// 🐟 ステージ1弾: 黄金たい焼きスナック弾
// =============================================================================
class TaiyakiBullet {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = 28;
    this.height = 22;
    this.rotation = 0;
    this.isDead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.14;
    this.rotation += 0.12;
    if (this.y > CONSTANTS.CANVAS_HEIGHT + 50) {
      this.isDead = true;
    }
  }

  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x + this.width / 2 - cameraX, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.lineTo(-19, -7);
    ctx.lineTo(-19, 7);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#e09f00';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-2, 0, 5, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(7, -2, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// =============================================================================
// 🛍️ ステージ2弾: 爆買いショッピングバッグ弾
// =============================================================================
class ShoppingBagBullet {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = 30;
    this.height = 30;
    this.rotation = 0;
    this.isDead = false;
    this.color = (Math.random() > 0.5) ? '#ff007f' : '#00f5d4';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.12;
    this.rotation += 0.10;
    if (this.y > CONSTANTS.CANVAS_HEIGHT + 50) {
      this.isDead = true;
    }

    // 飛翔中のキラキラ紙吹雪
    if (Math.random() < 0.25) {
      window.particleManager.particles.push(new Particle(
        this.x + this.width / 2,
        this.y + this.height / 2,
        -this.vx * 0.2,
        -0.5,
        this.color,
        3,
        10,
        'star'
      ));
    }
  }

  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x + this.width / 2 - cameraX, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;

    // プレゼント箱／ブランドバッグ
    ctx.fillStyle = this.color;
    ctx.fillRect(-12, -12, 24, 24);

    // リボンの十字掛け
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -12, 6, 24);
    ctx.fillRect(-12, -3, 24, 6);

    // てっぺんのリボン結び
    ctx.beginPath();
    ctx.arc(-5, -14, 4, 0, Math.PI * 2);
    ctx.arc(5, -14, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// =============================================================================
// 💎 ステージ3弾: ダイヤモンドケーン光弾
// =============================================================================
class DiamondCaneBullet {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = 26;
    this.height = 26;
    this.rotation = 0;
    this.isDead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += 0.15;
    if (this.y > CONSTANTS.CANVAS_HEIGHT + 80 || this.y < -200 || this.x < -100 || this.x > 5400) {
      this.isDead = true;
    }

    // 金の残光パーティクル
    if (Math.random() < 0.35) {
      window.particleManager.particles.push(new Particle(
        this.x + this.width / 2,
        this.y + this.height / 2,
        -this.vx * 0.15,
        -this.vy * 0.15,
        '#ffea00',
        3.5,
        12,
        'star'
      ));
    }
  }

  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x + this.width / 2 - cameraX, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    ctx.shadowColor = '#00f5d4';
    ctx.shadowBlur = 14;

    // ひし形ダイヤモンド
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(11, 0);
    ctx.lineTo(0, 12);
    ctx.lineTo(-11, 0);
    ctx.closePath();
    ctx.fill();

    // ゴールドカットライン
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.restore();
  }
}

// =============================================================================
// 👑 ステージ1ボス: おしゃまなぜいたくボスねこ（LuxuryBossCat）
// =============================================================================
class LuxuryBossCat {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = 130;
    this.height = 130;
    this.maxHp = CONSTANTS.BOSS.MAX_HP;
    this.hp = this.maxHp;

    this.timer = 0;
    this.attackCooldown = 90;
    this.bullets = [];
    this.isDead = false;
    this.damageFlash = 0;

    this.motionState = 'idle';
    this.motionTimer = 0;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.loadSprite();
  }

  loadSprite() {
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.onerror = (e) => { console.error('Failed to load boss sprite:', e); };
    this.spriteImg.src = 'assets/boss_sheet.png';
  }

  update(player) {
    if (this.isDead) return;

    this.timer++;
    if (this.damageFlash > 0) this.damageFlash--;
    if (this.motionTimer > 0) {
      this.motionTimer--;
      if (this.motionTimer === 0 && this.motionState !== 'idle') {
        this.motionState = (this.isRaging()) ? 'rage' : 'idle';
      }
    }

    const isRage = this.isRaging();
    const floatSpeed = isRage ? 0.055 : CONSTANTS.BOSS.FLOAT_SPEED;
    const floatRange = isRage ? 45 : 35;
    this.y = this.startY + Math.sin(this.timer * floatSpeed) * floatRange;
    this.x = this.startX + Math.cos(this.timer * (isRage ? 0.035 : 0.02)) * (isRage ? 65 : 50);

    this.attackCooldown--;
    if (this.attackCooldown <= 0) {
      this.attackCooldown = isRage ? 80 : CONSTANTS.BOSS.ATTACK_INTERVAL;
      this.shootAtPlayer(player, isRage);
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update();
      if (b.isDead) {
        this.bullets.splice(i, 1);
      }
    }
  }

  isRaging() {
    return this.hp <= this.maxHp * 0.5 && !this.isDead;
  }

  shootAtPlayer(player, isRage) {
    this.motionState = 'throw';
    this.motionTimer = 22;

    const originX = this.x + 20;
    const originY = this.y + this.height * 0.45;
    const dx = (player.x + player.width / 2) - originX;
    const speedX = Math.max(-6.5, Math.min(-2.5, dx * 0.015));
    const speedY = -4.5 - Math.random() * 2;

    this.bullets.push(new TaiyakiBullet(originX, originY, speedX, speedY));
    window.sound.playScratch();

    if (isRage) {
      setTimeout(() => {
        if (!this.isDead) {
          this.bullets.push(new TaiyakiBullet(originX, originY - 10, speedX * 1.15, speedY - 1.5));
          window.sound.playScratch();
        }
      }, 250);
    }
  }

  takeDamage(amount = 1) {
    if (this.isDead || this.damageFlash > 0) return false;
    this.hp -= amount;
    this.damageFlash = 25;
    window.sound.playBossHit();
    window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);

    if (this.hp <= 0) {
      this.defeat();
    } else if (this.isRaging() && this.motionState !== 'rage') {
      this.motionState = 'rage';
    }
    return true;
  }

  defeat() {
    this.isDead = true;
    this.motionState = 'defeat';
    this.bullets = [];
    window.sound.playVictory();
    window.particleManager.createConfetti(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    for (const b of this.bullets) {
      b.draw(ctx, cameraX);
    }

    if (!this.isDead) {
      drawBossShadow(ctx, this.x, this.y, this.width, this.height, cameraX);
    }

    ctx.save();
    let shakeX = 0;
    let shakeY = 0;
    if (this.damageFlash > 0) {
      shakeX = (Math.random() - 0.5) * 12;
      shakeY = (Math.random() - 0.5) * 12;
    }

    const centerX = this.x + this.width / 2 - cameraX + shakeX;
    const centerY = this.y + this.height / 2 + shakeY;
    ctx.translate(centerX, centerY);

    if (this.damageFlash > 0 && Math.floor(this.damageFlash / 3) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    if (!this.isDead) {
      const breath = Math.sin(this.timer * 0.07);
      const scaleX = 1 + breath * 0.03;
      const scaleY = 1 - breath * 0.03;
      ctx.scale(scaleX, scaleY);
    }

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 3;
      const rowH = sheetH / 2;

      let col = 0;
      let row = 0;

      if (this.isDead || this.motionState === 'defeat') {
        col = 2; row = 1; // やられ（ノックダウン）
      } else if (this.motionState === 'throw') {
        col = 1;
        row = (this.isRaging() || this.motionState === 'rage') ? 1 : 0; // 攻撃時（咆哮＆ベル・ワイン構え）
      } else if (this.isRaging() || this.motionState === 'rage') {
        col = 0; row = 1; // 激怒モード（牙剥き咆哮＆紫炎オーラ）
      } else {
        // 通常時: 待機とあざ笑いをゆるやかにアニメーション
        const step = Math.floor(this.timer / 45) % 3;
        col = (step === 1) ? 2 : 0;
        row = 0;
      }

      const sx = col * colW;
      const sy = row * rowH;
      const renderSize = this.width * 1.55;

      ctx.drawImage(
        this.spriteImg,
        sx, sy, colW, rowH,
        -renderSize / 2, -renderSize / 2, renderSize, renderSize
      );
    } else {
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    if (!this.isDead) {
      this.drawBossHpBar(ctx);
    }
  }

  drawBossHpBar(ctx) {
    const barWidth = 280;
    const barHeight = 18;
    const x = (CONSTANTS.CANVAS_WIDTH - barWidth) / 2;
    const y = 26;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);
    ctx.fillStyle = '#444';
    ctx.fillRect(x, y, barWidth, barHeight);

    const fillWidth = Math.max(0, (this.hp / this.maxHp) * barWidth);
    const grad = ctx.createLinearGradient(x, y, x + barWidth, y);
    if (this.isRaging()) {
      grad.addColorStop(0, '#ff0054');
      grad.addColorStop(1, '#ff5400');
    } else {
      grad.addColorStop(0, '#ff4d6d');
      grad.addColorStop(1, '#ffd166');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, fillWidth, barHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY;
    ctx.textAlign = 'center';
    const bossTitle = this.isRaging() ? '🔥 激おこ！おしゃまなぜいたくボスねこ 🔥' : '👑 BOSS: おしゃまなぜいたくボスねこ';
    ctx.fillText(bossTitle, CONSTANTS.CANVAS_WIDTH / 2, y - 8);
  }
}

// =============================================================================
// 🛍️ ステージ2ボス: 暴走セレブねこ レディ・ミャウミャウ（ShoppingBossCat）
// =============================================================================
class ShoppingBossCat {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = 130;
    this.height = 130;
    this.maxHp = CONSTANTS.BOSS.MAX_HP;
    this.hp = this.maxHp;

    this.timer = 0;
    this.attackCooldown = 80;
    this.bullets = [];
    this.isDead = false;
    this.damageFlash = 0;
    this.rushDir = -1;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/boss2_sheet.png';
  }

  update(player) {
    if (this.isDead) return;

    this.timer++;
    if (this.damageFlash > 0) this.damageFlash--;

    const isRage = this.isRaging();

    if (isRage) {
      // 激おこモード: ショッピングカートで猛スピード突進！
      const rushRange = 260;
      this.x += this.rushDir * 4.2;
      if (this.x < this.startX - rushRange) {
        this.rushDir = 1;
      } else if (this.x > this.startX + 60) {
        this.rushDir = -1;
      }
      this.y = this.startY + Math.sin(this.timer * 0.08) * 20;
    } else {
      // 通常モード: 優雅なショッピング浮遊
      this.y = this.startY + Math.sin(this.timer * 0.04) * 35;
      this.x = this.startX + Math.cos(this.timer * 0.02) * 45;
    }

    this.attackCooldown--;
    if (this.attackCooldown <= 0) {
      this.attackCooldown = isRage ? 65 : 120;
      this.shootAtPlayer(player, isRage);
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update();
      if (b.isDead) {
        this.bullets.splice(i, 1);
      }
    }
  }

  isRaging() {
    return this.hp <= this.maxHp * 0.5 && !this.isDead;
  }

  shootAtPlayer(player, isRage) {
    const originX = this.x + 10;
    const originY = this.y + this.height * 0.4;
    const dx = (player.x + player.width / 2) - originX;
    const speedX = Math.max(-7.0, Math.min(-2.8, dx * 0.016));
    const speedY = -4.2 - Math.random() * 2.5;

    this.bullets.push(new ShoppingBagBullet(originX, originY, speedX, speedY));
    window.sound.playScratch();

    if (isRage) {
      // 激おこ時は追加でプレゼント箱を高速連続投擲！
      setTimeout(() => {
        if (!this.isDead) {
          this.bullets.push(new ShoppingBagBullet(originX, originY - 15, speedX * 1.25, speedY - 1.8));
          window.sound.playScratch();
        }
      }, 220);
    }
  }

  takeDamage(amount = 1) {
    if (this.isDead || this.damageFlash > 0) return false;
    this.hp -= amount;
    this.damageFlash = 25;
    window.sound.playBossHit();
    window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);

    if (this.hp <= 0) {
      this.defeat();
    }
    return true;
  }

  defeat() {
    this.isDead = true;
    this.bullets = [];
    window.sound.playVictory();
    window.particleManager.createConfetti(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    for (const b of this.bullets) {
      b.draw(ctx, cameraX);
    }

    if (!this.isDead) {
      drawBossShadow(ctx, this.x, this.y, this.width, this.height, cameraX);
    }

    ctx.save();
    let shakeX = 0;
    let shakeY = 0;
    if (this.damageFlash > 0) {
      shakeX = (Math.random() - 0.5) * 12;
      shakeY = (Math.random() - 0.5) * 12;
    }

    const centerX = this.x + this.width / 2 - cameraX + shakeX;
    const centerY = this.y + this.height / 2 + shakeY;
    ctx.translate(centerX, centerY);

    if (!this.isDead) {
      const breath = Math.sin(this.timer * 0.07);
      const scaleX = 1 + breath * 0.03;
      const scaleY = 1 - breath * 0.03;
      ctx.scale(scaleX, scaleY);
    }

    const isRage = this.isRaging();

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 3;
      const rowH = sheetH / 2;

      let col = 0;
      let row = 0;

      if (this.isDead) {
        col = 2; row = 1; // やられ気絶
      } else if (this.attackCooldown < 30) {
        col = 1; row = 0; // バッグ投げ攻撃
      } else if (isRage) {
        col = 1; row = 1; // 激おこ突進
      } else {
        const step = Math.floor(this.timer / 25) % 2;
        col = (step === 0) ? 0 : 2; row = 0; // 笑顔待機 / オホホ自慢
      }

      const renderSize = this.width * 1.45;
      ctx.drawImage(
        this.spriteImg,
        col * colW, row * rowH, colW, rowH,
        -renderSize / 2, -renderSize / 2, renderSize, renderSize
      );
    } else {
      ctx.fillStyle = '#ff758f';
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    if (!this.isDead) {
      this.drawBossHpBar(ctx);
    }
  }

  drawBossHpBar(ctx) {
    const barWidth = 280;
    const barHeight = 18;
    const x = (CONSTANTS.CANVAS_WIDTH - barWidth) / 2;
    const y = 26;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);
    ctx.fillStyle = '#444';
    ctx.fillRect(x, y, barWidth, barHeight);

    const fillWidth = Math.max(0, (this.hp / this.maxHp) * barWidth);
    const grad = ctx.createLinearGradient(x, y, x + barWidth, y);
    if (this.isRaging()) {
      grad.addColorStop(0, '#ff007f');
      grad.addColorStop(1, '#ffea00');
    } else {
      grad.addColorStop(0, '#00f5d4');
      grad.addColorStop(1, '#ff007f');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, fillWidth, barHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY;
    ctx.textAlign = 'center';
    const bossTitle = this.isRaging() ? '🛍️ 大暴走！バーゲン狂いレディ・ミャウミャウ 🛍️' : '🛒 BOSS: 爆買い暴走セレブねこ レディ・ミャウミャウ';
    ctx.fillText(bossTitle, CONSTANTS.CANVAS_WIDTH / 2, y - 8);
  }
}

// =============================================================================
// 🎩 ステージ3ラスボス: 街の黒幕 ドン・ニャルレオーネ（GodfatherBossCat）
// =============================================================================
class GodfatherBossCat {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = 136;
    this.height = 140;
    this.maxHp = CONSTANTS.BOSS.FINAL_MAX_HP || 14;
    this.hp = this.maxHp;

    this.timer = 0;
    this.attackCooldown = 70;
    this.bullets = [];
    this.isDead = false;
    this.damageFlash = 0;
    this.teleportTimer = 0;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/boss3_sheet.png';
  }

  update(player) {
    if (this.isDead) return;

    this.timer++;
    if (this.damageFlash > 0) this.damageFlash--;

    const isRage = this.isRaging();

    if (isRage) {
      // 激おこ時: 時計塔テレポート＆高低差ダイブ
      this.teleportTimer++;
      if (this.teleportTimer % 180 === 0) {
        // テレポート発動！閃光エフェクト
        for (let i = 0; i < 20; i++) {
          window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
        }
        this.x = (this.x > this.startX - 100) ? (this.startX - 280) : this.startX;
      }
      this.y = this.startY + Math.sin(this.timer * 0.08) * 45;
    } else {
      // 通常時: 厳格な黒幕の浮遊
      this.y = this.startY + Math.sin(this.timer * 0.035) * 30;
      this.x = this.startX + Math.cos(this.timer * 0.02) * 50;
    }

    this.attackCooldown--;
    if (this.attackCooldown <= 0) {
      this.attackCooldown = isRage ? 60 : 100;
      this.shootAtPlayer(player, isRage);
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update();
      if (b.isDead) {
        this.bullets.splice(i, 1);
      }
    }
  }

  isRaging() {
    return this.hp <= this.maxHp * 0.5 && !this.isDead;
  }

  shootAtPlayer(player, isRage) {
    const originX = this.x + 10;
    const originY = this.y + this.height * 0.5;

    if (isRage) {
      // 激おこモード: 360度6方向ダイヤモンドスターバースト！
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + (this.timer * 0.1);
        const vx = Math.cos(a) * 4.8;
        const vy = Math.sin(a) * 4.8;
        this.bullets.push(new DiamondCaneBullet(originX, originY, vx, vy));
      }
      window.sound.playScratch();
    } else {
      // 通常時: プレイヤーを狙う3WAYダイヤモンド弾
      const dx = (player.x + player.width / 2) - originX;
      const dy = (player.y + player.height / 2) - originY;
      const baseAngle = Math.atan2(dy, dx);

      [-0.26, 0, 0.26].forEach(spread => {
        const a = baseAngle + spread;
        const vx = Math.cos(a) * 5.2;
        const vy = Math.sin(a) * 5.2;
        this.bullets.push(new DiamondCaneBullet(originX, originY, vx, vy));
      });
      window.sound.playScratch();
    }
  }

  takeDamage(amount = 1) {
    if (this.isDead || this.damageFlash > 0) return false;
    this.hp -= amount;
    this.damageFlash = 25;
    window.sound.playBossHit();
    window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);

    if (this.hp <= 0) {
      this.defeat();
    }
    return true;
  }

  defeat() {
    this.isDead = true;
    this.bullets = [];
    window.sound.playVictory();
    // ラスボス特大祝祭コンフェッティ
    for (let i = 0; i < 60; i++) {
      window.particleManager.createConfetti(this.x + this.width / 2, this.y + this.height / 2);
    }
  }

  draw(ctx, cameraX) {
    for (const b of this.bullets) {
      b.draw(ctx, cameraX);
    }

    if (!this.isDead) {
      drawBossShadow(ctx, this.x, this.y, this.width, this.height, cameraX, true);
    }

    ctx.save();
    let shakeX = 0;
    let shakeY = 0;
    if (this.damageFlash > 0) {
      shakeX = (Math.random() - 0.5) * 14;
      shakeY = (Math.random() - 0.5) * 14;
    }

    const centerX = this.x + this.width / 2 - cameraX + shakeX;
    const centerY = this.y + this.height / 2 + shakeY;
    ctx.translate(centerX, centerY);

    if (this.damageFlash > 0 && Math.floor(this.damageFlash / 3) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    if (!this.isDead) {
      const breath = Math.sin(this.timer * 0.06);
      const scaleX = 1 + breath * 0.03;
      const scaleY = 1 - breath * 0.03;
      ctx.scale(scaleX, scaleY);
    }

    const isRage = this.isRaging();

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 3;
      const rowH = sheetH / 2;

      let col = 0;
      let row = 0;

      if (this.isDead) {
        col = 2; row = 1; // やられ・ハット脱げ気絶
      } else if (this.attackCooldown < 30) {
        col = 1; row = 0; // ダイヤステッキ振りかざし攻撃
      } else if (isRage) {
        col = 1; row = 1; // 激おこ炎オーラ咆哮
      } else {
        const step = Math.floor(this.timer / 25) % 2;
        col = (step === 0) ? 0 : 2; row = 0; // 威厳の佇まい / 不敵な笑み
      }

      const renderSize = this.width * 1.45;
      ctx.drawImage(
        this.spriteImg,
        col * colW, row * rowH, colW, rowH,
        -renderSize / 2, -renderSize / 2, renderSize, renderSize
      );
    } else {
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    if (!this.isDead) {
      this.drawBossHpBar(ctx);
    }
  }

  drawBossHpBar(ctx) {
    const barWidth = 320;
    const barHeight = 20;
    const x = (CONSTANTS.CANVAS_WIDTH - barWidth) / 2;
    const y = 26;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, barWidth, barHeight);

    const fillWidth = Math.max(0, (this.hp / this.maxHp) * barWidth);
    const grad = ctx.createLinearGradient(x, y, x + barWidth, y);
    if (this.isRaging()) {
      grad.addColorStop(0, '#9b111e');
      grad.addColorStop(0.5, '#ff0054');
      grad.addColorStop(1, '#ffea00');
    } else {
      grad.addColorStop(0, '#c99738');
      grad.addColorStop(1, '#ffb703');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, fillWidth, barHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY;
    ctx.textAlign = 'center';
    const bossTitle = this.isRaging() ? '🎩 狂気乱舞！街の黒幕 ドン・ニャルレオーネ 🎩' : '🎩 最終決戦: 街の黒幕 ドン・ニャルレオーネ';
    ctx.fillText(bossTitle, CONSTANTS.CANVAS_WIDTH / 2, y - 8);
  }
}

// =============================================================================
// 新規追加弾
// =============================================================================
class SushiBullet {
  constructor(x, y, vx, vy) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.width = 24; this.height = 16;
    this.rotation = 0; this.isDead = false;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.rotation += 0.1;
    if (this.y > CONSTANTS.CANVAS_HEIGHT + 80 || this.y < -200 || this.x < -100 || this.x > 5400) this.isDead = true;
  }
  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x + this.width/2 - cameraX, this.y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#ffffff'; // シャリ
    ctx.fillRect(-12, -4, 24, 12);
    ctx.fillStyle = '#ff4d6d'; // ネタ（マグロ）
    ctx.fillRect(-14, -10, 28, 8);
    ctx.restore();
  }
}

class WaterBullet {
  constructor(x, y, vx, vy) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.width = 20; this.height = 20;
    this.rotation = 0; this.isDead = false;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.rotation += 0.2;
    if (this.y > CONSTANTS.CANVAS_HEIGHT + 80 || this.y < -200 || this.x < -100 || this.x > 5400) this.isDead = true;
  }
  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x + this.width/2 - cameraX, this.y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#00f5d4';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class CardBullet {
  constructor(x, y, vx, vy) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.width = 20; this.height = 28;
    this.rotation = 0; this.isDead = false;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.rotation += 0.15;
    if (this.y > CONSTANTS.CANVAS_HEIGHT + 80 || this.y < -200 || this.x < -100 || this.x > 5400) this.isDead = true;
  }
  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x + this.width/2 - cameraX, this.y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -14, 20, 28);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(-10, -14, 20, 28);
    ctx.fillStyle = '#ff0000';
    ctx.font = '12px ' + CONSTANTS.FONT_FAMILY;
    ctx.fillText('♥', -6, 4);
    ctx.restore();
  }
}

class MeteorBullet {
  constructor(x, y, vx, vy) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.width = 26; this.height = 26;
    this.rotation = 0; this.isDead = false;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.rotation += 0.1;
    if (this.y > CONSTANTS.CANVAS_HEIGHT + 80 || this.y < -200 || this.x < -100 || this.x > 5400) this.isDead = true;

    // コズミックプラズマの尾を引く残光星屑
    if (Math.random() < 0.35 && window.particleManager) {
      window.particleManager.particles.push(new Particle(
        this.x + this.width / 2,
        this.y + this.height / 2,
        -this.vx * 0.15 + (Math.random() - 0.5) * 1.5,
        -this.vy * 0.15 + (Math.random() - 0.5) * 1.5,
        Math.random() > 0.5 ? '#ff5400' : '#ffea00',
        3.5,
        14,
        'star'
      ));
    }
  }
  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x + this.width/2 - cameraX, this.y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#ff5400';
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffea00';
    ctx.beginPath();
    ctx.arc(-3, -3, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class GoldCoinBullet {
  constructor(x, y, vx, vy) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.width = 24; this.height = 24;
    this.rotation = 0; this.isDead = false;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.rotation += 0.2;
    if (this.y > CONSTANTS.CANVAS_HEIGHT + 80 || this.y < -200 || this.x < -100 || this.x > 5400) this.isDead = true;
  }
  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x + this.width/2 - cameraX, this.y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e09f00';
    ctx.stroke();
    ctx.fillStyle = '#e09f00';
    ctx.font = '10px ' + CONSTANTS.FONT_FAMILY;
    ctx.fillText('$', -3, 3);
    ctx.restore();
  }
}

// =============================================================================
// 新規追加ボス
// =============================================================================

class ChefBossCat {
  constructor(x, y) {
    this.startX = x; this.startY = y; this.x = x; this.y = y;
    this.width = 130; this.height = 130;
    this.maxHp = 10; this.hp = this.maxHp;
    this.timer = 0; this.attackCooldown = 80;
    this.bullets = []; this.isDead = false; this.damageFlash = 0;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/boss4_sheet.png';
  }
  update(player) {
    if (this.isDead) return;
    this.timer++;
    if (this.damageFlash > 0) this.damageFlash--;
    const isRage = this.isRaging();
    this.y = this.startY + Math.sin(this.timer * 0.05) * 30;
    this.x = this.startX + Math.cos(this.timer * 0.03) * 40;
    this.attackCooldown--;
    if (this.attackCooldown <= 0) {
      this.attackCooldown = isRage ? 60 : 90;
      this.shootAtPlayer(player, isRage);
    }
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update();
      if (b.isDead) this.bullets.splice(i, 1);
    }
  }
  isRaging() { return this.hp <= this.maxHp * 0.5 && !this.isDead; }
  shootAtPlayer(player, isRage) {
    const originX = this.x + 10; const originY = this.y + this.height * 0.5;
    const dx = (player.x + player.width / 2) - originX;
    const dy = (player.y + player.height / 2) - originY;
    const baseAngle = Math.atan2(dy, dx);
    [-0.2, 0, 0.2].forEach(spread => {
      const a = baseAngle + spread;
      const vx = Math.cos(a) * 5;
      const vy = Math.sin(a) * 5;
      this.bullets.push(new SushiBullet(originX, originY, vx, vy));
    });
    if (window.sound) window.sound.playScratch();
  }
  takeDamage(amount = 1) {
    if (this.isDead || this.damageFlash > 0) return false;
    this.hp -= amount; this.damageFlash = 25;
    if (window.sound) window.sound.playBossHit();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
    if (this.hp <= 0) {
      this.isDead = true; this.bullets = [];
      if (window.sound) window.sound.playVictory();
      if (window.particleManager) window.particleManager.createConfetti(this.x + this.width / 2, this.y + this.height / 2);
    }
    return true;
  }
  draw(ctx, cameraX) {
    for (const b of this.bullets) b.draw(ctx, cameraX);
    if (!this.isDead) drawBossShadow(ctx, this.x, this.y, this.width, this.height, cameraX);
    ctx.save();
    let shakeX = 0; let shakeY = 0;
    if (this.damageFlash > 0) {
      shakeX = (Math.random() - 0.5) * 12; shakeY = (Math.random() - 0.5) * 12;
      if (Math.floor(this.damageFlash / 3) % 2 === 0) ctx.globalAlpha = 0.4;
    }
    ctx.translate(this.x + this.width / 2 - cameraX + shakeX, this.y + this.height / 2 + shakeY);

    if (!this.isDead) {
      const breath = Math.sin(this.timer * 0.07);
      ctx.scale(1 + breath * 0.03, 1 - breath * 0.03);
    }

    const isRage = this.isRaging();

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 3;
      const rowH = sheetH / 2;

      let col = 0;
      let row = 0;

      if (this.isDead) {
        col = 2; row = 1; // やられ気絶
      } else if (this.attackCooldown < 30) {
        col = 1; row = 0; // 寿司投げ攻撃
      } else if (isRage) {
        col = 1; row = 1; // わさび激怒
      } else {
        const step = Math.floor(this.timer / 25) % 2;
        col = (step === 0) ? 0 : 2; row = 0; // 笑顔構え / ガハハ笑い
      }

      const renderSize = this.width * 1.45;
      ctx.drawImage(
        this.spriteImg,
        col * colW, row * rowH, colW, rowH,
        -renderSize / 2, -renderSize / 2, renderSize, renderSize
      );
    } else {
      ctx.fillStyle = '#ff9900';
      ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
    if (!this.isDead) this.drawBossHpBar(ctx);
  }
  drawBossHpBar(ctx) {
    const barWidth = 280; const barHeight = 18;
    const x = (CONSTANTS.CANVAS_WIDTH - barWidth) / 2; const y = 26;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'; ctx.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);
    ctx.fillStyle = '#444'; ctx.fillRect(x, y, barWidth, barHeight);
    const fillWidth = Math.max(0, (this.hp / this.maxHp) * barWidth);
    ctx.fillStyle = this.isRaging() ? '#ff0054' : '#ffb703';
    ctx.fillRect(x, y, fillWidth, barHeight);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY; ctx.textAlign = 'center';
    ctx.fillText('🏮 暴走板前 ニャン八', CONSTANTS.CANVAS_WIDTH / 2, y - 8);
  }
}

class SurfBossCat {
  constructor(x, y) {
    this.startX = x; this.startY = y; this.x = x; this.y = y;
    this.width = 130; this.height = 130;
    this.maxHp = 11; this.hp = this.maxHp;
    this.timer = 0; this.attackCooldown = 70;
    this.bullets = []; this.isDead = false; this.damageFlash = 0;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/boss5_sheet.png';
  }
  update(player) {
    if (this.isDead) return;
    this.timer++;
    if (this.damageFlash > 0) this.damageFlash--;
    const isRage = this.isRaging();
    this.y = this.startY + Math.sin(this.timer * 0.08) * 40;
    this.x = this.startX + Math.cos(this.timer * 0.04) * 50;
    this.attackCooldown--;
    if (this.attackCooldown <= 0) {
      this.attackCooldown = isRage ? 40 : 60;
      this.shootAtPlayer(player, isRage);
    }
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i]; b.update();
      if (b.isDead) this.bullets.splice(i, 1);
    }
  }
  isRaging() { return this.hp <= this.maxHp * 0.5 && !this.isDead; }
  shootAtPlayer(player, isRage) {
    const originX = this.x + 10; const originY = this.y + this.height * 0.5;
    const dx = (player.x + player.width / 2) - originX;
    const dy = (player.y + player.height / 2) - originY;
    const baseAngle = Math.atan2(dy, dx);
    [-0.1, 0.1].forEach(spread => {
      const a = baseAngle + spread;
      const vx = Math.cos(a) * 6; const vy = Math.sin(a) * 6;
      this.bullets.push(new WaterBullet(originX, originY, vx, vy));
    });
    if (window.sound) window.sound.playScratch();
  }
  takeDamage(amount = 1) {
    if (this.isDead || this.damageFlash > 0) return false;
    this.hp -= amount; this.damageFlash = 25;
    if (window.sound) window.sound.playBossHit();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
    if (this.hp <= 0) {
      this.isDead = true; this.bullets = [];
      if (window.sound) window.sound.playVictory();
      if (window.particleManager) window.particleManager.createConfetti(this.x + this.width / 2, this.y + this.height / 2);
    }
    return true;
  }
  draw(ctx, cameraX) {
    for (const b of this.bullets) b.draw(ctx, cameraX);
    if (!this.isDead) drawBossShadow(ctx, this.x, this.y, this.width, this.height, cameraX);
    ctx.save();
    let shakeX = 0; let shakeY = 0;
    if (this.damageFlash > 0) {
      shakeX = (Math.random() - 0.5) * 12; shakeY = (Math.random() - 0.5) * 12;
      if (Math.floor(this.damageFlash / 3) % 2 === 0) ctx.globalAlpha = 0.4;
    }
    ctx.translate(this.x + this.width / 2 - cameraX + shakeX, this.y + this.height / 2 + shakeY);

    if (!this.isDead) {
      const breath = Math.sin(this.timer * 0.07);
      ctx.scale(1 + breath * 0.03, 1 - breath * 0.03);
    }

    const isRage = this.isRaging();

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 3;
      const rowH = sheetH / 2;

      let col = 0;
      let row = 0;

      if (this.isDead) {
        col = 2; row = 1; // やられ気絶
      } else if (this.attackCooldown < 25) {
        col = 1; row = 0; // 水鉄砲連射
      } else if (isRage) {
        col = 1; row = 1; // ビッグウェーブ・青オーラ激怒
      } else {
        const step = Math.floor(this.timer / 25) % 2;
        col = (step === 0) ? 0 : 2; row = 0; // アロハ手招き / 爽快笑顔
      }

      const renderSize = this.width * 1.45;
      ctx.drawImage(
        this.spriteImg,
        col * colW, row * rowH, colW, rowH,
        -renderSize / 2, -renderSize / 2, renderSize, renderSize
      );
    } else {
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
    if (!this.isDead) this.drawBossHpBar(ctx);
  }
  drawBossHpBar(ctx) {
    const barWidth = 280; const barHeight = 18;
    const x = (CONSTANTS.CANVAS_WIDTH - barWidth) / 2; const y = 26;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'; ctx.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);
    ctx.fillStyle = '#444'; ctx.fillRect(x, y, barWidth, barHeight);
    const fillWidth = Math.max(0, (this.hp / this.maxHp) * barWidth);
    ctx.fillStyle = this.isRaging() ? '#ff0054' : '#00f5d4';
    ctx.fillRect(x, y, fillWidth, barHeight);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY; ctx.textAlign = 'center';
    ctx.fillText('🐚 サーフ番長 ニャロハ', CONSTANTS.CANVAS_WIDTH / 2, y - 8);
  }
}

class GhostBossCat {
  constructor(x, y) {
    this.startX = x; this.startY = y; this.x = x; this.y = y;
    this.width = 130; this.height = 130;
    this.maxHp = 12; this.hp = this.maxHp;
    this.timer = 0; this.attackCooldown = 80;
    this.bullets = []; this.isDead = false; this.damageFlash = 0;
    this.teleportTimer = 0;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/boss6_sheet.png';
  }
  update(player) {
    if (this.isDead) return;
    this.timer++;
    if (this.damageFlash > 0) this.damageFlash--;
    const isRage = this.isRaging();
    
    this.teleportTimer++;
    if (this.teleportTimer > (isRage ? 100 : 150)) {
        this.teleportTimer = 0;
        this.x = this.startX - 50 + Math.random() * 100;
        this.y = this.startY - 50 + Math.random() * 100;
        if (window.particleManager) {
            for (let i = 0; i < 10; i++) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
        }
    } else {
        this.y += Math.sin(this.timer * 0.1) * 2;
    }

    this.attackCooldown--;
    if (this.attackCooldown <= 0) {
      this.attackCooldown = isRage ? 60 : 80;
      this.shootAtPlayer(player, isRage);
    }
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i]; b.update();
      if (b.isDead) this.bullets.splice(i, 1);
    }
  }
  isRaging() { return this.hp <= this.maxHp * 0.5 && !this.isDead; }
  shootAtPlayer(player, isRage) {
    const originX = this.x + 10; const originY = this.y + this.height * 0.5;
    const dx = (player.x + player.width / 2) - originX;
    const dy = (player.y + player.height / 2) - originY;
    const baseAngle = Math.atan2(dy, dx);
    [-0.3, -0.1, 0.1, 0.3].forEach(spread => {
      const a = baseAngle + spread;
      const vx = Math.cos(a) * 4.5; const vy = Math.sin(a) * 4.5;
      this.bullets.push(new CardBullet(originX, originY, vx, vy));
    });
    if (window.sound) window.sound.playScratch();
  }
  takeDamage(amount = 1) {
    if (this.isDead || this.damageFlash > 0) return false;
    this.hp -= amount; this.damageFlash = 25;
    if (window.sound) window.sound.playBossHit();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
    if (this.hp <= 0) {
      this.isDead = true; this.bullets = [];
      if (window.sound) window.sound.playVictory();
      if (window.particleManager) window.particleManager.createConfetti(this.x + this.width / 2, this.y + this.height / 2);
    }
    return true;
  }
  draw(ctx, cameraX) {
    for (const b of this.bullets) b.draw(ctx, cameraX);
    if (!this.isDead) drawBossShadow(ctx, this.x, this.y, this.width, this.height, cameraX, true);
    ctx.save();
    let shakeX = 0; let shakeY = 0;
    if (this.damageFlash > 0) {
      shakeX = (Math.random() - 0.5) * 12; shakeY = (Math.random() - 0.5) * 12;
      if (Math.floor(this.damageFlash / 3) % 2 === 0) ctx.globalAlpha = 0.4;
    } else {
      ctx.globalAlpha = 0.95;
    }
    ctx.translate(this.x + this.width / 2 - cameraX + shakeX, this.y + this.height / 2 + shakeY);

    if (!this.isDead) {
      const breath = Math.sin(this.timer * 0.08);
      ctx.scale(1 + breath * 0.03, 1 - breath * 0.03);
    }

    const isRage = this.isRaging();

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 3;
      const rowH = sheetH / 2;

      let col = 0;
      let row = 0;

      if (this.isDead) {
        col = 2; row = 1; // 帽子脱げ気絶
      } else if (this.teleportTimer < 22) {
        col = 0; row = 1; // ワープ魔法陣発動
      } else if (this.attackCooldown < 25) {
        col = 1; row = 0; // トランプカード投擲
      } else if (isRage) {
        col = 1; row = 1; // 紫炎怨念オーラ激怒
      } else {
        const step = Math.floor(this.timer / 25) % 2;
        col = (step === 0) ? 0 : 2; row = 0; // ステッキ浮遊構え / 不敵な笑み
      }

      const renderSize = this.width * 1.5;
      ctx.drawImage(
        this.spriteImg,
        col * colW, row * rowH, colW, rowH,
        -renderSize / 2, -renderSize / 2, renderSize, renderSize
      );
    } else {
      ctx.fillStyle = '#a020f0';
      ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
    if (!this.isDead) this.drawBossHpBar(ctx);
  }
  drawBossHpBar(ctx) {
    const barWidth = 280; const barHeight = 18;
    const x = (CONSTANTS.CANVAS_WIDTH - barWidth) / 2; const y = 26;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'; ctx.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);
    ctx.fillStyle = '#444'; ctx.fillRect(x, y, barWidth, barHeight);
    const fillWidth = Math.max(0, (this.hp / this.maxHp) * barWidth);
    ctx.fillStyle = this.isRaging() ? '#ff0054' : '#a020f0';
    ctx.fillRect(x, y, fillWidth, barHeight);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY; ctx.textAlign = 'center';
    ctx.fillText('🎩 魔術師 ファントム・ニャン', CONSTANTS.CANVAS_WIDTH / 2, y - 8);
  }
}

class SpaceBossCat {
  constructor(x, y) {
    this.startX = x; this.startY = y; this.x = x; this.y = y;
    this.width = 140; this.height = 140;
    this.maxHp = 22; this.hp = this.maxHp;
    this.timer = 0; this.attackCooldown = 80;
    this.bullets = []; this.isDead = false; this.damageFlash = 0;

    // コズミック・ワームホールダイブ状態管理 ('none' | 'charge' | 'diving' | 'return')
    this.diveState = 'none';
    this.diveTimer = 0;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/boss7_sheet.png';
  }

  update(player) {
    if (this.isDead) return;
    this.timer++;
    if (this.damageFlash > 0) this.damageFlash--;
    const isRage = this.isRaging();

    // ダイブ突進のステート制御
    if (this.diveState === 'charge') {
      this.diveTimer--;
      // チャージ中は空中で激しく震えながら紫電を纏う
      this.y = this.startY - 30 + (Math.random() - 0.5) * 8;
      if (Math.random() < 0.4 && window.particleManager) {
        window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
      }
      if (this.diveTimer <= 0) {
        this.diveState = 'diving';
        this.diveTimer = 45;
        if (window.sound) window.sound.playBossHit();
      }
    } else if (this.diveState === 'diving') {
      this.diveTimer--;
      // プレイヤー足元めがけて高速急降下滑空
      this.x -= 10;
      this.y = Math.min(385, this.y + 7);
      if (Math.random() < 0.5 && window.particleManager) {
        window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
      }
      if (this.diveTimer <= 0 || this.x < 4200) {
        this.diveState = 'return';
        this.diveTimer = 35;
      }
    } else if (this.diveState === 'return') {
      this.diveTimer--;
      // 高台定位置へ優雅にワープ復帰
      const targetX = this.startX - 50;
      const targetY = this.startY;
      this.x += (targetX - this.x) * 0.12;
      this.y += (targetY - this.y) * 0.12;
      if (this.diveTimer <= 0) {
        this.diveState = 'none';
        this.attackCooldown = isRage ? 40 : 60;
      }
    } else {
      // 通常浮遊AI: プレイヤーとの距離を保ちつつ前後にスライド
      const floatSpd = isRage ? 0.05 : 0.035;
      this.y = this.startY + Math.sin(this.timer * floatSpd) * (isRage ? 55 : 40);
      this.x = this.startX - 60 + Math.cos(this.timer * 0.025) * (isRage ? 90 : 60);

      this.attackCooldown--;
      if (this.attackCooldown <= 0) {
        // 攻撃パターン選択: 激怒時は一定周期で全方位リング弾幕または急降下ダイブ
        const cycle = Math.floor(this.timer / 80) % 4;
        if (isRage && cycle === 1) {
          this.shootSupernovaRing();
          this.attackCooldown = 75;
        } else if (cycle === 3) {
          // コズミックダイブ前兆突入
          this.diveState = 'charge';
          this.diveTimer = 40;
        } else {
          // 狙い撃ちツインメテオ
          this.shootAtPlayer(player, isRage);
          this.attackCooldown = isRage ? 50 : 75;
        }
      }
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i]; b.update();
      if (b.isDead) this.bullets.splice(i, 1);
    }
  }

  isRaging() { return this.hp <= this.maxHp * 0.5 && !this.isDead; }

  shootAtPlayer(player, isRage) {
    const originX = this.x + 10; const originY = this.y + this.height * 0.5;
    const px = player ? (player.x + player.width / 2) : (originX - 300);
    const py = player ? (player.y + player.height / 2) : originY;
    const dx = px - originX;
    const dy = py - originY;
    const baseAngle = Math.atan2(dy, dx);

    const spreads = isRage ? [-0.25, 0, 0.25] : [-0.15, 0.15];
    const speed = isRage ? 6.5 : 5.5;

    spreads.forEach(spread => {
      const a = baseAngle + spread;
      const vx = Math.cos(a) * speed;
      const vy = Math.sin(a) * speed;
      this.bullets.push(new MeteorBullet(originX, originY, vx, vy));
    });

    if (window.sound) window.sound.playScratch();

    // 激怒時は時間差で追撃2連射
    if (isRage) {
      setTimeout(() => {
        if (!this.isDead && this.diveState === 'none') {
          const freshOriginX = this.x + 10;
          const freshOriginY = this.y + this.height * 0.5;
          [-0.1, 0.1].forEach(sp => {
            const a = baseAngle + sp;
            this.bullets.push(new MeteorBullet(freshOriginX, freshOriginY, Math.cos(a) * 7, Math.sin(a) * 7));
          });
          if (window.sound) window.sound.playScratch();
        }
      }, 200);
    }
  }

  shootSupernovaRing() {
    const originX = this.x + this.width / 2;
    const originY = this.y + this.height / 2;
    const count = 8;
    const speed = 4.8;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + (this.timer * 0.05);
      const vx = Math.cos(a) * speed;
      const vy = Math.sin(a) * speed;
      this.bullets.push(new MeteorBullet(originX, originY, vx, vy));
    }
    if (window.sound) window.sound.playScratch();
    if (window.particleManager) {
      for (let i = 0; i < 15; i++) window.particleManager.createScratchHit(originX, originY);
    }
  }

  takeDamage(amount = 1) {
    if (this.isDead || this.damageFlash > 0) return false;
    this.hp -= amount; this.damageFlash = 30;
    if (window.sound) window.sound.playBossHit();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
    if (this.hp <= 0) {
      this.isDead = true; this.bullets = []; this.diveState = 'none';
      if (window.sound) window.sound.playVictory();
      if (window.particleManager) {
        for (let i = 0; i < 35; i++) window.particleManager.createConfetti(this.x + this.width / 2, this.y + this.height / 2);
      }
    }
    return true;
  }

  draw(ctx, cameraX) {
    for (const b of this.bullets) b.draw(ctx, cameraX);
    if (!this.isDead) drawBossShadow(ctx, this.x, this.y, this.width, this.height, cameraX, true);
    ctx.save();
    let shakeX = 0; let shakeY = 0;
    if (this.damageFlash > 0) {
      shakeX = (Math.random() - 0.5) * 14; shakeY = (Math.random() - 0.5) * 14;
      if (Math.floor(this.damageFlash / 3) % 2 === 0) ctx.globalAlpha = 0.4;
    }
    ctx.translate(this.x + this.width / 2 - cameraX + shakeX, this.y + this.height / 2 + shakeY);

    if (!this.isDead) {
      const breath = Math.sin(this.timer * 0.06);
      ctx.scale(1 + breath * 0.03, 1 - breath * 0.03);
    }

    const isRage = this.isRaging();

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 3;
      const rowH = sheetH / 2;

      let col = 0;
      let row = 0;

      if (this.isDead) {
        col = 2; row = 1; // 割れたヘルメット気絶
      } else if (this.diveState === 'charge' || this.diveState === 'diving') {
        col = 1; row = 1; // コズミックネオン激怒オーラ突進
      } else if (this.attackCooldown < 25) {
        col = 1; row = 0; // 二連ブラスター射撃
      } else if (isRage) {
        col = 1; row = 1; // コズミックネオン激怒オーラ
      } else {
        const step = Math.floor(this.timer / 25) % 2;
        col = (step === 0) ? 0 : 2; row = 0; // 腕組み浮遊 / 宇宙征服の高笑い
      }

      const renderSize = this.width * 1.5;
      ctx.drawImage(
        this.spriteImg,
        col * colW, row * rowH, colW, rowH,
        -renderSize / 2, -renderSize / 2, renderSize, renderSize
      );
    } else {
      ctx.fillStyle = '#4b0082';
      ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
    if (!this.isDead) this.drawBossHpBar(ctx);
  }

  drawBossHpBar(ctx) {
    const barWidth = 300; const barHeight = 18;
    const x = (CONSTANTS.CANVAS_WIDTH - barWidth) / 2; const y = 26;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'; ctx.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);
    ctx.fillStyle = '#333'; ctx.fillRect(x, y, barWidth, barHeight);
    const fillWidth = Math.max(0, (this.hp / this.maxHp) * barWidth);
    ctx.fillStyle = this.isRaging() ? '#ff0054' : '#8338ec';
    ctx.fillRect(x, y, fillWidth, barHeight);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY; ctx.textAlign = 'center';
    ctx.fillText(this.isRaging() ? '👽 覚醒銀河皇帝 ニャイザー総統 ⚡' : '👽 宇宙皇帝 ニャイザー総統', CONSTANTS.CANVAS_WIDTH / 2, y - 8);
  }
}

class TrueGodfatherBossCat {
  constructor(x, y) {
    this.startX = x; this.startY = y; this.x = x; this.y = y;
    this.width = 150; this.height = 150;
    this.maxHp = 26; this.hp = this.maxHp;
    this.timer = 0; this.attackCooldown = 70;
    this.bullets = []; this.isDead = false; this.damageFlash = 0;

    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.spriteImg.onload = () => { this.spriteLoaded = true; };
    this.spriteImg.src = 'assets/boss8_sheet.png';
  }
  update(player) {
    if (this.isDead) return;
    this.timer++;
    if (this.damageFlash > 0) this.damageFlash--;
    const isRage = this.isRaging();
    this.y = this.startY + Math.sin(this.timer * 0.05) * 45;
    this.x = this.startX + Math.cos(this.timer * 0.03) * 55;
    this.attackCooldown--;
    if (this.attackCooldown <= 0) {
      this.attackCooldown = isRage ? 42 : 68;
      this.shootAtPlayer(player, isRage);
    }
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i]; b.update();
      if (b.isDead) this.bullets.splice(i, 1);
    }
  }
  isRaging() { return this.hp <= this.maxHp * 0.5 && !this.isDead; }
  shootAtPlayer(player, isRage) {
    const originX = this.x + 10; const originY = this.y + this.height * 0.5;
    const dx = (player.x + player.width / 2) - originX;
    const dy = (player.y + player.height / 2) - originY;
    const baseAngle = Math.atan2(dy, dx);
    const spreads = isRage 
      ? [-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6] 
      : [-0.4, -0.2, 0, 0.2, 0.4];
    const speed = isRage ? 7.2 : 6.0;

    spreads.forEach(spread => {
      const a = baseAngle + spread;
      const vx = Math.cos(a) * speed; const vy = Math.sin(a) * speed;
      this.bullets.push(new GoldCoinBullet(originX, originY, vx, vy));
    });
    if (window.sound) window.sound.playScratch();
  }
  takeDamage(amount = 1) {
    if (this.isDead || this.damageFlash > 0) return false;
    this.hp -= amount; this.damageFlash = 25;
    if (window.sound) window.sound.playBossHit();
    if (window.particleManager) window.particleManager.createScratchHit(this.x + this.width / 2, this.y + this.height / 2);
    if (this.hp <= 0) {
      this.isDead = true; this.bullets = [];
      if (window.sound) window.sound.playVictory();
      for (let i = 0; i < 40; i++) if (window.particleManager) window.particleManager.createConfetti(this.x + this.width / 2, this.y + this.height / 2);
    }
    return true;
  }
  draw(ctx, cameraX) {
    for (const b of this.bullets) b.draw(ctx, cameraX);
    if (!this.isDead) drawBossShadow(ctx, this.x, this.y, this.width, this.height, cameraX, true);
    ctx.save();
    let shakeX = 0; let shakeY = 0;
    if (this.damageFlash > 0) {
      shakeX = (Math.random() - 0.5) * 14; shakeY = (Math.random() - 0.5) * 14;
      if (Math.floor(this.damageFlash / 3) % 2 === 0) ctx.globalAlpha = 0.4;
    }
    ctx.translate(this.x + this.width / 2 - cameraX + shakeX, this.y + this.height / 2 + shakeY);

    if (!this.isDead) {
      const breath = Math.sin(this.timer * 0.06);
      ctx.scale(1 + breath * 0.03, 1 - breath * 0.03);
    }

    const isRage = this.isRaging();

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 3;
      const rowH = sheetH / 2;

      let col = 0;
      let row = 0;

      if (this.isDead) {
        col = 2; row = 1; // 王冠傾き気絶ダウン
      } else if (this.attackCooldown < 25) {
        if (isRage) {
          col = 0; row = 1; // 激怒時: 全方位黄金光矢バースト展開！
        } else {
          col = 1; row = 0; // 通常時: 杖一閃＆光球魔力射撃！
        }
      } else if (isRage) {
        col = 1; row = 1; // 覚醒真紅・黄金炎オーラ形態！
      } else {
        const step = Math.floor(this.timer / 30) % 2;
        col = (step === 0) ? 0 : 2; row = 0; // 威厳あふれる黄金玉座 ↔ 黄金魔法陣結界チャージ
      }

      const renderSize = this.width * 1.8;
      ctx.drawImage(
        this.spriteImg,
        col * colW, row * rowH, colW, rowH,
        -renderSize / 2, -renderSize / 2, renderSize, renderSize
      );
    } else {
      ctx.fillStyle = '#ffb703';
      ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
    if (!this.isDead) this.drawBossHpBar(ctx);
  }

  drawBossHpBar(ctx) {
    const barWidth = 320; const barHeight = 20;
    const x = (CONSTANTS.CANVAS_WIDTH - barWidth) / 2; const y = 26;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; ctx.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);
    ctx.fillStyle = '#222'; ctx.fillRect(x, y, barWidth, barHeight);
    const fillWidth = Math.max(0, (this.hp / this.maxHp) * barWidth);
    ctx.fillStyle = this.isRaging() ? '#ff0054' : '#ffb703';
    ctx.fillRect(x, y, fillWidth, barHeight);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY; ctx.textAlign = 'center';
    ctx.fillText('👑 覚醒 ドン・ニャルレオーネ', CONSTANTS.CANVAS_WIDTH / 2, y - 8);
  }
}

window.TaiyakiBullet = TaiyakiBullet;
window.ShoppingBagBullet = ShoppingBagBullet;
window.DiamondCaneBullet = DiamondCaneBullet;
window.LuxuryBossCat = LuxuryBossCat;
window.ShoppingBossCat = ShoppingBossCat;
window.GodfatherBossCat = GodfatherBossCat;
window.SushiBullet = SushiBullet;
window.WaterBullet = WaterBullet;
window.CardBullet = CardBullet;
window.MeteorBullet = MeteorBullet;
window.GoldCoinBullet = GoldCoinBullet;
window.ChefBossCat = ChefBossCat;
window.SurfBossCat = SurfBossCat;
window.GhostBossCat = GhostBossCat;
window.SpaceBossCat = SpaceBossCat;
window.TrueGodfatherBossCat = TrueGodfatherBossCat;
