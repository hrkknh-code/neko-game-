// src/audio.js - 🎵 かなでミュージック全面プロデュース：4chチップチューン・シンセサイザー & ゲームフィールSE音響エンジン

const NOTE_RAW = {
  // Octave 1
  C1: 32.70, Cs1: 34.65, Db1: 34.65, D1: 36.71, Ds1: 38.89, Eb1: 38.89, E1: 41.20, F1: 43.65, Fs1: 46.25, Gb1: 46.25, G1: 49.00, Gs1: 51.91, Ab1: 51.91, A1: 55.00, As1: 58.27, Bb1: 58.27, B1: 61.74,
  // Octave 2
  C2: 65.41, Cs2: 69.30, Db2: 69.30, D2: 73.42, Ds2: 77.78, Eb2: 77.78, E2: 82.41, F2: 87.31, Fs2: 92.50, Gb2: 92.50, G2: 98.00, Gs2: 103.83, Ab2: 103.83, A2: 110.00, As2: 116.54, Bb2: 116.54, B2: 123.47,
  // Octave 3
  C3: 130.81, Cs3: 138.59, Db3: 138.59, D3: 146.83, Ds3: 155.56, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, Gb3: 185.00, G3: 196.00, Gs3: 207.65, Ab3: 207.65, A3: 220.00, As3: 233.08, Bb3: 233.08, B3: 246.94,
  // Octave 4
  C4: 261.63, Cs4: 277.18, Db4: 277.18, D4: 293.66, Ds4: 311.13, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, Gb4: 369.99, G4: 392.00, Gs4: 415.30, Ab4: 415.30, A4: 440.00, As4: 466.16, Bb4: 466.16, B4: 493.88,
  // Octave 5
  C5: 523.25, Cs5: 554.37, Db5: 554.37, D5: 587.33, Ds5: 622.25, Eb5: 622.25, E5: 659.26, F5: 698.46, Fs5: 739.99, Gb5: 739.99, G5: 783.99, Gs5: 830.61, Ab5: 830.61, A5: 880.00, As5: 932.33, Bb5: 932.33, B5: 987.77,
  // Octave 6
  C6: 1046.50, Cs6: 1108.73, Db6: 1108.73, D6: 1174.66, Ds6: 1244.51, Eb6: 1244.51, E6: 1318.51, F6: 1396.91, Fs6: 1479.98, Gb6: 1479.98, G6: 1567.98, Gs6: 1661.22, Ab6: 1661.22, A6: 1760.00, As6: 1864.66, Bb6: 1864.66, B6: 1975.53,
  // Octave 7
  C7: 2093.00, Cs7: 2217.46, Db7: 2217.46, D7: 2349.32, Ds7: 2489.02, Eb7: 2489.02, E7: 2637.02, F7: 2793.83, Fs7: 2959.96, Gb7: 2959.96, G7: 3135.96, Gs7: 3322.44, Ab7: 3322.44, A7: 3520.00, As7: 3729.31, Bb7: 3729.31, B7: 3951.07
};

// どんな音階アクセスでもundefinedにならず440Hzにフォールバックする安全Proxy
const NOTE = new Proxy(NOTE_RAW, {
  get(target, prop) {
    if (prop in target) return target[prop];
    console.warn(`[かなでミュージック] 未定義の音階アクセス: ${String(prop)} -> 440Hzにフォールバック`);
    return 440.0;
  }
});

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.currentTrack = 'none';

    // マスターゲインノード
    this.masterGain = null;
    this.bgmMasterGain = null;
    this.seMasterGain = null;

    // ノイズバッファ（ドラム＆打撃SE用）
    this.noiseBuffer = null;

    // BGMシーケンサータイマー
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.currentBpm = 128;

    // チャージ音ループ用
    this.chargeOsc = null;
    this.chargeGain = null;

    // 外部音源（Mureka生成の本格スタジオBGM）マッピングテーブル
    this.externalTracks = {
      stage: 'assets/bgm/stage1_popstar.mp3', // 👑 ひろあき軍曹 作曲『はじまりのポップスター』
      stage2: 'assets/bgm/stage2_mall.mp3',   // 👑 ひろあき軍曹 作曲『きらめきモールステージ2』
      stage3: 'assets/bgm/stage3_clock.mp3',  // 👑 ひろあき軍曹 作曲『歯車時計塔スウィング』
      fever: 'assets/bgm/fever.mp3',          // 👑 ひろあき軍曹 作曲『無敵フィーバー』
      boss: 'assets/bgm/boss1.mp3',           // 👑 ひろあき軍曹 作曲『成金マタドール』
      boss_rage: 'assets/bgm/boss1.mp3',      // 👑 ひろあき軍曹 作曲『成金マタドール』（激怒時も継続）
      boss2: 'assets/bgm/boss2.mp3',          // 👑 ひろあき軍曹 作曲『モール決戦ナイト』
      boss2_rage: 'assets/bgm/boss2.mp3',     // 👑 ひろあき軍曹 作曲『モール決戦ナイト』（激怒時も継続）
      boss3: 'assets/bgm/boss3.mp3',          // 👑 ひろあき軍曹 作曲『歯車のボス決戦』
      boss3_rage: 'assets/bgm/boss3.mp3',     // 👑 ひろあき軍曹 作曲『歯車のボス決戦』（激怒時も継続）
      stage4: 'assets/bgm/stage4_sushi.mp3',  // 👑 ひろあき軍曹 作曲『厨房祭囃子』
      boss4: 'assets/bgm/boss4.mp3',          // 👑 ひろあき軍曹 作曲『板前大暴走』
      boss4_rage: 'assets/bgm/boss4.mp3',     // 👑 ひろあき軍曹 作曲『板前大暴走』（激怒時も継続）
      stage5: 'assets/bgm/stage5_beach.mp3',  // 👑 ひろあき軍曹 作曲『常夏サンバロード』
      boss5: 'assets/bgm/boss5.mp3',          // 👑 ひろあき軍曹 作曲『常夏テケテケ大決戦』
      boss5_rage: 'assets/bgm/boss5.mp3',     // 👑 ひろあき軍曹 作曲『常夏テケテケ大決戦』（激怒時も継続）
      stage6: 'assets/bgm/stage6_ghost.mp3',   // 👑 ひろあき軍曹 作曲『真夜中の悪戯ワルツ』
      boss6: 'assets/bgm/boss6.mp3',           // 👑 ひろあき軍曹 作曲『狂騒の魔術師』
      boss6_rage: 'assets/bgm/boss6.mp3',      // 👑 ひろあき軍曹 作曲『狂騒の魔術師』（激怒時も継続）
      stage7: 'assets/bgm/stage7_space.mp3',   // 👑 ひろあき軍曹 作曲『星屑のオービット』
      boss7: 'assets/bgm/boss7.mp3',           // 👑 ひろあき軍曹 作曲『銀河帝国の終焉』
      boss7_rage: 'assets/bgm/boss7.mp3',      // 👑 ひろあき軍曹 作曲『銀河帝国の終焉』（激怒時も継続）
      stage8: 'assets/bgm/stage8_castle.mp3',  // 👑 ひろあき軍曹 作曲『決戦の銀河紀行』
      boss8: 'assets/bgm/boss8.mp3',           // 👑 ひろあき軍曹 作曲『終焉の星の瞬き』
      boss8_rage: 'assets/bgm/boss8.mp3',      // 👑 ひろあき軍曹 作曲『終焉の星の瞬き』（激怒時も継続）
      title: 'assets/bgm/title.mp3',          // 👑 ひろあき軍曹 作曲『はじまりの木琴』
      gameover: 'assets/bgm/gameover.mp3',    // 👑 ひろあき軍曹 作曲『しょんぼりリトライ』
      clear: 'assets/bgm/stage_clear.mp3',     // 👑 ひろあき軍曹 作曲『完全勝利の決めポーズ』
      ending: 'assets/bgm/ending.mp3',        // 👑 ひろあき軍曹 作曲『星降る大行進』
    };
    this.audioElements = {};
    this.currentAudioEl = null;

    this.initAudioContext();
  }

  getOrCreateAudioElement(trackName) {
    const src = this.externalTracks[trackName];
    if (!src) return null;
    if (!this.audioElements[trackName]) {
      const audio = new Audio(src);
      audio.loop = (trackName !== 'clear'); // ジングルはループせず単発再生
      audio.preload = 'auto';
      audio.volume = this.muted ? 0 : 0.50;
      this.audioElements[trackName] = audio;
    }
    return this.audioElements[trackName];
  }

  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext && !this.ctx) {
      this.ctx = new AudioContext();

      // マスターバス構築
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // BGMバス（ダッキング対応）
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(0.40, this.ctx.currentTime);
      this.bgmMasterGain.connect(this.masterGain);

      // SEバス
      this.seMasterGain = this.ctx.createGain();
      this.seMasterGain.gain.setValueAtTime(0.70, this.ctx.currentTime);
      this.seMasterGain.connect(this.masterGain);

      // 共通ホワイトノイズバッファ作成（2秒分）
      const bufferSize = this.ctx.sampleRate * 2;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }
  }

  init() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    } else if (!this.ctx) {
      this.initAudioContext();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.85, this.ctx.currentTime);
    }
    if (this.currentAudioEl) {
      this.currentAudioEl.muted = this.muted;
      if (!this.muted && this.bgmPlaying) {
        this.currentAudioEl.play().catch(() => {});
      }
    }
    return this.muted;
  }

  // ★ プロ仕様ダッキング制御（重要なSE発声時にBGM音量を瞬間的に下げて抜けを良くする）
  duckBGM(duration = 0.25, duckLevel = 0.15) {
    if (this.currentAudioEl && !this.muted) {
      this.currentAudioEl.volume = 0.18;
      setTimeout(() => {
        if (this.currentAudioEl && !this.muted) {
          this.currentAudioEl.volume = 0.50;
        }
      }, duration * 1000);
    }
    if (!this.bgmMasterGain || !this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    this.bgmMasterGain.gain.cancelScheduledValues(now);
    this.bgmMasterGain.gain.setValueAtTime(duckLevel, now);
    this.bgmMasterGain.gain.linearRampToValueAtTime(0.40, now + duration);
  }

  // =========================================================================
  // 🎵 4ch本格チップチューン BGM シーケンサー
  // =========================================================================

  startBGM(typeOrTrack = false) {
    this.init();
    let targetTrack = 'stage';

    if (typeOrTrack === 'fever') {
      targetTrack = 'fever';
    } else if (typeof typeOrTrack === 'string' && typeOrTrack !== 'false' && typeOrTrack !== 'boss') {
      targetTrack = typeOrTrack;
    } else {
      // ゲームステートと現在ステージ（1〜8）に応じた動的トラック決定
      const curStage = (window.game && window.game.currentStage) ? window.game.currentStage : 1;
      const isBoss = (typeOrTrack === true || typeOrTrack === 'boss') ||
                     (window.game && (window.game.state === 'BOSS_BATTLE' || window.game.state === 'BOSS_INTRO'));
      const isRage = window.game && window.game.boss && window.game.boss.isRaging();

      if (window.game && window.game.state === 'ALL_STAGE_CLEAR') {
        targetTrack = 'ending';
      } else if (window.game && (window.game.state === 'TITLE' || window.game.state === 'CHAR_SELECT')) {
        targetTrack = 'title';
      } else if (window.game && window.game.state === 'GAME_OVER') {
        targetTrack = 'gameover';
      } else if (isBoss) {
        if (curStage === 1) targetTrack = isRage ? 'boss_rage' : 'boss';
        else if (curStage === 2) targetTrack = isRage ? 'boss2_rage' : 'boss2';
        else if (curStage === 3) targetTrack = isRage ? 'boss3_rage' : 'boss3';
        else if (curStage === 4) targetTrack = isRage ? 'boss4_rage' : 'boss4';
        else if (curStage === 5) targetTrack = isRage ? 'boss5_rage' : 'boss5';
        else if (curStage === 6) targetTrack = isRage ? 'boss6_rage' : 'boss6';
        else if (curStage === 7) targetTrack = isRage ? 'boss7_rage' : 'boss7';
        else targetTrack = isRage ? 'boss8_rage' : 'boss8';
      } else {
        if (curStage === 1) targetTrack = 'stage';
        else if (curStage === 2) targetTrack = 'stage2';
        else if (curStage === 3) targetTrack = 'stage3';
        else if (curStage === 4) targetTrack = 'stage4';
        else if (curStage === 5) targetTrack = 'stage5';
        else if (curStage === 6) targetTrack = 'stage6';
        else if (curStage === 7) targetTrack = 'stage7';
        else targetTrack = 'stage8';
      }
    }

    if (this.bgmPlaying && this.currentTrack === targetTrack) return;

    // 同一音源ファイルを参照するトラック間（例: boss と boss_rage）の切り替えなら曲を止めずに継続
    if (this.bgmPlaying && this.currentAudioEl && this.externalTracks[targetTrack] && this.externalTracks[targetTrack] === this.externalTracks[this.currentTrack]) {
      this.currentTrack = targetTrack;
      return;
    }

    this.stopBGM();
    this.bgmPlaying = true;
    this.currentTrack = targetTrack;

    // 🎵 外部音源（Mureka生成の本格スタジオBGM）が存在する場合は最優先で直接再生！
    const extAudio = this.getOrCreateAudioElement(targetTrack);
    if (extAudio) {
      this.currentAudioEl = extAudio;
      extAudio.currentTime = 0;
      extAudio.muted = this.muted;
      extAudio.volume = this.muted ? 0 : 0.50;
      if (!this.muted) {
        const playPromise = extAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log('[かなでミュージック] BGM再生ユーザーインタラクション待機:', e);
            const resumePlay = () => {
              if (this.currentAudioEl === extAudio && !this.muted && this.bgmPlaying) {
                extAudio.play().catch(() => {});
              }
              window.removeEventListener('pointerdown', resumePlay);
              window.removeEventListener('keydown', resumePlay);
            };
            window.addEventListener('pointerdown', resumePlay, { once: true });
            window.addEventListener('keydown', resumePlay, { once: true });
          });
        }
      }
      return;
    }

    // 外部音源が未登録のトラックは、かなでの4chチップチューン・シーケンサーで即時フォールバック演奏！
    this.bgmStep = 0;
    const trackData = this.getTrackData(targetTrack);
    this.currentBpm = trackData.bpm;
    const stepDuration = (60 / this.currentBpm) / 4; // 16分音符の秒数

    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.ctx || !this.bgmPlaying) return;
      this.playStep(trackData, this.bgmStep);
      this.bgmStep = (this.bgmStep + 1) % trackData.length;
    }, stepDuration * 1000);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.currentAudioEl) {
      try {
        this.currentAudioEl.pause();
        this.currentAudioEl.currentTime = 0;
      } catch (e) {}
      this.currentAudioEl = null;
    }
    this.bgmPlaying = false;
    this.currentTrack = 'none';
  }

  playStep(track, step) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const dur = (60 / this.currentBpm) / 4;

    // Ch 1: Lead Melody (矩形波)
    const mNote = track.melody[step];
    if (mNote) {
      this.playSynthNote(mNote, 'square', 0.08, dur * 0.92, now, true);
    }

    // Ch 2: Harmony / Arpeggio (パルス波風 軽快)
    const hNote = track.harmony[step];
    if (hNote) {
      this.playSynthNote(hNote, 'square', 0.045, dur * 0.75, now, false);
    }

    // Ch 3: Bass (うねる三角波)
    const bNote = track.bass[step];
    if (bNote) {
      this.playSynthNote(bNote, 'triangle', 0.16, dur * 0.88, now, false);
    }

    // Ch 4: Drums / Rhythm
    const drum = track.drums[step];
    if (drum) {
      if (drum.includes('k')) this.playKickDrum(now);
      if (drum.includes('s')) this.playSnareDrum(now);
      if (drum.includes('h')) this.playHiHat(now, false);
      if (drum.includes('o')) this.playHiHat(now, true); // オープンハイハット
    }
  }

  playSynthNote(freq, waveType, volume, duration, time, vibrato = false) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, time);

    if (vibrato && duration > 0.2) {
      // ほんのりジャジーなビブラート
      const vibOsc = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();
      vibOsc.frequency.setValueAtTime(6.0, time);
      vibGain.gain.setValueAtTime(freq * 0.015, time);
      vibOsc.connect(osc.frequency);
      vibOsc.start(time + 0.08);
      vibOsc.stop(time + duration);
    }

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  playKickDrum(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.09);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(gain);
    gain.connect(this.bgmMasterGain);
    osc.start(time);
    osc.stop(time + 0.09);
  }

  playSnareDrum(time) {
    if (!this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, time);
    filter.Q.setValueAtTime(1.2, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmMasterGain);
    noise.start(time);
    noise.stop(time + 0.11);
  }

  playHiHat(time, isOpen = false) {
    if (!this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, time);

    const dur = isOpen ? 0.15 : 0.04;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isOpen ? 0.09 : 0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmMasterGain);
    noise.start(time);
    noise.stop(time + dur);
  }

  // =========================================================================
  // 🎼 楽曲データ定義（かなでミュージック特製スコア）
  // =========================================================================

  getTrackData(type) {
    const N = NOTE;
    const _ = null;

    if (type === 'fever') {
      // 🌟 『ハイパー・またたび・シティ』(80s シティポップ × フィルターディスコ / 150 BPM)
      // コード: Bbmaj7 -> C -> Am7 -> Dm7 (黄金進行)
      return {
        bpm: 150,
        length: 32,
        melody: [
          N.F5, _, N.G5, _, N.A5, _, N.C6, _, N.D6, _, N.C6, _, N.A5, _, N.G5, _,
          N.A5, _, N.C6, _, N.D6, _, N.F6, _, N.E6, _, N.D6, _, N.C6, _, N.A5, _
        ],
        harmony: [
          N.D5, N.F5, N.A5, N.C6, N.E5, N.G5, N.B5, N.D6, N.C5, N.E5, N.G5, N.B5, N.F5, N.A5, N.C6, N.E6,
          N.D5, N.F5, N.A5, N.C6, N.E5, N.G5, N.B5, N.D6, N.C5, N.E5, N.G5, N.B5, N.F5, N.A5, N.C6, N.E6
        ],
        bass: [
          N.Bb2, _, N.Bb3, _, N.Bb2, _, N.Bb3, _, N.C3, _, N.C4, _, N.C3, _, N.C4, _,
          N.A2, _, N.A3, _, N.A2, _, N.A3, _, N.D3, _, N.D4, _, N.D3, _, N.D4, _
        ],
        drums: [
          'k', 'h', 'h', 'h', 'k', 's', 'h', 'h', 'k', 'h', 'h', 'h', 'k', 's', 'h', 'o',
          'k', 'h', 'h', 'h', 'k', 's', 'h', 'h', 'k', 'h', 'h', 'h', 'k', 's', 'h', 'o'
        ]
      };
    }

    if (type === 'boss' || type === 'boss_rage') {
      // 👑 『ぜいたくボスのファンキー大作戦』(70s ジャズ・ファンク・ロック / 140 or 155 BPM)
      // コード: Dm7 -> G9 -> Dm7 -> Bb7 -> A7(#9)
      const isRage = (type === 'boss_rage');
      return {
        bpm: isRage ? 154 : 138,
        length: 32,
        melody: [
          N.D5, _, N.F5, _, N.D5, _, N.C5, _, N.D5, _, N.F5, N.G5, N.Ab5, N.G5, N.F5, N.D5,
          N.F5, _, N.G5, _, N.Ab5, _, N.A5, _, N.C6, _, N.A5, _, N.G5, N.F5, N.D5, _
        ],
        harmony: [
          N.F4, _, N.A4, _, N.C5, _, N.E5, _, N.F4, _, N.B4, _, N.D5, _, N.F5, _,
          N.F4, _, N.A4, _, N.C5, _, N.E5, _, N.Ab4, _, N.C5, _, N.Cs5, _, N.E5, _
        ],
        bass: [
          N.D3, N.D3, _, N.F3, _, N.G3, N.Ab3, N.A3, N.D3, N.D3, _, N.C3, _, N.D3, N.F3, _,
          N.D3, N.D3, _, N.F3, _, N.G3, N.Ab3, N.A3, N.Bb2, _, N.Bb2, _, N.A2, _, N.A2, _
        ],
        drums: [
          'k', 'h', 's', 'h', 'h', 'k', 's', 'h', 'k', 'h', 's', 'h', 'h', 'k', 's', 'h',
          'k', 'h', 's', 'h', 'h', 'k', 's', 'h', 'k', 'k', 's', 'h', 'h', 's', 'k', 'o'
        ]
      };
    }

    if (type === 'stage2') {
      // 🛒 『ネオンモールのショッピング・ステップ』(Synthwave × Electro Funk / 132 BPM)
      // コード: Dm7 -> G9 -> Em7 -> Am7
      return {
        bpm: 132,
        length: 32,
        melody: [
          N.A5, _, N.C6, _, N.D6, _, N.F6, _, N.E6, _, N.C6, _, N.A5, _, N.G5, _,
          N.B5, _, N.D6, _, N.E6, _, N.G6, _, N.F6, _, N.D6, _, N.B5, _, N.A5, _
        ],
        harmony: [
          N.F4, N.A4, N.C5, N.E5, N.G4, N.B4, N.D5, N.F5, N.G4, N.B4, N.E5, N.G5, N.E4, N.A4, N.C5, N.E5,
          N.F4, N.A4, N.C5, N.E5, N.G4, N.B4, N.D5, N.F5, N.G4, N.B4, N.E5, N.G5, N.E4, N.A4, N.C5, N.E5
        ],
        bass: [
          N.D2, _, N.D3, _, N.G2, _, N.G3, _, N.E2, _, N.E3, _, N.A2, _, N.A3, _,
          N.D2, _, N.D3, _, N.G2, _, N.G3, _, N.E2, _, N.E3, _, N.A2, _, N.A3, _
        ],
        drums: [
          'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'o',
          'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'o'
        ]
      };
    }

    if (type === 'boss2' || type === 'boss2_rage') {
      // 🛍️ 『暴走レディのクレイジー・バーゲンセール』(Dance Rock / 144 -> 158 BPM)
      // コード: Fm -> Db -> Eb -> C7
      const isRage = (type === 'boss2_rage');
      return {
        bpm: isRage ? 158 : 144,
        length: 32,
        melody: [
          N.F5, _, N.Ab5, _, N.C6, _, N.Eb6, _, N.Db6, _, N.C6, _, N.Bb5, _, N.Ab5, _,
          N.G5, _, N.Bb5, _, N.C6, _, N.Db6, _, N.C6, _, N.Bb5, _, N.Ab5, _, N.G5, _
        ],
        harmony: [
          N.Ab4, _, N.C5, _, N.F5, _, N.Ab5, _, N.F4, _, N.Ab4, _, N.Db5, _, N.F5, _,
          N.G4, _, N.Bb4, _, N.Eb5, _, N.G5, _, N.E4, _, N.G4, _, N.Bb4, _, N.C5, _
        ],
        bass: [
          N.F2, N.F2, _, N.F3, N.Db2, N.Db2, _, N.Db3, N.Eb2, N.Eb2, _, N.Eb3, N.C2, N.C2, _, N.C3,
          N.F2, N.F2, _, N.F3, N.Db2, N.Db2, _, N.Db3, N.Eb2, N.Eb2, _, N.Eb3, N.C2, N.C2, _, N.C3
        ],
        drums: [
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'o',
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'k', 's', 'o'
        ]
      };
    }

    if (type === 'stage3') {
      // 🕰️ 『星空時計塔のエチュード』(Baroque Rock Waltz / 120 BPM)
      // コード: Am -> Dm -> G -> C -> F -> Bdim -> E7 -> Am
      return {
        bpm: 120,
        length: 32,
        melody: [
          N.A5, _, N.C6, N.E6, N.D6, _, N.F6, N.A6, N.B5, _, N.D6, N.G6, N.C6, _, N.E6, N.G6,
          N.A5, _, N.C6, N.F6, N.B5, _, N.D6, N.F6, N.Gs5, _, N.B5, N.E6, N.A5, _, _, _
        ],
        harmony: [
          N.C5, _, N.E5, _, N.D5, _, N.F5, _, N.B4, _, N.D5, _, N.C5, _, N.E5, _,
          N.A4, _, N.C5, _, N.Ab4, _, N.B4, _, N.Ab4, _, N.B4, _, N.A4, _, N.C5, _
        ],
        bass: [
          N.A2, _, N.E3, _, N.D3, _, N.A3, _, N.G2, _, N.D3, _, N.C3, _, N.G3, _,
          N.F2, _, N.C3, _, N.B2, _, N.F3, _, N.E2, _, N.B2, _, N.A2, _, N.E3, _
        ],
        drums: [
          'k', 'h', 'h', 's', 'h', 'h', 'k', 'h', 'h', 's', 'h', 'h',
          'k', 'h', 'h', 's', 'h', 'h', 'k', 'h', 'h', 's', 'h', 'o',
          'k', 'h', 'h', 's', 'h', 'h', 'k', 's'
        ]
      };
    }

    if (type === 'boss3' || type === 'boss3_rage') {
      // 🎩 『ドン・ニャルレオーネの夜想曲』(Dramatic Symphonic Chiptune / 148 -> 165 BPM)
      // コード: Cm -> Ab -> Fm -> G7
      const isRage = (type === 'boss3_rage');
      return {
        bpm: isRage ? 165 : 148,
        length: 32,
        melody: [
          N.C5, _, N.Eb5, _, N.G5, _, N.C6, _, N.B5, _, N.Ab5, _, N.G5, _, N.Eb5, _,
          N.F5, _, N.Ab5, _, N.C6, _, N.D6, _, N.B5, _, N.G5, _, N.F5, _, N.D5, _
        ],
        harmony: [
          N.Eb4, _, N.G4, _, N.C5, _, N.Eb5, _, N.C4, _, N.Eb4, _, N.Ab4, _, N.C5, _,
          N.C4, _, N.F4, _, N.Ab4, _, N.C5, _, N.D4, _, N.F4, _, N.G4, _, N.B4, _
        ],
        bass: [
          N.C3, N.C3, _, N.G2, N.Ab2, N.Ab2, _, N.Eb2, N.F2, N.F2, _, N.C3, N.G2, N.G2, _, N.D3,
          N.C3, N.C3, _, N.G2, N.Ab2, N.Ab2, _, N.Eb2, N.F2, N.F2, _, N.C3, N.G2, N.G2, _, N.G2
        ],
        drums: [
          'k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 'k', 's', 'o',
          'k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 'k', 's', 'o'
        ]
      };
    }

    if (type === 'ending') {
      // 🎉 『にゃんこパレード・マーチ』(Celebration March / 124 BPM)
      // コード: C -> G -> Am -> F -> C -> G -> C
      return {
        bpm: 124,
        length: 32,
        melody: [
          N.C5, _, N.E5, _, N.G5, _, N.C6, _, N.B5, _, N.A5, _, N.G5, _, _, _,
          N.A5, _, N.F5, _, N.G5, _, N.E5, _, N.D5, _, N.E5, _, N.C5, _, _, _
        ],
        harmony: [
          N.E4, _, N.G4, _, N.C5, _, N.E5, _, N.D4, _, N.G4, _, N.B4, _, N.D5, _,
          N.C4, _, N.F4, _, N.A4, _, N.C5, _, N.B3, _, N.D4, _, N.G4, _, N.C4, _
        ],
        bass: [
          N.C3, _, N.G2, _, N.C3, _, N.G2, _, N.G2, _, N.D3, _, N.G2, _, N.D3, _,
          N.F2, _, N.C3, _, N.C3, _, N.G2, _, N.G2, _, N.G2, _, N.C3, _, N.C3, _
        ],
        drums: [
          'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 's', 's', 'o',
          'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'k', 's', 'o'
        ]
      };
    }

    if (type === 'stage4') {
      // 🍣 『和風キッチン・ファンクネス』(Japanese Pentatonic Funk / 138 BPM)
      return {
        bpm: 138,
        length: 32,
        melody: [
          N.A5, _, N.C6, _, N.D6, _, N.E6, N.D6, N.C6, _, N.A5, _, N.G5, _, N.A5, _,
          N.C6, _, N.D6, _, N.E6, _, N.G6, _, N.E6, _, N.D6, _, N.C6, N.A5, N.G5, _
        ],
        harmony: [
          N.C5, _, N.E5, _, N.G5, _, N.A5, _, N.D5, _, N.F5, _, N.A5, _, N.C6, _,
          N.E5, _, N.G5, _, N.B5, _, N.D6, _, N.C5, _, N.E5, _, N.A5, _, N.C6, _
        ],
        bass: [
          N.A2, _, N.A3, _, N.G2, _, N.G3, _, N.D2, _, N.D3, _, N.F2, _, N.G2, _,
          N.A2, _, N.A3, _, N.C3, _, N.C4, _, N.E2, _, N.E3, _, N.A2, _, N.E3, _
        ],
        drums: [
          'k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'o',
          'k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 's', 'k', 'o'
        ]
      };
    }

    if (type === 'boss4' || type === 'boss4_rage') {
      // 🏮 『暴走板前の包丁さばき』(Intense Japanese Rock / 146 -> 162 BPM)
      const isRage = (type === 'boss4_rage');
      return {
        bpm: isRage ? 162 : 146,
        length: 32,
        melody: [
          N.D5, N.D5, N.F5, N.F5, N.G5, _, N.Ab5, N.G5, N.F5, _, N.D5, _, N.C5, _, N.D5, _,
          N.F5, _, N.G5, _, N.Ab5, N.A5, N.C6, _, N.D6, _, N.C6, N.A5, N.F5, _, N.D5, _
        ],
        harmony: [
          N.F4, _, N.A4, _, N.D5, _, N.F5, _, N.Ab4, _, N.C5, _, N.D5, _, N.F5, _,
          N.G4, _, N.B4, _, N.D5, _, N.G5, _, N.A4, _, N.Cs5, _, N.E5, _, N.A5, _
        ],
        bass: [
          N.D3, N.D3, _, N.D3, N.D3, _, N.F3, _, N.G3, N.G3, _, N.Ab3, N.A3, _, N.D3, _,
          N.D3, N.D3, _, N.D3, N.F3, _, N.G3, _, N.A3, _, N.C4, _, N.D4, N.C4, N.A3, _
        ],
        drums: [
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'o',
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'k', 's', 'k', 's', 's', 'k', 'o'
        ]
      };
    }

    if (type === 'stage5') {
      // 🏖️ 『トロピカル・キャット・パラダイス』(Reggae / Ska Chiptune / 118 BPM)
      return {
        bpm: 118,
        length: 32,
        melody: [
          N.C5, _, N.E5, _, N.G5, _, N.A5, _, N.G5, _, N.E5, _, N.C5, _, N.D5, _,
          N.E5, _, N.G5, _, N.C6, _, N.B5, _, N.A5, _, N.G5, _, N.E5, N.D5, N.C5, _
        ],
        harmony: [
          _, N.G4, _, N.C5, _, N.G4, _, N.C5, _, N.A4, _, N.D5, _, N.A4, _, N.D5,
          _, N.G4, _, N.C5, _, N.G4, _, N.C5, _, N.B4, _, N.E5, _, N.B4, _, N.E5
        ],
        bass: [
          N.C3, _, _, N.C3, N.G2, _, _, N.G2, N.D3, _, _, N.D3, N.A2, _, _, N.A2,
          N.C3, _, _, N.C3, N.G2, _, _, N.G2, N.E3, _, _, N.E3, N.B2, _, _, N.B2
        ],
        drums: [
          'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'o',
          'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'o'
        ]
      };
    }

    if (type === 'boss5' || type === 'boss5_rage') {
      // 🐚 『波乗りバトル・サーフロック』(Surf Rock / 150 -> 168 BPM)
      const isRage = (type === 'boss5_rage');
      return {
        bpm: isRage ? 168 : 150,
        length: 32,
        melody: [
          N.E5, N.E5, N.G5, N.G5, N.A5, N.A5, N.Bb5, N.B5, N.C6, N.C6, N.B5, N.B5, N.A5, _, N.G5, _,
          N.E5, N.E5, N.G5, N.G5, N.A5, N.A5, N.B5, _, N.D6, N.C6, N.B5, N.A5, N.G5, _, N.E5, _
        ],
        harmony: [
          N.G4, _, N.B4, _, N.E5, _, N.G5, _, N.A4, _, N.C5, _, N.E5, _, N.A5, _,
          N.G4, _, N.B4, _, N.E5, _, N.G5, _, N.B4, _, N.D5, _, N.F5, _, N.B5, _
        ],
        bass: [
          N.E2, N.E2, N.G2, N.G2, N.A2, N.A2, N.Bb2, N.B2, N.C3, N.C3, N.B2, N.B2, N.A2, _, N.G2, _,
          N.E2, N.E2, N.G2, N.G2, N.A2, N.A2, N.B2, _, N.D3, N.C3, N.B2, N.A2, N.G2, _, N.E2, _
        ],
        drums: [
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'o',
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'k', 's', 'k', 's', 'k', 's', 'o'
        ]
      };
    }

    if (type === 'stage6') {
      // 👻 『ゴースト・ワルツ・イン・ザ・ダーク』(Gothic Waltz 3/4拍子 / 108 BPM)
      return {
        bpm: 108,
        length: 24,
        melody: [
          N.D5, _, N.F5, N.A5, N.Gs5, _, N.B5, N.D6, N.C6, _, N.A5, N.F5,
          N.E5, _, N.G5, N.Bb5, N.A5, _, N.Cs5, N.E5, N.D5, _, _, _
        ],
        harmony: [
          N.F4, _, N.A4, N.D5, N.F4, _, N.B4, N.D5, N.E4, _, N.A4, N.C5,
          N.Cs4, _, N.E4, N.G4, N.Cs4, _, N.E4, N.A4, N.D4, _, N.F4, N.A4
        ],
        bass: [
          N.D3, _, N.A2, N.D3, N.B2, _, N.F2, N.B2, N.A2, _, N.E2, N.A2,
          N.G2, _, N.D2, N.G2, N.A2, _, N.E2, N.A2, N.D3, _, N.A2, N.D3
        ],
        drums: [
          'k', 'h', 'h', 's', 'h', 'h', 'k', 'h', 'h', 's', 'h', 'h',
          'k', 'h', 'h', 's', 'h', 'h', 'k', 'h', 'h', 's', 's', 'o'
        ]
      };
    }

    if (type === 'boss6' || type === 'boss6_rage') {
      // 🎩 『ファントムの狂宴カーニバル』(Dark Carnival / 140 -> 158 BPM)
      const isRage = (type === 'boss6_rage');
      return {
        bpm: isRage ? 158 : 140,
        length: 32,
        melody: [
          N.A5, _, N.E5, _, N.A5, _, N.B5, _, N.C6, _, N.B5, _, N.A5, _, N.Gs5, _,
          N.B5, _, N.E5, _, N.B5, _, N.C6, _, N.D6, _, N.C6, _, N.B5, _, N.A5, _
        ],
        harmony: [
          N.C5, _, N.E5, _, N.A5, _, N.C6, _, N.B4, _, N.D5, _, N.E5, _, N.Gs5, _,
          N.D5, _, N.F5, _, N.A5, _, N.D6, _, N.C5, _, N.E5, _, N.A5, _, N.C6, _
        ],
        bass: [
          N.A2, N.A2, _, N.E2, N.A2, N.A2, _, N.E2, N.E2, N.E2, _, N.B1, N.E2, N.E2, _, N.B1,
          N.D2, N.D2, _, N.A1, N.D2, N.D2, _, N.A1, N.A2, N.A2, _, N.E2, N.A2, N.A2, _, N.E2
        ],
        drums: [
          'k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 'k', 's', 'o',
          'k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 's', 's', 'o'
        ]
      };
    }

    if (type === 'stage7') {
      // 🚀 『スターダスト・クルーズ』(Space Synthwave / 126 BPM)
      return {
        bpm: 126,
        length: 32,
        melody: [
          N.C5, N.G5, N.C6, N.E6, N.G5, N.C6, N.E6, N.G6, N.A5, N.E6, N.A6, N.C7, N.E6, N.A6, N.C7, N.E7,
          N.F5, N.C6, N.F6, N.A6, N.C6, N.F6, N.A6, N.C7, N.G5, N.D6, N.G6, N.B6, N.D6, N.G6, N.B6, N.D7
        ],
        harmony: [
          N.E4, _, N.G4, _, N.C5, _, N.E5, _, N.C4, _, N.E4, _, N.A4, _, N.C5, _,
          N.A3, _, N.C4, _, N.F4, _, N.A4, _, N.B3, _, N.D4, _, N.G4, _, N.B4, _
        ],
        bass: [
          N.C2, _, N.C3, _, N.C2, _, N.C3, _, N.A1, _, N.A2, _, N.A1, _, N.A2, _,
          N.F1, _, N.F2, _, N.F1, _, N.F2, _, N.G1, _, N.G2, _, N.G1, _, N.G2, _
        ],
        drums: [
          'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'o',
          'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'h', 'k', 'k', 's', 'o'
        ]
      };
    }

    if (type === 'boss7' || type === 'boss7_rage') {
      // 👽 『宇宙皇帝の逆襲』(Epic Space Opera / 152 -> 170 BPM)
      const isRage = (type === 'boss7_rage');
      return {
        bpm: isRage ? 170 : 152,
        length: 32,
        melody: [
          N.C5, _, N.Eb5, _, N.G5, _, N.C6, _, N.D6, _, N.Eb6, _, N.D6, _, N.B5, _,
          N.C6, _, N.G5, _, N.Eb5, _, N.F5, _, N.G5, _, N.Ab5, _, N.B5, _, N.C6, _
        ],
        harmony: [
          N.Eb4, _, N.G4, _, N.C5, _, N.Eb5, _, N.F4, _, N.Ab4, _, N.B4, _, N.D5, _,
          N.Eb4, _, N.G4, _, N.C5, _, N.Eb5, _, N.D4, _, N.F4, _, N.G4, _, N.B4, _
        ],
        bass: [
          N.C2, N.C2, _, N.G1, N.C2, N.C2, _, N.G1, N.G1, N.G1, _, N.D1, N.G1, N.G1, _, N.D1,
          N.C2, N.C2, _, N.G1, N.C2, N.C2, _, N.G1, N.Ab1, N.Ab1, _, N.Eb1, N.G1, N.G1, _, N.D1
        ],
        drums: [
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'o',
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'k', 's', 's', 'k', 'k', 's', 'o'
        ]
      };
    }

    if (type === 'stage8') {
      // 👑 『天空城の壮大なるファンファーレ』(Orchestral March / 132 BPM)
      return {
        bpm: 132,
        length: 32,
        melody: [
          N.C5, _, N.E5, N.G5, N.C6, _, N.G5, _, N.A5, _, N.B5, N.C6, N.D6, _, N.C6, _,
          N.E6, _, N.D6, _, N.C6, _, N.B5, _, N.A5, N.B5, N.C6, N.A5, N.G5, _, _, _
        ],
        harmony: [
          N.G4, _, N.C5, _, N.E5, _, N.C5, _, N.F4, _, N.A4, _, N.D5, _, N.A4, _,
          N.G4, _, N.B4, _, N.E5, _, N.B4, _, N.F4, _, N.A4, _, N.E4, _, N.G4, _
        ],
        bass: [
          N.C3, _, N.G2, _, N.C3, _, N.G2, _, N.F2, _, N.C3, _, N.D3, _, N.A2, _,
          N.E3, _, N.B2, _, N.C3, _, N.G2, _, N.F2, _, N.G2, _, N.C3, _, N.G2, _
        ],
        drums: [
          'k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'o',
          'k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 's', 's', 'o'
        ]
      };
    }

    if (type === 'boss8' || type === 'boss8_rage') {
      // 👑 『真・最終決戦シンフォニー』(Ultimate Battle Symphony / 155 -> 175 BPM)
      const isRage = (type === 'boss8_rage');
      return {
        bpm: isRage ? 175 : 155,
        length: 32,
        melody: [
          N.C5, N.C5, N.Eb5, N.G5, N.C6, _, N.B5, _, N.Ab5, N.Ab5, N.C6, N.Eb6, N.D6, _, N.B5, _,
          N.Eb6, N.D6, N.C6, N.B5, N.C6, _, N.G5, _, N.Ab5, N.G5, N.F5, N.Eb5, N.D5, _, N.C5, _
        ],
        harmony: [
          N.Eb4, _, N.G4, _, N.C5, _, N.Eb5, _, N.C4, _, N.Eb4, _, N.Ab4, _, N.C5, _,
          N.C4, _, N.F4, _, N.Ab4, _, N.C5, _, N.D4, _, N.F4, _, N.G4, _, N.B4, _
        ],
        bass: [
          N.C2, N.C2, _, N.G1, N.C2, N.C2, _, N.G1, N.Ab1, N.Ab1, _, N.Eb1, N.Ab1, N.Ab1, _, N.Eb1,
          N.F1, N.F1, _, N.C1, N.F1, N.F1, _, N.C1, N.G1, N.G1, _, N.D1, N.G1, N.G1, _, N.G1
        ],
        drums: [
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'o',
          'k', 's', 'k', 's', 'k', 's', 'k', 's', 'k', 'k', 's', 's', 'k', 'k', 's', 'o'
        ]
      };
    }

    // 🐾 『にゃんこのお散歩スウィング』(エレクトロ・スウィング × チップチューン / 128 BPM)
    // コード: Cmaj7 -> Am7 -> Dm7 -> G7 (跳ねるシャッフルリズム)
    return {
      bpm: 128,
      length: 32,
      melody: [
        N.E5, _, N.G5, _, N.A5, _, N.G5, _, N.C6, _, N.B5, _, N.A5, _, N.G5, _,
        N.F5, _, N.A5, _, N.D6, _, N.C6, _, N.B5, _, N.G5, _, N.A5, N.B5, N.C6, _
      ],
      harmony: [
        N.E4, _, N.G4, _, N.C5, _, N.E5, _, N.C4, _, N.E4, _, N.A4, _, N.C5, _,
        N.F4, _, N.A4, _, N.D5, _, N.F5, _, N.D4, _, N.F4, _, N.B4, _, N.D5, _
      ],
      bass: [
        N.C3, _, N.E3, _, N.G3, _, N.A3, _, N.A2, _, N.C3, _, N.E3, _, N.G3, _,
        N.D3, _, N.F3, _, N.A3, _, N.C4, _, N.G2, _, N.B2, _, N.D3, _, N.F3, _
      ],
      drums: [
        'k', _, 'h', 'k', 's', _, 'h', _, 'k', _, 'h', 'k', 's', _, 'h', 'o',
        'k', _, 'h', 'k', 's', _, 'h', _, 'k', _, 'h', 'k', 's', _, 'h', 'o'
      ]
    };
  }

  // =========================================================================
  // 🔊 ゲームフィール（Juice）極上効果音（SE）群
  // =========================================================================

  // ★ ジャンプ音（ピョコン！弾むFMチャープ）
  playJump() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.14);

    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // ★ コイン / おやつ取得音（澄み渡るベル和音：チロリン♪）
  playCoin() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [NOTE.E6, NOTE.B6]; // 長5度 (1318.51Hz, 1975.53Hz)

      freqs.forEach((f, i) => {
        if (!f || isNaN(f)) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.055;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.seMasterGain);
        osc.start(t);
        osc.stop(t + 0.18);
      });
    } catch (e) {
      console.warn('playCoin error:', e);
    }
  }

  // ★ チャージLv2到達音（ピロリン！エネルギー蓄積音）
  playMidCharge() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [NOTE.Eb5, NOTE.Ab5, NOTE.C6];
      freqs.forEach((f, i) => {
        if (!f || isNaN(f)) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.04;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.20, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(this.seMasterGain);
        osc.start(t);
        osc.stop(t + 0.15);
      });
    } catch (e) {
      console.warn('playMidCharge error:', e);
    }
  }

  // ★ 肉球波動拳 Lv.1 通常弾（ポシュッ！軽快ノイズパフ＋サインチャープ）
  playPawShot() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // ノイズパフ（空気を裂く打撃）
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.18, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.seMasterGain);
      noise.start(now);
      noise.stop(now + 0.06);
    }

    // チャープ音
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.11);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  // ★ 中チャージ弾 Lv.2（ビシュゥゥン！エネルギー濃縮下降スイープ）
  playMidHadouken() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.duckBGM(0.18, 0.25);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  // ★ 極大・肉球波動拳 Lv.3（ドゴォォォン！！40Hzサブベース＋特大爆発＋黄金チャイム）
  playHadouken() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.duckBGM(0.45, 0.08); // BGMを強力ダッキング！

      // 1. 重低音サブベース (40Hz〜25Hz)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(85, now);
      subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.45);
      subGain.gain.setValueAtTime(0.60, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      subOsc.connect(subGain);
      subGain.connect(this.seMasterGain);
      subOsc.start(now);
      subOsc.stop(now + 0.45);

      // 2. 特大爆発ノイズバースト
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.5);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.45, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.seMasterGain);
        noise.start(now);
        noise.stop(now + 0.52);
      }

      // 3. 黄金チャイム閃光音 (E6 + G#6 + B6)
      [NOTE.E6, NOTE.Ab6, NOTE.B6].forEach((f, idx) => {
        if (!f || isNaN(f)) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.03);
        gain.gain.setValueAtTime(0.22, now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.seMasterGain);
        osc.start(now + idx * 0.03);
        osc.stop(now + 0.35);
      });
    } catch (e) {
      console.warn('playHadouken error:', e);
    }
  }

  // ★ ひっかき攻撃音（風切りノイズ＋金属的スラッシュ：シャキィィン！）
  playScratch() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // ★ 敵撃破音（弾けるポップコーン：ポンッ！）
  playEnemyDefeat() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.11);

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // ★ ボス被弾音（ドスッ！重低音パンチ＋火花）
  playBossHit() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.duckBGM(0.14, 0.20);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);

    gain.gain.setValueAtTime(0.40, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  // ★ プレイヤー被弾音
  playHit() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  // ★ パワーアップ音（またたび取得）
  playPowerUp() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.04;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.connect(gain);
      gain.connect(this.seMasterGain);
      osc.start(t);
      osc.stop(t + 0.14);
    });
  }

  // ★ チャージループ音（ウィィィンと周波数が上昇）
  startCharge() {
    if (this.muted || !this.ctx || this.chargeOsc) return;
    try {
      const now = this.ctx.currentTime;
      this.chargeOsc = this.ctx.createOscillator();
      this.chargeGain = this.ctx.createGain();
      this.chargeOsc.type = 'sawtooth';
      this.chargeOsc.frequency.setValueAtTime(140, now);
      this.chargeOsc.frequency.linearRampToValueAtTime(560, now + 3.0);
      this.chargeGain.gain.setValueAtTime(0.12, now);
      this.chargeOsc.connect(this.chargeGain);
      this.chargeGain.connect(this.seMasterGain);
      this.chargeOsc.start(now);
    } catch (e) {
      console.warn('startCharge error:', e);
      this.chargeOsc = null;
      this.chargeGain = null;
    }
  }

  stopCharge() {
    if (this.chargeOsc) {
      try {
        this.chargeOsc.stop();
        this.chargeOsc.disconnect();
      } catch (e) {}
      this.chargeOsc = null;
      this.chargeGain = null;
    }
  }

  // ★ チャージ完了音（キラーン！！）
  playChargeComplete() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [NOTE.C6, NOTE.G6, NOTE.C7].forEach((freq, i) => {
        if (!freq || isNaN(freq)) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.04;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(this.seMasterGain);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch (e) {
      console.warn('playChargeComplete error:', e);
    }
  }

  playStomp() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 🌟 奇跡の覚醒！スーパー覚醒ファンファーレジングルSE（壮麗な上昇アルペジオ＆クライマックス和音）
  playSuperAwakening() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 1. パワフルな上昇アルペジオ
      const notes = [NOTE.C4, NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.E6, NOTE.G6, NOTE.C7];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.045;
        osc.type = (idx % 2 === 0) ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.26, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(this.seMasterGain);
        osc.start(t);
        osc.stop(t + 0.35);
      });
      // 2. 覚醒のクライマックス和音（C6 + E6 + G6 + C7）
      const chordTime = now + notes.length * 0.045;
      [NOTE.C6, NOTE.E6, NOTE.G6, NOTE.C7].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);
        gain.gain.setValueAtTime(0.24, chordTime);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.9);
        osc.connect(gain);
        gain.connect(this.seMasterGain);
        osc.start(chordTime);
        osc.stop(chordTime + 0.9);
      });
    } catch (e) {
      console.warn('playSuperAwakening error:', e);
    }
  }

  // ★ ステージクリア・勝利ファンファーレ（華やかなブラス和音！）
  playVictory() {
    this.stopBGM();
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const fan = [
      { f: NOTE.G4, d: 0.14 },
      { f: NOTE.C5, d: 0.14 },
      { f: NOTE.E5, d: 0.14 },
      { f: NOTE.G5, d: 0.35 },
      { f: NOTE.E5, d: 0.14 },
      { f: NOTE.G5, d: 0.65 }
    ];
    let time = now;
    fan.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, time);
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);
      osc.connect(gain);
      gain.connect(this.seMasterGain);
      osc.start(time);
      osc.stop(time + note.d);
      time += note.d * 1.05;
    });
  }

  // =========================================================================
  // 🍙 おにぎり専用SE（かなでミュージック調律：梅干し投擲・着弾・もちもちアクション）
  // =========================================================================

  // 🍙 もちもちジャンプ音（ポヨ〜ン♪）
  playOnigiriJump() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.22);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // 🍙 梅干し投げSE（Lv1: ポスッ！ / Lv2: ピシュッ！ / Lv3: ズドォォン！）
  playUmeboshiThrow(chargeLevel = 1) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (chargeLevel === 3) {
      // Lv3: 極大黄金紀州南高梅ボム投擲！
      this.duckBGM(0.4, 0.1);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.seMasterGain);
      osc.start(now);
      osc.stop(now + 0.35);

      // きらめき高音
      const highOsc = this.ctx.createOscillator();
      const highGain = this.ctx.createGain();
      highOsc.type = 'triangle';
      highOsc.frequency.setValueAtTime(880, now);
      highOsc.frequency.exponentialRampToValueAtTime(1760, now + 0.25);
      highGain.gain.setValueAtTime(0.25, now);
      highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      highOsc.connect(highGain);
      highGain.connect(this.seMasterGain);
      highOsc.start(now);
      highOsc.stop(now + 0.25);

    } else if (chargeLevel === 2) {
      // Lv2: 大粒梅干し投擲！
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.16);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.seMasterGain);
      osc.start(now);
      osc.stop(now + 0.16);

    } else {
      // Lv1: 軽快な梅干しスロー（ポスッ！）
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.10);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
      osc.connect(gain);
      gain.connect(this.seMasterGain);
      osc.start(now);
      osc.stop(now + 0.10);
    }
  }

  // 🍙 梅干し着弾・酸っぱ破裂音（ペチッ！ / ジュワッ！）
  playUmeboshiHit(chargeLevel = 1) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. ペチッとしたコミカルな打撃音
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.seMasterGain);
    osc.start(now);
    osc.stop(now + 0.09);

    // 2. ジュワッとした果肉スプラッシュノイズ
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.0, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(chargeLevel >= 2 ? 0.28 : 0.15, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + (chargeLevel >= 3 ? 0.25 : 0.12));

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.seMasterGain);
      noise.start(now);
      noise.stop(now + (chargeLevel >= 3 ? 0.25 : 0.12));
    }
  }

  // =========================================================================
  // 🎬 ボス登場シネマティック音響（かなでミュージック調律）
  // =========================================================================

  // ★ BGM即時サイレンス（完全な無音化）
  silenceBGM() {
    this.stopBGM();
    this.bgmPlaying = false;
    this.currentTrack = null;
  }

  // ★ 心臓の鼓動SE（重低音サブベース「ドクン…」）
  playHeartbeat(intensity = 1.0) {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 第1打: 重く沈む「ド」
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 0.13);
      gain1.gain.setValueAtTime(0.40 * intensity, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(this.seMasterGain);
      osc1.start(now);
      osc1.stop(now + 0.14);

      // 第2打: 0.14秒後の引き締まった「クン」
      const t2 = now + 0.14;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(78, t2);
      osc2.frequency.exponentialRampToValueAtTime(36, t2 + 0.16);
      gain2.gain.setValueAtTime(0.32 * intensity, t2);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.17);
      osc2.connect(gain2);
      gain2.connect(this.seMasterGain);
      osc2.start(t2);
      osc2.stop(t2 + 0.17);
    } catch (e) {
      console.warn('playHeartbeat error:', e);
    }
  }

  // ★ ボス登場インパクト轟音SE（重低音ブラスター＋金属衝撃＋拡散クラッシュ）
  playBossImpact() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // 1. サブベース・急降下ブラスター（ズドォォン！）
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.55);
      subGain.gain.setValueAtTime(0.60, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.60);
      subOsc.connect(subGain);
      subGain.connect(this.seMasterGain);
      subOsc.start(now);
      subOsc.stop(now + 0.60);

      // 2. 金属的スラッシュアタック（ジャキィィン！）
      const sawOsc = this.ctx.createOscillator();
      const sawFilter = this.ctx.createBiquadFilter();
      const sawGain = this.ctx.createGain();
      sawOsc.type = 'sawtooth';
      sawOsc.frequency.setValueAtTime(220, now);
      sawOsc.frequency.exponentialRampToValueAtTime(50, now + 0.35);
      sawFilter.type = 'lowpass';
      sawFilter.frequency.setValueAtTime(2800, now);
      sawFilter.frequency.exponentialRampToValueAtTime(300, now + 0.35);
      sawFilter.Q.setValueAtTime(4.0, now);
      sawGain.gain.setValueAtTime(0.35, now);
      sawGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      sawOsc.connect(sawFilter);
      sawFilter.connect(sawGain);
      sawGain.connect(this.seMasterGain);
      sawOsc.start(now);
      sawOsc.stop(now + 0.38);

      // 3. 拡散クラッシュノイズ
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        nFilter.frequency.setValueAtTime(1200, now);
        nFilter.frequency.exponentialRampToValueAtTime(180, now + 0.50);
        nFilter.Q.setValueAtTime(1.8, now);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.32, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);
        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.seMasterGain);
        noise.start(now);
        noise.stop(now + 0.52);
      }
    } catch (e) {
      console.warn('playBossImpact error:', e);
    }
  }
}

window.sound = new SoundSystem();
