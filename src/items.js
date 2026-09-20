// src/items.js - アイテム群（コイン、回復おさかな、またたび）

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 24;
    this.isCollected = false;
    this.timer = Math.random() * 10;
  }

  update() {
    this.timer += 0.08;
  }

  collect() {
    this.isCollected = true;
    window.sound.playCoin();
    window.particleManager.createCoinSparkle(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isCollected) return;

    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2 + Math.sin(this.timer * 2) * 3;

    // 🌟 2.5Dコイン足元の小さなドロップシャドウ
    const curStage = window.game ? window.game.stage : null;
    if (curStage && typeof curStage.getGroundYBelow === 'function') {
      const groundY = curStage.getGroundYBelow(this.x + this.width / 2, this.y + this.height);
      if (groundY !== null) {
        ctx.save();
        ctx.translate(centerX, groundY);
        ctx.scale(0.8, 0.22);
        ctx.fillStyle = 'rgba(20, 20, 30, 0.25)';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(centerX, centerY);

    // コインの横幅を伸縮させて3D回転を表現
    const scaleX = Math.cos(this.timer * 3);

    // 🌟 2.5D金貨の立体厚み（サイドリム）
    const thickness = 3.5 * (1 - Math.abs(scaleX));
    if (thickness > 0.6) {
      ctx.fillStyle = '#b37400';
      ctx.beginPath();
      ctx.ellipse(-scaleX * 2, 0, 11 * Math.abs(scaleX) + thickness, 11, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.scale(scaleX, 1);

    // 外枠（ゴールド）
    ctx.fillStyle = CONSTANTS.COLORS.GOLD_COIN;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();

    // 🌟 Wiiデラ風 クッキリしたハイライトエッジ
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#fff3a8';
    ctx.stroke();

    // 内側星マーク
    if (Math.abs(scaleX) > 0.35) {
      ctx.fillStyle = '#fff4a3';
      ctx.beginPath();
      ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

class FishHeal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 24;
    this.isCollected = false;
    this.timer = 0;
  }

  update() {
    this.timer += 0.05;
  }

  collect(player) {
    this.isCollected = true;
    player.hp = Math.min(CONSTANTS.PLAYER.MAX_HP, player.hp + 1);
    window.sound.playCoin();
    window.particleManager.createCoinSparkle(this.x + this.width / 2, this.y + this.height / 2);
  }

  draw(ctx, cameraX) {
    if (this.isCollected) return;

    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2 + Math.sin(this.timer * 3) * 4;
    ctx.translate(centerX, centerY);

    // 高級おさかな（ピンクのおさかな）
    ctx.fillStyle = '#ff8fab';
    ctx.beginPath();
    ctx.ellipse(0, 0, 13, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // 尾
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-17, -6);
    ctx.lineTo(-17, 6);
    ctx.closePath();
    ctx.fill();
    // 目
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(6, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(7, -2, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class Catnip {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.isCollected = false;
    this.timer = 0;
  }

  update() {
    this.timer += 0.06;
  }

  collect(player) {
    this.isCollected = true;
    player.activateFever();
  }

  draw(ctx, cameraX) {
    if (this.isCollected) return;

    ctx.save();
    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2 + Math.sin(this.timer * 3) * 5;
    ctx.translate(centerX, centerY);

    // キラキラ光るまたたびオーラ
    const auraPulse = (Math.sin(this.timer * 6) + 1) * 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, 16 + auraPulse * 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(112, 224, 165, 0.4)';
    ctx.fill();

    // またたびの三つ葉
    ctx.fillStyle = '#2ec4b6';
    for (let i = 0; i < 3; i++) {
      const angle = (i * 120) * Math.PI / 180;
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(angle) * 7,
        Math.sin(angle) * 7,
        8, 4, angle, 0, Math.PI * 2
      );
      ctx.fill();
    }
    // 中央の黄色い実
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// =========================================================================
// 🌶️ パワーチリ（火力増強アイテム：30秒間 攻撃力2倍＆判定1.5倍＆紅蓮の炎オーラ）
// =========================================================================
class PowerChili {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 34;
    this.isCollected = false;
    this.timer = Math.random() * 5;
  }

  update() {
    this.timer += 0.08;
  }

  collect(player) {
    this.isCollected = true;
    player.activatePowerUp(CONSTANTS.POWERUP.TYPES.FIRE, CONSTANTS.POWERUP.DURATION);
    window.sound.playCoin();
    // 炎の爆散パーティクル
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const spd = 2.5 + Math.random() * 3.5;
      window.particleManager.particles.push(new Particle(
        this.x + this.width / 2,
        this.y + this.height / 2,
        Math.cos(ang) * spd,
        Math.sin(ang) * spd,
        (i % 2 === 0) ? '#ff3b30' : '#ff9500',
        4.5 + Math.random() * 3,
        22,
        'star'
      ));
    }
  }

  draw(ctx, cameraX) {
    if (this.isCollected) return;

    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2 + Math.sin(this.timer * 3.5) * 4;

    // 接地影
    const curStage = window.game ? window.game.stage : null;
    if (curStage && typeof curStage.getGroundYBelow === 'function') {
      const groundY = curStage.getGroundYBelow(this.x + this.width / 2, this.y + this.height);
      if (groundY !== null) {
        ctx.save();
        ctx.translate(centerX, groundY);
        ctx.scale(0.85, 0.22);
        ctx.fillStyle = 'rgba(230, 50, 20, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(centerX, centerY);

    // 燃え盛る紅蓮の揺らぎオーラ
    const auraPulse = (Math.sin(this.timer * 5) + 1) * 0.5;
    const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 18 + auraPulse * 4);
    auraGrad.addColorStop(0, 'rgba(255, 230, 0, 0.7)');
    auraGrad.addColorStop(0.5, 'rgba(255, 60, 0, 0.5)');
    auraGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 20 + auraPulse * 4, 0, Math.PI * 2);
    ctx.fill();

    // 唐辛子の本体（カーブした丸みのあるフォルム）
    ctx.rotate(Math.sin(this.timer * 2) * 0.15);

    ctx.fillStyle = '#ff2a2a';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.bezierCurveTo(8, -6, 12, 4, 6, 11);
    ctx.bezierCurveTo(3, 14, -2, 13, -2, 8);
    ctx.bezierCurveTo(-3, 2, -6, -4, 0, -10);
    ctx.fill();

    // 艶ハイライト
    ctx.fillStyle = '#ff9999';
    ctx.beginPath();
    ctx.ellipse(3, 0, 2.5, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 緑のヘタ＆茎
    ctx.fillStyle = '#38b000';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-4, -13);
    ctx.lineTo(1, -12);
    ctx.lineTo(4, -13);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#2d6a4f';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -11);
    ctx.quadraticCurveTo(-2, -17, -5, -16);
    ctx.stroke();

    ctx.restore();
  }
}

// =========================================================================
// ⭐ ツインスター（2方向発射アイテム：30秒間 前方＋斜め上30度 同時ショット）
// =========================================================================
class TwinStar {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 34;
    this.isCollected = false;
    this.timer = Math.random() * 5;
  }

  update() {
    this.timer += 0.08;
  }

  collect(player) {
    this.isCollected = true;
    player.activatePowerUp(CONSTANTS.POWERUP.TYPES.TWIN, CONSTANTS.POWERUP.DURATION);
    window.sound.playCoin();
    // 星屑スパークルパーティクル
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const spd = 2.5 + Math.random() * 3.5;
      window.particleManager.particles.push(new Particle(
        this.x + this.width / 2,
        this.y + this.height / 2,
        Math.cos(ang) * spd,
        Math.sin(ang) * spd,
        (i % 2 === 0) ? '#ffd166' : '#00f5d4',
        4.5 + Math.random() * 3,
        22,
        'star'
      ));
    }
  }

  draw(ctx, cameraX) {
    if (this.isCollected) return;

    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2 + Math.sin(this.timer * 3) * 4;

    // 接地影
    const curStage = window.game ? window.game.stage : null;
    if (curStage && typeof curStage.getGroundYBelow === 'function') {
      const groundY = curStage.getGroundYBelow(this.x + this.width / 2, this.y + this.height);
      if (groundY !== null) {
        ctx.save();
        ctx.translate(centerX, groundY);
        ctx.scale(0.85, 0.22);
        ctx.fillStyle = 'rgba(0, 180, 200, 0.25)';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(centerX, centerY);

    // シアン＆ゴールドの交差オーラ
    const auraPulse = (Math.sin(this.timer * 5) + 1) * 0.5;
    const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 18 + auraPulse * 4);
    auraGrad.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
    auraGrad.addColorStop(0.5, 'rgba(0, 245, 212, 0.4)');
    auraGrad.addColorStop(1, 'rgba(0, 150, 255, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 20 + auraPulse * 4, 0, Math.PI * 2);
    ctx.fill();

    // 2つの連星が寄り添って回る
    const rot = this.timer * 2.2;
    const starDist = 7.5;

    // 🌟 星1（ゴールド主星）
    ctx.save();
    ctx.translate(Math.cos(rot) * starDist, Math.sin(rot) * starDist);
    ctx.rotate(rot);
    this.drawSmallStar(ctx, 9, '#ffd166', '#fff5cc');
    ctx.restore();

    // 🌟 星2（シアン副星）
    ctx.save();
    ctx.translate(Math.cos(rot + Math.PI) * starDist, Math.sin(rot + Math.PI) * starDist);
    ctx.rotate(-rot * 1.2);
    this.drawSmallStar(ctx, 7.5, '#00f5d4', '#d0fff8');
    ctx.restore();

    ctx.restore();
  }

  drawSmallStar(ctx, r, color, highlight) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * Math.PI / 180;
      const ax = Math.cos(a) * r;
      const ay = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(ax, ay);
      else ctx.lineTo(ax, ay);

      const b = (i * 72 + 36 - 90) * Math.PI / 180;
      const bx = Math.cos(b) * (r * 0.45);
      const by = Math.sin(b) * (r * 0.45);
      ctx.lineTo(bx, by);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = highlight;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

window.Coin = Coin;
window.FishHeal = FishHeal;
window.Catnip = Catnip;
window.PowerChili = PowerChili;
window.TwinStar = TwinStar;

