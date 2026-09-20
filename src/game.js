// src/game.js - 🎬 たけしディレクター 統括：全3ステージ進行＆ボス会話＆エンディング大パレード対応

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = CONSTANTS.CANVAS_WIDTH;
    this.canvas.height = CONSTANTS.CANVAS_HEIGHT;

    // ゲームステート: 'TITLE', 'CHAR_SELECT', 'PLAYING', 'BOSS_INTRO', 'BOSS_BATTLE', 'STAGE_CLEAR', 'ALL_STAGE_CLEAR', 'GAME_OVER'
    this.state = 'TITLE';

    // 🐾 選択キャラクター ('cat' または 'onigiri')
    this.selectedCharacter = 'cat';
    this.cursorCharacter = 'cat'; // キャラセレクト画面での選択カーソル

    // 現在のステージ (1, 2, 3)
    this.currentStage = 1;
    this.stageBannerTimer = 0;
    this.controlGuideTimer = 0; // ステージ1開始時のミニ操作ガイド用タイマー

    // 各ステージ ＆ キャラクター別ボス会話データ
    this.allDialogs = {
      cat: {
        1: [
          {
            speaker: '👑 おしゃまなぜいたくボスねこ',
            text: '「ふふん！ボクの黄金たい焼きスナックと大豪邸は誰にも渡さないニャ！あっかんべー！」',
            color: '#ff4d6d'
          },
          {
            speaker: '🐾 主人公ネコちゃん',
            text: '「街のみんなの広場を占領しちゃダメニャ！そのたい焼き、ぜんぶ返してもらうニャ！」',
            color: '#ffb703'
          }
        ],
        2: [
          {
            speaker: '🛍️ 暴走セレブねこ レディ・ミャウミャウ',
            text: '「オホホホ！このモールの新作ブランドと高級ツナは全部アタクシのものよ！邪魔する子はカートで轢いちゃうニャ！」',
            color: '#ff007f'
          },
          {
            speaker: '🐾 主人公ネコちゃん',
            text: '「買い占めは迷惑ニャ！みんなでお買い物するから楽しいニャ！目を覚ますニャ！」',
            color: '#00f5d4'
          }
        ],
        3: [
          {
            speaker: '🎩 街の黒幕 ドン・ニャルレオーネ',
            text: '「フッ…よくぞこの最上階時計塔まで辿り着いたな、白猫の小僧。だがここは通過点に過ぎんぞ！」',
            color: '#9b111e'
          },
          {
            speaker: '🐾 主人公ネコちゃん',
            text: '「街のみんなを苦しめる悪だくみはここで止めるニャ！覚悟ニャ！」',
            color: '#ffd166'
          }
        ],
        4: [
          {
            speaker: '🏮 暴走板前 ニャン八',
            text: '「へいらっしゃい！ウチの極上サーモン握りはネコには食わせねえニャ！包丁のサビにしてやるぜ！」',
            color: '#ff3b30'
          },
          {
            speaker: '🐾 主人公ネコちゃん',
            text: '「お魚もお寿司も大好きだけど、お店を荒らしちゃダメニャ！成敗するニャ！」',
            color: '#ffd166'
          }
        ],
        5: [
          {
            speaker: '🐚 サーフ番長 ニャロハ',
            text: '「アロハ〜！この常夏の波とビーチはオレ様だけのものニャ！水鉄砲でびしょ濡れにしてやるぜ！」',
            color: '#0077b6'
          },
          {
            speaker: '🐾 主人公ネコちゃん',
            text: '「水はちょっと苦手だけど…みんなの海を守るためなら立ち向かうニャ！覚悟ニャ！」',
            color: '#00f5d4'
          }
        ],
        6: [
          {
            speaker: '🎩 魔術師 ファントム・ニャン',
            text: '「フフフ…このゴーストマンションへようこそ。闇のイリュージョンで消え去るがいいニャ…！」',
            color: '#7df9ff'
          },
          {
            speaker: '🐾 主人公ネコちゃん',
            text: '「オバケなんて怖くないニャ！街のみんなを驚かすイタズラはやめるニャ！」',
            color: '#ffb703'
          }
        ],
        7: [
          {
            speaker: '👽 宇宙皇帝 ニャイザー総統',
            text: '「フハハハ！地球の小さなネコ風情が我がコズミックステーションまで来るとは！星屑にしてやろう！」',
            color: '#ff007f'
          },
          {
            speaker: '🐾 主人公ネコちゃん',
            text: '「宇宙から街を狙うなんて許さないニャ！肉球波動拳で宇宙の果てまで吹っ飛ばすニャ！」',
            color: '#ffd166'
          }
        ],
        8: [
          {
            speaker: '👑 覚醒真ボス ドン・ニャルレオーネ',
            text: '「グハハハ！我が天空キャッスルへよくぞ来た！だが前哨戦とはわけが違うぞ…真の支配を見よ！」',
            color: '#ffd700'
          },
          {
            speaker: '🐾 主人公ネコちゃん',
            text: '「これが本当の最後の戦いニャ！みんなの笑顔と平和な街を、ぜったいに取り戻すニャーーッ！」',
            color: '#ff4d6d'
          }
        ]
      },
      onigiri: {
        1: [
          {
            speaker: '👑 おしゃまなぜいたくボスねこ',
            text: '「ふふん！黄金たい焼きは渡さないニャ！…って、なんだその美味しそうなおにぎりは！？」',
            color: '#ff4d6d'
          },
          {
            speaker: '🍙 おにぎり',
            text: '「たい焼きもいいけど、お米と梅干しの美味しさも忘れないでほしいむすび！広場をみんなに返すんだむすび！」',
            color: '#ff4d6d'
          }
        ],
        2: [
          {
            speaker: '🛍️ 暴走セレブねこ レディ・ミャウミャウ',
            text: '「オホホホ！高級ツナは全部アタクシのものよ！…あら新米のおにぎりちゃん？ツナマヨの具にしてあげるわ！」',
            color: '#ff007f'
          },
          {
            speaker: '🍙 おにぎり',
            text: '「買い占めは迷惑むすび！みんなで仲良く分け合うから美味しいんだむすび！特製梅干しショット受けてみろー！」',
            color: '#ff4d6d'
          }
        ],
        3: [
          {
            speaker: '🎩 街の黒幕 ドン・ニャルレオーネ',
            text: '「フッ…最上階時計塔までよく来たな。まさかネコではなく、おにぎり風情が我が支配に立ち向かうとはな…」',
            color: '#9b111e'
          },
          {
            speaker: '🍙 おにぎり',
            text: '「どんな強いボスでも、あったかいお米と特選南高梅の愛で平和を取り戻すむすび！覚悟むすび！」',
            color: '#ff4d6d'
          }
        ],
        4: [
          {
            speaker: '🏮 暴走板前 ニャン八',
            text: '「なんだいその白米のかたまりは！寿司のシャリにして酢飯漬けにしてやるニャ！」',
            color: '#ff3b30'
          },
          {
            speaker: '🍙 おにぎり',
            text: '「お米のプロとして言わせてもらうむすび！そのシャリへの愛が足りないむすび！特製梅干しをくらえー！」',
            color: '#ff4d6d'
          }
        ],
        5: [
          {
            speaker: '🐚 サーフ番長 ニャロハ',
            text: '「ヘイ！砂浜に美味しそうなおにぎりが落ちてるぜ！波にさらわれて海苔フヤフヤになりな！」',
            color: '#0077b6'
          },
          {
            speaker: '🍙 おにぎり',
            text: '「海苔がふやけちゃうのは困るむすび！でも特製梅干しで熱中症対策はバッチリむすび！いざ勝負むすび！」',
            color: '#ff4d6d'
          }
        ],
        6: [
          {
            speaker: '🎩 魔術師 ファントム・ニャン',
            text: '「ホホホ…まさか幽霊屋敷におにぎりが迷い込むとはね。お供え物にしてあげましょう…！」',
            color: '#7df9ff'
          },
          {
            speaker: '🍙 おにぎり',
            text: '「お供え物じゃないむすび！オバケもびっくりする黄金南高梅の酸っぱさを見せてやるむすび！」',
            color: '#ff4d6d'
          }
        ],
        7: [
          {
            speaker: '👽 宇宙皇帝 ニャイザー総統',
            text: '「未知の三角生命体を発見…我が宇宙食サンプルとして冷凍保存してくれる！」',
            color: '#ff007f'
          },
          {
            speaker: '🍙 おにぎり',
            text: '「宇宙食になんかされないむすび！銀河を照らす紀州南高梅の底力、思い知るがいいむすび！」',
            color: '#ff4d6d'
          }
        ],
        8: [
          {
            speaker: '👑 覚醒真ボス ドン・ニャルレオーネ',
            text: '「おにぎり小僧…貴様がここまで来るとはな。だがこの天空城の王冠は誰にも渡さん！」',
            color: '#ffd700'
          },
          {
            speaker: '🍙 おにぎり',
            text: '「どんな強い闇でも、あったかいお米と梅干しの真心が勝つむすび！全ステージ制覇だむすびーーッ！」',
            color: '#ff4d6d'
          }
        ]
      }
    };

    this.introStep = 0;
    this.introDialogs = this.allDialogs.cat[1];

    // 入力状態
    this.inputs = { left: false, right: false, jump: false, attack: false };

    this.cameraX = 0;
    this.score = 0;
    this.paradeTimer = 0;

    // 🌟 タイトル画面キービジュアル一枚絵の読み込み
    this.titleBgImg = new Image();
    this.titleBgLoaded = false;
    this.titleBgImg.onload = () => { this.titleBgLoaded = true; };
    this.titleBgImg.src = 'assets/title_key_visual.jpg';

    // 🎊 エンディング祝祭大パレード一枚絵の読み込み
    this.endingBgImg = new Image();
    this.endingBgLoaded = false;
    this.endingBgImg.onload = () => { this.endingBgLoaded = true; };
    this.endingBgImg.src = 'assets/ending_visual.jpg';

    // 🎬 ボス登場シネマティック演出プロパティ（たけし・こけし・かなで・できすぎ監修）
    this.timeScale = 1.0;
    this.bossIntroPhase = 'NONE'; // 'NONE', 'SILENCE', 'SLOW', 'IMPACT', 'DIALOG'
    this.bossIntroTimer = 0;
    this.bossIntroHeartbeats = 0;
    this.bossIntroImpactFired = false;
    this.whiteFlash = 0.0;
    this.screenShake = 0.0;
    this.letterboxH = 0.0;
    this.bossCutinProgress = 0.0;

    // 🌟 奇跡の再生・スーパー覚醒演出タイマー
    this.superRevivalFreezeTimer = 0;
    this.superCutInTimer = 0;

    // 🏆 ハイスコア・ランキング管理
    this.highScore = 0;
    this.bestStage = 1;
    this.isNewHighScore = false;
    if (typeof window !== 'undefined' && window.rankingManager) {
      const localData = window.rankingManager.getLocalData();
      this.highScore = localData.highScore;
      this.bestStage = localData.bestStage;
    }

    // ⚡ 一般公開・デバッグモード制御（URLパラメータ ?debug=1 または Shift+D で切替）
    const isDebugParam = (typeof window !== 'undefined' && window.location && window.location.search.includes('debug=1'));
    this.debugMode = isDebugParam;
    this.applyDebugVisibility();

    // 🏆 ヘッダーランキングボタンの接続
    const headerRankingBtn = (typeof document !== 'undefined') ? document.getElementById('btnOpenRankingHeader') : null;
    if (headerRankingBtn) {
      headerRankingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.currentTarget.blur();
        if (window.rankingManager) {
          window.rankingManager.showRankingModal();
        }
      });
    }

    this.gameOverSessionId = null;
    this.hasSubmittedGameOver = false;

    this.setupInputs();
    this.initGame(1, false);

    // 🎊 エンディング直行パラメータ (?ending=1)
    const isEndingParam = (typeof window !== 'undefined' && window.location && window.location.search.includes('ending=1'));
    if (isEndingParam) {
      this.startEnding();
    }

    // 安定60Hz固定ステップ・ループ制御 ＆ FPSカウンター初期化
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.fps = 60;
    this.frameCount = 0;
    this.fpsTimer = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  // =========================================================================
  // 🎮 ゲーム初期化＆ステージ構築
  // =========================================================================
  initGame(stageNum = 1, preserveScore = false) {
    this.currentStage = stageNum;
    this.stage = new Stage(stageNum);
    this.player = new Player(60, 390, this.selectedCharacter);
    this.gameOverSessionId = null;
    this.hasSubmittedGameOver = false;

    if (!preserveScore) {
      this.score = 0;
      this.isNewHighScore = false;
    }

    this.stageBannerTimer = 180; // 3秒間ステージ名バナー表示
    this.controlGuideTimer = (stageNum === 1) ? 260 : 0; // ステージ1開始時のみ約4.3秒間ミニ操作ガイド表示
    this.introStep = 0;
    const charDialogs = this.allDialogs[this.selectedCharacter] || this.allDialogs.cat;
    this.introDialogs = charDialogs[stageNum] || charDialogs[1];

    // 各ステージごとの敵＆ボス＆アイテム配置
    if (stageNum === 1) {
      // ステージ1: 豪邸ガーデン
      this.boss = new LuxuryBossCat(4600, 190);
      this.enemies = [
        new ButlerMouse(240, 420, 70),
        new ButlerMouse(680, 420, 70),
        new ButlerMouse(670, 285, 25),
        new ButlerMouse(1260, 420, 70),
        new ButlerMouse(1250, 280, 25),
        new ButlerMouse(1820, 420, 70),
        new ButlerMouse(1810, 280, 25),
        new ButlerMouse(2400, 420, 70),
        new ButlerMouse(2400, 280, 25),
        new ButlerMouse(2980, 420, 70),
        new ButlerMouse(3580, 420, 70),
        new ButlerMouse(3580, 280, 25)
      ];
      this.items = [
        new Coin(220, 360), new Coin(260, 360),
        new Coin(445, 320), new Coin(485, 320),
        new Coin(650, 270), new Coin(820, 210),
        new Coin(1025, 315), new Coin(1065, 315),
        new Coin(1230, 265), new Coin(1400, 210),
        new Coin(1585, 315), new Coin(1625, 315),
        new Coin(1790, 265), new Coin(1970, 210),
        new Coin(2185, 315), new Coin(2225, 315),
        new Coin(2380, 265), new Coin(2550, 210),
        new Coin(2755, 315), new Coin(2795, 315),
        new Coin(2960, 265), new Coin(3150, 210),
        new Coin(3350, 315), new Coin(3390, 315),
        new Coin(3560, 265), new Coin(3750, 210),
        new Coin(4025, 315),
        new Coin(4320, 340), new Coin(4720, 340),
        new FishHeal(1230, 265),
        new FishHeal(2380, 265),
        new FishHeal(3560, 265),
        new Catnip(2500, 420)               // 🥫 奇数ステージ限定: 無敵マグロ缶
      ];
    } else if (stageNum === 2) {
      // ステージ2: ネオン・ショッピングモール
      this.boss = new ShoppingBossCat(4600, 190);
      this.enemies = [
        new CartMouse(200, 420, 65),
        new CartMouse(640, 420, 70),
        new CartMouse(590, 280, 25),
        new CartMouse(1170, 420, 70),
        new CartMouse(1130, 270, 25),
        new CartMouse(1700, 420, 70),
        new CartMouse(1660, 270, 25),
        new CartMouse(2240, 420, 70),
        new CartMouse(2200, 270, 25),
        new CartMouse(2770, 420, 70),
        new CartMouse(3300, 420, 70),
        new CartMouse(3820, 420, 60)
      ];
      this.items = [
        new Coin(200, 360), new Coin(240, 360),
        new Coin(385, 320), new Coin(425, 320),
        new Coin(580, 265), new Coin(750, 205),
        new Coin(915, 315), new Coin(955, 315),
        new Coin(1120, 255), new Coin(1290, 185),
        new Coin(1435, 315), new Coin(1475, 315),
        new Coin(1650, 255), new Coin(1830, 185),
        new Coin(1980, 315), new Coin(2020, 315),
        new Coin(2190, 255), new Coin(2360, 185),
        new Coin(2510, 315), new Coin(2550, 315),
        new Coin(2720, 260), new Coin(2900, 190),
        new Coin(3050, 315), new Coin(3090, 315),
        new Coin(3260, 255), new Coin(3430, 185),
        new Coin(3570, 315), new Coin(3760, 260),
        new Coin(4035, 315),
        new Coin(4300, 340), new Coin(4700, 340),
        new FishHeal(1120, 255),
        new FishHeal(2190, 255),
        new FishHeal(3300, 420),
        // 🥫 Catnipなし（偶数ステージ）
        new PowerChili(1830, 185)           // 🌶️ 2階ブティックの火力増強
      ];
    } else if (stageNum === 3) {
      // ステージ3: 最上階ペントハウス・時計塔
      this.boss = new GodfatherBossCat(4600, 180);
      this.enemies = [
        new ClockMouse(200, 420, 65),
        new ClockMouse(630, 420, 70),
        new ClockMouse(580, 270, 25),
        new ClockMouse(1160, 420, 70),
        new ClockMouse(1110, 270, 25),
        new ClockMouse(1700, 420, 70),
        new ClockMouse(1640, 270, 25),
        new ClockMouse(2230, 420, 70),
        new ClockMouse(2180, 270, 25),
        new ClockMouse(2770, 420, 70),
        new ClockMouse(3310, 420, 70),
        new ClockMouse(3820, 420, 60)
      ];
      this.items = [
        new Coin(200, 360), new Coin(240, 360),
        new Coin(380, 320), new Coin(420, 320),
        new Coin(570, 255), new Coin(730, 185),
        new Coin(900, 315), new Coin(940, 315),
        new Coin(1100, 255), new Coin(1270, 175),
        new Coin(1430, 315), new Coin(1470, 315),
        new Coin(1630, 255), new Coin(1800, 180),
        new Coin(1960, 315), new Coin(2000, 315),
        new Coin(2170, 255), new Coin(2340, 180),
        new Coin(2500, 315), new Coin(2540, 315),
        new Coin(2710, 255), new Coin(2890, 175),
        new Coin(3040, 315), new Coin(3080, 315),
        new Coin(3250, 255), new Coin(3420, 180),
        new Coin(3580, 315), new Coin(3770, 255),
        new Coin(4035, 315),
        new Coin(4300, 335), new Coin(4720, 335),
        new FishHeal(1100, 255),
        new FishHeal(2170, 255),
        new FishHeal(3310, 420),
        new Catnip(2230, 420),              // 🥫 奇数ステージ限定: 無敵マグロ缶
        new TwinStar(1800, 180)             // ⭐ 大時計梁のツインスター
      ];
    } else if (stageNum === 4) {
      // ステージ4: 激闘！グルメ寿司屋敷＆厨房
      this.boss = new ChefBossCat(4600, 190);
      this.enemies = [
        new ChefMouse(200, 420, 65),
        new ChefMouse(650, 420, 70),
        new ChefMouse(600, 275, 25),
        new ChefMouse(1180, 420, 70),
        new ChefMouse(1130, 270, 25),
        new ChefMouse(1710, 420, 70),
        new ChefMouse(1670, 270, 25),
        new ChefMouse(2250, 420, 70),
        new ChefMouse(2210, 270, 25),
        new ChefMouse(2780, 420, 70),
        new ChefMouse(3320, 420, 70),
        new ChefMouse(3820, 420, 60)
      ];
      this.items = [
        new Coin(200, 360), new Coin(240, 360),
        new Coin(390, 320), new Coin(430, 320),
        new Coin(590, 260), new Coin(760, 190),
        new Coin(920, 315), new Coin(960, 315),
        new Coin(1120, 255), new Coin(1300, 180),
        new Coin(1450, 315), new Coin(1490, 315),
        new Coin(1660, 255), new Coin(1830, 180),
        new Coin(1980, 315), new Coin(2020, 315),
        new Coin(2200, 255), new Coin(2370, 180),
        new Coin(2520, 315), new Coin(2560, 315),
        new Coin(2730, 255), new Coin(2910, 180),
        new Coin(3060, 315), new Coin(3100, 315),
        new Coin(3270, 255), new Coin(3440, 180),
        new Coin(3590, 315), new Coin(3780, 260),
        new Coin(4035, 315),
        new Coin(4310, 340), new Coin(4710, 340),
        new FishHeal(1120, 255),
        new FishHeal(2200, 255),
        new FishHeal(3320, 420),
        // 🥫 Catnipなし（偶数ステージ）
        new PowerChili(1830, 180)           // 🌶️ 特選激辛チリ
      ];
    } else if (stageNum === 5) {
      // ステージ5: トロピカル・キャットビーチ
      this.boss = new SurfBossCat(4600, 190);
      this.enemies = [
        new TubeMouse(180, 420, 60),
        new TubeMouse(600, 420, 70),
        new TubeMouse(560, 270, 25),
        new TubeMouse(1090, 420, 70),
        new TubeMouse(1040, 270, 25),
        new TubeMouse(1580, 420, 70),
        new TubeMouse(1530, 270, 25),
        new TubeMouse(2060, 420, 70),
        new TubeMouse(2020, 270, 25),
        new TubeMouse(2560, 420, 70),
        new TubeMouse(3050, 420, 70),
        new TubeMouse(3530, 420, 60)
      ];
      this.items = [
        new Coin(180, 360), new Coin(220, 360),
        new Coin(360, 320), new Coin(400, 320),
        new Coin(550, 255), new Coin(710, 180),
        new Coin(840, 315), new Coin(880, 315),
        new Coin(1030, 255), new Coin(1200, 180),
        new Coin(1330, 320), new Coin(1370, 320),
        new Coin(1520, 255), new Coin(1690, 185),
        new Coin(1810, 315), new Coin(1850, 315),
        new Coin(2010, 255), new Coin(2180, 180),
        new Coin(2300, 320), new Coin(2340, 320),
        new Coin(2500, 255), new Coin(2670, 180),
        new Coin(2790, 315), new Coin(2830, 315),
        new Coin(2990, 255), new Coin(3160, 185),
        new Coin(3290, 320), new Coin(3470, 260),
        new Coin(3760, 315), new Coin(4035, 315),
        new Coin(4300, 340), new Coin(4740, 340),
        new FishHeal(1030, 255),
        new FishHeal(2010, 255),
        new FishHeal(3530, 420),
        new Catnip(2060, 420),              // 🥫 奇数ステージ限定: 無敵マグロ缶
        new TwinStar(1690, 185)             // ⭐ ヤシの木てっぺんのツインスター
      ];
    } else if (stageNum === 6) {
      // ステージ6: 妖怪・ゴーストキャットマンション
      this.boss = new GhostBossCat(4600, 180);
      this.enemies = [
        new GhostMouse(180, 420, 60),
        new GhostMouse(590, 420, 70),
        new GhostMouse(550, 270, 25),
        new GhostMouse(1070, 420, 70),
        new GhostMouse(1030, 270, 25),
        new GhostMouse(1560, 420, 70),
        new GhostMouse(1520, 270, 25),
        new GhostMouse(2050, 420, 70),
        new GhostMouse(2010, 270, 25),
        new GhostMouse(2550, 420, 70),
        new GhostMouse(3040, 420, 70),
        new GhostMouse(3530, 420, 60)
      ];
      this.items = [
        new Coin(180, 360), new Coin(220, 360),
        new Coin(350, 320), new Coin(390, 320),
        new Coin(540, 255), new Coin(700, 180),
        new Coin(830, 315), new Coin(870, 315),
        new Coin(1020, 255), new Coin(1190, 180),
        new Coin(1310, 320), new Coin(1350, 320),
        new Coin(1510, 255), new Coin(1680, 180),
        new Coin(1800, 315), new Coin(1840, 315),
        new Coin(2000, 255), new Coin(2170, 180),
        new Coin(2290, 320), new Coin(2330, 320),
        new Coin(2490, 255), new Coin(2660, 180),
        new Coin(2790, 315), new Coin(2830, 315),
        new Coin(2990, 255), new Coin(3160, 180),
        new Coin(3280, 320), new Coin(3460, 260),
        new Coin(3770, 315), new Coin(4035, 315),
        new Coin(4300, 335), new Coin(4730, 335),
        new FishHeal(1020, 255),
        new FishHeal(2000, 255),
        new FishHeal(3530, 420),
        // 🥫 Catnipなし（偶数ステージ）
        new PowerChili(2170, 180)           // 🌶️ ゴシック屋根裏部屋の火力増強
      ];
    } else if (stageNum === 7) {
      // ステージ7: コズミック・キャットスペース
      this.boss = new SpaceBossCat(4600, 180);
      this.enemies = [
        new SpaceMouse(180, 420, 60),
        new SpaceMouse(580, 420, 70),
        new SpaceMouse(540, 270, 25),
        new SpaceMouse(1060, 420, 70),
        new SpaceMouse(1020, 265, 25),
        new SpaceMouse(1550, 420, 70),
        new SpaceMouse(1510, 270, 25),
        new SpaceMouse(2040, 420, 70),
        new SpaceMouse(2000, 270, 25),
        new SpaceMouse(2530, 420, 70),
        new SpaceMouse(3020, 420, 70),
        new SpaceMouse(3510, 420, 60)
      ];
      this.items = [
        new Coin(180, 360), new Coin(220, 360),
        new Coin(340, 315), new Coin(380, 315),
        new Coin(530, 255), new Coin(690, 180),
        new Coin(820, 310), new Coin(860, 310),
        new Coin(1010, 250), new Coin(1180, 175),
        new Coin(1300, 315), new Coin(1340, 315),
        new Coin(1500, 255), new Coin(1670, 180),
        new Coin(1790, 310), new Coin(1830, 310),
        new Coin(1990, 255), new Coin(2160, 175),
        new Coin(2280, 315), new Coin(2320, 315),
        new Coin(2480, 255), new Coin(2650, 180),
        new Coin(2770, 310), new Coin(2810, 310),
        new Coin(2970, 255), new Coin(3140, 175),
        new Coin(3260, 315), new Coin(3440, 260),
        new Coin(3750, 310), new Coin(4035, 315),
        new Coin(4300, 330), new Coin(4720, 330),
        new FishHeal(1010, 250),
        new FishHeal(1990, 255),
        new FishHeal(3510, 420),
        new Catnip(2040, 420),              // 🥫 奇数ステージ限定: 無敵マグロ缶
        new TwinStar(2160, 175)             // ⭐ 人工衛星デッキのツインスター
      ];
    } else {
      // ステージ8: ファイナル・真・天空キャッスル
      this.boss = new TrueGodfatherBossCat(4600, 170);
      this.enemies = [
        new GuardMouse(160, 420, 55),
        new GuardMouse(550, 420, 65),
        new GuardMouse(520, 270, 25),
        new GuardMouse(1020, 420, 65),
        new GuardMouse(970, 265, 25),
        new GuardMouse(1480, 420, 65),
        new GuardMouse(1430, 270, 25),
        new GuardMouse(1940, 420, 65),
        new GuardMouse(1890, 270, 25),
        new GuardMouse(2400, 420, 65),
        new GuardMouse(2860, 420, 65),
        new GuardMouse(3320, 420, 65)
      ];
      this.items = [
        new Coin(160, 360), new Coin(200, 360),
        new Coin(320, 320), new Coin(360, 320),
        new Coin(510, 255), new Coin(660, 180),
        new Coin(770, 315), new Coin(810, 315),
        new Coin(960, 250), new Coin(1120, 175),
        new Coin(1230, 320), new Coin(1270, 320),
        new Coin(1420, 255), new Coin(1580, 180),
        new Coin(1690, 315), new Coin(1730, 315),
        new Coin(1880, 255), new Coin(2040, 175),
        new Coin(2150, 320), new Coin(2190, 320),
        new Coin(2340, 255), new Coin(2500, 180),
        new Coin(2610, 315), new Coin(2650, 315),
        new Coin(2800, 255), new Coin(2960, 175),
        new Coin(3070, 320), new Coin(3240, 255),
        new Coin(3530, 315), new Coin(3700, 260),
        new Coin(3880, 315), new Coin(4050, 315),
        new Coin(4310, 340), new Coin(4730, 340),
        new FishHeal(960, 250),
        new FishHeal(1880, 255),
        new FishHeal(3320, 420),
        // 🥫 Catnipなし（偶数ステージ）
        new PowerChili(2960, 175)           // 🌶️ 天空最頂点！覚醒真ボスに対抗する紅蓮の力
      ];
    }

    this.cameraX = 0;
  }

  // =========================================================================
  // ⌨️ 入力・イベントハンドラ
  // =========================================================================
  setupInputs() {
    // 操作キー一覧（Space等によるブラウザのボタン再クリック・スクロールを完全に防止）
    const gameKeys = [
      'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyZ', 'KeyJ', 'Enter', 'KeyB', 'KeyF',
      'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8'
    ];

    window.addEventListener('keydown', (e) => {
      // 🏆 入力フォーム（ランキング名前入力等）にフォーカスがある時はゲームキーを完全無効化
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
        return;
      }

      // 🏆 ランキングモーダル表示中はゲーム操作を停止（Escapeキーでモーダルを閉じる）
      const rankingModal = document.getElementById('rankingModal');
      if (rankingModal && rankingModal.style.display !== 'none' && rankingModal.style.display !== '') {
        if (e.code === 'Escape') {
          if (window.rankingManager) window.rankingManager.hideRankingModal();
        }
        return;
      }

      if (gameKeys.includes(e.code)) {
        e.preventDefault();
      }
      window.sound.init();

      // フォーカスが残っている場合は完全に外す（input/textarea以外）
      if (document.activeElement && document.activeElement !== document.body &&
          document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        document.activeElement.blur();
      }

      // ★ [1]〜[8] キーで各ステージへ即時ワープ（テスト用）
      if (e.code === 'Digit1') { this.warpToStage(1); return; }
      if (e.code === 'Digit2') { this.warpToStage(2); return; }
      if (e.code === 'Digit3') { this.warpToStage(3); return; }
      if (e.code === 'Digit4') { this.warpToStage(4); return; }
      if (e.code === 'Digit5') { this.warpToStage(5); return; }
      if (e.code === 'Digit6') { this.warpToStage(6); return; }
      if (e.code === 'Digit7') { this.warpToStage(7); return; }
      if (e.code === 'Digit8') { this.warpToStage(8); return; }

      // ★ [B]キーでいつでも現在ステージのボス戦へ直行（テスト用）
      if (e.code === 'KeyB') {
        this.warpToBoss();
        return;
      }

      // ★ [F]キーでいつでも無敵フィーバーモード発動（テスト用）
      if (e.code === 'KeyF' && this.state === 'PLAYING') {
        this.player.activateFever();
        return;
      }

      // ★ [S]キーでいつでもスーパー形態のON/OFF切り替え（テスト・検証用）
      if (e.code === 'KeyS' && (this.state === 'PLAYING' || this.state === 'BOSS_BATTLE')) {
        this.toggleSuperForm();
        return;
      }

      if (this.state === 'TITLE') {
        if (e.code === 'Space' || e.code === 'Enter') {
          this.state = 'CHAR_SELECT';
          window.sound.playCoin();
          window.sound.startBGM('title');
        }
        return;
      }

      // ★ キャラクター選択画面での操作
      if (this.state === 'CHAR_SELECT') {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          this.cursorCharacter = 'cat';
          window.sound.playPawShot();
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          this.cursorCharacter = 'onigiri';
          window.sound.playOnigiriJump();
        } else if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ') {
          this.selectedCharacter = this.cursorCharacter;
          this.startGame();
        }
        return;
      }

      if (this.state === 'BOSS_INTRO') {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ') {
          this.advanceBossIntro();
        }
        return;
      }

      if (this.state === 'STAGE_CLEAR') {
        if (e.code === 'Space' || e.code === 'Enter') {
          this.advanceToNextStage();
        }
        return;
      }

      if (this.state === 'ALL_STAGE_CLEAR') {
        // 👑 ひろあき軍曹ご指示: ボタン連打での誤再開を防ぐため、キーボード操作での再開は無効化（「オープニング」ボタンクリックのみ）
        return;
      }

      if (this.state === 'GAME_OVER') {
        // 👑 ひろあき軍曹ご指示: ボタン連打での誤再開を防ぐため、キーボード操作での再開は無効化（クリック再開のみ）
        return;
      }

      // ⚡ Shift + D でデバッグツールの表示/非表示切替
      if (e.code === 'KeyD' && e.shiftKey) {
        this.debugMode = !this.debugMode;
        this.applyDebugVisibility();
        return;
      }

      // ⚡ E または Shift + E でエンディング画面へ直行
      if (e.code === 'KeyE' && (this.debugMode || e.shiftKey)) {
        this.startEnding();
        return;
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.inputs.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.inputs.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') this.inputs.jump = true;
      if (e.code === 'KeyZ' || e.code === 'KeyJ' || e.code === 'Enter') this.inputs.attack = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
        return;
      }
      if (gameKeys.includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.inputs.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.inputs.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') this.inputs.jump = false;
      if (e.code === 'KeyZ' || e.code === 'KeyJ' || e.code === 'Enter') this.inputs.attack = false;
    });

    this.setupTouchButton('btnLeft', 'left');
    this.setupTouchButton('btnRight', 'right');
    this.setupTouchButton('btnJump', 'jump');
    this.setupTouchButton('btnAttack', 'attack');

    // ヘッダーのテストボタン群（クリック後にフォーカスを確実に外す）
    const bossWarpBtn = document.getElementById('btnBossWarp');
    if (bossWarpBtn) {
      bossWarpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.currentTarget.blur();
        window.sound.init();
        this.warpToBoss();
      });
    }

    const endingBtn = document.getElementById('btnEnding');
    if (endingBtn) {
      endingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.currentTarget.blur();
        window.sound.init();
        this.startEnding();
      });
    }

    [1, 2, 3, 4, 5, 6, 7, 8].forEach((s) => {
      const btn = document.getElementById(`btnStage${s}`);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.currentTarget.blur();
          window.sound.init();
          this.warpToStage(s);
        });
      }
    });

    this.canvas.addEventListener('pointerdown', (e) => {
      window.sound.init();
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }

      const rect = this.canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * CONSTANTS.CANVAS_WIDTH;
      const clickY = ((e.clientY - rect.top) / rect.height) * CONSTANTS.CANVAS_HEIGHT;

      if (this.state === 'TITLE') {
        // 🏆 タイトル画面の「全国ランキングを見る」ボタン判定 (X: 320〜640, Y: 258〜318)
        if (clickX >= 320 && clickX <= 640 && clickY >= 258 && clickY <= 318) {
          if (typeof window !== 'undefined' && window.rankingManager) {
            window.rankingManager.showRankingModal();
          }
          return;
        }

        this.state = 'CHAR_SELECT';
        window.sound.playCoin();
        window.sound.startBGM('title');
      } else if (this.state === 'CHAR_SELECT') {
        // 左カード（ねこ）
        if (clickX >= 80 && clickX <= 460 && clickY >= 130 && clickY <= 440) {
          if (this.cursorCharacter === 'cat') {
            this.selectedCharacter = 'cat';
            this.startGame();
          } else {
            this.cursorCharacter = 'cat';
            window.sound.playPawShot();
          }
        }
        // 右カード（おにぎり）
        else if (clickX >= 500 && clickX <= 880 && clickY >= 130 && clickY <= 440) {
          if (this.cursorCharacter === 'onigiri') {
            this.selectedCharacter = 'onigiri';
            this.startGame();
          } else {
            this.cursorCharacter = 'onigiri';
            window.sound.playOnigiriJump();
          }
        }
        // 下部スタート決定ボタン
        else if (clickY >= 445) {
          this.selectedCharacter = this.cursorCharacter;
          this.startGame();
        }
      } else if (this.state === 'BOSS_INTRO') {
        this.advanceBossIntro();
      } else if (this.state === 'STAGE_CLEAR') {
        this.advanceToNextStage();
      } else if (this.state === 'GAME_OVER') {
        // 🏆 1. 「全国ランキングに登録」ボタン判定 (X: 290〜670, Y: 315〜370)
        if (clickX >= 290 && clickX <= 670 && clickY >= 315 && clickY <= 370) {
          if (typeof window !== 'undefined' && window.rankingManager) {
            window.rankingManager.showRankingModal({
              allowSubmit: true,
              alreadySubmitted: this.hasSubmittedGameOver,
              sessionId: this.gameOverSessionId,
              score: this.score,
              stage: this.currentStage,
              character: this.player ? this.player.characterType : 'cat',
              onSubmitSuccess: () => {
                this.hasSubmittedGameOver = true;
              }
            });
          }
          return;
        }

        // 🔁 2. 「ステージ〇から再開」ボタン判定 (X: 180〜470, Y: 390〜455)
        if (clickX >= 180 && clickX <= 470 && clickY >= 390 && clickY <= 455) {
          if (typeof window !== 'undefined' && window.sound) {
            window.sound.playCoin();
          }
          this.initGame(this.currentStage, false);
          this.state = 'PLAYING';
          if (typeof window !== 'undefined' && window.sound) {
            window.sound.startBGM(false);
          }
          return;
        }

        // 🏠 3. 「最初からやり直す」ボタン判定 (X: 490〜780, Y: 390〜455)
        if (clickX >= 490 && clickX <= 780 && clickY >= 390 && clickY <= 455) {
          if (typeof window !== 'undefined' && window.sound) {
            window.sound.playCoin();
          }
          this.initGame(1, false);
          this.state = 'PLAYING';
          if (typeof window !== 'undefined' && window.sound) {
            window.sound.startBGM(false);
          }
          return;
        }

        // 👑 ひろあき軍曹ご指示: ボタン連打・誤操作防止のため、ボタン以外の場所をクリックしても再開しない
        return;
      } else if (this.state === 'ALL_STAGE_CLEAR') {
        // 🏆 1. 「殿堂入りランキングに登録」ボタン判定 (X: 150〜530, Y: 465〜530)
        if (clickX >= 150 && clickX <= 530 && clickY >= 465 && clickY <= 530) {
          if (typeof window !== 'undefined' && window.rankingManager) {
            window.rankingManager.showRankingModal({
              allowSubmit: true,
              alreadySubmitted: this.hasSubmittedGameOver,
              sessionId: this.gameOverSessionId,
              score: this.score,
              stage: 8,
              character: this.player ? this.player.characterType : 'cat',
              playTime: 'ALL CLEAR',
              onSubmitSuccess: () => {
                this.hasSubmittedGameOver = true;
              }
            });
          }
          return;
        }

        // 🏠 2. 「オープニング」ボタン判定 (X: 540〜810, Y: 465〜530)
        if (clickX >= 540 && clickX <= 810 && clickY >= 465 && clickY <= 530) {
          if (typeof window !== 'undefined' && window.sound) {
            window.sound.playCoin();
          }
          this.state = 'TITLE';
          this.currentStage = 1;
          this.score = 0;
          if (typeof window !== 'undefined' && window.sound) {
            window.sound.startBGM('title');
          }
          return;
        }

        // 👑 ひろあき軍曹ご指示: ボタン連打・誤操作防止のため、ボタン以外の場所をクリックしても再開しない
        return;
      }
    });
  }

  applyDebugVisibility() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.debug-tool').forEach(el => {
      el.style.display = this.debugMode ? 'inline-block' : 'none';
    });
  }

  saveHighScore(isAllClear = false) {
    if (typeof window !== 'undefined' && window.rankingManager) {
      const res = window.rankingManager.saveScore(this.score, this.currentStage, 0, isAllClear);
      if (res.isNewHighScore) {
        this.isNewHighScore = true;
        this.highScore = res.highScore;
      }
      this.bestStage = res.bestStage;
    }
  }

  onScoreSubmitted() {
    this.hasSubmittedGameOver = true;
  }

  // ステージワープ（テスト用）
  warpToStage(stageNum) {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    this.initGame(stageNum, true);
    this.state = 'PLAYING';
    window.sound.startBGM(false);
  }

  // 🎬 ボス情報取得ヘルパー（カットインバナー表示用）
  getBossInfo() {
    const titles = {
      1: { badge: 'STAGE 1 BOSS', title: '成金マタドール', name: 'ドン・ニャルレオーネ', color: '#ffb703' },
      2: { badge: 'STAGE 2 BOSS', title: '暴走セレブねこ', name: 'レディ・ミャウミャウ', color: '#ff007f' },
      3: { badge: 'STAGE 3 BOSS', title: '時計塔の黒幕', name: 'ドン・ニャルレオーネ', color: '#ffd166' },
      4: { badge: 'STAGE 4 BOSS', title: '暴走板前', name: 'ニャン八', color: '#e63946' },
      5: { badge: 'STAGE 5 BOSS', title: 'サーフ番長', name: 'ニャロハ', color: '#00f5d4' },
      6: { badge: 'STAGE 6 BOSS', title: '洋館の魔術師', name: 'ファントム・ニャン', color: '#a06cd5' },
      7: { badge: 'STAGE 7 BOSS', title: '宇宙皇帝', name: 'ニャイザー総統', color: '#3a86ff' },
      8: { badge: 'FINAL STAGE BOSS', title: '天空の覚醒真ボス', name: '真ドン・ニャルレオーネ', color: '#ffd700' }
    };
    return titles[this.currentStage] || titles[1];
  }

  // 🎬 ボス登場シネマティック演出トリガー（通常進行＆ワープ共通）
  triggerBossIntro(isWarp = false) {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }

    this.state = 'BOSS_INTRO';
    this.bossIntroPhase = 'SILENCE';
    this.bossIntroTimer = 0;
    this.bossIntroHeartbeats = 0;
    this.bossIntroImpactFired = false;
    this.whiteFlash = 0;
    this.screenShake = 0;
    this.letterboxH = 0;
    this.bossCutinProgress = 0;
    this.timeScale = 1.0;
    this.introStep = 0;

    this.inputs.left = false;
    this.inputs.right = false;
    this.player.vx = 0;
    const bossWallX = (typeof CONSTANTS !== 'undefined' && CONSTANTS.STAGE_CONFIG) ? CONSTANTS.STAGE_CONFIG.BOSS_WALL_X : 4150;
    this.player.lastSafeGroundX = Math.max(bossWallX + 80, this.player.x);
    this.player.lastSafeGroundY = 406;

    // ★ 👑 ひろあき軍曹ご指示: ボス戦突入時に道中BGMをピタッと停止して完全無音化！
    window.sound.silenceBGM();

    if (isWarp) {
      const defaultBossCenter = (typeof CONSTANTS !== 'undefined' && CONSTANTS.STAGE_CONFIG) ? CONSTANTS.STAGE_CONFIG.BOSS_START_X + 55 : 4655;
      const bossCenter = this.boss ? (this.boss.startX + this.boss.width / 2) : defaultBossCenter;
      this.cameraX = Math.max(0, Math.min(this.stage.width - CONSTANTS.CANVAS_WIDTH, bossCenter - CONSTANTS.CANVAS_WIDTH / 2));
      this.player.x = this.cameraX + 160;
      this.player.y = 406;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.lastSafeGroundX = this.player.x;
    }
  }

  // ボス戦直行ワープ
  warpToBoss() {
    this.triggerBossIntro(true);
  }

  // 🎊 祝祭エンディング画面へ直行（デバッグ / 演出鑑賞用）
  startEnding() {
    this.state = 'ALL_STAGE_CLEAR';
    this.currentStage = 8;
    if (!this.score || this.score === 0) {
      this.score = this.highScore > 0 ? this.highScore : 58900;
    }
    this.gameOverSessionId = 'allclear_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    this.hasSubmittedGameOver = false;
    this.saveHighScore(true);
    this.paradeTimer = 0;
    if (typeof window !== 'undefined' && window.sound) {
      window.sound.startBGM('ending');
    }
  }

  // 🎬 ボス登場シネマティックの実時間更新ロジック
  updateBossIntro(dt) {
    if (this.state !== 'BOSS_INTRO') return;
    this.bossIntroTimer += dt;
    const t = this.bossIntroTimer;

    // カメラをボス中央へスムーズイージング
    const defaultBossCenter = (typeof CONSTANTS !== 'undefined' && CONSTANTS.STAGE_CONFIG) ? CONSTANTS.STAGE_CONFIG.BOSS_START_X + 55 : 4655;
    const bossCenter = this.boss ? (this.boss.startX + this.boss.width / 2) : defaultBossCenter;
    const targetCamX = bossCenter - CONSTANTS.CANVAS_WIDTH / 2;
    this.cameraX += (targetCamX - this.cameraX) * 0.08;
    this.cameraX = Math.max(0, Math.min(this.stage.width - CONSTANTS.CANVAS_WIDTH, this.cameraX));

    // Phase 1: 【完全な静寂（無音）＆接近】 (0.0s 〜 0.6s)
    if (t < 0.6) {
      this.bossIntroPhase = 'SILENCE';
      this.timeScale = 1.0;
      this.letterboxH = Math.min(45, this.letterboxH + dt * 100);
      if (t >= 0.10 && this.bossIntroHeartbeats === 0) {
        this.bossIntroHeartbeats = 1;
        window.sound.playHeartbeat(0.85);
      }
    }
    // Phase 2: 【ボス出現＆極限のスローモーション】 (0.6s 〜 1.6s)
    else if (t < 1.6) {
      this.bossIntroPhase = 'SLOW';
      // ★ 👑 ひろあき軍曹ご指示: ボスが現れてからスローに！
      this.timeScale = 0.20;
      this.letterboxH = 45;
      if (t >= 0.85 && this.bossIntroHeartbeats === 1) {
        this.bossIntroHeartbeats = 2;
        window.sound.playHeartbeat(1.25);
      }
    }
    // Phase 3: 【登場インパクト＆ホワイトフラッシュ＆ボスBGM爆音炸裂】 (1.6s 〜 2.5s)
    else if (t < 2.5) {
      this.bossIntroPhase = 'IMPACT';
      this.timeScale = 1.0; // 通常速度に復帰
      if (!this.bossIntroImpactFired) {
        this.bossIntroImpactFired = true;
        this.whiteFlash = 0.95; // ホワイトフラッシュ
        this.screenShake = 16;  // 激しい画面揺れ
        window.sound.playBossImpact(); // 轟音インパクトSE
        window.sound.startBGM('boss'); // 👑 ひろあき軍曹作曲『成金マタドール』爆音再生！

        // ボス周囲に黄金スパーク＆衝撃波パーティクル生成
        if (this.boss) {
          const bcx = this.boss.x + this.boss.width / 2;
          const bcy = this.boss.y + this.boss.height / 2;
          for (let i = 0; i < 28; i++) {
            const angle = (i / 28) * Math.PI * 2;
            const spd = 3 + Math.random() * 5;
            window.particleManager.createSparkle(
              bcx + Math.cos(angle) * 35,
              bcy + Math.sin(angle) * 35,
              i % 2 === 0 ? '#ffd166' : '#ff4d6d'
            );
          }
        }
      }
      this.bossCutinProgress = Math.min(1.0, (t - 1.6) / 0.45);
    }
    // Phase 4: 【対峙ダイアログ】 (2.5s 以降)
    else {
      this.bossIntroPhase = 'DIALOG';
      this.timeScale = 1.0;
      this.letterboxH = Math.max(0, this.letterboxH - dt * 60);
    }
  }

  // 🎬 スキップ機能（いつでも即座にダイアログまたは戦闘へ移行）
  skipBossIntro() {
    if (this.state === 'BOSS_INTRO' && this.bossIntroPhase !== 'DIALOG') {
      if (!this.bossIntroImpactFired) {
        this.bossIntroImpactFired = true;
        window.sound.startBGM('boss');
      }
      this.bossIntroPhase = 'DIALOG';
      this.timeScale = 1.0;
      this.letterboxH = 0;
      this.whiteFlash = 0;
      this.screenShake = 0;
      this.bossCutinProgress = 1.0;
      this.bossIntroTimer = 2.5;
      return true;
    }
    return false;
  }

  setupTouchButton(elementId, action) {
    const btn = document.getElementById(elementId);
    if (!btn) return;
    const start = (e) => {
      e.preventDefault();
      e.currentTarget.blur();
      window.sound.init();
      if (this.state === 'BOSS_INTRO') {
        this.advanceBossIntro();
        return;
      }
      this.inputs[action] = true;
    };
    const end = (e) => {
      e.preventDefault();
      e.currentTarget.blur();
      this.inputs[action] = false;
    };
    btn.addEventListener('touchstart', start, { passive: false });
    btn.addEventListener('touchend', end, { passive: false });
    btn.addEventListener('mousedown', start);
    btn.addEventListener('mouseup', end);
    btn.addEventListener('mouseleave', end);
  }

  startGame() {
    this.initGame(1, false);
    this.state = 'PLAYING';
    window.sound.startBGM(false);
  }

  advanceToNextStage() {
    const next = this.currentStage + 1;
    this.initGame(next, true);
    this.state = 'PLAYING';
    window.sound.startBGM(false);
  }

  restartGame() {
    if (this.state === 'ALL_STAGE_CLEAR') {
      // 🏆 全ステージ完全クリア後のリスタートは最初（ステージ1）から
      this.initGame(1, false);
    } else {
      // 👑 ひろあき軍曹ご指示: 死んだら最初からではなく、そのステージから再開（スコアはリセット）
      this.initGame(this.currentStage, false);
    }
    this.state = 'PLAYING';
    window.sound.startBGM(false);
  }

  advanceBossIntro() {
    // 演出フェーズの途中なら、まず即座にDIALOGへスキップ
    if (this.bossIntroPhase !== 'DIALOG') {
      this.skipBossIntro();
      return;
    }
    this.introStep++;
    window.sound.playStomp();
    if (this.introStep >= this.introDialogs.length) {
      this.state = 'BOSS_BATTLE';
      if (!window.sound.bgmPlaying || !window.sound.currentTrack || !window.sound.currentTrack.includes('boss')) {
        window.sound.startBGM('boss');
      }
    }
  }

  // =========================================================================
  // 🔄 ゲームループ（安定60Hz固定ステップ・デルタタイム補正制御）
  // =========================================================================
  loop(currentTime) {
    try {
      if (!this.lastTime) this.lastTime = currentTime;
      let delta = currentTime - this.lastTime;
      this.lastTime = currentTime;

      // タブ復帰時などの巨大なタイムジャンプを最大100msに制限
      if (delta > 100) delta = 100;
      if (delta < 0) delta = 0;

      // リアルタイムFPS計測（0.5秒ごとに集計）
      this.frameCount++;
      if (currentTime - this.fpsTimer >= 500) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.fpsTimer));
        this.frameCount = 0;
        this.fpsTimer = currentTime;
      }

      // エフェクト減衰（実時間ミリ秒ベース）
      if (this.whiteFlash > 0) this.whiteFlash = Math.max(0, this.whiteFlash - delta * 0.0022);
      if (this.screenShake > 0) this.screenShake = Math.max(0, this.screenShake - delta * 0.035);

      // 🎬 ボス登場シネマティック演出の実時間タイマー進行
      if (this.state === 'BOSS_INTRO') {
        this.updateBossIntro(delta / 1000);
      }

      // 完全固定60Hz（16.666ms）ステップで物理・ゲームロジックを進める
      // ★ タイムスケール（スローモーション）を物理ステップ蓄積に反映！
      this.accumulator += delta * this.timeScale;
      const fixedStep = 1000 / 60; // 16.666ms
      let updates = 0;
      while (this.accumulator >= fixedStep && updates < 4) {
        this.update();
        this.accumulator -= fixedStep;
        updates++;
      }
      if (updates >= 4) {
        this.accumulator = 0; // スパイラル防止
      }

      this.draw();
    } catch (err) {
      console.error('Game loop error:', err);
    }
    requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    if (this.state === 'TITLE') return;

    this.stage.update();
    window.particleManager.update();

    if (this.stageBannerTimer > 0) {
      this.stageBannerTimer--;
    }

    if (this.controlGuideTimer > 0) {
      this.controlGuideTimer--;
    }

    if (this.superCutInTimer > 0) {
      this.superCutInTimer--;
    }

    // 🌟 奇跡の覚醒タイムストップ（劇的演出中は世界を静止）
    if (this.superRevivalFreezeTimer > 0) {
      this.superRevivalFreezeTimer--;
      return;
    }

    if (this.state === 'ALL_STAGE_CLEAR') {
      this.paradeTimer++;
      // エンディング紙吹雪を継続発生
      if (this.paradeTimer % 4 === 0) {
        window.particleManager.createConfetti(
          Math.random() * CONSTANTS.CANVAS_WIDTH,
          -10
        );
      }
      return;
    }

    if (this.state === 'PLAYING' || this.state === 'BOSS_BATTLE') {
      this.player.update(this.inputs, this.stage);

      if (this.player.hp <= 0) {
        // 🌟 ラスボス限定：奇跡の再生・スーパー覚醒トリガー
        const bossWallX = (typeof CONSTANTS !== 'undefined' && CONSTANTS.STAGE_CONFIG) ? CONSTANTS.STAGE_CONFIG.BOSS_WALL_X : 4150;
        if (this.currentStage === 8 && (this.state === 'BOSS_BATTLE' || this.player.x >= bossWallX) && !this.player.isSuper) {
          this.triggerSuperRevival();
          return;
        }

        this.state = 'GAME_OVER';
        this.gameOverSessionId = 'gameover_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
        this.hasSubmittedGameOver = false;
        this.saveHighScore(false);
        window.sound.startBGM('gameover');
        return;
      }

      // ボスエリア進入チェック（シネマティック演出発動）
      const bossTriggerX = (typeof CONSTANTS !== 'undefined' && CONSTANTS.STAGE_CONFIG) ? (CONSTANTS.STAGE_CONFIG.BOSS_WALL_X + 80) : 4230;
      if (this.state === 'PLAYING' && this.player.x > bossTriggerX) {
        this.triggerBossIntro(false);
      }

      // カメラ追従
      if (this.state === 'BOSS_INTRO' || this.state === 'BOSS_BATTLE') {
        // ★ボス戦時: ボスが画面中央に来るようにスクリーンをセンタリング！
        const defaultBossCenter = (typeof CONSTANTS !== 'undefined' && CONSTANTS.STAGE_CONFIG) ? CONSTANTS.STAGE_CONFIG.BOSS_START_X + 55 : 4655;
        const bossCenter = this.boss ? (this.boss.startX + this.boss.width / 2) : defaultBossCenter;
        const targetCamX = bossCenter - CONSTANTS.CANVAS_WIDTH / 2;
        this.cameraX += (targetCamX - this.cameraX) * 0.08;
      } else {
        // 通常道中: プレイヤー追従
        const targetCamX = this.player.x - CONSTANTS.CANVAS_WIDTH * 0.35;
        this.cameraX += (targetCamX - this.cameraX) * 0.1;
      }
      this.cameraX = Math.max(0, Math.min(this.stage.width - CONSTANTS.CANVAS_WIDTH, this.cameraX));

      // ★ボス戦時: 表示されたスクリーン内しか動けないようにプレイヤーをクランプ！
      if (this.state === 'BOSS_INTRO' || this.state === 'BOSS_BATTLE') {
        const screenLeft = this.cameraX;
        const screenRight = this.cameraX + CONSTANTS.CANVAS_WIDTH;
        if (this.player.x < screenLeft) {
          this.player.x = screenLeft;
          if (this.player.vx < 0) this.player.vx = 0;
        } else if (this.player.x + this.player.width > screenRight) {
          this.player.x = screenRight - this.player.width;
          if (this.player.vx > 0) this.player.vx = 0;
        }
      }

      for (const e of this.enemies) {
        e.update(this.stage);
      }

      for (const item of this.items) {
        item.update();
      }

      if (this.state === 'BOSS_BATTLE') {
        this.boss.update(this.player);

        // ボス激おこモード判定連動
        if (this.boss.isRaging() && !window.sound.currentTrack.includes('rage')) {
          if (this.currentStage === 1) window.sound.startBGM('boss_rage');
          else if (this.currentStage === 2) window.sound.startBGM('boss2_rage');
          else if (this.currentStage === 3) window.sound.startBGM('boss3_rage');
          else if (this.currentStage === 4) window.sound.startBGM('boss4_rage');
          else if (this.currentStage === 5) window.sound.startBGM('boss5_rage');
          else if (this.currentStage === 6) window.sound.startBGM('boss6_rage');
          else if (this.currentStage === 7) window.sound.startBGM('boss7_rage');
          else window.sound.startBGM('boss8_rage');
        }

        // ボス撃破時の遷移
        if (this.boss.isDead && this.state !== 'STAGE_CLEAR' && this.state !== 'ALL_STAGE_CLEAR') {
          this.stage.bossWall.active = false;
          if (this.currentStage < 8) {
            this.state = 'STAGE_CLEAR';
            window.sound.startBGM('clear'); // 👑 ひろあき軍曹 作曲『完全勝利の決めポーズ』
          } else {
            this.state = 'ALL_STAGE_CLEAR';
            this.gameOverSessionId = 'allclear_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
            this.hasSubmittedGameOver = false;
            this.saveHighScore(true);
            this.paradeTimer = 0;
            window.sound.startBGM('ending');
          }
        }
      }

      this.checkCollisions();
    } else if (this.state === 'BOSS_INTRO') {
      const bossCenter = this.boss ? (this.boss.startX + this.boss.width / 2) : 2515;
      const targetCamX = bossCenter - CONSTANTS.CANVAS_WIDTH / 2;
      this.cameraX += (targetCamX - this.cameraX) * 0.08;
      this.cameraX = Math.max(0, Math.min(this.stage.width - CONSTANTS.CANVAS_WIDTH, this.cameraX));
    }
  }

  // =========================================================================
  // 💥 当たり判定処理
  // =========================================================================
  checkCollisions() {
    const p = this.player;
    const attackBox = p.getAttackHitbox();

    // 1. プレイヤー vs アイテム
    for (const item of this.items) {
      if (item.isCollected) continue;
      if (this.isBoxColliding(p, item)) {
        if (item instanceof Coin) {
          item.collect();
          this.score += 100;
        } else if (item instanceof FishHeal) {
          item.collect(p);
        } else if (item instanceof Catnip) {
          item.collect(p);
        } else if (item instanceof PowerChili) {
          item.collect(p);
          this.score += 200;
        } else if (item instanceof TwinStar) {
          item.collect(p);
          this.score += 200;
        }
      }
    }

    // 2. プレイヤー vs ザコ敵
    for (const e of this.enemies) {
      if (e.isDead) continue;

      // ひっかき攻撃
      if (attackBox && this.isBoxColliding(attackBox, e)) {
        e.defeat();
        this.score += 200 * (attackBox.isSuper ? 3 : (attackBox.isFire ? 2 : 1));
        continue;
      }

      // 踏みつけ
      if (p.vy > 0 && (p.y + p.height - p.vy <= e.y + 18) && this.isBoxColliding(p, e)) {
        e.defeat();
        p.bounce();
        this.score += 300;
        continue;
      }

      // またたび無敵体当たり
      if (p.feverTimer > 0 && this.isBoxColliding(p, e)) {
        e.defeat();
        this.score += 300;
        continue;
      }

      // 波動拳 ＆ 梅干し弾 vs ザコ敵
      const playerBullets = [...p.hadoukens, ...p.umeboshis];
      for (const h of playerBullets) {
        if (!h.isDead && this.isBoxColliding(h, e)) {
          e.defeat();
          this.score += 250 * h.damage;
          if (h instanceof UmeboshiBullet) {
            window.sound.playUmeboshiHit(h.chargeLevel);
          }
          window.particleManager.createScratchHit(e.x + e.width / 2, e.y + e.height / 2);
          if (!h.penetrate) {
            h.isDead = true;
          }
        }
      }

      if (this.isBoxColliding(p, e)) {
        p.takeDamage(1);
      }
    }

    // 3. プレイヤー vs ボス
    if (this.state === 'BOSS_BATTLE' && !this.boss.isDead) {
      const b = this.boss;

      // ひっかき攻撃
      if (attackBox && this.isBoxColliding(attackBox, b)) {
        let dmg = attackBox.isCombo2 ? 2 : 1;
        if (attackBox.isFire || attackBox.isSuper) dmg *= 2;
        b.takeDamage(dmg);
        this.score += 500 * (attackBox.isSuper ? 3 : (attackBox.isFire ? 2 : 1));
      }

      // 踏みつけ
      if (p.vy > 0 && (p.y + p.height - p.vy <= b.y + 30) && this.isBoxColliding(p, b)) {
        b.takeDamage(1);
        p.bounce();
        this.score += 500;
      }

      // またたび無敵体当たり
      if (p.feverTimer > 0 && this.isBoxColliding(p, b)) {
        b.takeDamage(2);
        p.bounce();
        this.score += 500;
      }

      // 波動拳 ＆ 梅干し弾 vs ボス
      const playerBullets = [...p.hadoukens, ...p.umeboshis];
      for (const h of playerBullets) {
        if (!h.isDead && this.isBoxColliding(h, b)) {
          b.takeDamage(h.damage);
          this.score += 500 * h.damage;
          if (h instanceof UmeboshiBullet) {
            window.sound.playUmeboshiHit(h.chargeLevel);
          }
          const hitCount = (h.damage === 3) ? 18 : (h.damage === 2 ? 10 : 5);
          for (let i = 0; i < hitCount; i++) {
            window.particleManager.createScratchHit(h.x + (Math.random() - 0.5) * 20, h.y + (Math.random() - 0.5) * 20);
          }
          if (!h.penetrate) {
            h.isDead = true;
          }
        }
      }

      if (this.isBoxColliding(p, b)) {
        p.takeDamage(1);
      }

      // ボスの弾幕 vs プレイヤー ＆ 弾相殺
      for (const bullet of b.bullets) {
        if (bullet.isDead) continue;

        // 波動拳 ＆ 梅干し弾でボスの弾を相殺
        for (const h of playerBullets) {
          if (!h.isDead && this.isBoxColliding(h, bullet)) {
            bullet.isDead = true;
            window.sound.playEnemyDefeat();
            if (h instanceof UmeboshiBullet) {
              window.sound.playUmeboshiHit(h.chargeLevel);
            }
            window.particleManager.createScratchHit(bullet.x, bullet.y);
            if (!h.penetrate) {
              h.isDead = true;
            }
          }
        }

        // ひっかき攻撃で叩き落とす
        if (attackBox && this.isBoxColliding(attackBox, bullet)) {
          bullet.isDead = true;
          window.sound.playEnemyDefeat();
          window.particleManager.createScratchHit(bullet.x, bullet.y);
        }

        // プレイヤー被弾
        if (this.isBoxColliding(p, bullet)) {
          if (p.takeDamage(1)) {
            bullet.isDead = true;
          }
        }
      }
    }
  }

  isBoxColliding(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  // =========================================================================
  // 🎨 画面描画
  // =========================================================================
  draw() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    this.ctx.save();

    // 💥 画面揺れ（スクリーンシェイク）の適用（ワールド描画全体を揺らす）
    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(shakeX, shakeY);
    }

    // 1. 背景描画
    this.stage.drawBackground(this.ctx, this.cameraX);

    // 2. 近景ブロック・足場
    this.stage.draw(this.ctx, this.cameraX);

    // 3. アイテム
    for (const item of this.items) {
      item.draw(this.ctx, this.cameraX, this.stage);
    }

    // 4. ザコ敵
    for (const e of this.enemies) {
      e.draw(this.ctx, this.cameraX, this.stage);
    }

    // 5. ボス（イントロまたはバトル中）
    if (this.state === 'BOSS_INTRO' || this.state === 'BOSS_BATTLE' || (this.state === 'STAGE_CLEAR' && this.boss.isDead)) {
      this.boss.draw(this.ctx, this.cameraX);
    }

    // 6. プレイヤー
    this.player.draw(this.ctx, this.cameraX, this.stage);

    // 7. パーティクルエフェクト
    window.particleManager.draw(this.ctx, this.cameraX);

    this.ctx.restore(); // スクリーンシェイク解除

    // 8. HUD & UI演出
    if (this.state === 'PLAYING' || this.state === 'BOSS_BATTLE') {
      this.drawHUD();
      if (this.stageBannerTimer > 0) {
        this.drawStageBanner();
      }
      if (this.controlGuideTimer > 0) {
        this.drawControlGuide();
      }
      if (this.superCutInTimer > 0) {
        this.drawSuperCutIn();
      }
    }

    // 9. 各画面ステートUI
    if (this.state === 'TITLE') this.drawTitleScreen();
    if (this.state === 'CHAR_SELECT') this.drawCharSelectScreen();
    if (this.state === 'BOSS_INTRO') {
      this.drawBossIntroCinematic();
      if (this.bossIntroPhase === 'DIALOG') {
        this.drawBossIntroDialog();
      }
    }
    if (this.state === 'STAGE_CLEAR') this.drawClearScreen();
    if (this.state === 'ALL_STAGE_CLEAR') this.drawAllClearScreen();
    if (this.state === 'GAME_OVER') this.drawGameOverScreen();

    // 10. 🎬 シネマスコープ黒帯（レターボックス）
    if (this.letterboxH > 0) {
      this.drawLetterbox();
    }

    // 11. ⚡ ホワイトフラッシュ（画面全体閃光）
    if (this.whiteFlash > 0) {
      this.drawWhiteFlash();
    }
  }

  drawHUD() {
    const heartSize = 24;
    const startX = 24;
    const startY = 32;

    // 操作中キャラクターのネームバッジ（スーパー覚醒時は黄金ネームバッジ）
    const isSuper = this.player && this.player.isSuper;
    const charInfo = CONSTANTS.CHARACTERS[this.player.characterType] || CONSTANTS.CHARACTERS.cat;
    this.ctx.save();
    this.ctx.fillStyle = isSuper ? 'rgba(255, 215, 0, 0.28)' : 'rgba(0, 0, 0, 0.45)';
    this.ctx.beginPath();
    const badgeW = isSuper ? 165 : 120;
    this.ctx.roundRect(startX - 6, 8, badgeW, 22, 6);
    this.ctx.fill();
    if (isSuper) {
      this.ctx.strokeStyle = '#ffd700';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    }

    this.ctx.fillStyle = isSuper ? '#ffd700' : charInfo.themeColor;
    this.ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.textAlign = 'left';
    const charDisplayName = isSuper
      ? (this.player.characterType === 'onigiri' ? '🍙 スーパーおにぎり' : '⚡ スーパーねこちゃん')
      : charInfo.fullName;
    this.ctx.fillText(charDisplayName, startX, 24);
    this.ctx.restore();

    for (let i = 0; i < CONSTANTS.PLAYER.MAX_HP; i++) {
      const isFilled = i < this.player.hp;
      this.drawHeart(this.ctx, startX + i * (heartSize + 8), startY + 12, heartSize, isFilled, isSuper);
    }

    // 現在ステージ & スコア & FPS表示（白フチをつけてどんな背景でもクッキリ見やすく調律）
    this.ctx.save();
    this.ctx.textAlign = 'right';
    const textX = CONSTANTS.CANVAS_WIDTH - 24;

    const stageScoreText = `STAGE ${this.currentStage} / 8  ｜  SCORE: ${this.score.toLocaleString()}`;
    this.ctx.font = 'bold 18px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 4.5;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.strokeText(stageScoreText, textX, 34);

    this.ctx.fillStyle = '#2b2d42';
    this.ctx.fillText(stageScoreText, textX, 34);

    // リアルタイムFPSバッジ（白フチつき）
    const fpsText = `⚡ ${this.fps} FPS`;
    this.ctx.font = 'bold 12px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.strokeText(fpsText, textX, 52);

    this.ctx.fillStyle = this.fps >= 55 ? '#007f5f' : (this.fps >= 30 ? '#d97706' : '#dc2626');
    this.ctx.fillText(fpsText, textX, 52);
    this.ctx.restore();

    // 🌟 10秒パワーアップゲージ（火力増強 ＆ 2方向ショット）
    if (this.player.powerupTimer > 0 && this.player.powerupType) {
      const pType = this.player.powerupType;
      const curT = this.player.powerupTimer;
      const maxT = this.player.powerupMaxTime || (CONSTANTS.POWERUP ? CONSTANTS.POWERUP.DURATION : 600);
      const ratio = Math.max(0, Math.min(1, curT / maxT));
      const sec = Math.ceil(curT / 60);

      // 点滅警告（残り3秒 = 180フレーム以下）
      const warnTime = (CONSTANTS.POWERUP ? CONSTANTS.POWERUP.WARN_TIME : 180);
      const isWarn = curT <= warnTime;
      const blinkAlpha = isWarn ? (Math.floor(curT / 8) % 2 === 0 ? 0.35 : 1.0) : 1.0;

      const barW = 210;
      const barH = 26;
      const barX = (CONSTANTS.CANVAS_WIDTH - barW) / 2;
      const barY = 12;

      this.ctx.save();
      this.ctx.globalAlpha = blinkAlpha;

      // 外枠カプセル背景
      this.ctx.fillStyle = 'rgba(15, 15, 25, 0.72)';
      this.ctx.beginPath();
      this.ctx.roundRect(barX, barY, barW, barH, 13);
      this.ctx.fill();
      this.ctx.lineWidth = 1.8;
      this.ctx.strokeStyle = (pType === 'fire') ? '#ff3b30' : '#00f5d4';
      this.ctx.stroke();

      // 内側プログレスバー
      const fillW = Math.max(0, (barW - 8) * ratio);
      if (fillW > 0) {
        const barGrad = this.ctx.createLinearGradient(barX + 4, 0, barX + 4 + fillW, 0);
        if (pType === 'fire') {
          barGrad.addColorStop(0, '#ff3b30');
          barGrad.addColorStop(1, '#ff9500');
        } else {
          barGrad.addColorStop(0, '#00f5d4');
          barGrad.addColorStop(1, '#ffd166');
        }
        this.ctx.fillStyle = barGrad;
        this.ctx.beginPath();
        this.ctx.roundRect(barX + 4, barY + 4, fillW, barH - 8, 9);
        this.ctx.fill();
      }

      // アイコン＆テキスト表示
      const icon = (pType === 'fire') ? '🌶️' : '⭐';
      const label = (pType === 'fire') ? `POWER UP! ${sec}s` : `2-WAY SHOT! ${sec}s`;
      this.ctx.font = 'bold 12px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
      this.ctx.shadowBlur = 4;
      this.ctx.fillText(`${icon} ${label}`, CONSTANTS.CANVAS_WIDTH / 2, barY + 17);

      this.ctx.restore();
    }

    if (this.player.feverTimer > 0) {
      this.ctx.fillStyle = '#ff4d6d';
      this.ctx.font = 'bold 18px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.textAlign = 'center';
      const sec = Math.ceil(this.player.feverTimer / 60);
      this.ctx.fillText(`✨ またたびフィーバー！ 無敵ダッシュ: ${sec}秒 ✨`, CONSTANTS.CANVAS_WIDTH / 2, 68);
    }
  }

  drawStageBanner() {
    const info = CONSTANTS.STAGES[this.currentStage];
    if (!info) return;

    const alpha = Math.min(1, this.stageBannerTimer / 30);
    this.ctx.save();
    this.ctx.globalAlpha = alpha;

    const boxW = 480;
    const boxH = 68;
    const x = (CONSTANTS.CANVAS_WIDTH - boxW) / 2;
    const y = 85;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, boxW, boxH, 14);
    this.ctx.fill();

    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#ffd166';
    this.ctx.stroke();

    this.ctx.fillStyle = '#ffd166';
    this.ctx.font = 'bold 22px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${info.name}: ${info.title}`, CONSTANTS.CANVAS_WIDTH / 2, y + 30);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '13px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText(info.subtitle, CONSTANTS.CANVAS_WIDTH / 2, y + 52);

    this.ctx.restore();
  }

  drawControlGuide() {
    if (this.controlGuideTimer <= 0) return;
    const maxTime = 260;
    let alpha = 1.0;
    if (this.controlGuideTimer > maxTime - 25) {
      alpha = (maxTime - this.controlGuideTimer) / 25; // ふんわりフェードイン
    } else if (this.controlGuideTimer < 35) {
      alpha = this.controlGuideTimer / 35; // スッとフェードアウト
    }

    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    const boxW = 680;
    const boxH = 46;
    const x = (CONSTANTS.CANVAS_WIDTH - boxW) / 2;
    const y = CONSTANTS.CANVAS_HEIGHT - boxH - 18; // Y = 476

    // 半透明フロストガラス背景
    ctx.fillStyle = 'rgba(18, 20, 32, 0.85)';
    ctx.beginPath();
    ctx.roundRect(x, y, boxW, boxH, 23);
    ctx.fill();

    // ゴールドの繊細な枠線
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.85)';
    ctx.stroke();

    // ガイドテキスト
    ctx.font = 'bold 15px ' + CONSTANTS.FONT_FAMILY;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    const isCat = (this.selectedCharacter === 'cat');
    const guideText = isCat
      ? '🐾 そうさ:   [←][→] いどう   ｜   [Space] ジャンプ   ｜   [Z] こうげき / ひっさつわざ'
      : '🍙 そうさ:   [←][→] いどう   ｜   [Space] ジャンプ   ｜   [Z] うめぼし / ひっさつわざ';

    ctx.fillText(guideText, CONSTANTS.CANVAS_WIDTH / 2, y + boxH / 2);

    ctx.restore();
  }

  drawHeart(ctx, x, y, size, filled, isSuper = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    const s = size * 0.5;
    ctx.moveTo(0, -s * 0.3);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.8, -s, -s * 0.2, 0, s * 0.8);
    ctx.bezierCurveTo(s, -s * 0.2, s * 0.5, -s * 0.8, 0, -s * 0.3);

    if (filled) {
      if (isSuper) {
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffea00';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else {
        ctx.fillStyle = CONSTANTS.COLORS.HEART_RED;
        ctx.fill();
      }
    } else {
      ctx.fillStyle = isSuper ? 'rgba(255, 215, 0, 0.2)' : CONSTANTS.COLORS.HEART_BG;
      ctx.fill();
      ctx.strokeStyle = isSuper ? '#ffd700' : '#ff9ebb';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // 🎬 ボス登場シネマティック演出描画（こけしデザイン監修）
  // =========================================================================

  // ★ シネマスコープ黒帯（上下レターボックス）
  drawLetterbox() {
    const ctx = this.ctx;
    const W = CONSTANTS.CANVAS_WIDTH;
    const H = CONSTANTS.CANVAS_HEIGHT;
    const h = Math.round(this.letterboxH);
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, W, h);
    ctx.fillRect(0, H - h, W, h);
  }

  // ★ ホワイトフラッシュ（画面全体閃光）
  drawWhiteFlash() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, this.whiteFlash)})`;
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
    ctx.restore();
  }

  // ★ ボス登場シネマティック演出本体
  drawBossIntroCinematic() {
    const ctx = this.ctx;
    const W = CONSTANTS.CANVAS_WIDTH;
    const H = CONSTANTS.CANVAS_HEIGHT;
    const t = this.bossIntroTimer;
    const info = this.getBossInfo();

    // 1. スキップ案内（画面右下・控えめなパルス）
    if (this.bossIntroPhase !== 'DIALOG') {
      ctx.save();
      const skipAlpha = 0.5 + Math.sin(Date.now() / 250) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${skipAlpha})`;
      ctx.font = 'bold 12px ' + CONSTANTS.FONT_FAMILY;
      ctx.textAlign = 'right';
      ctx.fillText('▶ [Space] または タップ でスキップ', W - 20, H - Math.max(16, this.letterboxH + 12));
      ctx.restore();
    }

    // 2. Phase 2 (SLOW): 緊張のWARNINGサイン & ヴィネット
    if (this.bossIntroPhase === 'SLOW') {
      ctx.save();

      // 四隅のシネマティック・ヴィネット
      const vig = ctx.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, W * 0.7);
      vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vig.addColorStop(1, 'rgba(15, 5, 10, 0.45)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // 上部 WARNING 点滅バナー
      const warnPulse = (Math.sin(Date.now() / 120) + 1) * 0.5;
      const warnY = this.letterboxH + 36;
      ctx.fillStyle = `rgba(230, 57, 70, ${0.75 + warnPulse * 0.25})`;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 140, warnY - 18, 280, 34, 17);
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffd166';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px ' + CONSTANTS.FONT_FAMILY;
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ WARNING: STRONG ENEMY ⚠️', W / 2, warnY + 5);

      ctx.restore();
    }

    // 3. Phase 3 (IMPACT): カービィ風ポップ＆ゴージャス BOSS CUT-IN BANNER
    if (this.bossIntroPhase === 'IMPACT') {
      ctx.save();
      const p = Math.min(1.0, this.bossCutinProgress);
      // スケールイン（1.3 -> 1.0 にズバッと飛び込み）
      const scale = 1.0 + (1.0 - p) * 0.35;
      const centerY = H / 2 - 10;

      ctx.translate(W / 2, centerY);
      ctx.scale(scale, scale);

      // 背景の斜めアクセントリボン（深紅 ＆ ゴールドライン）
      const ribbonH = 110;
      ctx.fillStyle = 'rgba(20, 10, 25, 0.88)';
      ctx.beginPath();
      ctx.moveTo(-W / 2 - 50, -ribbonH / 2);
      ctx.lineTo(W / 2 + 50, -ribbonH / 2 + 10);
      ctx.lineTo(W / 2 + 50, ribbonH / 2 + 10);
      ctx.lineTo(-W / 2 - 50, ribbonH / 2);
      ctx.closePath();
      ctx.fill();

      // ゴールドボーダー（上下ライン）
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffd166';
      ctx.beginPath();
      ctx.moveTo(-W / 2 - 50, -ribbonH / 2);
      ctx.lineTo(W / 2 + 50, -ribbonH / 2 + 10);
      ctx.moveTo(-W / 2 - 50, ribbonH / 2);
      ctx.lineTo(W / 2 + 50, ribbonH / 2 + 10);
      ctx.stroke();

      // エンブレムバッジ
      ctx.fillStyle = info.color || '#ffb703';
      ctx.beginPath();
      ctx.roundRect(-100, -ribbonH / 2 - 14, 200, 26, 13);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#2b2d42';
      ctx.font = '900 13px ' + CONSTANTS.FONT_FAMILY;
      ctx.textAlign = 'center';
      ctx.fillText(info.badge, 0, -ribbonH / 2 + 4);

      // ボス二つ名
      ctx.fillStyle = '#ffd166';
      ctx.font = 'bold 16px ' + CONSTANTS.FONT_FAMILY;
      ctx.textAlign = 'center';
      ctx.fillText(`── ${info.title} ──`, 0, -10);

      // ボス名（極太ポップフォントでド迫力表示！）
      ctx.font = '900 36px ' + CONSTANTS.FONT_FAMILY;
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#1a0910';
      ctx.strokeText(info.name, 0, 36);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(info.name, 0, 36);

      ctx.restore();
    }
  }

  drawBossIntroDialog() {
    const d = this.introDialogs[this.introStep];
    if (!d) return;

    const boxW = CONSTANTS.CANVAS_WIDTH - 120;
    const boxH = 110;
    const boxX = 60;
    const boxY = CONSTANTS.CANVAS_HEIGHT - 135;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxW, boxH, 16);
    this.ctx.fill();

    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = '#ffd166';
    this.ctx.stroke();

    this.ctx.fillStyle = d.color;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX + 20, boxY - 14, 340, 28, 14);
    this.ctx.fill();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 15px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(d.speaker, boxX + 190, boxY + 5);

    this.ctx.fillStyle = '#2b2d42';
    this.ctx.font = 'bold 17px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.textAlign = 'left';
    this.ctx.fillText(d.text, boxX + 30, boxY + 55);

    const pulse = (Math.sin(Date.now() / 200) + 1) * 0.5;
    this.ctx.fillStyle = `rgba(255, 77, 109, ${0.6 + pulse * 0.4})`;
    this.ctx.font = 'bold 14px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.textAlign = 'right';
    this.ctx.fillText('▶ [Space] または 画面タップ でつぎへ', boxX + boxW - 25, boxY + boxH - 15);
  }

  drawTitleScreen() {
    const ctx = this.ctx;
    const W = CONSTANTS.CANVAS_WIDTH;
    const H = CONSTANTS.CANVAS_HEIGHT;

    // 1. 🌟 キービジュアル一枚絵の描画（右下ウォーターマークをクロップ除外して全画面描画）
    if (this.titleBgLoaded && this.titleBgImg) {
      const sw = 1024;
      const sh = 550; // 下部35pxのウォーターマークをスキップ
      ctx.drawImage(this.titleBgImg, 0, 0, sw, sh, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#74b9ff';
      ctx.fillRect(0, 0, W, H);
    }

    // 2. シネマティック・グラデーション（上部ロゴ＆下部ボタンの視認性を劇的向上）
    const topGrad = ctx.createLinearGradient(0, 0, 0, 240);
    topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.46)');
    topGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.22)');
    topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, W, 240);

    const btmGrad = ctx.createLinearGradient(0, H - 90, 0, H);
    btmGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    btmGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    btmGrad.addColorStop(1, 'rgba(0, 0, 0, 0.70)');
    ctx.fillStyle = btmGrad;
    ctx.fillRect(0, H - 90, W, 90);

    // 3. 🌟 タイトルロゴ（白フチ＋二重シャドウ付きの輝くロゴ - センター配置）
    ctx.save();
    ctx.textAlign = 'center';
    
    // ロゴの黄金グロー
    ctx.shadowColor = 'rgba(255, 230, 120, 0.9)';
    ctx.shadowBlur = 25;

    ctx.font = '900 48px ' + CONSTANTS.FONT_FAMILY;
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeText('🐾 にゃんこタウン大冒険！ 🐾', W / 2, 150);
    ctx.fillStyle = '#ff3366';
    ctx.fillText('🐾 にゃんこタウン大冒険！ 🐾', W / 2, 150);

    // サブタイトル
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.font = 'bold 21px ' + CONSTANTS.FONT_FAMILY;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1d1e2c';
    ctx.strokeText('〜 全8大ステージ！天空城を目指す大冒険 〜', W / 2, 192);
    ctx.fillStyle = '#ffd166';
    ctx.fillText('〜 全8大ステージ！天空城を目指す大冒険 〜', W / 2, 192);
    ctx.restore();

    // 3.5. 🏆 自己ベストバッジ ＆ 全国ランキングボタン
    ctx.save();
    ctx.textAlign = 'center';
    if (this.highScore > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.60)';
      ctx.beginPath();
      ctx.roundRect(W / 2 - 200, 216, 400, 32, 16);
      ctx.fill();
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'bold 15px ' + CONSTANTS.FONT_FAMILY;
      ctx.fillStyle = '#ffd166';
      ctx.fillText(`👑 あなたの自己ベスト: ${this.highScore.toLocaleString()} 点 (到達: STAGE ${this.bestStage})`, W / 2, 237);
    }

    // 🏆 全国ランキングを見るボタン（画面中心 Y=270付近）
    const rankBtnW = 280;
    const rankBtnH = 40;
    const rankBtnX = (W - rankBtnW) / 2;
    const rankBtnY = 268;

    const rankGrad = ctx.createLinearGradient(rankBtnX, rankBtnY, rankBtnX, rankBtnY + rankBtnH);
    rankGrad.addColorStop(0, '#ffd166');
    rankGrad.addColorStop(1, '#f77f00');
    ctx.fillStyle = rankGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(rankBtnX, rankBtnY, rankBtnW, rankBtnH, 20);
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#1d3557';
    ctx.font = 'bold 17px ' + CONSTANTS.FONT_FAMILY;
    ctx.shadowBlur = 0;
    ctx.fillText('🏆 全国ランキングを見る', W / 2, rankBtnY + 26);
    ctx.restore();

    // 4. スタート案内（明滅アニメーションボタン）
    const pulse = (Math.sin(Date.now() / 220) + 1) * 0.5;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255, 77, 109, 0.95)';
    ctx.shadowBlur = 14 + pulse * 16;

    ctx.font = '900 24px ' + CONSTANTS.FONT_FAMILY;
    ctx.strokeStyle = '#800f2f';
    ctx.lineWidth = 4.5;
    ctx.strokeText('▶ [Space] または 画面クリック でキャラクター選択へ！ ◀', W / 2, 485);
    ctx.fillStyle = '#ffe066';
    ctx.fillText('▶ [Space] または 画面クリック でキャラクター選択へ！ ◀', W / 2, 485);
    ctx.restore();
  }

  // =========================================================================
  // 🍙 キャラクター選択画面（こけしデザイン＆みかど世界観UI）
  // =========================================================================
  drawCharSelectScreen() {
    const ctx = this.ctx;
    const now = Date.now();
    const W = CONSTANTS.CANVAS_WIDTH;
    const H = CONSTANTS.CANVAS_HEIGHT;

    // 🌟 キービジュアルをうっすら敷いて世界観の一体感を演出
    if (this.titleBgLoaded && this.titleBgImg) {
      ctx.drawImage(this.titleBgImg, 0, 0, 1024, 550, 0, 0, W, H);
      ctx.fillStyle = 'rgba(250, 245, 255, 0.88)';
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = 'rgba(250, 245, 255, 0.94)';
      ctx.fillRect(0, 0, W, H);
    }

    // タイトルバナー（サブタイトルトルに伴い、少し下に配置して心地よい余白を演出）
    ctx.textAlign = 'center';
    ctx.fillStyle = '#2b2d42';
    ctx.font = 'bold 36px ' + CONSTANTS.FONT_FAMILY;
    ctx.fillText('🍙 キャラクターを えらんでね！ 🐾', CONSTANTS.CANVAS_WIDTH / 2, 76);

    const isCat = (this.cursorCharacter === 'cat');
    const isOnigiri = (this.cursorCharacter === 'onigiri');

    const cardW = 360;
    const cardH = 300;
    const cardY = 120;

    // =======================================================================
    // 🐾 左カード: ねこ
    // =======================================================================
    const catCardX = 90;
    const catBounce = isCat ? Math.sin(now / 160) * 4 : 0;

    ctx.save();
    ctx.translate(catCardX, cardY + catBounce);

    // カード枠
    ctx.fillStyle = isCat ? '#ffffff' : 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 20);
    ctx.fill();

    if (isCat) {
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = '#ff4d6d';
      ctx.shadowColor = 'rgba(255, 77, 109, 0.6)';
      ctx.shadowBlur = 16;
    } else {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#dee2e6';
      ctx.shadowBlur = 0;
    }
    ctx.stroke();

    // ヘッダーバナー
    ctx.shadowBlur = 0;
    ctx.fillStyle = isCat ? '#ff4d6d' : '#adb5bd';
    ctx.beginPath();
    ctx.roundRect(14, 14, cardW - 28, 42, 14);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px ' + CONSTANTS.FONT_FAMILY;
    ctx.textAlign = 'center';
    ctx.fillText('🐾 ねこ', cardW / 2, 43);

    // プレビュー表示エリア（上下アキを均等調整し中央に大きく配置）
    const catPreviewCX = cardW / 2;
    const catPreviewCY = 155;

    // 足元のソフトシャドウ
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.ellipse(catPreviewCX, catPreviewCY + 50, 46, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // ねこスプライト描画（105x84へスケールアップして見応え抜群に！）
    if (this.player.spriteLoaded && this.player.spriteImg) {
      const sheetW = this.player.spriteImg.naturalWidth || this.player.spriteImg.width;
      const sheetH = this.player.spriteImg.naturalHeight || this.player.spriteImg.height;
      const colW = sheetW / 4;
      const rowH = sheetH / 2;
      const walkCycle = Math.floor(now / 150) % 4;
      const walkCols = [1, 2, 3, 2];
      const col = isCat ? walkCols[walkCycle] : 0;
      const row = 0;

      const sprW = 105;
      const sprH = 84;
      ctx.drawImage(
        this.player.spriteImg,
        col * colW, row * rowH, colW, rowH,
        catPreviewCX - sprW / 2, catPreviewCY - sprH / 2 + 6, sprW, sprH
      );
    }

    // 選択中バッジ
    if (isCat) {
      ctx.fillStyle = '#ff4d6d';
      ctx.font = 'bold 18px ' + CONSTANTS.FONT_FAMILY;
      ctx.textAlign = 'center';
      ctx.fillText('✨ せんたく中！ ✨', cardW / 2, 256);
    } else {
      ctx.fillStyle = '#adb5bd';
      ctx.font = 'bold 15px ' + CONSTANTS.FONT_FAMILY;
      ctx.textAlign = 'center';
      ctx.fillText('タップで選択', cardW / 2, 256);
    }
    ctx.restore();

    // =======================================================================
    // 🍙 右カード: おにぎり（手書きイラスト完全再現プレビュー）
    // =======================================================================
    const oniCardX = 510;
    const oniBounce = isOnigiri ? Math.sin(now / 160) * 4 : 0;

    ctx.save();
    ctx.translate(oniCardX, cardY + oniBounce);

    // カード枠
    ctx.fillStyle = isOnigiri ? '#ffffff' : 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 20);
    ctx.fill();

    if (isOnigiri) {
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = '#e63946';
      ctx.shadowColor = 'rgba(230, 57, 70, 0.6)';
      ctx.shadowBlur = 16;
    } else {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#dee2e6';
      ctx.shadowBlur = 0;
    }
    ctx.stroke();

    // ヘッダーバナー
    ctx.shadowBlur = 0;
    ctx.fillStyle = isOnigiri ? '#e63946' : '#adb5bd';
    ctx.beginPath();
    ctx.roundRect(14, 14, cardW - 28, 42, 14);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px ' + CONSTANTS.FONT_FAMILY;
    ctx.textAlign = 'center';
    ctx.fillText('🍙 おにぎり', cardW / 2, 43);

    // おにぎりプレビューアニメーション（上下アキを均等調整し1.3倍にスケールアップ）
    const oniPreviewCX = cardW / 2;
    const oniPreviewCY = 155;

    ctx.save();
    ctx.translate(oniPreviewCX, oniPreviewCY);
    const stepBob = isOnigiri ? Math.sin(now / 140) * 3 : 0;
    ctx.translate(0, stepBob);
    ctx.scale(1.3, 1.3);

    // 足元のソフトシャドウ
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.ellipse(0, 27, 26, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. 足
    ctx.strokeStyle = '#383838';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    const legWiggle = isOnigiri ? Math.sin(now / 140) * 4 : 0;
    ctx.beginPath();
    ctx.moveTo(-8, 16); ctx.lineTo(-8 + legWiggle, 24);
    ctx.moveTo(8, 16); ctx.lineTo(8 - legWiggle, 24);
    ctx.stroke();

    // 2. ふっくら三角ボディ
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.bezierCurveTo(14, -16, 23, 2, 22, 17);
    ctx.bezierCurveTo(14, 20, -14, 20, -22, 17);
    ctx.bezierCurveTo(-23, 2, -14, -16, 0, -22);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3.2;
    ctx.strokeStyle = '#3a3838';
    ctx.stroke();

    // 3. 海苔
    ctx.fillStyle = '#1c1c1e';
    ctx.beginPath();
    ctx.roundRect(-9, 5, 18, 14, [2, 2, 3, 3]);
    ctx.fill();
    ctx.strokeStyle = '#3a3838';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 4. 顔（つぶらな目・赤ほっぺ・口）
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.arc(-5, -3, 1.8, 0, Math.PI * 2);
    ctx.arc(5, -3, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 赤ほっぺ
    ctx.fillStyle = '#ff4d6d';
    ctx.beginPath();
    ctx.ellipse(-11, -1, 3.5, 2.0, 0, 0, Math.PI * 2);
    ctx.ellipse(11, -1, 3.5, 2.0, 0, 0, Math.PI * 2);
    ctx.fill();

    // 口
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-2, 0); ctx.quadraticCurveTo(0, 1.8, 2, 0);
    ctx.stroke();

    // 5. 手
    ctx.strokeStyle = '#383838';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(-18, 1, 3.8, Math.PI * 0.6, Math.PI * 1.8, false);
    ctx.arc(18, 1, 3.8, -Math.PI * 0.8, Math.PI * 0.4, false);
    ctx.stroke();

    // 6. 頭上のハート（選択中ならふわふわ浮かぶ）
    if (isOnigiri) {
      const heartFloatY = -28 - (now % 1000) / 40;
      const heartAlpha = 1 - (now % 1000) / 1000;
      ctx.save();
      ctx.translate(6, heartFloatY);
      ctx.globalAlpha = heartAlpha;
      ctx.fillStyle = '#ff4d6d';
      ctx.beginPath();
      const hs = 5;
      ctx.moveTo(0, -hs * 0.3);
      ctx.bezierCurveTo(-hs * 0.5, -hs * 0.85, -hs, -hs * 0.25, 0, hs * 0.85);
      ctx.bezierCurveTo(hs, -hs * 0.25, hs * 0.5, -hs * 0.85, 0, -hs * 0.3);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 選択中バッジ
    if (isOnigiri) {
      ctx.fillStyle = '#e63946';
      ctx.font = 'bold 18px ' + CONSTANTS.FONT_FAMILY;
      ctx.textAlign = 'center';
      ctx.fillText('✨ せんたく中！ ✨', cardW / 2, 256);
    } else {
      ctx.fillStyle = '#adb5bd';
      ctx.font = 'bold 15px ' + CONSTANTS.FONT_FAMILY;
      ctx.textAlign = 'center';
      ctx.fillText('タップで選択', cardW / 2, 256);
    }
    ctx.restore();

    // =======================================================================
    // 決定スタートボタン（文字が美しく収まるよう動的幅＋贅沢な左右パディングを確保）
    // =======================================================================
    const selectedName = isCat ? '🐾 ねこ' : '🍙 おにぎり';
    const btnText = `▶ 【${selectedName}】 で冒険スタート！ [Space] ◀`;

    ctx.save();
    ctx.font = 'bold 20px ' + CONSTANTS.FONT_FAMILY;
    const textW = ctx.measureText(btnText).width;
    const btnW = Math.max(540, Math.ceil(textW + 64)); // 左右に32px以上の余裕あるパディング
    const btnH = 52;
    const btnX = (CONSTANTS.CANVAS_WIDTH - btnW) / 2;
    const btnY = 452;

    const btnPulse = (Math.sin(now / 180) + 1) * 0.5;
    ctx.fillStyle = isCat ? '#ff4d6d' : '#e63946';
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 16);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffd166';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 10 + btnPulse * 8;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(btnText, CONSTANTS.CANVAS_WIDTH / 2, btnY + 33);
    ctx.restore();
  }

  drawClearScreen() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
    this.ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    const info = CONSTANTS.STAGES[this.currentStage] || { title: `ステージ ${this.currentStage}` };
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#ff4d6d';
    this.ctx.font = 'bold 44px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText(`🎉 STAGE ${this.currentStage} CLEAR! 🎉`, CONSTANTS.CANVAS_WIDTH / 2, 160);

    this.ctx.fillStyle = '#2b2d42';
    this.ctx.font = 'bold 22px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText(`${info.title} を見事突破したニャ！`, CONSTANTS.CANVAS_WIDTH / 2, 215);

    this.ctx.fillStyle = '#ffb703';
    this.ctx.font = 'bold 30px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText(`CURRENT SCORE: ${this.score}`, CONSTANTS.CANVAS_WIDTH / 2, 280);

    const nextStageName = CONSTANTS.STAGES[this.currentStage + 1]?.title || '次ステージ';
    const btnText = `▶ [Space] または タップ で ${nextStageName} へ！ ◀`;

    this.ctx.save();
    let fontSize = 20;
    this.ctx.font = `bold ${fontSize}px ${CONSTANTS.FONT_FAMILY}`;
    let textMetrics = this.ctx.measureText ? this.ctx.measureText(btnText) : { width: 440 };
    let textWidth = (textMetrics && textMetrics.width) ? textMetrics.width : 440;

    // 長いステージ名でも画面幅を絶対に超えないようフォントサイズをセーフティ調整
    while (textWidth > CONSTANTS.CANVAS_WIDTH - 120 && fontSize > 15) {
      fontSize--;
      this.ctx.font = `bold ${fontSize}px ${CONSTANTS.FONT_FAMILY}`;
      textWidth = this.ctx.measureText(btnText).width;
    }

    // 左右にゆったりしたパディング（左右各36px）を持たせてボタン幅を動的決定（文字のはみ出しを完全解消）
    const padX = 36;
    const btnW = Math.max(520, Math.min(CONSTANTS.CANVAS_WIDTH - 60, textWidth + padX * 2));
    const btnH = 58;
    const btnX = (CONSTANTS.CANVAS_WIDTH - btnW) / 2;
    const btnY = 340;

    // ボタンのパルス光彩効果（星のカービィ風ポップ＆ジューシー演出）
    const pulse = (Math.sin(Date.now() / 200) + 1) * 0.5;

    // ボタン背景グラデーション（鮮やかなエメラルドミント〜ターコイズ）
    const grad = this.ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
    grad.addColorStop(0, '#00f5d4');
    grad.addColorStop(1, '#05c7ac');
    this.ctx.fillStyle = grad;

    this.ctx.beginPath();
    this.ctx.roundRect(btnX, btnY, btnW, btnH, 18);
    this.ctx.fill();

    // ボタン外枠ボーダー（白フチ＆発光シャドウでポップに際立たせる）
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.shadowColor = 'rgba(0, 245, 212, 0.60)';
    this.ctx.shadowBlur = 10 + pulse * 6;
    this.ctx.stroke();

    // シャドウリセットしてテキスト描画（上下完全センタリング）
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#0f172a';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(btnText, CONSTANTS.CANVAS_WIDTH / 2, btnY + btnH / 2);
    this.ctx.restore();
  }

  drawAllClearScreen() {
    const W = CONSTANTS.CANVAS_WIDTH;
    const H = CONSTANTS.CANVAS_HEIGHT;

    // 1. 🎊 祝祭エンディング大パレード一枚絵の全画面描画
    if (this.endingBgLoaded && this.endingBgImg) {
      const imgW = this.endingBgImg.naturalWidth || 1280;
      const imgH = this.endingBgImg.naturalHeight || 719;
      // 画面比率 (800x480 = 5:3) に合わせて中央トリミング
      const targetRatio = W / H;
      const srcRatio = imgW / imgH;
      let cropW = imgW;
      let cropH = imgH;
      let cropX = 0;
      let cropY = 0;
      if (srcRatio > targetRatio) {
        cropW = imgH * targetRatio;
        cropX = (imgW - cropW) / 2;
      } else {
        cropH = imgW / targetRatio;
        cropY = (imgH - cropH) / 2;
      }
      this.ctx.drawImage(this.endingBgImg, cropX, cropY, cropW, cropH, 0, 0, W, H);

      // 上部シネマティック・グラデーション（文字視認性向上）
      const topGrad = this.ctx.createLinearGradient(0, 0, 0, 125);
      topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.76)');
      topGrad.addColorStop(0.70, 'rgba(0, 0, 0, 0.35)');
      topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = topGrad;
      this.ctx.fillRect(0, 0, W, 125);

      // 下部シネマティック・グラデーション（操作案内視認性向上）
      const btmGrad = this.ctx.createLinearGradient(0, H - 100, 0, H);
      btmGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      btmGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.65)');
      btmGrad.addColorStop(1, 'rgba(0, 0, 0, 0.90)');
      this.ctx.fillStyle = btmGrad;
      this.ctx.fillRect(0, H - 100, W, 100);

      // タイトル＆祝賀メッセージ
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#ffea00';
      this.ctx.font = 'bold 34px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      this.ctx.shadowBlur = 10;
      this.ctx.fillText('🎊 ALL STAGES CLEAR! 完全制覇！ 🎊', W / 2, 40);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 17px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.fillText('街のみんなと仲良し大団円！平和と笑顔が戻ったニャ！', W / 2, 68);

      this.ctx.fillStyle = '#ffd166';
      this.ctx.font = 'bold 19px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.fillText(`★ 最終ハイスコア: ${this.score.toLocaleString()} 点 ★`, W / 2, 96);

      // 🌟 以前の「▶ [Space] または 画面タップで… ◀」はひろあき軍曹のご指示により「トルツメ」完了！

      // =======================================================================
      // 🏆 1. 殿堂入りランキングに登録ボタン (左側)
      // =======================================================================
      const btnW = 360;
      const btnH = 48;
      const btnX = 160;
      const btnY = 472;

      this.ctx.save();
      const grad = this.ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
      if (this.hasSubmittedGameOver) {
        grad.addColorStop(0, '#495057');
        grad.addColorStop(1, '#343a40');
        this.ctx.fillStyle = grad;
        this.ctx.shadowBlur = 0;
      } else {
        grad.addColorStop(0, '#ffd166');
        grad.addColorStop(1, '#f77f00');
        this.ctx.fillStyle = grad;
        this.ctx.shadowColor = 'rgba(255, 209, 102, 0.8)';
        this.ctx.shadowBlur = 14;
      }
      this.ctx.beginPath();
      this.ctx.roundRect(btnX, btnY, btnW, btnH, 24);
      this.ctx.fill();

      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = this.hasSubmittedGameOver ? '#adb5bd' : '#ffffff';
      this.ctx.stroke();

      this.ctx.fillStyle = this.hasSubmittedGameOver ? '#f8f9fa' : '#1d3557';
      this.ctx.font = 'bold 16px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.shadowBlur = 0;
      const btnText = this.hasSubmittedGameOver
        ? '✅ 殿堂入り登録済み（順位を見る）'
        : '🏆 全国ランキングに殿堂入り登録！';
      this.ctx.fillText(btnText, btnX + btnW / 2, btnY + 30);
      this.ctx.restore();

      // =======================================================================
      // 🏠 2. 「オープニング」ボタン (右側)
      // =======================================================================
      const openBtnW = 250;
      const openBtnH = 48;
      const openBtnX = 550;
      const openBtnY = 472;

      this.ctx.save();
      const openGrad = this.ctx.createLinearGradient(openBtnX, openBtnY, openBtnX, openBtnY + openBtnH);
      openGrad.addColorStop(0, '#06d6a0');
      openGrad.addColorStop(1, '#007f5f');
      this.ctx.fillStyle = openGrad;
      this.ctx.shadowColor = 'rgba(6, 214, 160, 0.6)';
      this.ctx.shadowBlur = 14;
      this.ctx.beginPath();
      this.ctx.roundRect(openBtnX, openBtnY, openBtnW, openBtnH, 24);
      this.ctx.fill();

      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.stroke();

      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 17px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.fillText('🏠 オープニング', openBtnX + openBtnW / 2, openBtnY + 30);
      this.ctx.restore();
      return;
    }

    // ── ベクターフォールバック ──
    // 祝祭の夜空背景
    const grad = this.ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
    grad.addColorStop(0, '#12002b');
    grad.addColorStop(0.5, '#2e0854');
    grad.addColorStop(1, '#521262');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // タイトル＆祝賀メッセージ
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#ffea00';
    this.ctx.font = 'bold 44px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.shadowColor = '#ffea00';
    this.ctx.shadowBlur = 20;
    this.ctx.fillText('🎊 ALL STAGES CLEAR! 完全制覇！ 🎊', CONSTANTS.CANVAS_WIDTH / 2, 100);

    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 22px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText('街のボスねこ達と仲直りして、平和が戻ったニャ！', CONSTANTS.CANVAS_WIDTH / 2, 150);

    this.ctx.fillStyle = '#ffd166';
    this.ctx.font = 'bold 26px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText(`★ 最終ハイスコア: ${this.score} 点 ★`, CONSTANTS.CANVAS_WIDTH / 2, 200);

    // 🐾 改心したボスたち＆主人公のなかよし大行進パレード！
    const paradeBaseX = (this.paradeTimer * 2.2) % (CONSTANTS.CANVAS_WIDTH + 600) - 100;
    const marchY = 380;
    const bounce = Math.sin(this.paradeTimer * 0.18) * 8;

    this.ctx.save();
    // 1. 先頭：主人公（ねこ または おにぎり）
    if (this.selectedCharacter === 'onigiri') {
      // 🍙 おにぎり行進！
      this.ctx.save();
      this.ctx.translate(paradeBaseX, marchY + bounce);

      // 三角ボディ
      this.ctx.beginPath();
      this.ctx.moveTo(0, -22);
      this.ctx.bezierCurveTo(14, -16, 23, 2, 22, 17);
      this.ctx.bezierCurveTo(14, 20, -14, 20, -22, 17);
      this.ctx.bezierCurveTo(-23, 2, -14, -16, 0, -22);
      this.ctx.closePath();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#3a3838';
      this.ctx.stroke();

      // 海苔
      this.ctx.fillStyle = '#1c1c1e';
      this.ctx.beginPath();
      this.ctx.roundRect(-9, 5, 18, 14, [2, 2, 3, 3]);
      this.ctx.fill();

      // 目・赤ほっぺ
      this.ctx.fillStyle = '#222222';
      this.ctx.beginPath();
      this.ctx.arc(-5, -3, 1.8, 0, Math.PI * 2);
      this.ctx.arc(5, -3, 1.8, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ff4d6d';
      this.ctx.beginPath();
      this.ctx.ellipse(-11, -1, 3.5, 2.0, 0, 0, Math.PI * 2);
      this.ctx.ellipse(11, -1, 3.5, 2.0, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // 頭上ハート
      this.ctx.fillStyle = '#ff4d6d';
      this.ctx.beginPath();
      const hs = 6;
      this.ctx.moveTo(0, -32);
      this.ctx.bezierCurveTo(-hs * 0.5, -36, -hs, -30, 0, -24);
      this.ctx.bezierCurveTo(hs, -30, hs * 0.5, -36, 0, -32);
      this.ctx.fill();
      this.ctx.restore();

      this.ctx.fillStyle = '#e63946';
      this.ctx.font = 'bold 15px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.fillText('🍙 おにぎり', paradeBaseX, marchY + 45);
    } else {
      // 🐾 白ねこちゃん行進！
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(paradeBaseX, marchY + bounce, 24, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#ff758f';
      this.ctx.font = 'bold 15px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.fillText('🐾 白ねこ', paradeBaseX, marchY + 45);
    }

    // 2. ぜいたくボスねこ
    this.ctx.fillStyle = '#ffd166';
    this.ctx.beginPath();
    this.ctx.arc(paradeBaseX - 90, marchY - bounce, 32, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#ffd166';
    this.ctx.fillText('👑 ぜいたく', paradeBaseX - 90, marchY + 45);

    // 3. レディ・ミャウミャウ
    this.ctx.fillStyle = '#ff007f';
    this.ctx.beginPath();
    this.ctx.arc(paradeBaseX - 190, marchY + bounce, 30, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#ff007f';
    this.ctx.fillText('🛍️ レディ', paradeBaseX - 190, marchY + 45);

    // 4. ドン・ニャルレオーネ
    this.ctx.fillStyle = '#1c1917';
    this.ctx.beginPath();
    this.ctx.arc(paradeBaseX - 290, marchY - bounce, 34, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#c99738';
    this.ctx.fillText('🎩 ドン', paradeBaseX - 290, marchY + 45);

    // 5. ネズミたちも行進
    this.ctx.fillStyle = '#adb5bd';
    this.ctx.beginPath();
    this.ctx.arc(paradeBaseX - 380, marchY + bounce * 0.5, 14, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillText('🧀', paradeBaseX - 380, marchY + 35);
    this.ctx.restore();

    // 🌟 以前の「▶ [Space] または 画面タップで… ◀」はひろあき軍曹のご指示により「トルツメ」完了！

    // =========================================================================
    // 🏆 1. 殿堂入りランキングに登録ボタン (左側)
    // =========================================================================
    const btnW = 360;
    const btnH = 48;
    const btnX = 160;
    const btnY = 460;

    this.ctx.save();
    const btnGrad = this.ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
    if (this.hasSubmittedGameOver) {
      btnGrad.addColorStop(0, '#495057');
      btnGrad.addColorStop(1, '#343a40');
      this.ctx.fillStyle = btnGrad;
      this.ctx.shadowBlur = 0;
    } else {
      btnGrad.addColorStop(0, '#ffd166');
      btnGrad.addColorStop(1, '#f77f00');
      this.ctx.fillStyle = btnGrad;
      this.ctx.shadowColor = 'rgba(255, 209, 102, 0.8)';
      this.ctx.shadowBlur = 14;
    }
    this.ctx.beginPath();
    this.ctx.roundRect(btnX, btnY, btnW, btnH, 24);
    this.ctx.fill();

    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = this.hasSubmittedGameOver ? '#adb5bd' : '#ffffff';
    this.ctx.stroke();

    this.ctx.fillStyle = this.hasSubmittedGameOver ? '#f8f9fa' : '#1d3557';
    this.ctx.font = 'bold 16px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.shadowBlur = 0;
    const btnText = this.hasSubmittedGameOver
      ? '✅ 殿堂入り登録済み（順位を見る）'
      : '🏆 全国ランキングに殿堂入り登録！';
    this.ctx.fillText(btnText, btnX + btnW / 2, btnY + 30);
    this.ctx.restore();

    // =========================================================================
    // 🏠 2. 「オープニング」ボタン (右側)
    // =========================================================================
    const openBtnW = 250;
    const openBtnH = 48;
    const openBtnX = 550;
    const openBtnY = 460;

    this.ctx.save();
    const openGrad = this.ctx.createLinearGradient(openBtnX, openBtnY, openBtnX, openBtnY + openBtnH);
    openGrad.addColorStop(0, '#06d6a0');
    openGrad.addColorStop(1, '#007f5f');
    this.ctx.fillStyle = openGrad;
    this.ctx.shadowColor = 'rgba(6, 214, 160, 0.6)';
    this.ctx.shadowBlur = 14;
    this.ctx.beginPath();
    this.ctx.roundRect(openBtnX, openBtnY, openBtnW, openBtnH, 24);
    this.ctx.fill();

    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.stroke();

    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 17px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText('🏠 オープニング', openBtnX + openBtnW / 2, openBtnY + 30);
    this.ctx.restore();
  }

  // 🌟 奇跡の覚醒トリガー（ステージ8ラスボス戦限定インバトル復活）
  triggerSuperRevival() {
    if (!this.player || this.player.isSuper) return;
    this.player.isSuper = true;
    this.player.hp = CONSTANTS.PLAYER.MAX_HP;
    this.player.invincibleTimer = (typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL ? CONSTANTS.SUPER_REVIVAL.INVINCIBLE_TIME : 180);
    this.player.maxCharge = (typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL ? CONSTANTS.SUPER_REVIVAL.MAX_CHARGE : 90);
    this.player.chargeTimer = 0;
    this.player.isAttacking = false;
    this.superRevivalFreezeTimer = (typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL ? CONSTANTS.SUPER_REVIVAL.FREEZE_TIME : 45);
    this.superCutInTimer = (typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL ? CONSTANTS.SUPER_REVIVAL.CUTIN_DURATION : 150);
    this.whiteFlash = 0.95;
    this.screenShake = 16;
    window.particleManager.createSuperRevivalBurst(
      this.player.x + this.player.width / 2,
      this.player.y + this.player.height / 2
    );
    window.sound.playSuperAwakening();
  }

  // 🌟 スーパー形態のON/OFF切り替え（[S]キーテスト・検証用）
  toggleSuperForm() {
    if (!this.player) return;
    if (this.player.isSuper) {
      this.player.isSuper = false;
      this.player.maxCharge = 180;
      this.superCutInTimer = 0;
    } else {
      this.player.isSuper = true;
      this.player.hp = CONSTANTS.PLAYER.MAX_HP;
      this.player.invincibleTimer = (typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL ? CONSTANTS.SUPER_REVIVAL.INVINCIBLE_TIME : 180);
      this.player.maxCharge = (typeof CONSTANTS !== 'undefined' && CONSTANTS.SUPER_REVIVAL ? CONSTANTS.SUPER_REVIVAL.MAX_CHARGE : 90);
      this.whiteFlash = 0.85;
      this.screenShake = 12;
      this.superCutInTimer = 120;
      window.particleManager.createSuperRevivalBurst(
        this.player.x + this.player.width / 2,
        this.player.y + this.player.height / 2
      );
      window.sound.playSuperAwakening();
    }
  }

  // 🌟 奇跡の覚醒！スーパー覚醒カットイン演出描画（たけし＆こけしデザイン監修）
  drawSuperCutIn() {
    const ctx = this.ctx;
    const W = CONSTANTS.CANVAS_WIDTH;
    const H = CONSTANTS.CANVAS_HEIGHT;
    const t = this.superCutInTimer; // 初期値150

    // フェードイン（最初の15フレーム） / フェードアウト（最後の25フレーム）
    let alpha = 1.0;
    if (t > 135) {
      alpha = (150 - t) / 15;
    } else if (t < 25) {
      alpha = t / 25;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    const bannerH = 110;
    const bannerY = (H - bannerH) / 2 - 20;

    // 1. 中央帯のグラデーション背景
    const bgGrad = ctx.createLinearGradient(0, bannerY, 0, bannerY + bannerH);
    bgGrad.addColorStop(0, 'rgba(10, 8, 20, 0.92)');
    bgGrad.addColorStop(0.5, 'rgba(35, 25, 5, 0.95)');
    bgGrad.addColorStop(1, 'rgba(10, 8, 20, 0.92)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, bannerY, W, bannerH);

    // 2. 黄金のネオン境界ライン（上下）
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 16;
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, bannerY);
    ctx.lineTo(W, bannerY);
    ctx.moveTo(0, bannerY + bannerH);
    ctx.lineTo(W, bannerY + bannerH);
    ctx.stroke();

    // 3. テキスト描画
    ctx.textAlign = 'center';
    const isCat = (this.player.characterType !== 'onigiri');

    // メインタイトル
    ctx.font = 'bold 26px ' + CONSTANTS.FONT_FAMILY;
    ctx.fillStyle = '#ffea00';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 14;
    const mainTitle = isCat
      ? '⚡ 奇跡の覚醒！ スーパーねこちゃん降臨！！ ⚡'
      : '🍙 奇跡の覚醒！ スーパーおにぎり降臨！！ 🍙';
    ctx.fillText(mainTitle, W / 2, bannerY + 36);

    // キャラクター名台詞
    ctx.font = 'bold 15px ' + CONSTANTS.FONT_FAMILY;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 6;
    const quote = isCat
      ? '「全宇宙の平和のために……絶対に負けられないニャーッ！！」'
      : '「アツアツ炊きたて！ 黄金の魂が限界突破なんだな！！」';
    ctx.fillText(quote, W / 2, bannerY + 66);

    // 強化スペックステータス案内
    ctx.font = 'bold 13px ' + CONSTANTS.FONT_FAMILY;
    ctx.fillStyle = '#4cc9f0';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.fillText('【 HP全回復 ＆ 3秒無敵 ＆ 常時3WAYショット ＆ 攻撃力2倍 ＆ 高速チャージ！ 】', W / 2, bannerY + 93);

    ctx.restore();
  }

  drawGameOverScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
    this.ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#ff4d6d';
    this.ctx.font = 'bold 44px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText('😿 GAME OVER', CONSTANTS.CANVAS_WIDTH / 2, 130);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '18px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText('あきらめないで！また挑戦してみよう！', CONSTANTS.CANVAS_WIDTH / 2, 172);

    const stageName = (this.stage && this.stage.name) ? this.stage.name : `STAGE ${this.currentStage}`;
    this.ctx.fillStyle = '#4cc9f0';
    this.ctx.font = 'bold 20px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText(`🚩 STAGE ${this.currentStage}: ${stageName}`, CONSTANTS.CANVAS_WIDTH / 2, 208);

    this.ctx.fillStyle = '#ffb703';
    this.ctx.font = 'bold 24px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText(`FINAL SCORE: ${this.score.toLocaleString()} 点`, CONSTANTS.CANVAS_WIDTH / 2, 244);

    // 自己ベスト表示 ＆ 更新時祝賀バッジ
    if (this.isNewHighScore) {
      this.ctx.fillStyle = '#ffea00';
      this.ctx.font = 'bold 18px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.fillText('🎉 自己ベスト更新！おめでとう！ 🎉', CONSTANTS.CANVAS_WIDTH / 2, 278);
    } else if (this.highScore > 0) {
      this.ctx.fillStyle = '#adb5bd';
      this.ctx.font = '15px ' + CONSTANTS.FONT_FAMILY;
      this.ctx.fillText(`（あなたの自己ベスト: ${this.highScore.toLocaleString()} 点）`, CONSTANTS.CANVAS_WIDTH / 2, 278);
    }

    // 🌟 以前の「▶ [Space] または 画面タップで再開 ◀」はひろあき軍曹のご指示により「トルツメ」完了！

    // =========================================================================
    // 🏆 1. 全国ランキングに登録ボタン (中央配置)
    // =========================================================================
    const btnW = 360;
    const btnH = 46;
    const btnX = (CONSTANTS.CANVAS_WIDTH - btnW) / 2; // 300
    const btnY = 320;

    this.ctx.save();
    const grad = this.ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
    if (this.hasSubmittedGameOver) {
      grad.addColorStop(0, '#495057');
      grad.addColorStop(1, '#343a40');
      this.ctx.fillStyle = grad;
      this.ctx.shadowBlur = 0;
    } else {
      grad.addColorStop(0, '#ffd166');
      grad.addColorStop(1, '#f77f00');
      this.ctx.fillStyle = grad;
      this.ctx.shadowColor = 'rgba(255, 209, 102, 0.6)';
      this.ctx.shadowBlur = 12;
    }
    this.ctx.beginPath();
    this.ctx.roundRect(btnX, btnY, btnW, btnH, 23);
    this.ctx.fill();

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = this.hasSubmittedGameOver ? '#adb5bd' : '#ffffff';
    this.ctx.stroke();

    this.ctx.fillStyle = this.hasSubmittedGameOver ? '#f8f9fa' : '#1d3557';
    this.ctx.font = 'bold 17px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.shadowBlur = 0;
    const btnText = this.hasSubmittedGameOver
      ? '✅ ランキング登録済み（順位を見る）'
      : '🏆 全国ランキングに登録する！';
    this.ctx.fillText(btnText, CONSTANTS.CANVAS_WIDTH / 2, btnY + 29);
    this.ctx.restore();

    // =========================================================================
    // 🔁 2. 「ステージ〇から再開」ボタン (左側)
    // =========================================================================
    const retryBtnW = 270;
    const retryBtnH = 50;
    const retryBtnX = 190;
    const retryBtnY = 398;

    this.ctx.save();
    const retryGrad = this.ctx.createLinearGradient(retryBtnX, retryBtnY, retryBtnX, retryBtnY + retryBtnH);
    retryGrad.addColorStop(0, '#06d6a0');
    retryGrad.addColorStop(1, '#007f5f');
    this.ctx.fillStyle = retryGrad;
    this.ctx.shadowColor = 'rgba(6, 214, 160, 0.55)';
    this.ctx.shadowBlur = 12;
    this.ctx.beginPath();
    this.ctx.roundRect(retryBtnX, retryBtnY, retryBtnW, retryBtnH, 25);
    this.ctx.fill();

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.stroke();

    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 17px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText(`🔁 ステージ${this.currentStage}から再開`, retryBtnX + retryBtnW / 2, retryBtnY + 31);
    this.ctx.restore();

    // =========================================================================
    // 🏠 3. 「最初からやり直す」ボタン (右側)
    // =========================================================================
    const resetBtnW = 270;
    const resetBtnH = 50;
    const resetBtnX = 500;
    const resetBtnY = 398;

    this.ctx.save();
    const resetGrad = this.ctx.createLinearGradient(resetBtnX, resetBtnY, resetBtnX, resetBtnY + resetBtnH);
    resetGrad.addColorStop(0, '#7209b7');
    resetGrad.addColorStop(1, '#480ca8');
    this.ctx.fillStyle = resetGrad;
    this.ctx.shadowColor = 'rgba(114, 9, 183, 0.50)';
    this.ctx.shadowBlur = 12;
    this.ctx.beginPath();
    this.ctx.roundRect(resetBtnX, resetBtnY, resetBtnW, resetBtnH, 25);
    this.ctx.fill();

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.stroke();

    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 17px ' + CONSTANTS.FONT_FAMILY;
    this.ctx.fillText('🏠 最初からやり直す', resetBtnX + resetBtnW / 2, resetBtnY + 31);
    this.ctx.restore();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const startGame = () => {
    if (!window.game) {
      window.game = new Game();
    }
  };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startGame).catch(startGame);
    setTimeout(startGame, 2000);
  } else {
    startGame();
  }
});
