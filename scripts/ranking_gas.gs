/**
 * =============================================================================
 * 🐾 にゃんこタウン大冒険！ 全国ランキングAPI (Google Apps Script)
 * 👑 統括プロデューサー: ひろあき軍曹
 * =============================================================================
 * 
 * 【設置手順（約2分）】
 * 1. Googleスプレッドシートを開き、「拡張機能」➔「Apps Script」をクリック。
 * 2. 本スクリプトの内容を貼り付けて保存（💾）。
 * 3. 画面右上の「デプロイ」➔「新しいデプロイ」をクリック。
 * 4. 種類:「ウェブアプリ」、アクセスできるユーザー:「全員」に設定して「デプロイ」。
 * 5. 発行されたURLをゲームの rankingManager.gasUrl に設定すれば完了！
 */

const RANKING_SHEET_NAME = '全国ランキング';

// GETリクエスト: TOP10ランキング取得
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getTopScores';
    if (action === 'getTopScores') {
      const topScores = getTopScoresList();
      return createJsonResponse({ status: 'ok', scores: topScores });
    }
    return ContentService.createTextOutput("🐾 にゃんこタウン大冒険！ ランキングAPI 正常稼働中！");
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

// POSTリクエスト: スコア登録＆最新ランキング返却
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(RANKING_SHEET_NAME);
    
    // シートが存在しない場合はヘッダー付きで自動作成
    if (!sheet) {
      sheet = ss.insertSheet(RANKING_SHEET_NAME);
      sheet.appendRow(['順位', '登録日時', 'プレイヤー名', 'スコア', '到達ステージ', '使用キャラ', 'クリアタイム']);
      sheet.getRange('A1:G1').setBackground('#ff4d6d').setFontColor('#ffffff').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
    const name = (data.name || 'ななしのねこ').toString().trim().substring(0, 10);
    const score = parseInt(data.score, 10) || 0;
    const stage = parseInt(data.stage, 10) || 1;
    const character = data.character === 'onigiri' ? '🍙 おにぎり' : '🐾 白ねこ';
    const playTime = data.playTime || '-';

    // 1行追記
    sheet.appendRow(['-', now, name, score, stage, character, playTime]);

    // スコア降順（D列 = 4列目）でソート
    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(2, 1, lastRow - 1, 7).sort({ column: 4, ascending: false });
    }

    // 順位（A列）の再採番
    const numScores = sheet.getLastRow() - 1;
    if (numScores > 0) {
      const rankVals = [];
      for (let i = 1; i <= numScores; i++) {
        rankVals.push([i]);
      }
      sheet.getRange(2, 1, numScores, 1).setValues(rankVals);
    }

    // プレイヤーの順位を特定
    let playerRank = numScores;
    const allData = sheet.getRange(2, 1, Math.min(100, numScores), 7).getValues();
    for (let i = 0; i < allData.length; i++) {
      if (allData[i][2] === name && allData[i][3] === score) {
        playerRank = i + 1;
        break;
      }
    }

    const topScores = getTopScoresList();
    return createJsonResponse({
      status: 'ok',
      rank: playerRank,
      scores: topScores
    });

  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

// 上位スコア取得ヘルパー
function getTopScoresList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(RANKING_SHEET_NAME);
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  const count = Math.min(20, lastRow - 1);
  const values = sheet.getRange(2, 1, count, 7).getValues();

  return values.map(row => ({
    rank: row[0],
    date: row[1],
    name: row[2],
    score: row[3],
    stage: row[4],
    character: row[5],
    playTime: row[6]
  }));
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
