// src/particles.js - 演出・パーティクル・エフェクトマネージャー

class Particle {
  constructor(x, y, vx, vy, color, size, life, shape = 'circle') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.shape = shape; // 'circle', 'star', 'slash', 'heart', 'coin'
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.life--;
  }

  draw(ctx, cameraX) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(this.x - cameraX, this.y);
    ctx.rotate(this.rotation);

    if (this.shape === 'star') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size,
                   -Math.sin((18 + i * 72) * Math.PI / 180) * this.size);
        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (this.size * 0.4),
                   -Math.sin((54 + i * 72) * Math.PI / 180) * (this.size * 0.4));
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.shape === 'heart') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      const s = this.size;
      ctx.moveTo(0, -s * 0.3);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.8, -s, -s * 0.2, 0, s * 0.8);
      ctx.bezierCurveTo(s, -s * 0.2, s * 0.5, -s * 0.8, 0, -s * 0.3);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

class ParticleManager {
  constructor() {
    this.particles = [];
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx, cameraX) {
    for (const p of this.particles) {
      p.draw(ctx, cameraX);
    }
  }

  // ひっかきヒット時の星エフェクト
  createScratchHit(x, y) {
    const colors = ['#ffe17d', '#ff9ebb', '#ffffff', '#ff8400'];
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        6 + Math.random() * 6,
        22 + Math.floor(Math.random() * 10),
        'star'
      ));
    }
  }

  // 踏みつけヒット時のポヨン煙
  createStompEffect(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 8) * (i + 1) + Math.PI * 0.5;
      const speed = 1.5 + Math.random() * 2.5;
      this.particles.push(new Particle(
        x + (Math.random() - 0.5) * 20, y,
        Math.cos(angle) * speed,
        -Math.sin(angle) * speed * 0.5,
        '#ffffff',
        7 + Math.random() * 5,
        18,
        'circle'
      ));
    }
  }

  // コイン取得キラキラ
  createCoinSparkle(x, y) {
    const colors = ['#ffe17d', '#ffffff'];
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 1.5,
        colors[Math.floor(Math.random() * colors.length)],
        5 + Math.random() * 3,
        20,
        'star'
      ));
    }
  }

  // またたび無敵オーラ（プレイヤー周囲の虹色キラキラ）
  createFeverSparkle(x, y) {
    const rainbow = ['#ff4d6d', '#ffb703', '#88d87a', '#48cae4', '#b5179e'];
    const color = rainbow[Math.floor(Math.random() * rainbow.length)];
    this.particles.push(new Particle(
      x + (Math.random() - 0.5) * 36,
      y + (Math.random() - 0.5) * 36,
      (Math.random() - 0.5) * 1.5,
      -1 - Math.random() * 2,
      color,
      4 + Math.random() * 4,
      25,
      'star'
    ));
  }

  // クリア時の紙吹雪
  createConfetti(x, y) {
    const colors = ['#ff4d6d', '#ffd166', '#06d6a0', '#118ab2', '#ff9ebb'];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 3,
        colors[Math.floor(Math.random() * colors.length)],
        6 + Math.random() * 5,
        60 + Math.floor(Math.random() * 40),
        'circle'
      ));
    }
  }

  // 汎用スパークル・きらめき
  createSparkle(x, y, color = '#ffd166', shape = 'star') {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 3.5;
    this.particles.push(new Particle(
      x, y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed - 1.0,
      color,
      4 + Math.random() * 4,
      25 + Math.floor(Math.random() * 15),
      shape
    ));
  }

  // 🌟 奇跡の覚醒！スーパー覚醒大爆発パーティクル（黄金・虹色スター＆リング）
  createSuperRevivalBurst(x, y) {
    const colors = ['#ffd700', '#ffea00', '#ffffff', '#ff3b30', '#00f5d4', '#ff007f'];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 3.5 + Math.random() * 8.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = (i % 3 === 0) ? 'star' : ((i % 5 === 0) ? 'heart' : 'circle');
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 1.5,
        color,
        6 + Math.random() * 8,
        50 + Math.floor(Math.random() * 30),
        shape
      ));
    }
  }
}

window.particleManager = new ParticleManager();
