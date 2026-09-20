// src/constants.js - ゲーム全体の定数およびパラメータ設定

const CONSTANTS = {
  // 画面解像度（16:9比率）
  CANVAS_WIDTH: 960,
  CANVAS_HEIGHT: 540,

  // 🌟 星のカービィ風ポップ丸ゴシック設定（Fredoka ＆ M PLUS Rounded 1c）
  FONT_FAMILY: "'Fredoka', 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', 'Yu Gothic UI', sans-serif",
  getFont(size, weight = 'bold') {
    return `${weight} ${size}px ${CONSTANTS.FONT_FAMILY}`;
  },

  // 物理エンジンパラメータ（キビキビ爽快アクション調整済み）
  GRAVITY: 0.72,
  FRICTION: 0.70,

  // プレイヤー基本性能
  PLAYER: {
    WIDTH: 52,
    HEIGHT: 52,
    MOVE_SPEED: 6.2,         // 💨 キビキビ爽快スピード（4.8からアップ）
    JUMP_FORCE: -14.6,       // 🦘 一定ジャンプ初速（ボタンの長さに連動せず常に一定の快適な跳躍）
    BOUNCE_FORCE: -11.8,     // 敵を踏んだ時のバウンド跳躍力
    MAX_HP: 5,               // 子供向け安心設計：ハート5個
    INVINCIBLE_TIME: 90,     // 被ダメージ後の無敵点滅フレーム数 (約1.5秒)
    ATTACK_DURATION: 15,     // ひっかき攻撃の持続フレーム数
    ATTACK_RANGE_X: 58,      // ひっかき攻撃の前方判定幅
    ATTACK_RANGE_Y: 42,      // ひっかき攻撃の縦判定幅
    FEVER_DURATION: 600,     // またたびフィーバー持続時間 (10秒間: 60fps × 10)
    FEVER_SPEED_MULT: 1.38   // フィーバー時の移動速度倍率
  },

  // ボス設定
  BOSS: {
    WIDTH: 110,
    HEIGHT: 110,
    MAX_HP: 10,              // ボスHP (ステージ1 & 2)
    FINAL_MAX_HP: 14,        // ラスボスHP (ステージ3)
    FLOAT_SPEED: 0.048,      // 浮遊アニメーション速度
    ATTACK_INTERVAL: 110     // 攻撃発射間隔フレーム（テンポよく爽快なバトル）
  },

  // 🌟 ステージ規模・エリア定数（大幅延長：道中4150px ＆ ボスアリーナ4150〜5100px）
  STAGE_CONFIG: {
    WIDTH: 5100,             // ステージ総幅（従来の3050から5100へ大幅拡張）
    BOSS_WALL_X: 4150,       // ボス突入壁のX座標（道中約4150px）
    BOSS_START_X: 4600       // ボス初期配置X座標
  },

  // 🌟 パワーアップアイテム定数（10秒限定：火力増強＆2方向発射）
  POWERUP: {
    DURATION: 600,           // 10秒間（60fps × 10）
    WARN_TIME: 180,          // 終了前点滅警告フレーム（約3秒）
    TYPES: {
      FIRE: 'fire',          // 🌶️ パワーチリ（火力増強：攻撃力2倍＋攻撃判定1.5倍＋紅蓮の炎オーラ）
      TWIN: 'twin'           // ⭐ ツインスター（2方向発射：前方＋斜め上同時ショット）
    }
  },

  // 🌟 ラスボス限定：奇跡の再生・スーパー覚醒システム定数
  SUPER_REVIVAL: {
    INVINCIBLE_TIME: 180,    // 覚醒後無敵フレーム（約3秒間）
    SPEED_MULT: 1.20,        // 移動速度倍率（1.2倍）
    JUMP_MULT: 1.08,         // ジャンプ力倍率（1.08倍）
    DAMAGE_MULT: 2.0,        // 通常攻撃・近接攻撃力倍率（2倍）
    MAX_CHARGE: 90,          // 溜めMAX時間（通常の180から90へ半減＝2倍速チャージ）
    MID_CHARGE: 30,          // 中チャージ時間（通常60から30へ半減）
    FREEZE_TIME: 45,         // ドラマティック・タイムストップ時間（約0.75秒）
    CUTIN_DURATION: 150      // 覚醒カットイン表示フレーム数（2.5秒）
  },

  // 全8ステージ情報定義
  TOTAL_STAGES: 8,
  STAGES: {
    1: {
      id: 1,
      name: 'ステージ 1',
      title: 'ゴージャス大豪邸ガーデン',
      subtitle: 'おしゃまなぜいたくボスねこをやっつけろ！',
      theme: 'garden',
      bgm: 'stage',
      bossBgm: 'boss'
    },
    2: {
      id: 2,
      name: 'ステージ 2',
      title: 'ネオン・ショッピングモール',
      subtitle: 'お買い物暴走レディ・ミャウミャウをやっつけろ！',
      theme: 'mall',
      bgm: 'stage2',
      bossBgm: 'boss2'
    },
    3: {
      id: 3,
      name: 'ステージ 3',
      title: '最上階ペントハウス・時計塔',
      subtitle: '街の黒幕・ドン・ニャルレオーネとの前哨戦！',
      theme: 'clocktower',
      bgm: 'stage3',
      bossBgm: 'boss3'
    },
    4: {
      id: 4,
      name: 'ステージ 4',
      title: '激闘！グルメ寿司屋敷＆厨房',
      subtitle: '暴走板前ニャン八をやっつけろ！',
      theme: 'kitchen',
      bgm: 'stage4',
      bossBgm: 'boss4'
    },
    5: {
      id: 5,
      name: 'ステージ 5',
      title: 'トロピカル・キャットビーチ',
      subtitle: 'サーフ番長ニャロハをやっつけろ！',
      theme: 'beach',
      bgm: 'stage5',
      bossBgm: 'boss5'
    },
    6: {
      id: 6,
      name: 'ステージ 6',
      title: '妖怪・ゴーストキャットマンション',
      subtitle: '魔術師ファントム・ニャンをやっつけろ！',
      theme: 'ghost',
      bgm: 'stage6',
      bossBgm: 'boss6'
    },
    7: {
      id: 7,
      name: 'ステージ 7',
      title: 'コズミック・キャットスペース',
      subtitle: '宇宙皇帝ニャイザー総統をやっつけろ！',
      theme: 'space',
      bgm: 'stage7',
      bossBgm: 'boss7'
    },
    8: {
      id: 8,
      name: 'ファイナルステージ',
      title: '真・天空キャッスル',
      subtitle: '覚醒真ボス ドン・ニャルレオーネとの最終決戦！',
      theme: 'castle',
      bgm: 'stage8',
      bossBgm: 'boss8'
    }
  },

  // カラーパレット（全8ステージ対応）
  COLORS: {
    // ステージ1（大豪邸ガーデン）
    SKY_TOP: '#d4f0ff',
    SKY_BOTTOM: '#edf8ff',
    CLOUD: '#ffffff',
    GRASS_TOP: '#88d87a',
    GRASS_BODY: '#68ba5a',
    DIRT: '#d29665',
    BLOCK_MARBLE: '#f4f0ec',
    BLOCK_BORDER: '#c8b6a6',
    FLOWER_PINK: '#ff9ebb',
    FLOWER_YELLOW: '#ffe17d',
    HEART_RED: '#ff4d6d',
    HEART_BG: '#ffd1dc',
    GOLD_COIN: '#ffc83b',
    CATNIP: '#70e0a5',

    // ステージ2（ネオンモール）
    MALL_SKY_TOP: '#1a0933',
    MALL_SKY_BOTTOM: '#3d1255',
    MALL_NEON_PINK: '#ff007f',
    MALL_NEON_CYAN: '#00f5d4',
    MALL_FLOOR_A: '#f0e6f6',
    MALL_FLOOR_B: '#d7c0e8',

    // ステージ3（時計塔ペントハウス）
    TOWER_SKY_TOP: '#0b0c1e',
    TOWER_SKY_BOTTOM: '#1b1d36',
    TOWER_GOLD: '#ffb703',
    TOWER_BRASS: '#c99738',
    TOWER_MARBLE: '#2b2d42',

    // ステージ4（グルメ寿司屋敷＆厨房）
    KITCHEN_SKY_TOP: '#fff5e6',
    KITCHEN_SKY_BOTTOM: '#ffe0b2',
    KITCHEN_WOOD: '#8d6e4c',
    KITCHEN_WOOD_DARK: '#5c4033',
    KITCHEN_LANTERN: '#ff3b30',
    KITCHEN_STEAM: 'rgba(255, 255, 255, 0.5)',

    // ステージ5（トロピカルビーチ）
    BEACH_SKY_TOP: '#00b4d8',
    BEACH_SKY_BOTTOM: '#90e0ef',
    BEACH_SAND: '#f4e8c1',
    BEACH_SAND_WET: '#d4c5a0',
    BEACH_OCEAN: '#0077b6',
    BEACH_WAVE: '#48cae4',
    BEACH_PALM: '#2d6a4f',

    // ステージ6（ゴーストマンション）
    GHOST_SKY_TOP: '#1a0a2e',
    GHOST_SKY_BOTTOM: '#2d1b4e',
    GHOST_WALL: '#3c2f4e',
    GHOST_WALL_DARK: '#261a38',
    GHOST_FLAME: '#7df9ff',
    GHOST_FOG: 'rgba(180, 160, 220, 0.3)',

    // ステージ7（コズミックスペース）
    SPACE_BG_TOP: '#020024',
    SPACE_BG_BOTTOM: '#090979',
    SPACE_NEBULA_A: '#4a0e6b',
    SPACE_NEBULA_B: '#0e4a6b',
    SPACE_STAR: '#ffffff',
    SPACE_PLATFORM: '#3a4a6b',

    // ステージ8（天空キャッスル）
    CASTLE_SKY_TOP: '#ff6b35',
    CASTLE_SKY_BOTTOM: '#ffd166',
    CASTLE_GOLD: '#ffd700',
    CASTLE_MARBLE: '#f5f0e8',
    CASTLE_CRIMSON: '#9b111e',
    CASTLE_AURORA_A: '#7df9ff',
    CASTLE_AURORA_B: '#ff69b4'
  },

  // 🐾 キャラクター設定（ねこ ＆ おにぎり）
  CHARACTERS: {
    cat: {
      id: 'cat',
      name: 'ねこ',
      icon: '🐾',
      fullName: '🐾 ねこ',
      title: 'すばやい冒険ネコちゃん',
      attackName: '🐾 ひっかき / 肉球波動拳 (Z)',
      description: '【スピード＆近接万能】 ひっかきコンボ ＆ 肉球波動拳！',
      detail: '身軽なステップで跳びまわる元気なにゃんこ。近接ひっかき攻撃が得意で、Zキー長押しで強力な肉球波動拳（ニャドウケン！）を放ちます！',
      themeColor: '#ff4d6d',
      subColor: '#ff9ebb',
      bulletName: '肉球波動拳'
    },
    onigiri: {
      id: 'onigiri',
      name: 'おにぎり',
      icon: '🍙',
      fullName: '🍙 おにぎり',
      title: 'もちもち愛されおにぎり',
      attackName: '🍙 梅干し投げ / 特選梅干しボム (Z)',
      description: '【遠距離＆広範囲】 梅干しショット ＆ 特製南高梅ボム！',
      detail: 'つぶらな瞳とほんのり赤ほっぺが自慢のおにぎり。Zキー即押しで梅干しを軽快に投げ、3秒長押しで敵を貫通する超特大・黄金紀州南高梅ボムを発射します！',
      themeColor: '#e63946',
      subColor: '#ffd1dc',
      bulletName: '梅干し'
    }
  }
};

window.CONSTANTS = CONSTANTS;
