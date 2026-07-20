# 本運用用セットアップガイド

このガイドに従って、本運用環境を準備します。

---

## 🚀 本運用セットアップ手順

### **Phase 1: 認証情報を確定**

#### **Step 1-1: パスワード生成**

1. ブラウザを開く（ローカル開発環境）
2. 開発者ツール（F12）を開く
3. コンソールに以下を貼り付け：

```javascript
// password-generator.js が読み込まれている場合
generateAllCredentials();
```

#### **Step 1-2: パスワードを記録**

出力された以下の情報を記録：

```
VALID_TEACHERS = {
    'test': 'xxxxxxxxxx',
    'T001': 'xxxxxxxxxx',
    'T002': 'xxxxxxxxxx'
}
```

---

### **Phase 2: auth.js を更新**

#### **Step 2-1: 本運用版パスワードで更新**

`homepage/auth.js` を開いて、以下を変更：

**変更前：**
```javascript
const VALID_TEACHERS = {
    'test': '1234',
    'T001': 'pass001',
    'T002': 'pass002'
};
```

**変更後：**
```javascript
const VALID_TEACHERS = {
    'test': 'aB3cD5eF#gH@iJ9kL',
    'T001': 'mN7pQ$rS!tU2vW%xY',
    'T002': 'zB4cD6eF#gH@iJ9kL'
};
```

#### **Step 2-2: テスト**

各パスワードでログインを試す：
```
ID: test / PW: aB3cD5eF#gH@iJ9kL
ID: T001 / PW: mN7pQ$rS!tU2vW%xY
ID: T002 / PW: zB4cD6eF#gH@iJ9kL
```

✅ すべてログイン成功 → 次へ

---

### **Phase 3: 教員にパスワードを配布**

#### **推奨方法 1: セキュアメール**

```
件名: 【重要】センセイplus ログイン情報

本運用が開始されました。
以下の情報でログインしてください。

教員 ID: T001
パスワード: mN7pQ$rS!tU2vW%xY

URL: https://your-username.github.io/sensei-plus/homepage/

⚠️ 注意：
- このメールは削除してください
- パスワードは他の人に教えないでください
```

#### **推奨方法 2: 直接配布**

面対面で以下を配布：
- ID / パスワード カード
- セットアップガイド

#### **推奨方法 3: 初期化セッション**

最初に全員で集まって：
1. 一緒にログイン
2. 初期パスワードを配布
3. 初回設定をサポート

---

### **Phase 4: Google Sheets を設定**

`SETUP_GOOGLE_SHEETS.md` を参照して以下を実行：

1. **Google Sheet を作成**
   - 名前: `sensei-plus-data`
   - シート: `test`, `T001`, `T002`

2. **Google Apps Script を配置**
   - デプロイメント URL を取得

3. **デプロイメント URL を設定**
   - `homepage/sheets-config.js` に記入

---

### **Phase 5: GitHub に公開**

#### **Step 5-1: リポジトリを作成**

```bash
cd ~/sensei-plus

# Git 初期化
git init
git add .
git commit -m "chore: production release v1.0"

# GitHub にプッシュ
git remote add origin https://github.com/YOUR_USERNAME/sensei-plus.git
git branch -M main
git push -u origin main
```

#### **Step 5-2: GitHub Pages を有効化**

1. GitHub リポジトリ → **Settings**
2. **Pages** → **Source: main ブランチ**
3. **Save**

#### **Step 5-3: 公開 URL を確認**

```
https://YOUR_USERNAME.github.io/sensei-plus/homepage/
```

#### **Step 5-4: 教員に URL を通知**

```
【新システムが開始されました】

URL: https://your-username.github.io/sensei-plus/homepage/

ID と PW は別途お知らせします。

機能：
- 📔 生徒日誌（複数デバイス同期）
- 🎮 教育ゲーム
- ⚙️ 業務ツール
```

---

## 📋 チェックリスト

### **公開前**
- [ ] パスワード生成（強力なランダム文字列）
- [ ] auth.js を更新
- [ ] 各教員でテストログイン
- [ ] Google Sheets のデプロイメント URL を取得
- [ ] sheets-config.js に URL を記入
- [ ] 教員にパスワードを配布
- [ ] README を確認

### **公開後**
- [ ] GitHub に公開
- [ ] GitHub Pages で動作確認
- [ ] 教員に URL を通知
- [ ] 初期サポート体制を準備

---

## 🔐 セキュリティ設定

### **必ずやること**

1. **本運用版パスワードに変更**
   - テスト用（1234 など）から変更

2. **GitHub に .gitignore 設定**
   ```
   # 本番環境の設定
   .env
   credentials.json
   secrets.js
   ```

3. **Google Apps Script のアクセス権を確認**
   - 公開範囲は「限定公開」

4. **README に警告を追記**
   ```markdown
   ## ⚠️ 本番環境のお知らせ
   
   - クライアント側のみの認証です
   - パスワードは HTTPS で送信してください
   - 個人情報の記録は自己責任で
   ```

---

## 📞 本運用後のサポート

### **教員からの問い合わせ対応**

| 問題 | 対応 |
|------|------|
| ログインできない | パスワードをリセット → auth.js 更新 |
| データが同期されない | ネット接続確認 → Google Sheets 確認 |
| パスワードを忘れた | 新しいパスワード生成 → メール送信 |

### **定期メンテナンス**

- **月 1 回**: パスワード変更（セキュリティ向上）
- **週 1 回**: Google Sheets のバックアップ
- **随時**: エラーログの確認

---

## ✅ 完了の目安

すべて完了したら：

```
✅ パスワード生成完了
✅ auth.js 更新完了
✅ 教員にパスワード配布完了
✅ Google Sheets セットアップ完了
✅ GitHub に公開完了
✅ 教員全員がログインテスト完了

🎉 本運用開始！
```

---

**質問や問題があれば、いつでもサポートします！**
