// =============================================================================
// 🐾 にゃんこタウン大冒険！ ランキング＆スコア管理システム (src/ranking.js)
// 👑 ひろあき軍曹 統括プロデュース
// 【機能】LocalStorageローカル保存 ＋ Google Apps Script (GAS) 全国オンラインランキング
// =============================================================================

class RankingManager {
  constructor() {
    this.STORAGE_KEYS = {
      HIGH_SCORE: 'nyanko_high_score',
      BEST_STAGE: 'nyanko_best_stage',
      TOTAL_COINS: 'nyanko_total_coins',
      NICKNAME: 'nyanko_player_name',
      ALL_CLEAR_COUNT: 'nyanko_all_clear_count',
      LAST_SUBMITTED_SCORE: 'nyanko_last_submitted_score'
    };

    // Google Apps Script (GAS) ランキングAPI Webhook URL
    // ※未設定時はローカルランキングとして美しくスタンドアロン動作
    this.gasUrl = 'https://script.google.com/macros/s/AKfycbwvWo1tYt9AC72BQ0QUF08CghV8pwkczTi1pTaOtpkwE9P_kRHCem6QAzk1tPGCnELlrA/exec';

    this.cachedOnlineScores = null;
    this.totalPlayers = 1000;
    this.lastSubmittedEntry = null;
    this.submittedSessionIds = new Set();
    this.currentSessionId = null;
    this.currentSubmitCallback = null;
    this.isFetching = false;
    this.isSubmitting = false;

    this.initModalDOM();
  }

  // ---------------------------------------------------------------------------
  // 💾 LocalStorage ローカルデータ管理
  // ---------------------------------------------------------------------------

  getLocalData() {
    try {
      return {
        highScore: parseInt(localStorage.getItem(this.STORAGE_KEYS.HIGH_SCORE), 10) || 0,
        bestStage: parseInt(localStorage.getItem(this.STORAGE_KEYS.BEST_STAGE), 10) || 1,
        totalCoins: parseInt(localStorage.getItem(this.STORAGE_KEYS.TOTAL_COINS), 10) || 0,
        nickname: localStorage.getItem(this.STORAGE_KEYS.NICKNAME) || 'ななしのねこ',
        allClearCount: parseInt(localStorage.getItem(this.STORAGE_KEYS.ALL_CLEAR_COUNT), 10) || 0
      };
    } catch (e) {
      console.warn('LocalStorage not available:', e);
      return {
        highScore: 0,
        bestStage: 1,
        totalCoins: 0,
        nickname: 'ななしのねこ',
        allClearCount: 0
      };
    }
  }

  saveScore(currentScore, stageNum, coinsGained = 0, isAllClear = false) {
    try {
      const data = this.getLocalData();
      let isNewHighScore = false;
      let isNewBestStage = false;

      if (currentScore > data.highScore) {
        data.highScore = currentScore;
        localStorage.setItem(this.STORAGE_KEYS.HIGH_SCORE, currentScore.toString());
        isNewHighScore = true;
      }

      if (stageNum > data.bestStage) {
        data.bestStage = stageNum;
        localStorage.setItem(this.STORAGE_KEYS.BEST_STAGE, stageNum.toString());
        isNewBestStage = true;
      }

      if (coinsGained > 0) {
        data.totalCoins += coinsGained;
        localStorage.setItem(this.STORAGE_KEYS.TOTAL_COINS, data.totalCoins.toString());
      }

      if (isAllClear) {
        data.allClearCount += 1;
        localStorage.setItem(this.STORAGE_KEYS.ALL_CLEAR_COUNT, data.allClearCount.toString());
      }

      return {
        isNewHighScore,
        highScore: data.highScore,
        isNewBestStage,
        bestStage: data.bestStage,
        totalCoins: data.totalCoins,
        allClearCount: data.allClearCount
      };
    } catch (e) {
      console.warn('Failed to save score to LocalStorage:', e);
      return {
        isNewHighScore: false,
        highScore: currentScore,
        isNewBestStage: false,
        bestStage: stageNum,
        totalCoins: 0,
        allClearCount: 0
      };
    }
  }

  saveNickname(name) {
    if (!name || typeof name !== 'string') return;
    const clean = name.trim().substring(0, 12);
    try {
      localStorage.setItem(this.STORAGE_KEYS.NICKNAME, clean);
    } catch (e) {
      console.warn('Failed to save nickname:', e);
    }
  }

  getNickname() {
    return this.getLocalData().nickname;
  }

  // ---------------------------------------------------------------------------
  // 🌐 Google Apps Script (GAS) オンライン通信
  // ---------------------------------------------------------------------------

  async fetchTopScores() {
    if (!this.gasUrl) {
      return this.getFallbackScores();
    }

    this.isFetching = true;
    try {
      const url = `${this.gasUrl}?action=getTopScores&t=${Date.now()}`;
      const res = await fetch(url, { method: 'GET', mode: 'cors' });
      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'ok' && Array.isArray(json.scores)) {
          this.cachedOnlineScores = json.scores;
          if (json.totalPlayers) {
            this.totalPlayers = json.totalPlayers;
          }
          return json.scores;
        }
      }
    } catch (err) {
      console.warn('GAS fetchTopScores network error, using fallback:', err);
    } finally {
      this.isFetching = false;
    }

    return this.getFallbackScores();
  }

  async submitScore({ name, score, stage, character, playTime, sessionId }) {
    this.saveNickname(name);

    if (!this.gasUrl) {
      return { status: 'local_only', message: 'オフラインモードで保存しました！' };
    }

    this.isSubmitting = true;
    try {
      const payload = {
        action: 'submitScore',
        name: (name || 'ななしのねこ').substring(0, 10),
        score: parseInt(score, 10) || 0,
        stage: parseInt(stage, 10) || 1,
        character: character || 'cat',
        playTime: playTime || '-',
        sessionId: sessionId || ''
      };

      const res = await fetch(this.gasUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'ok') {
          if (Array.isArray(json.scores)) {
            this.cachedOnlineScores = json.scores;
          }
          if (json.totalPlayers) {
            this.totalPlayers = json.totalPlayers;
          }
          const playerEntry = json.playerScore || {
            rank: json.rank,
            name: payload.name,
            score: payload.score,
            stage: payload.stage,
            character: payload.character
          };
          this.lastSubmittedEntry = playerEntry;
          return {
            status: 'ok',
            rank: json.rank,
            totalPlayers: json.totalPlayers || this.totalPlayers,
            scores: json.scores,
            playerScore: playerEntry
          };
        }
      }
    } catch (err) {
      console.warn('GAS submitScore network error:', err);
    } finally {
      this.isSubmitting = false;
    }

    return { status: 'fallback', message: 'ローカルにハイスコアを記録しました！' };
  }

  getFallbackScores() {
    if (this.cachedOnlineScores && this.cachedOnlineScores.length > 0) {
      return this.cachedOnlineScores;
    }
    const local = this.getLocalData();
    return [
      { rank: 1, name: local.nickname || '白ねこチャンピオン', score: Math.max(local.highScore, 100000), stage: 8, character: 'cat', date: '本日' },
      { rank: 2, name: 'ドン・ニャルレオーネ', score: 85000, stage: 7, character: 'cat', date: '殿堂入り' },
      { rank: 3, name: '梅干しマスター', score: 72000, stage: 6, character: 'onigiri', date: '殿堂入り' },
      { rank: 4, name: 'スペースねずみ', score: 54000, stage: 5, character: 'cat', date: '殿堂入り' },
      { rank: 5, name: 'キャットパレス見習い', score: 32000, stage: 3, character: 'cat', date: '殿堂入り' }
    ];
  }

  // ---------------------------------------------------------------------------
  // 🎨 ランキングモーダル UI
  // ---------------------------------------------------------------------------

  initModalDOM() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('rankingModal')) return;

    const modal = document.createElement('div');
    modal.id = 'rankingModal';
    modal.className = 'ranking-modal-overlay';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="ranking-modal-card">
        <button class="ranking-close-btn" id="btnCloseRanking" title="閉じる">✕</button>
        <div class="ranking-header">
          <h2>🏆 全国ハイスコアランキング 🐾</h2>
        </div>

        <!-- スコア登録フォーム（リザルト画面用） -->
        <div class="ranking-submit-box" id="rankingSubmitBox" style="display: none;">
          <div class="ranking-current-result">
            <span class="result-label">今回スコア:</span>
            <span class="result-value" id="rankingCurrentScoreText">0 点</span>
            <span class="result-stage" id="rankingCurrentStageText">(Stage 1)</span>
          </div>
          <div class="ranking-input-group">
            <input type="text" id="inputPlayerName" maxlength="10" placeholder="プレイヤー名を入力 (最大10文字)" autocomplete="off" spellcheck="false" />
            <button id="btnSubmitScore" class="ranking-submit-btn">🎖️ ランキングに登録！</button>
          </div>
          <div id="rankingSubmitStatus" class="ranking-status-msg"></div>
        </div>

        <!-- ランキングリスト -->
        <div class="ranking-list-container">
          <div id="rankingLoading" class="ranking-loading" style="display: none;">
            🐾 順位を集計中ニャ... 🍙
          </div>
          <table class="ranking-table" id="rankingTable">
            <thead>
              <tr>
                <th style="width: 18%;">順位</th>
                <th style="width: 36%;">プレイヤー名</th>
                <th style="width: 22%;">スコア</th>
                <th style="width: 14%;">到達</th>
                <th style="width: 10%;">キャラ</th>
              </tr>
            </thead>
            <tbody id="rankingTableBody">
            </tbody>
          </table>
        </div>

        <!-- フッター -->
        <div class="ranking-footer">
          <button class="ranking-action-btn" id="btnRefreshRanking">🔄 ランキング更新</button>
          <button class="ranking-action-btn close" id="btnBottomCloseRanking">とじる</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const nameInput = document.getElementById('inputPlayerName');
    if (nameInput) {
      // ⌨️ 入力中のキー入力をゲーム側に奪われないよう完全保護（※IME変換確定時のEnter誤登録を防ぐため、送信はボタンクリックのみに限定）
      nameInput.addEventListener('keydown', (e) => {
        e.stopPropagation();
      });
      nameInput.addEventListener('keyup', (e) => {
        e.stopPropagation();
      });
      nameInput.addEventListener('keypress', (e) => {
        e.stopPropagation();
      });
      nameInput.addEventListener('focus', () => {
        nameInput.select();
      });
      nameInput.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    document.getElementById('btnCloseRanking').addEventListener('click', () => this.hideRankingModal());
    document.getElementById('btnBottomCloseRanking').addEventListener('click', () => this.hideRankingModal());
    document.getElementById('btnRefreshRanking').addEventListener('click', () => this.refreshScoresList());

    document.getElementById('btnSubmitScore').addEventListener('click', async () => {
      // 🛑 1回のゲームオーバーにつき1回のみ！二重送信を完全防止
      if (this.currentSessionId && this.submittedSessionIds.has(this.currentSessionId)) {
        return;
      }

      const name = nameInput ? (nameInput.value.trim() || 'ななしのねこ') : 'ななしのねこ';
      const statusEl = document.getElementById('rankingSubmitStatus');
      const submitBtn = document.getElementById('btnSubmitScore');

      submitBtn.disabled = true;
      submitBtn.innerText = '📡 登録中...';
      if (nameInput) nameInput.disabled = true;
      statusEl.innerText = '📡 Googleスプレッドシートへ送信中...';
      statusEl.style.color = '#ffb703';

      const res = await this.submitScore({
        name,
        score: this.pendingScore || 0,
        stage: this.pendingStage || 1,
        character: this.pendingCharacter || 'cat',
        playTime: this.pendingPlayTime || '-',
        sessionId: this.currentSessionId
      });

      // 🔒 登録完了後はボタンおよび入力欄を完全に無効化
      submitBtn.disabled = true;
      submitBtn.innerText = '✅ 今回のスコアは登録済みです';
      submitBtn.classList.add('submitted');
      if (nameInput) nameInput.disabled = true;

      if (this.currentSessionId) {
        this.submittedSessionIds.add(this.currentSessionId);
      }
      if (typeof this.currentSubmitCallback === 'function') {
        this.currentSubmitCallback();
      }
      if (typeof window !== 'undefined' && window.game && typeof window.game.onScoreSubmitted === 'function') {
        window.game.onScoreSubmitted();
      }

      if (res.status === 'ok') {
        statusEl.innerText = `🎉 第 ${res.rank || 1} 位にランクインしました！`;
        statusEl.style.color = '#00f5d4';
      } else {
        statusEl.innerText = '✅ スコアをローカルに記録しました！';
        statusEl.style.color = '#00f5d4';
      }

      await this.refreshScoresList();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.hideRankingModal();
    });
  }

  showRankingModal(options = {}) {
    const modal = document.getElementById('rankingModal');
    if (!modal) return;

    const submitBox = document.getElementById('rankingSubmitBox');
    const nameInput = document.getElementById('inputPlayerName');
    const currentScoreText = document.getElementById('rankingCurrentScoreText');
    const currentStageText = document.getElementById('rankingCurrentStageText');
    const statusEl = document.getElementById('rankingSubmitStatus');
    const submitBtn = document.getElementById('btnSubmitScore');

    this.currentSessionId = options.sessionId || null;
    this.currentSubmitCallback = options.onSubmitSuccess || null;
    nameInput.value = this.getNickname();
    statusEl.innerText = '';

    const isAlreadySubmitted = options.alreadySubmitted ||
      (this.currentSessionId && this.submittedSessionIds.has(this.currentSessionId));

    if (options.allowSubmit && options.score !== undefined) {
      submitBox.style.display = 'block';
      this.pendingScore = options.score;
      this.pendingStage = options.stage || 1;
      this.pendingCharacter = options.character || 'cat';
      this.pendingPlayTime = options.playTime || '-';
      currentScoreText.innerText = `${options.score.toLocaleString()} 点`;
      currentStageText.innerText = `(Stage ${options.stage || 1})`;

      if (isAlreadySubmitted) {
        // 🔒 今回のゲームオーバーは既に登録済み
        if (nameInput) nameInput.disabled = true;
        submitBtn.disabled = true;
        submitBtn.innerText = '✅ 今回のスコアは登録済みです';
        submitBtn.classList.add('submitted');
        statusEl.innerText = '💡 1回のゲームオーバーにつき1回のみ登録できます。次の挑戦でハイスコアを目指そうニャ！';
        statusEl.style.color = '#00f5d4';
      } else {
        // ✨ 未登録の場合：新規登録を受け付け
        if (nameInput) nameInput.disabled = false;
        submitBtn.disabled = false;
        submitBtn.innerText = '🎖️ ランキングに登録！';
        submitBtn.classList.remove('submitted');

        // ✏️ 開いた瞬間に入力枠にフォーカス＆全選択（即座にタイピング・書き換え可能）
        setTimeout(() => {
          if (nameInput) {
            nameInput.focus();
            nameInput.select();
          }
        }, 100);
      }
    } else {
      submitBox.style.display = 'none';
      this.pendingScore = null;
      if (nameInput) nameInput.disabled = false;
      submitBtn.disabled = false;
      submitBtn.classList.remove('submitted');
    }

    modal.style.display = 'flex';
    this.refreshScoresList();
  }

  hideRankingModal() {
    const modal = document.getElementById('rankingModal');
    if (modal) {
      modal.style.display = 'none';
    }
    if (window.game && window.game.canvas) {
      window.game.canvas.focus();
    }
  }

  async refreshScoresList() {
    const loadingEl = document.getElementById('rankingLoading');
    const tbody = document.getElementById('rankingTableBody');
    if (!tbody) return;

    if (loadingEl) loadingEl.style.display = 'block';
    tbody.innerHTML = '';

    const scores = await this.fetchTopScores();
    if (loadingEl) loadingEl.style.display = 'none';

    this.renderRankingTable(scores, this.lastSubmittedEntry);
  }

  renderRankingTable(scores, myEntry = null) {
    const tbody = document.getElementById('rankingTableBody');
    if (!tbody) return;

    // 🏆 常にTOP 10のみを抽出
    const top10 = (scores || []).slice(0, 10);
    let isMyEntryInTop10 = false;

    let rowsHtml = top10.map((item, idx) => {
      const rank = item.rank || idx + 1;
      let medal = `${rank}`;
      let rowClass = '';
      if (rank === 1) { medal = '🥇 1位'; rowClass = 'rank-gold'; }
      else if (rank === 2) { medal = '🥈 2位'; rowClass = 'rank-silver'; }
      else if (rank === 3) { medal = '🥉 3位'; rowClass = 'rank-bronze'; }

      // プレイヤーがTOP10にランクインしている場合のハイライト判定
      let isMe = false;
      if (myEntry && (myEntry.rank === rank || (myEntry.name === item.name && myEntry.score === item.score))) {
        isMe = true;
        isMyEntryInTop10 = true;
        rowClass += ' my-rank-row';
      }

      const charIcon = (item.character === 'onigiri' || (item.character && item.character.indexOf('おにぎり') !== -1)) ? '🍙' : '🐾';
      const stageText = `St.${item.stage || 1}`;
      const scoreText = (parseInt(item.score, 10) || 0).toLocaleString();
      const badgeYou = isMe ? '<span class="badge-you">YOU</span>' : '';

      return `
        <tr class="${rowClass.trim()}">
          <td class="col-rank">${medal}</td>
          <td class="col-name">${this.escapeHtml(item.name || 'ななし')} ${badgeYou}</td>
          <td class="col-score">${scoreText}</td>
          <td class="col-stage">${stageText}</td>
          <td class="col-char">${charIcon}</td>
        </tr>
      `;
    }).join('');

    // プレイヤーが11位〜1000位の場合：TOP10の直下に区切り線とプレイヤーの順位を表示
    if (myEntry && !isMyEntryInTop10 && myEntry.rank > 10) {
      const myCharIcon = (myEntry.character === 'onigiri' || (myEntry.character && myEntry.character.indexOf('おにぎり') !== -1)) ? '🍙' : '🐾';
      const myScoreText = (parseInt(myEntry.score, 10) || 0).toLocaleString();

      rowsHtml += `
        <tr class="rank-divider-row">
          <td colspan="5"><span>┈┈┈┈┈┈ あなたの順位 ┈┈┈┈┈┈</span></td>
        </tr>
        <tr class="my-rank-row rank-outside-top10">
          <td class="col-rank">第 ${myEntry.rank.toLocaleString()} 位</td>
          <td class="col-name">${this.escapeHtml(myEntry.name || 'あなた')} <span class="badge-you">YOU</span></td>
          <td class="col-score">${myScoreText}</td>
          <td class="col-stage">St.${myEntry.stage || 1}</td>
          <td class="col-char">${myCharIcon}</td>
        </tr>
      `;
    }

    tbody.innerHTML = rowsHtml;
  }

  escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

if (typeof window !== 'undefined') {
  window.rankingManager = new RankingManager();
}
