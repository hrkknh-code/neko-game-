// src/player.js - 主人公ネコちゃんクラス（手足パタパタ歩行・Z長押し肉球波動拳対応）

class HadoukenBullet {
  constructor(x, y, facingRight, chargeLevel = 1, isFirePower = false, vy = 0, isSuper = false) {
    this.chargeLevel = chargeLevel; // 1: 通常弾, 2: 中チャージ, 3: 極大MAX
    this.facingRight = facingRight;
    this.isFirePower = isFirePower;
    this.isSuper = isSuper;
    this.vy = vy;
    this.rotation = 0;
    this.isDead = false;

    const boosted = isFirePower || isSuper;
    if (chargeLevel === 3) {
      this.width = boosted ? 88 : 68;
      this.height = boosted ? 70 : 54;
      this.vx = facingRight ? 14 : -14;
      this.damage = isSuper ? 6 : (isFirePower ? 5 : 3);
      this.penetrate = true; // 敵・弾貫通
      this.life = 130;
    } else if (chargeLevel === 2) {
      this.width = boosted ? 64 : 46;
      this.height = boosted ? 54 : 40;
      this.vx = facingRight ? 15 : -15;
      this.damage = isSuper ? 4 : (isFirePower ? 3 : 2);
      this.penetrate = false;
      this.life = 90;
    } else {
      // レベル1: 通常肉球弾（軽快・キュート）
      this.width = boosted ? 48 : 34;
      this.height = boosted ? 42 : 30;
      this.vx = facingRight ? 16 : -16;
      this.damage = isSuper ? 2 : (isFirePower ? 2 : 1);
      this.penetrate = false;
      this.life = 75;
    }

    this.x = x;
    this.y = y;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += (this.chargeLevel === 3) ? 0.18 : 0.12;
    this.life--;
    if (this.life <= 0 || this.y < -50 || this.y > CONSTANTS.CANVAS_HEIGHT + 50) {
      this.isDead = true;
    }

    // 飛翔中のパーティクル
    const spawnRate = (this.chargeLevel === 3) ? 0.9 : ((this.chargeLevel === 2) ? 0.6 : 0.35);
    if (Math.random() < spawnRate) {
      let pColor = '#ff758f'; // Lv1: ピンク
      if (this.isFirePower) {
        pColor = (Math.random() > 0.5) ? '#ff3b30' : '#ff9500';
      } else if (this.chargeLevel === 3) {
        pColor = (Math.random() > 0.5) ? '#ffea00' : '#00f5d4';
      } else if (this.chargeLevel === 2) {
        pColor = '#00f5d4';
      }

      window.particleManager.particles.push(new Particle(
        this.x + this.width / 2,
        this.y + this.height / 2 + (Math.random() - 0.5) * (this.height * 0.4),
        -this.vx * 0.18,
        (Math.random() - 0.5) * 2,
        pColor,
        (this.chargeLevel === 3 ? 6 : (this.chargeLevel === 2 ? 4.5 : 3.5)) * (this.isFirePower ? 1.3 : 1.0),
        16,
        'star'
      ));
    }
  }

  draw(ctx, cameraX) {
    ctx.save();
    const cx = this.x + this.width / 2 - cameraX;
    const cy = this.y + this.height / 2;
    ctx.translate(cx, cy);

    if (this.isSuper) {
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 26;
    }

    if (this.chargeLevel === 3) {
      // ★ レベル3: 極大黄金オーラ肉球波動拳（メガニャドウケン！）
      if (!this.isSuper) {
        ctx.shadowColor = '#ffea00';
        ctx.shadowBlur = 24;
      }

      const grad = ctx.createRadialGradient(0, 0, 6, 0, 0, 28);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, '#ffea00');
      grad.addColorStop(0.8, '#ff9e00');
      grad.addColorStop(1, 'rgba(0, 245, 212, 0.4)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fill();

      // 回転する黄金肉球
      ctx.rotate(this.rotation);
      ctx.fillStyle = '#ffea00';
      ctx.beginPath();
      ctx.ellipse(0, 4, 11, 8.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-8, -6, 4, 0, Math.PI * 2);
      ctx.arc(-3, -9.5, 4, 0, Math.PI * 2);
      ctx.arc(3, -9.5, 4, 0, Math.PI * 2);
      ctx.arc(8, -6, 4, 0, Math.PI * 2);
      ctx.fill();

      // 内側の白いハイライト
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 3, 6, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

    } else if (this.chargeLevel === 2) {
      // ★ レベル2: シアン＆エメラルド肉球弾（スーパー時は黄金シアン）
      if (!this.isSuper) {
        ctx.shadowColor = '#00f5d4';
        ctx.shadowBlur = 16;
      }

      const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 20);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, this.isSuper ? '#ffd700' : '#70e000');
      grad.addColorStop(1, '#00f5d4');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.rotate(this.rotation * 0.7);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 3, 7.5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-5.5, -4.5, 2.8, 0, Math.PI * 2);
      ctx.arc(-2, -7, 2.8, 0, Math.PI * 2);
      ctx.arc(2, -7, 2.8, 0, Math.PI * 2);
      ctx.arc(5.5, -4.5, 2.8, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // ★ レベル1: 通常肉球弾（スーパー時は黄金パール弾）
      if (!this.isSuper) {
        ctx.shadowColor = '#ff4d6d';
        ctx.shadowBlur = 12;
      }

      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 14);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.6, this.isSuper ? '#ffd700' : '#ff758f');
      grad.addColorStop(1, this.isSuper ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 77, 109, 0.3)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // 肉球マーク（白）
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 2, 5.5, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-4, -3.2, 2, 0, Math.PI * 2);
      ctx.arc(-1.5, -5, 2, 0, Math.PI * 2);
      ctx.arc(1.5, -5, 2, 0, Math.PI * 2);
      ctx.arc(4, -3.2, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}


// =========================================================================
// 🍙 梅干し弾クラス（おにぎり専用攻撃：放物線スロー＆特大紀州南高梅ボム）
// =========================================================================
class UmeboshiBullet {
  constructor(x, y, facingRight, chargeLevel = 1, isFirePower = false, extraVy = 0, isSuper = false) {
    this.chargeLevel = chargeLevel; // 1: 通常梅干し, 2: 中粒熟成梅干し, 3: 極大黄金南高梅ボム
    this.facingRight = facingRight;
    this.isFirePower = isFirePower;
    this.isSuper = isSuper;
    this.rotation = 0;
    this.isDead = false;

    const boosted = isFirePower || isSuper;
    if (chargeLevel === 3) {
      // ★ Lv3: 極大・黄金紀州南高梅ボム（水平直進・全貫通・大爆発）
      this.width = boosted ? 88 : 68;
      this.height = boosted ? 88 : 68;
      this.vx = facingRight ? 14 : -14;
      this.vy = extraVy;
      this.gravity = 0;
      this.damage = isSuper ? 6 : (isFirePower ? 5 : 3);
      this.penetrate = true;
      this.life = 130;
    } else if (chargeLevel === 2) {
      // ★ Lv2: 中粒熟成梅干し（力強い山なりスロー・2ダメ）
      this.width = boosted ? 64 : 46;
      this.height = boosted ? 64 : 46;
      this.vx = facingRight ? 13 : -13;
      this.vy = -2.2 + extraVy;
      this.gravity = 0.10;
      this.damage = isSuper ? 4 : (isFirePower ? 3 : 2);
      this.penetrate = false;
      this.life = 90;
    } else {
      // ★ Lv1: 軽快な通常梅干し（山なり放物線・1ダメ）
      this.width = boosted ? 48 : 32;
      this.height = boosted ? 48 : 32;
      this.vx = facingRight ? 12 : -11.5;
      this.vy = -3.6 + extraVy;
      this.gravity = 0.17;
      this.damage = isSuper ? 2 : (isFirePower ? 2 : 1);
      this.penetrate = false;
      this.life = 75;
    }

    this.x = x;
    this.y = y;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += (this.facingRight ? 1 : -1) * (this.chargeLevel === 3 ? 0.22 : 0.14);
    this.life--;

    if (this.life <= 0 || this.y > CONSTANTS.CANVAS_HEIGHT + 60 || this.y < -60) {
      this.isDead = true;
    }

    // 飛翔中の紫蘇（しそ）＆酸っぱキラキラパーティクル
    const spawnRate = (this.chargeLevel === 3) ? 0.95 : ((this.chargeLevel === 2) ? 0.65 : 0.4);
    if (Math.random() < spawnRate) {
      let pColor = '#c9184a'; // 赤紫（梅干し色）
      if (this.isFirePower) {
        pColor = (Math.random() > 0.5) ? '#ff3b30' : '#ff9500';
      } else if (this.chargeLevel === 3) {
        pColor = (Math.random() > 0.4) ? '#ffea00' : '#800f2f';
      } else if (this.chargeLevel === 2) {
        pColor = (Math.random() > 0.5) ? '#ff4d6d' : '#590d22';
      }

      window.particleManager.particles.push(new Particle(
        this.x + this.width / 2 + (Math.random() - 0.5) * 8,
        this.y + this.height / 2 + (Math.random() - 0.5) * 8,
        -this.vx * 0.16 + (Math.random() - 0.5) * 1.5,
        -this.vy * 0.16 + (Math.random() - 0.5) * 1.5,
        pColor,
        (this.chargeLevel === 3 ? 6.5 : (this.chargeLevel === 2 ? 4.8 : 3.6)) * (this.isFirePower ? 1.3 : 1.0),
        16,
        'star'
      ));
    }
  }

  draw(ctx, cameraX) {
    ctx.save();
    const cx = this.x + this.width / 2 - cameraX;
    const cy = this.y + this.height / 2;
    ctx.translate(cx, cy);

    if (this.isSuper) {
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 26;
    }

    if (this.chargeLevel === 3) {
      // ★ Lv3: 黄金＆紫蘇オーラ
      if (!this.isSuper) {
        ctx.shadowColor = '#ffea00';
        ctx.shadowBlur = 24;
      }

      const auraGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 32);
      auraGrad.addColorStop(0, '#ffffff');
      auraGrad.addColorStop(0.3, '#ffea00');
      auraGrad.addColorStop(0.7, '#ff0055');
      auraGrad.addColorStop(1, 'rgba(128, 15, 47, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();

      // 回転する酸っぱスパーク線
      ctx.save();
      ctx.rotate(-this.rotation * 1.5);
      ctx.strokeStyle = 'rgba(255, 234, 0, 0.7)';
      ctx.lineWidth = 3;
      for (let a = 0; a < 6; a++) {
        const rad = (a / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * 16, Math.sin(rad) * 16);
        ctx.lineTo(Math.cos(rad) * 30, Math.sin(rad) * 30);
        ctx.stroke();
      }
      ctx.restore();
    } else if (this.chargeLevel === 2) {
      if (!this.isSuper) {
        ctx.shadowColor = '#ff4d6d';
        ctx.shadowBlur = 14;
      }
    } else {
      if (!this.isSuper) {
        ctx.shadowColor = 'rgba(255, 77, 109, 0.5)';
        ctx.shadowBlur = 8;
      }
    }

    ctx.rotate(this.rotation);

    // 梅干し本体（ジューシーなしわしわ果肉）
    const r = this.width * 0.42;
    const umeGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    if (this.chargeLevel === 3) {
      umeGrad.addColorStop(0, '#ff758f');
      umeGrad.addColorStop(0.4, '#c9184a');
      umeGrad.addColorStop(0.8, '#800f2f');
      umeGrad.addColorStop(1, '#ffea00');
    } else {
      umeGrad.addColorStop(0, '#ff758f');
      umeGrad.addColorStop(0.5, '#c9184a');
      umeGrad.addColorStop(1, '#590d22');
    }

    ctx.fillStyle = umeGrad;
    ctx.beginPath();
    // わずかに歪んだ手作り梅干しの形
    ctx.moveTo(-r * 0.9, -r * 0.4);
    ctx.bezierCurveTo(-r * 1.05, r * 0.5, -r * 0.4, r * 1.05, r * 0.3, r * 0.95);
    ctx.bezierCurveTo(r * 1.05, r * 0.7, r * 0.95, -r * 0.6, 0, -r * 0.95);
    ctx.bezierCurveTo(-r * 0.5, -r * 1.0, -r * 0.8, -r * 0.7, -r * 0.9, -r * 0.4);
    ctx.closePath();
    ctx.fill();

    // 手書き風の素朴な輪郭線
    ctx.lineWidth = (this.chargeLevel === 3) ? 3 : 2;
    ctx.strokeStyle = '#38040e';
    ctx.stroke();

    // 梅干しのしわ（熟成の酸っぱさ！）
    ctx.strokeStyle = 'rgba(56, 4, 14, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.2);
    ctx.quadraticCurveTo(-r * 0.1, 0, -r * 0.3, r * 0.5);
    ctx.moveTo(r * 0.1, -r * 0.5);
    ctx.quadraticCurveTo(r * 0.4, -r * 0.1, r * 0.3, r * 0.4);
    ctx.stroke();

    // 梅のへた（中央の小さなくぼみ・星型）
    ctx.fillStyle = '#220008';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // つややかハイライト
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.22, r * 0.12, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}


class Player {
  constructor(x, y, characterType = 'cat') {
    this.characterType = characterType; // 'cat' (ねこ) または 'onigiri' (おにぎり)
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 68;
    this.height = 54;

    this.facingRight = true;
    this.isGrounded = false;
    this.isJumping = false;
    this.hp = CONSTANTS.PLAYER.MAX_HP;
    this.invincibleTimer = 0;
    this.feverTimer = 0;

    // ひっかき攻撃 & 2連コンボ（ねこ用）
    this.isAttacking = false;
    this.attackTimer = 0;
    this.comboStep = 1;
    this.comboWindow = 0;

    // ★ Z長押しチャージ ＆ 波動拳・梅干し弾システム
    this.chargeTimer = 0;
    this.maxCharge = 180; // 3秒 (60fps * 3)
    this.isChargeReady = false;
    this.hadoukens = [];
    this.umeboshis = [];
    this.hearts = []; // おにぎりアイドル時の頭上ふわふわハート

    // 🌟 10秒パワーアップシステム（火力増強＆2方向ショット）
    this.powerupType = null; // 'fire' (火力増強) または 'twin' (2方向発射)
    this.powerupTimer = 0;   // 残り時間フレーム (最大600 = 10秒)
    this.powerupMaxTime = (typeof CONSTANTS !== 'undefined' && CONSTANTS.POWERUP) ? CONSTANTS.POWERUP.DURATION : 600;

    // 🌟 奇跡の再生・スーパー覚醒システム（ラスボス限定パワーアップ）
    this.isSuper = false;
    this.superAuraTimer = 0;

    // アニメーション制御
    this.animTimer = 0;
    this.idleTimer = 0;
    this.squishX = 1.0;
    this.squishY = 1.0;
    this.lastSafeGroundX = x;
    this.lastSafeGroundY = y;

    // 透過PNGスプライト読み込み（ねこ用）
    this.spriteImg = new Image();
    this.spriteLoaded = false;
    this.loadSprite();
  }

  // 🌟 パワーアップ発動（10秒間限定）
  activatePowerUp(type, duration) {
    const dur = duration || ((typeof CONSTANTS !== 'undefined' && CONSTANTS.POWERUP) ? CONSTANTS.POWERUP.DURATION : 600);
    this.powerupType = type;
    this.powerupTimer = dur;
    this.powerupMaxTime = dur;
  }

  loadSprite() {
    this.spriteImg.onload = () => {
      this.spriteLoaded = true;
    };
    this.spriteImg.onerror = (e) => {
      console.error('Failed to load player sprite:', e);
    };
    this.spriteImg.src = 'assets/quadruped_cat.png';
  }

  update(inputs, stage) {
    this.animTimer++;

    // 🌟 パワーアップタイマー更新
    if (this.powerupTimer > 0) {
      this.powerupTimer--;
      if (this.powerupType === 'fire') {
        // 火力増強時の燃え盛る紅蓮の揺らぎパーティクル
        if (Math.random() < 0.40) {
          window.particleManager.particles.push(new Particle(
            this.x + Math.random() * this.width,
            this.y + this.height * 0.35 + Math.random() * (this.height * 0.65),
            (Math.random() - 0.5) * 1.5,
            -1.6 - Math.random() * 2.0,
            (Math.random() > 0.4) ? '#ff3b30' : '#ff9500',
            3.5 + Math.random() * 3,
            20,
            'star'
          ));
        }
      } else if (this.powerupType === 'twin') {
        // ツインスター時のキラキラ星屑パーティクル
        if (Math.random() < 0.40) {
          window.particleManager.particles.push(new Particle(
            this.x + Math.random() * this.width,
            this.y + Math.random() * this.height,
            (Math.random() - 0.5) * 1.6,
            (Math.random() - 0.5) * 1.6,
            (Math.random() > 0.5) ? '#ffd166' : '#00f5d4',
            3.0 + Math.random() * 2.5,
            18,
            'star'
          ));
        }
      }
      if (this.powerupTimer === 0) {
        this.powerupType = null;
      }
    }

    // 弾の更新（ねこの波動拳 ＆ おにぎりの梅干し弾）
    for (let i = this.hadoukens.length - 1; i >= 0; i--) {
      const h = this.hadoukens[i];
      h.update();
      if (h.isDead) {
        this.hadoukens.splice(i, 1);
      }
    }
    for (let i = this.umeboshis.length - 1; i >= 0; i--) {
      const u = this.umeboshis[i];
      u.update();
      if (u.isDead) {
        this.umeboshis.splice(i, 1);
      }
    }

    // おにぎりの頭上ハート更新
    if (this.characterType === 'onigiri') {
      if (this.idleTimer > 35 && this.idleTimer % 55 === 0 && this.hearts.length < 4) {
        this.hearts.push({
          x: (Math.random() - 0.5) * 18,
          y: -24,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.65 - Math.random() * 0.35,
          scale: 0.7 + Math.random() * 0.4,
          alpha: 1.0,
          life: 65
        });
      }
      for (let i = this.hearts.length - 1; i >= 0; i--) {
        const ht = this.hearts[i];
        ht.x += ht.vx;
        ht.y += ht.vy;
        ht.life--;
        ht.alpha = Math.min(1, ht.life / 20);
        if (ht.life <= 0) {
          this.hearts.splice(i, 1);
        }
      }
    }

    // ★ Zボタンの即時発射 ＆ 長押しチャージシステム（ロックマン式）
    const curMaxCharge = this.isSuper
      ? (typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL ? CONSTANTS.SUPER_REVIVAL.MAX_CHARGE : 90)
      : 180;
    this.maxCharge = curMaxCharge;
    const midChargeTime = this.isSuper
      ? (typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL ? CONSTANTS.SUPER_REVIVAL.MID_CHARGE : 30)
      : 60;

    if (inputs.attack) {
      if (this.chargeTimer < this.maxCharge + 60) {
        this.chargeTimer++;
      }
      this.idleTimer = 0;
      this.squishX = 1.0;
      this.squishY = 1.0;

      if (this.chargeTimer === 10) {
        window.sound.startCharge();
      }

      // チャージ中の吸い込みパーティクル
      if (this.chargeTimer > 10 && this.chargeTimer % 3 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 32 + Math.random() * 20;
        let pColor = '#ff758f'; // Lv1: ピンク
        if (this.isSuper) {
          pColor = (Math.random() > 0.5) ? '#ffd700' : '#ffffff';
        } else if (this.characterType === 'onigiri') {
          if (this.chargeTimer >= this.maxCharge) pColor = (Math.random() > 0.5) ? '#ffea00' : '#ff0055';
          else if (this.chargeTimer >= midChargeTime) pColor = (Math.random() > 0.5) ? '#c9184a' : '#ffffff';
          else pColor = '#ff4d6d';
        } else {
          if (this.chargeTimer >= this.maxCharge) pColor = (Math.random() > 0.5) ? '#ffea00' : '#00f5d4';
          else if (this.chargeTimer >= midChargeTime) pColor = '#00f5d4';
        }

        window.particleManager.particles.push(new Particle(
          this.x + this.width / 2 + Math.cos(angle) * dist,
          this.y + this.height / 2 + Math.sin(angle) * dist,
          -Math.cos(angle) * 3,
          -Math.sin(angle) * 3,
          pColor,
          4 + Math.random() * 3,
          14,
          'star'
        ));
      }

      // 中チャージ音（Lv2到達：エネルギー蓄積チャイム）
      if (this.chargeTimer === midChargeTime) {
        window.sound.playMidCharge();
      }

      // MAXチャージ完了！（Lv3到達）
      if (this.chargeTimer === this.maxCharge) {
        this.isChargeReady = true;
        window.sound.playChargeComplete();
        // 完了時のフラッシュ
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          window.particleManager.particles.push(new Particle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.cos(a) * 5,
            Math.sin(a) * 5,
            this.isSuper ? '#ffd700' : ((this.characterType === 'onigiri') ? '#ff4d6d' : '#ffd166'),
            6,
            25,
            'star'
          ));
        }
      }
    } else {
      // ボタンを離した瞬間：溜め時間に応じた弾を発射！
      if (this.chargeTimer > 0) {
        let level = 1;
        if (this.chargeTimer >= this.maxCharge) {
          level = 3; // MAX極大
        } else if (this.chargeTimer >= midChargeTime) {
          level = 2; // 中チャージ
        } else {
          level = 1; // 通常弾（ノーチャージ即時発射！）
        }

        if (this.characterType === 'onigiri') {
          this.fireUmeboshi(level);
        } else {
          this.fireHadouken(level);
        }

        window.sound.stopCharge();
        this.chargeTimer = 0;
        this.isChargeReady = false;
      }
    }


    // ひっかきタイマー更新
    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }

    // コンボ受付ウィンドウ
    if (this.comboWindow > 0) {
      this.comboWindow--;
      if (this.comboWindow === 0) {
        this.comboStep = 1;
      }
    }

    // フィーバータイマー
    if (this.feverTimer > 0) {
      this.feverTimer--;
      if (this.feverTimer % 2 === 0) {
        window.particleManager.createFeverSparkle(this.x + this.width / 2, this.y + this.height / 2);
      }
      if (this.feverTimer === 0) {
        window.sound.startBGM(false);
      }
    }

    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
    }

    // 移動入力（チャージ中は少し足が遅くなるが移動可能、スーパー覚醒時は1.2倍俊敏）
    let currentSpeed = (this.feverTimer > 0)
      ? CONSTANTS.PLAYER.MOVE_SPEED * CONSTANTS.PLAYER.FEVER_SPEED_MULT
      : CONSTANTS.PLAYER.MOVE_SPEED;

    if (this.isSuper) {
      currentSpeed *= (typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL ? CONSTANTS.SUPER_REVIVAL.SPEED_MULT : 1.20);
    }

    if (this.chargeTimer > 20) {
      currentSpeed *= 0.65; // チャージ中の移動速度
    }

    let moveX = 0;
    if (inputs.left) {
      moveX -= 1;
      this.facingRight = false;
      this.idleTimer = 0;
      this.squishX = 1.0;
      this.squishY = 1.0;
    }
    if (inputs.right) {
      moveX += 1;
      this.facingRight = true;
      this.idleTimer = 0;
      this.squishX = 1.0;
      this.squishY = 1.0;
    }

    if (moveX !== 0) {
      this.vx = moveX * currentSpeed;
    } else {
      this.vx *= CONSTANTS.FRICTION;
      if (Math.abs(this.vx) < 0.1) {
        this.vx = 0;
        this.idleTimer++;
      }
    }

    // 🌟 一定ジャンプ（ボタンの長さに連動させず常に一定の快適な高さで跳躍、スーパー覚醒時は1.08倍ハイジャンプ）
    if (inputs.jump && this.isGrounded) {
      const jMult = (this.isSuper && typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL)
        ? CONSTANTS.SUPER_REVIVAL.JUMP_MULT : 1.0;
      this.vy = CONSTANTS.PLAYER.JUMP_FORCE * jMult;
      this.isJumping = true;
      this.isGrounded = false;
      this.idleTimer = 0;
      this.squishX = 0.86; // 🌟 ジャンプ時の縦伸び弾力
      this.squishY = 1.18;
      if (this.characterType === 'onigiri') {
        window.sound.playOnigiriJump();
      } else {
        window.sound.playJump();
      }
    }

    // 重力 & 水平移動・衝突判定
    this.vy += CONSTANTS.GRAVITY;
    this.x += this.vx;
    stage.resolveHorizontalCollision(this);

    this.y += this.vy;
    const wasGrounded = this.isGrounded;
    this.isGrounded = false;
    stage.resolveVerticalCollision(this);

    if (this.isGrounded || this.vy >= 0) {
      this.isJumping = false;
    }

    if (!wasGrounded && this.isGrounded) {
      this.lastSafeGroundX = this.x;
      this.lastSafeGroundY = this.y;
      this.squishX = 1.22; // 🌟 着地時のぷるんと横潰れ弾力
      this.squishY = 0.80;
    }

    // 🌟 弾力アニメーションの自然復元
    this.squishX += (1.0 - this.squishX) * 0.20;
    this.squishY += (1.0 - this.squishY) * 0.20;

    if (this.y > CONSTANTS.CANVAS_HEIGHT + 80) {
      this.handleFallRespawn();
    }
  }

  // 通常ひっかき発動（ねこ用）
  triggerScratch() {
    this.isAttacking = true;
    this.idleTimer = 0;
    this.squishX = 1.0;
    this.squishY = 1.0;

    if (this.comboWindow > 0 && this.comboStep === 1) {
      this.comboStep = 2;
    } else {
      this.comboStep = 1;
    }

    this.attackTimer = (this.comboStep === 2) ? 18 : 14;
    this.comboWindow = 28;
    window.sound.playScratch();
  }

  // 肉球波動拳発射！（Lv1: 通常弾, Lv2: 中チャージ, Lv3: 極大MAX）
  fireHadouken(level = 1) {
    const isFire = (this.powerupType === CONSTANTS.POWERUP.TYPES.FIRE && this.powerupTimer > 0) || this.isSuper;
    const isTwin = (this.powerupType === CONSTANTS.POWERUP.TYPES.TWIN && this.powerupTimer > 0);
    const isSuper = this.isSuper;

    let bWidth = 34;
    let bHeight = 30;
    if (level === 3) {
      bWidth = isFire ? 88 : 68; bHeight = isFire ? 70 : 54;
    } else if (level === 2) {
      bWidth = isFire ? 64 : 46; bHeight = isFire ? 54 : 40;
    } else {
      bWidth = isFire ? 48 : 34; bHeight = isFire ? 42 : 30;
    }

    const originX = this.facingRight ? (this.x + this.width + 4) : (this.x - bWidth - 4);
    const originY = this.y + (this.height - bHeight) / 2;

    // 正面弾
    this.hadoukens.push(new HadoukenBullet(originX, originY, this.facingRight, level, isFire, 0, isSuper));

    // ⚡ スーパー覚醒時は常時3WAY黄金バースト（正面・斜め上・斜め下）を一斉射出！
    if (isSuper) {
      this.hadoukens.push(new HadoukenBullet(originX, originY - 12, this.facingRight, level, isFire, -4.5, true));
      this.hadoukens.push(new HadoukenBullet(originX, originY + 12, this.facingRight, level, isFire, 4.5, true));
    } else if (isTwin) {
      // ⭐ 2方向発射（ツインショット：斜め上約25度にも同時発射！）
      this.hadoukens.push(new HadoukenBullet(originX, originY - 10, this.facingRight, level, isFire, -4.5, false));
    }

    // 音響・反動・モーション分岐
    if (level === 3) {
      window.sound.playHadouken();
      this.vx = this.facingRight ? -4.5 : 4.5;
      this.attackTimer = 22;
      this.comboStep = 2;
    } else if (level === 2) {
      window.sound.playMidHadouken();
      this.vx = this.facingRight ? -2.2 : 2.2;
      this.attackTimer = 16;
      this.comboStep = 2;
    } else {
      window.sound.playPawShot();
      this.vx = this.facingRight ? -0.8 : 0.8;
      this.attackTimer = 12;
      this.comboStep = 1;
    }

    this.isAttacking = true;
    this.idleTimer = 0;
    this.squishX = 1.0;
    this.squishY = 1.0;
  }

  // 🍙 梅干し投げ発射！（Lv1: 通常梅干し, Lv2: 中粒熟成梅干し, Lv3: 極大黄金南高梅ボム）
  fireUmeboshi(level = 1) {
    const isFire = (this.powerupType === CONSTANTS.POWERUP.TYPES.FIRE && this.powerupTimer > 0) || this.isSuper;
    const isTwin = (this.powerupType === CONSTANTS.POWERUP.TYPES.TWIN && this.powerupTimer > 0);
    const isSuper = this.isSuper;

    let bWidth = 32;
    let bHeight = 32;
    if (level === 3) {
      bWidth = isFire ? 88 : 68; bHeight = isFire ? 88 : 68;
    } else if (level === 2) {
      bWidth = isFire ? 64 : 46; bHeight = isFire ? 64 : 46;
    } else {
      bWidth = isFire ? 48 : 32; bHeight = isFire ? 48 : 32;
    }

    const originX = this.facingRight ? (this.x + this.width * 0.75) : (this.x - bWidth * 0.75);
    const originY = this.y + (this.height - bHeight) * 0.35;

    // 正面弾
    this.umeboshis.push(new UmeboshiBullet(originX, originY, this.facingRight, level, isFire, 0, isSuper));

    // 🍙 スーパー覚醒時は常時3WAY黄金南高梅ボム（正面・高角山なり・低角高速）を一斉投擲！
    if (isSuper) {
      this.umeboshis.push(new UmeboshiBullet(originX, originY - 10, this.facingRight, level, isFire, -3.5, true));
      this.umeboshis.push(new UmeboshiBullet(originX, originY + 8, this.facingRight, level, isFire, 2.0, true));
    } else if (isTwin) {
      // ⭐ 2方向発射（ツイン梅干し：より高角度の山なり弾を同時投擲！）
      this.umeboshis.push(new UmeboshiBullet(originX, originY - 10, this.facingRight, level, isFire, -3.8, false));
    }

    window.sound.playUmeboshiThrow(level);

    if (level === 3) {
      this.vx = this.facingRight ? -4.5 : 4.5;
      this.attackTimer = 22;
      this.comboStep = 2;
    } else if (level === 2) {
      this.vx = this.facingRight ? -2.2 : 2.2;
      this.attackTimer = 16;
      this.comboStep = 2;
    } else {
      this.vx = this.facingRight ? -0.8 : 0.8;
      this.attackTimer = 12;
      this.comboStep = 1;
    }

    this.isAttacking = true;
    this.idleTimer = 0;
    this.squishX = 1.0;
    this.squishY = 1.0;
  }


  bounce() {
    this.vy = CONSTANTS.PLAYER.BOUNCE_FORCE;
    this.isGrounded = false;
    window.sound.playStomp();
    window.particleManager.createStompEffect(this.x + this.width / 2, this.y + this.height);
  }

  takeDamage(amount = 1) {
    if (this.invincibleTimer > 0 || this.feverTimer > 0) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.invincibleTimer = CONSTANTS.PLAYER.INVINCIBLE_TIME;
    this.vy = -6;
    this.vx = this.facingRight ? -4.5 : 4.5;
    this.chargeTimer = 0;
    this.isChargeReady = false;
    window.sound.stopCharge();
    window.sound.playHit();
    return true;
  }

  activateFever() {
    this.feverTimer = CONSTANTS.PLAYER.FEVER_DURATION;
    window.sound.playPowerUp();
    window.sound.startBGM('fever');
  }

  handleFallRespawn() {
    this.takeDamage(1);
    // ボス戦中またはボス戦イントロ中の落下復帰は必ずボス戦アリーナ内に留まる
    if (window.game && (window.game.state === 'BOSS_INTRO' || window.game.state === 'BOSS_BATTLE')) {
      const bossWallX = CONSTANTS.STAGE_CONFIG ? CONSTANTS.STAGE_CONFIG.BOSS_WALL_X : 4150;
      this.x = Math.max(bossWallX + 80, (window.game.cameraX || bossWallX) + 160);
      this.y = 390;
    } else {
      this.x = this.lastSafeGroundX;
      this.y = this.lastSafeGroundY - 20;
    }
    this.vx = 0;
    this.vy = 0;
  }

  getAttackHitbox() {
    if (!this.isAttacking) return null;
    const isCombo2 = (this.comboStep === 2);
    const isFire = (this.powerupType === CONSTANTS.POWERUP.TYPES.FIRE && this.powerupTimer > 0);
    const isSuper = this.isSuper;
    const mult = (isFire || isSuper) ? 1.5 : 1.0;
    const rangeX = (CONSTANTS.PLAYER.ATTACK_RANGE_X + (isCombo2 ? 28 : 12)) * mult;
    const rangeY = (CONSTANTS.PLAYER.ATTACK_RANGE_Y + (isCombo2 ? 18 : 6)) * mult;
    const x = this.facingRight ? (this.x + this.width * 0.5) : (this.x - rangeX + this.width * 0.5);
    const y = this.y + (this.height - rangeY) / 2;
    return { x, y, width: rangeX, height: rangeY, isCombo2, isFire, isSuper };
  }

  // 🌟 パワーアップ（火力増強・ツインスター）のプレイヤー背面オーラ描画
  drawPowerupAura(ctx, cx, cy) {
    if (this.powerupTimer <= 0 || !this.powerupType) return;

    ctx.save();
    ctx.translate(cx, cy);

    if (this.powerupType === CONSTANTS.POWERUP.TYPES.FIRE) {
      // 🌶️ 燃え盛る紅蓮の炎オーラ
      const pulse = (Math.sin(this.animTimer * 0.25) + 1) * 0.5;
      const r = 38 + pulse * 6;
      const grad = ctx.createRadialGradient(0, 0, 8, 0, 0, r);
      grad.addColorStop(0, 'rgba(255, 240, 100, 0.65)');
      grad.addColorStop(0.4, 'rgba(255, 80, 20, 0.45)');
      grad.addColorStop(0.8, 'rgba(200, 20, 0, 0.25)');
      grad.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // 炎の揺らめき炎尖
      ctx.strokeStyle = 'rgba(255, 120, 0, 0.5)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + this.animTimer * 0.12;
        const len = 22 + Math.sin(this.animTimer * 0.3 + i) * 10;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * 16, Math.sin(ang) * 16);
        ctx.lineTo(Math.cos(ang) * (16 + len), Math.sin(ang) * (16 + len));
        ctx.stroke();
      }
    } else if (this.powerupType === CONSTANTS.POWERUP.TYPES.TWIN) {
      // ⭐ 周囲を公転するツインスターオーラ
      const rot = this.animTimer * 0.12;
      const dist = 36;

      // 軌道サークル
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, dist, 0, Math.PI * 2);
      ctx.stroke();

      // 星1 (ゴールド)
      ctx.save();
      ctx.translate(Math.cos(rot) * dist, Math.sin(rot) * dist);
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 星2 (シアン)
      ctx.save();
      ctx.translate(Math.cos(rot + Math.PI) * dist, Math.sin(rot + Math.PI) * dist);
      ctx.fillStyle = '#00f5d4';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  // 🌟 奇跡の覚醒！スーパー形態（スーパーねこちゃん／スーパーおにぎり）背面オーラ描画
  drawSuperAura(ctx, cx, cy) {
    if (!this.isSuper) return;
    this.superAuraTimer = (this.superAuraTimer || 0) + 1;
    ctx.save();
    ctx.translate(cx, cy);

    const pulse = (Math.sin(this.superAuraTimer * 0.15) + 1) * 0.5;
    const flicker = Math.sin(this.superAuraTimer * 0.35) * 0.15;

    if (this.characterType === 'onigiri') {
      // 🍙 スーパーおにぎり：黄金炊きたて湯気オーラ ＆ 金色バックライト
      const r = 44 + pulse * 8;
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, r);
      grad.addColorStop(0, 'rgba(255, 255, 200, 0.85)');
      grad.addColorStop(0.35, 'rgba(255, 215, 0, 0.55)');
      grad.addColorStop(0.7, 'rgba(255, 120, 50, 0.30)');
      grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // 黄金の炊きたて立ち上る蒸気
      ctx.strokeStyle = 'rgba(255, 240, 160, 0.65)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      for (let i = -1; i <= 1; i++) {
        const sx = i * 14;
        const wave = Math.sin(this.superAuraTimer * 0.2 + i * 2) * 5;
        ctx.beginPath();
        ctx.moveTo(sx, -20);
        ctx.quadraticCurveTo(sx + wave, -36, sx - wave * 0.5, -52 - pulse * 8);
        ctx.stroke();
      }
    } else {
      // 🐾 スーパーねこちゃん：激しく燃え盛る黄金超サイヤ炎オーラ
      const r = 46 + pulse * 10;
      const grad = ctx.createRadialGradient(0, 0, 12, 0, 0, r);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.90)');
      grad.addColorStop(0.25, 'rgba(255, 235, 60, 0.70)');
      grad.addColorStop(0.65, 'rgba(0, 245, 212, 0.40)'); // シアンの神気
      grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // 黄金の炎突起（揺らめくオーラフレア）
      ctx.fillStyle = 'rgba(255, 230, 80, 0.45)';
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2 + Math.sin(this.superAuraTimer * 0.2 + i) * 0.2;
        const flareDist = 32 + ((i + this.superAuraTimer) % 3) * 6 + pulse * 6;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * flareDist, Math.sin(ang) * flareDist, 8 + flicker * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 飛翔中のスーパー星屑パーティクル（適度な頻度）
    if (Math.random() < 0.40 && window.particleManager && window.particleManager.particles) {
      const pColor = (this.characterType === 'onigiri')
        ? ((Math.random() > 0.5) ? '#ffd700' : '#ff4d6d')
        : ((Math.random() > 0.5) ? '#ffd700' : '#00f5d4');
      window.particleManager.particles.push(new Particle(
        this.x + Math.random() * this.width,
        this.y + this.height * 0.2 + Math.random() * (this.height * 0.8),
        (Math.random() - 0.5) * 2.2,
        -1.8 - Math.random() * 2.5,
        pColor,
        4.0 + Math.random() * 3.5,
        22,
        'star'
      ));
    }
  }

  draw(ctx, cameraX, stage = null) {
    // 🌟 2.5Dリアルタイム・ドロップシャドウ（高度連動接地影）
    const curStage = stage || (window.game ? window.game.stage : null);
    if (curStage && typeof curStage.getGroundYBelow === 'function') {
      const footX = this.x + this.width / 2;
      const footY = this.y + this.height;
      const groundY = curStage.getGroundYBelow(footX, footY);
      if (groundY !== null) {
        const dist = Math.max(0, groundY - footY);
        const factor = Math.max(0.28, 1 - dist / 260);
        const alpha = Math.max(0.08, 0.48 * (1 - dist / 300));
        ctx.save();
        ctx.translate(footX - cameraX, groundY);
        ctx.scale(factor, 0.26 * factor);
        ctx.fillStyle = `rgba(15, 15, 30, ${alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 波動拳＆梅干し弾の描画
    for (const h of this.hadoukens) {
      h.draw(ctx, cameraX);
    }
    for (const u of this.umeboshis) {
      u.draw(ctx, cameraX);
    }

    if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 4) % 2 === 0) {
      return;
    }

    // 🌟 スーパーオーラ または 通常パワーアップオーラ描画（キャラクターの背後）
    const cx = this.x + this.width / 2 - cameraX;
    const cy = this.y + this.height / 2;
    if (this.isSuper) {
      this.drawSuperAura(ctx, cx, cy);
    } else {
      this.drawPowerupAura(ctx, cx, cy);
    }

    // ★ おにぎりキャラクター描画
    if (this.characterType === 'onigiri') {
      this.drawOnigiri(ctx, cameraX);
      if (this.chargeTimer > 15) {
        this.drawChargeBar(ctx, cameraX);
      }
      return;
    }

    // ★ ねこキャラクター描画
    ctx.save();
    // 歩行・走行時のボビング（上下にピョコピョコ弾む！）
    let bobY = 0;
    if (Math.abs(this.vx) > 2.8 && this.isGrounded) {
      bobY = Math.sin(this.animTimer * 0.7) * 2.8; // ダッシュ時のテンポ良い弾み
    } else if (Math.abs(this.vx) > 0.3 && this.isGrounded) {
      bobY = Math.sin(this.animTimer * 0.42) * 2.0; // 歩行時の緩やかな弾み
    }

    const centerX = this.x + this.width / 2 - cameraX;
    const centerY = this.y + this.height / 2 + bobY;
    ctx.translate(centerX, centerY);

    ctx.scale(this.facingRight ? this.squishX : -this.squishX, this.squishY);

    // チャージ完了時の黄金オーラ / スーパー覚醒オーラ
    if (this.isSuper) {
      ctx.beginPath();
      ctx.arc(0, 0, this.width * 0.70, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.45)';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 18;
      ctx.fill();
    } else if (this.isChargeReady) {
      ctx.beginPath();
      ctx.arc(0, 0, this.width * 0.65, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.45)';
      ctx.fill();
    } else if (this.feverTimer > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, this.width * 0.65, 0, Math.PI * 2);
      const hue = (Date.now() / 4) % 360;
      ctx.fillStyle = `hsla(${hue}, 95%, 65%, 0.45)`;
      ctx.fill();
    }

    if (this.spriteLoaded && this.spriteImg) {
      const sheetW = this.spriteImg.naturalWidth || this.spriteImg.width;
      const sheetH = this.spriteImg.naturalHeight || this.spriteImg.height;
      const colW = sheetW / 4;
      const rowH = sheetH / 2;

      let col = 0;
      let row = 0;

      if (this.invincibleTimer > 0 && Math.abs(this.vx) > 0.5) {
        col = 3; row = 1;
      } else if (this.isAttacking) {
        col = (this.comboStep === 2) ? 2 : 1;
        row = 1;
      } else if (!this.isGrounded) {
        col = 0; row = 1; // ジャンプ
      } else if (Math.abs(this.vx) > 2.8 || this.feverTimer > 0) {
        // ★ 矢印長押しダッシュ走行：手足を高速でタタタタッと動かす！
        const runCycle = Math.floor(this.animTimer / 3.8) % 4;
        const runCols = [1, 2, 3, 2];
        col = runCols[runCycle];
        row = 0;

        // 走っているときの砂煙エフェクト（手足で地面を蹴る）
        if (this.animTimer % 7 === 0 && this.isGrounded) {
          window.particleManager.particles.push(new Particle(
            this.x + (this.facingRight ? 8 : this.width - 8),
            this.y + this.height - 2,
            this.facingRight ? -1.8 : 1.8,
            -0.8 - Math.random() * 0.8,
            'rgba(230, 220, 200, 0.7)',
            4 + Math.random() * 3,
            12,
            'circle'
          ));
        }
      } else if (Math.abs(this.vx) > 0.2) {
        // ★ 通常歩行：ゆったりパタパタ歩く
        const stepCycle = Math.floor(this.animTimer / 6) % 4;
        const walkCols = [1, 2, 3, 2];
        col = walkCols[stepCycle];
        row = 0;
      } else if (this.chargeTimer > 20) {
        // チャージ中の溜めポーズ（前足を構える）
        col = 1; row = 1;
      } else {
        col = 0; row = 0; // 四つ足待機
      }

      const sx = col * colW;
      const sy = row * rowH;
      const renderW = this.width * 1.35;
      const renderH = this.height * 1.35;

      // 🌟 星のカービィ Wii デラックス風：クッキリした太いアニメ輪郭線
      ctx.save();
      ctx.shadowColor = 'rgba(20, 20, 35, 0.88)';
      ctx.shadowBlur = 4;
      ctx.drawImage(
        this.spriteImg,
        sx, sy, colW, rowH,
        -renderW / 2, -renderH / 2 - 4, renderW, renderH
      );
      ctx.restore();

      // 本体スプライト
      ctx.drawImage(
        this.spriteImg,
        sx, sy, colW, rowH,
        -renderW / 2, -renderH / 2 - 4, renderW, renderH
      );
    }

    // ひっかき攻撃エフェクト
    if (this.isAttacking) {
      const isCombo2 = (this.comboStep === 2);
      const slashProgress = 1 - (this.attackTimer / (isCombo2 ? 18 : 14));
      ctx.save();
      ctx.translate(this.width * 0.45, -6);
      ctx.strokeStyle = (this.feverTimer > 0) ? '#00f5d4' : (isCombo2 ? '#ffb703' : '#ff4d6d');
      ctx.lineWidth = isCombo2 ? 6.5 : 4.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = (this.feverTimer > 0) ? '#00f5d4' : '#ff4d6d';
      ctx.shadowBlur = 14;

      const spread = isCombo2 ? 18 : 14;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        const startY = i * spread - (isCombo2 ? 26 : 18) * slashProgress;
        const endY = i * spread + (isCombo2 ? 32 : 22) * slashProgress;
        ctx.moveTo(12, startY);
        ctx.quadraticCurveTo(isCombo2 ? 45 : 32, (startY + endY) / 2, 16, endY);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();

    // ★ 頭上のチャージゲージ描画
    if (this.chargeTimer > 15) {
      this.drawChargeBar(ctx, cameraX);
    }
  }

  // =========================================================================
  // 🍙 おにぎり専用プロシージャル描画（手書きイラスト忠実再現＆もちもちアニメ）
  // =========================================================================
  drawOnigiri(ctx, cameraX) {
    ctx.save();

    // 歩行・走行・ジャンプ時のボビング（ぽよぽよ弾む！）
    let bobY = 0;
    let squishX = 1.0;
    let squishY = 1.0;

    if (!this.isGrounded) {
      // 空中：上昇時は縦伸び、下降時は少し縮む
      squishX = 0.94;
      squishY = 1.08;
      bobY = 0;
    } else if (Math.abs(this.vx) > 2.8 || this.feverTimer > 0) {
      // ダッシュ：小刻みにポコポコ跳ねる
      bobY = Math.sin(this.animTimer * 0.65) * 3.5;
      squishX = 1.0 + Math.cos(this.animTimer * 0.65) * 0.06;
      squishY = 1.0 - Math.cos(this.animTimer * 0.65) * 0.06;

      // 走る時の足元砂煙
      if (this.animTimer % 7 === 0) {
        window.particleManager.particles.push(new Particle(
          this.x + (this.facingRight ? 12 : this.width - 12),
          this.y + this.height - 2,
          this.facingRight ? -1.6 : 1.6,
          -0.8 - Math.random() * 0.8,
          'rgba(240, 230, 220, 0.7)',
          4 + Math.random() * 3,
          12,
          'circle'
        ));
      }
    } else if (Math.abs(this.vx) > 0.2) {
      // 通常歩行：てくてく揺れる
      bobY = Math.sin(this.animTimer * 0.42) * 2.2;
      squishX = 1.0 + Math.cos(this.animTimer * 0.42) * 0.04;
      squishY = 1.0 - Math.cos(this.animTimer * 0.42) * 0.04;
    } else {
      // 待機中（呼吸）：ふわっと上下
      bobY = Math.sin(this.animTimer * 0.08) * 1.4;
      squishX = 1.0 + Math.sin(this.animTimer * 0.08) * 0.025;
      squishY = 1.0 - Math.sin(this.animTimer * 0.08) * 0.025;
    }

    const cx = this.x + this.width / 2 - cameraX;
    const cy = this.y + this.height / 2 + bobY;
    ctx.translate(cx, cy);

    // 向き反転
    ctx.scale(this.facingRight ? 1 : -1, 1);
    ctx.scale(squishX, squishY);

    // ★ チャージ・フィーバー時のオーラ
    if (this.isChargeReady) {
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 234, 0, 0.42)';
      ctx.fill();
    } else if (this.feverTimer > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 2);
      const hue = (Date.now() / 4) % 360;
      ctx.fillStyle = `hsla(${hue}, 95%, 65%, 0.45)`;
      ctx.fill();
    }

    // 1. ちょこんと生えた足（Uのような可愛い2本足）
    ctx.save();
    const legCycle = (!this.isGrounded) ? 0 : (Math.abs(this.vx) > 0.2 ? Math.sin(this.animTimer * 0.45) : 0);
    const leftLegOffset = (!this.isGrounded) ? -3 : legCycle * 5;
    const rightLegOffset = (!this.isGrounded) ? -3 : -legCycle * 5;

    ctx.strokeStyle = '#383838';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 左足（手前）
    ctx.beginPath();
    ctx.moveTo(-10, 20);
    ctx.quadraticCurveTo(-10 + leftLegOffset * 0.6, 28, -6 + leftLegOffset, 28);
    ctx.stroke();

    // 右足（奥）
    ctx.beginPath();
    ctx.moveTo(8, 20);
    ctx.quadraticCurveTo(8 + rightLegOffset * 0.6, 28, 12 + rightLegOffset, 28);
    ctx.stroke();
    ctx.restore();

    // 2. ふっくら三角おにぎりボディ（白米＋手書き風の温かいライン）
    ctx.save();
    // お米ボディのパス
    ctx.beginPath();
    // 頂点（角丸）
    ctx.moveTo(0, -25);
    // 右上の肩〜右下角
    ctx.bezierCurveTo(15, -18, 27, 2, 25, 20);
    // 底辺（少し丸みを帯びた底）
    ctx.bezierCurveTo(16, 23, -16, 23, -25, 20);
    // 左下角〜左上の肩〜頂点
    ctx.bezierCurveTo(-27, 2, -15, -18, 0, -25);
    ctx.closePath();

    // お米のやわらかなグラデーション
    const riceGrad = ctx.createLinearGradient(0, -26, 0, 23);
    riceGrad.addColorStop(0, '#ffffff');
    riceGrad.addColorStop(0.7, '#fffefa');
    riceGrad.addColorStop(1, '#f7f2ea');
    ctx.fillStyle = riceGrad;
    ctx.fill();

    // 手書き風の素朴で温かいグレーの輪郭線
    ctx.lineWidth = 3.6;
    ctx.strokeStyle = '#3a3838';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // 3. パリッとした黒い海苔（下部中央・斜めハッチング手書き調）
    ctx.save();
    ctx.beginPath();
    // 海苔の形状（角丸の長方形・台形）
    const noriW = 19;
    const noriH = 17;
    const noriX = -noriW / 2;
    const noriY = 6;
    ctx.roundRect(noriX, noriY, noriW, noriH, [3, 3, 4, 4]);

    // 海苔のベース（スーパーおにぎり時は眩い金箔海苔！）
    if (this.isSuper) {
      const goldGrad = ctx.createLinearGradient(noriX, noriY, noriX + noriW, noriY + noriH);
      goldGrad.addColorStop(0, '#ffd700');
      goldGrad.addColorStop(0.5, '#fff9db');
      goldGrad.addColorStop(1, '#e5a100');
      ctx.fillStyle = goldGrad;
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#ffd700';
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1c1c1e';
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#3a3838';
      ctx.stroke();
    }

    // 添付写真風の斜めハッチング（手書きの素朴なペンタッチ）
    ctx.save();
    ctx.clip(); // 海苔の中にクリップ
    ctx.strokeStyle = this.isSuper ? 'rgba(255, 255, 255, 0.75)' : 'rgba(70, 70, 75, 0.75)';
    ctx.lineWidth = 1.6;
    for (let x = -noriW; x < noriW * 2; x += 4.5) {
      ctx.beginPath();
      ctx.moveTo(noriX + x, noriY - 2);
      ctx.lineTo(noriX + x - 10, noriY + noriH + 4);
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();

    // 4. つぶらなお顔（目・赤ほっぺ・口）
    ctx.save();
    // 表情判定
    const isThrowing = this.isAttacking;
    const isHurt = (this.invincibleTimer > 0 && Math.abs(this.vx) > 0.5);

    if (isHurt) {
      // 被弾時：ぎゅっとつぶった目 (> <)
      ctx.strokeStyle = '#2b2b2b';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      // 左目 >
      ctx.beginPath();
      ctx.moveTo(-9, -7); ctx.lineTo(-6, -5); ctx.lineTo(-9, -3);
      ctx.stroke();
      // 右目 <
      ctx.beginPath();
      ctx.moveTo(9, -7); ctx.lineTo(6, -5); ctx.lineTo(9, -3);
      ctx.stroke();
    } else if (isThrowing || this.chargeTimer > 30) {
      // 梅干し投擲・チャージ時：キリッとした笑顔 (^ ^)
      ctx.strokeStyle = '#2b2b2b';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      // 左目 ^
      ctx.beginPath();
      ctx.moveTo(-8, -4); ctx.quadraticCurveTo(-6, -7, -4, -4);
      ctx.stroke();
      // 右目 ^
      ctx.beginPath();
      ctx.moveTo(4, -4); ctx.quadraticCurveTo(6, -7, 8, -4);
      ctx.stroke();
    } else {
      // 通常時：添付写真そのままのつぶらな黒い点目！
      ctx.fillStyle = '#222222';
      ctx.beginPath();
      ctx.arc(-6, -5, 2.2, 0, Math.PI * 2);
      ctx.arc(6, -5, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // ほんのり赤いクレヨン調チークほっぺ（添付写真のキュートな赤丸・楕円）
    ctx.fillStyle = 'rgba(255, 77, 109, 0.85)';
    ctx.beginPath();
    ctx.ellipse(-14, -2, 4.2, 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(14, -2, 4.2, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 可愛い小さなお口
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 2.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (isThrowing) {
      // 投げる時の「わっ！」とした丸口
      ctx.fillStyle = '#ff4d6d';
      ctx.ellipse(0, -1, 3.2, 4.0, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // にっこり口（ちょこんと微笑み）
      ctx.moveTo(-2.5, -1);
      ctx.quadraticCurveTo(0, 1.5, 2.5, -1);
      ctx.stroke();
    }
    ctx.restore();

    // ★ スーパーおにぎり専用：額に燦然と輝くルビー南高梅ジュエル
    if (this.isSuper) {
      ctx.save();
      ctx.translate(0, -18);
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      // ひし形ジュエル
      ctx.moveTo(0, -5);
      ctx.lineTo(4.5, 0);
      ctx.lineTo(0, 5);
      ctx.lineTo(-4.5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // キラリハイライト
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-1, -1.5, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. ちょこんと生えた手（Cのような形・歩行やスローで動く）
    ctx.save();
    ctx.strokeStyle = '#383838';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';

    const armCycle = (Math.abs(this.vx) > 0.2) ? Math.sin(this.animTimer * 0.45) : 0;

    if (isThrowing) {
      // 梅干し投擲モーション：右手（前）をグッと前に突き出す！
      // 奥の手（左手）
      ctx.beginPath();
      ctx.arc(-22, 2, 4.5, Math.PI * 0.6, Math.PI * 1.8, false);
      ctx.stroke();
      // 手前の手（右手）
      ctx.beginPath();
      ctx.moveTo(18, -2);
      ctx.quadraticCurveTo(28, -6, 26, 2);
      ctx.stroke();
    } else {
      // 通常時・歩行時
      // 左手（奥）
      const leftArmAngle = armCycle * 0.35;
      ctx.save();
      ctx.translate(-21, 0);
      ctx.rotate(leftArmAngle);
      ctx.beginPath();
      ctx.arc(0, 0, 4.8, Math.PI * 0.6, Math.PI * 1.8, false);
      ctx.stroke();
      ctx.restore();

      // 右手（手前）
      const rightArmAngle = -armCycle * 0.35;
      ctx.save();
      ctx.translate(21, 0);
      ctx.rotate(rightArmAngle);
      ctx.beginPath();
      ctx.arc(0, 0, 4.8, -Math.PI * 0.8, Math.PI * 0.4, false);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // 6. 頭上に浮かぶ手書きハート（添付写真のハートマークを再現！）
    if (this.hearts && this.hearts.length > 0) {
      for (const ht of this.hearts) {
        ctx.save();
        ctx.translate(ht.x, ht.y);
        ctx.scale(ht.scale, ht.scale);
        ctx.globalAlpha = ht.alpha;

        ctx.fillStyle = '#ff4d6d';
        ctx.strokeStyle = '#c9184a';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        const s = 6.5;
        ctx.moveTo(0, -s * 0.3);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.85, -s, -s * 0.25, 0, s * 0.85);
        ctx.bezierCurveTo(s, -s * 0.25, s * 0.5, -s * 0.85, 0, -s * 0.3);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  drawChargeBar(ctx, cameraX) {
    const barW = 56;
    const barH = 7;
    const x = this.x + (this.width - barW) / 2 - cameraX;
    const y = this.y - 20;

    // 背景枠
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(x - 2, y - 2, barW + 4, barH + 4);

    const progress = Math.min(1, this.chargeTimer / this.maxCharge);

    // 段階別カラー
    let barColor = (this.characterType === 'onigiri') ? '#ff4d6d' : '#ff758f'; // Lv1
    let label = 'Lv.1';
    if (this.chargeTimer >= this.maxCharge) {
      barColor = (Math.floor(this.animTimer / 4) % 2 === 0) ? '#ffea00' : '#ffffff';
      label = (this.characterType === 'onigiri') ? '南高梅MAX!!' : 'MAX!!';
    } else if (this.chargeTimer >= 60) {
      barColor = (this.characterType === 'onigiri') ? '#c9184a' : '#00f5d4'; // Lv2
      label = 'Lv.2';
    }

    ctx.fillStyle = barColor;
    ctx.fillRect(x, y, barW * progress, barH);

    // Lv2境界スプリットライン (60 / 180 = 1/3地点)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(x + barW * (60 / 180), y, 1.5, barH);

    // テキスト
    ctx.fillStyle = (progress >= 1) ? '#ffea00' : '#ffffff';
    ctx.font = 'bold 9px ' + CONSTANTS.FONT_FAMILY;
    ctx.textAlign = 'center';
    ctx.fillText(label, x + barW / 2, y - 3);
  }

}

window.Player = Player;
window.HadoukenBullet = HadoukenBullet;
window.UmeboshiBullet = UmeboshiBullet;
