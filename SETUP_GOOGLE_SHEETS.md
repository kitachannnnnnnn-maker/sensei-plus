# Google Sheets 連携セットアップガイド

このガイドに従って、複数デバイス間のデータ同期を設定します。

---

## 🚀 セットアップ手順

### **Step 1: Google Sheet を作成**

1. https://sheets.google.com を開く
2. **新規** → **スプレッドシート** をクリック
3. タイトルを「`sensei-plus-data`」に変更
4. 以下のシート構成を作成：

```
Sheet1: test
├── 列A: studentId（出席番号）
├── 列B: category（カテゴリ：good/guidance/other）
├── 列C: memo（メモ内容）
├── 列D: date（日付）
└── 列E: time（時刻）
```

5. **シート1** を右クリック → **シートの名前変更** → `test` に変更
6. 同様に `T001` と `T002` というシートを追加

---

### **Step 2: Google Apps Script を作成**

1. Sheet を開いた状態で、メニュー → **拡張機能** → **Apps Script**
2. 以下のコードをコピペして貼り付け：

```javascript
// ========== Google Sheets 同期 API ==========

// スプレッドシートを取得
const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // 後で設定
const ss = SpreadsheetApp.openById(SHEET_ID);

// ========== 記録を追加 ==========
function addRecord(teacherId, studentId, category, memo, date, time) {
    const sheet = ss.getSheetByName(teacherId);
    if (!sheet) {
        return {
            success: false,
            error: 'Sheet not found: ' + teacherId
        };
    }

    sheet.appendRow([studentId, category, memo, date, time]);
    return { success: true };
}

// ========== 全記録を取得 ==========
function getRecords(teacherId) {
    const sheet = ss.getSheetByName(teacherId);
    if (!sheet) {
        return {
            success: false,
            error: 'Sheet not found: ' + teacherId
        };
    }

    const data = sheet.getDataRange().getValues();
    const records = [];

    // ヘッダー行をスキップして、データのみを取得
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0]) { // 最初の列が空でない場合のみ
            records.push({
                studentId: row[0],
                category: row[1],
                memo: row[2],
                date: row[3],
                time: row[4]
            });
        }
    }

    return {
        success: true,
        records: records
    };
}

// ========== 記録を削除 ==========
function deleteRecord(teacherId, memo, time) {
    const sheet = ss.getSheetByName(teacherId);
    if (!sheet) return { success: false };

    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i > 0; i--) {
        if (data[i][2] === memo && data[i][4] === time) {
            sheet.deleteRow(i + 1);
            return { success: true };
        }
    }
    return { success: false };
}

// ========== Web App として公開 ==========
function doPost(e) {
    const action = e.parameter.action;
    const teacherId = e.parameter.teacherId;

    try {
        if (action === 'add') {
            const result = addRecord(
                teacherId,
                e.parameter.studentId,
                e.parameter.category,
                e.parameter.memo,
                e.parameter.date,
                e.parameter.time
            );
            return ContentService.createTextOutput(JSON.stringify(result))
                .setMimeType(ContentService.MimeType.JSON);
        }
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.message
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

function doGet(e) {
    const action = e.parameter.action;
    const teacherId = e.parameter.teacherId;

    try {
        if (action === 'get') {
            const result = getRecords(teacherId);
            return ContentService.createTextOutput(JSON.stringify(result))
                .setMimeType(ContentService.MimeType.JSON);
        }
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.message
        })).setMimeType(ContentService.MimeType.JSON);
    }
}
```

3. **上部の「プロジェクト設定」** をクリック
4. **スクリプト ID** をコピー（後で使用）
5. スプレッドシートの URL から **Sheet ID** をコピー
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
                                        ^^^^^^^^^^^^^^^^
   ```

---

### **Step 3: Google Apps Script をデプロイ**

1. Apps Script に戻る
2. **デプロイ** → **新しいデプロイ**
3. **タイプを選択** → **ウェブアプリ**
4. **実行者** → `自分`
5. **アクセス** → `すべてのユーザー`
6. **デプロイ**
7. **デプロイメント URL** をコピー（以下のような形式）
   ```
   https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/useweb
   ```

---

### **Step 4: 設定ファイルを作成**

`homepage/` フォルダに `sheets-config.js` を作成：

```javascript
// Google Sheets 設定（セットアップ手順参照）
const GOOGLE_SHEETS_CONFIG = {
    // Step 3 で取得したデプロイメント URL
    deploymentUrl: 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/useweb',
    
    // あなたの Google アカウントメール
    ownerEmail: 'your-email@gmail.com'
};
```

---

### **Step 5: 生徒日誌を設定**

生徒日誌が自動的に Google Sheets と同期するようになります。

---

## ✅ 動作確認

1. スマホで生徒日誌を開く
2. 記録を追加
3. Google Sheet を見て、データが追加されているか確認
4. PC で生徒日誌を開く
5. スマホで追加した記録が表示されるか確認

---

## 🔒 セキュリティ注意

- Apps Script のコードには **パスワードやシークレットを含めない**
- Google Sheet は **限定共有** にしてください
  - Share ボタン → 共有相手のメールアドレスを指定

---

## 📞 トラブルシューティング

**Q: 記録が同期されない**
- デプロイメント URL が正しいか確認
- Apps Script のエラーログを確認（Apps Script → 実行ログ）

**Q: 別のシートが見つからない**
- シート名が正確か確認（大文字小文字を区別）
- シートが実際に作成されているか確認

---

完了したら、以下のファイルを修正するので教えてください：
- `sheets-config.js` に設定を記入した
- デプロイメント URL を取得した
