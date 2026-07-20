# 📚 センセイ plus - クラウド同期対応版

教員向けの教育ツール群です。複数デバイス間でのデータ自動同期対応。

---

## 🚀 クイックスタート

### **テスト環境（デモ用）**

1. **GitHub から Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sensei-plus.git
   cd sensei-plus
   ```

2. **homepage を開く**
   ```
   homepage/index.html をブラウザで開く
   ```

3. **ログイン（テスト用）**
   - ID: `test`
   - PW: `1234`

### **本運用環境を構築する場合**

`SETUP_PRODUCTION.md` を参照してください。

以下の手順でセットアップできます：
1. パスワード生成（強力なランダム文字列）
2. auth.js を本運用版に更新
3. Google Sheets 連携を設定
4. GitHub に公開
5. 教員にパスワードを配布

---

## 📱 複数デバイス同期の設定

スマホ・PC・タブレット間でデータを自動同期するには、Google Sheets を設定する必要があります。

### **セットアップ手順**

以下のファイルを参照してください：
```
SETUP_GOOGLE_SHEETS.md ← ★ 最初に読んでください
```

---

## 🔐 セキュリティ

### **パスワード変更**

GitHub に公開する前に、必ず以下を変更してください：

**`homepage/auth.js`**
```javascript
const VALID_TEACHERS = {
    'test': 'ランダムな値に変更',
    'T001': 'ランダムな値に変更',
    'T002': 'ランダムな値に変更'
};
```

### **個人情報について**

- ✅ ブラウザ内でのみ保存（暗号化なし）
- ✅ Google Sheets での保存も同じ（セキュアではない）
- ⚠️ 学生の氏名などの個人情報は自己責任で

---

## 📋 ツール一覧

### **業務ツール**

| ツール | 説明 | 同期対応 |
|--------|------|---------|
| 📔 生徒日誌 | 生徒の様子を記録 | ✅ Google Sheets |
| 🏫 席替えシミュレーター | 最適な座席配置を自動生成 | ❌ |
| 📝 携帯メモツール | 時間割やメモを管理 | ❌ |

### **教育ゲーム**

| ゲーム | 説明 |
|--------|------|
| ⌨️ タイピングゲーム | 日本語タイピング練習 |
| 🈯 漢字学習ゲーム | 漢字の読み方・意味習得 |
| 🇬🇧 英語ゲーム | 英語学習 |
| 🎮 しりとりゲーム | 言葉つなぎゲーム |

---

## 🛠️ 技術スタック

- **フロントエンド**: HTML5 / CSS3 / Vanilla JavaScript
- **認証**: セッションベース（sessionStorage）
- **ストレージ**: localStorage（ローカル）/ Google Sheets（クラウド）
- **デプロイ**: GitHub Pages

---

## 📖 ファイル構成

```
sensei-plus/
├── homepage/
│   ├── index.html          # ホームページ
│   ├── style.css           # ホームページスタイル
│   ├── auth.js             # 認証管理
│   └── sheets-config.js    # Google Sheets 設定
│
├── business/
│   ├── grades/             # 生徒日誌
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── sheets-sync.js  # クラウド同期
│   ├── sekigae/            # 席替え
│   └── memo/               # メモツール
│
├── teaching/
│   ├── timer/              # タイマー
│   ├── seating/            # 座席配置
│   ├── slides/             # スライド作成
│   └── templates/          # 授業案テンプレート
│
├── game/
│   ├── typing/             # タイピングゲーム
│   ├── kanji/              # 漢字ゲーム
│   ├── english/            # 英語ゲーム
│   └── word-game/          # しりとりゲーム
│
└── SETUP_GOOGLE_SHEETS.md  # クラウド同期セットアップガイド
```

---

## 🚀 GitHub Pages でホスト

1. **GitHub にリポジトリを作成**
   ```
   repository: your-username/sensei-plus
   ```

2. **settings → Pages → Source: main ブランチ**

3. **以下の URL でアクセス可能**
   ```
   https://your-username.github.io/sensei-plus/homepage/
   ```

---

## ⚠️ 注意事項

### **クライアント側のみの実装**

このアプリケーションはフロントエンドのみです。以下の点にご注意ください：

- パスワードはコードに記載（環境変数化推奨）
- ネットワークを通じて送信される際も暗号化なし
- バックエンド認証なし（ブラウザのみ検証）

### **本運用前に**

- [ ] パスワードを変更
- [ ] Google Sheets 共有設定を確認
- [ ] Google Apps Script のアクセス権限を確認
- [ ] README に "Demo/Test" と明記

---

## 📞 サポート

問題が発生した場合：

1. **コンソール（F12）でエラーを確認**
2. **SETUP_GOOGLE_SHEETS.md の FAQ を確認**
3. **個別の問題があれば Issue を作成**

---

## 📝 ライセンス

MIT License

---
## 🎯 本運用環境について

### **テスト環境 vs 本運用環境**

| 項目 | テスト環境 | 本運用環境 |
|------|-----------|----------|
| **パスワード** | 簡単（1234） | 強力（ランダム） |
| **対応人数** | 3 人（固定） | 複数対応 |
| **Google Sheets** | 設定必須 | 設定必須 |
| **サポート** | セルフサービス | 管理者対応 |

### **本運用の準備**

詳細は `SETUP_PRODUCTION.md` を参照してください。

主な手順：
1. `SETUP_PRODUCTION.md` を開く
2. パスワードを生成（ツール付属）
3. auth.js を更新
4. Google Sheets を設定
5. GitHub に公開
6. 教員に URL とパスワードを配布

### **パスワード生成ツール**

本運用用の強力なランダムパスワードを生成できます：

```javascript
// ブラウザのコンソール（F12）で実行
generateAllCredentials();
```

詳細は `tools/password-generator.js` を参照してください。

---

## ⚠️ 本運用時の注意事項

- [ ] パスワードはテスト用から変更必須
- [ ] Google Sheets を設定してください
- [ ] HTTPS でアクセスしてください
- [ ] 定期的にパスワードを変更してください
- [ ] GitHub に .gitignore で機密ファイルを除外してください

---
## 🎯 今後の予定

- [ ] バックエンド認証の実装
- [ ] データ暗号化
- [ ] 複数ユーザーの招待機能
- [ ] レポート出力機能
- [ ] モバイルアプリ化

---

**Happy Teaching! 🍎**
