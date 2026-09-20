/**
 * =============================================================================
 * 🐾 にゃんこタウン大冒険！ 全国ランキングAPI (Google Apps Script)
 * 👑 統括プロデューサー: ひろあき軍曹
 * =============================================================================
 * 
 * 【仕様】
 * - 最大1,000位までシートに保持・自動ソート・自動採番
 * - 表示用（doGet）は常に【TOP 10のみ】を高速返却
 * - action=init1000: 1クリックで1,000人分のリアルな全国ランキングを初期生成
 */

const RANKING_SHEET_NAME = '全国ランキング';
const MAX_RANKING_ENTRIES = 1000; // 順位は1000位まで保持

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getTopScores';

    // 🌟 1,000人分の全国ランキング一括初期生成（ブラウザで?action=init1000を開くだけで即完了）
    if (action === 'init1000') {
      const count = generate1000InitialScores();
      return createJsonResponse({
        status: 'ok',
        message: `🎉 ${count}件の全国ランキングデータ（TOP 1000）をスプレッドシートに生成しました！`
      });
    }

    // 🏆 TOP 10ランキング取得（常にTOP 10のみ返却）
    if (action === 'getTopScores') {
      const topScores = getTopScoresList(10);
      const total = getTotalPlayersCount();
      return createJsonResponse({
        status: 'ok',
        totalPlayers: total,
        scores: topScores
      });
    }

    // GET経由でのスコア登録（CORS/リダイレクト安全策）
    if (action === 'submitScore') {
      return handleScoreSubmission(e.parameter);
    }

    return ContentService.createTextOutput("🐾 にゃんこタウン大冒険！ ランキングAPI 正常稼働中！ (TOP10表示 / 最大1,000位保持)");
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return handleScoreSubmission(data);
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

// スコア登録・自動ソート・再採番・TOP10返却
function handleScoreSubmission(data) {
  const sessionId = (data && data.sessionId) ? data.sessionId.toString().trim() : '';

  // 🛑 サーバー側での重複登録ガード（同一sessionIdの連続送信を完全防止）
  if (sessionId) {
    const cache = CacheService.getScriptCache();
    const cachedRank = cache.get('sess_' + sessionId);
    if (cachedRank) {
      const topScores = getTopScoresList(10);
      return createJsonResponse({
        status: 'ok',
        rank: parseInt(cachedRank, 10) || 1,
        totalPlayers: getTotalPlayersCount(),
        scores: topScores,
        isDuplicate: true,
        message: 'このゲームオーバーのスコアは既に登録済みです。'
      });
    }
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(RANKING_SHEET_NAME);
  if (!sheet) {
    sheet = createRankingSheet(ss);
  }

  const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
  const name = (data.name || 'ななしのねこ').toString().trim().substring(0, 10);
  const score = parseInt(data.score, 10) || 0;
  const stage = parseInt(data.stage, 10) || 1;
  const character = (data.character === 'onigiri' || data.character === '🍙 おにぎり') ? '🍙 おにぎり' : '🐾 白ねこ';
  const playTime = data.playTime || '-';

  // 1行追記
  sheet.appendRow(['-', now, name, score, stage, character, playTime]);

  // スコア降順（D列 = 4列目）でソート
  let lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.getRange(2, 1, lastRow - 1, 7).sort({ column: 4, ascending: false });
  }

  // 最大1,000件上限：1000件を超えた場合は末尾を切り捨て
  lastRow = sheet.getLastRow();
  if (lastRow > MAX_RANKING_ENTRIES + 1) {
    sheet.deleteRows(MAX_RANKING_ENTRIES + 2, lastRow - (MAX_RANKING_ENTRIES + 1));
    lastRow = MAX_RANKING_ENTRIES + 1;
  }

  // 順位（A列）を1〜Nまで再採番
  const numRows = lastRow - 1;
  if (numRows > 0) {
    const ranks = [];
    for (let i = 1; i <= numRows; i++) {
      ranks.push([i]);
    }
    sheet.getRange(2, 1, numRows, 1).setValues(ranks);
  }

  // 登録されたプレイヤーの順位をシート全体から特定
  let playerRank = numRows;
  const checkRows = Math.min(numRows, MAX_RANKING_ENTRIES);
  const allNamesAndScores = sheet.getRange(2, 3, checkRows, 2).getValues();
  for (let i = 0; i < allNamesAndScores.length; i++) {
    if (allNamesAndScores[i][0] === name && allNamesAndScores[i][1] === score) {
      playerRank = i + 1;
      break;
    }
  }

  // セッションIDをキャッシュに記録（1時間重複ガード）
  if (sessionId) {
    try {
      CacheService.getScriptCache().put('sess_' + sessionId, playerRank.toString(), 3600);
    } catch (e) {
      // キャッシュ失敗時は続行
    }
  }

  // 表示用に【TOP 10のみ】を取得
  const topScores = getTopScoresList(10);

  return createJsonResponse({
    status: 'ok',
    rank: playerRank,
    totalPlayers: numRows,
    scores: topScores,
    playerScore: {
      rank: playerRank,
      name: name,
      score: score,
      stage: stage,
      character: character,
      playTime: playTime
    }
  });
}

// TOP 10スコア取得（常に最大limit件＝10件のみ返却）
function getTopScoresList(limit = 10) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(RANKING_SHEET_NAME);
  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  const numToFetch = Math.min(limit, lastRow - 1);
  const values = sheet.getRange(2, 1, numToFetch, 7).getValues();

  const scores = [];
  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    scores.push({
      rank: row[0],
      date: row[1],
      name: row[2],
      score: row[3],
      stage: row[4],
      character: row[5],
      playTime: row[6]
    });
  }
  return scores;
}

// 登録総プレイヤー数
function getTotalPlayersCount() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(RANKING_SHEET_NAME);
  if (!sheet) return 0;
  return Math.max(0, sheet.getLastRow() - 1);
}

// シート新規作成＆スタイル適用
function createRankingSheet(ss) {
  let sheet = ss.insertSheet(RANKING_SHEET_NAME);
  sheet.appendRow(['順位', '登録日時', 'プレイヤー名', 'スコア', '到達ステージ', '使用キャラ', 'クリアタイム']);
  sheet.getRange('A1:G1').setBackground('#ff4d6d').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}

// 🌟 1,000人分の全国ランキング一括初期生成ロジック
function generate1000InitialScores() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(RANKING_SHEET_NAME);
  if (sheet) {
    sheet.clear();
  } else {
    sheet = ss.insertSheet(RANKING_SHEET_NAME);
  }

  sheet.appendRow(['順位', '登録日時', 'プレイヤー名', 'スコア', '到達ステージ', '使用キャラ', 'クリアタイム']);
  sheet.getRange('A1:G1').setBackground('#ff4d6d').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);

  const catNames = [
    '白ねこレジェンド', 'ドン・ニャルレオーネ', 'キャット将軍', '天空の騎士ニャン',
    'ミケ先輩', 'トラねこ隊長', 'クロねこジジ', 'マタタビ魔人', 'タマ丸', 'シロ',
    '肉球マスター', 'にゃんたろう', 'キャットボス', 'モフモフ大魔王', 'スコティッシュ',
    'にゃんこ先生', 'ルナ', 'レオ', 'ソラ', 'コテツ', 'ふく', 'きなこ', 'こむぎ'
  ];
  const onigiriNames = [
    '梅干し大明神', '黄金おにぎり丸', 'シャケフレーク', 'ツナマヨキング', 'こしひかり特選',
    '銀河梅星ボム', 'おにぎり侍', 'のりたま', '明太子丸', '昆布マスター', '塩むすび',
    '天むすボーイ', '炊きたて魂', 'おむすびコロリン', '玄米パワー', 'おかか大将'
  ];

  const now = new Date();
  const rows = [];

  for (let i = 1; i <= 1000; i++) {
    // スコアカーブ: 1位 98,500点 〜 1000位 1,200点
    const progress = (i - 1) / 999.0;
    // べき乗減衰カーブでリアルな分布
    const rawScore = Math.round(98500 * Math.pow(1 - progress * 0.88, 1.8) + (1000 - i) * 1.5 + (Math.sin(i * 17) * 45));
    const score = Math.max(1200, Math.round(rawScore / 10) * 10);

    // ステージ判定
    let stage = 1;
    if (score >= 80000) stage = 8;
    else if (score >= 68000) stage = 7;
    else if (score >= 54000) stage = 6;
    else if (score >= 42000) stage = 5;
    else if (score >= 30000) stage = 4;
    else if (score >= 18000) stage = 3;
    else if (score >= 8000) stage = 2;

    const isCat = (i % 3 !== 0);
    const charNameList = isCat ? catNames : onigiriNames;
    const charType = isCat ? '🐾 白ねこ' : '🍙 おにぎり';
    const baseName = charNameList[i % charNameList.length];
    const name = (i <= 30) ? baseName : `${baseName}${i % 99 + 1}`;

    const pastMinutes = (1000 - i) * 14 + (i % 11) * 3;
    const dateObj = new Date(now.getTime() - pastMinutes * 60000);
    const dateStr = Utilities.formatDate(dateObj, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
    const playTime = (stage === 8 && score >= 85000) ? 'ALL CLEAR' : `St.${stage}`;

    rows.push([i, dateStr, name, score, stage, charType, playTime]);
  }

  // 1,000件を一括書き込み（超高速0.5秒）
  sheet.getRange(2, 1, 1000, 7).setValues(rows);
  return 1000;
}

function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
