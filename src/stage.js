// src/stage.js - 🌟 みかど世界観 監修：全8ステージ多重パララックス背景＆マップシステム

class Stage {
  constructor(stageNumber = 1) {
    this.stageNumber = stageNumber;
    this.width = (typeof CONSTANTS !== 'undefined' && CONSTANTS.STAGE_CONFIG) ? CONSTANTS.STAGE_CONFIG.WIDTH : 5100;
    this.height = CONSTANTS.CANVAS_HEIGHT;
    this.blocks = [];
    this.clouds = [];
    this.decorations = [];
    this.neonSigns = [];
    this.stars = [];
    this.cogs = [];
    this.timer = 0;

    // 🌟 ステージ1美麗AI背景（桜キャットパレス）の読み込み
    if (this.stageNumber === 1) {
      this.palaceBgImg = new Image();
      this.palaceBgLoaded = false;
      this.palaceBgImg.onload = () => { this.palaceBgLoaded = true; };
      this.palaceBgImg.onerror = (e) => { console.warn('Palace BG load failed, fallback to vector:', e); };
      this.palaceBgImg.src = 'assets/stage1_palace_bg.jpg';
    } else if (this.stageNumber === 2) {
      // 🌟 ステージ2美麗AI背景（ネオン・ショッピングモール）の読み込み
      this.mallBgImg = new Image();
      this.mallBgLoaded = false;
      this.mallBgImg.onload = () => { this.mallBgLoaded = true; };
      this.mallBgImg.onerror = (e) => { console.warn('Mall BG load failed, fallback to vector:', e); };
      this.mallBgImg.src = 'assets/stage2_mall_bg.jpg';
    } else if (this.stageNumber === 3) {
      // 🌟 ステージ3美麗AI背景（月夜の歯車時計塔ペントハウス）の読み込み
      this.clockBgImg = new Image();
      this.clockBgLoaded = false;
      this.clockBgImg.onload = () => { this.clockBgLoaded = true; };
      this.clockBgImg.onerror = (e) => { console.warn('Clock BG load failed, fallback to vector:', e); };
      this.clockBgImg.src = 'assets/stage3_clock_bg.jpg';
    } else if (this.stageNumber === 4) {
      // 🌟 ステージ4美麗AI背景（激闘！グルメ寿司屋敷＆厨房）の読み込み
      this.sushiBgImg = new Image();
      this.sushiBgLoaded = false;
      this.sushiBgImg.onload = () => { this.sushiBgLoaded = true; };
      this.sushiBgImg.onerror = (e) => { console.warn('Sushi BG load failed, fallback to vector:', e); };
      this.sushiBgImg.src = 'assets/stage4_sushi_bg.jpg';
    } else if (this.stageNumber === 5) {
      // 🌟 ステージ5美麗AI背景（トロピカル・キャットビーチ）の読み込み
      this.beachBgImg = new Image();
      this.beachBgLoaded = false;
      this.beachBgImg.onload = () => { this.beachBgLoaded = true; };
      this.beachBgImg.onerror = (e) => { console.warn('Beach BG load failed, fallback to vector:', e); };
      this.beachBgImg.src = 'assets/stage5_beach_bg.jpg';
    } else if (this.stageNumber === 6) {
      // 🌟 ステージ6美麗AI背景（ゴースト洋館）の読み込み
      this.ghostBgImg = new Image();
      this.ghostBgLoaded = false;
      this.ghostBgImg.onload = () => { this.ghostBgLoaded = true; };
      this.ghostBgImg.onerror = (e) => { console.warn('Ghost BG load failed, fallback to vector:', e); };
      this.ghostBgImg.src = 'assets/stage6_ghost_bg.jpg';
    } else if (this.stageNumber === 7) {
      // 🌟 ステージ7美麗AI背景（コズミック宇宙）の読み込み
      this.spaceBgImg = new Image();
      this.spaceBgLoaded = false;
      this.spaceBgImg.onload = () => { this.spaceBgLoaded = true; };
      this.spaceBgImg.onerror = (e) => { console.warn('Space BG load failed, fallback to vector:', e); };
      this.spaceBgImg.src = 'assets/stage7_space_bg.jpg';
    } else if (this.stageNumber === 8) {
      // 🌟 ステージ8美麗AI背景（天空宮殿・神聖サンライズ）の読み込み
      this.castleBgImg = new Image();
      this.castleBgLoaded = false;
      this.castleBgImg.onload = () => { this.castleBgLoaded = true; };
      this.castleBgImg.onerror = (e) => { console.warn('Castle BG load failed, fallback to vector:', e); };
      this.castleBgImg.src = 'assets/stage8_castle_bg.jpg';
    }

    this.initMap();
    this.initBackgroundElements();
  }

  initBackgroundElements() {
    if (this.stageNumber === 1) {
      // 🏞️ ステージ1: 大豪邸ガーデン（任天堂カービィ調おとぎ話ガーデン）
      for (let i = 0; i < 10; i++) {
        this.clouds.push({
          x: Math.random() * this.width,
          y: 20 + Math.random() * 80,
          speed: 0.12 + Math.random() * 0.20,
          scale: 0.7 + Math.random() * 0.5
        });
      }
      this.gardenPalaces = [
        { x: 280, y: 170, scale: 0.95 },
        { x: 920, y: 165, scale: 1.05 },
        { x: 1580, y: 170, scale: 0.90 },
        { x: 2320, y: 160, scale: 1.10 }
      ];
      this.fountains = [
        { x: 580, y: 385 },
        { x: 1280, y: 385 },
        { x: 1980, y: 385 }
      ];
      this.fountainParticles = [];
      for (let i = 0; i < 30; i++) {
        this.fountainParticles.push({
          fountainIdx: i % 3,
          offsetAngle: (i / 30) * Math.PI * 2,
          radiusX: 15 + Math.random() * 25,
          speed: 0.04 + Math.random() * 0.04
        });
      }
      this.gardenPetals = [];
      for (let i = 0; i < 25; i++) {
        this.gardenPetals.push({
          x: Math.random() * this.width,
          y: Math.random() * 420,
          speedX: 0.4 + Math.random() * 0.6,
          speedY: 0.2 + Math.random() * 0.4,
          rot: Math.random() * Math.PI,
          color: (i % 2 === 0) ? '#ff85a1' : '#ffd166'
        });
      }
    } else if (this.stageNumber === 2) {
      // 🛍️ ステージ2: ネオン・ショッピングモール（80sパステルディスコモール）
      const signLabels = [
        { text: '✨ CAT MALL ✨', color: '#ff007f', w: 140 },
        { text: 'SALE -70%', color: '#00f5d4', w: 100 },
        { text: 'BOUTIQUE', color: '#ffd166', w: 110 },
        { text: 'CATNIP CAFE', color: '#70e000', w: 125 },
        { text: 'LUXURY FISH', color: '#00f5d4', w: 120 },
        { text: 'BARGAIN NOW!', color: '#ff007f', w: 130 }
      ];
      for (let i = 0; i < 14; i++) {
        const item = signLabels[i % signLabels.length];
        this.neonSigns.push({
          x: 100 + i * 200 + Math.random() * 60,
          y: 35 + (i % 3) * 45,
          text: item.text,
          color: item.color,
          width: item.w,
          blinkOffset: Math.random() * 10
        });
      }
      this.mallEscalators = [
        { x: 320, y: 240, w: 160, h: 90 },
        { x: 920, y: 240, w: 160, h: 90 },
        { x: 1520, y: 240, w: 160, h: 90 },
        { x: 2120, y: 240, w: 160, h: 90 }
      ];
      this.mallConfetti = [];
      for (let i = 0; i < 35; i++) {
        this.mallConfetti.push({
          x: Math.random() * this.width,
          y: Math.random() * 450,
          speedY: 0.3 + Math.random() * 0.7,
          color: ['#ff007f', '#00f5d4', '#ffd166', '#ffffff'][i % 4],
          size: 3 + Math.random() * 3
        });
      }
    } else if (this.stageNumber === 3) {
      // 🕰️ ステージ3: 最上階ペントハウス・時計塔
      for (let i = 0; i < 55; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * 320,
          size: 1 + Math.random() * 2.5,
          twinkleSpeed: 0.03 + Math.random() * 0.05
        });
      }
      const cogRadii = [80, 120, 95, 140, 75, 110];
      for (let i = 0; i < 6; i++) {
        this.cogs.push({
          x: 250 + i * 440,
          y: 110 + (i % 2) * 60,
          radius: cogRadii[i],
          teeth: 12,
          speed: (i % 2 === 0 ? 0.006 : -0.008)
        });
      }
      this.gearSparks = [];
      for (let i = 0; i < 20; i++) {
        this.gearSparks.push({
          x: Math.random() * this.width,
          y: Math.random() * 380,
          speedY: 0.2 + Math.random() * 0.5,
          size: 2 + Math.random() * 2
        });
      }
    } else if (this.stageNumber === 4) {
      // 🍣 ステージ4: 激闘！グルメ寿司屋敷＆厨房（和風祭囃子キッチン）
      this.kitchenLanterns = [];
      for (let i = 0; i < 16; i++) {
        this.kitchenLanterns.push({
          x: 100 + i * 185 + Math.random() * 30,
          y: 40 + (i % 2) * 22,
          color: (i % 2 === 0) ? '#e63946' : '#ffd166',
          swayOffset: Math.random() * Math.PI * 2
        });
      }
      this.kitchenSteam = [];
      for (let i = 0; i < 35; i++) {
        this.kitchenSteam.push({
          x: Math.random() * this.width,
          y: Math.random() * 380,
          speedY: 0.7 + Math.random() * 1.1,
          size: 10 + Math.random() * 14,
          alpha: 0.25 + Math.random() * 0.35
        });
      }
      this.kitchenPots = [
        { x: 340, y: 340 },
        { x: 920, y: 340 },
        { x: 1540, y: 340 },
        { x: 2180, y: 340 }
      ];
      this.kitchenBanners = [
        { x: 200, y: 115, text: '大漁' },
        { x: 740, y: 115, text: '極上' },
        { x: 1360, y: 115, text: '天下' },
        { x: 1980, y: 115, text: '名物' },
        { x: 2540, y: 115, text: '大入' }
      ];
    } else if (this.stageNumber === 5) {
      // 🏖️ ステージ5: トロピカル・キャットビーチ（常夏サンバビーチ）
      this.beachClouds = [];
      for (let i = 0; i < 10; i++) {
        this.beachClouds.push({
          x: Math.random() * this.width,
          y: 25 + Math.random() * 85,
          speed: 0.15 + Math.random() * 0.22,
          scale: 0.8 + Math.random() * 0.4
        });
      }
      this.palmTrees = [
        { x: 160, y: 390, scale: 1.0, swayOffset: 0 },
        { x: 550, y: 390, scale: 0.85, swayOffset: 1.5 },
        { x: 1040, y: 390, scale: 1.1, swayOffset: 3.0 },
        { x: 1510, y: 390, scale: 0.9, swayOffset: 4.5 },
        { x: 2000, y: 390, scale: 1.05, swayOffset: 2.2 },
        { x: 2490, y: 390, scale: 0.95, swayOffset: 0.8 },
        { x: 2980, y: 390, scale: 1.0, swayOffset: 1.2 },
        { x: 3470, y: 390, scale: 0.9, swayOffset: 2.8 }
      ];
      this.sailboats = [
        { x: 260, y: 228, speed: 0.12 },
        { x: 960, y: 232, speed: 0.16 },
        { x: 1660, y: 225, speed: 0.14 },
        { x: 2560, y: 228, speed: 0.13 },
        { x: 3260, y: 230, speed: 0.15 }
      ];
      this.beachUmbrellas = [
        { x: 250, y: 405, color1: '#ff0054', color2: '#ffbd00' },
        { x: 720, y: 405, color1: '#00f5d4', color2: '#ffffff' },
        { x: 1210, y: 405, color1: '#ff5400', color2: '#ffbd00' },
        { x: 1680, y: 405, color1: '#70e000', color2: '#ffffff' },
        { x: 2170, y: 405, color1: '#ff0054', color2: '#00f5d4' },
        { x: 2660, y: 405, color1: '#ff5400', color2: '#ffffff' },
        { x: 3150, y: 405, color1: '#00f5d4', color2: '#ffbd00' },
        { x: 3640, y: 405, color1: '#ff0054', color2: '#ffffff' }
      ];
    } else if (this.stageNumber === 6) {
      // 👻 ステージ6: 妖怪・ゴーストキャットマンション（ポップゴシック洋館）
      this.ghostWisps = [];
      for (let i = 0; i < 35; i++) {
        this.ghostWisps.push({
          x: Math.random() * this.width,
          y: Math.random() * 400,
          speedY: -0.3 - Math.random() * 0.7,
          radius: 8 + Math.random() * 8
        });
      }
      this.ghostChandeliers = [
        { x: 320, y: 110 },
        { x: 840, y: 110 },
        { x: 1360, y: 110 },
        { x: 1880, y: 110 },
        { x: 2380, y: 110 }
      ];
      this.ghostCards = [];
      for (let i = 0; i < 16; i++) {
        this.ghostCards.push({
          x: Math.random() * this.width,
          y: Math.random() * 380,
          rot: Math.random() * Math.PI,
          rotSpeed: 0.015 + Math.random() * 0.025,
          speedY: -0.25 - Math.random() * 0.45,
          suit: (i % 2 === 0) ? '♠' : '♥'
        });
      }
    } else if (this.stageNumber === 7) {
      // 🚀 ステージ7: コズミック・キャットスペース（銀河スペースオペラ）
      this.spaceStars = [];
      for (let i = 0; i < 95; i++) {
        this.spaceStars.push({
          x: Math.random() * this.width,
          y: Math.random() * 380,
          size: 1 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.7
        });
      }
      this.spaceNebulae = [
        { x: 380, y: 120, r: 170, color: 'rgba(255, 0, 128, 0.20)' },
        { x: 980, y: 160, r: 210, color: 'rgba(0, 200, 255, 0.18)' },
        { x: 1580, y: 110, r: 180, color: 'rgba(180, 0, 255, 0.20)' },
        { x: 2240, y: 140, r: 190, color: 'rgba(255, 100, 0, 0.16)' }
      ];
      this.satellites = [
        { x: 520, y: 175, angle: 0 },
        { x: 1300, y: 135, angle: 1.5 },
        { x: 2020, y: 185, angle: 3.0 }
      ];
      this.meteors = [
        { x: 200, y: -20, vx: -4.5, vy: 3.2, len: 65 },
        { x: 800, y: -40, vx: -5.0, vy: 3.6, len: 80 },
        { x: 1600, y: -30, vx: -4.8, vy: 3.4, len: 70 }
      ];
    } else {
      // 👑 ステージ8: 真・天空キャッスル（神聖ロイヤルサンライズ）
      this.castleClouds = [];
      for (let i = 0; i < 20; i++) {
        this.castleClouds.push({
          x: (i * 180) % (this.width + 200),
          y: 275 + (i % 3) * 35,
          w: 150 + (i % 4) * 35,
          h: 55 + (i % 3) * 15,
          speed: 0.12 + (i % 3) * 0.05
        });
      }
      this.castlePillars = [
        { x: 240, y: 150 },
        { x: 620, y: 135 },
        { x: 1020, y: 150 },
        { x: 1420, y: 135 },
        { x: 1820, y: 150 },
        { x: 2220, y: 135 },
        { x: 2580, y: 145 }
      ];
      this.castleSparks = [];
      for (let i = 0; i < 45; i++) {
        this.castleSparks.push({
          x: Math.random() * this.width,
          y: Math.random() * 420,
          speedY: -0.5 - Math.random() * 0.7,
          size: 2 + Math.random() * 3,
          color: (i % 2 === 0) ? '#ffd166' : '#ffffff'
        });
      }
    }
  }


  // =========================================================================
  // 🗺️ マップ初期化＆ブロック配置（全8ステージ対応）
  // =========================================================================
  initMap() {
    this.blocks = [];
    this.decorations = [];

    // ボス壁（ボスエリア左端の封鎖ライン: 4150px）
    const bossWallX = (typeof CONSTANTS !== 'undefined' && CONSTANTS.STAGE_CONFIG) ? CONSTANTS.STAGE_CONFIG.BOSS_WALL_X : 4150;
    this.bossWall = { x: bossWallX, y: 0, width: 28, height: 460, active: false };

    if (this.stageNumber === 1) {
      this.initGardenMap();
    } else if (this.stageNumber === 2) {
      this.initMallMap();
    } else if (this.stageNumber === 3) {
      this.initClocktowerMap();
    } else if (this.stageNumber === 4) {
      this.initKitchenMap();
    } else if (this.stageNumber === 5) {
      this.initBeachMap();
    } else if (this.stageNumber === 6) {
      this.initGhostMap();
    } else if (this.stageNumber === 7) {
      this.initSpaceMap();
    } else {
      this.initCastleMap();
    }
  }

  // =========================================================================
  // 🐾 ステージ1: 大豪邸ガーデン（穴7箇所・短めブロック・アスレチック入門）
  // =========================================================================
  initGardenMap() {
    // 地面（7箇所の穴でテンポよく分断）
    this.addGround(0, 420, 460);        // 地面1 (0〜420)
    this.addGround(520, 480, 460);      // 穴1 (420〜520: 幅100) -> 地面2 (520〜1000)
    this.addGround(1110, 450, 460);     // 穴2 (1000〜1110: 幅110) -> 地面3 (1110〜1560)
    this.addGround(1680, 480, 460);     // 穴3 (1560〜1680: 幅120) -> 地面4 (1680〜2160)
    this.addGround(2270, 460, 460);     // 穴4 (2160〜2270: 幅110) -> 地面5 (2270〜2730)
    this.addGround(2840, 480, 460);     // 穴5 (2730〜2840: 幅110) -> 地面6 (2840〜3320)
    this.addGround(3440, 560, 460);     // 穴6 (3320〜3440: 幅120) -> 地面7 (3440〜4000)
    // 穴7 (4000〜4120: 幅120)
    this.addGround(4120, 1000, 460);    // ボスアリーナ地面全面 (4120〜5120)

    // 🐾 短め空中ブロック（幅50〜110pxの軽快ステップ）
    this.addBlock(445, 380, 70, 26);    // 穴1上空: 小花壇ステップ (70px)
    this.addBlock(640, 325, 90, 26);    // 地面2上空: 大理石ステップ (90px)
    this.addBlock(820, 270, 75, 26);    // 地面2上空: 高台ステップ (75px)
    this.addBlock(1025, 375, 75, 26);   // 穴2上空: 飛び石 (75px)
    this.addBlock(1220, 320, 95, 26);   // 地面3上空: 噴水ステップ (95px)
    this.addBlock(1400, 265, 70, 26);   // 地面3上空: 高台 (70px)
    this.addBlock(1585, 370, 75, 26);   // 穴3上空: 花壇足場 (75px)
    this.addBlock(1780, 320, 100, 26);  // 地面4上空: 庭園テラス (100px)
    this.addBlock(1970, 265, 80, 26);   // 地面4上空: 高所ステップ (80px)
    this.addBlock(2185, 375, 70, 26);   // 穴4上空: 飛び石 (70px)
    this.addBlock(2370, 320, 95, 26);   // 地面5上空: 庭園回廊 (95px)
    this.addBlock(2550, 265, 75, 26);   // 地面5上空: 高台 (75px)
    this.addBlock(2755, 370, 75, 26);   // 穴5上空: 飛び石 (75px)
    this.addBlock(2950, 320, 100, 26);  // 地面6上空: 庭園ステップ (100px)
    this.addBlock(3150, 265, 80, 26);   // 地面6上空: 高台 (80px)
    this.addBlock(3350, 375, 70, 26);   // 穴6上空: 飛び石 (70px)
    this.addBlock(3550, 320, 95, 26);   // 地面7上空: お城前ステップ (95px)
    this.addBlock(3750, 265, 80, 26);   // 地面7上空: 高台 (80px)
    this.addBlock(4025, 370, 75, 26);   // 穴7上空: 城門前飛び石 (75px)

    // 🏰 ボスアリーナ足場（コンパクト＆左右非対称）
    this.addBlock(4280, 385, 110, 26);  // 左テラス (110px)
    this.addBlock(4680, 385, 95, 26);   // 右見張り台 (95px)
  }

  // =========================================================================
  // 🛒 ステージ2: ネオン・ショッピングモール（穴8箇所・短めブロック）
  // =========================================================================
  initMallMap() {
    // 地面（8箇所の吹き抜け穴で立体アスレチック化）
    this.addGround(0, 360, 460);        // 地面1 (0〜360)
    this.addGround(470, 420, 460);      // 穴1 (360〜470: 幅110) -> 地面2 (470〜890)
    this.addGround(1000, 410, 460);     // 穴2 (890〜1000: 幅110) -> 地面3 (1000〜1410)
    this.addGround(1530, 420, 460);     // 穴3 (1410〜1530: 幅120) -> 地面4 (1530〜1950)
    this.addGround(2070, 410, 460);     // 穴4 (1950〜2070: 幅120) -> 地面5 (2070〜2480)
    this.addGround(2600, 420, 460);     // 穴5 (2480〜2600: 幅120) -> 地面6 (2600〜3020)
    this.addGround(3140, 400, 460);     // 穴6 (3020〜3140: 幅120) -> 地面7 (3140〜3540)
    this.addGround(3660, 350, 460);     // 穴7 (3540〜3660: 幅120) -> 地面8 (3660〜4010)
    // 穴8 (4010〜4120: 幅110)
    this.addGround(4120, 1000, 460);    // ボスアリーナ

    // 🛍️ 短め空中ブロック（幅60〜110pxのネオンステップ）
    this.addBlock(385, 380, 70, 26);    // 穴1上空 (70px)
    this.addBlock(560, 320, 95, 26);    // 地面2上空 (95px)
    this.addBlock(750, 260, 80, 26);    // 地面2上空 (80px)
    this.addBlock(915, 375, 75, 26);    // 穴2上空 (75px)
    this.addBlock(1100, 310, 100, 26);  // 地面3上空 (100px)
    this.addBlock(1290, 240, 85, 26);   // 地面3上空 (85px)
    this.addBlock(1435, 370, 75, 26);   // 穴3上空 (75px)
    this.addBlock(1630, 310, 105, 26);  // 地面4上空 (105px)
    this.addBlock(1830, 240, 80, 26);   // 地面4上空 (80px)
    this.addBlock(1980, 370, 70, 26);   // 穴4上空 (70px)
    this.addBlock(2170, 310, 100, 26);  // 地面5上空 (100px)
    this.addBlock(2360, 240, 85, 26);   // 地面5上空 (85px)
    this.addBlock(2510, 375, 75, 26);   // 穴5上空 (75px)
    this.addBlock(2700, 315, 105, 26);  // 地面6上空 (105px)
    this.addBlock(2900, 245, 80, 26);   // 地面6上空 (80px)
    this.addBlock(3050, 370, 70, 26);   // 穴6上空 (70px)
    this.addBlock(3240, 310, 100, 26);  // 地面7上空 (100px)
    this.addBlock(3430, 240, 80, 26);   // 地面7上空 (80px)
    this.addBlock(3570, 375, 75, 26);   // 穴7上空 (75px)
    this.addBlock(3760, 315, 95, 26);   // 地面8上空 (95px)
    this.addBlock(4035, 370, 70, 26);   // 穴8上空 (70px)

    // 🛍️ ボスアリーナ（ショッピングセンター中央広場: 3段非対称ステップ）
    this.addBlock(4260, 380, 105, 26);  // 左セール台 (105px)
    this.addBlock(4480, 410, 80, 26);   // 中央低ステップ (80px)
    this.addBlock(4680, 380, 105, 26);  // 右セール台 (105px)
  }

  // =========================================================================
  // 🕰️ ステージ3: 最上階ペントハウス・時計塔（穴8箇所・短めブロック）
  // =========================================================================
  initClocktowerMap() {
    // 地面（8箇所の歯車シャフト穴で高低差スリル強化）
    this.addGround(0, 350, 460);        // 地面1 (0〜350)
    this.addGround(470, 400, 460);      // 穴1 (350〜470: 幅120) -> 地面2 (470〜870)
    this.addGround(990, 410, 460);      // 穴2 (870〜990: 幅120) -> 地面3 (990〜1400)
    this.addGround(1530, 400, 460);     // 穴3 (1400〜1530: 幅130) -> 地面4 (1530〜1930)
    this.addGround(2060, 410, 460);     // 穴4 (1930〜2060: 幅130) -> 地面5 (2060〜2470)
    this.addGround(2600, 410, 460);     // 穴5 (2470〜2600: 幅130) -> 地面6 (2600〜3010)
    this.addGround(3140, 410, 460);     // 穴6 (3010〜3140: 幅130) -> 地面7 (3140〜3550)
    this.addGround(3680, 330, 460);     // 穴7 (3550〜3680: 幅130) -> 地面8 (3680〜4010)
    // 穴8 (4010〜4120: 幅110)
    this.addGround(4120, 1000, 460);    // ボスアリーナ

    // 🕰️ 短め空中ブロック（幅55〜110pxの小型歯車・大時計ステップ）
    this.addBlock(380, 380, 70, 28);    // 穴1上空 (70px)
    this.addBlock(550, 310, 95, 28);    // 地面2上空 (95px)
    this.addBlock(730, 240, 80, 28);    // 地面2上空 (80px)
    this.addBlock(900, 375, 70, 28);    // 穴2上空 (70px)
    this.addBlock(1080, 310, 100, 28);  // 地面3上空 (100px)
    this.addBlock(1270, 230, 80, 28);   // 地面3上空 (80px)
    this.addBlock(1430, 370, 75, 28);   // 穴3上空 (75px)
    this.addBlock(1610, 310, 105, 28);  // 地面4上空 (105px)
    this.addBlock(1800, 235, 75, 28);   // 地面4上空 (75px)
    this.addBlock(1960, 370, 70, 28);   // 穴4上空 (70px)
    this.addBlock(2150, 310, 100, 28);  // 地面5上空 (100px)
    this.addBlock(2340, 235, 80, 28);   // 地面5上空 (80px)
    this.addBlock(2500, 375, 75, 28);   // 穴5上空 (75px)
    this.addBlock(2690, 310, 105, 28);  // 地面6上空 (105px)
    this.addBlock(2890, 230, 80, 28);   // 地面6上空 (80px)
    this.addBlock(3040, 370, 70, 28);   // 穴6上空 (70px)
    this.addBlock(3230, 310, 100, 28);  // 地面7上空 (100px)
    this.addBlock(3420, 235, 80, 28);   // 地面7上空 (80px)
    this.addBlock(3580, 375, 75, 28);   // 穴7上空 (75px)
    this.addBlock(3770, 310, 95, 28);   // 地面8上空 (95px)
    this.addBlock(4035, 370, 70, 28);   // 穴8上空 (70px)

    // 🕰️ ボスアリーナ（大時計会議場: 3段コンパクト歯車）
    this.addBlock(4260, 375, 110, 28);  // 左大歯車 (110px)
    this.addBlock(4480, 345, 85, 26);   // 中央振り子 (85px)
    this.addBlock(4700, 375, 105, 28);  // 右大歯車 (105px)
  }

  // =========================================================================
  // 🍳 ステージ4: 激闘！グルメ寿司屋敷＆厨房（穴8箇所・短めブロック）
  // =========================================================================
  initKitchenMap() {
    // 地面（8箇所の厨房側溝・ダクト穴でスリリングなアクション）
    this.addGround(0, 360, 460);        // 地面1 (0〜360)
    this.addGround(480, 410, 460);      // 穴1 (360〜480: 幅120) -> 地面2 (480〜890)
    this.addGround(1010, 410, 460);     // 穴2 (890〜1010: 幅120) -> 地面3 (1010〜1420)
    this.addGround(1540, 410, 460);     // 穴3 (1420〜1540: 幅120) -> 地面4 (1540〜1950)
    this.addGround(2080, 410, 460);     // 穴4 (1950〜2080: 幅130) -> 地面5 (2080〜2490)
    this.addGround(2610, 420, 460);     // 穴5 (2490〜2610: 幅120) -> 地面6 (2610〜3030)
    this.addGround(3150, 410, 460);     // 穴6 (3030〜3150: 幅120) -> 地面7 (3150〜3560)
    this.addGround(3680, 330, 460);     // 穴7 (3560〜3680: 幅120) -> 地面8 (3680〜4010)
    // 穴8 (4010〜4120: 幅110)
    this.addGround(4120, 1000, 460);    // ボスアリーナ

    // 🍳 短め空中ブロック（幅60〜115pxの小カウンター・小鍋）
    this.addBlock(390, 380, 75, 28);    // 穴1上空: 小鍋足場 (75px)
    this.addBlock(570, 315, 100, 28);   // 地面2上空: カウンター (100px)
    this.addBlock(760, 245, 80, 28);    // 地面2上空: 小棚 (80px)
    this.addBlock(920, 375, 70, 28);    // 穴2上空 (70px)
    this.addBlock(1100, 310, 105, 28);  // 地面3上空: まな板 (105px)
    this.addBlock(1300, 235, 75, 28);   // 地面3上空 (75px)
    this.addBlock(1450, 370, 70, 28);   // 穴3上空 (70px)
    this.addBlock(1640, 310, 100, 28);  // 地面4上空: 調理台 (100px)
    this.addBlock(1830, 235, 80, 28);   // 地面4上空 (80px)
    this.addBlock(1980, 370, 75, 28);   // 穴4上空 (75px)
    this.addBlock(2180, 310, 105, 28);  // 地面5上空: 檜棚 (105px)
    this.addBlock(2370, 235, 75, 28);   // 地面5上空 (75px)
    this.addBlock(2520, 375, 70, 28);   // 穴5上空 (70px)
    this.addBlock(2710, 310, 100, 28);  // 地面6上空: 寸胴台 (100px)
    this.addBlock(2910, 235, 80, 28);   // 地面6上空 (80px)
    this.addBlock(3060, 370, 70, 28);   // 穴6上空 (70px)
    this.addBlock(3250, 310, 105, 28);  // 地面7上空: 大鍋前棚 (105px)
    this.addBlock(3440, 235, 75, 28);   // 地面7上空 (75px)
    this.addBlock(3590, 375, 75, 28);   // 穴7上空 (75px)
    this.addBlock(3780, 315, 95, 28);   // 地面8上空 (95px)
    this.addBlock(4035, 370, 70, 28);   // 穴8上空 (70px)

    // 🍳 ボスアリーナ（寿司屋敷大板前場: 左右コンパクトカウンター）
    this.addBlock(4260, 380, 110, 28);  // 左まな板カウンター (110px)
    this.addBlock(4680, 380, 105, 28);  // 右寸胴台 (105px)
  }

  // =========================================================================
  // =========================================================================
  // 🏖️ ステージ5: トロピカル・キャットビーチ（穴9箇所・短めブロック・海原ホップ）
  // =========================================================================
  initBeachMap() {
    // 地面（9箇所の海ピットで爽快オーシャンホップ）
    this.addGround(0, 330, 460);        // 地面1 (0〜330)
    this.addGround(450, 360, 460);      // 穴1 (330〜450: 幅120) -> 地面2 (450〜810)
    this.addGround(930, 370, 460);      // 穴2 (810〜930: 幅120) -> 地面3 (930〜1300)
    this.addGround(1420, 360, 460);     // 穴3 (1300〜1420: 幅120) -> 地面4 (1420〜1780)
    this.addGround(1900, 370, 460);     // 穴4 (1780〜1900: 幅120) -> 地面5 (1900〜2270)
    this.addGround(2400, 360, 460);     // 穴5 (2270〜2400: 幅130) -> 地面6 (2400〜2760)
    this.addGround(2890, 370, 460);     // 穴6 (2760〜2890: 幅130) -> 地面7 (2890〜3260)
    this.addGround(3380, 350, 460);     // 穴7 (3260〜3380: 幅120) -> 地面8 (3380〜3730)
    this.addGround(3850, 160, 460);     // 穴8 (3730〜3850: 幅120) -> 地面9 (3850〜4010)
    // 穴9 (4010〜4120: 幅110)
    this.addGround(4120, 1000, 460);    // ボスアリーナ

    // 🏖️ 短め空中ブロック（幅65〜105pxのフロート・サーフボード・パラソル）
    this.addBlock(360, 375, 70, 26);    // 穴1上空: サーフボード (70px)
    this.addBlock(530, 310, 95, 26);    // 地面2上空: ウッドデッキ (95px)
    this.addBlock(710, 235, 75, 26);    // 地面2上空: パラソル足場 (75px)
    this.addBlock(840, 370, 70, 26);    // 穴2上空: 小フロート (70px)
    this.addBlock(1010, 310, 100, 26);  // 地面3上空: 桟橋 (100px)
    this.addBlock(1200, 235, 75, 26);   // 地面3上空: ヤシの木足場 (75px)
    this.addBlock(1330, 375, 75, 26);   // 穴3上空: 飛び石 (75px)
    this.addBlock(1500, 310, 105, 26);  // 地面4上空: リゾートデッキ (105px)
    this.addBlock(1690, 240, 75, 26);   // 地面4上空: 小ブイ (75px)
    this.addBlock(1810, 370, 70, 26);   // 穴4上空: 海上フロート (70px)
    this.addBlock(1990, 310, 100, 26);  // 地面5上空: 浮桟橋 (100px)
    this.addBlock(2180, 235, 80, 26);   // 地面5上空: パラソルステップ (80px)
    this.addBlock(2300, 375, 75, 26);   // 穴5上空: サーフボード (75px)
    this.addBlock(2480, 310, 105, 26);  // 地面6上空: ウッドデッキ (105px)
    this.addBlock(2670, 235, 75, 26);   // 地面6上空: 小足場 (75px)
    this.addBlock(2790, 370, 75, 26);   // 穴6上空: 飛び石 (75px)
    this.addBlock(2970, 310, 100, 26);  // 地面7上空: ボードウォーク (100px)
    this.addBlock(3160, 240, 80, 26);   // 地面7上空: パラソル (80px)
    this.addBlock(3290, 375, 75, 26);   // 穴7上空: フロート (75px)
    this.addBlock(3470, 315, 105, 26);  // 地面8上空: テラス (105px)
    this.addBlock(3660, 245, 70, 26);   // 地面8上空: 小足場 (70px)
    this.addBlock(3760, 370, 70, 26);   // 穴8上空: サーフボード (70px)
    this.addBlock(4035, 370, 70, 26);   // 穴9上空: 飛び石 (70px)

    // 🏖️ ボスアリーナ（左右コンパクトサーフボード＆中央パラソル）
    this.addBlock(4260, 380, 105, 26);  // 左サーフボード (105px)
    this.addBlock(4490, 345, 80, 26);   // 中央パラソル (80px)
    this.addBlock(4690, 380, 105, 26);  // 右ボード (105px)
  }

  // =========================================================================
  // 👻 ステージ6: 妖怪・ゴーストキャットマンション（穴9箇所・短めブロック）
  // =========================================================================
  initGhostMap() {
    // 地面（9箇所の奈落ピットでゴシック迷宮アスレチック）
    this.addGround(0, 320, 460);        // 地面1 (0〜320)
    this.addGround(440, 360, 460);      // 穴1 (320〜440: 幅120) -> 地面2 (440〜800)
    this.addGround(920, 360, 460);      // 穴2 (800〜920: 幅120) -> 地面3 (920〜1280)
    this.addGround(1410, 360, 460);     // 穴3 (1280〜1410: 幅130) -> 地面4 (1410〜1770)
    this.addGround(1900, 360, 460);     // 穴4 (1770〜1900: 幅130) -> 地面5 (1900〜2260)
    this.addGround(2390, 370, 460);     // 穴5 (2260〜2390: 幅130) -> 地面6 (2390〜2760)
    this.addGround(2890, 360, 460);     // 穴6 (2760〜2890: 幅130) -> 地面7 (2890〜3250)
    this.addGround(3380, 360, 460);     // 穴7 (3250〜3380: 幅130) -> 地面8 (3380〜3740)
    this.addGround(3860, 150, 460);     // 穴8 (3740〜3860: 幅120) -> 地面9 (3860〜4010)
    // 穴9 (4010〜4120: 幅110)
    this.addGround(4120, 1000, 460);    // ボスアリーナ

    // 👻 短め空中ブロック（幅55〜105pxの浮遊トランプ・アンティーク家具）
    this.addBlock(350, 375, 70, 28);    // 穴1上空: 浮遊トランプ (70px)
    this.addBlock(520, 310, 100, 28);   // 地面2上空: アンティーク本棚 (100px)
    this.addBlock(700, 235, 75, 28);    // 地面2上空: 小鬼火台 (75px)
    this.addBlock(830, 370, 70, 28);    // 穴2上空: トランプステップ (70px)
    this.addBlock(1000, 310, 105, 28);  // 地面3上空: 晩餐会テーブル (105px)
    this.addBlock(1190, 235, 75, 28);   // 地面3上空: 小シャンデリア (75px)
    this.addBlock(1310, 375, 75, 28);   // 穴3上空: 浮遊額縁 (75px)
    this.addBlock(1490, 310, 100, 28);  // 地面4上空: 棺桶台座 (100px)
    this.addBlock(1680, 235, 75, 28);   // 地面4上空: 鬼火ステップ (75px)
    this.addBlock(1800, 370, 70, 28);   // 穴4上空: トランプ (70px)
    this.addBlock(1980, 310, 105, 28);  // 地面5上空: ステンドグラス棚 (105px)
    this.addBlock(2170, 235, 75, 28);   // 地面5上空: シャンデリア (75px)
    this.addBlock(2290, 375, 75, 28);   // 穴5上空: 浮遊トランプ (75px)
    this.addBlock(2470, 310, 100, 28);  // 地面6上空: ゴシック台座 (100px)
    this.addBlock(2660, 235, 80, 28);   // 地面6上空: 鬼火台 (80px)
    this.addBlock(2790, 370, 70, 28);   // 穴6上空: トランプ (70px)
    this.addBlock(2970, 310, 105, 28);  // 地面7上空: ゴシックテラス (105px)
    this.addBlock(3160, 235, 75, 28);   // 地面7上空: 小シャンデリア (75px)
    this.addBlock(3280, 375, 75, 28);   // 穴7上空: 額縁 (75px)
    this.addBlock(3460, 315, 100, 28);  // 地面8上空: 回廊棚 (100px)
    this.addBlock(3650, 240, 75, 28);   // 地面8上空: 鬼火ステップ (75px)
    this.addBlock(3770, 370, 70, 28);   // 穴8上空: トランプ (70px)
    this.addBlock(4035, 370, 70, 28);   // 穴9上空: ボス手前トランプ (70px)

    // 👻 ボスアリーナ（コンパクトゴシック台座＆中央シャンデリア）
    this.addBlock(4260, 375, 105, 28);  // 左ゴシック台座 (105px)
    this.addBlock(4490, 345, 80, 26);   // 中央シャンデリア (80px)
    this.addBlock(4690, 375, 105, 28);  // 右ゴシック台座 (105px)
  }

  // =========================================================================
  // 🚀 ステージ7: コズミック・キャットスペース（穴9箇所・短めブロック）
  // =========================================================================
  initSpaceMap() {
    // 地面（9箇所の宇宙ピットでコズミック跳躍アクション）
    this.addGround(0, 310, 460);        // 地面1 (0〜310)
    this.addGround(430, 360, 460);      // 穴1 (310〜430: 幅120) -> 地面2 (430〜790)
    this.addGround(920, 350, 460);      // 穴2 (790〜920: 幅130) -> 地面3 (920〜1270)
    this.addGround(1400, 360, 460);     // 穴3 (1270〜1400: 幅130) -> 地面4 (1400〜1760)
    this.addGround(1890, 360, 460);     // 穴4 (1760〜1890: 幅130) -> 地面5 (1890〜2250)
    this.addGround(2380, 360, 460);     // 穴5 (2250〜2380: 幅130) -> 地面6 (2380〜2740)
    this.addGround(2870, 360, 460);     // 穴6 (2740〜2870: 幅130) -> 地面7 (2870〜3230)
    this.addGround(3360, 360, 460);     // 穴7 (3230〜3360: 幅130) -> 地面8 (3360〜3720)
    this.addGround(3850, 160, 460);     // 穴8 (3720〜3850: 幅130) -> 地面9 (3850〜4010)
    // 穴9 (4010〜4120: 幅110)
    this.addGround(4120, 1000, 460);    // ボスアリーナ

    // 🚀 短め空中ブロック（幅55〜105pxの浮遊小惑星・ソーラーパネル・人工衛星）
    this.addBlock(340, 370, 70, 26);    // 穴1上空: クリスタル小惑星 (70px)
    this.addBlock(510, 310, 100, 26);   // 地面2上空: ソーラーパネル (100px)
    this.addBlock(690, 235, 75, 26);    // 地面2上空: 観測デッキ (75px)
    this.addBlock(820, 365, 75, 26);    // 穴2上空: 浮遊プローブ (75px)
    this.addBlock(990, 305, 105, 26);   // 地面3上空: ステーション通路 (105px)
    this.addBlock(1180, 230, 75, 26);   // 地面3上空: 高軌道パネル (75px)
    this.addBlock(1300, 370, 75, 26);   // 穴3上空: 人工衛星 (75px)
    this.addBlock(1480, 310, 100, 26);  // 地面4上空: リングハブ (100px)
    this.addBlock(1670, 235, 75, 26);   // 地面4上空: 小惑星 (75px)
    this.addBlock(1790, 365, 75, 26);   // 穴4上空: 浮遊プローブ (75px)
    this.addBlock(1970, 310, 105, 26);  // 地面5上空: 宇宙回廊 (105px)
    this.addBlock(2160, 230, 75, 26);   // 地面5上空: 展望足場 (75px)
    this.addBlock(2280, 370, 70, 26);   // 穴5上空: クリスタル (70px)
    this.addBlock(2460, 310, 100, 26);  // 地面6上空: ソーラーデッキ (100px)
    this.addBlock(2650, 235, 80, 26);   // 地面6上空: 観測台 (80px)
    this.addBlock(2770, 365, 75, 26);   // 穴6上空: 衛星 (75px)
    this.addBlock(2950, 310, 105, 26);  // 地面7上空: 皇帝前ハブ (105px)
    this.addBlock(3140, 230, 75, 26);   // 地面7上空: 高軌道足場 (75px)
    this.addBlock(3260, 370, 75, 26);   // 穴7上空: プローブ (75px)
    this.addBlock(3440, 315, 100, 26);  // 地面8上空: 皇帝ブリッジ (100px)
    this.addBlock(3630, 240, 75, 26);   // 地面8上空: 小惑星 (75px)
    this.addBlock(3750, 365, 70, 26);   // 穴8上空: クリスタル (70px)
    this.addBlock(4035, 370, 70, 26);   // 穴9上空: ボス手前小惑星 (70px)

    // 🚀 ボスアリーナ（左右コンパクトソーラーデッキ＆中央リング）
    this.addBlock(4260, 370, 105, 26);  // 左ソーラーデッキ (105px)
    this.addBlock(4490, 340, 80, 26);   // 中央浮遊リング (80px)
    this.addBlock(4690, 370, 105, 26);  // 右ソーラーデッキ (105px)
  }

  // =========================================================================
  // 🏰 ステージ8: 真・天空キャッスル（穴10箇所・短めブロック・天空古代列柱）
  // =========================================================================
  initCastleMap() {
    // 地面（最難関10箇所の雲海ピットで神聖天空アスレチック）
    this.addGround(0, 290, 460);        // 地面1 (0〜290)
    this.addGround(410, 330, 460);      // 穴1 (290〜410: 幅120) -> 地面2 (410〜740)
    this.addGround(870, 330, 460);      // 穴2 (740〜870: 幅130) -> 地面3 (870〜1200)
    this.addGround(1330, 330, 460);     // 穴3 (1200〜1330: 幅130) -> 地面4 (1330〜1660)
    this.addGround(1790, 330, 460);     // 穴4 (1660〜1790: 幅130) -> 地面5 (1790〜2120)
    this.addGround(2250, 330, 460);     // 穴5 (2120〜2250: 幅130) -> 地面6 (2250〜2580)
    this.addGround(2710, 330, 460);     // 穴6 (2580〜2710: 幅130) -> 地面7 (2710〜3040)
    this.addGround(3170, 330, 460);     // 穴7 (3040〜3170: 幅130) -> 地面8 (3170〜3500)
    this.addGround(3630, 220, 460);     // 穴8 (3500〜3630: 幅130) -> 地面9 (3630〜3850)
    this.addGround(3970, 70, 460);      // 穴9 (3850〜3970: 幅120) -> 地面10 (3970〜4040)
    // 穴10 (4040〜4120: 幅80)
    this.addGround(4120, 1000, 460);    // ボスアリーナ全面地面

    // 🏰 短め空中ブロック（幅50〜105pxの天空古代列柱・神聖回廊）
    this.addBlock(320, 375, 65, 28);    // 穴1上空: 天空小列柱 (65px)
    this.addBlock(490, 310, 95, 28);    // 地面2上空: 神殿大理石テラス (95px)
    this.addBlock(660, 235, 70, 28);    // 地面2上空: ショート (70px)
    this.addBlock(770, 370, 70, 28);    // 穴2上空: 雲海空中足場 (70px)
    this.addBlock(940, 305, 100, 28);   // 地面3上空: 空中神殿 (100px)
    this.addBlock(1120, 230, 70, 28);   // 地面3上空: 神聖ステップ (70px)
    this.addBlock(1230, 375, 70, 28);   // 穴3上空: 列柱 (70px)
    this.addBlock(1400, 310, 100, 28);  // 地面4上空: タペストリー梁 (100px)
    this.addBlock(1580, 235, 70, 28);   // 地面4上空: 小足場 (70px)
    this.addBlock(1690, 370, 70, 28);   // 穴4上空: 雲海足場 (70px)
    this.addBlock(1860, 310, 105, 28);  // 地面5上空: 最上層テラス (105px)
    this.addBlock(2040, 230, 75, 28);   // 地面5上空: ショート (75px)
    this.addBlock(2150, 375, 70, 28);   // 穴5上空: 列柱 (70px)
    this.addBlock(2320, 310, 100, 28);  // 地面6上空: 神聖回廊 (100px)
    this.addBlock(2500, 235, 70, 28);   // 地面6上空: ステップ (70px)
    this.addBlock(2610, 370, 70, 28);   // 穴6上空: 雲海足場 (70px)
    this.addBlock(2780, 310, 105, 28);  // 地面7上空: 頂点大聖堂 (105px)
    this.addBlock(2960, 230, 75, 28);   // 地面7上空: ショート (75px)
    this.addBlock(3070, 375, 70, 28);   // 穴7上空: 列柱 (70px)
    this.addBlock(3240, 310, 100, 28);  // 地面8上空: 決戦前大回廊 (100px)
    this.addBlock(3420, 235, 70, 28);   // 地面8上空: ショート (70px)
    this.addBlock(3530, 370, 70, 28);   // 穴8上空: 雲海足場 (70px)
    this.addBlock(3700, 315, 95, 28);   // 地面9上空: 神殿前ステップ (95px)
    this.addBlock(3880, 370, 65, 28);   // 穴9上空: 列柱 (65px)
    this.addBlock(4050, 370, 65, 28);   // 穴10上空: ボス手前小列柱 (65px)

    // 👑 ボスアリーナ（神殿玉座: コンパクト3段足場）
    this.addBlock(4260, 380, 100, 28);  // 左天空ステップ (100px)
    this.addBlock(4480, 345, 90, 28);   // 中央玉座高台 (90px)
    this.addBlock(4680, 380, 100, 28);  // 右天空ステップ (100px)
  }

  addGround(x, width, y) {
    this.blocks.push({
      x, y, width, height: CONSTANTS.CANVAS_HEIGHT - y,
      isGround: true
    });
  }

  addBlock(x, y, width, height) {
    this.blocks.push({
      x, y, width, height,
      isGround: false
    });
  }

  update() {
    this.timer++;

    if (this.stageNumber === 1) {
      for (const c of this.clouds) {
        c.x -= c.speed;
        if (c.x < -120) c.x = this.width + 50;
      }
      for (const p of this.gardenPetals) {
        p.x -= p.speedX;
        p.y += p.speedY;
        p.rot += 0.03;
        if (p.x < -20) {
          p.x = this.width + 20;
          p.y = Math.random() * 420;
        }
      }
    } else if (this.stageNumber === 2) {
      for (const c of this.mallConfetti) {
        c.y += c.speedY;
        if (c.y > CONSTANTS.CANVAS_HEIGHT + 10) {
          c.y = -10;
          c.x = Math.random() * this.width;
        }
      }
    } else if (this.stageNumber === 3) {
      for (const cog of this.cogs) {
        cog.angle = (cog.angle || 0) + cog.speed;
      }
      for (const s of this.gearSparks) {
        s.y -= s.speedY;
        if (s.y < -10) {
          s.y = 380;
          s.x = Math.random() * this.width;
        }
      }
    } else if (this.stageNumber === 4) {
      for (const s of this.kitchenSteam) {
        s.y -= s.speedY;
        if (s.y < -30) {
          s.y = 360;
          s.x = Math.random() * this.width;
        }
      }
    } else if (this.stageNumber === 5) {
      for (const c of this.beachClouds) {
        c.x -= c.speed;
        if (c.x < -80) c.x = this.width + 50;
      }
      for (const b of this.sailboats) {
        b.x += b.speed;
        if (b.x > this.width + 80) b.x = -80;
      }
    } else if (this.stageNumber === 6) {
      for (const w of this.ghostWisps) {
        w.y += w.speedY;
        if (w.y < -20) {
          w.y = CONSTANTS.CANVAS_HEIGHT + 20;
          w.x = Math.random() * this.width;
        }
      }
      for (const card of this.ghostCards) {
        card.y += card.speedY;
        card.rot += card.rotSpeed;
        if (card.y < -30) {
          card.y = 400;
          card.x = Math.random() * this.width;
        }
      }
    } else if (this.stageNumber === 7) {
      for (const m of this.meteors) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y > CONSTANTS.CANVAS_HEIGHT + 50 || m.x < -100) {
          m.x = Math.random() * this.width + 200;
          m.y = -50 - Math.random() * 100;
        }
      }
    } else if (this.stageNumber === 8) {
      for (const s of this.castleSparks) {
        s.y += s.speedY;
        if (s.y < -10) {
          s.y = CONSTANTS.CANVAS_HEIGHT + 10;
          s.x = Math.random() * this.width;
        }
      }
      for (const c of this.castleClouds) {
        c.x -= c.speed;
        if (c.x < -200) c.x = this.width + 100;
      }
    }
  }


  resolveHorizontalCollision(entity) {
    const allBlocks = [...this.blocks];
    if (this.bossWall && this.bossWall.active) allBlocks.push(this.bossWall);

    for (const b of allBlocks) {
      if (b === this.bossWall) {
        if (entity.x < b.x + b.width &&
            entity.x + entity.width > b.x &&
            entity.y < b.y + b.height &&
            entity.y + entity.height > b.y) {
          if (entity.vx < 0) {
            entity.x = b.x + b.width;
            entity.vx = 0;
          }
        }
        continue;
      }

      if (entity.x < b.x + b.width &&
          entity.x + entity.width > b.x &&
          entity.y < b.y + b.height &&
          entity.y + entity.height > b.y) {
        if (entity.vx > 0) {
          entity.x = b.x - entity.width;
          entity.vx = 0;
        } else if (entity.vx < 0) {
          entity.x = b.x + b.width;
          entity.vx = 0;
        }
      }
    }

    if (entity.x < 0) {
      entity.x = 0;
      entity.vx = 0;
    }
  }

  resolveVerticalCollision(entity) {
    const allBlocks = this.blocks;

    for (const b of allBlocks) {
      if (entity.x < b.x + b.width &&
          entity.x + entity.width > b.x &&
          entity.y < b.y + b.height &&
          entity.y + entity.height > b.y) {
        if (entity.vy > 0) {
          entity.y = b.y - entity.height;
          entity.vy = 0;
          entity.isGrounded = true;
        } else if (entity.vy < 0) {
          entity.y = b.y + b.height;
          entity.vy = 0;
        }
      }
    }
  }

  hasGroundAt(x, y) {
    for (const b of this.blocks) {
      if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) {
        return true;
      }
    }
    return false;
  }

  // 🌟 2.5Dリアルタイム接地影用：指定座標の直下にある地面・ブロックの上面Yを取得
  getGroundYBelow(x, y, maxDistance = 600) {
    let bestY = null;
    let minDiff = Infinity;
    for (const b of this.blocks) {
      if (x >= b.x - 12 && x <= b.x + b.width + 12) {
        if (b.y >= y - 10) {
          const diff = b.y - y;
          if (diff >= -10 && diff < minDiff && diff <= maxDistance) {
            minDiff = diff;
            bestY = b.y;
          }
        }
      }
    }
    return bestY;
  }

  // =========================================================================
  // 🎨 背景描画（全8ステージ完全リニューアル：任天堂カービィ調多重パララックス）
  // =========================================================================
  drawBackground(ctx, cameraX) {
    if (this.stageNumber === 1) {
      this.drawPalaceBackground(ctx, cameraX);
    } else if (this.stageNumber === 2) {
      this.drawMallBackground(ctx, cameraX);
    } else if (this.stageNumber === 3) {
      this.drawClocktowerBackground(ctx, cameraX);
    } else if (this.stageNumber === 4) {
      this.drawKitchenBackground(ctx, cameraX);
    } else if (this.stageNumber === 5) {
      this.drawBeachBackground(ctx, cameraX);
    } else if (this.stageNumber === 6) {
      this.drawGhostBackground(ctx, cameraX);
    } else if (this.stageNumber === 7) {
      this.drawSpaceBackground(ctx, cameraX);
    } else {
      this.drawCastleBackground(ctx, cameraX);
    }
  }

  // -------------------------------------------------------------------------
  // 🏞️ ステージ1: 桜キャットパレス（絵本・カービィ調パステルガーデン）
  // -------------------------------------------------------------------------
  drawPalaceBackground(ctx, cameraX) {
    if (this.palaceBgLoaded && this.palaceBgImg) {
      // 🌟 軍曹ご提供の超ワイド・桜キャットパレス（1024x320）の描画
      const bgW = this.palaceBgImg.naturalWidth || 1024;
      const bgH = this.palaceBgImg.naturalHeight || 320;
      
      const targetH = CONSTANTS.CANVAS_HEIGHT;
      const targetW = targetH * (bgW / bgH); // 1024x320なら約1536px (超ワイドパノラマ)

      // 🌟 超ワイドパノラマ画像（横幅 >= 1400px）の場合:
      // リピート・反転一切なし！映画のように全域シームレススクロール ＆ ボス戦はお城中央へ美しく吸着！
      if (targetW >= 1400) {
        // ボス戦アリーナ突入度判定 (0.0: 通常道中 〜 1.0: ボス戦アリーナ完全進入)
        let bossBlend = 0;
        if (window.game && (window.game.state === 'BOSS_INTRO' || window.game.state === 'BOSS_BATTLE' || (window.game.state === 'STAGE_CLEAR' && window.game.boss && window.game.boss.isDead))) {
          bossBlend = 1.0;
        } else if (cameraX > 3700) {
          bossBlend = Math.min(1.0, (cameraX - 3700) / 450);
        }

        const maxCameraScroll = 4150; // ボスアリーナ開始地点
        const maxBgScroll = targetW - CONSTANTS.CANVAS_WIDTH;
        const normalBgX = -Math.min(1.0, Math.max(0, cameraX / maxCameraScroll)) * maxBgScroll;
        // 👑 ひろあき軍曹ご指示: ボス面は画角を一番右（桜宮殿テラス＆空中浮島パノラマ構図）に固定
        const bossFarRightBgX = -maxBgScroll;

        const bgX = normalBgX * (1 - bossBlend) + bossFarRightBgX * bossBlend;

        ctx.drawImage(
          this.palaceBgImg,
          0, 0, bgW, bgH,
          bgX, 0, targetW, targetH
        );
      } else {
        // 通常サイズ画像の場合: 左右反転（ミラー）なしの自然な正方向リピート描画
        const normalScrollX = cameraX * 0.18;
        const startIndex = Math.floor(normalScrollX / targetW);
        const endIndex = Math.ceil((normalScrollX + CONSTANTS.CANVAS_WIDTH) / targetW);

        for (let i = startIndex; i <= endIndex; i++) {
          const renderX = i * targetW - normalScrollX;
          ctx.drawImage(
            this.palaceBgImg,
            0, 0, bgW, bgH,
            renderX, 0, targetW, targetH
          );
        }
      }

      // ☀️ 昼間の明るく爽やかなサニー環境光（空気遠近法で背景の暗がりを一掃し、キャラや足場をクッキリ際立たせる）
      const sunGlow = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
      sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.20)');
      sunGlow.addColorStop(0.45, 'rgba(255, 250, 240, 0.12)');
      sunGlow.addColorStop(1.0, 'rgba(255, 255, 255, 0.05)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

      // 🌸 画面全体にふんわり舞い散るリアルタイム桜花びらパーティクル
      for (const petal of this.gardenPetals) {
        const renderX = petal.x - cameraX * 0.28;
        if (renderX > -20 && renderX < CONSTANTS.CANVAS_WIDTH + 20) {
          ctx.save();
          ctx.translate(renderX, petal.y);
          ctx.rotate(petal.rot + this.timer * 0.02);
          ctx.fillStyle = petal.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, 5.5, 3.2, 0, 0, Math.PI * 2);
          ctx.fill();
          // 花びらの光沢
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(-1, -1, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      return;
    }

    // ── ベクターフォールバック ──

    // 1. パステルブルー〜サニーサンシャインの美しい空
    const grad = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
    grad.addColorStop(0, '#74b9ff');
    grad.addColorStop(0.35, '#a1c4fd');
    grad.addColorStop(0.70, '#c2e9fb');
    grad.addColorStop(1.0, '#ffffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // 2. 太陽（ゆっくり光の輪が回転）
    const sunX = CONSTANTS.CANVAS_WIDTH * 0.85 - (cameraX * 0.02);
    ctx.save();
    ctx.translate(sunX, 75);
    ctx.shadowColor = '#ffeaa7';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fill();

    // 太陽の光線
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.4)';
    ctx.lineWidth = 3;
    const rayRot = this.timer * 0.008;
    for (let i = 0; i < 8; i++) {
      const angle = rayRot + (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 44, Math.sin(angle) * 44);
      ctx.lineTo(Math.cos(angle) * 56, Math.sin(angle) * 56);
      ctx.stroke();
    }
    ctx.restore();

    // 3. 遠景: ぽかぽか緑のなだらかな丘（パララックス 0.05x & 0.09x）
    this.drawHills(ctx, cameraX * 0.05, 310, 45, 420, '#95d5b2');
    this.drawHills(ctx, cameraX * 0.09 + 180, 335, 40, 320, '#74c69d');

    // 4. 中景: おとぎ話の白亜のキャットパレス（パララックス 0.16x）
    for (const p of this.gardenPalaces) {
      const renderX = p.x - cameraX * 0.16;
      if (renderX > -250 && renderX < CONSTANTS.CANVAS_WIDTH + 250) {
        this.drawFairytalePalace(ctx, renderX, p.y, p.scale);
      }
    }

    // 5. 中景手前: 大理石の噴水（パララックス 0.22x）
    for (const f of this.fountains) {
      const renderX = f.x - cameraX * 0.22;
      if (renderX > -150 && renderX < CONSTANTS.CANVAS_WIDTH + 150) {
        this.drawMarbleFountain(ctx, renderX, f.y);
      }
    }

    // 6. ふわふわニコニコ雲（パララックス 0.12x）
    for (const c of this.clouds) {
      const renderX = c.x - cameraX * 0.12;
      if (renderX > -100 && renderX < CONSTANTS.CANVAS_WIDTH + 100) {
        this.drawSmilingCloud(ctx, renderX, c.y, c.scale);
      }
    }

    // 7. 風に舞う花びら
    for (const petal of this.gardenPetals) {
      const renderX = petal.x - cameraX * 0.25;
      if (renderX > -20 && renderX < CONSTANTS.CANVAS_WIDTH + 20) {
        ctx.save();
        ctx.translate(renderX, petal.y);
        ctx.rotate(petal.rot);
        ctx.fillStyle = petal.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // なだらかな丘を描くヘルパー
  drawHills(ctx, offsetX, baseY, amp, wavelength, fillColor) {
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(0, CONSTANTS.CANVAS_HEIGHT);
    ctx.lineTo(0, baseY + Math.sin(offsetX / wavelength) * amp);

    for (let x = 0; x <= CONSTANTS.CANVAS_WIDTH; x += 30) {
      const y = baseY + Math.sin((x + offsetX) / (wavelength * 0.16)) * amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // 丘の頂上にちょこんと立つ丸い木
    ctx.fillStyle = '#52b788';
    const treeSpacing = wavelength * 0.7;
    const firstTree = Math.floor(offsetX / treeSpacing) * treeSpacing - offsetX;
    for (let tx = firstTree; tx < CONSTANTS.CANVAS_WIDTH + 50; tx += treeSpacing) {
      const ty = baseY + Math.sin((tx + offsetX) / (wavelength * 0.16)) * amp;
      // 幹
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(tx - 2, ty - 12, 4, 12);
      // 丸い葉
      ctx.fillStyle = '#40916c';
      ctx.beginPath();
      ctx.arc(tx, ty - 18, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#52b788';
      ctx.beginPath();
      ctx.arc(tx - 3, ty - 21, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // おとぎ話の白亜のキャットパレスを描くヘルパー
  drawFairytalePalace(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // 宮殿本体（白大理石）
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(-70, 0, 140, 120);

    // 壁の装飾ライン＆猫耳アーチ窓
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-70, 0, 140, 6);
    ctx.fillStyle = '#a1c4fd';
    ctx.beginPath();
    ctx.arc(0, 45, 18, 0, Math.PI, true);
    ctx.lineTo(18, 65);
    ctx.lineTo(-18, 65);
    ctx.closePath();
    ctx.fill();

    // 猫耳屋根窓
    ctx.fillStyle = '#ff758f';
    ctx.beginPath();
    ctx.moveTo(-18, 45);
    ctx.lineTo(-12, 28);
    ctx.lineTo(-6, 45);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(6, 45);
    ctx.lineTo(12, 28);
    ctx.lineTo(18, 45);
    ctx.closePath();
    ctx.fill();

    // 左右の丸塔
    const towerOffsets = [-60, 60];
    for (const tx of towerOffsets) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(tx - 18, -25, 36, 145);
      // とんがり屋根（ピンク）
      ctx.fillStyle = '#ff758f';
      ctx.beginPath();
      ctx.moveTo(tx - 22, -25);
      ctx.lineTo(tx, -75);
      ctx.lineTo(tx + 22, -25);
      ctx.closePath();
      ctx.fill();
      // 屋根の上の黄金の星
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(tx, -78, 4, 0, Math.PI * 2);
      ctx.fill();
      // はためく旗
      ctx.fillStyle = '#ff85a1';
      ctx.beginPath();
      ctx.moveTo(tx, -75);
      ctx.lineTo(tx + 14 + Math.sin(this.timer * 0.06 + tx) * 3, -71);
      ctx.lineTo(tx, -67);
      ctx.closePath();
      ctx.fill();
    }

    // 中央の大きな主塔
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(-26, -55, 52, 65);
    ctx.fillStyle = '#ff4d6d';
    ctx.beginPath();
    ctx.moveTo(-32, -55);
    ctx.lineTo(0, -115);
    ctx.lineTo(32, -55);
    ctx.closePath();
    ctx.fill();
    // 黄金の大きな猫王冠フィニアル
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(0, -119, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 大理石の噴水を描くヘルパー
  drawMarbleFountain(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // 水盤（下段）
    ctx.fillStyle = '#e9ecef';
    ctx.beginPath();
    ctx.ellipse(0, 15, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ced4da';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 溜まった水
    ctx.fillStyle = 'rgba(72, 202, 228, 0.7)';
    ctx.beginPath();
    ctx.ellipse(0, 13, 40, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // 柱
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(-8, -12, 16, 25);

    // 水盤（上段）
    ctx.fillStyle = '#e9ecef';
    ctx.beginPath();
    ctx.ellipse(0, -12, 24, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 噴き出す水（アニメーション）
    ctx.fillStyle = 'rgba(144, 224, 239, 0.85)';
    const sprayH = 18 + Math.sin(this.timer * 0.08) * 3;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.quadraticCurveTo(-14, -14 - sprayH, -20, 10);
    ctx.quadraticCurveTo(-8, -8, 0, -14);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.quadraticCurveTo(14, -14 - sprayH, 20, 10);
    ctx.quadraticCurveTo(8, -8, 0, -14);
    ctx.fill();

    // 水しぶき粒子
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-18 + Math.cos(this.timer * 0.1) * 3, 8, 2, 0, Math.PI * 2);
    ctx.arc(18 + Math.sin(this.timer * 0.1) * 3, 8, 2, 0, Math.PI * 2);
    ctx.arc(0, -14 - sprayH, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawSmilingCloud(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';

    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.arc(-20, 6, 15, 0, Math.PI * 2);
    ctx.arc(20, 6, 15, 0, Math.PI * 2);
    ctx.arc(-7, 8, 15, 0, Math.PI * 2);
    ctx.arc(7, 8, 15, 0, Math.PI * 2);
    ctx.fill();

    // お顔（にっこり目とピンクのほっぺ）
    ctx.fillStyle = '#4a4e69';
    ctx.beginPath();
    ctx.arc(-7, 4, 1.8, 0, Math.PI * 2);
    ctx.arc(7, 4, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffb3c6';
    ctx.beginPath();
    ctx.arc(-13, 7, 3.5, 0, Math.PI * 2);
    ctx.arc(13, 7, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // 🛍️ ステージ2: ネオン・ショッピングモール（80sパステルディスコモール）
  // -------------------------------------------------------------------------
  drawMallBackground(ctx, cameraX) {
    if (this.mallBgLoaded && this.mallBgImg) {
      // 🌟 軍曹ご提供の超ワイド・サイバーネオンモール（1024x317）の描画
      const bgW = this.mallBgImg.naturalWidth || 1024;
      const bgH = this.mallBgImg.naturalHeight || 317;
      
      const targetH = CONSTANTS.CANVAS_HEIGHT;
      const targetW = targetH * (bgW / bgH); // 1024x317なら約1744.4px (超ワイドパノラマ)

      // 🌟 超ワイドパノラマ画像（横幅 >= 1500px）の場合:
      // リピート・反転一切なし！映画のように全域シームレススクロール ＆ ボス戦は中央エスカレーターに美しく吸着！
      if (targetW >= 1500) {
        // ボス戦アリーナ突入度判定 (0.0: 通常道中 〜 1.0: ボス戦アリーナ完全進入)
        let bossBlend = 0;
        if (window.game && (window.game.state === 'BOSS_INTRO' || window.game.state === 'BOSS_BATTLE' || (window.game.state === 'STAGE_CLEAR' && window.game.boss && window.game.boss.isDead))) {
          bossBlend = 1.0;
        } else if (cameraX > 3700) {
          bossBlend = Math.min(1.0, (cameraX - 3700) / 450);
        }

        const maxCameraScroll = 4150; // ボスアリーナ開始地点
        const maxBgScroll = targetW - CONSTANTS.CANVAS_WIDTH;
        const normalBgX = -Math.min(1.0, Math.max(0, cameraX / maxCameraScroll)) * maxBgScroll;
        const bossCenterBgX = (CONSTANTS.CANVAS_WIDTH - targetW) / 2;

        const bgX = normalBgX * (1 - bossBlend) + bossCenterBgX * bossBlend;

        ctx.drawImage(
          this.mallBgImg,
          0, 0, bgW, bgH,
          bgX, 0, targetW, targetH
        );
      } else {
        // 通常サイズ画像の場合: 左右反転（ミラー）なしの自然な正方向リピート描画
        const normalScrollX = cameraX * 0.18;
        const startIndex = Math.floor(normalScrollX / targetW);
        const endIndex = Math.ceil((normalScrollX + CONSTANTS.CANVAS_WIDTH) / targetW);

        for (let i = startIndex; i <= endIndex; i++) {
          const renderX = i * targetW - normalScrollX;
          ctx.drawImage(
            this.mallBgImg,
            0, 0, bgW, bgH,
            renderX, 0, targetW, targetH
          );
        }
      }

      // 💡 明るいモール天窓の光＆ディスコネオン環境光（暗がりを完全解消し、足場やキャラをクッキリ際立たせる）
      const mallGlow = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
      mallGlow.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      mallGlow.addColorStop(0.4, 'rgba(255, 240, 255, 0.14)');
      mallGlow.addColorStop(1.0, 'rgba(240, 250, 255, 0.08)');
      ctx.fillStyle = mallGlow;
      ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

      // 🎉 画面全体に舞い散るリアルタイム・ショッピングコンフェッティ（紙吹雪）
      for (const conf of this.mallConfetti) {
        const renderX = conf.x - cameraX * 0.28;
        if (renderX > -20 && renderX < CONSTANTS.CANVAS_WIDTH + 20) {
          ctx.save();
          ctx.translate(renderX, conf.y);
          ctx.rotate(conf.rot + this.timer * 0.03);
          ctx.fillStyle = conf.color;
          ctx.fillRect(-conf.size / 2, -conf.size / 4, conf.size, conf.size / 2);
          ctx.restore();
        }
      }
      return;
    }

    // ── ベクターフォールバック ──
    // 1. サイバーパープル〜マゼンタのグラデーション
    const grad = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
    grad.addColorStop(0, '#15002b');
    grad.addColorStop(0.4, '#2d004d');
    grad.addColorStop(0.75, '#4a0072');
    grad.addColorStop(1.0, '#6a0080');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // 2. モールの巨大アーケード天井・ガラスフレーム（パララックス 0.08x）
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.28)';
    ctx.lineWidth = 2;
    const roofOffset = (cameraX * 0.08) % 180;
    for (let x = -roofOffset; x < CONSTANTS.CANVAS_WIDTH + 180; x += 180) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 90, 150);
      ctx.lineTo(x + 180, 0);
      ctx.stroke();
    }
    ctx.restore();

    // 3. 上階のバルコニー＆ブティックシルエット（パララックス 0.14x）
    ctx.save();
    const balconyOffset = (cameraX * 0.14) % 240;
    ctx.fillStyle = 'rgba(35, 5, 60, 0.75)';
    ctx.fillRect(0, 170, CONSTANTS.CANVAS_WIDTH, 50);
    // バルコニー手すり
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 170);
    ctx.lineTo(CONSTANTS.CANVAS_WIDTH, 170);
    ctx.stroke();
    for (let x = -balconyOffset; x < CONSTANTS.CANVAS_WIDTH + 240; x += 240) {
      // 店舗の温かい窓明かり
      ctx.fillStyle = 'rgba(255, 230, 110, 0.25)';
      ctx.fillRect(x + 20, 130, 80, 40);
      ctx.fillRect(x + 130, 130, 80, 40);
    }
    ctx.restore();

    // 4. 動くエスカレーター（パララックス 0.20x）
    for (const esc of this.mallEscalators) {
      const renderX = esc.x - cameraX * 0.20;
      if (renderX > -200 && renderX < CONSTANTS.CANVAS_WIDTH + 200) {
        ctx.save();
        ctx.translate(renderX, esc.y);

        // 斜めトラス
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, esc.h);
        ctx.lineTo(esc.w, 0);
        ctx.stroke();
        ctx.strokeStyle = '#ff007f';
        ctx.beginPath();
        ctx.moveTo(0, esc.h - 18);
        ctx.lineTo(esc.w, -18);
        ctx.stroke();

        // 動くステップ光
        const stepOffset = (this.timer * 0.8) % 18;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        for (let s = 0; s < esc.w; s += 18) {
          const sx = s + stepOffset;
          if (sx < esc.w) {
            const sy = esc.h - (sx / esc.w) * esc.h;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - 8, sy);
            ctx.stroke();
          }
        }
        ctx.restore();
      }
    }

    // 5. 輝くネオンサイン群（パララックス 0.22x）
    for (const s of this.neonSigns) {
      const renderX = s.x - cameraX * 0.22;
      if (renderX > -150 && renderX < CONSTANTS.CANVAS_WIDTH + 150) {
        ctx.save();
        ctx.translate(renderX, s.y);

        const blink = Math.sin(this.timer * 0.08 + s.blinkOffset) > -0.7;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = blink ? 16 : 4;

        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(-s.width / 2, -14, s.width, 28);

        ctx.fillStyle = blink ? '#ffffff' : s.color;
        ctx.font = 'bold 12px ' + CONSTANTS.FONT_FAMILY;
        ctx.textAlign = 'center';
        ctx.fillText(s.text, 0, 4);

        ctx.restore();
      }
    }

    // 6. 舞い散るショッピングコンフェッティ（紙吹雪）
    for (const cf of this.mallConfetti) {
      const renderX = cf.x - cameraX * 0.25;
      if (renderX > -10 && renderX < CONSTANTS.CANVAS_WIDTH + 10) {
        ctx.fillStyle = cf.color;
        ctx.fillRect(renderX, cf.y, cf.size, cf.size * 0.6);
      }
    }

    // 7. 中景下部シルエット
    ctx.fillStyle = 'rgba(20, 4, 35, 0.75)';
    ctx.fillRect(0, 260, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT - 260);
  }

  // -------------------------------------------------------------------------
  // 🕰️ ステージ3: 最上階ペントハウス・時計塔背景
  // -------------------------------------------------------------------------
  drawClocktowerBackground(ctx, cameraX) {
    if (this.clockBgLoaded && this.clockBgImg) {
      // 🌟 軍曹ご提供の超ワイド・月夜の歯車時計塔（2241x702, 3.19:1）の描画
      const bgW = this.clockBgImg.naturalWidth || 2241;
      const bgH = this.clockBgImg.naturalHeight || 702;

      const targetH = CONSTANTS.CANVAS_HEIGHT;
      const targetW = targetH * (bgW / bgH); // 2241x702なら約1723.8px (超ワイドパノラマ)

      // 🌟 超ワイドパノラマ画像（横幅 >= 1400px）の場合:
      // リピート・反転一切なし！映画のように全域シームレススクロール ＆ ボス戦は中央の巨大満月・大時計へ美しく吸着！
      if (targetW >= 1400) {
        // ボス戦アリーナ突入度判定 (0.0: 通常道中 〜 1.0: ボス戦アリーナ完全進入)
        let bossBlend = 0;
        if (window.game && (window.game.state === 'BOSS_INTRO' || window.game.state === 'BOSS_BATTLE' || (window.game.state === 'STAGE_CLEAR' && window.game.boss && window.game.boss.isDead))) {
          bossBlend = 1.0;
        } else if (cameraX > 3700) {
          bossBlend = Math.min(1.0, (cameraX - 3700) / 420);
        }

        const maxCameraScroll = 4120; // ボスアリーナ開始地点
        const maxBgScroll = targetW - CONSTANTS.CANVAS_WIDTH;
        const normalBgX = -Math.min(1.0, Math.max(0, cameraX / maxCameraScroll)) * maxBgScroll;
        // 👑 ひろあき軍曹ご指示: ボス面は画角を一番右（大時計・真鍮歯車と満月の最高峰パノラマ構図）に固定
        const bossFarRightBgX = -maxBgScroll;

        const bgX = normalBgX * (1 - bossBlend) + bossFarRightBgX * bossBlend;

        ctx.drawImage(
          this.clockBgImg,
          0, 0, bgW, bgH,
          bgX, 0, targetW, targetH
        );
      } else {
        // 通常サイズ画像の場合: 左右反転（ミラー）なしの自然な正方向リピート描画
        const normalScrollX = cameraX * 0.18;
        const startIndex = Math.floor(normalScrollX / targetW);
        const endIndex = Math.ceil((normalScrollX + CONSTANTS.CANVAS_WIDTH) / targetW);

        for (let i = startIndex; i <= endIndex; i++) {
          const renderX = i * targetW - normalScrollX;
          ctx.drawImage(
            this.clockBgImg,
            0, 0, bgW, bgH,
            renderX, 0, targetW, targetH
          );
        }
      }

      // 🌟 満月＆時計の神秘的な黄金グロー（アンビエント環境光）
      ctx.save();
      const moonGlow = ctx.createRadialGradient(
        CONSTANTS.CANVAS_WIDTH * 0.5 - (cameraX * 0.05), 140, 50,
        CONSTANTS.CANVAS_WIDTH * 0.5 - (cameraX * 0.05), 140, 340
      );
      moonGlow.addColorStop(0, 'rgba(255, 240, 180, 0.16)');
      moonGlow.addColorStop(0.5, 'rgba(255, 215, 100, 0.07)');
      moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
      ctx.restore();

      // ✨ 夜空にきらめく星々のリアルタイム瞬き
      ctx.save();
      for (const s of this.stars) {
        const renderX = (s.x - cameraX * 0.08 + this.width) % CONSTANTS.CANVAS_WIDTH;
        const alpha = 0.35 + Math.sin(this.timer * s.twinkleSpeed) * 0.35;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(renderX, s.y * 0.65, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      return;
    }

    // ── ベクターフォールバック ──

    // 1. 深夜の紫紺〜トワイライト夜空
    const grad = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
    grad.addColorStop(0, '#060714');
    grad.addColorStop(0.65, '#13152d');
    grad.addColorStop(1, '#251b3b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // 2. 満月（月齢固定・神秘的な黄金光）
    const moonX = CONSTANTS.CANVAS_WIDTH * 0.78 - (cameraX * 0.04);
    ctx.save();
    ctx.shadowColor = '#ffeaa7';
    ctx.shadowBlur = 32;
    ctx.fillStyle = '#fff4cc';
    ctx.beginPath();
    ctx.arc(moonX, 90, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. きらめく星空（パララックス 0.08x）
    ctx.save();
    for (const s of this.stars) {
      const renderX = (s.x - cameraX * 0.08 + this.width) % CONSTANTS.CANVAS_WIDTH;
      const alpha = 0.4 + Math.sin(this.timer * s.twinkleSpeed) * 0.4;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(renderX, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. 中景: 巨大時計文字盤（パララックス 0.20x）
    const clockX = CONSTANTS.CANVAS_WIDTH * 0.45 - (cameraX * 0.20);
    this.drawGrandClock(ctx, clockX, 160, 95);

    // 5. 中景: ゆっくり回転する巨大歯車群（パララックス 0.25x）
    for (const cog of this.cogs) {
      const renderX = cog.x - cameraX * 0.25;
      if (renderX > -150 && renderX < CONSTANTS.CANVAS_WIDTH + 150) {
        this.drawGear(ctx, renderX, cog.y, cog.radius, cog.teeth, cog.angle || 0);
      }
    }

    // 6. 摩天楼（ネコ耳シルエットの高層ビル群）
    ctx.save();
    ctx.fillStyle = 'rgba(12, 14, 28, 0.85)';
    const bOffset = (cameraX * 0.3) % 160;
    for (let x = -bOffset - 50; x < CONSTANTS.CANVAS_WIDTH + 100; x += 110) {
      const bH = 140 + Math.sin(x * 0.05) * 45;
      ctx.fillRect(x, CONSTANTS.CANVAS_HEIGHT - bH - 60, 90, bH);
      // ビルのネコ耳屋根
      ctx.beginPath();
      ctx.moveTo(x + 10, CONSTANTS.CANVAS_HEIGHT - bH - 60);
      ctx.lineTo(x + 25, CONSTANTS.CANVAS_HEIGHT - bH - 85);
      ctx.lineTo(x + 40, CONSTANTS.CANVAS_HEIGHT - bH - 60);
      ctx.lineTo(x + 50, CONSTANTS.CANVAS_HEIGHT - bH - 60);
      ctx.lineTo(x + 65, CONSTANTS.CANVAS_HEIGHT - bH - 85);
      ctx.lineTo(x + 80, CONSTANTS.CANVAS_HEIGHT - bH - 60);
      ctx.fill();

      // 黄色い小窓
      ctx.fillStyle = 'rgba(255, 230, 100, 0.4)';
      for (let wy = CONSTANTS.CANVAS_HEIGHT - bH - 45; wy < CONSTANTS.CANVAS_HEIGHT - 70; wy += 22) {
        ctx.fillRect(x + 18, wy, 14, 10);
        ctx.fillRect(x + 56, wy, 14, 10);
      }
      ctx.fillStyle = 'rgba(12, 14, 28, 0.85)';
    }
    ctx.restore();
  }

  drawGrandClock(ctx, x, y, radius) {
    ctx.save();
    ctx.translate(x, y);

    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(245, 235, 210, 0.9)';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#c99738';
    ctx.stroke();

    ctx.fillStyle = '#2b2d42';
    ctx.font = 'bold 15px serif';
    ctx.textAlign = 'center';
    ctx.fillText('XII', 0, -radius + 22);
    ctx.fillText('III', radius - 20, 6);
    ctx.fillText('VI', 0, radius - 10);
    ctx.fillText('IX', -radius + 20, 6);

    const hourAngle = this.timer * 0.005;
    const minAngle = this.timer * 0.035;

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2b2d42';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(hourAngle) * (radius * 0.55), Math.sin(hourAngle) * (radius * 0.55));
    ctx.stroke();

    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(minAngle) * (radius * 0.75), Math.sin(minAngle) * (radius * 0.75));
    ctx.stroke();

    ctx.fillStyle = '#c99738';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawGear(ctx, x, y, radius, teeth, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = 'rgba(168, 126, 52, 0.4)';
    ctx.strokeStyle = 'rgba(224, 180, 80, 0.6)';
    ctx.lineWidth = 3;

    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = a1 + (Math.PI / teeth) * 0.5;
      const a3 = a1 + (Math.PI / teeth);

      const rOuter = radius;
      const rInner = radius * 0.82;

      ctx.lineTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
      ctx.lineTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
      ctx.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
      ctx.lineTo(Math.cos(a2) * rInner, Math.sin(a2) * rInner);
      ctx.lineTo(Math.cos(a3) * rInner, Math.sin(a3) * rInner);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#13152d';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // 🍣 ステージ4: 激闘！グルメ寿司屋敷＆厨房（和風祭囃子キッチン）
  // -------------------------------------------------------------------------
  drawKitchenBackground(ctx, cameraX) {
    if (this.sushiBgLoaded && this.sushiBgImg) {
      // 🌟 【案A】美麗AI背景（和風寿司屋敷＆厨房）：ミラー反転シームレス ＆ ボス戦厨房中央固定
      const bgW = 1672;
      const bgH = 941;

      const targetH = CONSTANTS.CANVAS_HEIGHT;
      const targetW = targetH * (bgW / bgH); // 約959.5px

      // ボス戦アリーナ突入度判定 (0.0: 通常道中 〜 1.0: ボス戦アリーナ完全進入)
      let bossBlend = 0;
      if (window.game && (window.game.state === 'BOSS_INTRO' || window.game.state === 'BOSS_BATTLE' || (window.game.state === 'STAGE_CLEAR' && window.game.boss && window.game.boss.isDead))) {
        bossBlend = 1.0;
      } else if (cameraX > 3600) {
        bossBlend = Math.min(1.0, (cameraX - 3600) / 450);
      }

      if (bossBlend >= 0.999) {
        // 🍣 ★ ボス戦時: 大鍋と厨房が画面中央にピタリと固定！左右の切れ目は100%消滅！
        const bossBgX = (CONSTANTS.CANVAS_WIDTH - targetW) / 2;
        ctx.drawImage(
          this.sushiBgImg,
          0, 0, bgW, bgH,
          bossBgX, 0, targetW, targetH
        );
      } else {
        // 🏮 ★ 道中: ミラー反転シームレス描画（左右反転で継ぎ目を完全結合、切れ目ゼロ！）
        const normalScrollX = cameraX * 0.18;
        const startIndex = Math.floor(normalScrollX / targetW) - 1;
        const endIndex = Math.ceil((normalScrollX + CONSTANTS.CANVAS_WIDTH) / targetW) + 1;

        for (let i = startIndex; i <= endIndex; i++) {
          const renderX = i * targetW - normalScrollX;
          const isMirror = Math.abs(i) % 2 === 1;

          ctx.save();
          if (isMirror) {
            // 水平反転して右端同士・左端同士を美しく結合
            ctx.translate(renderX + targetW, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(
              this.sushiBgImg,
              0, 0, bgW, bgH,
              0, 0, targetW, targetH
            );
          } else {
            ctx.drawImage(
              this.sushiBgImg,
              0, 0, bgW, bgH,
              renderX, 0, targetW, targetH
            );
          }
          ctx.restore();
        }
      }

      // 🏮 提灯と厨房の温かなオレンジ・レッド環境光（アンビエントブルーム）
      ctx.save();
      const lanternGlow = ctx.createLinearGradient(0, 0, 0, 180);
      lanternGlow.addColorStop(0, 'rgba(255, 100, 30, 0.18)');
      lanternGlow.addColorStop(0.5, 'rgba(255, 180, 50, 0.08)');
      lanternGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lanternGlow;
      ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, 180);
      ctx.restore();

      // ♨️ 厨房の大鍋から立ちのぼるリアルタイム湯気粒子
      ctx.save();
      for (const s of this.kitchenSteam) {
        const renderX = (s.x - cameraX * 0.20 + this.width) % (CONSTANTS.CANVAS_WIDTH + 60) - 30;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(renderX + Math.sin(this.timer * 0.05 + s.y * 0.05) * 8, s.y, s.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    // ── ベクターフォールバック ──
    // 1. 漆塗りと障子の温かな和風グラデーション
    const grad = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
    grad.addColorStop(0, '#2d0c03');
    grad.addColorStop(0.4, '#541c09');
    grad.addColorStop(0.8, '#7e2d11');
    grad.addColorStop(1.0, '#a53f18');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // 2. 障子格子スクリーン壁（パララックス 0.05x）
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 215, 120, 0.18)';
    ctx.lineWidth = 1.5;
    const shojiOffset = (cameraX * 0.05) % 60;
    for (let x = -shojiOffset; x < CONSTANTS.CANVAS_WIDTH + 60; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 260);
      ctx.stroke();
    }
    for (let y = 30; y <= 240; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CONSTANTS.CANVAS_WIDTH, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. 大漁旗・祝い旗（パララックス 0.12x）
    for (const ban of this.kitchenBanners) {
      const renderX = ban.x - cameraX * 0.12;
      if (renderX > -100 && renderX < CONSTANTS.CANVAS_WIDTH + 100) {
        ctx.save();
        ctx.translate(renderX, ban.y);
        // 旗の生地
        ctx.fillStyle = '#1d3557';
        ctx.fillRect(-35, -20, 70, 42);
        ctx.strokeStyle = '#e63946';
        ctx.lineWidth = 3;
        ctx.strokeRect(-35, -20, 70, 42);
        // 富士山と波の意匠
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.arc(0, -5, 12, 0, Math.PI * 2);
        ctx.fill();
        // 文字
        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 15px serif';
        ctx.textAlign = 'center';
        ctx.fillText(ban.text, 0, 14);
        ctx.restore();
      }
    }

    // 4. ゆらゆら揺れる赤提灯・白提灯（パララックス 0.18x）
    for (const lan of this.kitchenLanterns) {
      const renderX = lan.x - cameraX * 0.18;
      if (renderX > -50 && renderX < CONSTANTS.CANVAS_WIDTH + 50) {
        const sway = Math.sin(this.timer * 0.045 + lan.swayOffset) * 8;
        ctx.save();
        ctx.translate(renderX, lan.y);

        // 吊り紐
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -lan.y + 10);
        ctx.lineTo(sway, 0);
        ctx.stroke();

        ctx.translate(sway, 0);
        // 提灯の光
        ctx.shadowColor = lan.color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = lan.color;
        ctx.beginPath();
        ctx.ellipse(0, 16, 14, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // 提灯の黒枠
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(-10, -3, 20, 4);
        ctx.fillRect(-10, 35, 20, 4);
        // 提灯の文字
        ctx.fillStyle = (lan.color === '#ffffff') ? '#e63946' : '#ffd166';
        ctx.font = 'bold 10px ' + CONSTANTS.FONT_FAMILY;
        ctx.textAlign = 'center';
        ctx.fillText('猫', 0, 20);

        ctx.restore();
      }
    }

    // 5. 巨大な大鍋と立ちのぼる湯気（パララックス 0.22x）
    for (const pot of this.kitchenPots) {
      const renderX = pot.x - cameraX * 0.22;
      if (renderX > -100 && renderX < CONSTANTS.CANVAS_WIDTH + 100) {
        ctx.save();
        ctx.translate(renderX, pot.y);
        // 大鍋本体
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.arc(0, 15, 30, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#b7094c';
        ctx.fillRect(-34, 12, 68, 6);
        // ぐつぐつ煮える黄金スープ
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.ellipse(0, 12, 28, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 6. 立ちのぼる湯気粒子
    for (const s of this.kitchenSteam) {
      const renderX = s.x - cameraX * 0.22;
      if (renderX > -30 && renderX < CONSTANTS.CANVAS_WIDTH + 30) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(renderX + Math.sin(this.timer * 0.05 + s.y * 0.05) * 8, s.y, s.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 7. 奥の檜（ひのき）寿司カウンターシルエット
    ctx.fillStyle = '#3d1607';
    ctx.fillRect(0, 290, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT - 290);
    ctx.fillStyle = '#5c220a';
    ctx.fillRect(0, 290, CONSTANTS.CANVAS_WIDTH, 8);
  }

  // -------------------------------------------------------------------------
  // 🏖️ ステージ5: トロピカル・キャットビーチ（常夏サンバビーチ）
  // -------------------------------------------------------------------------
  drawBeachBackground(ctx, cameraX) {
    if (this.beachBgLoaded && this.beachBgImg) {
      // 🌟 軍曹ご提供の超ワイド・常夏キャットビーチ（2216x709, 3.12:1）の描画
      const bgW = this.beachBgImg.naturalWidth || 2216;
      const bgH = this.beachBgImg.naturalHeight || 709;

      const targetH = CONSTANTS.CANVAS_HEIGHT;
      const targetW = targetH * (bgW / bgH); // 2216x709なら約1687.7px (超ワイドパノラマ)

      // 🌟 超ワイドパノラマ画像（横幅 >= 1400px）の場合:
      // リピート・反転一切なし！映画のように全域シームレススクロール ＆ ボス戦は中央の火山島・太陽へ美しく吸着！
      if (targetW >= 1400) {
        // ボス戦アリーナ突入度判定 (0.0: 通常道中 〜 1.0: ボス戦アリーナ完全進入)
        let bossBlend = 0;
        if (window.game && (window.game.state === 'BOSS_INTRO' || window.game.state === 'BOSS_BATTLE' || (window.game.state === 'STAGE_CLEAR' && window.game.boss && window.game.boss.isDead))) {
          bossBlend = 1.0;
        } else if (cameraX > 3700) {
          bossBlend = Math.min(1.0, (cameraX - 3700) / 420);
        }

        const maxCameraScroll = 4120; // ボスアリーナ開始地点
        const maxBgScroll = targetW - CONSTANTS.CANVAS_WIDTH;
        const normalBgX = -Math.min(1.0, Math.max(0, cameraX / maxCameraScroll)) * maxBgScroll;
        const bossCenterBgX = (CONSTANTS.CANVAS_WIDTH - targetW) / 2;

        const bgX = normalBgX * (1 - bossBlend) + bossCenterBgX * bossBlend;

        ctx.drawImage(
          this.beachBgImg,
          0, 0, bgW, bgH,
          bgX, 0, targetW, targetH
        );
      } else {
        // 通常サイズ画像の場合: 左右反転（ミラー）なしの自然な正方向リピート描画
        const normalScrollX = cameraX * 0.18;
        const startIndex = Math.floor(normalScrollX / targetW);
        const endIndex = Math.ceil((normalScrollX + CONSTANTS.CANVAS_WIDTH) / targetW);

        for (let i = startIndex; i <= endIndex; i++) {
          const renderX = i * targetW - normalScrollX;
          ctx.drawImage(
            this.beachBgImg,
            0, 0, bgW, bgH,
            renderX, 0, targetW, targetH
          );
        }
      }

      // ☀️ 常夏の眩しい太陽光＆トロピカルアンビエント光
      const beachGlow = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
      beachGlow.addColorStop(0, 'rgba(255, 255, 230, 0.16)');
      beachGlow.addColorStop(0.45, 'rgba(230, 250, 255, 0.08)');
      beachGlow.addColorStop(1.0, 'rgba(255, 240, 220, 0.05)');
      ctx.fillStyle = beachGlow;
      ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

      return;
    }

    // ── ベクターフォールバック ──
    // 1. 常夏のトロピカルブルーグラデーション
    const grad = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
    grad.addColorStop(0, '#0077b6');
    grad.addColorStop(0.35, '#00b4d8');
    grad.addColorStop(0.70, '#90e0ef');
    grad.addColorStop(1.0, '#caf0f8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // 2. ぎらぎら輝く常夏の太陽
    const sunX = CONSTANTS.CANVAS_WIDTH * 0.2 - cameraX * 0.02;
    ctx.save();
    ctx.translate(sunX, 65);
    ctx.shadowColor = '#ffb703';
    ctx.shadowBlur = 35;
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();
    // サングラスをした太陽
    ctx.fillStyle = '#212529';
    ctx.fillRect(-16, -4, 13, 8);
    ctx.fillRect(3, -4, 13, 8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#212529';
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.stroke();
    ctx.restore();

    // 3. 遠景: エメラルドの水平線と火山島（パララックス 0.05x）
    ctx.save();
    ctx.fillStyle = '#0096c7';
    ctx.fillRect(0, 220, CONSTANTS.CANVAS_WIDTH, 80);
    // 遠くの南の島影
    ctx.fillStyle = '#2a9d8f';
    const islandOffset = (cameraX * 0.05) % 400;
    for (let x = -islandOffset; x < CONSTANTS.CANVAS_WIDTH + 400; x += 400) {
      ctx.beginPath();
      ctx.moveTo(x + 50, 220);
      ctx.quadraticCurveTo(x + 130, 180, x + 210, 220);
      ctx.fill();
    }
    ctx.restore();

    // 4. 水平線を走るヨット（パララックス 0.08x）
    for (const boat of this.sailboats) {
      const renderX = boat.x - cameraX * 0.08;
      if (renderX > -50 && renderX < CONSTANTS.CANVAS_WIDTH + 50) {
        ctx.save();
        ctx.translate(renderX, boat.y);
        ctx.fillStyle = '#ffffff';
        // 三角白帆
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(12, -18);
        ctx.lineTo(0, -18);
        ctx.closePath();
        ctx.fill();
        // 船体
        ctx.fillStyle = '#e63946';
        ctx.fillRect(-6, 0, 18, 5);
        ctx.restore();
      }
    }

    // 5. 打ち寄せるエメラルドの多重波（パララックス 0.16x）
    ctx.save();
    const waveOffset = (cameraX * 0.16 + this.timer * 1.5) % 120;
    ctx.fillStyle = 'rgba(72, 202, 228, 0.6)';
    ctx.beginPath();
    ctx.moveTo(0, 280);
    for (let x = -waveOffset; x < CONSTANTS.CANVAS_WIDTH + 120; x += 60) {
      ctx.quadraticCurveTo(x + 30, 265 + Math.sin(this.timer * 0.06 + x) * 5, x + 60, 280);
    }
    ctx.lineTo(CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
    ctx.lineTo(0, CONSTANTS.CANVAS_HEIGHT);
    ctx.fill();

    // 白波の泡（フォーム）
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -waveOffset; x < CONSTANTS.CANVAS_WIDTH + 120; x += 60) {
      ctx.quadraticCurveTo(x + 30, 265 + Math.sin(this.timer * 0.06 + x) * 5, x + 60, 280);
    }
    ctx.stroke();
    ctx.restore();

    // 6. 白い砂浜（パララックス 0.22x）
    ctx.fillStyle = '#ffe8d6';
    ctx.fillRect(0, 310, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT - 310);

    // 7. ヤシの木（パララックス 0.20x）
    for (const tree of this.palmTrees) {
      const renderX = tree.x - cameraX * 0.20;
      if (renderX > -100 && renderX < CONSTANTS.CANVAS_WIDTH + 100) {
        this.drawPalmTree(ctx, renderX, tree.y, tree.scale, tree.swayOffset);
      }
    }

    // 8. カラフルなパラソル（パララックス 0.24x）
    for (const um of this.beachUmbrellas) {
      const renderX = um.x - cameraX * 0.24;
      if (renderX > -50 && renderX < CONSTANTS.CANVAS_WIDTH + 50) {
        ctx.save();
        ctx.translate(renderX, um.y);
        // 棒
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -35);
        ctx.stroke();
        // 傘
        ctx.fillStyle = um.color1;
        ctx.beginPath();
        ctx.arc(0, -35, 25, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = um.color2;
        ctx.beginPath();
        ctx.arc(0, -35, 16, Math.PI, 0);
        ctx.fill();
        ctx.restore();
      }
    }

    // 9. 雲
    for (const c of this.beachClouds) {
      const renderX = c.x - cameraX * 0.12;
      if (renderX > -100 && renderX < CONSTANTS.CANVAS_WIDTH + 100) {
        this.drawSmilingCloud(ctx, renderX, c.y, c.scale);
      }
    }
  }

  // ヤシの木を描くヘルパー
  drawPalmTree(ctx, x, y, scale, offset) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const sway = Math.sin(this.timer * 0.035 + offset) * 12;

    // 幹（茶色で少しカーブ）
    ctx.strokeStyle = '#a68a64';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(15, -60, sway, -110);
    ctx.stroke();

    // 葉（濃い緑と明るい緑の房）
    ctx.save();
    ctx.translate(sway, -110);
    const leafAngles = [-2.4, -1.8, -1.2, -0.6, 0.1, 0.7, 1.3];
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#588157';
    for (const a of leafAngles) {
      const leafSway = Math.sin(this.timer * 0.05 + a) * 0.15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(Math.cos(a + leafSway) * 35, Math.sin(a + leafSway) * 35 - 10, Math.cos(a + leafSway) * 60, Math.sin(a + leafSway) * 60 + 15);
      ctx.stroke();
    }
    // ココナッツの実
    ctx.fillStyle = '#6f4e37';
    ctx.beginPath();
    ctx.arc(-5, 5, 5, 0, Math.PI * 2);
    ctx.arc(5, 5, 5, 0, Math.PI * 2);
    ctx.arc(0, 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // 👻 ステージ6: 妖怪・ゴーストキャットマンション（ポップゴシック洋館）
  // -------------------------------------------------------------------------
  drawGhostBackground(ctx, cameraX) {
    if (this.ghostBgLoaded && this.ghostBgImg) {
      // 🌟 【案A】美麗AI背景（ゴースト洋館）：ミラー反転シームレス ＆ ボス戦中央大ステンドグラス固定
      const bgW = 1672;
      const bgH = 941;

      const targetH = CONSTANTS.CANVAS_HEIGHT;
      const targetW = targetH * (bgW / bgH); // 約888.4px

      // ボス戦アリーナ突入度判定 (0.0: 通常道中 〜 1.0: ボス戦アリーナ完全進入)
      let bossBlend = 0;
      if (window.game && (window.game.state === 'BOSS_INTRO' || window.game.state === 'BOSS_BATTLE' || (window.game.state === 'STAGE_CLEAR' && window.game.boss && window.game.boss.isDead))) {
        bossBlend = 1.0;
      } else if (cameraX > 3600) {
        bossBlend = Math.min(1.0, (cameraX - 3600) / 450);
      }

      if (bossBlend >= 0.999) {
        // 👻 ★ ボス戦時: 大ステンドグラスと緑の三日月が画面中央にピタリと固定！左右の切れ目は100%消滅！
        const bossBgX = (CONSTANTS.CANVAS_WIDTH - targetW) / 2;
        ctx.drawImage(
          this.ghostBgImg,
          0, 0, bgW, bgH,
          bossBgX, 0, targetW, targetH
        );
      } else {
        // 🔮 ★ 道中: ミラー反転シームレス描画（左右反転で継ぎ目を完全結合、切れ目ゼロ！）
        const normalScrollX = cameraX * 0.18;
        const startIndex = Math.floor(normalScrollX / targetW) - 1;
        const endIndex = Math.ceil((normalScrollX + CONSTANTS.CANVAS_WIDTH) / targetW) + 1;

        for (let i = startIndex; i <= endIndex; i++) {
          const renderX = i * targetW - normalScrollX;
          const isMirror = Math.abs(i) % 2 === 1;

          ctx.save();
          if (isMirror) {
            ctx.translate(renderX + targetW, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(
              this.ghostBgImg,
              0, 0, bgW, bgH,
              0, 0, targetW, targetH
            );
          } else {
            ctx.drawImage(
              this.ghostBgImg,
              0, 0, bgW, bgH,
              renderX, 0, targetW, targetH
            );
          }
          ctx.restore();
        }

        // ボス戦接近時は中央画像をスムーズにブレンド固定
        if (bossBlend > 0) {
          ctx.save();
          ctx.globalAlpha = bossBlend;
          const bossBgX = (CONSTANTS.CANVAS_WIDTH - targetW) / 2;
          ctx.drawImage(
            this.ghostBgImg,
            0, 0, bgW, bgH,
            bossBgX, 0, targetW, targetH
          );
          ctx.restore();
        }
      }

      // 🔮 妖しく光るステンドグラスのパープル＆エメラルド環境光オーバーレイ
      const ghostGlow = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
      ghostGlow.addColorStop(0, 'rgba(80, 0, 140, 0.15)');
      ghostGlow.addColorStop(0.5, 'rgba(0, 220, 150, 0.08)');
      ghostGlow.addColorStop(1.0, 'rgba(40, 0, 60, 0.10)');
      ctx.fillStyle = ghostGlow;
      ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

      return;
    }

    // ── ベクターフォールバック ──
    // 1. 深夜のミステリアスパープルグラデーション
    const grad = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
    grad.addColorStop(0, '#0a001a');
    grad.addColorStop(0.4, '#1f0038');
    grad.addColorStop(0.75, '#38005e');
    grad.addColorStop(1.0, '#53007a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // 2. 不気味に光るエメラルドの三日月
    const moonX = CONSTANTS.CANVAS_WIDTH * 0.82 - (cameraX * 0.03);
    ctx.save();
    ctx.translate(moonX, 75);
    ctx.shadowColor = '#70e000';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#d8f3dc';
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a001a';
    ctx.beginPath();
    ctx.arc(10, -5, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. 遠景: 不気味な洋館の屋根尖塔シルエット（パララックス 0.07x）
    ctx.save();
    ctx.fillStyle = '#100024';
    const spireOffset = (cameraX * 0.07) % 300;
    for (let x = -spireOffset - 50; x < CONSTANTS.CANVAS_WIDTH + 300; x += 220) {
      // 尖塔
      ctx.beginPath();
      ctx.moveTo(x, 240);
      ctx.lineTo(x + 25, 110);
      ctx.lineTo(x + 50, 240);
      ctx.fill();
      // ねこ耳飾り
      ctx.beginPath();
      ctx.moveTo(x + 20, 110);
      ctx.lineTo(x + 15, 95);
      ctx.lineTo(x + 25, 105);
      ctx.lineTo(x + 35, 95);
      ctx.lineTo(x + 30, 110);
      ctx.fill();
    }
    ctx.restore();

    // 4. 妖しく光るステンドグラス窓（パララックス 0.15x）
    const winOffset = (cameraX * 0.15) % 200;
    for (let x = -winOffset; x < CONSTANTS.CANVAS_WIDTH + 200; x += 200) {
      ctx.save();
      ctx.translate(x + 40, 180);
      // ゴシックアーチ窓
      ctx.shadowColor = '#9d4edd';
      ctx.shadowBlur = 15;
      ctx.fillStyle = 'rgba(157, 78, 221, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, 18, Math.PI, 0);
      ctx.lineTo(18, 50);
      ctx.lineTo(-18, 50);
      ctx.closePath();
      ctx.fill();
      // 窓枠
      ctx.strokeStyle = '#240046';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(0, 50);
      ctx.moveTo(-18, 15);
      ctx.lineTo(18, 15);
      ctx.stroke();
      ctx.restore();
    }

    // 5. 揺れる豪華シャンデリア（パララックス 0.20x）
    for (const ch of this.ghostChandeliers) {
      const renderX = ch.x - cameraX * 0.20;
      if (renderX > -100 && renderX < CONSTANTS.CANVAS_WIDTH + 100) {
        const sway = Math.sin(this.timer * 0.04 + ch.x) * 6;
        ctx.save();
        ctx.translate(renderX + sway, ch.y);

        // 鎖
        ctx.strokeStyle = '#2b2b2b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -ch.y);
        ctx.lineTo(0, 0);
        ctx.stroke();

        // 骨組み
        ctx.fillStyle = '#3a0ca3';
        ctx.beginPath();
        ctx.arc(0, 15, 30, Math.PI * 0.15, Math.PI * 0.85);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffd166';
        ctx.stroke();

        // ろうそくの青い炎（アニメーション）
        const flameOffset = Math.sin(this.timer * 0.15) * 2;
        ctx.fillStyle = '#00f5d4';
        ctx.shadowColor = '#00f5d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(-22, 12 + flameOffset, 4, 0, Math.PI * 2);
        ctx.arc(0, 18 + flameOffset, 4, 0, Math.PI * 2);
        ctx.arc(22, 12 + flameOffset, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // 6. 浮遊するトランプカード
    for (const card of this.ghostCards) {
      const renderX = card.x - cameraX * 0.22;
      if (renderX > -20 && renderX < CONSTANTS.CANVAS_WIDTH + 20) {
        ctx.save();
        ctx.translate(renderX, card.y);
        ctx.rotate(card.rot);
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(-8, -12, 16, 24);
        ctx.strokeStyle = '#212529';
        ctx.lineWidth = 1;
        ctx.strokeRect(-8, -12, 16, 24);
        ctx.fillStyle = (card.suit === '♥') ? '#d90429' : '#03045e';
        ctx.font = 'bold 10px serif';
        ctx.textAlign = 'center';
        ctx.fillText(card.suit, 0, 4);
        ctx.restore();
      }
    }

    // 7. ふわふわ浮遊するゴースト火の玉（ウィスプ）
    for (const w of this.ghostWisps) {
      const renderX = w.x - cameraX * 0.12;
      if (renderX > -30 && renderX < CONSTANTS.CANVAS_WIDTH + 30) {
        ctx.save();
        ctx.shadowColor = '#b5179e';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(181, 23, 158, 0.45)';
        ctx.beginPath();
        ctx.arc(renderX, w.y, w.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f72585';
        ctx.beginPath();
        ctx.arc(renderX, w.y, w.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 8. 暗がり
    ctx.fillStyle = 'rgba(15, 0, 30, 0.8)';
    ctx.fillRect(0, 270, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT - 270);
  }

  // -------------------------------------------------------------------------
  // 🚀 ステージ7: コズミック・キャットスペース（銀河スペースオペラ）
  // -------------------------------------------------------------------------
  drawSpaceBackground(ctx, cameraX) {
    if (this.spaceBgLoaded && this.spaceBgImg) {
      const bgW = this.spaceBgImg.naturalWidth || 1024;
      const bgH = this.spaceBgImg.naturalHeight || 317;

      const targetH = CONSTANTS.CANVAS_HEIGHT;
      const targetW = targetH * (bgW / bgH); // 1024x317なら約1744.4px (超ワイドパノラマ)

      // 🌟 超ワイドパノラマ画像（横幅 >= 1500px）の場合:
      // リピート・反転一切なし！ステージ開始からボス戦まで1枚の壮大パノラマとして映画のように完全スクロール！
      if (targetW >= 1500) {
        const maxCameraScroll = 4150; // ボスアリーナ開始地点
        const maxBgScroll = targetW - CONSTANTS.CANVAS_WIDTH;
        const progress = Math.min(1.0, Math.max(0, cameraX / maxCameraScroll));
        const bgX = -progress * maxBgScroll;

        ctx.drawImage(
          this.spaceBgImg,
          0, 0, bgW, bgH,
          bgX, 0, targetW, targetH
        );
      } else {
        // 🌌 通常サイズ画像の場合: 左右反転（ミラー）を完全撤廃し、自然な正方向リピート描画
        const normalScrollX = cameraX * 0.18;
        const startIndex = Math.floor(normalScrollX / targetW);
        const endIndex = Math.ceil((normalScrollX + CONSTANTS.CANVAS_WIDTH) / targetW);

        for (let i = startIndex; i <= endIndex; i++) {
          const renderX = i * targetW - normalScrollX;
          ctx.drawImage(
            this.spaceBgImg,
            0, 0, bgW, bgH,
            renderX, 0, targetW, targetH
          );
        }
      }

      // 🌌 煌びやかなコズミックネビュラ＆星空の環境光オーバーレイ
      const spaceGlow = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
      spaceGlow.addColorStop(0, 'rgba(130, 0, 255, 0.14)');
      spaceGlow.addColorStop(0.5, 'rgba(0, 245, 212, 0.06)');
      spaceGlow.addColorStop(1.0, 'rgba(255, 0, 127, 0.08)');
      ctx.fillStyle = spaceGlow;
      ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

      return;
    }

    // ── ベクターフォールバック ──
    // 1. 深遠なる宇宙の漆黒グラデーション
    const grad = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
    grad.addColorStop(0, '#03071e');
    grad.addColorStop(0.35, '#080d2b');
    grad.addColorStop(0.70, '#10002b');
    grad.addColorStop(1.0, '#1e0038');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // 2. 輝く銀河ネビュラ（星雲・パララックス 0.02x）
    for (const neb of this.spaceNebulae) {
      const renderX = neb.x - cameraX * 0.02;
      if (renderX > -250 && renderX < CONSTANTS.CANVAS_WIDTH + 250) {
        ctx.save();
        const radGrad = ctx.createRadialGradient(renderX, neb.y, 10, renderX, neb.y, neb.r);
        radGrad.addColorStop(0, neb.color);
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(renderX, neb.y, neb.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 3. 巨大な環を持つ土星風惑星（パララックス 0.03x）
    const planetX = CONSTANTS.CANVAS_WIDTH * 0.75 - (cameraX * 0.03);
    ctx.save();
    ctx.translate(planetX, 110);
    // 環（奥側）
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.4)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 85, 22, -0.25, Math.PI, Math.PI * 2);
    ctx.stroke();

    // 惑星本体
    const pGrad = ctx.createLinearGradient(-35, -35, 35, 35);
    pGrad.addColorStop(0, '#ffd166');
    pGrad.addColorStop(0.5, '#f77f00');
    pGrad.addColorStop(1.0, '#d62828');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fill();

    // 環（手前側）
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.85)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 85, 22, -0.25, 0, Math.PI);
    ctx.stroke();
    ctx.restore();

    // 4. 猫座（コンステレーション）
    ctx.save();
    const catConstX = CONSTANTS.CANVAS_WIDTH * 0.3 - cameraX * 0.04;
    ctx.translate(catConstX, 80);
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.35)';
    ctx.lineWidth = 1.5;
    const catNodes = [[-20, 10], [0, 20], [20, 10], [15, -10], [25, -25], [10, -20], [-10, -20], [-25, -25], [-15, -10]];
    ctx.beginPath();
    ctx.moveTo(catNodes[0][0], catNodes[0][1]);
    for (let i = 1; i < catNodes.length; i++) ctx.lineTo(catNodes[i][0], catNodes[i][1]);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#00f5d4';
    for (const pt of catNodes) {
      ctx.beginPath();
      ctx.arc(pt[0], pt[1], 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 5. きらめく満天の星空（パララックス 0.06x）
    for (const s of this.spaceStars) {
      const renderX = (s.x - cameraX * 0.06 + this.width) % CONSTANTS.CANVAS_WIDTH;
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(renderX, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. 流れる流星（シューティングスター）
    for (const m of this.meteors) {
      const renderX = m.x - cameraX * 0.10;
      if (renderX > -100 && renderX < CONSTANTS.CANVAS_WIDTH + 100) {
        ctx.save();
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(renderX, m.y);
        ctx.lineTo(renderX - m.vx * 8, m.y - m.vy * 8);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(renderX, m.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 7. 周回する宇宙ステーション（パララックス 0.12x）
    for (const sat of this.satellites) {
      const renderX = sat.x - cameraX * 0.12;
      if (renderX > -80 && renderX < CONSTANTS.CANVAS_WIDTH + 80) {
        ctx.save();
        ctx.translate(renderX, sat.y);
        // ソーラーパネル
        ctx.fillStyle = '#0077b6';
        ctx.fillRect(-28, -8, 18, 16);
        ctx.fillRect(10, -8, 18, 16);
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 1;
        ctx.strokeRect(-28, -8, 18, 16);
        ctx.strokeRect(10, -8, 18, 16);
        // モジュール本体
        ctx.fillStyle = '#e9ecef';
        ctx.fillRect(-8, -12, 16, 24);
        // 点滅ライト
        ctx.fillStyle = (this.timer % 40 < 20) ? '#ff0054' : '#70e000';
        ctx.beginPath();
        ctx.arc(0, -12, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // -------------------------------------------------------------------------
  drawCastleBackground(ctx, cameraX) {
    if (this.castleBgLoaded && this.castleBgImg) {
      // 🌟 軍曹ご提供の超ワイド・天空城最終決戦（1024x336）の描画
      const bgW = this.castleBgImg.naturalWidth || 1024;
      const bgH = this.castleBgImg.naturalHeight || 336;

      const targetH = CONSTANTS.CANVAS_HEIGHT;
      const targetW = targetH * (bgW / bgH); // 1024x336なら約1462.8px (超ワイドパノラマ)

      // 🌟 超ワイドパノラマ画像（横幅 >= 1400px）の場合:
      // リピート・反転一切なし！映画のように全域シームレススクロール ＆ ラスボス戦は中央の神聖黄金宮殿へ吸着！
      if (targetW >= 1400) {
        let bossBlend = 0;
        if (window.game && (window.game.state === 'BOSS_INTRO' || window.game.state === 'BOSS_BATTLE' || (window.game.state === 'STAGE_CLEAR' && window.game.boss && window.game.boss.isDead))) {
          bossBlend = 1.0;
        } else if (cameraX > 3700) {
          bossBlend = Math.min(1.0, (cameraX - 3700) / 450);
        }

        const maxCameraScroll = 4150; // ボスアリーナ開始地点
        const maxBgScroll = targetW - CONSTANTS.CANVAS_WIDTH;
        const normalBgX = -Math.min(1.0, Math.max(0, cameraX / maxCameraScroll)) * maxBgScroll;
        const bossCenterBgX = (CONSTANTS.CANVAS_WIDTH - targetW) / 2;

        const bgX = normalBgX * (1 - bossBlend) + bossCenterBgX * bossBlend;

        ctx.drawImage(
          this.castleBgImg,
          0, 0, bgW, bgH,
          bgX, 0, targetW, targetH
        );
      } else {
        // 通常サイズ画像の場合: 左右反転（ミラー）なしの自然な正方向リピート描画
        const normalScrollX = cameraX * 0.18;
        const startIndex = Math.floor(normalScrollX / targetW);
        const endIndex = Math.ceil((normalScrollX + CONSTANTS.CANVAS_WIDTH) / targetW);

        for (let i = startIndex; i <= endIndex; i++) {
          const renderX = i * targetW - normalScrollX;
          ctx.drawImage(
            this.castleBgImg,
            0, 0, bgW, bgH,
            renderX, 0, targetW, targetH
          );
        }
      }

      // ☀️ 神聖な天空の光線（ゴッドレイ・光のカーテン）オーバーレイ
      ctx.save();
      const rayAngle = 0.25;
      ctx.fillStyle = 'rgba(255, 245, 200, 0.08)';
      for (let i = 0; i < 6; i++) {
        const rx = (i * 180 + this.timer * 0.2) % (CONSTANTS.CANVAS_WIDTH + 200) - 100;
        ctx.beginPath();
        ctx.moveTo(rx, 0);
        ctx.lineTo(rx + 60, 0);
        ctx.lineTo(rx + 60 + Math.tan(rayAngle) * CONSTANTS.CANVAS_HEIGHT, CONSTANTS.CANVAS_HEIGHT);
        ctx.lineTo(rx + Math.tan(rayAngle) * CONSTANTS.CANVAS_HEIGHT, CONSTANTS.CANVAS_HEIGHT);
        ctx.fill();
      }
      ctx.restore();

      // ✨ 舞い上がる聖なる光の粒子（スパーク）
      for (const s of this.castleSparks) {
        const renderX = s.x - cameraX * 0.22;
        if (renderX > -10 && renderX < CONSTANTS.CANVAS_WIDTH + 10) {
          ctx.save();
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 6;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(renderX, s.y - (this.timer * 0.8) % 500, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      return;
    }

    // ── ベクターフォールバック ──
    // 1. 神々しい深紅〜黄金のサンライズグラデーション
    const grad = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
    grad.addColorStop(0, '#370617');
    grad.addColorStop(0.25, '#6a040f');
    grad.addColorStop(0.55, '#9d0208');
    grad.addColorStop(0.80, '#dc2f02');
    grad.addColorStop(1.0, '#ffba08');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // 2. 天から差し込む神聖な光線（ゴッドレイ・光のカーテン）
    ctx.save();
    const rayAngle = 0.25;
    ctx.fillStyle = 'rgba(255, 235, 150, 0.08)';
    for (let i = 0; i < 6; i++) {
      const rx = (i * 180 + this.timer * 0.2) % (CONSTANTS.CANVAS_WIDTH + 200) - 100;
      ctx.beginPath();
      ctx.moveTo(rx, 0);
      ctx.lineTo(rx + 60, 0);
      ctx.lineTo(rx + 60 + Math.tan(rayAngle) * CONSTANTS.CANVAS_HEIGHT, CONSTANTS.CANVAS_HEIGHT);
      ctx.lineTo(rx + Math.tan(rayAngle) * CONSTANTS.CANVAS_HEIGHT, CONSTANTS.CANVAS_HEIGHT);
      ctx.fill();
    }
    ctx.restore();

    // 3. 雲海の上に浮かぶ天空城の黄金シルエット（パララックス 0.06x）
    const citadelOffset = (cameraX * 0.06) % 360;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 209, 102, 0.45)';
    for (let x = -citadelOffset; x < CONSTANTS.CANVAS_WIDTH + 360; x += 360) {
      // 巨大な宮殿シルエット
      ctx.beginPath();
      ctx.moveTo(x + 50, 260);
      ctx.lineTo(x + 50, 160);
      ctx.lineTo(x + 90, 110);
      ctx.lineTo(x + 130, 160);
      ctx.lineTo(x + 130, 260);
      ctx.fill();
      // 左右の塔
      ctx.fillRect(x + 20, 180, 25, 80);
      ctx.fillRect(x + 135, 180, 25, 80);
      // とんがり屋根
      ctx.beginPath();
      ctx.moveTo(x + 15, 180);
      ctx.lineTo(x + 32, 140);
      ctx.lineTo(x + 50, 180);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 130, 180);
      ctx.lineTo(x + 147, 140);
      ctx.lineTo(x + 165, 180);
      ctx.fill();
    }
    ctx.restore();

    // 4. 黄金に染まる雲海（パララックス 0.12x）
    for (const c of this.castleClouds) {
      const renderX = c.x - cameraX * 0.12;
      if (renderX > -200 && renderX < CONSTANTS.CANVAS_WIDTH + 200) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 220, 130, 0.55)';
        ctx.beginPath();
        ctx.ellipse(renderX, c.y, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 5. 大理石の古代列柱と王室の真紅バナー（パララックス 0.18x）
    for (const pil of this.castlePillars) {
      const renderX = pil.x - cameraX * 0.18;
      if (renderX > -80 && renderX < CONSTANTS.CANVAS_WIDTH + 80) {
        ctx.save();
        ctx.translate(renderX, pil.y);

        // 白大理石の柱身
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(-16, 0, 32, 180);
        ctx.fillStyle = '#e9ecef';
        ctx.fillRect(-12, 0, 6, 180);

        // 柱頭（飾り）
        ctx.fillStyle = '#ffd166';
        ctx.fillRect(-22, -10, 44, 12);
        ctx.fillRect(-18, -16, 36, 6);

        // 柱に掲げられた真紅のタペストリー
        ctx.fillStyle = '#9d0208';
        ctx.beginPath();
        ctx.moveTo(-10, 20);
        ctx.lineTo(10, 20);
        ctx.lineTo(10, 110);
        ctx.lineTo(0, 125);
        ctx.lineTo(-10, 110);
        ctx.closePath();
        ctx.fill();

        // タペストリーの金糸紋章
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(0, 55, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // 6. 舞い上がる聖なる光の粒子（スパーク）
    for (const s of this.castleSparks) {
      const renderX = s.x - cameraX * 0.22;
      if (renderX > -10 && renderX < CONSTANTS.CANVAS_WIDTH + 10) {
        ctx.save();
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(renderX, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

// =========================================================================
  // 🧱 近景ブロック・足場描画（星のカービィ Wii デラックス風 2.5D立体キューブ）
  // =========================================================================
  draw(ctx, cameraX) {
    if (this.stageNumber === 1) {
      this.drawGardenBlocks(ctx, cameraX);
    } else if (this.stageNumber === 2) {
      this.drawMallBlocks(ctx, cameraX);
    } else if (this.stageNumber === 3) {
      this.drawClocktowerBlocks(ctx, cameraX);
    } else if (this.stageNumber === 4) {
      this.drawKitchenBlocks(ctx, cameraX);
    } else if (this.stageNumber === 5) {
      this.drawBeachBlocks(ctx, cameraX);
    } else if (this.stageNumber === 6) {
      this.drawGhostBlocks(ctx, cameraX);
    } else if (this.stageNumber === 7) {
      this.drawSpaceBlocks(ctx, cameraX);
    } else {
      this.drawCastleBlocks(ctx, cameraX);
    }
  }

  // 🌟 2.5D共通立体ブロック描画コアエンジン
  draw3DBlockCore(ctx, b, cameraX, topColor, frontColor, edgeHighlight, trimColor, decoCallback = null) {
    const renderX = b.x - cameraX;
    if (renderX + b.width < -60 || renderX > CONSTANTS.CANVAS_WIDTH + 60) return;

    const screenCenterX = CONSTANTS.CANVAS_WIDTH / 2;
    const diffFromCenter = (renderX + b.width / 2) - screenCenterX;
    // 画面中央からのパースペクティブ（透視投影の傾き量: 最大±10px）
    const pX = Math.max(-10, Math.min(10, diffFromCenter * 0.022));

    const topDepth = b.isGround ? 16 : 12; // 上面の奥行き厚み
    const bx = renderX;
    const by = b.y;
    const bw = b.width;
    const bh = b.height;

    ctx.save();

    // 1. 浮遊ブロック直下のアンビエントオクルージョン（底面の浮遊影）
    if (!b.isGround) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.ellipse(bx + bw / 2, by + bh + 4, bw * 0.48, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. 側面（Side Face / 透視投影面）
    if (Math.abs(pX) > 0.8 && !b.isGround) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
      ctx.beginPath();
      if (pX > 0) {
        // 画面右側にあるブロック：左側面が見える
        ctx.moveTo(bx, by);
        ctx.lineTo(bx - pX, by - topDepth * 0.4);
        ctx.lineTo(bx - pX, by + bh - topDepth * 0.4);
        ctx.lineTo(bx, by + bh);
      } else {
        // 画面左側にあるブロック：右側面が見える
        ctx.moveTo(bx + bw, by);
        ctx.lineTo(bx + bw - pX, by - topDepth * 0.4);
        ctx.lineTo(bx + bw - pX, by + bh - topDepth * 0.4);
        ctx.lineTo(bx + bw, by + bh);
      }
      ctx.closePath();
      ctx.fill();
    }

    // 3. 前面（Front Face / 陰影壁面）
    ctx.fillStyle = frontColor;
    ctx.fillRect(bx, by + topDepth, bw, bh - topDepth);

    // 4. 上面（Top Face / 奥行き上面ハイライト）
    const topGrad = ctx.createLinearGradient(0, by, 0, by + topDepth);
    topGrad.addColorStop(0, edgeHighlight);
    topGrad.addColorStop(0.35, topColor);
    topGrad.addColorStop(1, frontColor);
    ctx.fillStyle = topGrad;
    ctx.fillRect(bx, by, bw, topDepth);

    // 上端の極上ハイライト光線（Wiiデラ風シャープエッジ）
    ctx.fillStyle = edgeHighlight;
    ctx.fillRect(bx, by, bw, 2.5);

    // 上面と前面の境界線（立体稜線シャドウ）
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(bx, by + topDepth - 1.5, bw, 2.5);

    // ステージ固有の前面装飾テクスチャ
    if (decoCallback) {
      decoCallback(ctx, bx, by, bw, bh, topDepth);
    }

    // 5. 外周のアニメ調インクライン（くっきりとした黒/濃色輪郭線）
    ctx.strokeStyle = trimColor || 'rgba(20, 20, 30, 0.45)';
    ctx.lineWidth = 2.0;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.restore();
  }

  // ステージ1: 🌸 芝生 ＆ パステル大理石キューブ
  drawGardenBlocks(ctx, cameraX) {
    for (const b of this.blocks) {
      const renderX = b.x - cameraX;
      if (renderX + b.width < -50 || renderX > CONSTANTS.CANVAS_WIDTH + 50) continue;

      if (b.isGround) {
        this.draw3DBlockCore(ctx, b, cameraX, '#85e05d', '#6da34d', '#bbf7a3', 'rgba(40, 70, 25, 0.5)', (c, x, y, w, h, td) => {
          // 芝生下の土層とモコモコ芝生フリル
          c.fillStyle = '#b08968';
          c.fillRect(x, y + td + 14, w, h - td - 14);
          c.fillStyle = '#7f5539';
          c.fillRect(x, y + td + 34, w, h - td - 34);

          // 芝生の波型フリル（立体感強調）
          c.fillStyle = '#6da34d';
          for (let i = 0; i < w; i += 20) {
            c.beginPath();
            c.arc(x + i + 10, y + td + 7, 7, 0, Math.PI);
            c.fill();
          }
        });
      } else {
        // 白大理石の立体浮遊プラットフォーム（余計な装飾丸を撤去したスッキリ優雅な大理石）
        this.draw3DBlockCore(ctx, b, cameraX, '#ffffff', '#e9ecef', '#ffffff', 'rgba(100, 90, 80, 0.4)', null);
      }
    }
  }

  // ステージ2: 🛍️ 光沢チェッカーフロア ＆ ネオングラスキューブ
  drawMallBlocks(ctx, cameraX) {
    for (const b of this.blocks) {
      const renderX = b.x - cameraX;
      if (renderX + b.width < -50 || renderX > CONSTANTS.CANVAS_WIDTH + 50) continue;

      if (b.isGround) {
        this.draw3DBlockCore(ctx, b, cameraX, '#f3e8ff', '#d8b4e2', '#ffffff', 'rgba(80, 30, 110, 0.5)', (c, x, y, w, h, td) => {
          // チェッカー床テクスチャ
          const tileSize = 28;
          for (let tx = 0; tx < w; tx += tileSize) {
            const isAlt = (Math.floor((b.x + tx) / tileSize)) % 2 === 0;
            c.fillStyle = isAlt ? 'rgba(255,255,255,0.45)' : 'rgba(160, 100, 200, 0.35)';
            c.fillRect(x + tx, y, Math.min(tileSize, w - tx), td);
          }
          // ネオンストリップ（ピンク＆シアン）
          c.fillStyle = '#ff007f';
          c.fillRect(x, y + td, w, 4);
          c.fillStyle = '#00f5d4';
          c.fillRect(x, y + td + 4, w, 3);
        });
      } else {
        // ネオンガラスブロック
        this.draw3DBlockCore(ctx, b, cameraX, '#e0fbfc', '#98c1d9', '#ffffff', '#00f5d4', (c, x, y, w, h, td) => {
          c.fillStyle = '#ff007f';
          if (c.roundRect) {
            c.beginPath();
            c.roundRect(x + 6, y + td + 4, w - 12, h - td - 8, 4);
            c.fill();
          } else {
            c.fillRect(x + 6, y + td + 4, w - 12, h - td - 8);
          }
        });
      }
    }
  }

  // ステージ3: 🕰️ 黒大理石 ＆ 真鍮ゴールド歯車キューブ
  drawClocktowerBlocks(ctx, cameraX) {
    for (const b of this.blocks) {
      const renderX = b.x - cameraX;
      if (renderX + b.width < -50 || renderX > CONSTANTS.CANVAS_WIDTH + 50) continue;

      if (b.isGround) {
        this.draw3DBlockCore(ctx, b, cameraX, '#343a40', '#212529', '#ffb703', 'rgba(0,0,0,0.6)', (c, x, y, w, h, td) => {
          // 金箔ストライプボーダー
          c.fillStyle = '#ffb703';
          c.fillRect(x, y + td, w, 4);
          c.fillStyle = '#c99738';
          c.fillRect(x, y + td + 4, w, 3);
        });
      } else {
        // 真鍮と歯車のスチームパンクブロック
        this.draw3DBlockCore(ctx, b, cameraX, '#ffd166', '#b5832a', '#fff3b0', '#ffb703', (c, x, y, w, h, td) => {
          // 歯車レリーフ
          c.fillStyle = '#7a5416';
          c.beginPath();
          c.arc(x + w / 2, y + td + (h - td) / 2, 7, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#ffd166';
          c.beginPath();
          c.arc(x + w / 2, y + td + (h - td) / 2, 3, 0, Math.PI * 2);
          c.fill();
        });
      }
    }
  }

  // ステージ4: 🍣 檜カウンター ＆ 朱塗り漆器キューブ
  drawKitchenBlocks(ctx, cameraX) {
    for (const b of this.blocks) {
      const renderX = b.x - cameraX;
      if (renderX + b.width < -50 || renderX > CONSTANTS.CANVAS_WIDTH + 50) continue;

      if (b.isGround) {
        this.draw3DBlockCore(ctx, b, cameraX, '#ffcc80', '#c67c3b', '#ffe0b2', '#7a4216', (c, x, y, w, h, td) => {
          // 檜の木目スリット
          c.fillStyle = 'rgba(122, 66, 22, 0.25)';
          for (let tx = 18; tx < w; tx += 28) {
            c.fillRect(x + tx, y + td, 2, h - td);
          }
        });
      } else {
        // 朱塗り漆器ブロック
        this.draw3DBlockCore(ctx, b, cameraX, '#e63946', '#9d0208', '#ff758f', '#6a040f', (c, x, y, w, h, td) => {
          // 金彩ボーダー
          c.fillStyle = '#ffd166';
          c.fillRect(x + 4, y + td + 3, w - 8, 3);
        });
      }
    }
  }

  // ステージ5: 🏖️ ビーチサンシャイン ＆ リゾートウッドデッキ
  drawBeachBlocks(ctx, cameraX) {
    for (const b of this.blocks) {
      const renderX = b.x - cameraX;
      if (renderX + b.width < -50 || renderX > CONSTANTS.CANVAS_WIDTH + 50) continue;

      if (b.isGround) {
        this.draw3DBlockCore(ctx, b, cameraX, '#fff3b0', '#dda15e', '#ffffff', '#bc6c25', (c, x, y, w, h, td) => {
          // 濡れ砂グラデーション
          c.fillStyle = '#bc6c25';
          c.fillRect(x, y + td + 12, w, h - td - 12);
        });
      } else {
        // ミントリゾートウッドデッキ
        this.draw3DBlockCore(ctx, b, cameraX, '#81ecec', '#00cec9', '#dff9fb', '#0984e3', (c, x, y, w, h, td) => {
          c.fillStyle = 'rgba(255, 255, 255, 0.4)';
          c.fillRect(x + 4, y + td + 3, w - 8, 2);
        });
      }
    }
  }

  // ステージ6: 👻 ゴシック敷石 ＆ エメラルド霊魂キューブ
  drawGhostBlocks(ctx, cameraX) {
    for (const b of this.blocks) {
      const renderX = b.x - cameraX;
      if (renderX + b.width < -50 || renderX > CONSTANTS.CANVAS_WIDTH + 50) continue;

      if (b.isGround) {
        this.draw3DBlockCore(ctx, b, cameraX, '#6c5ce7', '#4834d4', '#a29bfe', '#221e3f', (c, x, y, w, h, td) => {
          c.fillStyle = '#130f40';
          c.fillRect(x, y + td + 16, w, h - td - 16);
        });
      } else {
        // エメラルドゴーストブロック
        this.draw3DBlockCore(ctx, b, cameraX, '#55efc4', '#00b894', '#c7ecee', '#006266');
      }
    }
  }

  // ステージ7: 🚀 コズミックチタン ＆ サイバーソーラーキューブ
  drawSpaceBlocks(ctx, cameraX) {
    for (const b of this.blocks) {
      const renderX = b.x - cameraX;
      if (renderX + b.width < -50 || renderX > CONSTANTS.CANVAS_WIDTH + 50) continue;

      if (b.isGround) {
        this.draw3DBlockCore(ctx, b, cameraX, '#dfe6e9', '#636e72', '#ffffff', '#2d3436', (c, x, y, w, h, td) => {
          // シアンLEDライン
          c.fillStyle = '#00f5d4';
          c.fillRect(x, y + td + 2, w, 3);
        });
      } else {
        // ネオンブルーソーラーパネル
        this.draw3DBlockCore(ctx, b, cameraX, '#74b9ff', '#0984e3', '#e0fbfc', '#00cec9', (c, x, y, w, h, td) => {
          // ソーラーセルグリッド
          c.fillStyle = 'rgba(255, 255, 255, 0.4)';
          for (let tx = 8; tx < w; tx += 16) {
            c.fillRect(x + tx, y + td + 2, 2, h - td - 4);
          }
        });
      }
    }
  }

  // ステージ8: 👑 天空城・神聖黄金大理石キューブ
  drawCastleBlocks(ctx, cameraX) {
    for (const b of this.blocks) {
      const renderX = b.x - cameraX;
      if (renderX + b.width < -50 || renderX > CONSTANTS.CANVAS_WIDTH + 50) continue;

      if (b.isGround) {
        this.draw3DBlockCore(ctx, b, cameraX, '#fff9e6', '#e0a96d', '#ffffff', '#b07d3b', (c, x, y, w, h, td) => {
          // 黄金装飾ボーダー
          c.fillStyle = '#ffd166';
          c.fillRect(x, y + td, w, 4);
          c.fillStyle = '#c99738';
          c.fillRect(x, y + td + 4, w, 3);
        });
      } else {
        // 神聖天空宮殿ブロック（純白大理石 ＆ 真紅タペストリーライン）
        this.draw3DBlockCore(ctx, b, cameraX, '#ffffff', '#ffd166', '#ffffff', '#c99738', (c, x, y, w, h, td) => {
          c.fillStyle = '#9d0208';
          c.fillRect(x + 4, y + td + 3, w - 8, 3);
        });
      }
    }
  }
}

window.Stage = Stage;
